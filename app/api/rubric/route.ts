import { NextResponse } from "next/server";
import { deepseekJson, DeepSeekError } from "@/lib/deepseek";
import { RUBRIC_SYSTEM_PROMPT, buildRubricUserPrompt, validateRubric } from "@/lib/rubric";

export const runtime = "nodejs";
export const maxDuration = 300;

interface RubricRequest {
  complaint?: unknown;
  rfps?: unknown;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: RubricRequest;
  try {
    body = (await req.json()) as RubricRequest;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const complaint = typeof body.complaint === "string" ? body.complaint : "";
  const rfps = Array.isArray(body.rfps) ? body.rfps.filter((r): r is string => typeof r === "string" && r.trim() !== "") : [];
  if (!complaint.trim() || rfps.length === 0) {
    return NextResponse.json({ error: "complaint and at least one RFP are required." }, { status: 400 });
  }

  const started = Date.now();
  try {
    const { json, model } = await deepseekJson(RUBRIC_SYSTEM_PROMPT, buildRubricUserPrompt(complaint, rfps), 8192);
    const issues = validateRubric(json);
    console.log(`[rubric] model=${model} ms=${Date.now() - started} issues=${issues.length}`);
    return NextResponse.json({ rubric: json, issues, model });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[rubric] failed: ${message}`);
    return NextResponse.json({ error: message }, { status: err instanceof DeepSeekError ? 502 : 500 });
  }
}
