# isResponsiveZero: test report (2026-09-24)

## Commands run and what they showed

| Step | Command | Result |
|---|---|---|
| Install | `npm install` | ok. TypeScript is pinned to 5.x because Next 15 does not work with TypeScript 7. |
| Type check | `npx tsc --noEmit` | no errors |
| Build | `npm run build` | "Compiled successfully". Routes: `/` (static), `/api/rubric`, `/api/classify` |
| Test data | `node scripts/gen-test-data.mjs` | "wrote 150 files to test-data/ (80 responsive, 70 not) and test-data-key/answer_key.json" |
| Server | `npm start` (port 3100) | `GET /` returns 200 |
| End to end | `npx tsx scripts/run-e2e.ts` | see the next two sections |
| Bad input | `POST /api/rubric` with `{}` | 400 `{"error":"complaint and at least one RFP are required."}` |
| Key leak | grep `.next/static` for each key value and each env var name | **0 hits** for both the Jev and DeepSeek keys. 0 hits for the Anthropic key prefix anywhere in the app. |

## Rubric generation (real DeepSeek call)

The server log line was `[rubric] model=deepseek-flash ms=17509 issues=0`. The model name DeepSeek reported back is `deepseek-flash`, even though the request asked for `deepseek-chat`.

- All 10 RFPs came back, `RFP_01` to `RFP_10`.
- All 10 required document categories came back with their exact names.
- The rubric passed every validation check in `lib/rubric.ts` (0 problems).
- It is saved at `test-data-key/rubric.generated.json`.

## Classification of the 150 files (real Jev calls, through `/api/classify`)

| Measure | Value |
|---|---|
| Files classified | 150 of 150, with 0 errors and 0 skipped |
| Correctly flagged responsive / wrongly flagged responsive / missed responsive / correctly not flagged | 76 / 0 / 4 / 70 |
| Precision (share of flagged files that really are responsive) | **1.000** |
| Recall (share of responsive files that were flagged) | **0.950** |
| F1 (combined score of precision and recall) | **0.974** |
| Category accuracy (exact category name match) | **0.800** |
| Correctly flagged files where at least one returned RFP matches the answer key | 76 / 76 |
| Wall-clock time for 150 files at 3 in flight | 8 s |

How much of each kind of document was flagged responsive:

- strong: 30 of 30
- medium: 30 of 30
- weak: 16 of 20
- irrelevant: 0 of 70

All 4 missed documents are the same weak template, `*_accountant_voicemail.md`. It is a one-line voicemail asking for bank statements, and Jev gave it a probability between 0.05 and 0.07. It is arguably not responsive at all, because it does not itself reflect any funds.

The category mistakes, with counts:

- Personal or Social Communication → Email or Message: 11
- Bank Statement or Transaction Record → Accounting Record or Financial Statement: 7 (all are the other company's bank statement)
- Other Business Document → Email or Message: 6
- Accounting Record or Financial Statement → Other Business Document: 4
- Personal or Social Communication → None of the above: 2

Most of these mistakes come from categories that overlap. A chat message can be both "Email or Message" and "Personal or Social Communication".

## Known limits and what is broken

- **UI not exercised in a browser.** The Chrome extension was not connected ("Browser extension is not connected"). I only checked that the served HTML contains the complaint box, the RFP boxes with Request 10, the Generate rubric, Load sample and Pick folder controls, and the folder input (`webkitdirectory`). The script calls the same routes with the same multipart form the page sends.
- **Only .md tested.** The PDF, DOC, DOCX, XLS, ODT, iWork and email extractors were built but not run on real files.
- **Easy test data.** The 150 files come from 30 templates, so these scores are much easier than real documents would be.
- **Placeholder names.** The sample complaint box adds a "Parties" mapping (`[COMPANY NAME]` = Brightline Ventures, Inc., `[PERSON A]` = Alex Rivera, `[PERSON B]` = Jordan Blake) so that the rubric uses the names that appear in the test documents.
