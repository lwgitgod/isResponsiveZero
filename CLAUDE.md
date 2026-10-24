# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A stateless Next.js 15 (App Router, React 19, TypeScript strict) app for first-pass legal document review. Step 1 turns a complaint plus Requests for Production (RFPs) into a responsiveness rubric (DeepSeek). Step 2 classifies each file in a user-picked folder against that rubric (TypeSafe Jev). No database, no auth, no queue, nothing written to disk on the server.

## Commands

```
npm install
npm run dev            # next dev on http://localhost:3100
npm run build && npm start   # production build, also port 3100
npm run typecheck      # tsc --noEmit
npm run gen-data       # regenerate 150 synthetic .md files in test-data/ + test-data-key/answer_key.json
npx tsx scripts/run-e2e.ts [--reuse-rubric] [--base http://localhost:3100]
```

- There is no linter and no unit-test framework. The only automated check is `scripts/run-e2e.ts`, which needs the server already running (`npm start` in another terminal) and real API keys. It posts to `/api/rubric` and `/api/classify`, then writes `rubric.generated.json`, `results.json` and `score.json` (precision, recall, F1, category accuracy) into `test-data-key/`. `--reuse-rubric` skips the DeepSeek call if `rubric.generated.json` exists.
- `npm run e2e` is the same script without flags. To pass flags use `npx tsx scripts/run-e2e.ts ...`.
- `gen-test-data2-part*.mjs` in `scripts/` are a second data generator that has no npm script.
- Keys go in `.env.local` (gitignored, server-side only, never `NEXT_PUBLIC_`): `TYPESAFE_API_KEY` for `/api/classify`, `DEEPSEEK_API_KEY` for `/api/rubric`.
- TypeScript is deliberately pinned to 5.x; Next 15 does not work with TypeScript 7.

## Architecture

Two independent flows share one rubric JSON object, which lives only in the browser (React state in `app/page.tsx`, mirrored to `localStorage`) and is re-sent with every classify request.

**Rubric flow:** `app/page.tsx` → `POST /api/rubric` (`app/api/rubric/route.ts`) → `lib/deepseek.ts` (`deepseek-chat`, JSON mode, temperature 0) using `RUBRIC_SYSTEM_PROMPT` and `buildRubricUserPrompt` from `lib/rubric.ts`. The route returns `{ rubric, issues, model }`; `issues` comes from `validateRubric` in the same file. The user can edit the rubric as JSON in the UI before using it.

**Classify flow:** the browser sends files one at a time, 3 in flight (`CONCURRENCY` in `app/page.tsx`), as multipart form (`file` + `rubric` string) to `POST /api/classify`. The route:
1. re-runs `validateRubric` (422 on failure),
2. extracts text in memory with `lib/extract.ts` (switch on file extension; unsupported or unreadable files return `status: "skipped"` with a note rather than failing the run),
3. calls `classifyWithJev` in `lib/jev.ts`.

`lib/jev.ts` sends one request to `https://api.typesafe.ai/v1/systemone` containing, per document: one yes/no "noul" question per RFP id in `rubric.expected_rfp_ids` (built from each RFP's `question`, `rfp_text_verbatim`, `covers`, `not_for`) and one "choice" question over `rubric.document_categories` plus the no-match label. Behaviour that is easy to break:
- Only the first `EXCERPT_CHARS` (12,000) characters of a document are sent.
- A document is Responsive when any RFP probability is >= `RESPONSIVE_THRESHOLD` (0.5); `rfps` lists every RFP at or above it.
- A category with probability < `CATEGORY_CONFIDENCE_THRESHOLD` (0.4) is flagged `category_low_confidence`.
- 429 and 529 responses are retried up to 4 times with exponential backoff.
- Files whose names start with `_` are skipped by the e2e script (and by the UI per the README).

`validateRubric` in `lib/rubric.ts` is the contract between the two flows. If you change the rubric shape (`Rubric` interface) or the DeepSeek prompt, update `validateRubric` and `buildQuestions` in `lib/jev.ts` together. The README says `lib/rubric.ts` is a simplified port of `RUBRIC_GOLD/rubric_web_prompt.md` and `RUBRIC_GOLD/validate_rubric.py`, and that the Jev settings come from `_DocClassify_MVP/config/settings.json`; neither of those paths exists in this repo.

`next.config.mjs` lists the document parsers (`unpdf`, `mammoth`, `word-extractor`, `xlsx`, `jszip`) under `serverExternalPackages`; add any new server-side parser there. `lib/sample.ts` holds the sample complaint and RFPs used by the "Load sample" button and the e2e script. Its "Parties" mapping (`[COMPANY NAME]`, `[PERSON A]`, `[PERSON B]`) must match the names in `test-data/`.

## Testing caveats (from TEST_REPORT.md)

- Only `.md` files have been run through the extractors; PDF, DOC, DOCX, XLS, ODT, iWork and email extraction are untested on real files.
- The UI has not been exercised in a browser; only the API routes were tested.
- The 150 synthetic documents come from 30 templates, so the reported scores (F1 0.974, category accuracy 0.800) are optimistic.
- DeepSeek reports its model as `deepseek-flash` even though the request asks for `deepseek-chat`.
