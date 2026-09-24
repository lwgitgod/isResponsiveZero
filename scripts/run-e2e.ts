// End-to-end check through the same server routes the UI uses.
// 1. POST /api/rubric with the sample complaint + all 10 RFPs (skipped with --reuse-rubric if the file exists)
//    -> test-data-key/rubric.generated.json
// 2. POST every file in test-data/ (skipping names starting with "_") to /api/classify, 3 at a time
//    -> test-data-key/results.json
// 3. Score against test-data-key/answer_key.json -> test-data-key/score.json
// Usage: npx tsx scripts/run-e2e.ts [--base http://localhost:3100] [--reuse-rubric]

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SAMPLE_COMPLAINT, SAMPLE_RFP_BOXES } from "../lib/sample";

interface KeyEntry {
  responsive: boolean;
  strength: string;
  rfps: string[];
  category: string;
}
interface ResultRow {
  filename: string;
  status: string;
  responsive?: boolean;
  responsive_probability?: number;
  rfps?: string[];
  category?: string;
  note?: string;
}

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:3100";
const reuse = args.includes("--reuse-rubric");
const root = join(__dirname, "..");
const dataDir = join(root, "test-data");
const keyDir = join(root, "test-data-key");
const rubricPath = join(keyDir, "rubric.generated.json");

async function getRubric(): Promise<string> {
  if (reuse && existsSync(rubricPath)) {
    console.log(`reusing ${rubricPath}`);
    return readFileSync(rubricPath, "utf8");
  }
  const t = Date.now();
  const res = await fetch(`${base}/api/rubric`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ complaint: SAMPLE_COMPLAINT, rfps: SAMPLE_RFP_BOXES }),
  });
  const data = (await res.json()) as { rubric?: unknown; issues?: unknown[]; error?: string; model?: string };
  if (!res.ok || !data.rubric) throw new Error(`rubric route failed: HTTP ${res.status} ${data.error ?? ""}`);
  const text = JSON.stringify(data.rubric, null, 2);
  writeFileSync(rubricPath, text + "\n");
  const r = data.rubric as { expected_rfp_ids?: string[]; document_categories?: unknown[] };
  console.log(
    `rubric: HTTP ${res.status}, model=${data.model}, ${Date.now() - t} ms, rfps=${r.expected_rfp_ids?.length}, categories=${r.document_categories?.length}, validation issues=${data.issues?.length}`,
  );
  if ((data.issues?.length ?? 0) > 0) console.log(JSON.stringify(data.issues, null, 2));
  return text;
}

async function classifyAll(rubric: string): Promise<ResultRow[]> {
  const files = readdirSync(dataDir).filter((f) => !f.startsWith("_") && !f.startsWith(".")).sort();
  const results: ResultRow[] = new Array(files.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < files.length) {
      const i = next++;
      const name = files[i];
      const form = new FormData();
      form.append("file", new Blob([readFileSync(join(dataDir, name))]), name);
      form.append("rubric", rubric);
      try {
        const res = await fetch(`${base}/api/classify`, { method: "POST", body: form });
        results[i] = (await res.json()) as ResultRow;
      } catch (err) {
        results[i] = { filename: name, status: "error", note: String(err) };
      }
      const r = results[i];
      console.log(`${String(i + 1).padStart(3)} ${name}: ${r.status} ${r.responsive ? "R" : "-"} ${(r.rfps ?? []).join(",")} | ${r.category ?? r.note}`);
    }
  };
  await Promise.all(Array.from({ length: 3 }, worker));
  return results;
}

function score(results: ResultRow[]): Record<string, unknown> {
  const key = JSON.parse(readFileSync(join(keyDir, "answer_key.json"), "utf8")) as Record<string, KeyEntry>;
  let tp = 0, fp = 0, fn = 0, tn = 0, catRight = 0, catTotal = 0, rfpOverlap = 0, errors = 0;
  const byStrength: Record<string, { total: number; found: number }> = {};
  for (const r of results) {
    const k = key[r.filename];
    if (!k) continue;
    if (r.status !== "ok") {
      errors++;
      continue;
    }
    const pred = r.responsive === true;
    if (pred && k.responsive) tp++;
    else if (pred && !k.responsive) fp++;
    else if (!pred && k.responsive) fn++;
    else tn++;
    const s = (byStrength[k.strength] ??= { total: 0, found: 0 });
    s.total++;
    if (pred) s.found++;
    catTotal++;
    if ((r.category ?? "").toLowerCase() === k.category.toLowerCase()) catRight++;
    if (pred && k.responsive && (r.rfps ?? []).some((x) => k.rfps.includes(x))) rfpOverlap++;
  }
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return {
    classified: results.filter((r) => r.status === "ok").length,
    errors_or_skipped: errors,
    confusion: { tp, fp, fn, tn },
    precision: +precision.toFixed(3),
    recall: +recall.toFixed(3),
    f1: +f1.toFixed(3),
    category_accuracy: +(catTotal ? catRight / catTotal : 0).toFixed(3),
    true_positives_with_an_expected_rfp: `${rfpOverlap}/${tp}`,
    flagged_responsive_by_strength: byStrength,
  };
}

async function main(): Promise<void> {
  const rubric = await getRubric();
  const t = Date.now();
  const results = await classifyAll(rubric);
  writeFileSync(join(keyDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
  const s = { ...score(results), classify_seconds: Math.round((Date.now() - t) / 1000) };
  writeFileSync(join(keyDir, "score.json"), JSON.stringify(s, null, 2) + "\n");
  console.log(JSON.stringify(s, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
