---
name: jev-fit-translator
description: >-
  Evaluate a process, workflow, policy, prompt, agent step, or piece of code to determine
  whether TypeSafe AI Jev can replace or improve any part of it. Decompose the input into
  bounded probabilistic decisions, deterministic code, and generative reasoning. When Jev
  is a fit, show the basic mechanics for rewriting the system around Jev using Noul, Choice,
  and Score decisions, confidence gates, and ordinary code. Trigger on requests such as
  "Can Jev do this?", "Jevify this", "rewrite this for Jev", "could this use Jev?", or
  when the user supplies a workflow/code path and asks whether Jev can handle it.
---

# Jev Fit Translator

## Mission

Given any described process, workflow, policy, agent, prompt, or code path, determine where Jev can be used effectively and show how to restructure the system around it.

Do not limit the analysis to literal one-for-one replacement.

The core question is not:

> Can Jev do the whole task?

The core questions are:

1. Where does the system make a fuzzy judgment?
2. Can the possible outputs of that judgment be defined in advance?
3. Can Jev answer that judgment while ordinary code handles arithmetic, validation, state transitions, side effects, and exact rules?
4. Can a generative model be reserved only for the portions that actually require open-ended text, planning, synthesis, or novel reasoning?

Think in terms of architecture, not prompt substitution.

## Mental Model

Treat Jev as a fast typed probabilistic decision function:

`state -> bounded decisions + probabilities/confidence`

Treat ordinary code as the deterministic execution layer:

`facts + rules + decisions -> actions`

Treat a generative model as the open-ended reasoning or language layer:

`context -> novel text / explanation / planning / transformation`

A strong rewrite often becomes:

`input -> normalize state -> Jev decisions -> deterministic policy -> action`

or:

`input -> Jev routing/gating -> code -> optional LLM -> verification -> action`

## Jev Primitives

Use these conceptual primitives when proposing a rewrite:

### Noul

Use for a binary or yes/no judgment.

Examples:

- Does this message request a refund?
- Is there evidence of fraud?
- Does this clause materially conflict with the policy?
- Should this case be escalated?

Expected result: probability of yes/no.

### Choice

Use when one answer must be selected from a bounded set.

Examples:

- Route: billing | technical | sales | account
- Document type: invoice | receipt | contract | correspondence | other
- Next action: approve | hold | reject | review
- Tool: SQL | search | Python | human

Expected result: selected option plus a probability distribution/confidence.

### Score

Use for an ordered judgment.

Examples:

- urgency: trivial | low | medium | high | critical
- semantic match: none | weak | moderate | strong | exact
- risk severity: 1..5
- confidence that evidence supports the proposition: 1..7

Expected result: an ordered score/distribution/confidence.

Do not use Score for exact arithmetic that code can calculate directly.

## Fit Taxonomy

Classify the overall input into exactly one of these architectural outcomes.

### DIRECT JEV FIT

Most of the meaningful intelligence is bounded classification, ranking, scoring, routing, gating, extraction-to-enum, verification, or yes/no judgment.

Typical rewrite:

`state -> Jev -> code branch`

### JEV + CODE

The task contains fuzzy judgments, but deterministic code should own exact rules, arithmetic, comparisons, database operations, permissions, workflow state, and side effects.

Typical rewrite:

`state -> Jev decisions -> deterministic rule engine -> action`

This is frequently the best architecture.

### JEV + GENERATIVE MODEL

Jev can substantially improve routing, gating, scoring, verification, or tool selection, but some step genuinely requires open-ended generation, synthesis, explanation, planning, drafting, or transformation.

Typical rewrite:

`state -> Jev -> selected path -> LLM/tool -> Jev verifier or code -> action`

### POOR JEV FIT

The core task is primarily:

- open-ended writing
- code generation
- long-form summarization
- mathematical derivation
- exact computation
- database retrieval without fuzzy judgment
- unconstrained planning
- creating novel schemas or categories at runtime
- producing rich explanations as the main deliverable

Even in a poor overall fit, still inspect the edges for useful Jev gates, routers, validators, or confidence checks.

## Analysis Procedure

### Step 1: State the apparent job

