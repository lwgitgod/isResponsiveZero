"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactElement } from "react";
import { SAMPLE_COMPLAINT, SAMPLE_RFP_BOXES } from "@/lib/sample";
import { validateRubric, type Rubric, type ValidationIssue } from "@/lib/rubric";

interface Row {
  filename: string;
  status: "pending" | "ok" | "skipped" | "error";
  responsive?: boolean;
  responsive_probability?: number;
  rfps?: string[];
  category?: string;
  category_confidence?: number;
  note?: string;
}

type Filter = "all" | "responsive" | "not" | "problem";

const CONCURRENCY = 3;
const PAGE_SIZE = 50;
const STORAGE_KEY = "isResponsiveZero.rubric";

// Non-standard attribute needed for folder picking.
const folderAttrs = { webkitdirectory: "", directory: "" } as unknown as InputHTMLAttributes<HTMLInputElement>;

function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Row[]): string {
  const esc = (v: string): string => `"${v.replace(/"/g, '""')}"`;
  const header = "filename,status,responsive,probability,rfps,category,category_confidence,note";
  const lines = rows.map((r) =>
    [
      esc(r.filename),
      r.status,
      r.responsive === undefined ? "" : r.responsive ? "Responsive" : "Not Responsive",
      r.responsive_probability?.toFixed(3) ?? "",
      esc((r.rfps ?? []).join(" ")),
      esc(r.category ?? ""),
      r.category_confidence?.toFixed(3) ?? "",
      esc(r.note ?? ""),
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "rubric";
}

function parseRubric(text: string): Rubric | null {
  try {
    const value = JSON.parse(text) as Rubric;
    return value && typeof value === "object" && value.rfp_rubrics ? value : null;
  } catch {
    return null;
  }
}

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1, i + 5);
}

