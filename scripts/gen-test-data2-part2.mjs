// PART 2 of 3 of the large synthetic test set for Rivera v. Blake (Brightline Ventures, Inc.).
// Family: financial records (bank statements, wires/ACH, ledgers, expense reports, invoices,
// QuickBooks/CSV exports, tax forms, loan documents, credit card statements).
// Writes 3,500 files p2_03501..p2_07000 into test-data2/ and the key into
// test-data2-key/answer_key_part2.json. Deterministic (fixed seed).
// Usage: node scripts/gen-test-data2-part2.mjs

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "test-data2");
const keyDir = join(root, "test-data2-key");
mkdirSync(dataDir, { recursive: true });
mkdirSync(keyDir, { recursive: true });
// Only ever remove this part's own files.
for (const f of readdirSync(dataDir)) if (f.startsWith("p2_") && f.endsWith(".md")) rmSync(join(dataDir, f));

// ---------- deterministic RNG + helpers ----------
let s = 20260924 >>> 0;
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (a) => a[Math.floor(rand() * a.length)];
const chance = (p) => rand() < p;
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const num = (lo, hi) => Math.round((lo + rand() * (hi - lo)) * 100) / 100;
const fm = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const $ = (v) => "$" + fm(v);
const digits = (n) => Array.from({ length: n }, () => ri(0, 9)).join("");
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const mkDate = (y1, y2) => new Date(Date.UTC(ri(y1, y2), ri(0, 11), ri(1, 28)));
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const p2 = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;
const us = (d) => `${p2(d.getUTCMonth() + 1)}/${p2(d.getUTCDate())}/${d.getUTCFullYear()}`;
const longd = (d) => `${MON[d.getUTCMonth()]} ${p2(d.getUTCDate())}, ${d.getUTCFullYear()}`;
const bankd = (d) => `${p2(d.getUTCDate())}-${MON[d.getUTCMonth()].toUpperCase()}-${String(d.getUTCFullYear()).slice(2)}`;
const short = (d) => `${p2(d.getUTCMonth() + 1)}/${p2(d.getUTCDate())}`;
const fmtD = () => pick([iso, us, longd, bankd]);
const sortDates = (arr) => arr.sort((a, b) => a - b);
const datesIn = (start, n, span = 30) => sortDates(Array.from({ length: n }, () => addDays(start, ri(0, span))));
const table = (head, rows) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const csv = (head, rows) => ["```csv", head.join(","), ...rows.map((r) => r.map((c) => (String(c).includes(",") ? `"${c}"` : c)).join(",")), "```"].join("\n");
const H = (t) => pick([`# ${t}`, `## ${t}`, `**${t}**`, t.toUpperCase(), `# ${t.toUpperCase()}`]);

// ---------- cast (same as scripts/gen-test-data.mjs) ----------
const CO = "Brightline Ventures, Inc.";
const COU = "BRIGHTLINE VENTURES INC";
const A = "Alex Rivera";
const B = "Jordan Blake";
const BH = "Blake Holdings LLC";
const JBC = "JB Consulting LLC"; // Blake-controlled shell
const LARK = "Larkspur Advisory Group"; // Blake-controlled shell, registered at Blake's home
const BLAKE_ADDR = "1187 Larkspur Lane, Unit 4, Oakmont, CA 94022";
const RIVERA_ADDR = "52 Juniper Court, Palo Verde, CA 94303";
const CO_ADDR = "400 Harbor Blvd, Suite 210, Oakmont, CA 94021";
const OP = "4417"; // Brightline operating account
const CARD = "7781"; // Brightline corporate card
const BLAKE_PERS = "2291"; // Blake personal checking
const friends = ["Sam", "Priya", "Marco", "Dana", "Lee", "Chris", "Nina", "Omar"];
const banks = ["First Coastal Bank", "Summit Trust", "Meridian National Bank", "Redwood Federal Credit Union", "Pacific Crest Bank"];
const coBank = "First Coastal Bank";
const customers = ["Harbor Retail", "Northwind Outfitters", "Cedar Health Partners", "Lumen Schools", "Parkside Clinics", "Atlas Freight", "Granite Title Co", "Bayview Dental"];
const vendors = [
  ["Cloudnine Hosting", "Hosting"], ["Amazon Web Services", "Cloud services"], ["Gusto", "Payroll service fee"],
  ["WeWork", "Rent"], ["Staples", "Office supplies"], ["Pinecrest Legal LLP", "Legal fees"], ["Ledgerly Bookkeeping", "Accounting"],
  ["Keystone Insurance", "Insurance"], ["Comcast Business", "Internet"], ["Figma", "Software"], ["Slack", "Software"],
  ["Delta Air Lines", "Travel"], ["Uber", "Travel"], ["PG&E", "Utilities"], ["Adobe", "Software"], ["LinkedIn Ads", "Marketing"],
];
const people = ["Maria Gonzalez", "Kevin O'Neil", "Aisha Rahman", "Tom Becker", "Linh Tran", "Rachel Stein", "David Okafor", "Emily Park",
  "Carlos Mendes", "Hannah Weiss", "Patrick Doyle", "Sofia Rossi", "Grace Liu", "Ben Harlow", "Tanya Brooks", "Victor Hale"];
const towns = ["Fresno, CA", "Tacoma, WA", "Boise, ID", "Tucson, AZ", "Reno, NV", "Eugene, OR", "Sacramento, CA", "Spokane, WA"];
const streets = ["Maple St", "Oak Ave", "Birch Rd", "Elm Dr", "Cypress Way", "Willow Ln", "Pine Ct", "Aspen Blvd"];
const addr = () => `${ri(10, 9800)} ${pick(streets)}, ${pick(towns)}`;

const C = {
  bank: "Bank Statement or Transaction Record",
  accounting: "Accounting Record or Financial Statement",
  invoice: "Invoice or Receipt",
  stock: "Stock Certificate, Ledger or Cap Table",
  agreement: "Ownership or Equity Agreement",
  marketing: "Marketing, Newsletter or Spam",
  personal: "Personal or Social Communication",
  other: "Other Business Document",
  email: "Email or Message",
};

// Legit Brightline transaction rows: [date, description, debit|null, credit|null]
const legitTx = (start, n) =>
  datesIn(start, n, 30).map((d) =>
    chance(0.35)
      ? [d, pick([`ACH CREDIT ${pick(customers).toUpperCase()}`, `Customer payment — ${pick(customers)}`, `STRIPE TRANSFER ST-${digits(6)}`, `Mobile deposit #${digits(4)}`]), null, num(800, 42000)]
      : (() => {
          const [v, c] = pick(vendors);
          return [d, pick([`ACH DEBIT ${v.toUpperCase()}`, `${v} — ${c}`, `POS ${v.toUpperCase()} ${digits(4)}`, `Bill pay: ${v}`]), num(40, 9000), null];
        })()
  );
const txTable = (rows, style) => {
  const f = style || fmtD();
  let bal = num(15000, 90000);
  return table(
    ["Date", "Description", "Debit", "Credit", "Balance"],
    rows.map(([d, desc, dr, cr]) => {
      bal += (cr || 0) - (dr || 0);
      return [f(d), desc, dr ? $(dr) : "", cr ? $(cr) : "", $(bal)];
    })
  );
};
const withSusp = (rows, susp) => [...rows, ...susp].sort((a, b) => a[0] - b[0]);

