---
name: pr-review
description: Audit a GitHub pull request from a URL (e.g. https://github.com/RossBrod/CoreAPI/pull/49). Fetches the PR via `gh`, audits the diff against this workspace's conventions (CoreAPI/CoreUI Prime Directives, PR target=dev rule, sub-project CLAUDE.md rules), and reports findings grouped by severity. Use when the user pastes a GitHub PR URL and asks for a review/audit, or types `/pr-review <url>`. Distinct from the project-local `pr-review` skill (which does spec-vs-diff coverage analysis) and the built-in `/review` (which reviews the current branch).
---

# pr-review

Audit a GitHub pull request given its URL. Output is a structured review grouped by severity, tailored to this workspace's conventions.

**Sibling skills — pick the right one:**

- `/pr-review <url>` (this skill): URL-based diff audit against Prime Directives, PR hygiene, and sub-project CLAUDE.md conventions. Use when you have a URL and want a quality/safety check.
- `/pr-review` (CoreAPI-local): spec-vs-diff coverage analysis — grades each requirement Met/Partial/Missing. Use when you have a spec/PRD/ticket and want to know if the PR fulfills it.
- `/review` (built-in): reviews the PR for the current branch. Use when you're already on the branch.

## Inputs

A GitHub PR URL is required. Accept any of these shapes:

- `https://github.com/<owner>/<repo>/pull/<number>`
- `<owner>/<repo>#<number>` (e.g. `RossBrod/CoreAPI#49`)
- A bare number when the cwd is inside the matching repo

If the user supplies no URL, ask once for it. Do not guess.

## Procedure

### 1. Fetch the PR

Run these in parallel — they are independent:

- `gh pr view <url> --json number,title,author,baseRefName,headRefName,state,isDraft,body,additions,deletions,changedFiles,labels,reviews,statusCheckRollup,url`
- `gh pr diff <url>`
- `gh pr view <url> --json files --jq '.files[].path'`

If `gh` errors (auth, not found, private repo), surface the error verbatim and stop — do not fabricate a review.

### 2. Determine which repo and load its CLAUDE.md

From the URL, identify the repo (`CoreAPI`, `CoreUI`, `contracts`, etc.). Each sub-project in this workspace has its own `CLAUDE.md` at `C:\Users\rossb\OneDrive\Desktop\ClaudeWork\__MERGE\<repo>\CLAUDE.md`. Read it before reviewing — its rules override your defaults. Also re-read the solution-root `CLAUDE.md` for the Prime Directives.

If the matching local checkout is not present, note that in the review and proceed using only the diff.

### 3. Audit checks

Run these checks against the diff. Flag any violation.

**Prime Directive (solution-wide, non-negotiable):**

- No code that connects to `*.postgres.database.azure.com` from app code or scripts.
- No new imports of `azure.keyvault.secrets`, `@azure/keyvault-secrets`, or runtime calls to a Key Vault SDK. Secrets must still come from env vars / `secrets.*.env` / App Service Application Settings.

**PR hygiene:**

- `baseRefName` must be `dev` (not `main`/`master`). If it targets `main`, flag as **High** — promote-to-main is the user's call, not a hotfix path.
- Draft + no description + many changed files → flag as **Low** (hard to review).
- CI status: if `statusCheckRollup` shows failures, list them.

**Project conventions** — apply whichever sub-project's `CLAUDE.md` matches the repo. Common items to look for:

- CoreAPI: FastAPI patterns, secrets loading, testing patterns documented in `CoreAPI/CLAUDE.md`.
- CoreUI: Next.js App Router, bulletproof-react API query pattern (4 parts), Material-UI v2, 3-layer page pattern.

**Correctness / safety:**

- SQL injection, command injection, XSS, unescaped template interpolation.
- Auth/session changes — call out explicitly and ask for human verification.
- Migrations that add NOT NULL columns without a backfill default on tables likely to be large.
- New dependencies — flag and note license if visible in the diff.

**Reuse / simplification:**

- Duplicate logic that already exists elsewhere in the repo (when the local checkout is available, grep for it before claiming duplication).
- Over-abstraction (premature factory/strategy patterns for a single caller).

### 4. Output format

Produce a single markdown report with these sections, in this order. Omit sections that are empty rather than padding them.

```
# PR Review — <owner>/<repo>#<number>: <title>

**Author:** <login>  **Base:** <baseRefName> ← **Head:** <headRefName>
**Files:** <changedFiles>  **+<additions> / -<deletions>**  **State:** <state><, draft if draft>
**URL:** <url>

## Summary
<2-4 sentence plain-English description of what the PR does, derived from diff + title + body.>

## Blockers (must fix before merge)
- ...

## High
- ...

## Medium
- ...

## Low / nits
- ...

## Tests
<Were tests added/changed? Do they cover the new behavior? Any obvious gaps?>

## Verdict
<One of: APPROVE / REQUEST CHANGES / COMMENT — and one sentence why.>
```

Every finding must include:

- The file path and approximate line range (from the diff).
- A one-line description of the problem.
- Why it matters (link to the rule it violates if a Prime Directive or CLAUDE.md rule).
- A concrete suggested fix when obvious.

### 5. What NOT to do

- Do not post comments to GitHub. This skill is read-only. If the user wants inline comments, point them at `/code-review --comment` on the local checkout.
- Do not run tests, builds, or any command beyond `gh` reads.
- Do not check out the branch, modify files, or run linters.
- Do not invent findings to pad the review. If the PR is clean, say so and recommend APPROVE.
- Do not summarize the diff line-by-line. The summary section is high-level; details belong in findings.

## Examples

User: `/pr-review https://github.com/RossBrod/CoreAPI/pull/49`
→ Fetch PR 49 from `RossBrod/CoreAPI`, read `CoreAPI/CLAUDE.md`, produce the report.

User: `audit RossBrod/CoreUI#127`
→ Same flow against `CoreUI`, using `CoreUI/CLAUDE.md`.

User: pastes a URL with no other instruction
→ Treat as an implicit invocation of this skill; produce the report.