Summarize what the submitted system is actually trying to accomplish in one or two sentences.

Do not merely restate implementation details.

### Step 2: Decompose the workflow

Break the system into atomic steps and label each one:

- `DETERMINISTIC` - ordinary code should do it
- `JEV-CANDIDATE` - fuzzy decision with bounded outputs
- `GENERATIVE` - genuinely open-ended reasoning or text generation
- `EXTERNAL` - database, API, tool, filesystem, human approval, or side effect

Look especially for hidden Jev candidates disguised as prompts, chains of if/else statements, manual review rules, agent routing, relevance filters, confidence heuristics, regex forests, brittle keyword rules, moderation gates, policy interpretation, and scoring rubrics.

### Step 3: Apply the bounded-output test

A step is a strong Jev candidate when all or most of the following are true:

- The state can be represented in text or structured data.
- The desired output space is known before inference.
- The decision is semantic or probabilistic rather than exact arithmetic.
- A useful action can be taken from the typed result.
- Confidence can meaningfully determine automation versus review.
- Similar decisions occur repeatedly or at scale.
- Failure can be contained by thresholds, deterministic rules, or escalation.

### Step 4: Find the non-obvious rewrite

Do not stop at the current architecture.

Ask:

- Can one broad prompt be decomposed into several independent narrow decisions?
- Can exact calculations be pulled out of the model and moved into code?
- Can generated text be postponed until after Jev chooses the route?
- Can Jev decide whether an LLM call is needed at all?
- Can Jev choose which tool, model, policy branch, or human queue should handle the case?
- Can Jev verify an LLM output after generation?
- Can several judgments be made in parallel instead of sequentially?
- Can confidence replace a brittle hard-coded cutoff?
- Can a manual triage queue become high-confidence auto-action plus low-confidence review?
- Can an expensive agent loop become one Jev decision followed by a narrow executor?

This is the "outside the box" portion of the skill.

### Step 5: Separate judgment from policy

Never ask Jev to do something that ordinary code can express exactly.

Bad:

`Should this invoice be approved under the policy?`

Better:

Jev:

- `is_vendor_identity_suspicious?` -> Noul
- `expense_category` -> Choice
- `receipt_description_match` -> Score

Code:

- compare totals
- check dates
- test approval thresholds
- verify duplicate invoice IDs
- apply policy precedence
- select final action

The system should use Jev for semantic judgment and code for policy execution.

### Step 6: Design the Jev state

Propose the minimum state Jev actually needs.

Prefer a compact structured object over dumping an entire application state when possible.

Example:

```json
{
  "message": "Customer says the same card charge appeared twice",
  "account": {
    "plan": "pro",
    "status": "active"
  },
  "recent_transactions": [
    {"merchant": "ACME", "amount": 49, "status": "settled"},
    {"merchant": "ACME", "amount": 49, "status": "settled"}
  ]
}
```

Include facts required for the judgment. Exclude data that should be processed deterministically first.

### Step 7: Design the typed questions

For every Jev candidate, specify:

- question name
- primitive: Noul | Choice | Score
- exact bounded outputs
- what evidence in the state it should consider
- how downstream code will use the answer

Prefer multiple narrow questions over one vague policy question.

### Step 8: Design confidence handling

Never treat a probabilistic answer as infallible.

For each important decision, define one of:

- high confidence -> automate
- medium confidence -> invoke additional check or stronger model
- low confidence -> human review

Use thresholds as configurable policy, not universal constants.

Example pseudocode:

```ts
if (decision.confidence >= AUTO_THRESHOLD) {
  execute(decision.value)
} else if (decision.confidence >= REVIEW_WITH_LLM_THRESHOLD) {
  runSecondaryAnalysis()
} else {
  sendToHumanReview()
}
```

Do not imply that these field names or function signatures match the current Jev SDK unless current documentation has been verified. Treat code examples as architecture pseudocode unless the user explicitly asks for current executable API code.

### Step 9: Produce the verdict

Return one architecture classification:

- DIRECT JEV FIT
- JEV + CODE
- JEV + GENERATIVE MODEL
- POOR JEV FIT

Then explain why in concrete terms.