// ---------- templates ----------
// Each returns { word, category, rfps, strength?, why, body }
const CLEAR_RESP = [
  // 1 Brightline checking statement with wires to Blake Holdings
  () => {
    const st = mkDate(2022, 2025);
    const n = ri(3, 14);
    const susp = datesIn(st, ri(1, 3)).map((d) => [d, pick([`WIRE OUT ${BH.toUpperCase()}`, `Outgoing wire — ${BH} — Summit Trust`, `WIRE TRF TO BLAKE HOLDINGS LLC REF ${digits(8)}`]), num(9000, 85000), null]);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} operating statement showing outgoing wires to ${BH}, a Blake-controlled entity.`,
      body: `${H(`${coBank} — Business Checking Statement`)}
Account holder: ${CO}   Account ****${OP}
Statement period: ${longd(st)} – ${longd(addDays(st, 30))}
Authorized signers: ${B}${chance(0.5) ? `, ${A}` : ""}

${txTable(withSusp(legitTx(st, n), susp))}

${chance(0.5) ? "Member FDIC. Please examine this statement promptly." : `Page ${ri(1, 3)} of ${ri(3, 5)}`}`,
    };
  },
  // 2 ordinary Brightline statement (RFP_09 only)
  () => {
    const st = mkDate(2021, 2025);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_09"], strength: "medium",
      why: `Ordinary ${CO} bank statement; company bank records are requested regardless of who was paid.`,
      body: `${H(`${pick([coBank, "Meridian National Bank"])} Business Analyzed Checking`)}
${COU}
${CO_ADDR}
Account number: XXXX-XXXX-${OP}   Period ending ${fmtD()(addDays(st, 30))}

Beginning balance ${$(num(20000, 120000))}
${txTable(legitTx(st, ri(6, 18)))}

Total fees: ${$(num(0, 45))}`,
    };
  },
  // 3 wire confirmation to Blake Holdings / JB Consulting
  () => {
    const d = mkDate(2022, 2025);
    const ben = pick([BH, BH, JBC]);
    return {
      word: "confirmation", category: C.bank, rfps: ["RFP_08", "RFP_09"],
      why: `Wire from ${CO} to ${ben}, an entity controlled by ${B}, authorized by ${B}.`,
      body: `${H("Outgoing Wire Transfer Confirmation")}
Reference: FT${digits(10)}
Originator: ${CO} — acct ****${OP} (${coBank})
Beneficiary: ${ben}${ben === JBC ? ` — managing member ${B}` : ""}
Beneficiary bank: ${pick(["Summit Trust", "Pacific Crest Bank"])}  ABA ${digits(9)}  acct ****${digits(4)}
Amount: USD ${fm(num(12000, 98000))}
Value date: ${fmtD()(d)}
Purpose / memo: "${pick(["consulting — Q" + ri(1, 4), "advisory retainer", "management fee", "reimbursement", "strategic services"])}"
Initiated by: ${B}   Approved by: ${B}
Status: COMPLETED`,
    };
  },
  // 4 ACH to Blake personal
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "confirmation", category: C.bank, rfps: ["RFP_08", "RFP_09"],
      why: `ACH transfer from ${CO} operating account to ${B}'s personal account ****${BLAKE_PERS}.`,
      body: `${pick([coBank, "First Coastal Online Banking"])} — Transfer Receipt
Confirmation #: ${digits(12)}
From: ${COU} OPERATING ****${OP}
To: JORDAN BLAKE — PERSONAL CHECKING ****${BLAKE_PERS}
Amount: ${$(num(2500, 40000))}
Date: ${fmtD()(d)}
Memo: ${pick(["draw", "owner draw", "reimb", "(none)", "loan"])}
Submitted by user: jblake${ri(1, 99)}`,
    };
  },
  // 5 GL consulting fees to Blake Holdings
  () => {
    const st = mkDate(2022, 2024);
    const rows = datesIn(st, ri(3, 9), 300).map((d) => [fmtD()(d), BH, $(num(8000, 45000)), B, pick(["", "no invoice", "see JB"])]);
    return {
      word: "ledger", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} general ledger showing repeated consulting payments to ${BH}, approved by ${B}.`,
      body: `${H(`${CO} — General Ledger Detail`)}
Account ${pick(["6400", "6410", "6150"])} "${pick(["Consulting Fees", "Professional Services", "Outside Services"])}"   FY${st.getUTCFullYear()}

${table(["Date", "Vendor", "Amount", "Approved by", "Note"], rows)}

${pick(["Prepared by Ledgerly Bookkeeping.", "Exported from QuickBooks Online.", "Unaudited."])}`,
    };
  },
  // 6 GL general (RFP_09)
  () => {
    const st = mkDate(2021, 2025);
    const rows = datesIn(st, ri(8, 22), 90).map((d) => {
      const [v, c] = pick(vendors);
      return [iso(d), `JE-${ri(100, 999)}`, c, v, chance(0.8) ? $(num(30, 7000)) : "", chance(0.2) ? $(num(500, 30000)) : ""];
    });
    return {
      word: "ledger", category: C.accounting, rfps: ["RFP_09"], strength: "medium",
      why: `${CO} general ledger extract reflecting company receipts and disbursements.`,
      body: `${H(`${CO} General Ledger — ${pick(["Q1", "Q2", "Q3", "Q4"])} ${st.getUTCFullYear()}`)}
Basis: ${pick(["Accrual", "Cash"])}   Currency: USD

${table(["Date", "Entry", "Account", "Name", "Debit", "Credit"], rows)}`,
    };
  },
  // 7 Rivera seed capital wire into Brightline
  () => {
    const d = mkDate(2021, 2021);
    const amt = num(30000, 80000);
    return {
      word: "confirmation", category: C.bank, rfps: ["RFP_04", "RFP_06", "RFP_09"],
      why: `Wire of ${A}'s founder capital contribution into ${CO}.`,
      body: `${H("Incoming Wire Advice")}
Beneficiary: ${CO} acct ****${OP}
Originator: ${A}, ${pick(banks)} acct ****${digits(4)}
Amount: ${$(amt)}   Received: ${fmtD()(d)}
OBI: "${pick(["Founder capital contribution — A. Rivera", "Purchase of founder shares - Rivera", "Seed capital, founder A Rivera"])}"
Credited to: Equity — Contributed Capital (Rivera)`,
    };
  },
  // 8 Brightline corporate card with Blake personal charges
  () => {
    const st = mkDate(2022, 2025);
    const legit = datesIn(st, ri(4, 10)).map((d) => { const [v] = pick(vendors); return [short(d), v.toUpperCase(), $(num(20, 2500))]; });
    const pers = datesIn(st, ri(2, 4)).map((d) => [short(d), pick(["TIFFANY & CO", "NORDSTROM", "RITZ CARLTON SPA", "PORSCHE CENTER OAKMONT", "VAIL RESORTS", "WHOLE FOODS #122", "PETSMART"]), $(num(300, 14000))]);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_08", "RFP_09"],
      why: `${CO} corporate card statement (cardholder ${B}) with personal luxury charges paid by the company.`,
      body: `${H("Corporate Card Statement")}
Company: ${CO}   Card ****${CARD}   Cardholder: ${B.toUpperCase()}
Closing date: ${fmtD()(addDays(st, 30))}

${table(["Post", "Merchant", "Amount"], shuffle([...legit, ...pers]))}

Paid in full from ${COU} ****${OP}.`,
    };
  },
  // 9 expense report flagged by bookkeeper
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "report", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `${B}'s expense report reimbursed by ${CO} with personal items the bookkeeper flagged.`,
      body: `${H(`Expense Report — ${B}`)}
Company: ${CO}   Period: ${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}   Report #ER-${digits(5)}

${table(["Date", "Item", "Amount", "Coded as", "Reviewer note"], [
  [short(d), pick(["Resort weekend (2 adults, 2 children)", "Family ski trip lodging"]), $(num(2000, 7000)), "Client development", "No client named"],
  [short(addDays(d, 3)), pick(["Rolex Datejust", "Cartier bracelet"]), $(num(6000, 15000)), "Office supplies", "Personal item?"],
  [short(addDays(d, 5)), "Team lunch", $(num(80, 400)), "Meals", ""],
  [short(addDays(d, 9)), pick(["Private school tuition", "Home landscaping"]), $(num(3000, 12000)), "Misc", "Not business"],
])}

Reimbursed to ${B} via ACH from ${CO} ****${OP}. Approved by: ${B}.`,
    };
  },
  // 10 QuickBooks CSV export
  () => {
    const st = mkDate(2021, 2025);
    const rows = legitTx(st, ri(8, 20)).map(([d, desc, dr, cr]) => [us(d), pick(["Expense", "Deposit", "Bill Payment", "Check"]), digits(4), desc.replace(/,/g, ""), pick(["Operating ****" + OP, "Checking"]), dr ? `-${dr.toFixed(2)}` : cr.toFixed(2)]);
    return {
      word: "export", category: C.accounting, rfps: ["RFP_09"], strength: "medium",
      why: `QuickBooks transaction export for ${CO}; a company accounting record.`,
      body: `${CO} — Transaction List by Date (QuickBooks Online export ${fmtD()(addDays(st, 40))})

${csv(["Date", "Transaction Type", "Num", "Name/Memo", "Account", "Amount"], rows)}`,
    };
  },
  // 11 balance sheet with equity section naming founders
  () => {
    const y = ri(2021, 2024);
    const ra = num(40000, 80000);
    return {
      word: "financials", category: C.accounting, rfps: ["RFP_09", "RFP_01", "RFP_06", "RFP_04"],
      why: `${CO} balance sheet whose equity section shows ${A}'s contributed capital and share ownership.`,
      body: `${H(`${CO} Balance Sheet as of December 31, ${y}`)}

${table(["", "Amount"], [
  ["Cash — ${coBank} ****" + OP, $(num(10000, 200000))], ["Accounts receivable", $(num(5000, 60000))], ["**Total assets**", $(num(80000, 300000))],
  ["Accounts payable", $(num(2000, 30000))], ["Due to officer", $(num(0, 20000))],
  [`Common stock — ${A} (${pick(["6,500,000", "7,000,000", "6,000,000"])} sh)`, $(650)], [`Common stock — ${B} (3,000,000 sh)`, $(300)],
  [`Additional paid-in capital — ${A}`, $(ra)], ["Retained earnings", $(num(-40000, 60000))],
])}
${pick(["Compiled, not audited.", "Management use only."])}`,
    };
  },
  // 12 P&L
  () => {
    const y = ri(2021, 2025);
    return {
      word: "financials", category: C.accounting, rfps: ["RFP_09"], strength: "medium",
      why: `${CO} income statement; a company financial statement.`,
      body: `${H(`${CO} — Profit and Loss, ${pick(["January–December", "Year to date", "Q" + ri(1, 4)])} ${y}`)}

${table(["Line", "Amount"], [
  ["Revenue — subscriptions", $(num(80000, 900000))], ["Revenue — services", $(num(5000, 90000))],
  ["Payroll", $(num(40000, 400000))], ["Hosting", $(num(5000, 40000))], ["Rent", $(num(12000, 60000))],
  [pick(["Consulting fees", "Professional services"]), $(num(20000, 180000))], ["Net income", $(num(-90000, 120000))],
])}`,
    };
  },
  // 13 K-1 to Rivera
  () => {
    const y = ri(2021, 2024);
    const pct = pick([60, 65, 70]);
    return {
      word: "form", category: C.accounting, rfps: ["RFP_01", "RFP_06", "RFP_09"],
      why: `Schedule K-1 from ${CO} listing ${A} as a ${pct}% shareholder.`,
      body: `${H(`Schedule K-1 (Form 1120-S) ${y}`)}
Part I — Corporation: ${CO}, EIN 8${digits(1)}-${digits(7)}, ${CO_ADDR}
Part II — Shareholder: ${A}, ${RIVERA_ADDR}
Shareholder's percentage of stock ownership for tax year: ${pct}.000000%
Box 1 Ordinary business income (loss): ${$(num(-30000, 90000))}
Box 16D Distributions: ${$(0)}`,
    };
  },
  // 14 loan application by Blake claiming 100%
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "application", category: C.other, rfps: ["RFP_07", "RFP_01"],
      why: `${B} certifies to a lender that he owns ${CO} outright, omitting ${A}.`,
      body: `${H(`${pick(["Summit Trust", "Pacific Crest Bank"])} — Business Line of Credit Application`)}
Applicant: ${CO}   Requested amount: ${$(num(50000, 500000))}
Section 3 — Ownership (list all owners of 20% or more)
| Name | Title | Ownership % |
|---|---|---|
| ${B} | ${pick(["CEO", "President", "Founder & CEO"])} | ${pick([100, 100, 95])}% |
Section 7 — Certification: I certify the information above is true and complete.
Signed: ${B}   Date: ${fmtD()(d)}`,
    };
  },
  // 15 loan agreement with personal guaranty as sole owner
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "agreement", category: C.other, rfps: ["RFP_07", "RFP_01", "RFP_09"],
      why: `Company loan in which ${B} represents to the lender that he is the sole shareholder.`,
      body: `${H("Term Loan Agreement")}
Borrower: ${CO}   Lender: ${pick(["Meridian National Bank", "Summit Trust"])}
Principal: ${$(num(75000, 400000))} at ${num(6, 11).toFixed(2)}% for ${pick([36, 48, 60])} months
§4.2 Representations. Borrower represents that ${B} is the sole shareholder and sole director of Borrower and that no other person holds any equity interest.
§9 Guaranty. ${B}, as sole owner, personally guarantees the Obligations.
Executed ${fmtD()(d)} — ${B}, President`,
    };
  },
  // 16 beneficial ownership certification
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "certification", category: C.other, rfps: ["RFP_07", "RFP_01"],
      why: `Bank beneficial-ownership form where ${B} lists himself as the only owner of ${CO}.`,
      body: `${H("Certification Regarding Beneficial Owners of Legal Entity Customers")}
Institution: ${pick(banks)}   Legal entity: ${CO}
Section I — Individuals owning 25% or more of equity:
1. ${B} — ${BLAKE_ADDR} — ${pick([100, 100, 90])}%
2. (none)
Section II — Control person: ${B}, CEO
I certify that the information provided is complete and correct. /s/ ${B}  ${fmtD()(d)}`,
    };
  },
  // 17 check register with checks to Blake
  () => {
    const st = mkDate(2022, 2025);
    let no = ri(1000, 4000);
    const rows = legitTx(st, ri(5, 12)).filter((r) => r[2]).map(([d, desc, dr]) => [iso(d), no++, desc.replace(/^(ACH DEBIT|POS|Bill pay:) ?/, ""), $(dr)]);
    for (let i = 0; i < ri(1, 3); i++) rows.push([iso(addDays(st, ri(0, 30))), no++, pick(["Jordan Blake", "J. Blake", "CASH"]), $(num(2000, 20000))]);
    rows.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    return {
      word: "register", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `${CO} check register including checks written to ${B} or to cash.`,
      body: `${H(`${CO} — Check Register, acct ****${OP}`)}

${table(["Date", "Check #", "Payee", "Amount"], rows)}`,
    };
  },
  // 18 distribution schedule to Blake only
  () => {
    const y = ri(2022, 2024);
    return {
      word: "schedule", category: C.accounting, rfps: ["RFP_08", "RFP_10", "RFP_09", "RFP_06"],
      why: `Distribution schedule paying ${B} while ${A}'s allocation is zeroed out.`,
      body: `${H(`${CO} Shareholder Distributions ${y}`)}

${table(["Date", "Shareholder", "Shares", "Distribution"], [
  [`${y}-03-31`, B, "3,000,000", $(num(15000, 60000))],
  [`${y}-03-31`, A, "6,500,000", "$0.00 (withheld)"],
  [`${y}-09-30`, B, "3,000,000", $(num(15000, 60000))],
  [`${y}-09-30`, A, "6,500,000", "$0.00 (withheld)"],
])}
Note: ${pick(["Rivera distributions suspended per J. Blake.", "Rivera holding under review."])}`,
    };
  },
  // 19 payroll register with Blake self-raise
  () => {
    const d = mkDate(2022, 2025);
    const rows = shuffle(people.slice()).slice(0, ri(4, 9)).map((p) => [p, pick(["Engineer", "Support", "Sales", "Designer"]), $(num(2500, 8000))]);
    rows.unshift([B, "CEO", $(num(18000, 35000))]);
    return {
      word: "payroll", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `${CO} payroll register where ${B}'s pay jumps well above the rest, set by himself.`,
      body: `${H(`${CO} Payroll Register — pay date ${fmtD()(d)}`)}
Provider: Gusto   Funding account: ****${OP}

${table(["Employee", "Title", "Gross"], rows)}

Rate change for ${B} effective this period, approved by: ${B}.`,
    };
  },
  // 20 forensic schedule of transfers
  () => {
    const rows = datesIn(mkDate(2022, 2023), ri(5, 12), 600).map((d) => [iso(d), pick([BH, JBC, `J. Blake ****${BLAKE_PERS}`, LARK]), pick(["Wire", "ACH", "Check", "Card"]), $(num(1000, 60000))]);
    return {
      word: "schedule", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `Accountant's schedule tracing ${CO} funds to ${B} and his entities.`,
      body: `${H(`Schedule 3 — Transfers from ${CO} to Blake-Related Payees`)}
Source account: ${coBank} ****${OP}

${table(["Date", "Payee", "Method", "Amount"], rows)}

Prepared at the request of counsel. Subject to revision.`,
    };
  },
  // 21 bank reconciliation with unexplained items
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "reconciliation", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} bank reconciliation listing unexplained transfers to ${BH}.`,
      body: `${H(`Bank Reconciliation — ${CO} — ${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`)}
