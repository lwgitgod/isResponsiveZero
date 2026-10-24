---
name: handoff
description: Write a handoff file to .claude/tasks/ when context is running low or task cannot be completed in current session, so a replacement agent can resume.
---

# Handoff Protocol

## When to trigger
Begin handoff when ANY of these are true:
- You've made 20+ tool calls in this session
- User or wrapper signals "context low"
- You notice your own responses getting shorter or losing coherence
- You're about to start a task that will clearly exceed remaining budget

## Handoff procedure
Stop all in-progress work immediately. Do NOT start new tasks.
Write a single file: `.claude/tasks/handoff-<ISO-timestamp>.md`

The file MUST contain these sections, in this order:

### 1. STATUS
One paragraph: what was I doing, where did I stop, why.

### 2. COMPLETED
Bullet list of finished work with file paths and brief descriptions.
Link to any reports, commits, or artifacts.

### 3. REMAINING
Numbered list of tasks still to do, in priority order.
For each: goal, acceptance criteria, files involved, estimated scope.

### 4. CONTEXT YOU NEED
Key decisions already made, non obvious constraints, gotchas
the next agent will hit if they don't know. Links to relevant docs.

### 5. DO NOT
Things the next agent should NOT do: wrong paths tried, dead ends,
assumptions that turned out false.

### 6. NEXT ACTION
Literally the first command or file read the replacement should do.

## After writing the handoff
Respond to the user with:
"Context budget nearly exhausted. Handoff written to
 .claude/tasks/handoff-<timestamp>.md. Replacement agent should
 read that file first, then continue."

Do NOT continue working after the handoff file is written.