Do not give a numeric "Jev score" unless the user explicitly asks for one.

## Required Output Format

Use this structure unless the user asks for another format.

### Jev verdict

`<DIRECT JEV FIT | JEV + CODE | JEV + GENERATIVE MODEL | POOR JEV FIT>`

One short paragraph explaining the result.

### What Jev should decide

A compact table:

| Decision | Primitive | Outputs | Why Jev |
|---|---|---|---|
| ... | Noul/Choice/Score | ... | ... |

If no Jev decisions are useful, say so plainly.

### What should stay outside Jev

Identify deterministic code, tools, databases, side effects, human approvals, and generative steps that should not be pushed into Jev.

### Jev-shaped rewrite

Show the new pipeline in one line, for example:

`request -> normalize -> Jev classify + risk score -> policy code -> route -> optional LLM -> action`

Then provide basic pseudocode showing the mechanics.

### Why this is better

Only mention benefits that actually follow from the redesign, such as:

- fewer generative model calls
- bounded outputs
- easier validation
- explicit uncertainty handling
- lower latency for repeated decisions
- clearer separation of semantic judgment from business policy
- simpler testing and observability

### Watch-outs

Name the real failure modes:

- categories are poorly defined
- answer space is not actually bounded
- required context is missing
- the task depends on exact computation
- confidence thresholds are uncalibrated for the application
- categories overlap
- policy logic has been incorrectly embedded in the model question
- human review is required for consequential low-confidence cases

## Code Inspection Heuristics

When given code, actively search for these patterns.

### Large if/else or switch blocks over semantic inputs

Example:

```ts
if (text.includes("refund") || text.includes("money back")) {
  route = "billing"
} else if (text.includes("password") || text.includes("login")) {
  route = "account"
}
```

Likely rewrite:

```text
Choice: route = billing | account | technical | sales | other
```

Keep the actual dispatch logic in code.

### LLM calls that only return JSON labels

If a large generative model is being called mainly to emit a category, boolean, ordinal score, tool choice, or routing decision, flag it as a strong Jev candidate.

### Agent tool selection

If an agent asks an LLM "which tool should I use?", consider:

```text
Choice: tool = sql | web | crm | email | human | none
```

Then let deterministic code call the selected tool.

### Guardrails and verification

Consider Jev for:

- did the answer satisfy the policy?
- does the output contradict the source data?
- is escalation required?
- is this likely prompt injection?
- does this response claim an action happened when records say it did not?

### Relevance filtering

Before expensive retrieval, reasoning, or generation, consider a Noul or Score gate:

```text
Is this document relevant to the issue? -> Noul
How strongly does it support the proposition? -> Score
```

### Human review queues

Replace "review everything" with:

`Jev -> confidence/policy gate -> auto-handle clear cases -> human handles ambiguous cases`

only when the application's risk level allows it.

## Process Inspection Heuristics

When given a business or operational process, look for words such as:

- decide
- classify
- prioritize
- route
- flag
- review
- judge
- detect
- match
- choose
- approve
- escalate
- verify
- triage
- rank
- assess
- screen

These often reveal a Jev-shaped decision boundary.

Also inspect manual steps described as "someone looks at X and decides Y." That is frequently a candidate for bounded probabilistic automation, even if the surrounding workflow is not AI-based today.

## Anti-Patterns

Do not propose Jev merely because AI is present.

Avoid these rewrites:

### Asking Jev for prose

Wrong:

`Write a reply to the customer.`

Instead:

Jev decides intent, risk, route, or response strategy. A template or generative model writes the reply if needed.

### Asking Jev for exact math

Wrong:

`Is 17% of 420 greater than 70?`

Use code.

### Asking one giant policy question

Wrong:

`Should we approve this claim under all company policies?`

Decompose semantic judgments, then apply policy in code.

### Inventing categories during inference

Wrong:

`What categories exist in these documents?`

That is discovery/generative analysis. First discover the taxonomy with a generative model or human, then use Jev to classify into the fixed taxonomy.

### Pretending the entire workflow is a Jev fit

If the workflow contains generation, databases, API calls, calculations, or side effects, say so and isolate Jev to the decision layer.

## Example

Input system:

