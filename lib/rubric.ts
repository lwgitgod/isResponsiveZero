// Rubric shape, authoring prompt, and validation checks.
// Simplified TypeScript port of RUBRIC_GOLD/rubric_web_prompt.md, RUBRIC_GOLD/rubric_set.schema.json
// and the mechanical gates run by RUBRIC_GOLD/validate_rubric.py. Categories and per-request
// questions use the `covers` / `not_for` shape from _DocClassify_MVP/config/categories.json,
// because that is the input shape the Jev classifier was proven with.

export interface CoversNotFor {
  covers: string;
  not_for: string;
}

export interface DocumentCategory {
  name: string;
  description: CoversNotFor;
  typically_responsive: boolean;
}

export interface Criterion {
  id: string;
  description: string;
  example_phrases: string[];
  weight: "primary" | "secondary" | "context";
}

export interface Exclusion {
  description: string;
  rationale: string;
}

export interface RfpRubric {
  rfp_id: string;
  rfp_text_verbatim: string;
  rfp_text_summary: string;
  question: string;
  covers: string;
  not_for: string;
  document_categories: string[];
  responsiveness_criteria: Criterion[];
  exclusions: Exclusion[];
  decision_rule: string;
  causes_of_action_supported: string[];
}

export interface CauseOfAction {
  id: string;
  name: string;
  elements: string[];
}

export interface KeyActor {
  role: string;
  name: string | null;
  aliases: string[];
}

export interface CaseMetadata {
  case_caption: string;
  summary: string;
  key_actors: KeyActor[];
  causes_of_action: CauseOfAction[];
  case_specific_terms: string[];
  extraction_notes: string;
}

export interface Rubric {
  case_metadata: CaseMetadata;
  rfp_rubrics: Record<string, RfpRubric>;
  expected_rfp_ids: string[];
  category_instructions: { question: string; note: string };
  no_match_label: string;
  no_match_description: string;
  document_categories: DocumentCategory[];
}

// Categories the rubric must always contain (names verbatim), so results can be compared
// against a fixed answer key. The model may add a few more.
export const SEED_CATEGORIES: readonly string[] = [
  "Bank Statement or Transaction Record",
  "Stock Certificate, Ledger or Cap Table",
  "Corporate Formation or Governance Document",
  "Ownership or Equity Agreement",
  "Accounting Record or Financial Statement",
  "Email or Message",
  "Invoice or Receipt",
  "Marketing, Newsletter or Spam",
  "Personal or Social Communication",
  "Other Business Document",
];

export const NO_MATCH_LABEL = "None of the above";

export const RUBRIC_SYSTEM_PROMPT = `You are a senior litigation attorney preparing a Technology-Assisted Review. Read the COMPLAINT and the REQUESTS FOR PRODUCTION and produce a single JSON object: a responsiveness "rubric" that a downstream classifier will use to decide, document by document, whether each document is responsive and what kind of document it is.

OUTPUT CONTRACT (follow exactly):
- Output ONLY the JSON object. No prose, no markdown fences.
- Top-level keys, exactly: "case_metadata", "rfp_rubrics", "expected_rfp_ids", "category_instructions", "no_match_label", "no_match_description", "document_categories".

"case_metadata": {
  "case_caption": string,
  "summary": string (2-4 sentences, plain English, naming the parties and the company),
  "key_actors": [{ "role": string, "name": string or null, "aliases": [string] }],
  "causes_of_action": [{ "id": "coa-1", "name": string, "elements": [string] }]  (ids coa-1, coa-2, ...; only claims the complaint actually pleads or clearly implies),
  "case_specific_terms": [string],
  "extraction_notes": string (flag ambiguities)
}

"rfp_rubrics": an OBJECT keyed "RFP_01", "RFP_02", ... (zero-padded, one per numbered request). The key MUST equal the entry's "rfp_id". Each entry:
{
  "rfp_id": "RFP_01",
  "rfp_text_verbatim": the request text,
  "rfp_text_summary": one sentence,
  "question": ONE short plain-English yes/no question about \`document.text\`, e.g. "Does \`document.text\` show who owns Brightline Ventures, Inc. or who holds shares in it?",
  "covers": one or two sentences: what a responsive document for this request looks like (concrete document types and content),
  "not_for": one or two sentences: near-misses that are NOT responsive to this request, and which other request (by id) they belong to instead, if any,
  "document_categories": [names from "document_categories" below that are typically responsive to this request],
  "responsiveness_criteria": [{ "id": "C1", "description": non-empty, "example_phrases": [unique strings, at most 4], "weight": "primary"|"secondary"|"context" }]  (1-3 criteria; at least ONE must be "primary"),
  "exclusions": [{ "description": string, "rationale": string }]  ([] if none),
  "decision_rule": one sentence, e.g. "Responsive if any primary criterion matches",
  "causes_of_action_supported": ["coa-1", ...]  (ids that exist in case_metadata.causes_of_action)
}

"expected_rfp_ids": array listing EVERY key of "rfp_rubrics".

"category_instructions": { "question": "What type of document is \`document.text\`? Judge only from the document's content. Pick the single type that best describes the document as a whole.", "note": "\`document.text\` may be only the opening portion of a longer document." }
"no_match_label": "${NO_MATCH_LABEL}"
"no_match_description": "The content does not clearly fit any of the listed document types, or the text is too short, garbled, or empty to tell."

"document_categories": [{ "name": string, "description": { "covers": string, "not_for": string }, "typically_responsive": boolean }]
- You MUST include these categories with these EXACT names: ${SEED_CATEGORIES.map((c) => JSON.stringify(c)).join(", ")}.
- You may add at most 4 more categories if this matter clearly needs them.
- "covers" lists what belongs in the category; "not_for" names near-misses and which category (by exact name) they belong to instead.

HARD RULES (the rubric is rejected if any is violated):
1. "expected_rfp_ids" is non-empty and every id has an entry in "rfp_rubrics".
2. Every "rfp_rubrics" entry has at least one "primary" criterion.
3. Every "causes_of_action_supported" id exists in case_metadata.causes_of_action.
4. No criterion has an empty "description"; no duplicate "example_phrases" within a criterion.
5. Each "rfp_rubrics" key equals its entry's "rfp_id".
6. Every entry has a non-empty "question", "covers" and "not_for".
7. "document_categories" contains every required category name exactly once.

Be concise: keep every string short. Do not invent facts. If the complaint uses placeholders like [COMPANY NAME] or [PERSON A] and the text maps them to real names, use the real names.`;

