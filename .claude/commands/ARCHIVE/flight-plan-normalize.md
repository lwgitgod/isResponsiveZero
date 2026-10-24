---
description: Convert a human-authored flight plan into a machine-dispatchable one
argument-hint: <path-to-flight-plan.md> [--mode investigate|refactor] [--output <path>] [--specs <path,path,...>]
---

# /flight-plan-normalize

Load the `flight-plan-normalize` skill and follow its procedure. This command is the pre-step before `/wave-dispatch` when the flight plan is authored in human prose style rather than in the dispatchable table format.

## Arguments

- `$1`: path to the source flight plan (required)
- `--mode`: `investigate` or `refactor`. If omitted, the skill infers from the plan's language; if inference is ambiguous, ASK the user. Do not guess.
- `--output`: target path for the normalized plan. Default `<source>.dispatch.md`.
- `--specs`: comma separated list of spec paths to draw ticket details from. If omitted, the skill looks for common paths (`SPEC/tech-spec.md`, `backlog.md`, etc.) and uses whatever it finds.

## Procedure

1. **Validate inputs.** Confirm the source plan exists and is readable. Confirm at least one referenced spec exists (either via `--specs` or via the source plan's own references).
2. **Pre-flight check.** Does the source plan already have a `flight-plan-meta` block AND proper ticket tables? If yes, refuse normalization: "Plan is already dispatchable. Run `/wave-dispatch <path>` directly."
3. **Load the skill.** The `flight-plan-normalize` skill protocol takes over.
4. **Run the normalization** per the skill's §§1 through §9.
5. **Summary.** Print the short summary specified in the skill.
6. **Offer the next step.** If normalization succeeded with no blocking warnings, print exactly: `Next: /wave-dispatch <output-path>`. If there are missing tickets or unresolved hazards, print the list and require the user to fix before dispatching.

## Refusal conditions

- Source plan missing or unreadable
- No referenced specs on disk and no ticket details inline in the source
- Source plan is already dispatchable
- Mode cannot be inferred and the user did not supply one
- Output path already exists AND is newer than the source (likely a prior normalization the user did not clean up; ask before overwriting)

## Design doc compliance

If the plan contains frontend tickets (see the skill §5 for the detection rules), the normalizer MUST locate or be told where the design doc is. If no design doc is found, the normalizer proceeds but surfaces a warning, and the user must acknowledge before dispatch.

## Typical workflow

```
/flight-plan-normalize flightplan.md --mode refactor
  (produces flightplan.dispatch.md)

/wave-dispatch flightplan.dispatch.md
  (runs Wave 1)

/wave-status
  (check in periodically)

/wave-dispatch flightplan.dispatch.md 2
  (advance to Wave 2 once barrier is clear)
```

When the source plan changes, re-run `/flight-plan-normalize`. The output is a derived artifact; do not hand edit it.
