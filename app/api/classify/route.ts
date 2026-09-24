import { NextResponse } from "next/server";
import { extractText } from "@/lib/extract";
import { classifyWithJev, JevError } from "@/lib/jev";
import { validateRubric, type Rubric } from "@/lib/rubric";

export const runtime = "nodejs";
export const maxDuration = 120;

// Multipart form: `file` (the document) and `rubric` (JSON string).
// Text is extracted in memory and discarded after the Jev call.
export async function POST(req: Request): Promise<NextResponse> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Body must be multipart form data." }, { status: 400 });
  }
  const file = form.get("file");
  const rubricRaw = form.get("rubric");
  if (!(file instanceof File) || typeof rubricRaw !== "string") {
    return NextResponse.json({ error: "Fields `file` and `rubric` are required." }, { status: 400 });
  }
  let rubric: unknown;
  try {
    rubric = JSON.parse(rubricRaw);
  } catch {
    return NextResponse.json({ error: "rubric is not valid JSON." }, { status: 400 });
  }
  const issues = validateRubric(rubric);
  if (issues.length > 0) {
    return NextResponse.json({ error: "Rubric failed validation.", issues }, { status: 422 });
  }

  const filename = file.name;
  const { text, note } = await extractText(filename, Buffer.from(await file.arrayBuffer()));
  if (!text) {
    console.log(`[classify] ${filename}: skipped (${note})`);
    return NextResponse.json({ filename, status: "skipped", note });
  }
  try {
    const result = await classifyWithJev(rubric as Rubric, text);
    console.log(
      `[classify] ${filename}: ${result.responsive ? "Responsive" : "Not Responsive"} p=${result.responsive_probability.toFixed(2)} rfps=${result.rfps.join(",") || "-"} category=${result.category}`,
    );
    return NextResponse.json({ filename, status: "ok", chars: text.length, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[classify] ${filename}: error ${message}`);
    return NextResponse.json({ filename, status: "error", note: message }, { status: err instanceof JevError ? 502 : 500 });
  }
}