Balance per bank: ${$(num(10000, 90000))}
Balance per books: ${$(num(10000, 90000))}
Reconciling items:
- Deposit in transit ${$(num(500, 9000))}
- Outstanding checks ${$(num(200, 5000))}
- Unrecorded wire to ${BH} ${$(num(5000, 50000))} — no support provided by ${B}
Prepared by ${pick(["Ledgerly Bookkeeping", "M. Gonzalez, CPA"])}`,
    };
  },
  // 22 invoice from Blake Holdings to Brightline
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "invoice", category: C.invoice, rfps: ["RFP_08", "RFP_09"],
      why: `Invoice from ${BH} (Blake's entity) billing ${CO}, approved and paid by ${B}.`,
      body: `${H(`INVOICE — ${BH}`)}
${BLAKE_ADDR}
Invoice #: BH-${ri(100, 999)}   Date: ${fmtD()(d)}
Bill to: ${CO}
${table(["Description", "Amount"], [[pick(["Strategic advisory services", "Management services", "Business development retainer"]), $(num(8000, 40000))]])}
Payment: wire to ${BH} — Summit Trust
Approved for payment: ${B}`,
    };
  },
  // 23 capital account rollforward
  () => {
    const y = ri(2021, 2024);
    return {
      word: "schedule", category: C.accounting, rfps: ["RFP_04", "RFP_01", "RFP_06", "RFP_09"],
      why: `Equity rollforward showing cash and IP contributed by ${A} and none by ${B}.`,
      body: `${H(`${CO} — Statement of Shareholders' Equity ${y}`)}

${table(["Shareholder", "Cash contributed", "Non-cash contributed", "Shares"], [
  [A, $(num(40000, 80000)), "Software IP (assigned)", pick(["6,500,000", "7,000,000"])],
  [B, "$0.00", "Incorporation services", "3,000,000"],
])}`,
    };
  },
  // 24 Zelle/Venmo business history
  () => {
    const st = mkDate(2022, 2025);
    const rows = datesIn(st, ri(4, 10)).map((d) => chance(0.35) ? [us(d), "Jordan Blake", "Sent", $(num(500, 5000)), pick(["🏖", "rent", "", "thx"])] : [us(d), pick(people), pick(["Sent", "Received"]), $(num(20, 900)), pick(["contractor", "refund", "lunch", ""])]);
    return {
      word: "history", category: C.bank, rfps: ["RFP_08", "RFP_09"],
      why: `${CO} business Zelle history with payments sent to ${B} personally.`,
      body: `${H("Zelle® Activity — Business Profile")}
Profile: ${COU}   Linked account ****${OP}

${table(["Date", "Name", "Type", "Amount", "Memo"], rows)}`,
    };
  },
  // 25 adjusting entries reclassifying Rivera's equity
  () => {
    const d = mkDate(2023, 2025);
    return {
      word: "entries", category: C.accounting, rfps: ["RFP_10", "RFP_09", "RFP_04", "RFP_06"],
      why: `Journal entries reclassifying ${A}'s capital contribution as a loan, eliminating his equity.`,
      body: `${H(`Adjusting Journal Entries — ${CO}`)}
Date: ${fmtD()(d)}   Entered by: ${B}

${table(["AJE", "Account", "Debit", "Credit", "Memo"], [
  ["AJE-" + ri(1, 40), `APIC — ${A}`, $(num(40000, 80000)), "", "Reclass per JB"],
  ["", `Notes payable — ${A}`, "", $(num(40000, 80000)), "Treat as loan, not equity"],
  ["AJE-" + ri(41, 80), `Common stock — ${A}`, $(650), "", "Cancel CS-1"],
])}`,
    };
  },
  // 26 1099-NEC issued to Blake Holdings / JB Consulting
  () => {
    const y = ri(2022, 2024);
    const rec = pick([BH, JBC]);
    return {
      word: "form", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `Form 1099-NEC from ${CO} reporting payments to ${rec}, a Blake entity.`,
      body: `${H(`Form 1099-NEC — Nonemployee Compensation — ${y}`)}
PAYER: ${CO}, ${CO_ADDR}
RECIPIENT: ${rec}, ${BLAKE_ADDR}
Box 1 Nonemployee compensation: ${$(num(40000, 260000))}
Box 4 Federal income tax withheld: $0.00`,
    };
  },
  // 27 LOC draw with proceeds to Blake Holdings
  () => {
    const d = mkDate(2023, 2025);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_08", "RFP_09", "RFP_07"],
      why: `Company credit-line draw whose proceeds were wired the same day to ${BH}.`,
      body: `${H("Commercial Line of Credit — Activity Statement")}
Borrower: ${CO}   Line ****${digits(4)}   Guarantor: ${B} (sole owner)
${table(["Date", "Activity", "Amount"], [
  [iso(d), "Advance to operating ****" + OP, $(num(50000, 150000))],
  [iso(d), "Operating ****" + OP + " → wire " + BH, $(num(45000, 140000))],
  [iso(addDays(d, 30)), "Interest", $(num(300, 1500))],
])}`,
    };
  },
  // 28 officer loan receivable schedule
  () => {
    const y = ri(2022, 2024);
    return {
      word: "schedule", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `Schedule of undocumented officer loans from ${CO} to ${B}.`,
      body: `${H(`${CO} — Loans to Officer (Account 1350) — FY${y}`)}
Borrower: ${B}   Note on file: ${pick(["No", "None located"])}   Interest: none

${table(["Date", "Advance", "Repayment", "Balance"], datesIn(mkDate(y, y), ri(3, 7), 300).map((d, i) => [iso(d), $(num(3000, 25000)), i % 3 === 2 ? $(num(100, 1000)) : "", $(num(5000, 120000))]))}`,
    };
  },
  // 29 Rivera cash contribution receipt / deposit slip
  () => {
    const d = mkDate(2021, 2021);
    return {
      word: "slip", category: C.bank, rfps: ["RFP_04", "RFP_06", "RFP_09"],
      why: `Deposit slip for ${A}'s check into ${CO} for his founder shares.`,
      body: `${coBank} — DEPOSIT TICKET
Account: ${COU} ****${OP}   Date ${us(d)}
Checks: #${ri(100, 999)} ${A.toUpperCase()} ${$(num(20000, 60000))}
Memo on check: "${pick(["founder shares", "Brightline capital - Alex", "stock purchase"])}"
Total deposit: see above   Teller ${ri(10, 99)}`,
    };
  },
  // 30 annual tax return summary (Form 1120-S page 1 + Schedule of shareholders)
  () => {
    const y = ri(2022, 2024);
    const dropped = chance(0.5);
    return {
      word: "return", category: C.accounting, rfps: dropped ? ["RFP_09", "RFP_07", "RFP_10", "RFP_01"] : ["RFP_09", "RFP_01", "RFP_06"],
      why: dropped ? `${CO} tax return prepared from ${B}'s information listing him as 100% shareholder, dropping ${A}.` : `${CO} tax return with shareholder schedule listing ${A} and ${B}.`,
      body: `${H(`Form 1120-S — U.S. Income Tax Return for an S Corporation — ${y}`)}
Name: ${CO}   EIN 8${digits(1)}-${digits(7)}
1a Gross receipts ${$(num(100000, 900000))}   21 Ordinary business income ${$(num(-50000, 150000))}
Schedule of shareholders (attached):
${dropped ? `| ${B} | 100% |` : `| ${A} | ${pick([60, 65, 70])}% |\n| ${B} | remainder |`}
Information provided to preparer by: ${B}`,
    };
  },
];

