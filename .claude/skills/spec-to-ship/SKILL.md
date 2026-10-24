---
name: "spec-to-ship"
description: "Turn a tech spec into a fully detailed backlog for item-by-item review, then build approved items with maximum parallel agents in worktrees, with review and merge."
---
 
# Spec to Ship
 
Two phases with a human gate between them.
 
- **plan**: spec in, fully detailed backlog out. Every item is written complete (goal, details, files, dependencies, acceptance criteria, verify command) the moment it is created. Then stop for review.
- **run**: approved items only. One dynamic workflow schedules every item by dependency at maximum concurrency, each in its own worktree, with a test gate, an independent review and a serialized merge into an integration branch.
You are the COORDINATOR. Subagents write the backlog and the code. You read, check, schedule, launch and report. You never write product code yourself.
 
## Invocation
 
- `/spec-to-ship plan <spec.md>`: Phase 1
- `/spec-to-ship run <backlog.md>`: Phase 2
- `/spec-to-ship <path>`: if the file contains backlog items with `status:` lines, run. Otherwise plan.
- "approve all" on a backlog: set every `status: draft` to `status: approved`, then stop. Do not run unless asked.
Invoking the run phase is the user's opt-in to a large multi-agent Workflow. Do not ask again, and ignore the workflow size guideline: this skill calls for one build agent per approved item plus review and merge agents.
 
## Naming
 
- `dir` = folder of the spec. `base` = spec filename minus `-spec.md`, or minus `.md`.
- Backlog: `[dir]/[base]-backlog.md`. Run log: `[dir]/[base]-run.md`.
- Never overwrite on creation. If the path exists, use `-v2`, `-v3`, and so on. Report the exact path chosen.
- The only in-place edits allowed are the user's own edits and the `status:` lines this skill updates after a run.
## Phase 1: plan
 
### 1. Gather context (read only)
 
- Read the spec in full. Read CLAUDE.md.
- Find the per-area test commands (pyproject / pytest config, package.json scripts) and the full-suite command.
- Find the design doc, first hit wins: `SPEC/design.md`, `docs/design.md`, `docs/design-system.md`, `design/README.md`. None found while the spec has frontend work: warn in the summary.
- Map the parts of the repo the spec touches so items name real paths. On a large repo, use an Explore subagent for this.
### 2. Write the backlog
 
Dispatch the `TECH-full-stack-architect` subagent (fallback: `general-purpose`) with the spec path, the context from step 1, the item template and the decomposition rules below. It writes the backlog file.
 
Large spec with independent sections: split by section across parallel architect agents, each owning an ID range (BL-100, BL-200, ...), then one consolidation agent resolves cross-section dependencies and shared files. One backlog file comes out.
 
**Item template.** Every field is required. Write it complete the first time.
 
```markdown
### BL-001 · Short imperative title
status: draft
depends_on: []
files: [backend/app/intake/service.py, backend/tests/intake/test_service.py]
frontend: false
verify: uv run pytest backend/tests/intake/test_service.py
spec_ref: §3.2
 
**Goal:** One sentence: what exists after this item that did not before.
 
**Details:** What to build. Interfaces, function signatures, data shapes, endpoints, edge cases, existing code to reuse (with paths). Enough that an engineer with only this item, the spec and the repo can build it without asking.
 
**Acceptance criteria**
- [ ] Observable, testable outcome
- [ ] ...
 
**Out of scope:** What a reasonable engineer might add but must not.
```
 
**Decomposition rules.** These decide how fast phase 2 runs.
 
1. One item = one agent run: one concern, about 8 files or fewer, tests included in the same item. No separate "write tests" items, no catch-all "integration" item.
2. Maximize width. Prefer many file-disjoint items over a few big ones. Add a dependency only when an item truly needs another item's code.
3. Contracts first. Shared types, API schemas, DB models and interfaces go in small early items so dependents can build against them in parallel.
4. Hot files have exactly one owner. Dependency manifests and lockfiles (`package.json`, `pnpm-lock.yaml`, `pyproject.toml`, `uv.lock`), Alembic migrations, route registries, barrel `index.ts` files, shared settings: one item owns each, and items that need it depend on that item. Put all new packages in one early "dependencies" item.
5. Two items with no dependency path between them must not list the same file. If they must, add the dependency or merge the items.
6. `verify` runs only that item's tests and finishes fast.
7. Every spec requirement maps to at least one item via `spec_ref`. Never invent requirements. Ambiguities go in an `## Open questions` section at the end of the backlog, not into items.
### 3. Review and tighten
 
