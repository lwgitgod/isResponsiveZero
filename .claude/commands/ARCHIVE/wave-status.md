---
description: Show the live dashboard for the active wave dispatch run
argument-hint: [run-id | latest]
---

# /wave-status

Aggregate checkpoints from `.wave-state/current/agents/*.json` (or a specific run directory) and render a status dashboard.

## Arguments

- `$1`: run-id to inspect, or `latest` (default). Run-id is the ISO timestamp in the directory name.

## Procedure

1. **Locate the run.** If `$1` is `latest` or missing, read `.wave-state/current` (a symlink). Otherwise look up `.wave-state/run-<id>/`.
2. **Call the dashboard script:**

   ```bash
   python .claude/scripts/dashboard.py --run <run-path>
   ```

   The script:
   - Reads `manifest.json` for the agent roster and wave structure
   - Reads every `agents/*.json` for current status
   - Reads every `waves/*.status` for wave-level state
   - Reads `verification/*.json` for verification results
   - Prints a formatted dashboard to stdout

3. **Relay.** Paste the dashboard output into your response. Do not reformat, do not summarize, do not add commentary unless the user asks. The dashboard is designed for direct reading.

## Dashboard contents

The script produces:

- Run id and age
- Per-wave summary table: wave number, status, agents passed/total, verification result
- Per-agent detail table for the active or last-active wave: agent-id, status, tool uses, last updated, blockers
- Handoff indicator: list of agents in `status: handoff` awaiting resume
- Next action hint: what the coordinator would do next

## When the script is not present

Render a minimal dashboard yourself by reading the JSON files directly. Format:

```
Run: <run-id> (age: <N> minutes)
Mode: <investigate|refactor>

Waves:
  1: <complete|running|blocked> (<n-pass>/<n-total> agents)
  2: <pending|complete|running|blocked>
  ...

Active wave <n> agents:
  <agent-id>  <status>  tools=<n>  updated=<time>  <blocker if any>
  ...

Handoffs awaiting resume: <list>
```

## When to refuse

- No active run: respond "No active wave dispatch run found. Use /wave-dispatch to start one."
- Run directory corrupt (missing manifest): respond with the path and what's missing.
