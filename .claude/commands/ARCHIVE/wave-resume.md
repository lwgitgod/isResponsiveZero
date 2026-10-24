---
description: Resume an interrupted wave dispatch run, re-spawning agents that handed off
argument-hint: [run-id | latest] [--only agent-id,agent-id]
---

# /wave-resume

Resume a wave dispatch run that was interrupted mid-flight, or re-spawn specific agents that handed off.

## Arguments

- `$1`: run-id or `latest` (default)
- `--only <ids>`: comma-separated agent-ids to resume. If omitted, resume all agents in `status: handoff` or `status: pending` that belong to a wave currently `running`.

## Procedure

1. **Locate run.** Same as /wave-status.
2. **Read manifest and all checkpoints.** Build the resume roster:
   - Every agent with `status: handoff`: candidate for replacement
   - Every agent with `status: pending` in a wave marked `running`: candidate (was never dispatched or crashed before starting)
   - Every agent with `status: running` whose checkpoint is older than 5 minutes: candidate (assumed stuck)
3. **Filter by --only if provided.**
4. **For each candidate:**
   - Read their latest handoff document if it exists
   - Read the ticket's addendum from the manifest
   - Construct a resume prompt: `[resume-from-handoff] <path-to-handoff>` + shared prefix + addendum + agent-id + "use the wave-resume skill immediately"
5. **Fan out replacements.** Single message, one Task/Agent block per candidate.
6. **Wait for returns.**
7. **Verify the wave.** If all agents in the wave now show `status: complete`, invoke wave-verify. Otherwise, report which are still outstanding.
8. **Report.** 5-line summary showing resumed/completed/still-blocked counts.

## When to refuse

- No active run
- No candidates to resume (all agents already complete or no handoffs pending)
- Run has `status: complete` on all waves (nothing to resume)
- Candidate's handoff file is malformed; surface the parse error and skip that agent

## Relationship to /wave-dispatch

`/wave-dispatch` refuses when an active run is detected. `/wave-resume` is the escape hatch. The common pattern:

1. User runs `/wave-dispatch flight-plan.md`
2. Some agents hand off during Wave 1
3. User runs `/wave-status` to see the hand-offs
4. User runs `/wave-resume` (or `/wave-resume --only sp_p3,cb_b4`)
5. Replacements finish the wave
6. Verification runs, wave is marked complete
7. User runs `/wave-dispatch flight-plan.md 2` to continue

## Safety

Never resume an agent that has `status: complete`. That means the prior agent finished; resuming would double-write the report. The filter in step 3 skips these automatically, but if --only names a complete agent, refuse with the reason.
