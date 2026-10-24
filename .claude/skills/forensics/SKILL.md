Build a Claude Code custom skill called `forensics`. It investigates a single catastrophic failure by tracing exactly how the user's words got transformed into the wrong action, including any moments where the user themselves shut down a course correction.

## What this is for

When Claude Code does something catastrophically wrong, the failure almost never happens at the moment of the destructive action. It happens upstream, in interpretation, and sometimes in the user steamrolling a question that would have prevented it.

This skill reconstructs that full chain. The user is not exempt from the timeline.

## Invocation

```
/forensics "<what the user actually wanted or said>" "<what went wrong>"
```

Two required free-text parameters:

1. **The intent.** What the user actually asked for. Often a paste of the original prompt, or a description if it was voice-dictated and imperfect.
2. **The damage.** What Claude actually did that was wrong.

Optional flags:
- `--session <id>` scope to one session
- `--days N` lookback, default 7
- `--project <path>` restrict to one project under `~/.claude/projects/`

## Incident location

If no `--session` is given, scan recent sessions, score each by overlap between the intent string and user messages plus overlap between the damage string and destructive tool-use parameters. Present the top three candidate sessions with timestamps and a one-line description of what happened in each. Ask the user to pick. Do not auto-select.

Once selected, expand to the full incident window: from the start of the triggering user turn through the next user message after the damage.

## What the skill must produce

A markdown forensic report with these sections, in this order:

### 1. The prompt as received
The literal user message that triggered the failing turn. If it appears voice-dictated, flag likely artifacts: dropped words, homophones, run-on phrasing, missing punctuation that changes meaning. Show the raw text verbatim.

### 2. The interpretation gap
What Claude understood the request to mean, inferred from its immediately following behavior, set against what the user actually wanted. Name the specific divergence in one sentence.

### 3. User override events
A dedicated section, present even when empty. Scan the incident window and the preceding three turns for moments where Claude tried to slow down or clarify and the user shut it down. Flag every instance of:

- Claude asked a clarifying question and the user answered something off-topic, dismissive ("just do it", "stop asking", "yes whatever"), or ignored the question entirely and restated the original request
- Claude proposed a smaller-scoped plan and the user pushed for a broader action
- Claude flagged a risk or asked for confirmation and the user overrode it
- Claude offered to do a dry run, show a diff first, or limit scope, and the user declined
- The user interrupted Claude mid-tool-sequence (visible as an interrupt event in the JSONL) and immediately re-issued a stronger version of the same instruction
- The user repeated the same imperative across multiple turns in a way that suggests Claude's earlier hedging was being deliberately bypassed

For each override found: timestamp, quote of Claude's hedge or question, quote of the user's response, and a one-line read of what was being overridden. If no overrides are found, say so explicitly. The absence of overrides is itself useful evidence: it means the failure was Claude's alone.

### 4. The evidence chain
Numbered timeline of every action between the triggering prompt and the destructive change. For each step: tool call, search query or file viewed, and any reasoning visible in assistant text. Mark the first step that should have caused Claude to stop and re-check but didn't.

### 5. The point of no return
The exact tool call that committed the catastrophic change. Quote the parameters. Note what would have prevented it: a confirmation, a smaller scope, a dry run, a clarifying question.

### 6. Contributing factors
Honest assessment of what made the failure likely. Weigh each candidate explicitly:
- Ambiguous phrasing in the prompt
- Dictation artifacts the user didn't notice
- User overrides from section 3 (cite them by timestamp)
- Missing context in CLAUDE.md
- Claude pattern-matching to a more common request shape than the actual one
- Confirmation bias in Claude's search and read steps

If section 3 found overrides, this section must state plainly how much of the failure traces to those overrides versus to Claude's own misinterpretation. Don't soften it in either direction.

### 7. Prevention
Concrete rules grounded in this specific failure. Split into two lists:
- **For CLAUDE.md** rules that would have constrained Claude
- **For the user** behaviors that would have helped, especially around answering clarifying questions instead of overriding them, if section 3 surfaced any

No generic advice. Every rule must trace to a specific moment in the timeline above.

## Implementation

- Python. Parse JSONL from `~/.claude/projects/**/*.jsonl`. No decryption needed.
- Override detection patterns to look for in user messages following a Claude question or hedge:
  - Imperative restatement of the original ask with no answer to the question
  - Short dismissive tokens: "just", "do it", "yes", "whatever", "stop", "go", "proceed", "ship it", "no questions"
  - Direct contradiction of a Claude-proposed scope reduction
  - Interrupt events followed within one turn by a stronger imperative
- Use Sonnet for synthesis. Pass it the raw prompt, the ordered tool calls with parameters, all assistant reasoning text, all user messages in the window, and the user's damage description. Instruct it to produce all seven sections, to quote at most one short fragment per evidence step, and to never invent overrides that aren't in the transcript.
- Markdown to stdout. No HTML.

## Tone

Postmortem, not roast and not exoneration. When Claude was wrong, say so. When the user overrode a save, say so. No softening either direction.

## Deliverables

1. `~/.claude/skills/forensics/SKILL.md`
2. `~/.claude/skills/forensics/run.py`
3. README with one full example run end to end, including a realistic Section 3 that actually finds an override, and a second short example where Section 3 is empty so the format for both cases is clear.

Build it and show me both files in full.