export default function Home(): ReactElement {
  const [complaint, setComplaint] = useState<string>(SAMPLE_COMPLAINT);
  const [rfps, setRfps] = useState<[string, string, string]>(SAMPLE_RFP_BOXES);
  const [rubricText, setRubricText] = useState<string>("");
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [rubricBusy, setRubricBusy] = useState<boolean>(false);
  const [rubricError, setRubricError] = useState<string>("");
  const [rubricSource, setRubricSource] = useState<string>("");
  const [rubricView, setRubricView] = useState<"read" | "json">("read");
  const [files, setFiles] = useState<File[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState<number>(0);
  const stopRef = useRef<boolean>(false);
  const loadRef = useRef<HTMLInputElement>(null);

  // Remember the last rubric in this browser so a page reload does not lose it.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        applyRubricText(saved);
        setRubricSource("Restored from this browser");
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      if (rubricText) localStorage.setItem(STORAGE_KEY, rubricText);
    } catch {
      /* storage unavailable */
    }
  }, [rubricText]);

  function applyRubricText(text: string): void {
    setRubricText(text);
    try {
      setIssues(validateRubric(JSON.parse(text)));
    } catch {
      setIssues([{ code: "json", rfp_id: null, message: "Rubric is not valid JSON." }]);
    }
  }

  async function generateRubric(): Promise<void> {
    setRubricBusy(true);
    setRubricError("");
    try {
      const res = await fetch("/api/rubric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint, rfps }),
      });
      const data = (await res.json()) as { rubric?: unknown; issues?: ValidationIssue[]; error?: string };
      if (!res.ok || !data.rubric) throw new Error(data.error ?? `HTTP ${res.status}`);
      setRubricText(JSON.stringify(data.rubric, null, 2));
      setIssues(data.issues ?? []);
      setRubricSource(`Generated ${new Date().toLocaleTimeString()}`);
      setRubricView("read");
    } catch (err) {
      setRubricError(err instanceof Error ? err.message : String(err));
    } finally {
      setRubricBusy(false);
    }
  }

  function saveRubric(): void {
    const caption = parseRubric(rubricText)?.case_metadata?.case_caption ?? "rubric";
    const date = new Date().toISOString().slice(0, 10);
    download(`rubric-${slug(caption)}-${date}.json`, rubricText, "application/json");
  }

  async function onLoadRubric(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const f = e.target.files?.[0];
    e.target.value = ""; // allow loading the same file twice
    if (!f) return;
    applyRubricText(await f.text());
    setRubricSource(`Loaded from ${f.name}`);
    setRubricError("");
    setRubricView("read");
  }

  function onPickFolder(e: ChangeEvent<HTMLInputElement>): void {
    const picked = Array.from(e.target.files ?? []).filter((f) => !f.name.startsWith("_") && !f.name.startsWith("."));
    setFiles(picked);
    setRows([]);
    setPage(0);
    setFilter("all");
  }

  async function runClassification(): Promise<void> {
    stopRef.current = false;
    setRunning(true);
    setPage(0);
    setFilter("all");
    const initial: Row[] = files.map((f) => ({ filename: f.webkitRelativePath || f.name, status: "pending" }));
    setRows(initial);
    let next = 0;
    const worker = async (): Promise<void> => {
      while (next < files.length && !stopRef.current) {
        const i = next++;
        const f = files[i];
        const form = new FormData();
        form.append("file", f, f.name);
        form.append("rubric", rubricText);
        let row: Row;
        try {
          const res = await fetch("/api/classify", { method: "POST", body: form });
          const data = (await res.json()) as Row & { error?: string };
          row = { ...data, filename: initial[i].filename, note: data.note ?? data.error };
          if (!res.ok && row.status === undefined) row.status = "error";
        } catch (err) {
          row = { filename: initial[i].filename, status: "error", note: err instanceof Error ? err.message : String(err) };
        }
        console.log("[classify]", row.filename, row.status, row.responsive ? "Responsive" : "Not Responsive", row.rfps, row.category);
        setRows((prev) => prev.map((r, j) => (j === i ? row : r)));
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRunning(false);
  }

  const rubric = useMemo(() => parseRubric(rubricText), [rubricText]);
  const rubricOk = rubricText !== "" && issues.length === 0;
  const rfpList = rubric ? Object.values(rubric.rfp_rubrics ?? {}) : [];
  const categories = rubric?.document_categories ?? [];

  const done = rows.filter((r) => r.status !== "pending").length;
  const responsiveCount = rows.filter((r) => r.status === "ok" && r.responsive).length;
  const notCount = rows.filter((r) => r.status === "ok" && !r.responsive).length;
  const problemCount = rows.filter((r) => r.status === "error" || r.status === "skipped").length;
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;

  const filtered = rows.filter((r) =>
    filter === "all"
      ? true
      : filter === "responsive"
        ? r.status === "ok" && r.responsive
        : filter === "not"
          ? r.status === "ok" && !r.responsive
          : r.status === "error" || r.status === "skipped",
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const activeStep = !rubricOk ? 1 : rows.length === 0 ? 2 : 3;
  const caption = rubric?.case_metadata?.case_caption || "Untitled matter";

  return (
    <div className="shell">
      <aside className="nav">
        <div>
          <a className="brand" href="https://www.legawrite.ai" target="_blank" rel="noreferrer">
            <img src="/legawrite-logo.svg" alt="Legawrite" width={200} height={56} />
          </a>
          <div className="logo">
            is<span>Responsive</span>Zero
            <small>Document responsiveness review</small>
          </div>
          <p className="oss">
            <span className="chip chip-outline">Open source</span>
            <span style={{ whiteSpace: "nowrap" }}>
              by{" "}
              <a href="https://www.legawrite.ai" target="_blank" rel="noreferrer">
                Legawrite.AI
              </a>
            </span>
          </p>
          <a
            className="btn btn-demo btn-block"
            href="https://calendly.com/rossbrodskiy-lega/legawrite-demo"
            target="_blank"
            rel="noopener"
          >
            Book a demo
          </a>
          <nav className="steps">
            <a href="#rubric" className={`step ${activeStep === 1 ? "active" : ""}`}>
              <span className={`num ${rubricOk ? "done" : ""}`}>{rubricOk ? "✓" : "1"}</span>
              <span>
                Rubric
                <span className="sub">{rubricOk ? `${rfpList.length} requests ready` : "Build or load"}</span>
              </span>
            </a>
            <a href="#documents" className={`step ${activeStep === 2 ? "active" : ""}`}>
              <span className={`num ${files.length ? "done" : ""}`}>{files.length ? "✓" : "2"}</span>
              <span>
                Documents
                <span className="sub">{files.length ? `${files.length.toLocaleString()} files picked` : "Pick a folder"}</span>
              </span>
            </a>
            <a href="#documents" className={`step ${activeStep === 3 ? "active" : ""}`}>
              <span className={`num ${rows.length && done === rows.length ? "done" : ""}`}>
                {rows.length && done === rows.length ? "✓" : "3"}
              </span>
              <span>
                Results
                <span className="sub">{rows.length ? `${done.toLocaleString()} of ${rows.length.toLocaleString()} reviewed` : "Not started"}</span>
              </span>
            </a>
          </nav>
        </div>
        <div className="nav__util">
          <button className="btn btn-ghost btn-block" onClick={saveRubric} disabled={!rubricText}>
            Save rubric
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => loadRef.current?.click()}>
            Load rubric
          </button>
          <input ref={loadRef} className="hidden-input" type="file" accept=".json,application/json" onChange={onLoadRubric} />
          <p className="nav__note">API keys stay on the server. Documents are read in memory and never stored.</p>
          <p className="nav__note">isResponsiveZero is an open-source project provided by Legawrite.AI.</p>
        </div>
      </aside>

      <main className="main">
        <header className="mhead">
          <div>
            <div className="eyebrow">Matter</div>
            <h1>{caption}</h1>
            <div className="meta">
              {rubricOk ? <span className="chip chip-success">Rubric ready</span> : <span className="chip chip-outline">No rubric yet</span>}
              {rubric && (
                <>
                  <span className="dot">·</span>
                  <span>{rfpList.length} requests</span>
                  <span className="dot">·</span>
                  <span>{categories.length} document categories</span>
                </>
              )}
              {rubricSource && (
                <>
                  <span className="dot">·</span>
                  <span className="caption">{rubricSource}</span>
                </>
              )}
            </div>
          </div>
          <div className="mhead__actions">
            <button className="btn btn-ghost" onClick={saveRubric} disabled={!rubricText}>
              Save rubric
            </button>
            <button className="btn btn-ghost" onClick={() => loadRef.current?.click()}>
              Load rubric
            </button>
          </div>
        </header>

        <div className="grid" id="rubric">
          {/* ---------- inputs ---------- */}
          <section className="panel">
            <div className="panel__head">
              <div>
                <div className="eyebrow">Inputs</div>
                <h2 className="title">Complaint &amp; requests</h2>
              </div>
              <button
                className="btn-text btn"
                onClick={() => {
                  setComplaint(SAMPLE_COMPLAINT);
                  setRfps(SAMPLE_RFP_BOXES);
                }}
                disabled={rubricBusy}
              >
                Load sample
              </button>
            </div>
            <div className="field">
              <label htmlFor="complaint">Complaint</label>
              <textarea id="complaint" rows={9} value={complaint} onChange={(e) => setComplaint(e.target.value)} />
            </div>
            {rfps.map((value, i) => (
              <div className="field" key={i}>
                <label htmlFor={`rfp${i}`}>Requests for production · box {i + 1}</label>
                <textarea
                  id={`rfp${i}`}
                  rows={5}
                  value={value}
                  onChange={(e) => {
                    const copy: [string, string, string] = [...rfps];
                    copy[i] = e.target.value;
                    setRfps(copy);
                  }}
                />
              </div>
            ))}
            <div className="toolbar">
              <button className="btn btn-primary" onClick={generateRubric} disabled={rubricBusy}>
                {rubricBusy ? "Writing rubric…" : "Generate rubric"}
              </button>
              <span className="caption">{rubricBusy ? "Usually 15–60 seconds" : "Written by DeepSeek from the text above"}</span>
            </div>
            {rubricBusy && (
              <div className="prog indeterminate">
                <div />
              </div>
            )}
            {rubricError && <div className="alert">Rubric generation failed: {rubricError}</div>}
          </section>

          {/* ---------- rubric ---------- */}
          <section className="panel">
            <div className="panel__head">
              <div>
                <div className="eyebrow">Written by DeepSeek · editable</div>
                <h2 className="title">
                  Responsiveness rubric
                  {rubric && <span className="count">{rfpList.length}</span>}
                </h2>
              </div>
              {rubricText && (
                <div className="facets">
                  <button className={`facet ${rubricView === "read" ? "active" : ""}`} onClick={() => setRubricView("read")}>
                    Readable
                  </button>
                  <button className={`facet ${rubricView === "json" ? "active" : ""}`} onClick={() => setRubricView("json")}>
                    Edit JSON
                  </button>
                </div>
              )}
            </div>

            {!rubricText && (
              <div className="empty">
                <strong>No rubric yet</strong>
                Generate one from the complaint and requests, or load a saved rubric file.
                <div className="toolbar" style={{ justifyContent: "center", marginTop: 14 }}>
                  <button className="btn btn-ghost" onClick={() => loadRef.current?.click()}>
                    Load rubric
                  </button>
                </div>
              </div>
            )}

            {rubricText && rubricOk && (
              <div className="insight">
                <div className="eyebrow">✦ Rubric check · automated</div>
                <p>
                  {rfpList.length} requests and {categories.length} document categories passed every validation check. Save it to reuse on
                  the next run.
                </p>
              </div>
            )}

            {rubricText && issues.length > 0 && (
              <ul className="issues">
                {issues.map((x, i) => (
                  <li key={i}>
                    {x.rfp_id ? `${x.rfp_id}: ` : ""}
                    {x.message}
                  </li>
                ))}
              </ul>
            )}

            {rubricText && rubricView === "json" && (
              <textarea className="mono" rows={28} value={rubricText} onChange={(e) => applyRubricText(e.target.value)} spellCheck={false} />
            )}

            {rubric && rubricView === "read" && (
              <>
                <div className="rfplist">
                  {rfpList.map((r) => (
                    <details className="rfp" key={r.rfp_id}>
                      <summary>
                        <span className="chip chip-dark">{r.rfp_id?.replace("RFP_", "RFP ")}</span>
                        <span>
                          <span className="q">{r.question || r.rfp_text_summary}</span>
                          <span className="more">Show what it covers →</span>
                        </span>
                      </summary>
                      <div className="body">
                        {r.covers && (
                          <div>
                            <b>Covers</b>
                            {r.covers}
                          </div>
                        )}
                        {r.not_for && (
                          <div>
                            <b>Not for</b>
                            {r.not_for}
                          </div>
                        )}
                        {r.rfp_text_verbatim && (
                          <div>
                            <b>Request text</b>
                            {r.rfp_text_verbatim}
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
                {categories.length > 0 && (
                  <div className="field">
                    <label>Document categories</label>
                    <div className="catgrid">
                      {categories.map((c) => (
                        <span key={c.name} className="chip" title={c.description?.covers}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* ---------- documents ---------- */}
        <section className="panel" id="documents">
          <div className="panel__head">
            <div>
              <div className="eyebrow">Classified by TypeSafe Jev</div>
              <h2 className="title">
                Documents
                {files.length > 0 && <span className="count">{files.length.toLocaleString()}</span>}
              </h2>
            </div>
            <div className="toolbar">
              <label className="btn btn-upload">
                Pick folder
                <input className="hidden-input" type="file" multiple {...folderAttrs} onChange={onPickFolder} />
              </label>
              {running ? (
                <button className="btn btn-ghost" onClick={() => (stopRef.current = true)}>
                  Stop
                </button>
              ) : (
                <button className="btn btn-dark" onClick={runClassification} disabled={!rubricOk || files.length === 0}>
                  Classify {files.length ? files.length.toLocaleString() : ""} files
                </button>
              )}
            </div>
          </div>

          {!rubricOk && <p className="caption">Generate or load a valid rubric first. Files whose names start with _ are skipped.</p>}

          {rows.length > 0 && (
            <>
              <div className="tiles">
                <div className="tile">
                  <div className="v">{pct}%</div>
                  <div className="l">
                    {done.toLocaleString()} of {rows.length.toLocaleString()} reviewed
                  </div>
                </div>
                <div className="tile">
                  <div className="v">{responsiveCount.toLocaleString()}</div>
                  <div className="l">Responsive</div>
                </div>
                <div className="tile">
                  <div className="v">{notCount.toLocaleString()}</div>
                  <div className="l">Not responsive</div>
                </div>
                <div className="tile">
                  <div className="v">{problemCount.toLocaleString()}</div>
                  <div className="l">Skipped or failed</div>
                </div>
              </div>
              <div className="prog">
                <div style={{ width: `${pct}%` }} />
              </div>

              <div className="panel__head" style={{ alignItems: "center" }}>
                <div className="facets">
                  {(
                    [
                      ["all", "All", rows.length],
                      ["responsive", "Responsive", responsiveCount],
                      ["not", "Not responsive", notCount],
                      ["problem", "Skipped / failed", problemCount],
                    ] as [Filter, string, number][]
                  ).map(([key, label, n]) => (
                    <button
                      key={key}
                      className={`facet ${filter === key ? "active" : ""}`}
                      onClick={() => {
                        setFilter(key);
                        setPage(0);
                      }}
                    >
                      {label} <span className="n">{n.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                <div className="toolbar">
                  <button className="btn btn-text" onClick={() => download("results.csv", toCsv(rows), "text/csv")}>
                    Download CSV
                  </button>
                  <button
                    className="btn btn-text"
                    onClick={() => download("results.json", JSON.stringify(rows, null, 2), "application/json")}
                  >
                    Download JSON
                  </button>
                </div>
              </div>

              <div className="doctable">
                <div className="doctr doctr--head">
                  <div>File</div>
                  <div>Decision</div>
                  <div>Prob.</div>
                  <div>Requests</div>
                  <div>Category</div>
                </div>
                {visible.length === 0 && <div className="docempty">No documents match.</div>}
                {visible.map((r) => (
                  <div className="doctr" key={r.filename} title={r.note ?? r.filename}>
                    <div className="docname">
                      <span className="docicon">{extOf(r.filename)}</span>
                      <span className="trunc" title={r.filename}>
                        {r.filename.split("/").pop()}
                      </span>
                    </div>
                    <div>
                      {r.status === "pending" && <span className="chip chip-outline">Queued</span>}
                      {r.status === "ok" &&
                        (r.responsive ? (
                          <span className="chip chip-success">Responsive</span>
                        ) : (
                          <span className="chip">Not responsive</span>
                        ))}
                      {(r.status === "error" || r.status === "skipped") && (
                        <span className="chip chip-critical" title={r.note}>
                          {r.status}
                        </span>
                      )}
                    </div>
                    <div className="prob">{r.responsive_probability?.toFixed(2) ?? ""}</div>
                    <div className="reqs">
                      {(r.rfps ?? []).map((id) => (
                        <span key={id} className="chip">
                          {id.replace("RFP_", "")}
                        </span>
                      ))}
                    </div>
                    <div className="cat trunc" title={r.category}>
                      {r.category ?? ""}
                      {r.category_confidence !== undefined && r.category_confidence < 0.4 && <span className="lowconf"> · low confidence</span>}
                    </div>
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="paginator">
                  <span>
                    {(safePage * PAGE_SIZE + 1).toLocaleString()}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length).toLocaleString()} of{" "}
                    {filtered.length.toLocaleString()}
                  </span>
                  <div className="toolbar">
                    <button className="btn btn-ghost" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                      ← Prev
                    </button>
                    <button className="btn btn-ghost" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {rows.length === 0 && files.length > 0 && (
            <div className="empty">
              <strong>{files.length.toLocaleString()} files ready</strong>
              {rubricOk ? "Press Classify to start. Results stream in as each file finishes." : "Load or generate a rubric, then press Classify."}
            </div>
          )}
          {rows.length === 0 && files.length === 0 && (
            <div className="empty">
              <strong>No folder picked</strong>
              Pick a local folder. Each file is read, classified and discarded — nothing is uploaded for storage.
            </div>
          )}
        </section>

        <p className="runlocal">
          If you can clone a repo and run <code>python main.py</code>, you can run IsResponsive locally on much larger document sets.
          Bring your own TypeSafe.ai key, point it at the files, and off you go - including Enron-sized collections. Both the Python
          and web versions are available here:{" "}
          <a href="https://github.com/lwgitgod/isResponsiveZero" target="_blank" rel="noopener">
            lwgitgod/isResponsiveZero
          </a>
          . For larger or custom deployments, including bring-your-own-GPU implementations, we are available to help. Enjoy.
        </p>

        <section className="about">
          <div>
            <div className="eyebrow">About Legawrite.AI</div>
            <h2>Made by the team behind LitigationOS</h2>
            <p>
              isResponsiveZero is a free, open-source starting point for responsiveness review. It is one small piece of what
              Legawrite.AI builds for litigators who sign what they file. Our platform, LitigationOS, is filing-grade legal AI grounded
              in open law: it checks what each citation actually stands for and whether it still holds. If this tool saved you an
              afternoon of document review, come see what the rest of the platform can do.
            </p>
          </div>
          <div className="about__cta">
            <a className="about__link" href="https://www.legawrite.ai" target="_blank" rel="noopener">
              Read more at legawrite.ai →
            </a>
            <a className="btn btn-inverse" href="https://calendly.com/rossbrodskiy-lega/legawrite-demo" target="_blank" rel="noopener">
              Book a demo
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