// Hard borderline, truly responsive
const BORDER_RESP = [
  // B1 ledger line to JB Consulting coded as routine vendor
  () => {
    const st = mkDate(2022, 2025);
    const rows = withSusp(legitTx(st, ri(12, 24)), [[addDays(st, ri(0, 30)), JBC, num(4800, 12500), null]])
      .map(([d, desc, dr, cr]) => [iso(d), desc.replace(/^(ACH DEBIT|ACH CREDIT|POS|Bill pay:) ?/i, ""), desc === JBC ? "6400" : cr ? "4000" : pick(["6100", "6200", "6300"]), dr ? $(dr) : "", cr ? $(cr) : ""]);
    return {
      word: "ledger", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} ledger; one routine-looking vendor line pays ${JBC}, a Blake shell.`,
      body: `${CO} — Vendor Payments Detail
${MONTH[st.getUTCMonth()]} ${st.getUTCFullYear()}

${table(["Date", "Payee", "GL", "Paid", "Received"], rows)}`,
    };
  },
  // B2 partial bank statement page
  () => {
    const st = mkDate(2022, 2025);
    const rows = withSusp(legitTx(st, ri(6, 12)), [[addDays(st, ri(0, 30)), `ONLINE TRANSFER TO CHK ****${BLAKE_PERS} REF#${digits(7)}`, num(3000, 15000), null]])
      .map(([d, desc, dr, cr]) => [short(d), desc.toUpperCase(), dr ? fm(dr) : "", cr ? fm(cr) : ""]);
    return {
      word: "page", category: C.bank, rfps: ["RFP_09", "RFP_08"],
      why: `Truncated page of the ${CO} operating statement; an unlabeled transfer goes to Blake's personal ****${BLAKE_PERS}.`,
      body: `...continued from previous page

${table(["DATE", "DESCRIPTION", "WITHDRAWALS", "DEPOSITS"], rows)}

Page ${ri(2, 4)} of ${ri(5, 6)}          ${pick(["BRIGHTLINE VENT", "BRIGHTLINE VENTU", "BRIGHTLINE V"])}…  ****${OP}`,
    };
  },
  // B3 expense report with personal items, no flags
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "report", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `Unflagged expense report where ${CO} reimbursed ${B} for groceries, pet and family items.`,
      body: `Expense Report ER-${digits(5)}
Submitter: J. Blake    Entity: BLV (Brightline)    Month: ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}

${table(["Date", "Merchant", "Category", "Amount"], shuffle([
  [short(d), "Uber", "Travel", $(num(12, 60))],
  [short(addDays(d, 2)), "Whole Foods Market", "Meals & Ent.", $(num(180, 450))],
  [short(addDays(d, 4)), "Banfield Pet Hospital", "Office", $(num(200, 900))],
  [short(addDays(d, 7)), "Delta Air Lines", "Travel", $(num(300, 900))],
  [short(addDays(d, 9)), pick(["Pottery Barn Kids", "Oakmont Little League", "Sunrise Montessori"]), "Supplies", $(num(300, 2500))],
]))}

Status: APPROVED — reimbursed`,
    };
  },
  // B4 CSV with unlabeled transfer
  () => {
    const st = mkDate(2022, 2025);
    const rows = withSusp(legitTx(st, ri(10, 20)), [[addDays(st, ri(0, 30)), `XFER ${digits(6)}`, num(4000, 22000), null]])
      .map(([d, desc, dr, cr]) => [iso(d), desc.replace(/,/g, ""), dr ? (-dr).toFixed(2) : cr.toFixed(2)]);
    return {
      word: "export", category: C.bank, rfps: ["RFP_09", "RFP_08"],
      why: `CSV bank download for ${CO} with an unlabeled outgoing transfer amid routine items.`,
      body: `export_${OP}_${st.getUTCFullYear()}${p2(st.getUTCMonth() + 1)}.csv (account nickname: BLV OPERATING)

${csv(["posted", "description", "amount"], rows)}`,
    };
  },
  // B5 Blake personal card paid by Brightline
  () => {
    const st = mkDate(2022, 2025);
    const rows = datesIn(st, ri(5, 10)).map((d) => [short(d), pick(["SAFEWAY", "SHELL OIL", "NETFLIX", "TARGET", "CHEVRON", "SEPHORA", "APPLE.COM/BILL"]), $(num(8, 400))]);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_08"],
      why: `${B}'s personal credit card statement; the balance was paid by ${CO}.`,
      body: `${H("Sapphire Rewards — Monthly Statement")}
JORDAN BLAKE   ${BLAKE_ADDR}   Card ending ${digits(4)}
Statement closing ${fmtD()(addDays(st, 30))}

${table(["Date", "Transaction", "Amount"], rows)}

Payments and credits:
${short(addDays(st, ri(5, 20)))}  PAYMENT THANK YOU — ${pick(["BRIGHTLINE VENTURES INC", "BRIGHTLINE VENTU WEB PMT"])}  -${$(num(1500, 9000))}`,
    };
  },
  // B6 Blake mortgage paid by Brightline
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_08"],
      why: `${B}'s home mortgage statement; the payment source is the ${CO} operating account.`,
      body: `${H("Mortgage Statement")}
${pick(["Keystone Home Loans", "Oakmont Savings"])}   Loan #${digits(10)}
Borrower: JORDAN BLAKE   Property: ${BLAKE_ADDR}
Statement date: ${fmtD()(d)}
Principal balance: ${$(num(600000, 1400000))}   Monthly payment: ${$(num(3500, 8200))}

Last payment received ${short(addDays(d, -20))} — ACH from ${COU} ****${OP}
Escrow balance: ${$(num(1000, 8000))}`,
    };
  },
  // B7 car lease paid by Brightline
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "invoice", category: C.invoice, rfps: ["RFP_08", "RFP_09"],
      why: `Luxury car lease with ${B} as lessee, billed to and paid by ${CO}.`,
      body: `${pick(["Porsche Financial Services", "BMW Financial Services", "Mercedes-Benz Financial"])} — Lease Billing
Lessee: Jordan Blake   Vehicle: ${pick(["2023 Porsche Cayenne", "2024 BMW X7", "2023 Mercedes G550"])}
Billing address: c/o ${CO}, ${CO_ADDR}
Monthly payment ${$(num(1400, 3200))}   Due ${fmtD()(d)}
Autopay account: ****${OP}`,
    };
  },
  // B8 tax workpaper with shareholder loan line
  () => {
    const y = ri(2022, 2024);
    return {
      word: "workpaper", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `Preparer's trial balance for ${CO}; a small 'shareholder receivable — JB' line reflects money to Blake.`,
      body: `Trial balance — BLV — FYE 12/31/${y}   (preparer workpaper TB-${ri(1, 9)})

${table(["Acct", "Name", "Debit", "Credit"], [
  ["1000", "Cash — operating", fm(num(10000, 90000)), ""], ["1200", "A/R", fm(num(5000, 40000)), ""],
  ["1360", "Shareholder receivable — JB", fm(num(9000, 70000)), ""], ["2000", "A/P", "", fm(num(3000, 20000))],
  ["3000", "Common stock", "", "950.00"], ["4000", "Revenue", "", fm(num(100000, 800000))], ["6000", "Operating expenses", fm(num(90000, 700000)), ""],
])}
Tickmark ⓐ: agreed to bank. 1360 no support.`,
    };
  },
  // B9 P&L with footnote about advances
  () => {
    const q = ri(1, 4), y = ri(2022, 2025);
    return {
      word: "financials", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `Quarterly P&L for ${CO}; footnote reveals 'other expense' includes advances to an officer.`,
      body: `Q${q} ${y} Management P&L — Brightline

${table(["", "Q" + q, "Prior Q"], [["Revenue", fm(num(50000, 300000)), fm(num(50000, 300000))], ["COGS", fm(num(10000, 60000)), fm(num(10000, 60000))], ["OpEx", fm(num(40000, 200000)), fm(num(40000, 200000))], ["Other expense — misc (1)", fm(num(20000, 90000)), fm(num(500, 3000))]])}

(1) Includes advances to officer pending documentation.`,
    };
  },
  // B10 jeweler receipt paid with company card
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "receipt", category: C.invoice, rfps: ["RFP_08"],
      why: `Jewelry receipt for ${B} paid with the ${CO} corporate card.`,
      body: `${pick(["Hartwell Fine Jewelers", "Laurent & Co. Jewelers"])}
Sale #${digits(6)}   ${us(d)}
${pick(["Diamond tennis bracelet", "18k gold watch", "Sapphire pendant"])}    ${$(num(3000, 18000))}
Customer: J. BLAKE
Card: AMEX CORP ****${CARD}  BRIGHTLINE VENTURES
Thank you for your purchase!`,
    };
  },
  // B11 Stripe payout account change
  () => {
    const d = mkDate(2023, 2025);
    return {
      word: "report", category: C.bank, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} payment-processor payouts redirected to a bank account held by J. Blake.`,
      body: `Stripe — Payouts report   Account: acct_${digits(8)} (Brightline)
${table(["Arrival", "Amount", "Destination"], [
  [iso(addDays(d, -14)), fm(num(8000, 40000)), `${coBank} ****${OP}`],
  [iso(addDays(d, -7)), fm(num(8000, 40000)), `${coBank} ****${OP}`],
  [iso(d), fm(num(8000, 40000)), `Summit Trust ****${BLAKE_PERS} (J BLAKE)`],
  [iso(addDays(d, 7)), fm(num(8000, 40000)), `Summit Trust ****${BLAKE_PERS} (J BLAKE)`],
])}
Bank account updated ${iso(addDays(d, -2))} by user jordan@brightlineventures.com`,
    };
  },
  // B12 Blake personal return Schedule E listing 100%
  () => {
    const y = ri(2022, 2024);
    return {
      word: "return", category: C.accounting, rfps: ["RFP_07", "RFP_01"],
      why: `${B}'s personal tax return reports him as 100% owner of ${CO} to the IRS.`,
      body: `Form 1040 — ${y} — Jordan Blake  (excerpt)
Schedule E, Part II — Income or Loss From Partnerships and S Corporations
${table(["(a) Name", "(b) S", "(d) EIN", "Ownership %"], [["Brightline Ventures Inc", "S", "8" + digits(1) + "-" + digits(7), "100"]])}
Schedule 1 line 8: other income ${$(num(0, 2000))}`,
    };
  },
  // B13 petty cash log
  () => {
    const st = mkDate(2022, 2025);
    const rows = datesIn(st, ri(6, 12)).map((d) => chance(0.3) ? [short(d), "JB", "cash out", $(num(200, 1500)), ""] : [short(d), pick(["MG", "LT", "DO", "EP"]), pick(["postage", "coffee", "parking", "snacks"]), $(num(5, 60)), "rcpt"]);
    return {
      word: "log", category: C.accounting, rfps: ["RFP_09", "RFP_08"],
      why: `${CO} petty cash log with unsupported cash withdrawals by 'JB'.`,
      body: `PETTY CASH — BLV office (${CO_ADDR})

${table(["Date", "Initials", "Purpose", "Amount", "Support"], rows)}`,
    };
  },
  // B14 vendor master / 1099 TIN match with Larkspur Advisory
  () => {
    const rows = shuffle(vendors.slice()).slice(0, ri(6, 10)).map(([v]) => [v, addr(), pick(["Yes", "N/A"])]);
    rows.splice(ri(1, rows.length - 1), 0, [LARK, BLAKE_ADDR, "Yes"]);
    return {
      word: "list", category: C.accounting, rfps: ["RFP_08", "RFP_09"],
      why: `${CO} vendor list; '${LARK}' is registered at ${B}'s home address.`,
      body: `Brightline — Vendor Master (1099 tracking) — exported ${iso(mkDate(2023, 2025))}

${table(["Vendor", "Remit address", "1099"], rows)}`,
    };
  },
  // B15 Rivera personal statement with capital wire line
  () => {
    const st = mkDate(2021, 2021);
    const rows = datesIn(st, ri(6, 12)).map((d) => [short(d), pick(["TRADER JOES", "PG&E", "SPOTIFY", "CVS", "DIRECT DEP ACME CORP", "VENMO"]), $(num(5, 3000))]);
    rows.splice(ri(1, rows.length - 1), 0, [short(addDays(st, ri(0, 30))), "WIRE OUT BRIGHTLINE VENTURES INC", $(num(30000, 70000))]);
    return {
      word: "statement", category: C.bank, rfps: ["RFP_04", "RFP_06"],
      why: `${A}'s personal statement; one line is his wire into ${CO} (his capital contribution).`,
      body: `${pick(banks)} — Personal Checking
ALEX RIVERA   ${RIVERA_ADDR}   Acct ****${digits(4)}

${table(["Date", "Description", "Amount"], rows)}`,
    };
  },
  // B16 hotel folio billed to Brightline
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "folio", category: C.invoice, rfps: ["RFP_08", "RFP_09"],
      why: `'Board retreat' hotel bill paid by ${CO}; guests are ${B} and family.`,
      body: `${pick(["Montage Laguna", "Four Seasons Maui", "Ritz-Carlton Half Moon Bay"])} — Guest Folio
Guests: Jordan Blake, ${pick(["Kelly Blake", "Morgan Blake"])} + 2 children
Arrival ${us(d)}  Departure ${us(addDays(d, ri(3, 6)))}
Room & tax ${$(num(3000, 9000))}   Spa ${$(num(400, 1800))}   Kids club ${$(num(200, 700))}
Billing: Direct bill — Brightline Ventures, Inc. "Board retreat"`,
    };
  },
];