export function buildRubricUserPrompt(complaint: string, rfps: string[]): string {
  return `COMPLAINT:\n<<<\n${complaint.trim()}\n>>>\n\nREQUESTS FOR PRODUCTION:\n<<<\n${rfps
    .map((r) => r.trim())
    .filter(Boolean)
    .join("\n")}\n>>>\n\nOutput ONLY the JSON object.`;
}

export interface ValidationIssue {
  code: string;
  rfp_id: string | null;
  message: string;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Mechanical gates, ported from the checks enforced by validate_rubric.py plus the category checks
// this app needs. Returns an empty list when the rubric is usable.
export function validateRubric(value: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string, rfp_id: string | null = null): void => {
    issues.push({ code, rfp_id, message });
  };
  if (!isObject(value)) {
    add("schema", "Rubric is not a JSON object.");
    return issues;
  }
  const r = value as Partial<Rubric>;
  if (!isObject(r.case_metadata)) add("schema", "Missing case_metadata object.");
  if (!isObject(r.rfp_rubrics)) add("schema", "Missing rfp_rubrics object.");
  if (!Array.isArray(r.expected_rfp_ids) || r.expected_rfp_ids.length === 0)
    add("coverage", "expected_rfp_ids must be a non-empty array.");
  if (!Array.isArray(r.document_categories) || r.document_categories.length === 0)
    add("categories", "document_categories must be a non-empty array.");
  if (issues.length > 0) return issues;

  const rubric = r as Rubric;
  const coaIds = new Set((rubric.case_metadata.causes_of_action ?? []).map((c) => c.id));
  const categoryNames = new Set<string>();
  for (const c of rubric.document_categories) {
    if (!c?.name) add("categories", "A category has no name.");
    else if (categoryNames.has(c.name)) add("categories", `Duplicate category name: ${c.name}`);
    else categoryNames.add(c.name);
    if (!c?.description?.covers || !c?.description?.not_for)
      add("categories", `Category "${c?.name}" needs description.covers and description.not_for.`);
  }
  for (const seed of SEED_CATEGORIES) {
    if (!categoryNames.has(seed)) add("categories", `Required category missing: ${seed}`);
  }

  const keys = Object.keys(rubric.rfp_rubrics);
  for (const id of rubric.expected_rfp_ids) {
    if (!rubric.rfp_rubrics[id]) add("coverage", `expected_rfp_ids lists ${id} but rfp_rubrics has no entry.`, id);
  }
  for (const key of keys) {
    if (!rubric.expected_rfp_ids.includes(key)) add("coverage", `rfp_rubrics has ${key} not listed in expected_rfp_ids.`, key);
    const e = rubric.rfp_rubrics[key];
    if (!isObject(e)) {
      add("schema", "Entry is not an object.", key);
      continue;
    }
    if (e.rfp_id !== key) add("key_mismatch", `Map key ${key} != rfp_id ${e.rfp_id}.`, key);
    if (!e.question?.trim() || !e.covers?.trim() || !e.not_for?.trim())
      add("question", "Entry needs non-empty question, covers and not_for.", key);
    const crit = Array.isArray(e.responsiveness_criteria) ? e.responsiveness_criteria : [];
    if (!crit.some((c) => c.weight === "primary")) add("no_primary", "No criterion has weight 'primary'.", key);
    for (const c of crit) {
      if (!c.description?.trim()) add("empty_description", `Criterion ${c.id} has an empty description.`, key);
      const phrases = Array.isArray(c.example_phrases) ? c.example_phrases : [];
      if (new Set(phrases).size !== phrases.length) add("dup_phrases", `Criterion ${c.id} repeats an example phrase.`, key);
    }
    for (const coa of e.causes_of_action_supported ?? []) {
      if (!coaIds.has(coa)) add("unknown_coa", `Unknown cause of action id ${coa}.`, key);
    }
  }
  return issues;
}
