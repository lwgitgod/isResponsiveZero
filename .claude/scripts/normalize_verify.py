#!/usr/bin/env python3
"""
normalize_verify.py: sanity-check a normalized flight plan.

Runs the parser against a candidate output and reports:
  - Whether it parses
  - Wave count, ticket count
  - Any tickets missing report filenames or addenda
  - Any obvious file-scope collisions between tickets in the same wave

Usage:
  python .claude/scripts/normalize_verify.py <normalized-plan.md>
  python .claude/scripts/normalize_verify.py SPEC\PHASE1-flightplan.dispatch.md
Exit codes:
  0: clean, dispatch ready
  1: parse failed or hard errors
  2: parsed but has warnings the user should see
"""

import json
import subprocess
import sys
import re
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("usage: normalize_verify.py <normalized-plan.md>", file=sys.stderr)
        sys.exit(1)

    plan_path = Path(sys.argv[1])
    if not plan_path.exists():
        print(f"file not found: {plan_path}", file=sys.stderr)
        sys.exit(1)

    # Initialize a temporary run to get a manifest
    scripts_dir = Path(".claude/scripts")
    wave_state = scripts_dir / "wave_state.py"
    if not wave_state.exists():
        print(f"wave_state.py not found at {wave_state}", file=sys.stderr)
        sys.exit(1)

    # Ensure a current run exists (parser requires it)
    subprocess.run(
        ["python", str(wave_state), "init-run"],
        capture_output=True,
        check=False,
    )

    parse = subprocess.run(
        ["python", str(wave_state), "parse", str(plan_path)],
        capture_output=True,
        text=True,
    )

    if parse.returncode != 0:
        print(f"PARSE FAILED:\n{parse.stderr}")
        sys.exit(1)

    # Read the manifest the parser just wrote
    state_root = Path(".wave-state")
    current_txt = state_root / "current.txt"
    current_link = state_root / "current"

    run_dir = None
    if current_link.is_symlink() or current_link.exists():
        target = current_link.resolve() if current_link.is_symlink() else current_link
        if target.exists():
            run_dir = target
    if run_dir is None and current_txt.exists():
        run_dir = state_root / current_txt.read_text().strip()
    if run_dir is None or not run_dir.exists():
        print("could not locate current run directory", file=sys.stderr)
        sys.exit(1)

    manifest = json.loads((run_dir / "manifest.json").read_text())

    total_tickets = sum(len(w["tickets"]) for w in manifest["waves"])
    warnings = []

    # Check each wave for completeness and collisions
    for wave in manifest["waves"]:
        if not wave["tickets"]:
            warnings.append(f"Wave {wave['number']}: zero tickets extracted")
            continue

        # Missing filenames
        missing_fn = [t["id"] for t in wave["tickets"] if not t["report_filename"]]
        if missing_fn:
            warnings.append(
                f"Wave {wave['number']}: tickets with no report filename: {', '.join(missing_fn)}"
            )

        # Missing addenda
        missing_add = [t["id"] for t in wave["tickets"] if not t["addendum"].strip()]
        if missing_add:
            warnings.append(
                f"Wave {wave['number']}: tickets with no addendum: {', '.join(missing_add)}"
            )

        # File scope collisions (addenda mentioning same file path)
        file_refs = {}
        for ticket in wave["tickets"]:
            paths = re.findall(
                r"(?:[\w\-\.]+/)+[\w\-\.]+\.(?:py|tsx?|jsx?|md|json|yaml|yml|sql)",
                ticket["addendum"],
            )
            for p in paths:
                file_refs.setdefault(p, []).append(ticket["id"])
        for path, tickets in file_refs.items():
            if len(tickets) > 1:
                warnings.append(
                    f"Wave {wave['number']}: file '{path}' referenced by multiple tickets: {', '.join(tickets)}"
                )

    # Frontend check
    has_frontend = False
    for wave in manifest["waves"]:
        for ticket in wave["tickets"]:
            add = ticket["addendum"].lower()
            if (
                re.search(r"\b(ui|fe|frontend|react|next\.?js|component)\b", add)
                or "frontend-ticket" in add
            ):
                has_frontend = True
                break

    design_doc_mentioned = bool(
        re.search(r"design\.md", manifest["shared_prompt_prefix"], re.IGNORECASE)
    )
    if has_frontend and not design_doc_mentioned:
        warnings.append(
            "frontend tickets present but shared prompt prefix does not reference a design doc"
        )

    # Report
    print(f"Parse: OK")
    print(f"Mode: {manifest['meta']['mode']}")
    print(f"Waves: {len(manifest['waves'])}  Tickets: {total_tickets}")
    print(f"Design doc referenced: {'yes' if design_doc_mentioned else 'no'}")

    if warnings:
        print(f"\nWarnings ({len(warnings)}):")
        for w in warnings:
            print(f"  - {w}")
        sys.exit(2)

    print("\nClean. Ready to dispatch.")
    sys.exit(0)


if __name__ == "__main__":
    main()