// Hard borderline, truly NOT responsive
const BORDER_NOT = [
  // N1 other company's statement with similar-looking payee
  () => {
    const st = mkDate(2019, 2025);
    const co = pick(["Maple Street Bakery LLC", "Harborview Dental Group", "Northgate Logistics Inc.", "Cedar Ridge Landscaping"]);
    const rows = datesIn(st, ri(6, 14)).map((d) => [short(d), pick(["DEPOSIT", "ACH SYSCO", "PAYROLL ADP", "CHECK " + ri(100, 999), "WIRE OUT " + pick(["BLAKE HARDWARE SUPPLY", "BLAKELY & SONS", "J. BLACK CONSULTING"])]), $(num(50, 20000))]);
    return {
      word: "statement", category: C.bank, rfps: [],
      why: `Bank statement of an unrelated business (${co}); 'Blake'-like payees are unrelated.`,
      body: `${H(`${pick(banks)} — Business Checking`)}
${co.toUpperCase()}   ****${digits(4)}

${table(["Date", "Description", "Amount"], rows)}`,
    };
  },
  // N2 Blake personal mortgage, paid from personal account, pre-company
  () => {
    const d = mkDate(2019, 2020);
    return {
      word: "statement", category: C.bank, rfps: [],
      why: `${B}'s personal mortgage from before ${CO} existed, paid from his own account; no company funds.`,
      body: `${H("Mortgage Statement")}
${pick(["Keystone Home Loans", "Oakmont Savings"])}   Loan #${digits(10)}
Borrower: JORDAN BLAKE   Property: ${BLAKE_ADDR}
Statement date: ${fmtD()(d)}   Payment: ${$(num(3500, 6000))}
Last payment received — ACH from Summit Trust personal checking ****${BLAKE_PERS}`,
    };
  },
  // N3 similar-name company ledger
  () => {
    const st = mkDate(2019, 2025);
    const co = pick(["Brightline Dental Partners PLLC", "Brightlane Ventures LP", "Brightline Logistics Co.", "Bright Line Realty Group"]);
    const rows = datesIn(st, ri(8, 16), 60).map((d) => { const [v, c] = pick(vendors); return [iso(d), v, c, $(num(30, 8000))]; });
    return {
      word: "ledger", category: C.accounting, rfps: [],
      why: `Ledger of '${co}', a different company with a similar name; no link to ${CO}.`,
      body: `${H(`${co} — General Ledger`)}
${addr()}   EIN 4${digits(1)}-${digits(7)}

${table(["Date", "Vendor", "Account", "Amount"], rows)}`,
    };
  },
  // N4 payroll for unrelated employer
  () => {
    const d = mkDate(2019, 2025);
    const co = pick(["Northgate Logistics Inc.", "Summit Pediatrics", "Oakmont Unified School District", "Riverside Auto Group"]);
    const rows = shuffle(people.concat(["Alex Rivers", "Jordan Blakeley"])).slice(0, ri(6, 12)).map((p) => [p, $(num(1500, 7000)), $(num(200, 1400))]);
    return {
      word: "payroll", category: C.accounting, rfps: [],
      why: `Payroll register for an unrelated employer (${co}); near-miss names are different people.`,
      body: `${H(`${co} — Payroll Register`)}
Pay date ${fmtD()(d)}   Provider ADP

${table(["Employee", "Gross", "Taxes"], rows)}`,
    };
  },
  // N5 financial literacy article on embezzlement
  () => ({
    word: "article", category: C.other, rfps: [],
    why: "Generic article on embezzlement red flags; not about Brightline, Rivera or Blake.",
    body: `${H(pick(["7 Red Flags of Embezzlement in Small Businesses", "How Founders Get Robbed by Their Own Partners", "Protecting Company Funds: A Primer"]))}
By ${pick(people)} — ${pick(["Small Business Monthly", "The Ledger Blog", "CPA Insights"])}, ${longd(mkDate(2019, 2025))}

Embezzlement often starts small: an officer pays a "consulting" shell company, runs personal expenses through a corporate card, or quietly redirects payouts. Watch for vendors registered at employees' home addresses, round-dollar transfers without invoices, and a single person who both approves and records payments.
Tip ${ri(1, 7)}: require dual signatures on wires over $${pick(["5,000", "10,000", "25,000"])}.
Tip ${ri(1, 7)}: reconcile bank statements monthly and review the cap table annually.`,
  }),
  // N6 accounting textbook exercise
  () => ({
    word: "exercise", category: C.other, rfps: [],
    why: "Accounting-course exercise about founder shares with fictional names; unrelated to the case.",
    body: `Chapter ${ri(8, 14)} — Problem ${ri(1, 30)}
${pick(["Sunrise Widgets", "Acme Robotics", "Blue Fern Studios"])}, Inc. was formed by two founders, ${pick(["Pat Lee", "Chris Moore"])} and ${pick(["Robin Diaz", "Sam Kerr"])}, who agreed to a ${pick(["65/35", "60/40", "70/30"])} split. Founder 1 contributed $${pick(["50,000", "40,000"])} cash and software; Founder 2 contributed services.
Required: (a) Journalize the issuance of 10,000,000 shares. (b) Prepare the equity section of the balance sheet. (c) Discuss whether services may be valued as consideration.`,
  }),
  // N7 Blake W-2 from prior employer
  () => {
    const y = ri(2019, 2020);
    return {
      word: "form", category: C.accounting, rfps: [],
      why: `${B}'s W-2 from a prior unrelated employer, before ${CO} existed.`,
      body: `${H(`Form W-2 Wage and Tax Statement ${y}`)}
Employer: ${pick(["Harborview Consulting Group", "Pacific Data Systems", "Oakmont Realty"])}, EIN 9${digits(1)}-${digits(7)}
Employee: Jordan Blake, ${BLAKE_ADDR}
Box 1 Wages ${$(num(70000, 160000))}   Box 2 Federal tax ${$(num(9000, 30000))}`,
    };
  },
  // N8 Rivera personal card statement, ordinary purchases
  () => {
    const st = mkDate(2019, 2025);
    const rows = datesIn(st, ri(6, 12)).map((d) => [short(d), pick(["TRADER JOES", "REI", "UNITED AIRLINES", "COSTCO", "AMC THEATRES", "SPOTIFY", "BLUE BOTTLE"]), $(num(4, 900))]);
    return {
      word: "statement", category: C.bank, rfps: [],
      why: `${A}'s personal card statement with ordinary purchases; nothing about ownership or company funds.`,
      body: `${H("Freedom Card — Statement")}
ALEX RIVERA   ${RIVERA_ADDR}   ending ${digits(4)}

${table(["Date", "Merchant", "Amount"], rows)}
Payment received from ALEX RIVERA CHECKING. Thank you.`,
    };
  },
  // N9 vendor price quote to Brightline, not accepted
  () => {
    const d = mkDate(2022, 2025);
    return {
      word: "quote", category: C.other, rfps: [],
      why: `Vendor price quote sent to ${CO}; not a financial record and no money moved.`,
      body: `${H(`${pick(["Cloudnine Hosting", "OfficeWorks Furniture", "Keystone Insurance"])} — Quotation`)}
Quote #Q-${digits(5)}   Date ${fmtD()(d)}   Valid 30 days
Prepared for: ${pick(["Maria Gonzalez", "Emily Park"])}, ${CO}
${table(["Item", "Qty", "Price"], [["Standard plan / unit", ri(1, 20), $(num(40, 900))], ["Setup", 1, $(num(0, 500))]])}
This is an estimate only. Not an invoice.`,
    };
  },
  // N10 bank sample / template statement
  () => ({
    word: "statement", category: C.marketing, rfps: [],
    why: "Bank marketing sample statement for a fictional business; not a real record.",
    body: `SAMPLE — FOR ILLUSTRATION ONLY
${pick(banks)} "Business Advantage" checking — how to read your statement
Account holder: YOUR BUSINESS NAME LLC   Account ****0000
${table(["Date", "Description", "Amount"], [["01/03", "Deposit", "$5,000.00"], ["01/05", "Wire out — vendor", "$1,200.00"], ["01/09", "Transfer to owner", "$800.00"]])}
Open an account today and get $${pick([300, 400, 500])} bonus.`,
  }),
  // N11 SEC press release about unrelated embezzlement
  () => ({
    word: "release", category: C.other, rfps: [],
    why: "Press release about an unrelated CFO embezzlement case.",
    body: `${H("SEC Charges Former CFO With Diverting Company Funds")}
Washington, D.C., ${longd(mkDate(2019, 2025))} — The Commission charged ${pick(people)}, former CFO of ${pick(["Vantex Medical", "Orion Freight", "GreenCell Energy"])}, with routing $${ri(2, 30)}.${ri(1, 9)} million to shell companies he controlled and misrepresenting ownership to lenders.`,
  }),
  // N12 Blake personal auto loan amortization pre-company
  () => {
    const d = mkDate(2019, 2020);
    return {
      word: "schedule", category: C.accounting, rfps: [],
      why: `Amortization schedule for ${B}'s personal auto loan taken before ${CO}; paid personally.`,
      body: `${pick(["Oakmont Credit Union", "Redwood Federal Credit Union"])} — Auto Loan Amortization
Borrower: Jordan Blake   Vehicle: ${pick(["2018 Honda Accord", "2019 Toyota RAV4"])}   Origination ${us(d)}
${table(["#", "Payment", "Principal", "Interest"], Array.from({ length: ri(4, 8) }, (_, i) => [i + 1, $(num(350, 520)), $(num(250, 400)), $(num(40, 120))]))}
Autopay from member share draft ****${BLAKE_PERS}`,
    };
  },
  // N13 QuickBooks sandbox sample company
  () => {
    const rows = legitTx(mkDate(2019, 2025), ri(6, 12)).map(([d, desc, dr, cr]) => [us(d), desc.replace(/,/g, ""), dr ? (-dr).toFixed(2) : cr.toFixed(2)]);
    return {
      word: "export", category: C.accounting, rfps: [],
      why: "Export from a QuickBooks sandbox sample company; not Brightline data.",
      body: `Sample Company Sandbox (test data) — Transaction Detail

${csv(["Date", "Memo", "Amount"], rows)}`,
    };
  },
  // N14 Blake personal card statement pre-company
  () => {
    const st = mkDate(2019, 2020);
    const rows = datesIn(st, ri(5, 10)).map((d) => [short(d), pick(["SAFEWAY", "SHELL OIL", "HULU", "HOME DEPOT", "CHIPOTLE"]), $(num(5, 300))]);
    return {
      word: "statement", category: C.bank, rfps: [],
      why: `${B}'s personal card statement from before ${CO} was formed, paid from his own checking.`,
      body: `${H("Cash Rewards Visa — Statement")}
JORDAN BLAKE   ${BLAKE_ADDR}
${table(["Date", "Merchant", "Amount"], rows)}
Payment — SUMMIT TRUST CHK ****${BLAKE_PERS}  -${$(num(200, 1500))}`,
    };
  },
  // N15 other startup cap-table-ish financials
  () => {
    const co = pick(["Tidewater Analytics, Inc.", "Quillfeather Labs, Inc.", "Northstar Robotics, Inc."]);
    return {
      word: "financials", category: C.accounting, rfps: [],
      why: `Balance sheet of an unrelated startup (${co}) naming its own founders.`,
      body: `${H(`${co} — Balance Sheet ${ri(2019, 2025)}`)}
${table(["", "Amount"], [["Cash", $(num(10000, 400000))], ["Total liabilities", $(num(2000, 90000))], [`Common stock — ${pick(people)}`, "$500.00"], [`Common stock — ${pick(people)}`, "$500.00"], ["APIC", $(num(20000, 200000))]])}`,
    };
  },
  // N16 1099 to an unrelated "J. Blake" freelancer
  () => {
    const y = ri(2019, 2025);
    return {
      word: "form", category: C.accounting, rfps: [],
      why: "1099 from an unrelated company to a different person named Blake.",
      body: `${H(`Form 1099-NEC ${y}`)}
PAYER: ${pick(["Riverside Auto Group", "Summit Pediatrics", "Lumen Schools"])}
RECIPIENT: ${pick(["Jenna Blake", "Jordan Blakeley", "J. Blake Painting"])}, ${addr()}
Box 1 ${$(num(1000, 20000))}`,
    };
  },
];

