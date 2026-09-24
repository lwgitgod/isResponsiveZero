# isResponsiveZero

A small Next.js app for a first pass at document review:

1. **Rubric builder.** Paste a complaint and the Requests for Production (RFPs). DeepSeek writes a responsiveness rubric: for each RFP, a yes/no question, what it covers, near-misses it does not cover, and criteria. The rubric also includes a list of document categories. You can edit the rubric as JSON in the browser and download it.
2. **Folder classifier.** Pick a local folder. Each file goes to the server one at a time (3 in flight). The server pulls the text out in memory and asks TypeSafe Jev two things: which RFPs the document answers, and what kind of document it is. Results stream into a table, and you can download them as CSV or JSON.

Nothing is saved on the server. There is no database, no login and no queue.

## Run

```
cd isResponsiveZero
npm install
npm run build && npm start        # http://localhost:3100   (or: npm run dev)
```

## Environment (`.env.local`, server-side only, never `NEXT_PUBLIC_`)

| Variable | Used by | Source |
|---|---|---|
| `TYPESAFE_API_KEY` | `/api/classify` (Jev) | same key as `_DocClassify_MVP/.env` |
| `DEEPSEEK_API_KEY` | `/api/rubric` (DeepSeek) | same key as `_DocClassify_MVP/.env` |

## Architecture

- `app/page.tsx`: the single page (the rubric builder and the folder table).
- `app/api/rubric/route.ts` → `lib/deepseek.ts`: calls DeepSeek `deepseek-chat` at `https://api.deepseek.com/chat/completions` in JSON mode with temperature 0. The prompt and checks are in `lib/rubric.ts`, a simplified TypeScript port of `RUBRIC_GOLD/rubric_web_prompt.md` and the gates in `RUBRIC_GOLD/validate_rubric.py`.
- `app/api/classify/route.ts` → `lib/extract.ts` (turns the file into text in memory) → `lib/jev.ts` (calls Jev at `POST https://api.typesafe.ai/v1/systemone`).
  - The Jev request sends the first 12,000 characters of the document plus a short case summary.
  - It asks one yes/no question per RFP, which returns a probability.
  - It asks one pick-one question over the document categories.
  - A document is **Responsive** when any RFP's probability is 0.5 or higher. A category whose probability is below 0.4 is shown as "low confidence". The model (`jev-latest`), the 12,000-character excerpt and the 0.4 threshold come from `_DocClassify_MVP/config/settings.json`.
- Supported file types: txt, md, csv, pdf, docx, doc, rtf, eml, emlx, html, xls, xlsx, ods, odt, pages, numbers, key.
  - pages, numbers and key are read only through the preview PDF inside the file.
  - A file whose name starts with `_` is skipped.
  - A file that can't be read is logged as "skipped" with a reason, and the run continues.

## Test data and end-to-end check

```
npm run gen-data                 # 150 synthetic .md files -> test-data/, answer key -> test-data-key/answer_key.json
npm start                        # in another terminal
npx tsx scripts/run-e2e.ts       # add --reuse-rubric to skip regenerating the rubric
```

`run-e2e.ts` sends requests to the same two routes the UI uses. It writes these files to `test-data-key/`:

- `rubric.generated.json`
- `results.json`
- `score.json`: precision, recall, F1 and category accuracy against the answer key.
