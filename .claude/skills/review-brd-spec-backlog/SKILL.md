---
name: review-brd-spec-backlog
description: Review a BRD, technical spec, and backlog together for intent alignment, scope drift, omission, and ticket bloat. Use when all three planning artifacts already exist and Codex needs a sanity check that the spec and backlog still match the BRD's actual project intent before implementation, re-planning, or approval.
---

# BRD Spec Backlog Reviewer

## Inputs

1. BRD path
2. Spec path
3. Backlog path

If any input is missing, stop and ask for it. Do not review a spec or backlog without the BRD. Do not review a backlog without the spec that justified it.

## Source Of Truth

- The BRD defines project intent and the scope ceiling.
- The spec may clarify implementation, but it may not add business scope without BRD support.
- The backlog may decompose work, but it may not add capabilities, platform work, or polish not justified by the BRD or spec.
- If the three documents conflict, the precedence order is: BRD, then spec, then backlog.

## Workflow

1. Read the BRD first and reduce it to the smallest possible statement of business intent.
2. Read the spec and trace every major capability, module, and technology choice back to the BRD.
3. Read the backlog and trace every epic and ticket back to both the BRD and spec.
4. Flag additions, omissions, fragmentation, and vague scope language.
5. Write the review file. Do not rewrite the source documents.

## Output

Write one versioned file in the same folder as the backlog:

- `[base]-alignment-review.md`
- If that exists, create `[base]-alignment-review-v2.md`, then `-v3.md`, and so on.

Derive `base` from the BRD filename by removing a trailing `-brd` or `-BRD` before `.md`. If no such suffix exists, remove only `.md`.

Use this exact structure:

```md
# Alignment Review: [base]

## Source Documents
- BRD: [path]
- Spec: [path]
- Backlog: [path]

## Verdict
[One line: CLEAN / MINOR DRIFT / BLOATED / BROKEN CHAIN]

## BRD Intent
- [2-4 bullets describing what the business is actually asking for]

## Findings

### 1. Spec Drift From BRD
[One line per finding. Format: "Spec Section X proposes [thing]. BRD does not require it. Verdict: delete or cite."]
If none: "None."

### 2. Backlog Drift From BRD Or Spec
[One line per finding. Format: "Backlog [ID] includes [work]. Not traceable to BRD Section X or Spec Section Y. Verdict: delete, merge, or mark as scope addition."]
If none: "None."

### 3. Missing Coverage
[One line per finding. Format: "BRD Section X / Spec Section Y requires [thing]. No backlog item clearly covers it. Verdict: add coverage or mark out of scope explicitly."]
If none: "None."

### 4. Ticket Bloat
[One line per finding. Format: "Backlog [ID] is too thin and should merge into [ID or group]. Reason: [why]. Verdict: merge."]
If none: "None."

### 5. Ambiguous Scope Language
[One line per finding. Format: "Spec Section X or Backlog [ID]: '[quoted phrase]'. No concrete boundary or measure. Verdict: replace with a specific limit, outcome, or delete."]
If none: "None."

## Release Decision
[2-3 lines maximum. State whether implementation should proceed now or whether the planning chain needs revision first.]
```

## What To Flag

### 1. Spec drift

Flag:

- Features or modules that do not map to a BRD requirement
- Technology or infrastructure choices justified only by taste, future-proofing, or vague scale claims
- Architectural layers added without a clear business or workload reason

### 2. Backlog drift

Flag:

- Tickets for work not supported by the BRD or spec
- Platform, observability, hardening, analytics, or polish tickets unless explicitly required
- Tickets that quietly expand scope beyond the spec

### 3. Missing chain coverage

Flag:

- Core BRD outcomes present in the spec but absent from the backlog
- Acceptance-critical spec work with no clear ticket coverage
- Explicit BRD non-goals that reappear later in the chain

### 4. Ticket bloat

Flag:

- Multiple tickets that are really one cohesive implementation unit
- Tickets that look like less than a day of isolated work
- Duplicate or near-duplicate tickets
- Slicing by layer when the work will obviously be implemented together

### 5. Ambiguous scope language

Flag terms like:

- scalable
- robust
- extensible
- flexible
- production-ready
- enterprise-grade
- future-proof
- reusable
- generic
- best-practice

If a phrase lacks a concrete boundary, target, or explicit business reason, flag it.

## Rules

- Keep findings short. One line per finding.
- Prefer delete or merge over expand.
- Do not invent missing requirements.
- Do not redesign the system.
- Do not propose technologies.
- Do not add backlog tickets yourself.
- If a backlog item has no ticket ID, cite the heading text instead.
- If the backlog already cites traceability, verify the citation actually supports the work.
- Zero findings is a valid result.

## Verdict Guide

- `CLEAN`: No meaningful drift, no missing chain coverage, and no ticket bloat worth action.
- `MINOR DRIFT`: 1-3 isolated findings that do not change the project shape.
- `BLOATED`: 4+ findings, or any major added capability, architecture lane, or obvious ticket explosion.
- `BROKEN CHAIN`: At least one core BRD requirement is missing downstream, or the backlog materially diverges from the spec.

## Out Of Scope

Do not spend review effort on:

- code quality
- naming
- implementation details not visible in the planning artifacts
- security critiques unless security scope was explicitly part of the BRD
- testing philosophy unless the BRD or spec made it a required deliverable
- UI taste or document writing style

## Tone

Direct. Technical. Low-drama. The value of this skill is deciding whether the planning chain still matches the business intent, not performing a general critique.
