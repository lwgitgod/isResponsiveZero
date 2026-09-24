// In-memory text extraction for one uploaded file. Nothing is written to disk.
// Best effort: unsupported or empty files return an empty string plus a note.

import JSZip from "jszip";
import * as XLSX from "xlsx";

export interface Extracted {
  text: string;
  note: string;
}

const PLAIN = new Set(["txt", "md", "csv"]);

function stripXml(s: string): string {
  return s
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|br|tr|li|h\d|text:p|text:h)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

function rtfToText(s: string): string {
  return s
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'[0-9a-f]{2}/gi, " ")
    .replace(/\{\\\*[^{}]*\}/g, "")
    .replace(/\\[a-z]+-?\d* ?/gi, "")
    .replace(/[{}]/g, "")
    .trim();
}

async function pdfText(buf: Uint8Array): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}

function sheetText(buf: Buffer): string {
  const wb = XLSX.read(buf, { type: "buffer" });
  return wb.SheetNames.map((n) => `# ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`).join("\n\n");
}

// iWork (.pages/.numbers/.key) files are zip bundles; their body is binary, but most carry a
// QuickLook preview PDF we can read.
async function iworkText(buf: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buf);
  const preview = zip.file(/QuickLook\/Preview\.pdf$/i)[0] ?? zip.file(/preview\.pdf$/i)[0];
  if (preview) return pdfText(new Uint8Array(await preview.async("uint8array")));
  const xml = zip.file(/index\.xml$/i)[0];
  return xml ? stripXml(await xml.async("string")) : "";
}

async function odfText(buf: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buf);
  const content = zip.file("content.xml");
  return content ? stripXml(await content.async("string")) : "";
}

function emailText(raw: string): string {
  // Drop base64 attachment bodies; keep headers and text parts.
  return raw.replace(/\n([A-Za-z0-9+/=]{60,}\n){3,}/g, "\n[binary attachment omitted]\n");
}

export async function extractText(filename: string, buf: Buffer): Promise<Extracted> {
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  try {
    let text = "";
    if (PLAIN.has(ext)) text = buf.toString("utf8");
    else if (ext === "pdf") text = await pdfText(new Uint8Array(buf));
    else if (ext === "docx") text = (await (await import("mammoth")).extractRawText({ buffer: buf })).value;
    else if (ext === "doc") {
      const WordExtractor = (await import("word-extractor")).default;
      text = (await new WordExtractor().extract(buf)).getBody();
    } else if (ext === "rtf") text = rtfToText(buf.toString("latin1"));
    else if (ext === "eml") text = emailText(buf.toString("utf8"));
    else if (ext === "emlx") text = emailText(buf.toString("utf8").replace(/^\d+\s*\n/, "").replace(/<\?xml[\s\S]*$/, ""));
    else if (ext === "html" || ext === "htm") text = stripXml(buf.toString("utf8"));
    else if (ext === "xls" || ext === "xlsx" || ext === "ods") text = sheetText(buf);
    else if (ext === "odt") text = await odfText(buf);
    else if (ext === "pages" || ext === "numbers" || ext === "key") text = await iworkText(buf);
    else return { text: "", note: `unsupported file type .${ext}` };
    text = text.trim();
    return { text, note: text ? "" : "empty text" };
  } catch (err) {
    return { text: "", note: `extraction failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}