Dispatch an agent that uses the `/mr-obviously` skill (fallback: a fresh `general-purpose` agent with the same brief) to review the backlog against the spec for: bloat and verbosity, deviations from the spec, items too large for one agent run, vague acceptance criteria, missing spec coverage, unnecessary dependencies. Send the findings back to the architect, who applies them to the backlog file.
 
### 4. Coordinator checks (do these yourself)
 
- Every item has every template field. Every `depends_on` id exists. No cycles.
- Shared-file hazards (rule 5): send back to the architect once. List anything left.
- Compute dependency levels, max width and critical path. Append to the backlog:
```markdown
## Execution preview
Items: 18 · Max width: 9 · Critical path: BL-001 > BL-004 > BL-011 (3 steps)
Level 0: BL-001, BL-002, BL-003
Level 1: BL-004, BL-005, ...
Shared-file hazards: none
Spec coverage gaps: none
Design doc: SPEC/design.md
Full-suite command: uv run pytest && pnpm -r test
```
 
### 5. Stop for review
 
Reply with exactly:
 
```
Backlog: <path>
Items: <n> · Max width: <w> · Critical path: <k> steps
Open questions: <n> · Hazards: <n> · Coverage gaps: <n>
 
Review each item and set status: approved or rejected (edit anything you like).
Then: /spec-to-ship run <path>   (or say "approve all")
```
 
If the user asks to review in chat, walk the items in batches of up to 4 with AskUserQuestion (approve / reject / needs edit) and write each answer to that item's `status:` line.
 
## Phase 2: run
 
### 1. Preflight
 
- Re-read the backlog from disk. The user may have edited it.
- An item counts as merged if its status is `merged`, or if `git log feat/[base] --oneline` shows `Merge BL-xxx:` or `BL-xxx:` for it. This makes an interrupted run safe to rerun.
- Select items with `status: approved` that are not merged. Report rejected and draft items as not run.
- Drop dependencies on merged items (their code is already on the integration branch). Exclude and report any approved item that depends on an item that is neither merged nor approved.
- Sort the selected items in dependency order.
- Git: the working tree must be clean. If not, stop with one line. Create `feat/[base]` from the current branch, or check it out if it exists. Record `baseCommit` with `git rev-parse HEAD`.
- Concurrency: the runtime runs up to 16 agents at once (fewer on machines with fewer CPUs). If max width is higher and `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS` is unset or lower, tell the user once that adding `"env": {"CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS": "<width>"}` to `.claude/settings.json` and restarting raises the cap. Then continue. Do not block.
- Permissions: agents need Edit, Write and Bash (git, pnpm, uv, pytest). In Manual permission mode, say once that a long run will stall on prompts unless those are allowed or auto mode is on.
### 2. Launch
 
Call the Workflow tool with the script below verbatim and these `args` (a JSON object, not a string):
 
```json
{
  "project": "Legawrite.AI <feature>",
  "spec": "<spec path>",
  "backlog": "<backlog path>",
  "integrationBranch": "feat/<base>",
  "baseCommit": "<sha>",
  "testCommand": "<full-suite command>",
  "designDoc": "<path, or empty string>",
  "implAgent": "TECH-full-stack-architect",
  "maxRetries": 1,
  "tickets": [
    { "id": "BL-001", "title": "...", "depends_on": [], "files": ["..."], "frontend": false, "verify": "...", "body": "<the full item markdown, verbatim>" }
  ]
}
```
 
Set `implAgent` to an empty string if that agent does not exist in the repo.
 
What the script does:
 