// Clear NOT responsive (junk)
const CLEAR_NOT = [
  () => ({ word: "receipt", category: C.invoice, why: "Grocery receipt for an unrelated shopper.", body: `${pick(["SAFEWAY", "KROGER", "TRADER JOE'S", "ALDI"])} #${ri(100, 999)}\n${us(mkDate(2019, 2025))}\n${Array.from({ length: ri(4, 12) }, () => `${pick(["BANANAS", "MILK 2%", "EGGS LG", "BREAD", "CHICKEN BRST", "COFFEE", "APPLES", "PASTA", "YOGURT"])}  ${fm(num(1, 12))}`).join("\n")}\nTOTAL ${fm(num(20, 180))}\nVISA ****${digits(4)}` }),
  () => ({ word: "bill", category: C.invoice, why: "Utility bill for an unrelated person.", body: `${H(pick(["City Water & Power", "Sierra Gas Co.", "Metro Electric"]))}\nAccount holder: ${pick(people)}, ${addr()}\nService period ${longd(mkDate(2019, 2025))}\nUsage ${ri(100, 1400)} ${pick(["kWh", "therms", "gallons x100"])}\nAmount due ${$(num(30, 400))}` }),
  () => ({ word: "offer", category: C.marketing, why: "Credit card promotional offer.", body: `${H("You're Pre-Approved!")}\nDear ${pick(people)},\nEnjoy 0% APR for ${pick([12, 15, 18, 21])} months and ${pick(["60,000", "75,000", "100,000"])} bonus points. Offer code ${digits(8)}. Apply by ${longd(mkDate(2019, 2025))}.` }),
  () => ({ word: "message", category: C.marketing, why: "Crypto investment spam.", body: `🚀 ${pick(["DOGE2MOON", "SafeYield", "MetaCoin Pro"])} presale ending soon!!\nTurn $${pick([100, 250, 500])} into $${pick(["10,000", "50,000"])} in ${ri(7, 30)} days. Guaranteed returns. Connect wallet at ${pick(["safeyield", "moonpresale", "coinbonus"])}.${pick(["xyz", "io", "biz"])}` }),
  () => ({ word: "sheet", category: C.other, why: "Personal fantasy-football budget spreadsheet.", body: `Fantasy League ${ri(2019, 2025)} — dues tracker\n\n${table(["Manager", "Paid", "Owed"], shuffle(friends.slice()).slice(0, ri(4, 8)).map((f) => [f, $(pick([50, 100, 0])), $(pick([0, 50]))]))}` }),
  () => ({ word: "budget", category: C.other, why: "Wedding budget for unrelated people.", body: `Wedding budget — ${pick(people)} & ${pick(people)}\n\n${table(["Item", "Est.", "Actual"], ["Venue", "Catering", "Photographer", "Flowers", "DJ", "Dress"].map((i) => [i, $(num(500, 15000)), $(num(500, 15000))]))}` }),
  () => ({ word: "receipt", category: C.invoice, why: "Restaurant bill, unrelated.", body: `${pick(["Tavola Trattoria", "Golden Dragon", "The Blue Plate", "Taqueria Sol"])}\nTable ${ri(1, 40)}  Server ${pick(friends)}\n${Array.from({ length: ri(2, 6) }, () => `${pick(["Margherita", "Pad Thai", "Burger", "Tacos", "Salad", "IPA"])}  ${fm(num(5, 30))}`).join("\n")}\nTip ${fm(num(3, 30))}\nTotal ${fm(num(20, 200))}` }),
  () => ({ word: "notice", category: C.other, why: "Parking citation for an unrelated vehicle.", body: `CITY OF ${pick(towns).split(",")[0].toUpperCase()} — PARKING CITATION #${digits(8)}\nPlate ${digits(1)}${pick(["ABC", "XYZ", "KLM"])}${digits(3)}  Violation: ${pick(["Expired meter", "Street cleaning", "Red zone"])}\nFine ${$(pick([45, 65, 95]))}  Due ${us(mkDate(2019, 2025))}` }),
  () => ({ word: "bill", category: C.invoice, why: "Mobile phone bill for an unrelated person.", body: `${pick(["Verizon", "T-Mobile", "AT&T"])} — Your bill\n${pick(people)}   Acct ${digits(9)}\nPlan ${pick(["Unlimited Plus", "Essentials", "Family 4-line"])}  ${$(num(40, 260))}\nDue ${longd(mkDate(2019, 2025))}` }),
  () => ({ word: "receipt", category: C.invoice, why: "Streaming subscription receipt.", body: `Your ${pick(["Netflix", "Spotify", "Disney+", "Hulu", "YouTube Premium"])} receipt\nBilled to ${pick(people)}\nAmount ${$(num(6, 23))} on ${longd(mkDate(2019, 2025))}\nNext billing in 30 days.` }),
  () => ({ word: "receipt", category: C.invoice, why: "Airline ticket receipt for an unrelated traveler.", body: `${pick(["United", "Alaska Airlines", "Southwest"])} e-ticket receipt\nPassenger ${pick(people).toUpperCase()}\n${pick(["SFO-SEA", "LAX-DEN", "PDX-PHX"])}  ${longd(mkDate(2019, 2025))}\nFare ${$(num(90, 600))}  Taxes ${$(num(15, 80))}\nConf ${pick(["K", "Q", "Z"])}${digits(5)}` }),
  () => ({ word: "receipt", category: C.invoice, why: "Pharmacy receipt, unrelated.", body: `${pick(["CVS", "Walgreens", "Rite Aid"])} Pharmacy\nRX #${digits(7)}  qty ${ri(10, 90)}\nCopay ${$(num(0, 40))}\n${us(mkDate(2019, 2025))}  ExtraCare ${digits(10)}` }),
  () => ({ word: "ledger", category: C.other, why: "Unrelated landlord's rent ledger.", body: `Rent ledger — ${addr()} Unit ${ri(1, 20)}\nTenant ${pick(people)}\n\n${table(["Month", "Due", "Paid"], Array.from({ length: ri(4, 12) }, (_, i) => [MON[i], $(1850), $(pick([1850, 1850, 0]))]))}` }),
  () => ({ word: "tally", category: C.other, why: "School bake sale tally.", body: `${pick(["Oakmont Elementary", "Lincoln Middle", "St. Mary's"])} bake sale — ${longd(mkDate(2019, 2025))}\n${table(["Item", "Sold", "Revenue"], ["Brownies", "Cookies", "Lemon bars", "Cupcakes"].map((i) => [i, ri(5, 60), $(num(10, 150))]))}\nThank you volunteers!` }),
  () => ({ word: "statement", category: C.invoice, why: "HOA dues statement for unrelated homeowner.", body: `${pick(["Willow Creek", "Sunset Ridge", "Harbor Pointe"])} HOA\nOwner ${pick(people)}   Lot ${ri(1, 300)}\nQuarterly assessment ${$(num(150, 900))}  Due ${us(mkDate(2019, 2025))}` }),
  () => ({ word: "offer", category: C.marketing, why: "Unsolicited business loan marketing mail.", body: `${H("Need Working Capital Fast?")}\nGet up to $${pick(["50K", "250K", "500K"])} in 24 hours — no collateral! Call ${ri(800, 888)}-${digits(3)}-${digits(4)}. Reply STOP to unsubscribe.` }),
  () => ({ word: "offer", category: C.marketing, why: "Tax preparation service advertisement.", body: `${pick(["TaxEasy", "QuickRefund", "FileRight"])}: Get your maximum refund! File your ${ri(2019, 2025)} return for just $${pick([29, 49, 79])}. Use code SAVE${ri(10, 30)}.` }),
  () => ({ word: "receipt", category: C.invoice, why: "Charity donation receipt, unrelated donor.", body: `Thank you for your gift to ${pick(["Oakmont Food Bank", "Coastal Animal Rescue", "Children's Literacy Fund"])}\nDonor ${pick(people)}   Amount ${$(num(10, 500))}   Date ${longd(mkDate(2019, 2025))}\nNo goods or services were provided.` }),
  () => ({ word: "invoice", category: C.invoice, why: "Veterinary invoice for an unrelated pet owner.", body: `${pick(["Happy Paws Vet", "Bayside Animal Clinic"])}\nClient ${pick(people)}   Patient ${pick(["Max", "Luna", "Bella", "Charlie"])} (${pick(["canine", "feline"])})\n${table(["Service", "Fee"], [["Exam", $(num(50, 90))], ["Vaccines", $(num(30, 120))]])}` }),
  () => ({ word: "alert", category: C.marketing, why: "Credit score alert spam.", body: `Your credit score changed! ${pick(people)}, see what moved your score from ${ri(600, 700)} to ${ri(650, 800)}. Log in to ${pick(["CreditCheckr", "ScoreWatch"])} — free forever.` }),
  () => ({ word: "notice", category: C.marketing, why: "Prize/lottery scam email.", body: `CONGRATULATIONS!!! You have been selected to receive $${pick(["1,500,000", "750,000"])} from the ${pick(["International Lotto Board", "Global Rewards Program"])}. Send processing fee of $${ri(99, 499)} to claim.` }),
  () => ({ word: "newsletter", category: C.marketing, why: "Retirement plan newsletter, generic.", body: `${H(pick(["Your 401(k) Quarterly", "Retirement Ready", "Plan Insights"]))}\nMarkets ${pick(["rose", "fell", "were flat"])} ${num(0, 6).toFixed(1)}% this quarter. Consider rebalancing. Tip: increase contributions by 1% each year.` }),
  () => ({ word: "sheet", category: C.other, why: "Unrelated inventory spreadsheet from a small shop.", body: `${pick(["Corner Hardware", "Petal & Stem Florist", "Rolling Pin Bakery"])} inventory ${iso(mkDate(2019, 2025))}\n\n${csv(["SKU", "Item", "Qty", "Unit cost"], Array.from({ length: ri(5, 14) }, () => [digits(6), pick(["hammer", "tulips", "flour 25lb", "nails", "vase", "sugar"]), ri(1, 200), num(1, 40).toFixed(2)]))}` }),
  () => ({ word: "receipt", category: C.invoice, why: "Car wash / gas receipt, unrelated.", body: `${pick(["Sparkle Car Wash", "Shell #4471", "Chevron"])}\n${us(mkDate(2019, 2025))} ${p2(ri(6, 21))}:${p2(ri(0, 59))}\n${pick(["Deluxe wash", "Unleaded 12.4 gal", "Premium 9.8 gal"])}  ${$(num(10, 80))}\nCard ****${digits(4)}` }),
  () => ({ word: "statement", category: C.bank, why: "Unrelated person's savings account statement.", body: `${pick(banks)} — Savings Statement\n${pick(people).toUpperCase()}   ****${digits(4)}\nBeginning ${$(num(100, 20000))}  Interest ${$(num(0, 40))}  Ending ${$(num(100, 20000))}\n${pick(["Save more with automatic transfers!", "Thank you for banking with us."])}` }),
  () => ({ word: "invoice", category: C.invoice, why: "Unrelated plumbing invoice to a homeowner.", body: `${pick(["Reliable Plumbing", "Quick Fix Home Services"])} Invoice #${ri(1000, 9999)}\nCustomer ${pick(people)}, ${addr()}\n${table(["Work", "Amount"], [[pick(["Replace water heater", "Unclog drain", "Fix leak under sink"]), $(num(90, 1800))]])}` }),
];

