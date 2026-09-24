// PART 1 of 3 of the large synthetic test set for Rivera v. Blake (Brightline Ventures, Inc.).
// Families: email threads, text/chat messages, memos and letters.
// Writes 3,500 files p1_00001..p1_03500 into test-data2/ and the answer key into
// test-data2-key/answer_key_part1.json. Deterministic (fixed seed): re-running produces the same output.
// Buckets: 1,225 clear responsive, 350 hard-but-responsive, 350 hard-but-not-responsive, 1,575 clear not responsive.
// Usage: node scripts/gen-test-data2-part1.mjs

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "test-data2");
const keyDir = join(root, "test-data2-key");
mkdirSync(dataDir, { recursive: true });
mkdirSync(keyDir, { recursive: true });
for (const f of readdirSync(dataDir)) if (f.startsWith("p1_") && f.endsWith(".md")) rmSync(join(dataDir, f));

// ---------- deterministic randomness ----------
let s = 20260924 >>> 0;
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const pickN = (arr, n) => {
  const a = [...arr];
  const out = [];
  while (out.length < n && a.length) out.push(a.splice(Math.floor(rand() * a.length), 1)[0]);
  return out;
};
const money = (lo, hi) => (Math.round((lo + rand() * (hi - lo)) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const mkDate = (y0 = 2019, y1 = 2025) => new Date(Date.UTC(int(y0, y1), int(0, 11), int(1, 28), int(6, 22), int(0, 59), int(0, 59)));
const pad2 = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
const rfc = (d) => `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())} ${pick(["-0800", "-0700", "-0500", "-0400"])}`;
const us = (d) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${String(d.getUTCFullYear()).slice(2)}`;
const long = (d) => `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
const time = (d) => `${((d.getUTCHours() + 11) % 12) + 1}:${pad2(d.getUTCMinutes())} ${d.getUTCHours() < 12 ? "AM" : "PM"}`;
const addMin = (d, m) => new Date(d.getTime() + m * 60000);
const anyDate = (d) => pick([iso, rfc, us, long])(d);

// ---------- cast (kept identical to scripts/gen-test-data.mjs) ----------
const CO = "Brightline Ventures, Inc.";
const A = "Alex Rivera";
const B = "Jordan Blake";
const BH = "Blake Holdings LLC";
const BANK = "First Coastal Bank";
const BANK2 = "Summit Trust";
const friends = ["Sam", "Priya", "Marco", "Dana", "Lee", "Chris", "Nina", "Omar"];
const peripheral = [
  "Tessa Morgan", "Ravi Anand", "Hannah Cole", "Victor Salgado", "Mei Lin", "Owen Price", "Gabriela Ruiz", "Tom Becker",
  "Aisha Karim", "Luis Ortega", "Rachel Stein", "Derek Nguyen", "Fiona Walsh", "Kenji Sato", "Maya Brooks", "Paul Jensen",
];
const A_ADDR = ["alex@brightlineventures.com", "alex.rivera.dev@gmail.com", "arivera@brightlineventures.com"];
const B_ADDR = ["jordan@brightlineventures.com", "jblake@brightlineventures.com", "jordan.blake77@gmail.com"];
const bookkeepers = [["Ledgerly Bookkeeping", "bookkeeper@ledgerlyhq.com", "Tessa Morgan"], ["Brightline Accounts", "accounts@brightlineventures.com", "Owen Price"]];
const investors = [
  ["Michael Chen", "m.chen@northgatecap.com", "Northgate Capital"],
  ["Harbor Angels", "investors@harborangels.com", "Harbor Angels"],
  ["Kavya Patel", "k.patel@seedfund.io", "SeedFund"],
  ["Laura Voss", "lvoss@meridianvp.com", "Meridian Venture Partners"],
];
const lawyers = [["Rachel Stein", "rstein@steinwhitfield.com", "Stein & Whitfield LLP"], ["Paul Jensen", "pjensen@jensenlaw.com", "Jensen Law Group"]];
const personOf = (name) => {
  const [f, l] = name.split(" ");
  return `${name} <${f.toLowerCase()}.${l.toLowerCase()}@${pick(["gmail.com", "outlook.com", "yahoo.com", "icloud.com"])}>`;
};
const who = (name, addrs) => `${name} <${pick(addrs)}>`;

// ---------- text utilities ----------
function typo(text, rate) {
  return text.replace(/\b[a-z]{4,}\b/g, (w) => {
    if (!chance(rate)) return w;
    const i = int(1, w.length - 2);
    const op = int(0, 2);
    if (op === 0) return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    if (op === 1) return w.slice(0, i) + w.slice(i + 1);
    return w.slice(0, i) + w[i] + w.slice(i);
  });
}
const BIZ_FILLER = [
  "Separately, the Q{q} roadmap review moved to Thursday at 2.",
  "Also, Harbor Retail wants a second demo of the dashboard next week, can someone own that?",
  "Reminder that the staging deploy is frozen until QA signs off.",
  "FYI the Wi-Fi on the third floor is still flaky, IT says a new access point is coming.",
  "Design review notes are in the shared folder under /design/{yr}.",
  "Can we push standup to 9:45 on Fridays? A couple of people have school drop-off.",
  "The intern candidates are coming in Tuesday; please block 30 minutes if you're interviewing.",
  "The conference booth banner arrived and it's the wrong shade of blue, reordering.",
  "Customer churn call is on the calendar for the 14th.",
  "Please update your Jira tickets before end of sprint.",
  "Docs site search is broken again, filed a ticket.",
  "Let's keep the retro to 30 minutes this time.",
  "The new onboarding flow tested well with five users, details in the deck.",
  "Anyone have the login for the analytics dashboard? Mine expired.",
  "Heads up that the API rate limits change on the 1st.",
];
const PERSONAL_FILLER = [
  "Weather's been wild here, we had hail on Tuesday.",
  "The kids have a recital Saturday so I'm offline most of the day.",
  "Did you ever finish that show? No spoilers.",
  "Dog is finally over his cold, thanks for asking.",
  "We're thinking about repainting the kitchen, send paint color opinions.",
  "Traffic on the bridge was a nightmare this morning.",
  "Still can't believe that last-minute goal on Sunday.",
  "My sister is in town next week so I might be slow to respond.",
];
const fill = (pool, n) => {
  const out = [];
  for (let i = 0; i < n; i++) out.push(pick(pool).replace("{q}", int(1, 4)).replace("{yr}", int(2019, 2025)));
  return out.join(" ");
};
// length profile: mostly short, sometimes long (up to ~2 pages with quoted history)
const lenProfile = () => pick([0, 0, 0, 1, 1, 2, 3, 5]);

const SIGS = {
  A: [`\n-- \nAlex Rivera`, `\n— Alex`, `\nAlex`, `\nThanks,\nAlex Rivera\nBrightline Ventures`, `\nSent from my iPhone`],
  B: [`\n-- \nJordan Blake\nCEO, Brightline Ventures`, `\n- J`, `\nJordan`, `\nBest,\nJordan Blake`, `\nSent from my iPhone`],
  gen: (name) => pick([`\n${name}`, `\nThanks,\n${name}`, `\nBest regards,\n${name}`, `\n— ${name.split(" ")[0]}`, `\nSent from my phone`]),
};
const DISCLAIMER = [
  "\n\nCONFIDENTIALITY NOTICE: This e-mail and any attachments are for the sole use of the intended recipient(s) and may contain confidential information. If you are not the intended recipient, please delete it.",
  "\n\nPlease consider the environment before printing this email.",
  "",
  "",
  "",
];

function email({ from, to, cc, d, subject, body, sig = "", quoted = "", disclaimer = true }) {
  const lines = [`From: ${from}`, `To: ${to}`];
  if (cc) lines.push(`Cc: ${cc}`);
  lines.push(`Date: ${chance(0.5) ? rfc(d) : iso(d) + " " + time(d)}`, `Subject: ${subject}`);
  if (chance(0.3)) lines.push(`Message-ID: <${Math.floor(rand() * 1e10).toString(36)}.${Math.floor(rand() * 1e6)}@mail.${pick(["gmail.com", "outlook.com", "brightlineventures.com"])}>`);
  let out = lines.join("\n") + "\n\n" + body.trim() + (sig ? "\n" + sig : "");
  if (disclaimer) out += pick(DISCLAIMER);
  if (quoted) out += `\n\n${pick(["On", "-----Original Message-----\nOn"])} ${anyDate(addMin(d, -int(60, 9000)))}, ${quoted}`;
  return out;
}
function chat(title, d, msgs, rate = 0.03) {
  let t = d;
  const header = pick([
    `${title} — exported ${iso(d)}`,
    `# ${title}\nExport generated ${long(d)}`,
    `iMessage / SMS export — ${title}`,
    `Slack export: ${title} (${iso(d)})`,
  ]);
  const style = int(0, 2);
  const lines = msgs.map(([who, text]) => {
    t = addMin(t, int(0, 45));
    const txt = typo(text, rate);
    if (style === 0) return `[${us(t)} ${time(t)}] ${who}: ${txt}`;
    if (style === 1) return `${who} (${time(t)}): ${txt}`;
    return `**${who}** ${time(t)}\n${txt}\n`;
  });
  return header + "\n\n" + lines.join("\n");
}
function memo({ to, from, cc, d, re, body }) {
  const head = pick(["# MEMORANDUM", "MEMO", "# Memo", "INTERNAL MEMORANDUM", "# Note to file"]);
  return `${head}\n\nTO: ${to}\nFROM: ${from}${cc ? `\nCC: ${cc}` : ""}\nDATE: ${pick([long, iso])(d)}\nRE: ${re}\n\n${body.trim()}`;
}
function letter({ letterhead, d, addressee, salutation, body, closing }) {
  return `${letterhead}\n\n${long(d)}\n\n${addressee}\n\n${salutation}\n\n${body.trim()}\n\n${closing}`;
}

// ---------- categories: EXACT names from test-data-key/rubric.generated.json ----------
const C = {
  bank: "Bank Statement or Transaction Record",
  stock: "Stock Certificate, Ledger or Cap Table",
  formation: "Corporate Formation or Governance Document",
  agreement: "Ownership or Equity Agreement",
  accounting: "Accounting Record or Financial Statement",
  email: "Email or Message",
  invoice: "Invoice or Receipt",
  marketing: "Marketing, Newsletter or Spam",
  personal: "Personal or Social Communication",
  other: "Other Business Document",
};
const doc = (type, category, rfps, strength, why, body) => ({ type, category, rfps, strength, why, body });

const T = { clearR: [], hardR: [], hardN: [], clearN: [] };
const tpl = (bucket, name, fn) => T[bucket].push({ name, fn });

// =====================================================================
// CLEAR RESPONSIVE
// =====================================================================
tpl("clearR", "split_confirm", () => {
  const d = mkDate(2020, 2021);
  const pct = pick([60, 65, 70]);
  const body = pick([
    `Jordan — just confirming what we agreed on the call: I keep ${pct}% since it's my code and my seed money, you get the other ${100 - pct}% for handling the incorporation paperwork. Can you make sure the stock ledger reflects that when you file?`,
    `Writing this down so we both have it: ownership of Brightline is ${pct}/${100 - pct}, me/you. I'm putting in the platform and the cash, you're doing the formation work and the admin. If that's not how you remember it, tell me now.`,
    `Per our lunch today, the founder split is ${pct}% Alex / ${100 - pct}% Jordan. Please have the lawyer draft the founders' agreement with those numbers and send me a copy before anything is signed.`,
  ]);
  const reply = chance(0.6) ? `${B} <${pick(B_ADDR)}> wrote:\n> ${pick(["Yep, that's right. Will get it papered.", `Confirmed, ${pct}/${100 - pct}. Filing this week.`, "Agreed. I'll handle the filings."])}` : "";
  return doc("email", C.email, ["RFP_03", "RFP_01", "RFP_06"], "strong", `Rivera and Blake confirm a ${pct}/${100 - pct} ownership split of Brightline.`,
    email({ from: who(A, A_ADDR), to: who(B, B_ADDR), d, subject: pick(["re: our split", "Ownership split", "Founder %", "recap from today"]), body: body + (lenProfile() > 2 ? "\n\n" + fill(BIZ_FILLER, 3) : ""), sig: pick(SIGS.A), quoted: reply }));
});

tpl("clearR", "blake_investor", () => {
  const d = mkDate(2022, 2024);
  const [iname, iaddr, ifirm] = pick(investors);
  const pct = pick([90, 95, 100]);
  const body = pick([
    `Happy to share: I founded Brightline and currently hold ${pct}% of the equity. There are no other significant shareholders. Deck attached.`,
    `To answer your question on the cap table — it's clean. I own ${pct}% outright${pct < 100 ? `, the rest is a small employee pool` : ""}. No co-founder, no prior investors. That should make diligence simple.`,
    `Brightline is founder-owned. I'm the sole founder and majority holder (${pct}%). Alex Rivera did some early engineering on contract but holds no equity.`,
  ]);
  return doc("email", C.email, ["RFP_07", "RFP_01"], "strong", `Blake tells investor ${ifirm} he owns ${pct}% of Brightline.`,
    email({ from: who(B, B_ADDR), to: `${iname} <${iaddr}>`, d, subject: pick(["Brightline — ownership overview", "RE: cap table question", "Follow up from our meeting", "Brightline intro"]), body: body + (chance(0.4) ? "\n\n" + fill(BIZ_FILLER, int(1, 3)) : ""), sig: pick(SIGS.B) }));
});

tpl("clearR", "seed_wire", () => {
  const d = mkDate(2020, 2021);
  const amt = money(30000, 80000);
  return doc("email", C.email, ["RFP_04", "RFP_06", "RFP_09"], "medium", `Rivera reports wiring $${amt} to Brightline for his founder shares.`,
    email({ from: who(A, A_ADDR), to: who(B, B_ADDR), d, subject: pick(["seed money sent", "wire done", "my contribution"]),
      body: pick([
        `Wired $${amt} into the Brightline account at ${BANK} this morning for my founder shares, plus I pushed the full repo to the company GitHub. Let me know once the certificate is issued.`,
        `Done — $${amt} is in the company account. That plus the code is my contribution for my stake. Send me the confirmation when it clears.`,
      ]), sig: pick(SIGS.A) }));
});

tpl("clearR", "dispute", () => {
  const d = mkDate(2024, 2025);
  const bodies = [
    `I just saw the new cap table you sent the bank. My shares are gone. We had an agreement. I never signed any transfer or cancellation. Explain this or I'm calling a lawyer.`,
    `Jordan, the investor deck lists you as sole founder and 100% owner. That is false and you know it. I own the majority of Brightline. Correct it today.`,
    `I have not agreed to any dilution. The "consent" you sent me was signed only by you. My ownership stake is not yours to cancel.`,
  ];
  return doc("email", C.email, ["RFP_10", "RFP_03", "RFP_01"], "strong", "Rivera disputes Blake's removal or dilution of his Brightline shares.",
    email({ from: who(A, A_ADDR), to: who(B, B_ADDR), cc: chance(0.3) ? pick(lawyers)[1] : "", d, subject: pick(["You removed me from the cap table?", "My shares", "This is not what we agreed", "URGENT - ownership"]), body: pick(bodies), sig: pick(SIGS.A),
      quoted: chance(0.5) ? `${B} wrote:\n> ${pick(["Alex, the company's been restructured. You didn't pay for your shares so they were cancelled.", "Let's talk by phone, not email.", "The board approved it. Nothing I can do."])}` : "" }));
});

tpl("clearR", "bookkeeper_transfers", () => {
  const d = mkDate(2022, 2024);
  const [bname, baddr, bperson] = pick(bookkeepers);
  const n = int(3, 9);
  const total = money(40000, 180000);
  return doc("email", C.email, ["RFP_08", "RFP_09"], "strong", `Bookkeeper flags ${n} unsupported transfers to ${BH}.`,
    email({ from: `${bname} <${baddr}>`, to: who(B, B_ADDR), cc: chance(0.3) ? who(A, A_ADDR) : "", d, subject: pick(["unexplained transfers", "Q" + int(1, 4) + " close - missing support", "Blake Holdings payments"]),
      body: `Hi Jordan,\n\nI'm reconciling the books and see ${n} transfers totaling $${total} from the ${CO} operating account to ${BH} with no invoices. Can you send support so I can code them? Right now they're sitting in suspense.\n\n${chance(0.5) ? fill(BIZ_FILLER, int(1, 2)) : ""}`,
      sig: SIGS.gen(bperson) }));
});

tpl("clearR", "text_split", () => {
  const d = mkDate(2020, 2022);
  const pct = pick([60, 65, 70]);
  return doc("text", C.email, ["RFP_03"], "medium", `Text thread where Rivera and Blake agree on ${pct}/${100 - pct}.`,
    chat("Alex Rivera / Jordan Blake", d, [
      ["Alex", `so we're good on ${pct}/${100 - pct} right?`],
      ["Jordan", `yeah ${pct}/${100 - pct} like we said. I'll get the lawyer to paper it`],
      ["Alex", pick(["👍 you're incorporating it for me, I'm traveling", "ok cool. my name on the certificate pls", "great, send me the docs when filed"])],
      ...(chance(0.5) ? [["Jordan", pick(["will do", "np", "on it"])]] : []),
    ], 0.05));
});

tpl("clearR", "demand_letter", () => {
  const d = mkDate(2024, 2025);
  const [lname, , lfirm] = pick(lawyers);
  return doc("letter", C.other, ["RFP_10", "RFP_01", "RFP_08"], "strong", "Rivera's counsel demands restoration of shares and accounting of funds.",
    letter({ letterhead: `${lfirm.toUpperCase()}\n${int(100, 999)} Market Street, Suite ${int(200, 1900)}`, d, addressee: `Mr. Jordan Blake\nc/o ${CO}`, salutation: "Dear Mr. Blake:",
      body: `This firm represents ${A}. Our client is the majority owner of ${CO}, which you incorporated at his direction and on his behalf.\n\nWe demand that you (1) restore our client's shares as reflected in the original stock ledger; (2) cease any further issuance of shares that would dilute his interest; and (3) provide a full accounting of all company funds you transferred to yourself or to ${BH}.\n\n${chance(0.5) ? "Please preserve all documents, including emails, texts, bank records and accounting files, relating to these matters.\n\n" : ""}If we do not hear from you within ${pick([10, 14, 21])} days, we will proceed without further notice.`,
      closing: `Very truly yours,\n\n${lname}\n${lfirm}` }));
});

tpl("clearR", "formation_memo_to_file", () => {
  const d = mkDate(2021, 2021);
  const amt = money(40000, 80000);
  return doc("memo", C.other, ["RFP_05", "RFP_01", "RFP_06", "RFP_04"], "strong", "Rivera's memo to file on how Blake formed Brightline on his behalf.",
    memo({ to: "File", from: A, d, re: "Formation of Brightline Ventures",
      body: `Recording the facts while they're fresh.\n\n1. I asked ${B} to incorporate Brightline in Delaware on my behalf because I was traveling.\n2. I am the founder. I contributed the Brightline platform source code and $${amt} in cash.\n3. Jordan was to be listed as incorporator only and receive a minority stake for his services.\n4. Jordan was given signing authority on the ${BANK} operating account for administrative convenience.\n\n${chance(0.4) ? "I have asked for copies of the filed certificate of incorporation and the stock ledger and have not yet received them." : ""}` }));
});

tpl("clearR", "blake_counsel_letter", () => {
  const d = mkDate(2024, 2025);
  const [lname, , lfirm] = pick(lawyers);
  return doc("letter", C.other, ["RFP_10", "RFP_02", "RFP_01"], "strong", "Blake's counsel asserts Rivera's shares were cancelled.",
    letter({ letterhead: `${lfirm}\nAttorneys at Law`, d, addressee: `${A}\n(via email)`, salutation: "Mr. Rivera:",
      body: `We represent ${B} and ${CO}. Your purported shares (certificate CS-1) were cancelled by written consent of the board for failure to pay the required consideration. Accordingly you hold no equity interest in the company.\n\nAny communication regarding this matter should be directed to this office.`,
      closing: `Sincerely,\n${lname}` }));
});

tpl("clearR", "chat_blake_bookkeeper", () => {
  const d = mkDate(2022, 2024);
  const bp = pick(bookkeepers)[2].split(" ")[0];
  return doc("chat", C.email, ["RFP_08", "RFP_09"], "strong", "Blake instructs bookkeeper to code Blake Holdings payments as consulting.",
    chat(`DM: Jordan Blake, ${bp}`, d, [
      [bp, `the ${BH} wires — do you have invoices?`],
      ["Jordan", "just code them as consulting"],
      [bp, `that's $${money(20000, 90000)} this quarter, auditors will ask`],
      ["Jordan", pick(["it's fine, it's my company", "I'll send something later", "just book it. don't cc Alex"])],
    ]));
});

tpl("clearR", "incorp_attorney", () => {
  const d = mkDate(2021, 2021);
  const [lname, laddr, lfirm] = pick(lawyers);
  return doc("email", C.email, ["RFP_05", "RFP_06", "RFP_01"], "strong", "Formation attorney emails Blake about filing articles with Rivera as founder.",
    email({ from: `${lname} <${laddr}>`, to: who(B, B_ADDR), cc: chance(0.5) ? who(A, A_ADDR) : "", d, subject: pick(["Brightline — certificate of incorporation", "Filing confirmation", "Next steps: Brightline formation"]),
      body: `Jordan,\n\nThe certificate of incorporation for ${CO} was filed with Delaware today. As discussed, you are listed as incorporator acting for ${A}, who is the founder and will receive ${pick(["6,000,000", "6,500,000", "7,000,000"])} founder shares at the organizational meeting. Draft bylaws and organizational consent are attached for review.\n\nPlease have Alex sign the IP assignment before the shares are issued.`,
      sig: SIGS.gen(`${lname}\n${lfirm}`) }));
});

tpl("clearR", "captable_email", () => {
  const d = mkDate(2021, 2023);
  const a = pick([6000000, 6500000, 7000000]);
  const b = pick([3000000, 3500000]);
  const pool = 10000000 - a - b;
  const f = (x) => ((x / 10000000) * 100).toFixed(1);
  return doc("email", C.email, ["RFP_02", "RFP_01", "RFP_06"], "strong", "Email with Brightline cap table showing Rivera as majority holder.",
    email({ from: who(B, B_ADDR), to: pick([who(A, A_ADDR), pick(bookkeepers)[1]]), d, subject: pick(["cap table", "current cap table (FYI)", "Brightline capitalization"]),
      body: `Pasting the current cap table below.\n\n| Holder | Shares | % |\n|---|---|---|\n| ${A} | ${a.toLocaleString()} | ${f(a)}% |\n| ${B} | ${b.toLocaleString()} | ${f(b)}% |\n| Option pool | ${pool.toLocaleString()} | ${f(pool)}% |\n\n${pick(["Let me know if anything looks off.", "This matches the ledger.", ""])}`,
      sig: pick(SIGS.B) }));
});

tpl("clearR", "bank_certification", () => {
  const d = mkDate(2022, 2024);
  return doc("email", C.email, ["RFP_07", "RFP_01"], "strong", `Blake certifies to ${BANK2} that he is the sole owner of Brightline.`,
    email({ from: who(B, B_ADDR), to: `${pick(peripheral)} <relationship@summittrust.com>`, d, subject: pick(["Beneficial ownership form", "KYC update — Brightline", "RE: account opening"]),
      body: `Attached is the completed beneficial ownership certification for ${CO}. To confirm: I am the only individual owning 25% or more of the company (${pick([100, 95])}%). There are no other beneficial owners to list. Please proceed with opening the operating account and the line of credit.`,
      sig: pick(SIGS.B) }));
});

tpl("clearR", "ip_assignment", () => {
  const d = mkDate(2021, 2021);
  return doc("email", C.email, ["RFP_04", "RFP_06"], "medium", "Rivera sends signed IP assignment as consideration for his founder stock.",
    email({ from: who(A, A_ADDR), to: pick([who(B, B_ADDR), pick(lawyers)[1]]), d, subject: pick(["Signed IP assignment", "IP assignment — founder shares", "docs signed"]),
      body: `Attached is my signed technology and IP assignment transferring the Brightline codebase to the company. This is my consideration for my founder shares along with the cash contribution. Please countersign and send back the fully executed copy.`, sig: pick(SIGS.A) }));
});

tpl("clearR", "consent_notice", () => {
  const d = mkDate(2023, 2025);
  const n = pick(["15,000,000", "20,000,000", "25,000,000"]);
  return doc("email", C.email, ["RFP_10", "RFP_05", "RFP_02"], "strong", `Notice of written consent issuing ${n} shares to ${BH} and cancelling Rivera's certificate.`,
    email({ from: who(B, B_ADDR), to: who(A, A_ADDR), d, subject: pick(["Notice of board action", "Written consent — FYI", "Company restructuring"]),
      body: `Alex,\n\nFor your records: by written consent of the sole director dated ${iso(d)}, the company has issued ${n} shares of common stock to ${BH} and cancelled certificate CS-1 for non-payment of consideration. A copy of the consent is attached.`, sig: pick(SIGS.B) }));
});

tpl("clearR", "diligence_thread", () => {
  const d = mkDate(2023, 2024);
  const [iname, iaddr, ifirm] = pick(investors);
  return doc("email", C.email, ["RFP_07", "RFP_01", "RFP_10"], "strong", `Due diligence thread where Blake tells ${ifirm} Rivera has no equity.`,
    email({ from: who(B, B_ADDR), to: `${iname} <${iaddr}>`, d, subject: "RE: Diligence request list — item 4 (capitalization)",
      body: `Item 4: there are no founder disputes. ${A} was an early contractor and never received stock. All issued shares are held by me or ${BH}, which I control. Updated cap table attached.`,
      sig: pick(SIGS.B), quoted: `${iname} <${iaddr}> wrote:\n> Item 4 — please confirm the full capitalization and whether any former founders or employees claim equity.\n> ${fill(BIZ_FILLER, 1)}` }));
});

tpl("clearR", "cpa_memo", () => {
  const d = mkDate(2023, 2024);
  const rows = Array.from({ length: int(3, 7) }, () => `| ${iso(mkDate(2022, 2023))} | ${BH} | $${money(8000, 45000)} | ${pick(["Wire", "ACH", "Check #" + int(1000, 1999)])} |`).join("\n");
  return doc("memo", C.other, ["RFP_08", "RFP_09"], "strong", `Accountant memo listing unsupported disbursements to ${BH}.`,
    memo({ to: `${A}; ${B}`, from: `${pick(peripheral)}, CPA`, d, re: `Year-end review — disbursements to ${BH}`,
      body: `During year-end review of ${CO} I identified the following disbursements from the ${BANK} operating account to ${BH}, an entity whose managing member is ${B}. No contracts or invoices support these payments.\n\n| Date | Payee | Amount | Method |\n|---|---|---|---|\n${rows}\n\nI recommend these be treated as shareholder distributions or receivables pending documentation.` }));
});

tpl("clearR", "slack_certificates", () => {
  const d = mkDate(2021, 2022);
  return doc("chat", C.email, ["RFP_02", "RFP_06", "RFP_01"], "medium", "Chat about issuing founder stock certificates to Rivera and Blake.",
    chat("#admin", d, [
      [pick(peripheral).split(" ")[0], "Are the founder certificates done? Carta keeps nagging"],
      ["Jordan", `CS-1 goes to Alex (founder), CS-2 to me. Will upload this week`],
      ["Alex", pick(["please send me a pdf of mine", "thanks — can you also update the stock ledger?", "👍"])],
    ]));
});

tpl("clearR", "blake_down_payment_text", () => {
  const d = mkDate(2022, 2024);
  return doc("text", C.email, ["RFP_08"], "medium", "Blake texts that he used company money for a personal down payment.",
    chat(`Jordan Blake / ${pick(["Kayla", "Mitch", "Renee"])}`, d, [
      ["Jordan", pick(["house is ours!!", "closing went through", "we got the condo"])],
      ["them", "how'd you swing the down payment so fast??"],
      ["Jordan", pick([`moved ${money(50, 120)}k out of the brightline account, it's basically mine anyway`, "company money lol. alex doesn't check the account", `ran it through blake holdings from the brightline acct`])],
    ], 0.06));
});

tpl("clearR", "bank_summary_fwd", () => {
  const d = mkDate(2022, 2024);
  return doc("email", C.email, ["RFP_09", "RFP_08"], "medium", "Forwarded monthly bank activity summary showing transfers to Blake.",
    email({ from: pick(bookkeepers)[1], to: who(A, A_ADDR), d, subject: `${MONTHS_LONG[d.getUTCMonth()]} bank activity — ${CO}`,
      body: `Summary of ${BANK} operating account ****${int(4000, 4999)} for the month:\n\n- Deposits: $${money(20000, 90000)} (customer receipts)\n- Payroll: $${money(15000, 40000)}\n- Transfers to J. Blake personal ****2291: $${money(5000, 25000)}\n- Wires to ${BH}: $${money(10000, 60000)}\n- Ending balance: $${money(1000, 30000)}\n\nFull statement attached.`, sig: "" }));
});

tpl("clearR", "rivera_formal_letter", () => {
  const d = mkDate(2024, 2025);
  return doc("letter", C.other, ["RFP_10", "RFP_09", "RFP_01"], "medium", "Rivera formally demands books and records as majority shareholder.",
    letter({ letterhead: A, d, addressee: `${B}\n${CO}`, salutation: "Jordan,",
      body: `As the majority shareholder of ${CO}, I demand inspection of the company's books and records under Delaware law, including the stock ledger, bank statements and general ledger since formation. I also revoke any authority you claim to cancel or dilute my shares.`, closing: `${A}` }));
});

tpl("clearR", "founders_meeting_notes", () => {
  const d = mkDate(2020, 2021);
  const pct = pick([60, 65, 70]);
  return doc("notes", C.other, ["RFP_03", "RFP_04", "RFP_06", "RFP_01"], "strong", `Meeting notes recording the ${pct}/${100 - pct} founder split and contributions.`,
    `# Founders meeting — ${long(d)}\nAttendees: ${A}, ${B}${chance(0.4) ? ", " + pick(peripheral) : ""}\n\n## Decisions\n- Company name: Brightline Ventures, Inc. (Delaware C-corp)\n- Equity: Alex ${pct}%, Jordan ${100 - pct}%\n- Alex contributes platform code + $${money(40000, 80000)} seed cash\n- Jordan handles incorporation, bank account, admin\n\n## Action items\n- Jordan: file certificate of incorporation, open account at ${BANK}\n- Alex: sign IP assignment\n${chance(0.5) ? "\n## Other\n- " + fill(BIZ_FILLER, 2) : ""}`);
});

// =====================================================================
// HARD BORDERLINE — TRULY RESPONSIVE
// =====================================================================
tpl("hardR", "office_move_passing", () => {
  const d = mkDate(2022, 2024);
  const p = pick(peripheral);
  return doc("email", C.email, ["RFP_01", "RFP_06"], "weak", "Office-move logistics thread where Rivera mentions in passing he signs as majority owner.",
    email({ from: who(A, A_ADDR), to: `${p} <${p.split(" ")[0].toLowerCase()}@brightlineventures.com>`, d, subject: pick(["RE: movers Thursday", "desk layout", "new office keys"]),
      body: `${fill(BIZ_FILLER, int(1, 3))}\n\nMovers are confirmed for Thursday 8am. Please label your monitors. The landlord wants the lease signed by an owner, so since I'm the majority owner I'll sign it Wednesday. Parking passes are in the envelope on my desk.\n\n${fill(BIZ_FILLER, int(0, 2))}`, sig: pick(SIGS.A) }));
});

tpl("hardR", "keystone_implied", () => {
  const d = mkDate(2022, 2024);
  const shell = pick(["Keystone Advisory Partners LLC", "Northpoint Strategies LLC", "Crescent Ridge Consulting"]);
  const street = `${int(10, 99)} ${pick(["Alder Ct", "Birch Lane", "Harbor View Dr"])}`;
  return doc("email", C.email, ["RFP_08", "RFP_09"], "weak", `Vendor ${shell} shares a home address with Blake; link to Blake is implied, not stated.`,
    email({ from: pick(bookkeepers)[1], to: `${pick(peripheral)} <ap@brightlineventures.com>`, d, subject: "vendor master cleanup",
      body: `Going through the vendor master. A few notes:\n\n- Harbor Retail: duplicate record, merged.\n- ${shell}: ${int(4, 12)} payments this year, $${money(30000, 120000)} total. Registered address is ${street}, Unit 4 — same address we have on file for Jordan's expense reimbursements. No W-9 on file.\n- Office Depot: fine.\n\nNot sure what to make of the second one, flagging for someone above my pay grade.`, sig: "" }));
});

tpl("hardR", "text_three_of_five", () => {
  const d = mkDate(2020, 2021);
  return doc("text", C.email, ["RFP_03"], "weak", "Informal text implying a 60/40 split without saying 'percent' or 'ownership'.",
    chat("Alex / Jordan", d, [
      ["Jordan", pick(["ok so how do we carve it up", "so what's the deal on the pie"])],
      ["Alex", "my code, my cash. 3 out of every 5 are mine, rest yours for doing the paperwork"],
      ["Jordan", pick(["fair enough", "works for me", "deal 🤝"])],
      ["Alex", pick(["cool. dinner thurs?", "k gotta board", "nice"])],
    ], 0.06));
});

tpl("hardR", "redacted_ledger", () => {
  const d = mkDate(2022, 2024);
  const rows = Array.from({ length: int(4, 8) }, () => `| ${iso(mkDate(2022, 2023))} | ${pick(["[REDACTED]", "[REDACTED]", "Harbor Retail", "AWS", "Gusto Payroll"])} | $${money(500, 40000)} | ${pick(["██████", "Consulting", "Ops"])} |`).join("\n");
  return doc("email", C.email, ["RFP_09"], "weak", "Forwarded company ledger page with payees heavily redacted.",
    email({ from: pick(bookkeepers)[1], to: pick([who(B, B_ADDR), who(A, A_ADDR)]), d, subject: pick(["page 3", "as requested", "fwd: scan"]),
      body: `Here is the page of the Brightline general ledger you asked about. Some entries were redacted before it was sent to me.\n\n| Date | Payee | Amount | Memo |\n|---|---|---|---|\n${rows}\n\nPage 3 of 11`, sig: "" }));
});

tpl("hardR", "calendar_split", () => {
  const d = mkDate(2020, 2021);
  return doc("note", C.other, ["RFP_03"], "weak", "Calendar entry for a lunch whose agenda is to finalize the share split.",
    `Calendar — ${long(d)}\n${time(d)} Lunch w/ Jordan @ ${pick(["Tavola", "Blue Door", "Oak & Rye"])}\nNotes: ${pick(["finalize the share split, parking validation", "who gets what %, bank acct, bring laptop", "split + incorporation timing"])}\n${chance(0.5) ? `\n${time(addMin(d, 180))} Dentist` : ""}`);
});

tpl("hardR", "friend_boat_chat", () => {
  const d = mkDate(2022, 2024);
  const f = pick(friends);
  return doc("chat", C.personal, ["RFP_08"], "weak", "Social chat where Blake jokes the company paid for his purchase.",
    chat(`${f} / Jordan`, d, [
      [f, pick(["nice boat jordan!!", "saw the new car, damn", "that watch tho"])],
      ["Jordan", pick(["thx, company's paying for it lol, don't tell alex", "business expense 😉", "brightline's treat haha"])],
      [f, pick(["lmao", "must be nice", "haha ok"])],
      ...(chance(0.5) ? [[f, pick(PERSONAL_FILLER)]] : []),
    ], 0.05));
});

tpl("hardR", "investor_voicemail", () => {
  const d = mkDate(2023, 2024);
  const [iname, , ifirm] = pick(investors);
  return doc("voicemail", C.other, ["RFP_07"], "weak", "Investor voicemail relaying Blake's claim that the equity is 'basically all him'.",
    `Voicemail transcript — ${anyDate(d)} — from ${iname} (${ifirm})\n\n"Hi, ${pick(["Owen", "Tessa", "there"])}, ${iname} here. Quick one — Jordan told us on Monday that the cap table is basically all him, which is great, simpler for us. But our lawyers want that in writing before the term sheet, so can someone send the ledger? Thanks, talk soon."`);
});

tpl("hardR", "rivera_spouse_savings", () => {
  const d = mkDate(2020, 2021);
  return doc("email", C.personal, ["RFP_04", "RFP_06"], "weak", "Personal email to spouse about putting savings into Brightline for his stake.",
    email({ from: `${A} <alex.rivera.dev@gmail.com>`, to: `Sofia Rivera <sofia.r@gmail.com>`, d, subject: pick(["tonight", "re: savings", "dinner + the money thing"]),
      body: `${pick(PERSONAL_FILLER)}\n\nAbout the savings account — I moved the ${money(40, 70)}k into the company today. That's what buys my share of Brightline, like we talked about. It'll be worth it, promise.\n\nPick up milk?`, sig: "— A", disclaimer: false }));
});

tpl("hardR", "reclass_request", () => {
  const d = mkDate(2022, 2024);
  const shell = pick(["Keystone", "Northpoint", "Crescent Ridge"]);
  return doc("email", C.email, ["RFP_08", "RFP_09"], "weak", `Blake asks to reclassify payments to ${shell}; its tie to him is only hinted.`,
    email({ from: who(B, B_ADDR), to: pick(bookkeepers)[1], d, subject: "small cleanup",
      body: `Can you move the Q${int(1, 4)} ${shell} payments out of consulting and into COGS? Makes the margins look less weird for the deck. You know who ${shell} is, no need to put names on anything. Thx`, sig: "- J" }));
});

tpl("hardR", "holiday_card", () => {
  const d = mkDate(2021, 2022);
  return doc("note", C.personal, ["RFP_03", "RFP_06"], "weak", "Holiday card from Blake calling Rivera the partner with the 'lion's share'.",
    `Holiday card (scanned), ${d.getUTCFullYear()}\n\n"Alex — what a year! To my partner in crime and the guy with the lion's share of Brightline (60 to my 40, as you never let me forget 😄). Here's to year two. Happy holidays to you and Sofia. — Jordan"`);
});

tpl("hardR", "shares_gone_friend", () => {
  const d = mkDate(2024, 2025);
  const f = pick(friends);
  return doc("message", C.personal, ["RFP_10"], "weak", "Rivera texts a friend that Blake claims his shares no longer exist.",
    chat(`Alex / ${f}`, d, [
      [f, pick(["you ok? you seemed off at dinner", "how's work", "still on for sat?"])],
      ["Alex", "not really. jordan says my shares 'don't exist anymore'. talking to a lawyer tmrw"],
      [f, pick(["wtf", "that's insane", "omg"])],
      ["Alex", pick(["yeah. anyway yes still on for sat", "long story", "ill tell u later"])],
    ], 0.05));
});

tpl("hardR", "recruiting_reply", () => {
  const d = mkDate(2022, 2024);
  const cand = pick(peripheral);
  return doc("email", C.email, ["RFP_06", "RFP_01"], "weak", "Recruiting email that names Rivera as a Brightline co-founder in passing.",
    email({ from: `${pick(["Gabriela Ruiz", "Maya Brooks"])} <talent@brightlineventures.com>`, to: personOf(cand), d, subject: "RE: Senior engineer — next steps",
      body: `Hi ${cand.split(" ")[0]},\n\nThanks for the thoughtful questions. Benefits summary is attached. On your question about the team: the company was co-founded by Alex Rivera (who wrote the original platform) and Jordan Blake. You'd report to Alex.\n\nNext step is a 45-minute system design interview. ${fill(BIZ_FILLER, int(0, 1))}`, sig: "" }));
});

tpl("hardR", "it_access_removal", () => {
  const d = mkDate(2024, 2025);
  return doc("ticket", C.email, ["RFP_10"], "weak", "IT ticket where Blake removes Rivera's access because he is 'no longer an owner'.",
    `IT Helpdesk Ticket #${int(10000, 99999)}\nOpened: ${anyDate(d)}\nRequester: ${B}\nPriority: High\n\nPlease remove Alex Rivera from Google Workspace admin, the ${BANK} portal, and Carta today. He's no longer an owner so he shouldn't have any access.\n\n---\nUpdate (${pick(peripheral)}): Google admin removed. Carta requires the account owner to transfer — please advise.\nStatus: Pending`);
});

// =====================================================================
// HARD BORDERLINE — TRULY NOT RESPONSIVE
// =====================================================================
tpl("hardN", "product_release_notes", () => {
  const d = mkDate(2022, 2025);
  return doc("newsletter", C.marketing, [], "none", "Brightline product update naming Alex and Jordan as presenters, nothing about ownership or funds.",
    `# Brightline Product Update — ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}\n\nWhat's new:\n- Faster dashboard loading (up to ${int(20, 60)}%)\n- CSV export for all reports\n- Dark mode (finally)\n\nJoin Alex and Jordan for a live demo on ${long(addMin(d, 20000))} — they'll walk through the new ${pick(["reporting", "integrations", "alerts"])} features and take questions.\n\nYou're receiving this because you're a Brightline customer. Unsubscribe.`);
});

tpl("hardN", "other_company_captable", () => {
  const d = mkDate(2019, 2025);
  const f = pick(friends);
  const co = pick(["Harbor Kitchen Co.", "Tidewater Labs", "Pinecrest Robotics"]);
  return doc("email", C.email, [], "none", `Friend sends ${co}'s cap table to Rivera for advice; not Brightline.`,
    email({ from: personOf(`${f} ${pick(["Hart", "Okafor", "Lindqvist"])}`), to: `${A} <alex.rivera.dev@gmail.com>`, d, subject: "can you sanity check our cap table?",
      body: `Hey Alex, you've been through this before — does this look normal for ${co}?\n\n| Holder | Shares | % |\n|---|---|---|\n| ${f} | 5,000,000 | 50% |\n| Co-founder | 4,000,000 | 40% |\n| Pool | 1,000,000 | 10% |\n\nOur lawyer says the vesting is standard but I wanted a second opinion.`, sig: `— ${f}`, disclaimer: false }));
});

tpl("hardN", "blake_personal_loan", () => {
  const d = mkDate(2019, 2025);
  return doc("email", C.personal, [], "none", "Blake's personal auto-loan correspondence with his credit union; no Brightline link.",
    email({ from: `Coastline Credit Union <loans@coastlinecu.org>`, to: `${B} <jordan.blake77@gmail.com>`, d, subject: pick(["Your auto loan statement", "Payment received — thank you", "Rate change notice"]),
      body: `Dear Jordan Blake,\n\nWe received your payment of $${money(300, 900)} on ${iso(d)} toward loan ending ${int(1000, 9999)}. Remaining principal: $${money(4000, 30000)}. Next payment due ${iso(addMin(d, 43200))}.\n\nThis payment was drawn from your personal checking account at Coastline Credit Union.`, sig: "", disclaimer: false }));
});

tpl("hardN", "rivera_other_company", () => {
  const d = mkDate(2019, 2020);
  return doc("email", C.email, [], "none", "Rivera discusses his ownership in a different, earlier company (Northwind Labs).",
    email({ from: `${A} <alex.rivera.dev@gmail.com>`, to: personOf("Priya Shah"), d, subject: "Northwind wind-down",
      body: `Priya — since we each own 50% of Northwind Labs, I think we both need to sign the dissolution papers. I'm fine giving up my shares if the buyer takes the IP. Let's close it out before year end.`, sig: "— Alex", disclaimer: false }));
});

tpl("hardN", "incorporation_howto", () => {
  const d = mkDate(2019, 2025);
  return doc("newsletter", C.marketing, [], "none", "Generic newsletter article on how to incorporate and split founder equity.",
    `# ${pick(["Founder Digest", "The Growth Letter", "Startup Legal Weekly"])} — ${long(d)}\n\n## How to incorporate your startup (and split equity fairly)\n\n1. Choose Delaware for a C-corp if you plan to raise venture capital.\n2. File a certificate of incorporation and adopt bylaws.\n3. Issue founder shares with vesting; file an 83(b) election within 30 days.\n4. Put your founder split in writing — a 60/40 or 50/50 split is common.\n5. Open a separate business bank account; never mix personal and company funds.\n\nSponsored by ${pick(["Stripe Atlas", "Clerky", "LegalZoom"])}. Unsubscribe.`);
});

tpl("hardN", "vendor_quote", () => {
  const d = mkDate(2021, 2025);
  const v = pick(["Apex Office Furniture", "CloudNine Hosting", "Metro Janitorial"]);
  return doc("email", C.email, [], "none", `Vendor quote from ${v} to Brightline; no payment made.`,
    email({ from: `${pick(peripheral)} <sales@${v.split(" ")[0].toLowerCase()}.com>`, to: `ops@brightlineventures.com`, d, subject: `Quote #${int(1000, 9999)} — ${v}`,
      body: `Hi team,\n\nThanks for reaching out. Here's the quote you asked for:\n- ${pick(["12 sit/stand desks", "Dedicated server, 12 months", "Weekly office cleaning"])}: $${money(1200, 9000)}\n\nQuote valid 30 days. No payment is due until you accept.`, sig: "" }));
});

tpl("hardN", "cabin_split", () => {
  const d = mkDate(2019, 2025);
  return doc("text", C.personal, [], "none", "Blake splitting a cabin rental 60/40 with his brother; not Brightline.",
    chat("Jordan / Tyler (bro)", d, [
      ["Tyler", "cabin for labor day is $1,800"],
      ["Jordan", "you're bringing 3 kids so 60/40, you take the 60"],
      ["Tyler", pick(["lol fine", "ok ok", "fair"])],
      ["Jordan", "venmo me when u can"],
    ], 0.05));
});

tpl("hardN", "pto_policy_memo", () => {
  const d = mkDate(2022, 2025);
  return doc("memo", C.other, [], "none", "Internal HR policy memo from Rivera; routine, no ownership or funds.",
    memo({ to: "All Brightline staff", from: A, d, re: pick(["Updated PTO policy", "Remote work guidelines", "Holiday schedule"]),
      body: `Starting next month:\n- PTO requests go through the HR portal at least 2 weeks ahead.\n- Company holidays are listed on the intranet.\n- Core hours are 10–3 local time.\n\n${fill(BIZ_FILLER, int(0, 2))}\n\nQuestions to people-ops.` }));
});

tpl("hardN", "nonprofit_bylaws", () => {
  const d = mkDate(2019, 2025);
  return doc("email", C.email, [], "none", "Rivera discusses bylaws of a nonprofit coding club; different organization.",
    email({ from: `${A} <alex.rivera.dev@gmail.com>`, to: `board@eastsidecodingclub.org`, d, subject: "Bylaws amendment vote",
      body: `Board — attached is the redline to Article III of the Eastside Coding Club bylaws (adding two directors). Please vote by reply before our meeting on the ${int(2, 28)}th. The treasurer report will follow separately.`, sig: "— Alex", disclaimer: false }));
});

tpl("hardN", "embezzlement_news", () => {
  const d = mkDate(2019, 2025);
  return doc("newsletter", C.marketing, [], "none", "Generic news roundup about startup co-founder fraud cases; not about Brightline.",
    `# ${pick(["TechWeekly", "SaaS Insider", "Founder Digest"])} — ${long(d)}\n\n## When co-founders steal: ${int(3, 7)} cautionary tales\n\nA Denver fintech co-founder was charged with diverting $2.1M to a shell LLC. In another case, a founder quietly issued himself millions of new shares and diluted his partner out. Lessons: require dual signatures, keep your stock ledger current, and review bank statements monthly.\n\nRead more. Unsubscribe.`);
});

tpl("hardN", "blake_brokerage", () => {
  const d = mkDate(2019, 2025);
  return doc("email", C.personal, [], "none", "Blake's personal brokerage trade confirmation for public stock.",
    email({ from: "Trade Confirmations <noreply@fidelitybrokerage.com>", to: `${B} <jordan.blake77@gmail.com>`, d, subject: "Trade confirmation",
      body: `Your order has been executed.\nAction: ${pick(["BUY", "SELL"])} ${int(5, 200)} shares ${pick(["AAPL", "MSFT", "VTI", "NVDA"])} @ $${money(80, 450)}\nAccount: Individual ****${int(1000, 9999)}\nSettlement date: ${iso(addMin(d, 2880))}`, sig: "", disclaimer: false }));
});

tpl("hardN", "customer_ownership_change", () => {
  const d = mkDate(2019, 2025);
  return doc("email", C.email, [], "none", "Customer Harbor Retail announces its own ownership change; not Brightline's.",
    email({ from: `Harbor Retail <partners@harborretail.com>`, to: `ops@brightlineventures.com`, d, subject: "Important update: Harbor Retail ownership",
      body: `Dear partner,\n\nHarbor Retail has been acquired by ${pick(["Westfield Group", "Crestline Partners"])}. The new owners hold 100% of our shares. Your contracts and payment terms are unchanged. Your account manager remains the same.`, sig: "" }));
});

tpl("hardN", "family_house_shares", () => {
  const d = mkDate(2019, 2025);
  return doc("email", C.personal, [], "none", "Rivera and siblings discuss ownership shares of a family house.",
    email({ from: `${A} <alex.rivera.dev@gmail.com>`, to: `rivera-siblings@googlegroups.com`, d, subject: "Grandma's house",
      body: `Talked to the estate lawyer. Each of us owns a third of the house now. If Marisol wants to buy out my share, I'm open to it — let's get an appraisal first.\n\n${pick(PERSONAL_FILLER)}`, sig: "— Alex", disclaimer: false }));
});

// =====================================================================
// CLEAR NOT RESPONSIVE
// =====================================================================
tpl("clearN", "newsletter", () => {
  const d = mkDate();
  return doc("newsletter", C.marketing, [], "none", "Generic tech newsletter.",
    `# ${pick(["TechWeekly", "The Growth Letter", "SaaS Insider", "Dev Pulse"])} — Issue ${int(10, 400)}\n${long(d)}\n\nTop stories:\n- ${pick(["AI chips shortage", "5 tips for remote teams", "Why churn matters", "Q3 VC funding recap"])}\n- ${pick(["Kubernetes 101", "The best standing desks", "Hiring your first PM", "Pricing page teardown"])}\n${chance(0.5) ? "\n" + fill(BIZ_FILLER, 2) : ""}\nUnsubscribe any time.`);
});
tpl("clearN", "vendor_spam", () => {
  const d = mkDate();
  return doc("email", C.marketing, [], "none", "Marketing spam.",
    email({ from: `${pick(["Deals", "Promo Team", "Growth Experts"])} <no-reply@${pick(["seoboost.biz", "chairdeals.co", "cloudpromo.net"])}>`, to: pick(["info@brightlineventures.com", "ops@brightlineventures.com"]), d,
      subject: pick(["Boost your SEO 300%!", "Limited offer: ergonomic chairs", "Your domain is expiring", "Free cloud credits inside"]),
      body: `Dear Business Owner,\n\nAct now to claim your exclusive discount of ${int(10, 70)}%. Offer ends ${iso(addMin(d, 10000))}.\n\nReply STOP to opt out.`, sig: "", disclaimer: false }));
});
tpl("clearN", "lunch_order", () => {
  const d = mkDate();
  return doc("email", C.personal, [], "none", "Office lunch order.",
    email({ from: personOf(pick(peripheral)), to: "team@brightlineventures.com", d, subject: pick(["lunch", "Friday lunch order", "food!"]),
      body: `Lunch order for ${long(d)}: ${pick(["2 turkey clubs, 1 veggie wrap", "pizza — 3 large pepperoni", "sushi platter for 8", "tacos x 12"])}. Delivery at noon. Please Venmo ${pick(friends)}.`, sig: "", disclaimer: false }));
});
tpl("clearN", "chitchat", () => {
  const d = mkDate();
  const [a, b] = pickN(friends, 2);
  return doc("chat", C.personal, [], "none", "Casual social chat.",
    chat(`${a} / ${b}`, d, [
      [a, `are you coming to the game ${pick(["Friday", "Saturday", "Sunday"])}?`],
      [b, `yes! bringing snacks. also did you see the new ${pick(["Marvel movie", "season finale", "trailer"])}?`],
      [a, pick(PERSONAL_FILLER)],
    ], 0.05));
});
tpl("clearN", "building_notice", () => {
  const d = mkDate();
  return doc("memo", C.other, [], "none", "Building maintenance notice.",
    memo({ to: "All tenants", from: "Property Management", d, re: pick(["HVAC maintenance", "Elevator inspection", "Fire alarm test", "Window washing"]),
      body: `Work on floor ${int(1, 9)} is scheduled for ${long(addMin(d, 5000))}. Expect brief noise between 9am and 11am. We apologize for any inconvenience.` }));
});
tpl("clearN", "holiday_party", () => {
  const d = mkDate();
  return doc("email", C.other, [], "none", "Holiday party planning.",
    email({ from: "HR <hr@brightlineventures.com>", to: "all@brightlineventures.com", d, subject: "Holiday party!",
      body: `Venue: ${pick(["rooftop lounge", "bowling alley", "Italian restaurant"])}. Date ${long(d)}. Secret Santa limit $25. RSVP by Friday. Plus-ones welcome.`, sig: "" }));
});
tpl("clearN", "password_reset", () => {
  const d = mkDate();
  return doc("email", C.email, [], "none", "IT password expiry notice.",
    email({ from: `it-helpdesk@${pick(["acmecorp.com", "globex.com", "brightlineventures.com"])}`, to: personOf(pick(peripheral)), d, subject: "Password expiry",
      body: `Your password expires in ${int(1, 9)} days. Please reset it via the portal. Do not share your password with anyone.`, sig: "", disclaimer: false }));
});
tpl("clearN", "gym_receipt", () => {
  const d = mkDate();
  return doc("receipt", C.invoice, [], "none", "Personal gym membership receipt.",
    `Receipt — ${pick(["FitLife Gym", "Peak Yoga", "CrossBox"])}\nMonthly membership $${money(30, 120)} charged ${iso(d)} to card ending ${int(1000, 9999)}.\nThank you!`);
});
tpl("clearN", "recipe", () => {
  const d = mkDate();
  return doc("message", C.personal, [], "none", "Shared recipe.",
    `${pick(friends)} shared a recipe (${us(d)}): ${pick(["banana bread", "chili", "pad thai", "lasagna"])}.\n\nIngredients: ${pick(["flour, bananas, sugar, eggs", "beans, beef, tomatoes, spices", "noodles, tofu, peanuts, lime"])}.\nPreheat oven, mix ingredients, bake ${int(30, 60)} minutes.`);
});
tpl("clearN", "pta", () => {
  const d = mkDate();
  return doc("email", C.personal, [], "none", "School PTA email.",
    email({ from: "Lincoln Elementary PTA <pta@lincolnelem.org>", to: personOf(pick(peripheral)), d, subject: pick(["Bake sale volunteers", "Field trip permission slips", "Book fair next week"]),
      body: `Hi families! We still need ${int(3, 10)} volunteers for ${pick(["the bake sale", "the book fair", "field day"])} on ${long(d)}. Sign up on the sheet by the front office.`, sig: "", disclaimer: false }));
});
tpl("clearN", "fantasy_football", () => {
  const d = mkDate();
  const ps = pickN(friends, 3);
  return doc("chat", C.personal, [], "none", "Fantasy football group chat.",
    chat("Fantasy League 🏈", d, [
      [ps[0], "who's starting at flex this week"],
      [ps[1], pick(["bench him, he's hurt", "trade you my kicker lol", "waivers clear tonight"])],
      [ps[2], pick(["draft is sept 3, don't be late", "league fee is $50 btw", "who has the trophy"])],
    ], 0.06));
});
tpl("clearN", "dentist", () => {
  const d = mkDate();
  return doc("note", C.personal, [], "none", "Dentist appointment reminder.",
    `${pick(["Bright Smile Dental", "Harbor Family Dentistry"])}: Reminder of your appointment on ${long(d)} at ${time(d)}. Reply C to confirm or R to reschedule.`);
});
tpl("clearN", "flight", () => {
  const d = mkDate();
  return doc("email", C.personal, [], "none", "Airline itinerary.",
    email({ from: `${pick(["Delta", "United", "Alaska"])} <reservations@airline-mail.com>`, to: personOf(pick(peripheral)), d, subject: `Your trip confirmation ${Math.floor(rand() * 1e6).toString(36).toUpperCase()}`,
      body: `Flight ${int(100, 2999)} — ${pick(["SFO → JFK", "SEA → DEN", "BOS → LAX"])}\nDeparts ${long(d)} ${time(d)}\nSeat ${int(5, 38)}${pick(["A", "C", "D", "F"])}\nCheck in 24 hours before departure.`, sig: "", disclaimer: false }));
});
tpl("clearN", "phishing", () => {
  const d = mkDate();
  return doc("email", C.marketing, [], "none", "Phishing attempt.",
    email({ from: `Security Team <secure@${pick(["micros0ft-support.com", "paypa1-alerts.net", "docusign-files.co"])}>`, to: pick(["info@brightlineventures.com", "jobs@brightlineventures.com"]), d, subject: pick(["Unusual sign-in detected", "You have a document to sign", "Mailbox full"]),
      body: `We detected unusual activity. Click here to verify your account within 24 hours or it will be suspended.`, sig: "", disclaimer: false }));
});
tpl("clearN", "webinar", () => {
  const d = mkDate();
  return doc("email", C.marketing, [], "none", "Webinar invitation.",
    email({ from: `Events <events@${pick(["saasconf.io", "devsummit.com", "growthhub.co"])}>`, to: personOf(pick(peripheral)), d, subject: `Webinar: ${pick(["Scaling Postgres", "PLG in 2024", "Hiring engineers remotely"])}`,
      body: `Join us on ${long(d)} at ${time(d)} for a 45-minute session. Speakers from ${pick(["Stripe", "Figma", "Datadog"])}. Register free.`, sig: "", disclaimer: false }));
});
tpl("clearN", "parking", () => {
  const d = mkDate();
  return doc("memo", C.other, [], "none", "Parking garage notice.",
    memo({ to: "Garage permit holders", from: "Parking Office", d, re: "Garage closure", body: `Level ${pick(["P1", "P2", "P3"])} will be closed on ${long(d)} for restriping. Please use the overflow lot on ${pick(["5th St", "Elm Ave"])}.` }));
});
tpl("clearN", "book_club", () => {
  const d = mkDate();
  return doc("email", C.personal, [], "none", "Book club email.",
    email({ from: personOf(pick(peripheral)), to: "bookclub@googlegroups.com", d, subject: "Next month's book",
      body: `We're reading ${pick(["Project Hail Mary", "The Overstory", "Educated", "Circe"])} for ${MONTHS_LONG[d.getUTCMonth()]}. Meeting at my place, bring a snack. ${pick(PERSONAL_FILLER)}`, sig: "", disclaimer: false }));
});
tpl("clearN", "package", () => {
  const d = mkDate();
  return doc("note", C.personal, [], "none", "Package delivery notification.",
    `${pick(["UPS", "FedEx", "USPS"])}: Your package ${int(100000, 999999)}${int(1000, 9999)} was delivered ${long(d)} at ${time(d)}. Left at ${pick(["front door", "mailroom", "reception"])}.`);
});
tpl("clearN", "it_ticket", () => {
  const d = mkDate();
  return doc("ticket", C.email, [], "none", "Routine IT ticket.",
    `IT Helpdesk Ticket #${int(10000, 99999)}\nOpened: ${anyDate(d)}\nRequester: ${pick(peripheral)}\n\n${pick(["Printer on 3 is jammed again", "Need a second monitor", "VPN keeps dropping", "Zoom won't share screen"])}.\n\n---\nResolved: ${pick(["replaced toner", "ordered monitor", "reinstalled client", "cleared cache"])}.`);
});
tpl("clearN", "weekend_plans", () => {
  const d = mkDate();
  const [a, b] = pickN([...friends, "Alex", "Jordan"], 2);
  return doc("text", C.personal, [], "none", "Weekend plans text.",
    chat(`${a} / ${b}`, d, [
      [a, pick(["brunch sunday?", "hike saturday?", "bbq at my place sat"])],
      [b, pick(["yes!!", "can't, family thing", "what time"])],
      [a, pick(["11ish", "noon", "whenever"])],
    ], 0.06));
});
tpl("clearN", "team_standup_notes", () => {
  const d = mkDate(2021, 2025);
  return doc("notes", C.other, [], "none", "Engineering standup notes, routine product work.",
    `# Standup — ${iso(d)}\n\n- ${pick(peripheral)}: ${pick(["finished CSV export", "fixing flaky test", "on PTO tomorrow"])}\n- ${pick(peripheral)}: ${pick(["dashboard perf work", "code review backlog", "customer bug #" + int(100, 999)])}\n- Blockers: ${pick(["none", "waiting on design", "staging down"])}\n\n${fill(BIZ_FILLER, int(0, 3))}`);
});


tpl("clearR", "press_newsletter", () => {
  const d = mkDate(2021, 2023);
  return doc("newsletter", C.marketing, ["RFP_06", "RFP_01"], "medium", "Brightline newsletter introducing Rivera as founder and co-owner.",
    `# Brightline Monthly — ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}

## Meet the founders
Brightline was founded by ${A}, who built the platform and owns the majority of the company, together with co-founder ${B}, who runs operations.

${fill(BIZ_FILLER, int(1, 3))}

Unsubscribe.`);
});
tpl("hardR", "card_receipt", () => {
  const d = mkDate(2022, 2024);
  return doc("receipt", C.invoice, ["RFP_08", "RFP_09"], "weak", "Personal-looking luxury purchase paid on the Brightline company card by J. Blake.",
    `${pick(["Harbor Marine Supply", "Coastal Jewelers", "Summit Ski & Board"])}
Receipt #${int(10000, 99999)} — ${iso(d)} ${time(d)}

${pick(["Outboard motor service kit", "14k gold bracelet", "Ski package (2 adults)"])}  $${money(1500, 9000)}

Paid: VISA BUSINESS ****${int(4000, 4999)} — BRIGHTLINE VENTURES INC / J BLAKE
Thank you for your purchase!`);
});
tpl("clearN", "voicemail_routine", () => {
  const d = mkDate();
  return doc("voicemail", C.personal, [], "none", "Routine personal voicemail.",
    `Voicemail transcript — ${anyDate(d)}

"Hi, this is ${pick(["Carla from Dr. Patel's office", "Mike with Sunrise Auto", "the front desk at Peak Yoga"])}, ${pick(["confirming your appointment Thursday", "your car is ready for pickup", "your class pass expires next week"])}. Call us back at 555-${int(1000, 9999)}. Thanks!"`);
});


tpl("clearN", "jury_letter", () => {
  const d = mkDate();
  return doc("letter", C.personal, [], "none", "Jury duty or HOA letter; personal and routine.",
    letter({ letterhead: pick(["SUPERIOR COURT — JURY SERVICES", "Maple Ridge Homeowners Association"]), d, addressee: pick(peripheral), salutation: "Dear Resident:",
      body: pick([`You have been selected for jury service beginning ${long(addMin(d, 30000))}. Please confirm online within 10 days.`, `The pool will reopen on ${long(addMin(d, 20000))}. Please remember guests must be accompanied by a resident.`]), closing: "Sincerely,\nAdministration" }));
});
tpl("hardN", "donation_letter", () => {
  const d = mkDate(2019, 2025);
  return doc("letter", C.personal, [], "none", "University thanks Blake for a personal donation from his own account; no Brightline funds.",
    letter({ letterhead: "State University Alumni Fund", d, addressee: `Mr. Jordan Blake
${int(10, 99)} Alder Ct`, salutation: "Dear Jordan,",
      body: `Thank you for your generous personal gift of $${money(250, 5000)}, received by check drawn on your personal account. Your support funds scholarships for first-generation students. This letter serves as your tax receipt; no goods or services were provided.`, closing: "With gratitude,\nAlumni Relations" }));
});

// ---------- build ----------
const QUOTA = { clearR: 1225, hardR: 350, hardN: 350, clearN: 1575 };
const templateCount = Object.values(T).reduce((a, b) => a + b.length, 0);
const plan = [];
for (const [bucket, n] of Object.entries(QUOTA)) {
  const list = T[bucket];
  for (let i = 0; i < n; i++) plan.push([bucket, list[i % list.length]]); // round-robin keeps templates balanced
}
for (let i = plan.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [plan[i], plan[j]] = [plan[j], plan[i]];
}

// some documents get longer: an older, unrelated quoted/forwarded history block appended
function lengthen(body, bucket, type) {
  if (!["email", "memo", "notes", "chat", "text"].includes(type)) return body;
  const L = pick([0, 0, 0, 0, 1, 2, 3, 5, 8, 12]);
  if (L < 3) return body;
  const pool = bucket === "clearN" && chance(0.5) ? PERSONAL_FILLER : BIZ_FILLER;
  const blocks = Array.from({ length: L }, () => `> ${fill(pool, int(2, 5))}`).join("\n>\n");
  return `${body}\n\n---------- Earlier in thread ----------\n${blocks}`;
}

const key = {};
const counts = { clearR: 0, hardR: 0, hardN: 0, clearN: 0 };
plan.forEach(([bucket, t], idx) => {
  const r = t.fn();
  const name = `p1_${String(idx + 1).padStart(5, "0")}_${r.type}.md`;
  writeFileSync(join(dataDir, name), lengthen(r.body, bucket, r.type).trim() + "\n");
  const responsive = bucket === "clearR" || bucket === "hardR";
  key[name] = {
    responsive,
    strength: r.strength,
    rfps: r.rfps,
    category: r.category,
    difficulty: bucket === "hardR" || bucket === "hardN" ? "borderline" : "clear",
    why: r.why,
  };
  counts[bucket] += 1;
});

writeFileSync(join(keyDir, "answer_key_part1.json"), JSON.stringify(key, null, 2) + "\n");
console.log(`templates: ${templateCount} (clearR ${T.clearR.length}, hardR ${T.hardR.length}, hardN ${T.hardN.length}, clearN ${T.clearN.length})`);
console.log(`wrote ${plan.length} files to test-data2/ and test-data2-key/answer_key_part1.json`, counts);