- Each item starts the moment its dependencies are merged. No waves, no barriers.
- Items that share a file (rare after rule 5) run one after the other, in backlog order.
- Each item: build in its own worktree (only when more than one item runs), its `verify` must pass, a fresh reviewer checks the diff against the acceptance criteria, then merge into the integration branch, one merge at a time.
- On test failure, review gaps or merge conflict: one retry with that feedback. On a blocker: one `/mr-wolff` consult first, which does not use up the retry.
- Dependents of an item that did not merge are skipped, not attempted.
- At the end: full suite on the integration branch, with up to 3 fix rounds.
```js
export const meta = {
  name: 'spec-to-ship-run',
  description: 'Build approved backlog items in parallel by dependency, review each diff, merge into the integration branch',
  phases: [
    { title: 'Build', detail: 'one agent per item, own worktree when parallel' },
    { title: 'Review', detail: 'fresh agent checks each diff against its acceptance criteria' },
    { title: 'Merge', detail: 'one merge at a time into the integration branch' },
    { title: 'Final', detail: 'full suite on the integration branch' },
  ],
}
 
const A = args
const T = A.tickets
const MAX_ATTEMPTS = 1 + (A.maxRetries ?? 1)
const isolate = T.length > 1
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_')
const verifyCmd = t => t.verify || A.testCommand
const deps = t => t.depends_on || []
 
const RESULT = {
  type: 'object',
  required: ['status', 'branch', 'summary'],
  properties: {
    status: { type: 'string', enum: ['done', 'failed', 'blocked'] },
    branch: { type: 'string' },
    tests_passed: { type: 'boolean' },
    test_output_tail: { type: 'string' },
    files_changed: { type: 'array', items: { type: 'string' } },
    blocker: { type: 'string' },
    summary: { type: 'string' },
  },
}
const VERDICT = {
  type: 'object',
  required: ['pass', 'gaps'],
  properties: { pass: { type: 'boolean' }, gaps: { type: 'array', items: { type: 'string' } } },
}
const MERGE = {
  type: 'object',
  required: ['merged'],
  properties: { merged: { type: 'boolean' }, conflicts: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } },
}
const WOLFF = {
  type: 'object',
  required: ['resolved', 'guidance'],
  properties: { resolved: { type: 'boolean' }, guidance: { type: 'string' } },
}
const FINAL = {
  type: 'object',
  required: ['passed'],
  properties: { passed: { type: 'boolean' }, output_tail: { type: 'string' }, fixes: { type: 'array', items: { type: 'string' } } },
}
 
// Every dependency must be in this run and listed earlier.
const pos = {}
T.forEach((t, i) => { pos[t.id] = i })
const orderErrors = []
T.forEach((t, i) => deps(t).forEach(d => {
  if (!(d in pos)) orderErrors.push(`${t.id} depends on ${d}, which is not in this run`)
  else if (pos[d] >= i) orderErrors.push(`${t.id} depends on ${d}, which comes later in the list`)
}))
if (orderErrors.length) return { error: 'invalid ticket order', orderErrors }
 
const header = (t, i) => [
  `You are implementing backlog item ${t.id} of ${A.project}. Spec: ${A.spec}. Backlog: ${A.backlog}.`,
  isolate
    ? `You are in your own git worktree. First run: git merge --no-edit ${A.integrationBranch}`
    : `You are working directly on ${A.integrationBranch} in the main checkout.`,
  `Edit only the files listed in the item (new test files next to them are fine). If you need any other file, stop and return status "blocked" naming the file and why.`,
  `If dependencies are missing in this checkout, install them first (pnpm install --frozen-lockfile, uv sync).`,
  `If your tests start a server or use a database, use port ${4100 + i} and a database or schema named test_${slug(t.id)} so you do not collide with parallel items.`,
  t.frontend && A.designDoc ? `[frontend] Read ${A.designDoc} before your first edit. Its rules are checked at review.` : '',
  `Done means: ${verifyCmd(t)} passes, and all changes are committed on your branch with the message "${t.id}: ${t.title}". Report the branch from git rev-parse --abbrev-ref HEAD and the tail of the test output.`,
].filter(Boolean).join('\n')
 
const buildPrompt = (t, i, feedback, prevBranch) => [
  header(t, i),
  prevBranch ? `A previous attempt is on branch ${prevBranch}. Start from it: git merge --no-edit ${prevBranch}` : '',
  feedback ? `The previous attempt was rejected. Fix this first:\n${feedback}` : '',
  `--- ITEM ---\n${t.body}`,
].filter(Boolean).join('\n\n')
 
const reviewPrompt = (t, r) => [
  `Review backlog item ${t.id}. Do not edit anything.`,
  isolate ? `Diff: git diff ${A.integrationBranch}...${r.branch}` : `Diff: git diff ${A.baseCommit}..HEAD`,
  `Check that every acceptance criterion below is met and covered by a test, and that nothing outside the item's files changed (new test files next to them are fine).` +
    (t.frontend && A.designDoc ? ` Frontend code must follow ${A.designDoc}.` : ''),
  `Report only gaps that break correctness or a stated criterion. Ignore style and nice-to-haves. pass is true when there are no such gaps.`,
  `--- ITEM ---\n${t.body}`,
].join('\n\n')
 