// ---------- plan & emit ----------
const START = 3501;
const buckets = [
  ...Array(1225).fill("CR"),
  ...Array(350).fill("BR"),
  ...Array(350).fill("BN"),
  ...Array(1575).fill("CN"),
];
shuffle(buckets);
const T = { CR: CLEAR_RESP, BR: BORDER_RESP, BN: BORDER_NOT, CN: CLEAR_NOT };
const counters = { CR: 0, BR: 0, BN: 0, CN: 0 };
const order = { CR: shuffle([...CLEAR_RESP.keys()]), BR: shuffle([...BORDER_RESP.keys()]), BN: shuffle([...BORDER_NOT.keys()]), CN: shuffle([...CLEAR_NOT.keys()]) };
const quirk = (body) => {
  let b = body;
  if (chance(0.12)) b = `${pick(["CONFIDENTIAL", "Printed from online portal", "Scanned copy", "DRAFT"])}\n\n` + b;
  if (chance(0.1)) b += `\n\n${pick(["-- end of document --", `Doc ID ${digits(9)}`, "[page footer illegible]", "Retain for your records."])}`;
  if (chance(0.06)) b = b.replace(/\n\n/g, "\n");
  return b;
};

// File-name words come from a shared pool so no word is exclusive to one label.
const WORDS = {
  statement: ["statement", "record"], page: ["statement", "record"], confirmation: ["record", "notice", "statement"],
  ledger: ["ledger", "record", "sheet"], log: ["ledger", "record", "sheet"], register: ["ledger", "record", "sheet"],
  entries: ["ledger", "record", "sheet"], reconciliation: ["ledger", "record", "sheet"], workpaper: ["ledger", "record", "sheet"],
  schedule: ["schedule", "sheet"], export: ["export", "sheet", "record"], history: ["export", "sheet", "record"], list: ["export", "sheet", "record"],
  form: ["form", "document"], return: ["form", "document"], certification: ["form", "document"], application: ["form", "document"],
  invoice: ["invoice", "receipt", "record"], folio: ["invoice", "receipt", "record"], quote: ["invoice", "document"], bill: ["invoice", "receipt", "record"],
  receipt: ["receipt", "invoice", "record"], slip: ["receipt", "record"],
  financials: ["report", "document", "sheet"], report: ["report", "document", "sheet"], payroll: ["report", "document", "sheet"],
  agreement: ["document", "form"], article: ["document", "notice"], exercise: ["document", "sheet"], release: ["document", "notice"],
  newsletter: ["document", "notice"], offer: ["notice", "document"], alert: ["notice", "document"], message: ["notice", "document"], notice: ["notice", "document"],
  budget: ["sheet", "record"], tally: ["sheet", "record"], sheet: ["sheet", "record"],
};

const key = {};
buckets.forEach((bk, i) => {
  const tpl = T[bk][order[bk][counters[bk]++ % T[bk].length]];
  const doc = tpl();
  const nstr = String(START + i).padStart(5, "0");
  const name = `p2_${nstr}_${pick(WORDS[doc.word])}.md`;
  writeFileSync(join(dataDir, name), quirk(doc.body).trim() + "\n");
  const responsive = bk === "CR" || bk === "BR";
  const rfps = responsive ? doc.rfps : [];
  key[name] = {
    responsive,
    strength: bk === "CR" ? doc.strength || (rfps.length >= 2 ? "strong" : "medium") : bk === "BR" ? "weak" : "none",
    rfps,
    category: doc.category,
    difficulty: bk === "CR" || bk === "CN" ? "clear" : "borderline",
    why: doc.why.replace(/\.\./g, "."),
  };
});

writeFileSync(join(keyDir, "answer_key_part2.json"), JSON.stringify(key, null, 2) + "\n");
const templates = CLEAR_RESP.length + BORDER_RESP.length + BORDER_NOT.length + CLEAR_NOT.length;
console.log(`wrote ${buckets.length} files (p2_${START}..p2_${START + buckets.length - 1}) using ${templates} templates`);
