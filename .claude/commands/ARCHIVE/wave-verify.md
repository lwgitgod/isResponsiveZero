---
description: Run verification for a specific wave and decide pass or blocked
argument-hint: <wave-number> [--strategy report-schema|tests|both]
---

# /wave-verify

Invoke the wave-verify skill for a given wave. Normally the coordinator does this automatically after a wave finishes, but this command is the manual entry point when:

- A verification run failed and you want to re-try after fixes
- You want to verify a wave that was marked complete before this skill set was installed
- You want to run a stricter strategy than the flight plan declared

## Arguments

- `$1`: wave number (required)
- `--strategy`: override the flight plan's declared verification strategy. Must be one of `report-schema`, `tests`, `both`, `none`.

## Procedure

1. **Locate active run.** Read `.wave-state/current/manifest.json`.
2. **Confirm wave exists.** Fail if the wave number is not in the manifest.
3. **Choose strategy.** Use `--strategy` if given, else the flight plan's `verification` field.
4. **Run verification:**

   ```bash
   python .claude/scripts/wave_state.py verify --wave $1 --strategy <strategy>
   ```

5. **Read the result file** at `.wave-state/current/verification/wave-<n>.json` (or the latest `-attempt-N.json`).
6. **Report.** Print the result JSON's summary fields: result, checks passed, checks failed, specific failure details. If any failures, list them with the ticket id and the specific check that failed.
7. **Update wave status.** If pass, write `complete` to the wave status file. If fail, write `blocked`.

## Output format

```
Wave <n> verification: <pass | fail>
Strategy: <report-schema | tests | both>
Checks: <n-passed> / <n-total> passed

Failures:
  <ticket-id>: <check-name>
    <detail>

Next: <barrier clear, next wave ready | fixes needed | nothing to do>
```

## Re-verification

Verification results are immutable per attempt. Running /wave-verify twice produces `wave-<n>-attempt-2.json`, not an overwrite. The coordinator reads the highest-numbered attempt when deciding barrier state.
