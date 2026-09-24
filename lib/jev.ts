// TypeSafe Jev call for one document. Docs: https://docs.typesafe.ai/api
// POST https://api.typesafe.ai/v1/systemone, Authorization: Bearer <TYPESAFE_API_KEY>.
// One request per document asks, in parallel on the Jev side:
//   - one Noul (yes/no probability) per RFP, phrased as the rubric's question + covers/not_for
//   - one Choice over the rubric's document categories (the _DocClassify_MVP category shape)
// Settings reused from _DocClassify_MVP/config/settings.json: model jev-latest, 12000-char excerpt,
// 0.4 category confidence threshold.

import type { Rubric } from "./rubric";

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
export const JEV_MODEL = "jev-latest";
export const EXCERPT_CHARS = 12000;
export const CATEGORY_CONFIDENCE_THRESHOLD = 0.4;
// A document is Responsive when any RFP's yes-probability reaches this value.
export const RESPONSIVE_THRESHOLD = 0.5;

const CATEGORY_QID = "document_category";

export class JevError extends Error {}

interface NoulQuestion {
  type: "noul";
  instructions: unknown;
  criteria?: { true: string; false: string };
}
interface ChoiceQuestion {
  type: "choice";
  instructions: unknown;
  criteria: Record<string, unknown>;
}
type Question = NoulQuestion | ChoiceQuestion;

interface JevAnswer {
  type: "noul" | "choice" | "score";
  noul?: number;
  choice?: string;
  probabilities?: Record<string, number>;
  confidence?: number;
}
interface JevResponse {
  model?: string;
  answers?: Record<string, JevAnswer>;
}

export interface RfpScore {
  rfp_id: string;
  probability: number;
}

export interface Classification {
  responsive: boolean;
  responsive_probability: number;
  rfps: string[];
  rfp_scores: RfpScore[];
  category: string;
  category_confidence: number;
  category_low_confidence: boolean;
  model: string;
}

function buildQuestions(rubric: Rubric): Record<string, Question> {
  const questions: Record<string, Question> = {};
  for (const id of rubric.expected_rfp_ids) {
    const e = rubric.rfp_rubrics[id];
    if (!e) continue;
    questions[id] = {
      type: "noul",
      instructions: {
        question: e.question,
        request_for_production: e.rfp_text_verbatim,
        note: "`document.text` may be only the opening portion of a longer document. `case` describes the lawsuit.",
      },
      criteria: { true: e.covers, false: e.not_for },
    };
  }
  const criteria: Record<string, unknown> = {};
  for (const c of rubric.document_categories) criteria[c.name] = c.description;
  criteria[rubric.no_match_label] = rubric.no_match_description;
  questions[CATEGORY_QID] = { type: "choice", instructions: rubric.category_instructions, criteria };
  return questions;
}

export async function classifyWithJev(rubric: Rubric, text: string): Promise<Classification> {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) throw new JevError("TYPESAFE_API_KEY is not set in .env.local");
  const excerpt = text.slice(0, EXCERPT_CHARS);
  const state = {
    case: {
      caption: rubric.case_metadata.case_caption,
      summary: rubric.case_metadata.summary,
      key_actors: rubric.case_metadata.key_actors,
    },
    document: { text: excerpt, truncated: text.length > excerpt.length },
  };
  const body = JSON.stringify({ model: JEV_MODEL, state, questions: buildQuestions(rubric) });

  let res: Response | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(60_000),
    });
    if (res.status !== 429 && res.status !== 529) break;
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); // backoff per Jev docs
  }
  if (!res || !res.ok) throw new JevError(`Jev HTTP ${res?.status}: ${(await res?.text())?.slice(0, 300)}`);
  const data = (await res.json()) as JevResponse;
  const answers = data.answers ?? {};

  const rfp_scores: RfpScore[] = rubric.expected_rfp_ids
    .filter((id) => typeof answers[id]?.noul === "number")
    .map((id) => ({ rfp_id: id, probability: answers[id].noul as number }));
  const rfps = rfp_scores.filter((s) => s.probability >= RESPONSIVE_THRESHOLD).map((s) => s.rfp_id);
  const responsive_probability = rfp_scores.reduce((m, s) => Math.max(m, s.probability), 0);

  const cat = answers[CATEGORY_QID];
  const category = cat?.choice ?? rubric.no_match_label;
  const category_confidence = cat?.probabilities?.[category] ?? cat?.confidence ?? 0;

  return {
    responsive: rfps.length > 0,
    responsive_probability,
    rfps,
    rfp_scores,
    category,
    category_confidence,
    category_low_confidence: category_confidence < CATEGORY_CONFIDENCE_THRESHOLD,
    model: data.model ?? JEV_MODEL,
  };
}
