---
name: testing-journal
description: Use during the testing/verification phase of any long-running, multi-step build (a wave dispatch, a multi-ticket backlog, a multi-agent effort, or any task with more than a couple of test runs). Keep a live engineering journal of every meaningful test/experiment AS IT HAPPENS, and a running account of testing budget actually spent (real evidence only — model calls, commits, runner pass counts — never invented timestamps). Triggers the moment you write or run the first real test in a task that will have more than one; do not wait until the work is "done" to start it, and do not treat it as a wrap-up document.
---

# Testing Journal Protocol

A journal written once at the end, after the work is done, is not a testing journal — it is a summary
with a misleading name. This skill exists because that mistake is easy to make on a long task: you get
absorbed in the dispatch/build/verify loop, and the journal quietly becomes "something to reconstruct
later from the reports." By the time you reconstruct it, you have lost the actual moment a bug was found,
and you are tempted to smooth the story into something cleaner than what happened.

**The rule this skill enforces: write the entry when the experiment happens, not when the ticket closes.**

## When this applies

Trigger it the moment any of these is true for the current task:
- You are about to run the first test, eval, or verification pass of a build that will have more than one.
- The user's instructions name a journal file explicitly (follow their path and name exactly).
- You are dispatching parallel subagents/tickets where each will do its own testing — this is the
  highest-value case, because without a shared journal each agent's bugs-found-and-fixed are invisible to
  everyone else until someone reads 30 separate reports after the fact.

Do **not** wait for "the testing phase" as a distinct later phase if tests are being written throughout
(TDD-style, or a wave-dispatch pattern where each ticket ships with its own runner). Write as you go from
the first one.

## Where the file lives

If the user named a path, use it exactly, verbatim, no renaming "for consistency." If they did not, ask
once, or default to `<repo-or-spec-root>/TestingJourney.md` and say so in one line. Do not bury it inside
a reports/ directory alongside individual ticket reports — it is the cross-cutting narrative those reports
don't tell on their own.

## What to write, and when

**Continuously, in small entries, appended as you go** — not batched, not held until a natural stopping
point that turns into "I'll do it later." A good entry is 4–10 sentences. Write one:

- Before or immediately after each meaningful test/experiment: what you were testing, what you expected,
  what actually happened.
- The moment a test **fails in a way that teaches you something** — a bug the test catches, a wrong
  assumption, a spec ambiguity the test forces you to resolve. This is the highest-value entry type and
  the one most often skipped because you're eager to move on to the fix.
- The moment you make a **judgment call under test** — an interpretation of an ambiguous spec, a threshold
  picked without a stated number, a tradeoff between two valid readings. Record the call and the reasoning,
  not just the resolution.
- When a fix changes behavior — what changed, why, and how you confirmed it (re-ran which test, what
  changed in the output).

Each entry answers, honestly: **what were you testing, what happened, what did you learn, what did you
change as a result.** If the honest answer to "what did you learn" is "nothing, it just passed," a
one-line entry is fine — do not pad it into false insight.

### What NOT to do

- Do not write it as a retrospective ("Wave 3 focused on freeze semantics and thoroughly validated...").
  That is a report, not a journal. A journal entry is written not knowing yet how the story ends.
- Do not polish failures into successes. A bug you found and fixed is more valuable in the journal than a
  clean pass — record the wrong turn, not just the corrected one.
- Do not defer writing "until there's something interesting to say." A quiet, uneventful test run is
  itself an entry: what was tested, that it passed cleanly, and why that was expected.
- Do not fabricate precision you don't have. See the timestamp section below — this is the specific
  failure mode that prompted this skill.

## Auditing the testing budget

The other half of this skill: the journal must let someone later answer "how much real verification effort
actually went into this, and where did it go" — without trusting anyone's self-report of it. Track only
evidence that is independently checkable after the fact.

**Track continuously, per test/ticket/unit of work:**
- **Model calls actually spent**, and on what — every subagent report should already state this (e.g. "2
  real Anthropic calls"); pull it into the journal rather than letting it live only in a per-ticket report
  no one reads end to end.
- **Assertion counts and pass/fail**, quoted from real runner output, not summarized into "all tests
  passed." `47 passed, 0 failed` is auditable; "comprehensive coverage" is not.
- **What was mocked vs. real** — flag explicitly anywhere a test used a stub, a fake, or a fault-injection
  substitute in place of a real dependency, and why (see the CC-703 example below: a fault was injected at
  the vector-index layer because the real index answering correctly cannot produce an outage on demand —
  that is a legitimate, stated exception, not a silent shortcut).
- **Running total against any budget the user gave** — if the user said "+500k tokens" or "under N model
  calls" or similar, keep a running tally in the journal (even approximate) so a mid-task check-in can
  answer "how much of the budget is spent and on what" without re-deriving it.

**If a budget is being tracked, add a short running-total line near the top of the file**, updated as you
go, e.g.:

```
Budget: no explicit target set. Model calls so far: 14 (across 9 tickets). Real test assertions so far: 612.
```

or, when a target exists:

```
Budget: 500k tokens. Spent so far: ~180k (36%). Model calls: 22. Heaviest so far: CC-205 (spine/diagnosis,
real fixture debugging, ~31k).
```

## Timestamps — do not fabricate them

This is the specific mistake this skill exists to prevent a repeat of. A subagent or a background process
in this environment frequently has **no real clock access** (`Date.now()` / `new Date()` are unavailable
in several execution contexts here specifically so that resumable runs stay deterministic). If you or a
subagent write a `started_at`/`updated_at` field into a checkpoint or report without a real clock, it will
be a round, plausible-looking placeholder — and presenting that later as a real timestamp is worse than
having no timestamp, because it looks precise and is not.

**Rule: only use timestamps you can trace to a real, independently-checkable source.** In order of
preference:
1. A git commit's author timestamp (`git log -1 --format='%ad' --date=iso-strict <ref>`), for anything
   that got committed. This is the strongest source — it's written by git itself, not by the agent.
2. A task-notification's real wall-clock arrival time, if the orchestrating session logs one.
3. Explicitly, honestly: **no reliable timestamp available** — state that rather than inventing one, and
   say what ordering evidence you do have (e.g. "ticket order in the dispatch sequence" or "referenced
   ticket X's output, so ran after it").

Never present a self-reported `started_at`/`updated_at` from an agent checkpoint as a real timestamp
without checking whether the process that wrote it actually had clock access. When in doubt, say so in the
journal rather than silently picking the number that looks best.

## Minimal entry template

```
### <date-or-ordering-evidence> — <ticket/unit id> — <one-line subject>

**Testing:** what was being verified, and how (real runner? real model call? what was faked and why).
**Happened:** the actual result — quote real numbers/output where you have them.
**Learned:** the insight, bug, or judgment call this surfaced — or "nothing new, expected pass."
**Changed:** what code/decision changed as a result, if anything.
```

Keep entries short. A 30-ticket build should read as 30-60 short entries plus a closing threads/patterns
section, not as 30 essays.
