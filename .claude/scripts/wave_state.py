#!/usr/bin/env python3
"""
wave_state.py: checkpoint writer, flight plan parser, and verification runner.

Commands:
  checkpoint  Write or update a subagent checkpoint
  parse       Parse a flight plan into manifest.json
  verify      Run verification for a wave
  init-run    Create a new run directory and set .wave-state/current

Design goals:
  - Atomic writes: all state changes use tmp file + rename
  - No external dependencies beyond the stdlib
  - Fail fast: bad inputs produce one line errors on stderr with exit code 1
  - Idempotent where it makes sense (re-parsing same plan yields same manifest)
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
import subprocess

STATE_ROOT = Path(".wave-state")


def iso_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def atomic_write_json(path: Path, data: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, sort_keys=False))
    tmp.replace(path)


def atomic_write_text(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text)
    tmp.replace(path)


def derive_agent_id(ticket_id: str) -> str:
    s = ticket_id.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s)
    return s.strip("_")


def current_run() -> Path:
    """Resolve the active run directory.

    Supports two pointer mechanisms, in priority order:
      1. A symlink at .wave-state/current -> run-<id>/
      2. A plain text file at .wave-state/current.txt containing the run dir name

    The fallback exists because symlinks require admin on Windows and
    are not supported on some filesystems.
    """
    link = STATE_ROOT / "current"
    if link.is_symlink() or link.exists():
        # If it's a symlink, resolve; if it's a directory, use directly
        if link.is_symlink():
            target = link.resolve()
        else:
            target = link
        if target.exists():
            return target

    pointer = STATE_ROOT / "current.txt"
    if pointer.exists():
        name = pointer.read_text().strip()
        target = STATE_ROOT / name
        if target.exists():
            return target

    sys.stderr.write("no active run; .wave-state/current (symlink or current.txt) not found\n")
    sys.exit(1)


# ---------------------------------------------------------------------------
# init-run
# ---------------------------------------------------------------------------


def cmd_init_run(args):
    STATE_ROOT.mkdir(exist_ok=True)
    run_id = iso_now().replace(":", "").replace("-", "")
    run_dir = STATE_ROOT / f"run-{run_id}"
    (run_dir / "agents").mkdir(parents=True)
    (run_dir / "waves").mkdir()
    (run_dir / "verification").mkdir()

    # Clear any existing pointer
    current_link = STATE_ROOT / "current"
    current_txt = STATE_ROOT / "current.txt"
    for p in (current_link, current_txt):
        if p.is_symlink() or p.exists():
            try:
                p.unlink()
            except (OSError, IsADirectoryError):
                pass

    # Try symlink, fall back to pointer file
    try:
        os.symlink(run_dir.name, current_link)
        pointer_kind = "symlink"
    except (OSError, NotImplementedError):
        current_txt.write_text(run_dir.name)
        pointer_kind = "pointer file (symlinks unavailable)"

    print(f"initialized run {run_dir.name}")
    print(f"current -> {run_dir.name} ({pointer_kind})")


# ---------------------------------------------------------------------------
# checkpoint
# ---------------------------------------------------------------------------


def cmd_checkpoint(args):
    run = current_run()
    agent_file = run / "agents" / f"{args.agent_id}.json"

    existing = {}
    if agent_file.exists():
        try:
            existing = json.loads(agent_file.read_text())
        except json.JSONDecodeError:
            existing = {}

    counter_file = run / "agents" / f"{args.agent_id}.tooluses"
    tool_uses = 0
    if counter_file.exists():
        try:
            tool_uses = int(counter_file.read_text().strip())
        except ValueError:
            pass

    checkpoint = {
        "agent_id": args.agent_id,
        "ticket": args.ticket or existing.get("ticket"),
        "wave": args.wave if args.wave is not None else existing.get("wave"),
        "status": args.status or existing.get("status", "running"),
        "started_at": existing.get("started_at") or iso_now(),
        "updated_at": iso_now(),
        "tool_uses": tool_uses,
        "files_touched": existing.get("files_touched", []),
        "decisions": existing.get("decisions", []),
        "remaining": args.remaining.split("|") if args.remaining else existing.get("remaining", []),
        "blockers": args.blocker.split("|") if args.blocker else existing.get("blockers", []),
        "verification": existing.get("verification", {
            "report_written": False,
            "report_path": None,
            "schema_valid": None,
        }),
        "handoff_recommended": args.handoff_recommended if args.handoff_recommended is not None else existing.get("handoff_recommended", False),
    }

    if args.files_touched:
        new_files = set(checkpoint["files_touched"])
        new_files.update(args.files_touched.split(","))
        checkpoint["files_touched"] = sorted(new_files)

    if args.decision:
        checkpoint["decisions"] = checkpoint["decisions"] + [args.decision]

    if args.report_path:
        checkpoint["verification"]["report_path"] = args.report_path
        checkpoint["verification"]["report_written"] = Path(args.report_path).exists()

    atomic_write_json(agent_file, checkpoint)
    print(f"checkpoint written: {agent_file}")


# ---------------------------------------------------------------------------
# parse
# ---------------------------------------------------------------------------


META_FENCE = re.compile(
    r"```flight-plan-meta\s*\n(.*?)\n```", re.DOTALL
)
YAML_FRONTMATTER = re.compile(
    r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL
)
WAVE_HEADING = re.compile(r"^##\s+[^\n]*\bwave\s+(\d+)\b", re.IGNORECASE | re.MULTILINE)
SHARED_PREFIX_HEADING = re.compile(
    r"(?:shared prompt prefix|§?\s*4\.0)", re.IGNORECASE
)


def parse_meta(text: str):
    # Try fenced block first, then frontmatter.
    m = META_FENCE.search(text)
    block = None
    if m:
        block = m.group(1)
    else:
        fm = YAML_FRONTMATTER.match(text)
        if fm:
            block = fm.group(1)

    if block is None:
        return None, "missing flight-plan-meta fenced block or YAML frontmatter"

    meta = {}
    for line in block.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip()

    required = ["mode", "reports_dir", "wave_barriers", "verification"]
    missing = [r for r in required if r not in meta]
    if missing:
        return None, f"meta missing required fields: {', '.join(missing)}"

    if meta["mode"] == "refactor" and "worktree_root" not in meta:
        return None, "mode=refactor requires worktree_root in meta"

    # Coerce
    if "max_parallel" in meta:
        try:
            meta["max_parallel"] = int(meta["max_parallel"])
        except ValueError:
            return None, "max_parallel must be an integer"
    else:
        meta["max_parallel"] = 20

    return meta, None


def parse_shared_prefix(text: str):
    """Find the shared prompt prefix fenced block by looking for a heading then a fence."""
    lines = text.splitlines()
    in_prefix_section = False
    fence_start = None
    fence_lines = []
    for i, line in enumerate(lines):
        if line.startswith("#") and SHARED_PREFIX_HEADING.search(line):
            in_prefix_section = True
            continue
        if in_prefix_section:
            if fence_start is None:
                if line.strip().startswith("```"):
                    fence_start = i
                    continue
            else:
                if line.strip().startswith("```"):
                    return "\n".join(fence_lines), None
                fence_lines.append(line)
            if line.startswith("#") and fence_start is None:
                # Left the section without finding a fence
                break
    return None, "shared prompt prefix fenced block not found"


def parse_waves(text: str):
    """Walk the document, split into wave sections by H2/H3 'Wave N' headings.

    Handles two flight plan patterns:
      A. One sub-heading per ticket, one fence per sub-heading (demo style).
      B. One sub-heading per group, one shared fence, multiple tickets in the
         group's table (RefectorOutV1 style).

    Resolution order for each ticket's addendum:
      1. Look for a sub-heading whose text contains the ticket id; if found,
         use the first fence after it (up to the next heading).
      2. Else use the first fence that appears after the ticket's table row,
         stopping at the next H3 or H2.
    """
    matches = list(WAVE_HEADING.finditer(text))
    if not matches:
        return [], "no Wave N headings found"

    waves = []
    for i, m in enumerate(matches):
        wave_num = int(m.group(1))
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        section = text[start:end]
        waves.append({"number": wave_num, "section_text": section, "tickets": []})

    for wave in waves:
        sect = wave["section_text"]

        # Pass 1: collect all ticket rows in document order, with positions.
        ticket_order = []
        ticket_rows = {}   # tid -> (row_text, row_position)
        for row_match in re.finditer(
            r"^[|]\s*\*\*([A-Z][A-Z0-9\-]+)\*\*\s*\|[^\n]*",
            sect,
            re.MULTILINE,
        ):
            tid = row_match.group(1)
            if tid not in ticket_rows:
                ticket_order.append(tid)
                ticket_rows[tid] = (row_match.group(0), row_match.start())

        # Pass 2: resolve addendum per ticket.
        for tid in ticket_order:
            row_text, row_pos = ticket_rows[tid]

            # Strategy A: sub-heading whose text contains the ticket id.
            heading_pat = re.compile(
                rf"^#{{2,4}}\s+[^\n]*\b{re.escape(tid)}\b[^\n]*$",
                re.MULTILINE,
            )
            addendum = ""
            h = heading_pat.search(sect)
            if h:
                after = sect[h.end():]
                next_heading = re.search(r"^#{1,6}\s", after, re.MULTILINE)
                scope = after[: next_heading.start()] if next_heading else after
                fence_match = re.search(r"```[^\n]*\n(.*?)```", scope, re.DOTALL)
                if fence_match:
                    addendum = fence_match.group(1).strip()

            # Strategy B: first fence after the ticket's table row, up to next H3/H2.
            if not addendum:
                after = sect[row_pos + len(row_text):]
                next_heading = re.search(r"^#{1,3}\s", after, re.MULTILINE)
                scope = after[: next_heading.start()] if next_heading else after
                fence_match = re.search(r"```[^\n]*\n(.*?)```", scope, re.DOTALL)
                if fence_match:
                    addendum = fence_match.group(1).strip()

            cells = [c.strip().strip("`") for c in row_text.split("|")]
            report_fn = next((c for c in cells if c.endswith(".md")), None)

            wave["tickets"].append({
                "id": tid,
                "agent_id": derive_agent_id(tid),
                "report_filename": report_fn,
                "addendum": addendum,
                "depends_on": [],
            })

        del wave["section_text"]

    # Validate unique agent ids across the whole plan
    seen = {}
    for w in waves:
        for t in w["tickets"]:
            if t["agent_id"] in seen:
                return [], f"duplicate agent_id {t['agent_id']} from tickets {seen[t['agent_id']]} and {t['id']}"
            seen[t["agent_id"]] = t["id"]

    # Wave dependency: wave N+1 depends on wave N by default
    for i, w in enumerate(waves):
        w["depends_on"] = [waves[i - 1]["number"]] if i > 0 else []

    return waves, None


def cmd_parse(args):
    text = Path(args.flight_plan).read_text(encoding="utf-8")
    if len(text) > 500_000:
        sys.stderr.write("flight plan over 500KB size limit\n")
        sys.exit(1)

    meta, err = parse_meta(text)
    if err:
        sys.stderr.write(f"meta parse error: {err}\n")
        sys.exit(1)

    prefix, err = parse_shared_prefix(text)
    if err:
        sys.stderr.write(f"shared prefix parse error: {err}\n")
        sys.exit(1)

    waves, err = parse_waves(text)
    if err:
        sys.stderr.write(f"wave parse error: {err}\n")
        sys.exit(1)

    manifest = {
        "flight_plan_path": str(Path(args.flight_plan).resolve()),
        "parsed_at": iso_now(),
        "meta": meta,
        "shared_prompt_prefix": prefix,
        "waves": waves,
    }

    run = current_run()
    atomic_write_json(run / "manifest.json", manifest)
    print(f"manifest written: {run / 'manifest.json'}")
    print(f"waves: {len(waves)}, tickets: {sum(len(w['tickets']) for w in waves)}")


# ---------------------------------------------------------------------------
# verify
# ---------------------------------------------------------------------------


REQUIRED_REPORT_SECTIONS = [
    "Summary",
    "Findings",
    "Proposed actions",
    "Unresolved questions",
    "Commands run",
]


DEFAULT_STATUS_REGEX = r"\*\*Status:\*\*\s*(complete|partial|blocked)"


def verify_report_schema(report_path: Path, required_sections=None, status_regex=None):
    """Check a report against the flight plan's declared schema.

    The flight plan is the authority on required sections and the status
    field format. Plans that declare `report_required_sections` /
    `report_status_regex` in their meta are checked against those; plans
    that don't fall back to the legacy investigate-mode defaults.
    """
    sections = required_sections or REQUIRED_REPORT_SECTIONS
    status_pat = status_regex or DEFAULT_STATUS_REGEX
    if not report_path.exists():
        return False, "file missing"
    size = report_path.stat().st_size
    if size < 500:
        return False, f"file too small ({size} bytes)"
    text = report_path.read_text(encoding="utf-8", errors="replace")
    missing = [s for s in sections if f"## {s}" not in text and f"# {s}" not in text]
    if missing:
        return False, f"missing sections: {', '.join(missing)}"
    if not re.search(status_pat, text, re.MULTILINE):
        return False, "missing or malformed Status field"
    return True, "ok"


def cmd_verify(args):
    run = current_run()
    manifest = json.loads((run / "manifest.json").read_text())
    wave = next((w for w in manifest["waves"] if w["number"] == args.wave), None)
    if wave is None:
        sys.stderr.write(f"wave {args.wave} not in manifest\n")
        sys.exit(1)

    strategy = args.strategy or manifest["meta"]["verification"]
    reports_dir = Path(manifest["meta"]["reports_dir"])

    checks = []
    failures = []
    for ticket in wave["tickets"]:
        fn = ticket["report_filename"]
        if not fn:
            failures.append({"ticket": ticket["id"], "check": "manifest", "detail": "no report filename in manifest"})
            continue
        path = reports_dir / fn

        if strategy in ("report-schema", "both"):
            exists = path.exists()
            checks.append({
                "ticket": ticket["id"],
                "check": "report-exists",
                "path": str(path),
                "result": "pass" if exists else "fail",
            })
            if not exists:
                failures.append({"ticket": ticket["id"], "check": "report-exists", "path": str(path), "detail": "file missing"})
                continue

            ok, detail = verify_report_schema(
                path,
                required_sections=manifest["meta"].get("report_required_sections"),
                status_regex=manifest["meta"].get("report_status_regex"),
            )
            checks.append({
                "ticket": ticket["id"],
                "check": "schema-valid",
                "path": str(path),
                "result": "pass" if ok else "fail",
                "detail": detail,
            })
            if not ok:
                failures.append({"ticket": ticket["id"], "check": "schema-valid", "path": str(path), "detail": detail})

    if strategy in ("tests", "both"):
        cmd = manifest["meta"].get("test_command")
        if cmd:
            proc = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            ok = proc.returncode == 0
            checks.append({
                "ticket": "ALL",
                "check": "tests",
                "result": "pass" if ok else "fail",
                "detail": proc.stdout[-2000:] if not ok else "ok",
            })
            if not ok:
                failures.append({"ticket": "ALL", "check": "tests", "detail": "test suite failed"})
        else:
            checks.append({"ticket": "ALL", "check": "tests", "result": "skip", "detail": "no test_command in meta"})

    result_obj = {
        "wave": args.wave,
        "strategy": strategy,
        "started_at": iso_now(),
        "completed_at": iso_now(),
        "result": "pass" if not failures else "fail",
        "checks": checks,
        "failures": failures,
    }

    # Pick next attempt number
    vdir = run / "verification"
    base = f"wave-{args.wave}"
    existing = sorted(vdir.glob(f"{base}*.json"))
    attempt = len(existing) + 1
    out = vdir / (f"{base}.json" if attempt == 1 else f"{base}-attempt-{attempt}.json")
    atomic_write_json(out, result_obj)

    # Update wave status
    status_file = run / "waves" / f"wave-{args.wave}.status"
    atomic_write_text(status_file, "complete" if result_obj["result"] == "pass" else "blocked")

    print(f"verification: {result_obj['result']}")
    print(f"written: {out}")
    if failures:
        for f in failures:
            print(f"  FAIL {f['ticket']}: {f['check']}: {f.get('detail', '')}")
    sys.exit(0 if result_obj["result"] == "pass" else 2)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main():
    p = argparse.ArgumentParser(prog="wave_state")
    sub = p.add_subparsers(dest="cmd", required=True)

    sp = sub.add_parser("init-run")
    sp.set_defaults(func=cmd_init_run)

    sp = sub.add_parser("checkpoint")
    sp.add_argument("--agent-id", required=True)
    sp.add_argument("--ticket")
    sp.add_argument("--wave", type=int)
    sp.add_argument("--status")
    sp.add_argument("--decision")
    sp.add_argument("--remaining", help="pipe-separated list of remaining items")
    sp.add_argument("--blocker", help="pipe-separated list of blockers")
    sp.add_argument("--files-touched", help="comma-separated list of files touched")
    sp.add_argument("--report-path")
    sp.add_argument("--handoff-recommended", type=lambda v: v.lower() in ("1", "true", "yes"), default=None)
    sp.set_defaults(func=cmd_checkpoint)

    sp = sub.add_parser("parse")
    sp.add_argument("flight_plan")
    sp.set_defaults(func=cmd_parse)

    sp = sub.add_parser("verify")
    sp.add_argument("--wave", type=int, required=True)
    sp.add_argument("--strategy", choices=["report-schema", "tests", "both", "none"])
    sp.set_defaults(func=cmd_verify)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
