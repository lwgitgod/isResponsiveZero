---
name: hotfix
description: End-to-end workflow for taking a piece of work from a raw ticket description to a checked-in implementation. Use this skill whenever the user asks to "create a ticket," "make a ticket for X," references a ticket path like [Path][ext][number] (e.g. \tickets\PSD\PSD-Ticket11.md), asks to create a matching Jira ticket, or asks to implement a ticket and check it in. This covers writing the local ticket file, creating the Jira issue, moving it through To Do -> In Progress -> Code Complete, implementing the change, logging progress notes and blockers on the Jira ticket, and committing to the current branch. Trigger this even if the user only describes part of the flow (e.g. just "implement this ticket and check it in") since it's the same underlying workflow.
---
# Prime Directive
Do not look in any other tickets to implement this one. Ticket don't represent truth. If you need to know about another ticket, taht instruction will be given to you. Just read code that you need to. See Step 0.5 to know how to look for code.

# Ticket Workflow

Turns a raw feature/bug description into: a local ticket file, a linked Jira issue moved through the
correct states, an implementation, progress notes on Jira, and a commit on the current branch.

Do not skip steps silently. If something in this workflow cannot be completed (no Jira connector,no git repo, ambiguous ticket number), stop and tell the user in chat rather than guessing.
---
Use separate investigation agent to do the investigation and tickets creation:

## Step 0 - Gather inputs

Before starting, confirm you have:

1. **Ticket path components**: `[Path][ext][number]`, e.g. `ROOT\tickets\PSD\PSD-Ticket11.md`
   - `Path` = folder under `tickets\` (project/component code, e.g. `PSD`)
   - `ext` = file naming stem, e.g. `Ticket`
   - `number` = next available integer for that Path
   - If the user gives a full path directly, use it as-is. If they only give a Path (e.g. "PSD"),
   - Look in `tickets/PSD/` for the highest existing `PSD-TicketNN.md` and use `NN+1`.
   - If given in format: EXT (PSD) 10 "text",  that to mean `tickets\PSD\PSD-Ticket10.MD`, if the Number is omited, bump to next available number, note it in chat.
2. **Ticket text**: the description/spec of the work, provided by the user in the request.

## Step 0.5 - Orient with the knowledge graph

Run these two commands before you open any source file:

1. /graphify query "<ticket text>"
2. /graphify god-nodes --top 10

Read the returned node list and its `source_location` values. Pick the files to open from
that list. Do not grep the tree first. Grep only to confirm a line the graph named.

If `graphify-out/graph.json` does not exist, skip this step. Say so in chat.

## Step 1 - Create the local ticket file

- Path convention on disk: `tickets/<PATH>/<PATH>-Ticket<NUMBER>.md` (translate Windows-style
  backslashes from the request into forward slashes for the actual filesystem).
- Content template:

```markdown
# <PATH>-Ticket<NUMBER>

## Original Text
<one-line Preserve the original request from input **Ticket text**>
## Change Requested
A absolutley non-technical repeat of what was asked and proposed change with not a single technical term, method or page name. This proves to the reviewer that you see the problem in similar way as human does. You may use page common names not [name].html or [name].tsx. Human has no idea what thouse are other then the common visible page or workflow names. 
## Summary
<one-line summary derived from the ticket text>

## Description
<ticket text, verbatim or lightly cleaned up>

## Acceptance Criteria
- <bullet list, inferred if not explicitly given - confirm inferred criteria with the user if unclear>

## Blast Radius
<output of `graphify affected "<primary node>" --depth 2`>

## Notes
- Jira: <linked once created in Step 2>

```
- Create the file with the create_file/write tool. Do not overwrite an existing ticket file with the
  same number; if the target path already exists, use the next free number and tell the user.

## Review
Do /mr-obviously [newly form and saved ticket text] and revise the tickets .md file accordingly

DONT stop after /mr-obviously finished he is never the goal of your task! 
We allways use the Jira project "PL" (Pre-Launch) for as long as you need to know. Never ask about it. This value is hardcoded opn my machine

- Perform /Rename on this session with the EXT-Ticket-N-[3-5 Word issue description of the issue] 
- Run the /Color command on the session. Take the ticket number and rotate through colors using modulo 7: 1 (cyan), 2 (blue), 3 (green), 4 (yellow), 4 (purple), 5 (orange), 6 (pink). Skip red.

## Step 2 - Create the matching Jira ticket

- Use the Jira/Atlassian connector (search for it via tool_search if not already loaded, e.g. query
  "jira issue create").
- Create the issue with:
  - Summary: same one-liner as the local ticket file
  - Description: same ticket text as the local file (keep formatting equivalent - Jira uses its own
    markup, so convert markdown headers/bullets sensibly)
  - Project/sprint: as gathered in Step 0
- Immediately after creation:
  1. Confirm the issue is in **To Do** (default state for new issues in most workflows - verify,
     don't assume).
  2. Transition it to **In Progress** and ensure it is assigned to the **current sprint** (add it to
     the active sprint if the creation step didn't already).
- Update the local ticket file's `## Notes` section with the Jira issue key and link.

