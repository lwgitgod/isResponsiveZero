---
description: Dispatch a wave of parallel subagents from a flight-plan spec
argument-hint: <path-to-flight-plan.md> [wave-number]
---

# /wave-dispatch

You are now the wave dispatch coordinator. Use the `wave-dispatch` skill as your primary protocol. Also load `flight-plan-parser`, `wave-verify`, and `wave-resume` skills because you will invoke them.

## Arguments

- `$1`: path to the flight plan file (required)
- `$2`: wave number to run (optional, defaults to next unfinished wave)

If `$1` is missing, ask the user for the flight plan path. Do not guess.

## Procedure

1. **Sanity-check the flight plan path.** Confirm the file exists and is readable.
2. **Parse.** Invoke the flight-plan-parser skill's procedure. Write the manifest to `.wave-state/<run-id>/manifest.json` where run-id is the ISO timestamp.
3. **Symlink current.** Point `.wave-state/current` at the new run directory. If a prior run's current symlink exists and any wave has `status: running`, STOP and tell the user: "Active run detected at <path>. Use /wave-resume to continue it, or remove the symlink to start fresh." Do not overwrite.
4. **Decide wave.** If `$2` is given, use it. Otherwise, find the lowest wave number whose status is not `complete`.
5. **Barrier check.** For each wave in `depends_on`, confirm `status: complete` and verification pass. If not, refuse and report which barrier is not met.
6. **Pre-flight for mode=refactor.** Create one git worktree per ticket under `worktree_root/<agent-id>/`. Base each on the current HEAD. If worktree creation fails for any ticket, refuse the whole dispatch. If mode=investigate, skip this step.
7. **Write stub checkpoints.** One per ticket, `status: pending`.
8. **Fan out.** Send a single message containing one Task/Agent tool-use per ticket. Each carries:
   - The shared prompt prefix from the manifest
   - The ticket's addendum
   - The report filename
   - Instructions to load the wave-checkpoint and wave-handoff skills
   - The agent-id
   - (refactor mode) The worktree path to `cd` into first
9. **Wait for all to return.**
10. **Verify.** Invoke the wave-verify skill. Write `.wave-state/current/verification/wave-<n>.json`.
11. **Mark.** `complete` if verification passed, `blocked` otherwise.
12. **Report.** 5-line summary as specified in the wave-dispatch skill.

## When to refuse

- Flight plan missing or unparseable
- Active run detected and not explicitly resuming
- Barrier not met
- Worktree root missing or unwritable (refactor mode)
- More than `max_parallel` tickets in the wave and the user has not confirmed splitting

## When to escalate to the user

- Any verification failure (even one blocked ticket)
- Any subagent that returns `status: handoff` (ask whether to auto-spawn replacement via wave-resume, or stop)
- Any subagent that does not return within the wave's expected time budget
