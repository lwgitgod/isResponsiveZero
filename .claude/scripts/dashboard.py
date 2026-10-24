#!/usr/bin/env python3
"""
dashboard.py: aggregate .wave-state/current into a human readable status view.

Usage:
  python .claude/scripts/dashboard.py [--run <run-dir>]

Prints a plain-text dashboard. Designed for direct paste into chat.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(p: Path):
    try:
        return json.loads(p.read_text())
    except (OSError, json.JSONDecodeError):
        return None


def age_minutes(iso_str: str) -> int:
    try:
        t = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return -1
    now = datetime.now(timezone.utc)
    return int((now - t).total_seconds() // 60)


def dashboard(run_dir: Path) -> str:
    manifest = load_json(run_dir / "manifest.json")
    if manifest is None:
        return f"ERROR: no manifest at {run_dir / 'manifest.json'}"

    lines = []
    lines.append(f"Run: {run_dir.name}")
    lines.append(f"Flight plan: {manifest['flight_plan_path']}")
    lines.append(f"Mode: {manifest['meta']['mode']}  Verification: {manifest['meta']['verification']}")
    lines.append(f"Parsed: {manifest['parsed_at']}  (age {age_minutes(manifest['parsed_at'])} min)")
    lines.append("")

    # Wave summary
    lines.append("Waves:")
    for wave in manifest["waves"]:
        n = wave["number"]
        status_file = run_dir / "waves" / f"wave-{n}.status"
        status = status_file.read_text().strip() if status_file.exists() else "pending"
        # Count agent statuses in this wave
        agent_statuses = []
        for ticket in wave["tickets"]:
            cp = load_json(run_dir / "agents" / f"{ticket['agent_id']}.json")
            agent_statuses.append(cp.get("status") if cp else "pending")
        counts = {s: agent_statuses.count(s) for s in set(agent_statuses)}
        complete_n = counts.get("complete", 0)
        total = len(agent_statuses)
        ver_latest = sorted((run_dir / "verification").glob(f"wave-{n}*.json"))
        ver = load_json(ver_latest[-1]) if ver_latest else None
        ver_str = ver["result"] if ver else "not-run"
        lines.append(f"  {n}: {status}  agents={complete_n}/{total}  verify={ver_str}")
    lines.append("")

    # Active wave detail
    active_wave = None
    for wave in manifest["waves"]:
        status_file = run_dir / "waves" / f"wave-{wave['number']}.status"
        status = status_file.read_text().strip() if status_file.exists() else "pending"
        if status in ("running", "blocked"):
            active_wave = wave
            break
    if active_wave is None:
        # show the last wave that had activity
        for wave in reversed(manifest["waves"]):
            if any((run_dir / "agents" / f"{t['agent_id']}.json").exists() for t in wave["tickets"]):
                active_wave = wave
                break

    if active_wave:
        lines.append(f"Wave {active_wave['number']} agents:")
        for ticket in active_wave["tickets"]:
            cp = load_json(run_dir / "agents" / f"{ticket['agent_id']}.json")
            if cp is None:
                lines.append(f"  {ticket['agent_id']:20s}  pending")
                continue
            age = age_minutes(cp.get("updated_at", ""))
            blocker = cp.get("blockers", [])
            blocker_str = f"  BLOCKER: {blocker[0]}" if blocker else ""
            handoff_str = "  [HANDOFF]" if cp.get("handoff_recommended") or cp.get("status") == "handoff" else ""
            lines.append(
                f"  {cp['agent_id']:20s}  {cp['status']:10s}  "
                f"tools={cp.get('tool_uses', 0):3d}  "
                f"age={age}m{handoff_str}{blocker_str}"
            )
        lines.append("")

    # Handoffs awaiting resume
    handoffs = []
    for wave in manifest["waves"]:
        for ticket in wave["tickets"]:
            cp = load_json(run_dir / "agents" / f"{ticket['agent_id']}.json")
            if cp and cp.get("status") == "handoff":
                handoffs.append(f"  {ticket['agent_id']} (wave {wave['number']})")
    if handoffs:
        lines.append("Handoffs awaiting resume:")
        lines.extend(handoffs)
        lines.append("")

    # Next action hint
    lines.append("Next:")
    if handoffs:
        lines.append("  Run /wave-resume to spawn replacements for handed-off agents.")
    else:
        # Find next pending wave
        next_wave = None
        for wave in manifest["waves"]:
            status_file = run_dir / "waves" / f"wave-{wave['number']}.status"
            status = status_file.read_text().strip() if status_file.exists() else "pending"
            if status == "pending":
                deps_met = all(
                    (run_dir / "waves" / f"wave-{d}.status").exists() and
                    (run_dir / "waves" / f"wave-{d}.status").read_text().strip() == "complete"
                    for d in wave["depends_on"]
                )
                if deps_met:
                    next_wave = wave
                    break
                else:
                    lines.append(f"  Wave {wave['number']} blocked on dependencies: {wave['depends_on']}")
                    break
        if next_wave:
            lines.append(f"  Wave {next_wave['number']} ready to dispatch.")
        else:
            lines.append("  No pending waves. Investigation complete or awaiting verification.")

    return "\n".join(lines)


def resolve_current(state_root: Path):
    """Return the active run directory, or None if no active run."""
    link = state_root / "current"
    if link.is_symlink() or link.exists():
        target = link.resolve() if link.is_symlink() else link
        if target.exists():
            return target
    pointer = state_root / "current.txt"
    if pointer.exists():
        name = pointer.read_text().strip()
        target = state_root / name
        if target.exists():
            return target
    return None


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--run", default=None, help="run directory path; defaults to .wave-state/current")
    args = p.parse_args()

    if args.run:
        run_dir = Path(args.run)
    else:
        run_dir = resolve_current(Path(".wave-state"))
        if run_dir is None:
            print("No active run. Use /wave-dispatch to start one.")
            sys.exit(0)

    print(dashboard(run_dir))


if __name__ == "__main__":
    main()