## Step 3 - Implement the ticket
---
!!! After ticket is written and investigation complete start the separate agent to code: !!!
use TECH-full-stack-architect subagent to do the following task

### Task:
#### Graph context
Paste the graph output into the subagent prompt. Include three items:

1. The `/graphify query` result from Step 0.5.
2. The `/graphify affected` result from Step 1.
3. One `/graphify explain "<node>"` per node the ticket changes.

Run `graphify query \"<question>\"` before any grep or find. Grep only to confirm a line the graph named.

- Work directly against the acceptance criteria in the ticket file.
- As you implement, follow the repo's existing code conventions (Python / React-Next.js unless the
  repo says otherwise).
- Whenever you hit a real blocker, ambiguity, or design decision, or complete a meaningful chunk of
  work, add a comment to the Jira ticket right away (see Step 4) rather than batching everything at
  the end - notes should reflect the actual implementation timeline.


### Testing
- You are allowed 1 new test for this ticket unless you can justify and get approval from human that started your ticket for more, asking for that approval requires major written justifcation, PLEASE NOTE:  90% of the time new test are DENIED. 
- If the nature of your change is UI and visual, then the Claude Chrome plug in is your debugging mechansim, not test that produce .XML for pipeline steps. 
- If you testing backend pipline and need new test in \tests\persistDB\debug\ 1 test with many methods and pipeline steps can cover 99% use cases. 


### Execution Rules

* **Scope is fixed by the ticket.** Implement only what is required to satisfy its acceptance criteria.
* **Make the smallest sufficient change.** Do not refactor, clean up, or fix adjacent problems unless required for the ticket.
* **Verification does not create scope.** Test failures, warnings, or other problems discovered during verification are not authorized work unless caused by this change or required to satisfy the ticket.
* **Use the narrowest reliable verification.** Verify the behavior changed by this ticket; do not expand into broad testing without a specific reason tied to the change.
* **Stop when the acceptance criteria are satisfied.** If completing them requires materially broader work, stop and report the issue rather than expanding the implementation.


## Step 4 - Add Jira notes as you go

Add a Jira comment for each of the following, as they happen (not just at the end):

- Key implementation decisions and why
- Any problem encountered (failing test, unclear requirement, missing dependency, breaking change)
  and how it was resolved, or that it's still open
- Files/modules touched, if the change is non-trivial
- Anything the user should double check before merge

Keep each comment short and factual. Do not fabricate outcomes - if something is untested or
unresolved, say so in the comment.

## Step 5 - Check in to the current branch

- Confirm the current git branch (`git branch --show-current`); do not create a new branch unless
  asked.
- Stage only the files relevant to this ticket.
- Commit message format:

```
<PATH>-Ticket<NUMBER>: <one-line summary>

<short body: what changed and why, 2-4 lines>

Jira: <ISSUE-KEY>
```
- Do not push unless the user explicitly asks to push.

- Run `graphify save-result --question "<Step 0.5 question>" --answer "<what you found>" 
  --outcome useful --nodes <node labels>`.
- Use `--outcome dead_end` if the graph pointed to the wrong place.
- Use `--outcome corrected --correction "<the right answer>"` if the graph was wrong.
- Run `graphify reflect` after every tenth ticket. It writes
  `graphify-out/reflections/LESSONS.md` from the saved outcomes.

## Step 6 - Move the Jira ticket to Code Complete

- Transition the Jira issue to **Code Complete** (or the closest equivalent status in that project's
  workflow if "Code Complete" doesn't exist verbatim - check available transitions first and tell the
  user which status name you used).
- Post a final Jira comment summarizing what was implemented and linking the commit hash.
- **No graph.json**: skip Step 0.5. Tell the user. Offer to run `/graphify .` first.
- **Stale graph**: run `graphify update .`, then repeat the query.

## Step 7 - Report back in chat

Summarize in chat (not a file):
- Local ticket file path
- Jira issue key + link
- Final Jira status
- Commit hash + message
- Any open issues or follow-ups noted on the ticket

## Edge cases

- **No Jira connector available**: stop after Step 1, tell the user, and offer to continue once Jira
  is connected.
- **Not a git repo / no current branch**: stop before Step 5, tell the user.
- **Ticket number collision**: bump to next available number, note it in chat.
- **Ambiguous acceptance criteria**: implement your best interpretation but flag it explicitly both
  in the Jira notes and in the final chat summary - never silently assume scope.

  ## If you think you are stuck, blocked etc, Before stoping to ask human you must ask the questionb to /mr-wolff that skill solves problems