const mergePrompt = (t, r) => [
  `In the main checkout, on branch ${A.integrationBranch}, run: git merge --no-ff ${r.branch} -m "Merge ${t.id}: ${t.title}"`,
  `Mechanical conflicts (imports, adjacent additions, registries): resolve keeping both sides. Lockfiles: take either side, then regenerate (pnpm install, uv lock). Then run ${verifyCmd(t)} and commit the merge if it passes.`,
  `If a conflict needs a design decision, or the command still fails, run git merge --abort and return merged=false with the conflicting files.`,
  `Leave the main checkout clean and on ${A.integrationBranch}.`,
].join('\n')
 
const wolffPrompt = (t, r) => [
  `Backlog item ${t.id} is blocked: ${r.blocker}`,
  `Use the /mr-wolff skill if it is available. Do not edit code.`,
  `Decide the smallest change that unblocks the item within the spec (${A.spec}). Return resolved=true with concrete guidance the implementer can follow without asking a human, or resolved=false with the exact decision a human must make.`,
  `--- ITEM ---\n${t.body}`,
].join('\n\n')
 
// Merges into the integration branch run one at a time.
let mergeQueue = Promise.resolve()
const enqueueMerge = (t, r) => {
  const p = mergeQueue.then(() =>
    agent(mergePrompt(t, r), { label: `${t.id} merge`, phase: 'Merge', schema: MERGE, effort: 'medium' }))
  mergeQueue = p.catch(() => null)
  return p
}
 
async function runTicket(t, i) {
  let feedback = ''
  let prevBranch = ''
  let consulted = false
  const attempts = []
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const opts = { label: `${t.id} build ${attempt}`, phase: 'Build', schema: RESULT }
    if (isolate) opts.isolation = 'worktree'
    if (A.implAgent) opts.agentType = A.implAgent
    const r = await agent(buildPrompt(t, i, feedback, prevBranch), opts)
    if (!r) { feedback = 'The previous agent did not return.'; attempts.push(`${attempt}: no result`); continue }
    if (isolate && r.branch) prevBranch = r.branch
 
    if (r.status === 'blocked') {
      if (consulted) return { id: t.id, status: 'blocked', reason: r.blocker, branch: r.branch, attempts }
      consulted = true
      const w = await agent(wolffPrompt(t, r), { label: `${t.id} wolff`, phase: 'Build', schema: WOLFF })
      if (!w || !w.resolved) return { id: t.id, status: 'blocked', reason: w ? w.guidance : r.blocker, branch: r.branch, attempts }
      feedback = `Blocker resolved. Follow this guidance (it overrides the files list where it says so):\n${w.guidance}`
      attempts.push(`${attempt}: blocked, resolved by consult`)
      attempt-- // the consult does not use up a retry
      continue
    }
 
    if (r.status !== 'done' || r.tests_passed === false) {
      feedback = `Verify failed:\n${r.test_output_tail || r.summary}`
      attempts.push(`${attempt}: tests failed`)
      continue
    }
 
    const v = await agent(reviewPrompt(t, r), { label: `${t.id} review ${attempt}`, phase: 'Review', schema: VERDICT })
    if (v && !v.pass) {
      feedback = `Review gaps:\n- ${v.gaps.join('\n- ')}`
      attempts.push(`${attempt}: review gaps`)
      continue
    }
 
    if (!isolate) return { id: t.id, status: 'merged', branch: A.integrationBranch, reviewed: !!v, attempts }
    const m = await enqueueMerge(t, r)
    if (m && m.merged) return { id: t.id, status: 'merged', branch: r.branch, reviewed: !!v, attempts }
    feedback = `Merging into ${A.integrationBranch} failed. Conflicts: ${m ? (m.conflicts || []).join(', ') : 'merge agent did not return'}. Your first step (merging ${A.integrationBranch}) will surface them. Resolve them in your branch.`
    attempts.push(`${attempt}: merge conflict`)
  }
  return { id: t.id, status: 'failed', branch: prevBranch, reason: feedback, attempts }
}
 