> We send every support email to a large LLM. It reads the message, decides whether it is billing, technical, cancellation, or sales, decides urgency, decides whether a human is required, and writes the response. Then our code sends it.

Analysis:

### Jev verdict

`JEV + GENERATIVE MODEL`

Jev can take over the routing, urgency, and escalation decisions. The LLM is still useful when a custom response must be written.

### What Jev should decide

| Decision | Primitive | Outputs |
|---|---|---|
| intent | Choice | billing, technical, cancellation, sales, other |
| urgency | Score | low, medium, high, critical |
| human_required | Noul | yes/no |
| template_sufficient | Noul | yes/no |

### What should stay outside Jev

- account lookups
- deterministic policy checks
- sending email
- generating novel replies
- logging and audit records

### Jev-shaped rewrite

```text
email
  -> build customer state
  -> Jev(intent, urgency, human_required, template_sufficient)
  -> policy code
      -> human queue, OR
      -> fixed template, OR
      -> narrow LLM drafting call
  -> validation
  -> send
```

Potential improvement: the generative model is no longer the default first step. It becomes an exception path used only when the typed decisions indicate that free-form drafting is necessary.

## Advanced Architectural Patterns

### Jev as front-door router

Use Jev before an expensive agent or LLM:

`request -> Jev Choice(tool/model/path) -> selected executor`

### Jev as call suppressor

Use Jev to decide whether an expensive downstream call is necessary:

`state -> Jev Noul(needs_deep_reasoning?) -> skip or invoke LLM`

### Jev as semantic feature extractor

Convert messy unstructured input into stable typed features:

`document -> Jev questions -> typed feature vector -> ordinary application code`

### Jev as probabilistic rule input

Instead of letting AI own the whole decision, feed probabilities into business policy:

```ts
if (fraudProbability > fraudThreshold && amount > manualReviewFloor) {
  holdAndReview()
}
```

### Jev as verifier

After an LLM or agent acts, use Jev to judge bounded properties of the output:

`LLM output + source state -> Jev checks -> accept / retry / escalate`

### Jev as map-reduce classifier

For large collections:

`items -> parallel Jev decisions -> aggregate in code -> optional LLM synthesis`

Jev handles repeated local judgments. Code aggregates. A generative model is used only if a narrative synthesis is required.

### Jev as policy compiler target

When a policy document mixes exact rules with subjective phrases such as "material," "reasonable," "suspicious," or "substantially related":

1. compile exact predicates into code;
2. turn subjective predicates into narrow Jev questions;
3. combine both in an explicit decision graph.

This is especially useful for legal, compliance, operations, and review workflows where policy language contains both hard conditions and judgment calls.

## Precision Rules

- Distinguish "Jev can participate" from "Jev can solve the whole thing."
- Prefer decomposition over broad prompts.
- Prefer code over AI for deterministic facts and calculations.
- Prefer Jev over a generative LLM when the real output is a bounded decision.
- Prefer explicit uncertainty handling over pretending a decision is certain.
- Do not invent current SDK syntax, model names, limits, pricing, or API fields.
- If the user needs executable Jev code, verify the current official TypeSafe documentation first.
- If the user gives incomplete details, make a best-effort architecture using explicit assumptions rather than blocking on questions unless the missing detail materially changes the design.

## Compact Invocation

Users can invoke this skill with prompts like:

- `Jevify this workflow: ...`
- `Can Jev replace any of this code? ...`
- `Find the Jev-shaped decisions in this process: ...`
- `Rewrite this agent architecture around Jev where it makes sense: ...`
- `Tell me whether this is Direct Jev, Jev + Code, Jev + LLM, or a poor fit: ...`

## Reference Model

This skill assumes Jev is used as TypeSafe AI describes it: a System One model that accepts unstructured or structured state and produces typed probabilistic decisions for software. TypeSafe's published workflow material describes Noul as yes/no, Choice as one option among a defined set, and Score as an ordered scale. Current implementation details should be verified against official documentation before generating production API code.

Official references:

- https://typesafe.ai/
- https://typesafe.ai/blog/introducing-system-one-models-and-jev
- https://evals.typesafe.ai/