// Dependency scheduling: each item starts when its dependencies have merged
// and any earlier item sharing a file has settled.
const settled = {}
T.forEach((t, i) => {
  const depWaits = deps(t).map(d => settled[d])
  const overlapIds = T.slice(0, i)
    .filter(o => !deps(t).includes(o.id) && o.files.some(f => t.files.includes(f)))
    .map(o => o.id)
  if (overlapIds.length) log(`${t.id} waits for ${overlapIds.join(', ')} (shared files)`)
  settled[t.id] = Promise.all([Promise.all(depWaits), Promise.all(overlapIds.map(id => settled[id]))])
    .then(([depResults]) => {
      const notMerged = depResults.filter(d => d.status !== 'merged').map(d => d.id)
      if (notMerged.length) return { id: t.id, status: 'skipped', reason: `dependency not merged: ${notMerged.join(', ')}` }
      return runTicket(t, i)
    })
    .catch(e => ({ id: t.id, status: 'error', reason: String(e) }))
})
 
const results = await Promise.all(T.map(t => settled[t.id]))
const mergedCount = results.filter(r => r.status === 'merged').length
log(`${mergedCount}/${results.length} items merged`)
 
let final = null
if (mergedCount > 0) {
  final = await agent([
    `In the main checkout on ${A.integrationBranch}, run the full suite: ${A.testCommand}`,
    `If it fails, fix the failures with the smallest changes that respect the spec (${A.spec}), commit them as "integration fixes", and run it again. Stop after 3 rounds.`,
    `Report passed, the tail of the last output, and one line per fix.`,
  ].join('\n'), { label: 'full suite', phase: 'Final', schema: FINAL })
}
 
return { integrationBranch: A.integrationBranch, results, final }
```
 
### 3. After the run
 
1. Update each run item's `status:` line in the backlog to `merged`, `failed`, `blocked` or `skipped`. Touch nothing else.
2. Write `[dir]/[base]-run.md`: one row per item (status, branch, attempts, reason), the final suite result, and the worktrees kept.
3. Remove worktrees of merged items (`git worktree list`, then `git worktree remove <path>`). Keep failed and blocked ones for inspection.
4. Reply with exactly:
```
Shipped <backlog> into feat/<base>
Merged <m>/<n> · Failed <f> · Blocked <b> · Skipped <s>
Final suite: <pass | fail>
Run log: <path>
Next: <review and open a PR | fix <ids> and rerun /spec-to-ship run <backlog>>
```
 
Rerunning picks up approved items that are not merged. To retry a failed or blocked item, edit it and set it back to `approved`. If a run is interrupted, do not try to continue agents mid-flight: rerun the phase. Merged items are detected from git and skipped, and the rest are dispatched fresh.
 
## Hard rules
 
1. Never run an item that is not `approved`.
2. Never fabricate requirements. If the spec does not say it, it goes in Open questions.
3. The coordinator never edits product code.
4. Merge only into `feat/[base]`. Never merge into main or the default branch, never push, never open a PR unless the user asks.
5. Never overwrite an existing backlog or run log on creation. Version it.
6. Writing: never use em dashes (U+2014) in any file or reply. Write the company name as Legawrite.AI.
7. Respect the stack: Python backend, Next.js + React frontend, conventions from CLAUDE.md.