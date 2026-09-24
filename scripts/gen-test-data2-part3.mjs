// PART 3 of 3 of the large synthetic test set for Rivera v. Blake (Brightline Ventures, Inc.).
// Families: formal corporate and legal documents plus misc attachments.
// Writes 3,500 files p3_07001..p3_10500 into test-data2/ and the answer key to
// test-data2-key/answer_key_part3.json. Deterministic: fixed seed, same output every run.
// Usage: node scripts/gen-test-data2-part3.mjs

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "test-data2");
const keyDir = join(root, "test-data2-key");
mkdirSync(dataDir, { recursive: true });
mkdirSync(keyDir, { recursive: true });
for (const f of readdirSync(dataDir)) if (f.startsWith("p3_") && f.endsWith(".md")) rmSync(join(dataDir, f));

// ---------- deterministic randomness ----------
let s = 0x5eed3303;
const rand = () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rint = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const sample = (arr, k) => shuffle([...arr]).slice(0, k);
const num = (n) => n.toLocaleString("en-US");
const money = (lo, hi) => (Math.round((lo + rand() * (hi - lo)) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = (y1 = 2019, y2 = 2025) => {
  const y = rint(y1, y2), m = rint(1, 12), d = rint(1, 28);
  const style = rint(0, 3);
  if (style === 0) return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  if (style === 1) return `${MONTHS[m - 1]} ${d}, ${y}`;
  if (style === 2) return `${m}/${d}/${y}`;
  return `the ${d}${[1, 21].includes(d) ? "st" : [2, 22].includes(d) ? "nd" : [3, 23].includes(d) ? "rd" : "th"} day of ${MONTHS[m - 1]}, ${y}`;
};

// ---------- cast (same as scripts/gen-test-data.mjs) ----------
const CO = "Brightline Ventures, Inc.";
const A = "Alex Rivera";
const B = "Jordan Blake";
const BH = "Blake Holdings LLC";
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

// ---------- peripheral pools ----------
const FIRST = ["Sam", "Priya", "Marco", "Dana", "Lee", "Chris", "Nina", "Omar", "Helen", "Victor", "Grace", "Tomás", "Aisha", "Derek", "Mei", "Rosa", "Ivan", "Keisha", "Paul", "Farah", "Ben", "Leila", "Owen", "Sofia"];
const LAST = ["Chen", "Patel", "Okafor", "Nguyen", "Schultz", "Moreno", "Kowalski", "Haddad", "Brennan", "Tanaka", "Lindqvist", "Adeyemi", "Russo", "Kim", "Dubois", "Ferreira", "Walsh", "Singh", "Novak", "Park"];
const person = () => `${pick(FIRST)} ${pick(LAST)}`;
const FIRMS = ["Hollis & Crane LLP", "Marlow Pierce Stanton LLP", "Delacroix Webb PC", "Farrow, Lin & Ostrander LLP", "Kessler Vance LLP", "Ashgrove Legal Group", "Tidewater Law Partners", "Orchard Row Counsel LLP"];
const BANKS = ["First Coastal Bank", "Summit Trust", "Harborview Savings", "Pinecrest National Bank", "Meridian Commerce Bank"];
const AGENTS = ["Registered Agents of Delaware, Inc.", "Corporate Filing Services LLC", "Harbor Agent Services Co.", "Keystone Statutory Agents, Inc."];
const INVESTORS = ["Northgate Capital", "Harbor Angels", "Seedline Fund II", "Copperleaf Ventures", "Bluewater Partners", "Aster Growth Fund"];
const OTHERCOS = ["Brightwater Ventures LLC", "Brightline Logistics Co.", "Kestrel Labs, Inc.", "Northgate Robotics Corp.", "Lumen Harbor, Inc.", "Silverpine Analytics, Inc.", "Brighton Venture Partners LP", "Highline Foods, Inc."];
const STATES = ["Delaware", "Nevada", "Ohio", "Texas", "Colorado", "Oregon", "Georgia"];
const CITIES = ["Austin, TX", "Denver, CO", "Portland, OR", "Columbus, OH", "Raleigh, NC", "Sacramento, CA", "Madison, WI"];

// ---------- filler paragraphs ----------
const LEGAL_FILL = [
  "Governing Law. This instrument shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict-of-laws principles.",
  "Severability. If any provision of this instrument is held invalid or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid provision shall be reformed to the minimum extent necessary.",
  "Entire Agreement. This instrument, together with its exhibits, constitutes the entire understanding of the parties with respect to its subject matter and supersedes all prior negotiations, representations and agreements.",
  "Counterparts. This instrument may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed originals.",
  "Notices. All notices shall be in writing and shall be deemed given when delivered personally, one business day after deposit with a nationally recognized overnight courier, or upon confirmed transmission by email.",
  "Amendment and Waiver. No amendment or waiver of any provision shall be effective unless in writing and signed by the party against whom enforcement is sought. No failure to exercise any right shall operate as a waiver thereof.",
  "Headings. Section headings are for convenience of reference only and shall not affect the interpretation of this instrument.",
  "Further Assurances. Each party shall execute and deliver such further instruments and take such further actions as may reasonably be required to carry out the intent of this instrument.",
  "Successors and Assigns. This instrument shall bind and inure to the benefit of the parties and their respective successors and permitted assigns.",
  "Construction. The words \"include,\" \"includes\" and \"including\" shall be deemed to be followed by \"without limitation.\" References to a statute include any amendment or successor thereto.",
  "Dispute Resolution. Any controversy arising under this instrument shall first be submitted to good-faith negotiation between senior representatives for a period of thirty (30) days before any party commences proceedings.",
  "Confidentiality. Each party shall hold in confidence all non-public information received from the other party and shall not disclose it except to advisors bound by similar obligations.",
  "Force Majeure. Neither party shall be liable for delay or failure in performance caused by events beyond its reasonable control, including acts of God, pandemic, war, labor disputes or governmental action.",
  "Independent Counsel. Each party acknowledges that it has had the opportunity to consult independent legal counsel of its choosing before executing this instrument.",
];
const CORP_FILL = [
  "The Secretary noted that notice of the meeting had been duly given or waived and that a quorum was present throughout.",
  "The Chair reviewed the agenda and invited questions. There being none, the meeting proceeded to the business at hand.",
  "RESOLVED FURTHER, that the officers of the Corporation are authorized to take all actions and execute all documents as may be necessary to carry out the foregoing resolutions.",
  "The Board discussed the Corporation's fiscal year, which shall end on December 31 of each year unless otherwise determined by the Board.",
  "RESOLVED, that the form of corporate seal presented to the meeting is adopted as the seal of the Corporation.",
  "RESOLVED, that the Corporation shall reimburse reasonable organizational expenses incurred in connection with its formation.",
  "The Board reviewed the requirement to obtain an employer identification number and to register to do business in the states where the Corporation operates.",
  "RESOLVED, that the officers are authorized to pay all fees and expenses incident to the organization of the Corporation.",
  "There being no further business, upon motion duly made and seconded, the meeting was adjourned.",
];
const BIZ_FILL = [
  "The addressable market for mid-market workflow automation is estimated at several billion dollars annually and continues to grow as teams consolidate tooling.",
  "Customer retention remained strong through the period, with most accounts expanding seats at renewal.",
  "The product roadmap prioritizes integrations with common accounting and CRM platforms, followed by a mobile companion app.",
  "Go-to-market focuses on inbound content, partner referrals and a small outbound team targeting operations leaders.",
  "Competitors include larger horizontal suites and a handful of point solutions; differentiation rests on setup time and price.",
  "Gross margin is expected to improve as hosting costs are renegotiated and support is partially automated.",
  "Hiring plans for the next four quarters include engineering, customer success and one finance generalist.",
  "Key risks include longer enterprise sales cycles and concentration in a small number of large customers.",
];
const HR_FILL = [
  "Questions about this policy should be directed to your manager or to the People team.",
  "This policy may be updated from time to time. The current version is always available on the internal wiki.",
  "Employees are expected to use good judgment and to act consistently with the company's code of conduct.",
  "Nothing in this policy alters the at-will nature of employment where applicable law permits.",
  "Requests should be submitted at least two weeks in advance whenever possible.",
  "Managers are responsible for ensuring coverage during approved absences.",
];
const fill = (pool, lo, hi) => sample(pool, Math.min(pool.length, rint(lo, hi))).join("\n\n");
const numbered = (pool, lo, hi, start = 1) =>
  sample(pool, Math.min(pool.length, rint(lo, hi))).map((p, i) => `${start + i}. ${p}`).join("\n\n");

// ---------- neutral padding (same length distribution for every bucket, so length never hints at the label) ----------
const SENT = {
  legal: [
    "Each party shall bear its own costs and expenses incurred in connection with this instrument.",
    "Time is of the essence with respect to every obligation hereunder.",
    "No third party is intended to be a beneficiary of this instrument.",
    "Any notice of default shall describe the default in reasonable detail.",
    "The prevailing party in any action to enforce this instrument shall be entitled to reasonable attorneys' fees.",
    "All payments shall be made in United States dollars.",
    "The recitals set forth above are incorporated herein by reference.",
    "Nothing herein shall be construed to create a partnership or joint venture.",
    "Obligations that by their nature should survive termination shall so survive.",
    "Delivery of an executed signature page by electronic transmission shall be effective as delivery of an original.",
    "The parties waive trial by jury to the fullest extent permitted by law.",
    "Any assignment in violation of this section shall be null and void.",
    "Capitalized terms used but not defined have the meanings given in the applicable schedule.",
    "The singular includes the plural and vice versa, as the context requires.",
    "Remedies provided herein are cumulative and not exclusive of any remedies provided by law.",
    "Each party represents that it has full power and authority to enter into this instrument.",
    "Performance shall be rendered in a professional and workmanlike manner.",
    "Records relating to performance shall be retained for not less than three years.",
    "Neither party shall make any public announcement regarding this instrument without prior consent.",
    "The exhibits and schedules form an integral part of this instrument.",
  ],
  corp: [
    "The Secretary was directed to file a copy of these proceedings with the minute book.",
    "Upon motion duly made and seconded, the matter was approved.",
    "The Chair confirmed that all attendees could hear one another.",
    "Discussion followed regarding the timing of the next regular meeting.",
    "The officers were authorized to engage accountants for the preparation of tax returns.",
    "It was noted that insurance coverage should be reviewed annually.",
    "The meeting was called to order at the time stated in the notice.",
    "No objection was raised to the conduct of the meeting.",
    "Management provided a brief operational update, which was received without action.",
    "The officers were directed to maintain the corporate records at the principal office.",
    "Signatories on deposit accounts shall be as designated from time to time by the Board.",
    "The fiscal calendar and reporting cadence were reviewed and confirmed.",
  ],
  biz: [
    "Onboarding time fell again this period as templates improved.",
    "Support ticket volume was flat despite customer growth.",
    "The team completed migration of legacy reports to the new dashboard.",
    "Partnerships contributed a growing share of qualified pipeline.",
    "Pricing tiers were simplified from four to three.",
    "Hosting spend per customer declined after the database upgrade.",
    "Customer interviews highlighted demand for better mobile workflows.",
    "Sales cycles in the healthcare segment remain longer than average.",
    "The marketing team tested two new landing pages with mixed results.",
    "Security questionnaires are now answered from a shared trust portal.",
    "A regional expansion is under evaluation for next year.",
    "Net promoter score improved modestly quarter over quarter.",
    "Documentation was reorganized around common customer jobs.",
    "Engineering reduced median page load time by roughly a third.",
  ],
  hr: [
    "Employees should record time off in the HR system before the absence begins.",
    "Unused balances are handled according to state law.",
    "Holidays falling on a weekend are observed on the nearest weekday.",
    "Reasonable accommodations are available upon request.",
    "The company reimburses approved expenses within two pay cycles.",
    "Receipts are required for any expense over twenty-five dollars.",
    "Managers should respond to requests within three business days.",
    "Training on this policy is part of new-hire orientation.",
    "Violations may result in disciplinary action up to and including termination.",
    "Part-time employees accrue benefits on a pro-rated basis.",
    "Remote employees must maintain a safe and ergonomic workspace.",
    "Business travel should be booked through the approved portal.",
  ],
  casual: [
    "Let me know if anything changes.",
    "Parking is easiest on the side street after six.",
    "Bring a jacket, it gets cold in the evening.",
    "We can split the cost afterward.",
    "The kids are welcome too.",
    "I'll send photos later this week.",
    "Running about ten minutes behind, sorry!",
    "The forecast looks fine for the weekend.",
    "Thanks again for organizing this.",
    "Next time we should try the place downtown.",
    "Reminder to double-check the reservation.",
    "Happy to host again next month.",
  ],
  tech: [
    "Performance improvements apply to all workspaces automatically.",
    "No action is required from administrators.",
    "Known issues are tracked on the status page.",
    "The previous API version remains supported for twelve months.",
    "Accessibility fixes were made to keyboard navigation.",
    "Logs are retained for ninety days.",
    "Feature flags allow gradual rollout to all tenants.",
    "Regression tests were expanded for scheduling edge cases.",
    "Deprecated endpoints now return a warning header.",
    "Localization was added for three additional languages.",
  ],
  notes: [
    "Share counts are shown on an as-issued basis unless noted.",
    "Figures are unaudited and subject to adjustment.",
    "Percentages may not total 100% due to rounding.",
    "Amounts are presented in U.S. dollars.",
    "Prior-period figures were reclassified to conform to the current presentation.",
    "Source data was exported from the system of record on the date shown.",
    "This schedule should be read together with the accompanying notes.",
    "Totals reflect only entries posted as of the cut-off date.",
  ],
};
const PAD_HEAD = {
  legal: ["Additional Provisions", "General Terms", "Miscellaneous", "Standard Terms and Conditions"],
  corp: ["Other Business", "Additional Matters", "Housekeeping"],
  biz: ["Additional Detail", "Appendix", "Background", "Operating Notes"],
  hr: ["Procedures", "Frequently Asked Questions", "Additional Guidance"],
  casual: ["P.S.", "Also", "Other stuff"],
  tech: ["Other Changes", "Notes", "Known Issues"],
  notes: ["Notes", "Footnotes", "Basis of Presentation"],
};
const DEFAULT_PAD = {
  [C.formation]: "corp", [C.agreement]: "legal", [C.stock]: "notes", [C.accounting]: "notes",
  [C.other]: "legal", [C.marketing]: "biz", [C.personal]: "casual", [C.invoice]: "notes",
  [C.email]: "casual", [C.bank]: "notes",
};
// Slot grammars give thousands of distinct sentences per style, so long files do not repeat themselves.
const GRAM = {
  legal: [["Each party", "The Company", "The recipient", "Either party", "The undersigned", "Any successor", "The disclosing party", "The service provider"],
    ["shall promptly notify the other party of", "shall maintain accurate records of", "shall not be liable for", "shall use commercially reasonable efforts to resolve", "may suspend performance in the event of", "shall cooperate in good faith regarding", "shall indemnify the other party against", "shall provide reasonable documentation of"],
    ["any material change in circumstances", "any claim arising hereunder", "delays caused by third-party vendors", "the matters described in this section", "any inquiry from a governmental authority", "any inaccuracy in the schedules", "losses arising from its gross negligence", "any breach of the confidentiality obligations"],
    ["within ten (10) business days", "to the extent permitted by applicable law", "except as otherwise provided herein", "upon written request", "during the term and for one year thereafter", "as soon as reasonably practicable", "in accordance with the notice provisions"]],
  corp: [["The Board", "The Secretary", "Management", "The Chair", "The Treasurer", "The committee"],
    ["reviewed", "noted", "discussed", "requested an update on", "deferred consideration of", "acknowledged receipt of"],
    ["the annual compliance calendar", "renewal of the general liability policy", "the schedule for the next regular meeting", "the updated records-retention guidelines", "the status of state tax registrations", "the proposed meeting calendar", "the insurance broker's renewal summary", "the draft budget template"],
    ["without further action", "and agreed to revisit it next quarter", "and directed follow-up by the officers", "with no objection", "and requested written materials in advance", "for information only"]],
  biz: [["The operations team", "Customer success", "The product group", "Engineering", "Finance", "Marketing", "The support desk", "The sales team"],
    ["completed", "piloted", "reviewed", "streamlined", "began tracking", "published", "revisited", "prioritized"],
    ["the quarterly onboarding survey", "a new escalation playbook", "renewal forecasting for mid-market accounts", "the partner referral process", "usage reporting for admins", "the help-center search experience", "the regional pricing experiment", "vendor security reviews"],
    ["ahead of schedule", "with encouraging early results", "as part of the annual plan", "after customer feedback", "in collaboration with two design partners", "with modest impact so far"]],
  hr: [["Employees", "Managers", "New hires", "Contractors", "Team leads", "Remote staff"],
    ["should review", "are required to acknowledge", "may request changes to", "must complete training on", "should contact People Ops about", "are encouraged to read"],
    ["the updated leave calendar", "the holiday schedule", "the expense reimbursement guidelines", "the home-office stipend rules", "the workplace conduct standards", "the benefits enrollment window", "the travel booking procedure", "the safety checklist"],
    ["within thirty days", "before their next review cycle", "at least annually", "through the internal portal", "during onboarding", "as soon as practicable"]],
  casual: [["We", "The group", "Everyone", "A few of us", "My neighbors", "The kids"],
    ["are planning to", "might", "want to", "decided to", "forgot to", "can't wait to"],
    ["try the new taco place", "carpool on Saturday", "bring folding chairs", "book the picnic shelter", "watch the game at Dana's", "swap board games", "check out the farmers market", "walk the dog after lunch"],
    ["if the weather holds", "next weekend", "sometime soon", "before the holidays", "if anyone's free", "no pressure"]],
  tech: [["The scheduler", "The API", "The mobile app", "The admin console", "Search", "Notifications", "Exports", "The import wizard"],
    ["now handles", "no longer fails on", "is faster at processing", "better supports", "correctly validates", "logs more detail about"],
    ["large attachments", "recurring events across time zones", "bulk updates", "custom field types", "webhook retries", "CSV files with unusual encodings", "concurrent edits", "archived projects"],
    ["in all regions", "for enterprise workspaces", "behind a feature flag", "starting this release", "on supported browsers", "after the next sync"]],
  notes: [["Amounts", "Totals", "Share figures", "Balances", "Line items", "Percentages"],
    ["are presented", "have been rounded", "are reported", "were compiled", "are stated", "were reconciled"],
    ["as of the cut-off date", "on a cash basis", "from the system of record", "before year-end adjustments", "without independent verification", "on the basis described in the notes"],
    ["unless otherwise indicated", "for internal use", "and may change", "as provided by management", "consistent with prior periods", "subject to review"]],
};
function makePara(style, used) {
  const k = rint(3, 5), out = [];
  let guard = 0;
  while (out.length < k && guard++ < 200) {
    let s;
    if (chance(0.3)) s = pick(SENT[style]);
    else {
      const g = GRAM[style];
      s = `${pick(g[0])} ${pick(g[1])} ${pick(g[2])} ${pick(g[3])}.`;
    }
    if (used.has(s)) continue;
    used.add(s);
    out.push(s);
  }
  return out.join(" ");
}
const targetLen = (short) => (short ? rint(900, 1600) : chance(0.55) ? rint(900, 2200) : chance(0.78) ? rint(2200, 4500) : rint(4500, 7000));
function pad(body, style, short) {
  let out = body.trim();
  const target = targetLen(short);
  if (out.length >= target) return out;
  const extra = [];
  const used = new Set();
  let len = out.length;
  while (len < target) {
    const p = makePara(style, used);
    extra.push(p);
    len += p.length + 2;
  }
  const block = (chance(0.6) ? `### ${pick(PAD_HEAD[style])}\n\n` : "") + extra.join("\n\n");
  const parts = out.split("\n\n");
  if (parts.length > 2 && chance(0.7)) {
    const tail = parts.splice(parts.length - 1, 1);
    return [...parts, block, ...tail].join("\n\n");
  }
  return out + "\n\n" + block;
}

// ---------- formatting quirks (applied to every bucket equally) ----------
let bates = rint(10000, 20000);
function quirk(body) {
  let out = body.trim();
  if (chance(0.25)) out = pick(["CONFIDENTIAL", "PRIVILEGED & CONFIDENTIAL — PRODUCED IN DISCOVERY", "COPY", "*Scanned copy*", "FILE COPY — DO NOT REMOVE"]) + "\n\n" + out;
  if (chance(0.2)) out = out.replace(/^# /gm, "## ");
  if (chance(0.15)) out = out.replace(/^#+ (.*)$/gm, (_, t) => `**${t.toUpperCase()}**`);
  if (chance(0.3)) {
    const paras = out.split("\n\n");
    if (paras.length > 4) {
      const cut = rint(2, paras.length - 2);
      const pages = rint(2, 3);
      paras.splice(cut, 0, `— Page 1 of ${pages} —`);
      out = paras.join("\n\n") + `\n\n— Page ${pages} of ${pages} —`;
    }
  }
  if (chance(0.2)) out += `\n\n[${pick(["illegible handwriting in margin", "stamp: RECEIVED", "fax header partially cut off", "staple holes", "initialed in margin"])}]`;
  if (chance(0.4)) out += `\n\nBLV-${String(bates++).padStart(7, "0")}`;
  return out + "\n";
}

// ---------- share / ownership helpers ----------
const aSh = () => pick([5500000, 6000000, 6500000, 7000000, 7500000]);
const bSh = () => pick([2500000, 3000000, 3500000, 4000000]);
const aPct = () => pick([60, 65, 70, 75]);
const cert = () => `CS-${rint(1, 4)}`;
const firm = () => pick(FIRMS);
const bank = () => pick(BANKS);

// =====================================================================
// CLEAR RESPONSIVE templates
// =====================================================================
const CR = [
  () => {
    const d = date(2019, 2020);
    return { cat: C.formation, rfps: ["RFP_05", "RFP_01", "RFP_06"], st: "strong", why: "Brightline certificate of incorporation naming Blake as incorporator acting for founder Rivera.", body: `
# ${pick(["CERTIFICATE OF INCORPORATION", "ARTICLES OF INCORPORATION"])} OF ${CO.toUpperCase()}

Filed with the Secretary of State, State of Delaware, ${d}. File No. ${rint(7000000, 7999999)}.

ARTICLE I. The name of the corporation is ${CO}

ARTICLE II. The registered office is c/o ${pick(AGENTS)}, ${rint(100, 9999)} ${pick(["Market St", "Orange St", "Silver Lake Blvd"])}, ${pick(["Wilmington", "Dover"])}, Delaware.

ARTICLE III. The purpose of the corporation is to engage in any lawful act or activity for which corporations may be organized under the General Corporation Law of Delaware.

ARTICLE IV. The corporation is authorized to issue ${num(pick([10000000, 12000000, 15000000]))} shares of Common Stock, par value $${pick(["0.0001", "0.00001", "0.001"])} per share.

ARTICLE V. The name and mailing address of the incorporator is ${B}, who executes this certificate at the direction of and on behalf of ${A}, the founder of the corporation.

ARTICLE VI. The initial director${chance(0.5) ? "s are" : " is"} ${chance(0.5) ? `${A} and ${B}` : A}.

${fill(LEGAL_FILL, 0, 3)}

/s/ ${B}, Incorporator
Dated: ${d}` };
  },
  () => {
    const d = date(2019, 2020);
    const arts = [
      `ARTICLE I — OFFICES. The principal office shall be located in ${pick(CITIES)} or such other place as the Board may designate.`,
      `ARTICLE II — STOCKHOLDERS. The annual meeting of stockholders shall be held each ${pick(MONTHS)} at a time fixed by the Board. Special meetings may be called by the President or by holders of not less than ${pick([10, 20, 25])}% of the outstanding shares.`,
      `ARTICLE III — DIRECTORS. The number of directors shall be ${pick(["two", "three", "not less than one nor more than five"])}. Directors shall be elected by a plurality of votes cast.`,
      `ARTICLE IV — OFFICERS. The officers shall be a President, a Secretary and a Treasurer. The Treasurer shall have custody of the corporate funds and shall keep full and accurate accounts of receipts and disbursements.`,
      `ARTICLE V — STOCK. Certificates shall be signed by the President and the Secretary. Transfers shall be made only on the stock ledger of the Corporation upon surrender of the certificate duly endorsed.`,
      `ARTICLE VI — INDEMNIFICATION. The Corporation shall indemnify its directors and officers to the fullest extent permitted by the General Corporation Law.`,
      `ARTICLE VII — AMENDMENTS. These Bylaws may be amended by the Board or by the stockholders holding a majority of the outstanding shares.`,
    ];
    return { cat: C.formation, rfps: ["RFP_05"], st: "strong", why: "Bylaws of Brightline Ventures, Inc.: a core formation/governance document.", body: `
# BYLAWS OF ${CO.toUpperCase()}
${pick(["(a Delaware corporation)", "Adopted by the Board of Directors", "As adopted " + d])}

${arts.slice(0, rint(4, 7)).join("\n\n")}

${fill(LEGAL_FILL, 0, 2)}

CERTIFICATE OF SECRETARY
I, ${B}, Secretary of ${CO}, certify that the foregoing Bylaws were adopted by the Board of Directors on ${d}.
/s/ ${B}` };
  },
  () => {
    const d = date(2019, 2020), sh = aSh();
    return { cat: C.formation, rfps: ["RFP_05", "RFP_01", "RFP_02", "RFP_04", "RFP_06"], st: "strong", why: "Organizational board minutes issuing founder shares to Rivera for his IP and cash.", body: `
# MINUTES OF THE ORGANIZATIONAL MEETING OF THE BOARD OF DIRECTORS
## ${CO}

Date: ${d}  Place: ${pick(["by videoconference", "offices of " + firm(), pick(CITIES)])}
Present: ${A} (Director), ${B} (Director). Also present: ${person()}, counsel.

${fill(CORP_FILL, 1, 3)}

Issuance of Founder Stock. RESOLVED, that the Corporation issue ${num(sh)} shares of Common Stock to ${A}, as founder, in exchange for the assignment of the Brightline software platform and related intellectual property and cash of $${money(20000, 80000)}.

RESOLVED, that the Corporation issue ${num(bSh())} shares of Common Stock to ${B} in consideration of services rendered in connection with the incorporation of the Corporation.

Election of Officers. RESOLVED, that ${A} is elected President and ${B} is elected Secretary and Treasurer, with authority to open and sign on the Corporation's bank accounts at ${bank()}.

${fill(CORP_FILL, 1, 3)}

/s/ ${B}, Secretary` };
  },
  () => {
    const d = date(2022, 2024);
    return { cat: C.formation, rfps: ["RFP_05", "RFP_08"], st: "strong", why: "Brightline board resolution approving recurring fees paid to Blake Holdings LLC.", body: `
# RESOLUTIONS OF THE BOARD OF DIRECTORS OF ${CO.toUpperCase()}
Adopted ${d}

WHEREAS, ${BH}, an entity controlled by ${B}, has provided "${pick(["management", "strategic advisory", "operational consulting", "administrative"])} services" to the Corporation;

RESOLVED, that the Corporation shall pay ${BH} a monthly fee of $${money(8000, 25000)}, retroactive to ${date(2021, 2022)};

RESOLVED FURTHER, that ${B}, as Treasurer, is authorized to effect such payments by wire from the Corporation's operating account at ${bank()} without further Board approval.

${fill(CORP_FILL, 0, 2)}

Director voting in favor: ${B}. ${chance(0.5) ? `Director ${A}: not present; no notice record located.` : ""}
/s/ ${B}` };
  },
  () => {
    const d = date(2023, 2024);
    return { cat: C.formation, rfps: ["RFP_05", "RFP_10", "RFP_02"], st: "strong", why: "Blake's written consent issuing shares to Blake Holdings and cancelling Rivera's certificate.", body: `
# ACTION BY WRITTEN CONSENT OF THE ${pick(["SOLE DIRECTOR", "BOARD OF DIRECTORS"])}
## ${CO}

The undersigned, being ${pick(["the sole director", "all of the directors then in office"])} of ${CO}, acting pursuant to Section 141(f) of the Delaware General Corporation Law, hereby adopts the following resolutions effective ${d}:

1. Issuance. The Corporation shall issue ${num(pick([15000000, 20000000, 25000000]))} shares of Common Stock to ${BH} for consideration of $${money(100, 2000)}.

2. Cancellation. Certificate ${cert()} registered to ${A} is hereby cancelled and returned to authorized but unissued status for "${pick(["failure to pay consideration", "abandonment", "breach of founder obligations", "non-vesting"])}".

3. Ledger. The Secretary is directed to update the stock ledger to reflect the foregoing.

${fill(CORP_FILL, 0, 2)}

/s/ ${B}` };
  },
  () => {
    const sh = aSh(), c = cert(), d = date(2019, 2021);
    return { cat: C.stock, rfps: ["RFP_02", "RFP_01", "RFP_06"], st: "strong", short: true, why: "Brightline stock certificate issued to Rivera.", body: `
# ${CO.toUpperCase()}
### Incorporated under the laws of the State of Delaware

Certificate No. ${c}                                   ${num(sh)} Shares

THIS CERTIFIES THAT **${A}** is the registered holder of ${num(sh)} fully paid and non-assessable shares of Common Stock, par value $0.0001, of ${CO}, transferable only on the books of the Corporation by the holder in person or by attorney upon surrender of this certificate properly endorsed.

${chance(0.6) ? "LEGEND: THE SHARES REPRESENTED HEREBY HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933 AND MAY NOT BE SOLD OR TRANSFERRED ABSENT REGISTRATION OR AN EXEMPTION THEREFROM." : ""}

Dated: ${d}

${pick([A, "President"])} ______________      ${B}, Secretary ______________

[corporate seal]` };
  },
  () => {
    const sh = aSh(), bs = bSh(), pool = pick([500000, 750000, 1000000]);
    const tot = sh + bs + pool;
    const pct = (x) => ((100 * x) / tot).toFixed(1) + "%";
    const extra = chance(0.4) ? `| ${pick(INVESTORS)} (SAFE, as-converted) | ${num(rint(200000, 600000))} | — |\n` : "";
    return { cat: C.stock, rfps: ["RFP_02", "RFP_01", "RFP_06"], st: "strong", why: "Brightline capitalization table listing Rivera and Blake holdings.", body: `
# ${CO} — ${pick(["Capitalization Table", "Cap Table", "Fully Diluted Capitalization"])} (as of ${date(2020, 2022)})

| Holder | Class | Shares | % FD |
|---|---|---|---|
| ${A} | Common | ${num(sh)} | ${pct(sh)} |
| ${B} | Common | ${num(bs)} | ${pct(bs)} |
| Option pool (unallocated) | — | ${num(pool)} | ${pct(pool)} |
${extra}| **Total** | | **${num(tot)}** | 100% |

${pick(["Prepared by the Secretary.", "Source: company stock ledger.", "Draft for counsel review.", "Exported from equity management tool."])}` };
  },
  () => {
    const c1 = "CS-1", sh = aSh();
    return { cat: C.stock, rfps: ["RFP_02", "RFP_01", "RFP_10", "RFP_06"], st: "strong", why: "Brightline stock ledger showing Rivera's certificate later marked cancelled.", body: `
# ${CO} — Stock Transfer Ledger

| Entry | Date | Cert # | Holder | Shares | Action | Notes |
|---|---|---|---|---|---|---|
| 1 | ${date(2019, 2020)} | ${c1} | ${A} | ${num(sh)} | Issued | Founder; IP + cash |
| 2 | ${date(2019, 2020)} | CS-2 | ${B} | ${num(bSh())} | Issued | Services |
| 3 | ${date(2023, 2024)} | ${c1} | ${A} | (${num(sh)}) | Cancelled | "per written consent" |
| 4 | ${date(2023, 2024)} | CS-${rint(3, 6)} | ${BH} | ${num(pick([15000000, 20000000]))} | Issued | |

Maintained by: ${B}, Secretary` };
  },
  () => {
    const sh = aSh(), d = date(2019, 2021);
    return { cat: C.agreement, rfps: ["RFP_02", "RFP_04", "RFP_06"], st: "strong", why: "Rivera's stock subscription agreement buying Brightline founder shares for cash and IP.", body: `
# ${pick(["COMMON STOCK SUBSCRIPTION AGREEMENT", "RESTRICTED STOCK PURCHASE AGREEMENT", "FOUNDER STOCK PURCHASE AGREEMENT"])}

This Agreement is entered into as of ${d} by and between ${CO} (the "Company") and ${A} ("Purchaser").

1. Purchase. Purchaser agrees to purchase ${num(sh)} shares of the Company's Common Stock at $${pick(["0.0001", "0.001"])} per share, for aggregate cash consideration of $${money(500, 7500)}, plus the assignment of the technology described in Exhibit A.

2. Vesting. ${pick(["The shares are fully vested upon issuance.", "25% of the shares vest on the first anniversary, with the balance vesting monthly over 36 months.", "The shares vest in equal monthly installments over 48 months."])}

3. Representations. Purchaser is acquiring the shares for investment and not with a view to distribution.

${numbered(LEGAL_FILL, 1, 5, 4)}

Exhibit A: Brightline platform source code, designs, domain names and related IP.

COMPANY: ${CO}, by ${B}, Secretary        PURCHASER: ${A}` };
  },
  () => {
    const d = date(2019, 2021);
    return { cat: C.agreement, rfps: ["RFP_04", "RFP_06", "RFP_02"], st: "strong", why: "Rivera's technology assignment to Brightline in exchange for founder shares.", body: `
# ${pick(["TECHNOLOGY ASSIGNMENT AGREEMENT", "INTELLECTUAL PROPERTY ASSIGNMENT", "CONTRIBUTION AND ASSIGNMENT AGREEMENT"])}

Effective ${d}, ${A} ("Assignor"), a founder of ${CO} (the "Company"), hereby irrevocably assigns to the Company all right, title and interest in the Brightline ${pick(["platform", "software", "scheduling engine", "codebase"])}, including source code repositories, trademarks, domain names (brightlineventures.com) and all related know-how (the "Technology").

Consideration. In consideration for the Technology, the Company shall issue to Assignor ${num(aSh())} shares of Common Stock as set forth in the Founder Stock Purchase Agreement.

${fill(LEGAL_FILL, 1, 4)}

ASSIGNOR: ${A}          ACCEPTED: ${CO}, by ${B}` };
  },
  () => {
    const p = aPct(), d = date(2019, 2020);
    return { cat: C.agreement, rfps: ["RFP_03", "RFP_01", "RFP_04", "RFP_06"], st: "strong", why: "Founders' agreement setting the Rivera/Blake ownership split and contributions.", body: `
# ${pick(["FOUNDERS' AGREEMENT", "CO-FOUNDER AGREEMENT", "FOUNDERS' MEMORANDUM OF UNDERSTANDING"])}
${CO}

Dated ${d}, between ${A} ("Founder") and ${B} ("Co-Founder").

1. Ownership. Founder shall hold ${p}% and Co-Founder ${100 - p}% of the issued Common Stock of the Company.
2. Contributions. Founder contributes the Brightline platform and $${money(30000, 90000)} in seed capital. Co-Founder contributes incorporation, banking setup and administrative services.
3. Incorporation. Co-Founder shall incorporate the Company on Founder's behalf and shall hold no shares other than as provided in Section 1.
4. Decisions. Issuance of additional shares requires the written consent of both Founders.

${numbered(LEGAL_FILL, 1, 6, 5)}

Signed: ${A}        ${B}` };
  },
  () => {
    const y = rint(2020, 2024);
    const dirs = y < 2023 ? `${A}; ${B}` : pick([`${A}; ${B}`, B]);
    return { cat: C.formation, rfps: ["RFP_05", "RFP_01", "RFP_06"], st: "strong", why: "State filing for Brightline listing Rivera among its directors/officers.", body: `
# ${pick(["STATEMENT OF INFORMATION", "ANNUAL REPORT", "FOREIGN QUALIFICATION — APPLICATION FOR CERTIFICATE OF AUTHORITY"])}
Entity: ${CO}   Entity No. ${rint(4000000, 4999999)}   Jurisdiction of formation: Delaware
Filing year: ${y}

Principal office: ${rint(100, 999)} ${pick(["Main St", "Commerce Way", "Pine Ave"])}, ${pick(CITIES)}

Officers:
- President / CEO: ${A}
- Secretary: ${B}
- Treasurer / CFO: ${B}

Directors: ${dirs.includes(A) ? dirs : `${A}; ${B}`}

Shareholders of record holding 20% or more (if required): ${A}${chance(0.5) ? `; ${B}` : ""}

Filed by: ${pick([B, person() + ", " + pick(AGENTS)])}  Date: ${date(y, y)}` };
  },
  () => {
    const inv = pick(INVESTORS);
    return { cat: C.other, rfps: ["RFP_07", "RFP_01"], st: "strong", pad: "biz", why: "Investor pitch deck in which Blake presents himself as sole founder and 100% owner.", body: `
# Brightline — ${pick(["Seed Round", "Series A", "Bridge Round"])} Deck (prepared for ${inv})

**Slide 1 — Brightline**: workflow automation for ${pick(["mid-market operations teams", "field service companies", "clinics", "logistics shippers"])}.

**Slide 2 — Problem**: ${pick(BIZ_FILL)}

**Slide 3 — Traction**: ${rint(20, 180)} customers, $${rint(200, 1800)}K ARR, ${rint(80, 130)}% net revenue retention.

**Slide 4 — Team & Ownership**
- ${B} — Founder & CEO. Owns ${pick([100, 100, 95])}% of outstanding equity.
- ${pick(["No other founders or significant shareholders.", "Clean cap table: single founder, no prior priced rounds."])}

**Slide 5 — The Ask**: $${rint(1, 6)}M at $${rint(8, 30)}M pre-money.

${fill(BIZ_FILL, 0, 3)}

Contact: ${B}, jordan@brightlineventures.com` };
  },
  () => {
    const bk = bank();
    return { cat: C.other, rfps: ["RFP_07", "RFP_01"], st: "strong", why: "Loan application where Blake certifies to a bank that he owns Brightline.", body: `
# ${bk} — ${pick(["Small Business Loan Application", "Business Line of Credit Application", "Equipment Financing Application"])}

Section 1 — Business: ${CO}, EIN ${rint(10, 99)}-${rint(1000000, 9999999)}, established ${rint(2019, 2020)}.
Section 2 — Amount requested: $${num(rint(50, 500) * 1000)}. Purpose: ${pick(["working capital", "equipment", "hiring", "refinancing"])}.
Section 3 — Owners (20% or more):
| Name | Title | Ownership % |
|---|---|---|
| ${B} | ${pick(["President", "CEO", "Managing Member"])} | ${pick([100, 95, 90])}% |

Section 4 — Certification. I certify that the information above is true and complete.
/s/ ${B}   Date: ${date(2022, 2024)}

${fill(LEGAL_FILL, 0, 2)}` };
  },
  () => {
    const f = firm();
    return { cat: C.other, rfps: ["RFP_10", "RFP_01", "RFP_06", "RFP_08"], st: "strong", why: "Demand letter from Rivera's counsel asserting his ownership and demanding an accounting of funds taken by Blake.", body: `
# ${f.toUpperCase()}
${pick(CITIES)}

${date(2024, 2025)}

VIA ${pick(["EMAIL AND CERTIFIED MAIL", "FEDEX", "EMAIL"])}

${B}
${pick(["c/o " + CO, "Personal residence"])}

Re: ${CO} — Demand for Restoration of Shares and Accounting

Dear Mr. Blake:

This firm represents ${A}, the founder and majority stockholder of ${CO}. Our client contributed the Company's core technology and its seed capital and was issued founder shares at formation. We understand that you have purported to cancel our client's shares and have caused Company funds to be transferred to yourself and to ${BH}.

We demand that you (1) restore our client's shares on the stock ledger; (2) provide a full accounting of all transfers from Company accounts to you or any entity you control since ${date(2020, 2021)}; and (3) preserve all documents relating to these matters.

${pick(["Please respond within ten business days.", "Absent a satisfactory response, we are instructed to file suit without further notice."])}

Very truly yours,
${person()}, ${f}` };
  },
  () => {
    const cn = `${rint(2024, 2025)}-${pick(["CV", "cv"])}-${rint(1000, 9999)}`;
    return { cat: C.other, rfps: ["RFP_10", "RFP_01", "RFP_06", "RFP_08"], st: "strong", why: "Court complaint in Rivera v. Blake alleging ownership and embezzlement.", body: `
# ${pick(["IN THE COURT OF CHANCERY OF THE STATE OF DELAWARE", "SUPERIOR COURT OF THE STATE — COUNTY OF " + pick(["TRAVIS", "DENVER", "MULTNOMAH"]).toUpperCase()])}

${A.toUpperCase()}, Plaintiff,
v.
${B.toUpperCase()}, Defendant.
Case No. ${cn}

## ${pick(["VERIFIED COMPLAINT", "COMPLAINT FOR DECLARATORY RELIEF AND DAMAGES"])}

1. Plaintiff is the founder and rightful owner of ${CO} (the "Company").
2. Defendant incorporated the Company on Plaintiff's behalf in ${rint(2019, 2020)} and was given signing authority over Company bank accounts.
3. Defendant thereafter caused the Company to transfer not less than $${num(rint(150, 900) * 1000)} to himself and to ${BH}, an entity he controls.
4. Defendant further purported to cancel Plaintiff's shares without consent.

COUNT I — Declaratory Judgment of Ownership
COUNT II — ${pick(["Conversion", "Breach of Fiduciary Duty", "Embezzlement / Misappropriation"])}

${fill(LEGAL_FILL, 0, 2)}

Dated ${date(2024, 2025)}   ${firm()}, Attorneys for Plaintiff` };
  },
  () => {
    const f = firm();
    return { cat: C.other, rfps: ["RFP_10", "RFP_01"], st: "strong", why: "Blake's counsel letter disputing Rivera's claimed ownership interest.", body: `
# ${f}

${date(2024, 2025)}

Re: Alleged ownership claim of ${A} in ${CO}

Counsel:

We represent ${B}. We reject the assertion that your client holds any equity in ${CO}. Your client ${pick(["never paid for the shares he claims", "abandoned the venture before any shares vested", "signed no stock purchase agreement we have located"])}, and any certificate previously prepared in his name was properly cancelled. Payments to ${BH} were compensation for services duly approved by the Board.

Our client reserves all rights.

${person()}` };
  },
  () => {
    const sh = aSh();
    return { cat: C.stock, rfps: ["RFP_02", "RFP_10", "RFP_01"], st: "strong", short: true, why: "Stock power purporting to transfer Rivera's Brightline shares to Blake.", body: `
# ${pick(["STOCK POWER AND ASSIGNMENT SEPARATE FROM CERTIFICATE", "IRREVOCABLE STOCK POWER"])}

FOR VALUE RECEIVED, ${A} hereby sells, assigns and transfers unto ${pick([B, BH])} ${num(sh)} shares of the Common Stock of ${CO} standing in the undersigned's name on the books of the Company, represented by Certificate No. ${cert()}, and irrevocably appoints ${B} attorney to transfer the said stock on the books of the Company.

Dated: ${pick(["__________", date(2023, 2024)])}

Signature: ${pick(["/s/ A. Rivera", "[signature]", "(electronic signature — audit trail not attached)"])}

${pick(["Note from transfer agent: signature guarantee missing.", "Received by Secretary " + date(2023, 2024) + ".", ""])}` };
  },
  () => {
    const sh = aSh();
    return { cat: C.other, rfps: ["RFP_02", "RFP_06", "RFP_04"], st: "strong", why: "Rivera's Section 83(b) election covering his Brightline founder shares.", body: `
# ELECTION UNDER SECTION 83(b) OF THE INTERNAL REVENUE CODE

The undersigned taxpayer hereby elects under Section 83(b) with respect to the property described below:

1. Taxpayer: ${A}, SSN ***-**-${rint(1000, 9999)}
2. Property: ${num(sh)} shares of Common Stock of ${CO}
3. Date of transfer: ${date(2019, 2020)}   Taxable year: ${rint(2019, 2020)}
4. Restrictions: subject to repurchase under the Founder Stock Purchase Agreement.
5. Fair market value at transfer: $${money(500, 7000)}
6. Amount paid: $${money(500, 7000)} plus assignment of technology.

A copy has been furnished to ${CO}.

/s/ ${A}   Date: ${date(2019, 2020)}` };
  },
  () => {
    const p = aPct();
    return { cat: C.other, rfps: ["RFP_03", "RFP_04", "RFP_06"], st: pick(["strong", "medium"]), pad: "biz", short: true, why: "Meeting notes recording the agreed Rivera/Blake ownership split and contributions.", body: `
# ${pick(["Meeting notes", "Notes — founders sync", "Kickoff notes"])} — ${date(2019, 2020)}
Attendees: ${A}, ${B}${chance(0.4) ? ", " + person() + " (accountant)" : ""}

- Company name: Brightline Ventures, Inc. — Jordan to handle Delaware filing for Alex.
- Split agreed: Alex ${p}% / Jordan ${100 - p}%.
- Alex contributes the code + $${num(rint(30, 90) * 1000)} seed; Jordan does paperwork, bank account, payroll setup.
- Jordan to be Secretary/Treasurer, Alex President.
- ${pick(["Next: engage counsel for founder docs.", "Next: order corporate kit.", "Next: open account at " + bank() + "."])}` };
  },
  () => {
    const amt = money(40000, 250000);
    return { cat: C.other, rfps: ["RFP_08", "RFP_09"], st: "strong", why: "Promissory note documenting Brightline funds advanced to Blake Holdings and never repaid.", body: `
# ${pick(["PROMISSORY NOTE", "INTERCOMPANY LOAN NOTE"])}

$${amt}                                        ${date(2021, 2023)}

FOR VALUE RECEIVED, ${BH} ("Borrower") promises to pay to ${CO} ("Lender") the principal sum of $${amt}, with interest at ${pick(["0%", "1%", "2.5%"])} per annum, due ${pick(["on demand", "in a single payment on the fifth anniversary hereof", "at such time as the Lender's Treasurer may determine"])}.

Funds were disbursed from Lender's operating account at ${bank()} by wire on the date hereof.

${fill(LEGAL_FILL, 1, 3)}

BORROWER: ${BH}, by ${B}, Managing Member
LENDER: ${CO}, by ${B}, Treasurer

${pick(["Payment history: none recorded.", "Accountant note: no payments received as of year end.", ""])}` };
  },
  () => {
    return { cat: C.formation, rfps: ["RFP_05", "RFP_10", "RFP_01"], st: "strong", why: "Stockholder action removing Rivera as director and officer of Brightline.", body: `
# ${pick(["WRITTEN CONSENT OF STOCKHOLDERS IN LIEU OF MEETING", "MINUTES OF SPECIAL MEETING OF STOCKHOLDERS"])}
${CO}

Effective ${date(2023, 2024)}, the undersigned, representing ${pick(["a majority", "all"])} of the outstanding voting shares, hereby:

RESOLVED, that ${A} is removed as a director of the Corporation, effective immediately;
RESOLVED, that ${A} is removed from the office of President, and ${B} is appointed President and Chief Executive Officer;
RESOLVED, that the size of the Board is fixed at one (1).

${fill(CORP_FILL, 0, 2)}

Stockholder: ${pick([BH + ", by " + B, B])}` };
  },
  () => {
    const bk = bank();
    return { cat: C.other, rfps: ["RFP_07", "RFP_01"], st: "strong", why: "Beneficial-ownership certification where Blake tells the bank he is Brightline's only owner.", body: `
# ${bk} — Certification Regarding Beneficial Owners of Legal Entity Customers

Legal entity: ${CO}   Account type: ${pick(["business checking", "money market", "merchant services"])}

Section I — Individuals owning 25% or more of the equity interests:
| Name | Address | Ownership % |
|---|---|---|
| ${B} | ${rint(10, 999)} ${pick(["Elm", "Ridge", "Harbor"])} Rd | ${pick([100, 100, 90])}% |

Section II — Individual with significant control: ${B}, ${pick(["CEO", "President"])}

I certify that the information provided is complete and correct.
/s/ ${B}   ${date(2022, 2024)}` };
  },
  () => {
    const rows = Array.from({ length: rint(4, 9) }, () => `| ${date(2021, 2024)} | ${pick(["Wire out", "ACH", "Online transfer", "Check"])} | ${pick([BH, "J. Blake personal ****" + rint(1000, 9999), BH])} | $${money(3000, 60000)} |`).join("\n");
    return { cat: C.accounting, rfps: ["RFP_08", "RFP_09"], st: "strong", why: "Forensic accounting memo tracing Brightline funds to Blake and Blake Holdings.", body: `
# ${pick(["Forensic Accounting Memorandum", "Preliminary Tracing Analysis", "Schedule of Related-Party Disbursements"])}
Subject: ${CO} — related-party transfers
Prepared by: ${person()}, CPA, CFE   Date: ${date(2024, 2025)}

We reviewed statements for the Company's operating account at ${bank()}. The following disbursements were made to ${B} or to entities he controls, with no supporting invoices located:

| Date | Method | Payee | Amount |
|---|---|---|---|
${rows}

${pick(["Total identified to date exceeds amounts approved by any Board resolution we have seen.", "Further tracing of the Blake Holdings account is pending subpoena.", "All transfers were initiated under Mr. Blake's credentials."])}` };
  },
];

// =====================================================================
// HARD BORDERLINE — truly responsive
// =====================================================================
const BR = [
  () => ({ cat: C.formation, rfps: ["RFP_05", "RFP_10"], st: "weak", why: "Unnamed draft charter amendment for Brightline that would multiply authorized shares and strip preemptive rights, diluting Rivera.", body: `
# DRAFT — CERTIFICATE OF AMENDMENT TO CERTIFICATE OF INCORPORATION
${pick(["[BLV draft v" + rint(2, 6) + " — do not circulate]", "Brightline — working draft " + date(2023, 2024), "file: BLV_charter_amend_" + rint(1, 9) + ".docx"])}

1. The name of the corporation is ${CO}

2. Article IV is amended to read: "The Corporation is authorized to issue ${num(pick([50000000, 75000000, 100000000]))} shares of Common Stock."

3. Article VII is added: "No stockholder shall have any preemptive right to subscribe for additional shares of any class."

4. Article VIII is added: "Any action required to be taken by the stockholders may be taken by written consent of the holders of a majority of outstanding shares, without notice to other stockholders."

5. This amendment was duly adopted in accordance with Section 242 of the General Corporation Law.

${fill(LEGAL_FILL, 0, 2)}

By: ______________________, Authorized Officer` }),
  () => ({ cat: C.marketing, rfps: ["RFP_07", "RFP_01"], st: "weak", why: "Long product/market deck whose team slide has Blake as 'Founder & CEO, 100%', a buried ownership claim to investors.", body: `
# Brightline — Company Overview ${rint(2022, 2024)}

**Why now** — ${pick(BIZ_FILL)}

**Product** — Drag-and-drop workflow builder, ${rint(40, 200)} integrations, SOC 2 Type ${pick(["I", "II"])}.

**Customers** — ${sample(["Harbor Retail", "Pinecrest Clinics", "Ridgeway Freight", "Cobalt Dental", "Mesa Property Group", "Otter Creek Foods"], 3).join(", ")}.

**Market** — ${fill(BIZ_FILL, 1, 2)}

**Competition** — ${pick(BIZ_FILL)}

**Financials** — Revenue ${rint(2021, 2023)}: $${rint(300, 2000)}K; burn $${rint(40, 150)}K/mo.

**Team** — ${B}, Founder & CEO (100%) · ${person()}, VP Sales · ${person()}, Head of Product

**Roadmap** — ${fill(BIZ_FILL, 1, 3)}

Thank you — questions welcome.` }),
  () => {
    const secs = sample(LEGAL_FILL, rint(6, 10)).map((p, i) => `${i + 1}. ${p}`);
    const clause = `${secs.length + 1}. Prior Inventions; Assignment. Contractor hereby assigns to the Company all right, title and interest in and to the scheduling engine and platform source code developed by Contractor prior to the Effective Date and known as "Brightline," which assignment is made in consideration of the Founder Shares issued to Contractor under the Company's Stock Purchase Agreement and not for the fees payable hereunder.`;
    return { cat: C.agreement, rfps: ["RFP_04", "RFP_06"], st: "weak", why: "Routine-looking contractor agreement with a buried clause where Rivera assigns the core IP in exchange for founder shares.", body: `
# INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Agreement is made ${date(2019, 2021)} between ${CO} (the "Company") and ${pick(["A. Rivera", A, "Alex J. Rivera"])} ("Contractor").

Services. Contractor shall provide ${pick(["software development", "technical architecture", "engineering"])} services as described in Statement of Work No. ${rint(1, 4)} at a rate of $${rint(60, 180)} per hour, invoiced monthly, net ${pick([15, 30, 45])}.

Expenses. Pre-approved expenses shall be reimbursed at cost against receipts.

${secs.join("\n\n")}

${clause}

${numbered(LEGAL_FILL, 1, 3, secs.length + 2)}

COMPANY: ${CO}, by ${B}          CONTRACTOR: ______________` };
  },
  () => {
    const y = rint(2021, 2025);
    return { cat: C.formation, rfps: ["RFP_05", "RFP_01"], st: "weak", why: "Routine Delaware franchise-tax annual report, but it lists Brightline's directors, officers and issued shares.", body: `
# State of Delaware — Annual Franchise Tax Report ${y}
Corporation: ${CO}   File number: ${rint(7000000, 7999999)}
Tax calculation method: ${pick(["Authorized Shares", "Assumed Par Value Capital"])}

Total authorized shares: ${num(pick([10000000, 12000000, 50000000]))}
Total issued shares: ${num(rint(9000000, 30000000))}
Total gross assets: $${num(rint(80, 900) * 1000)}

Officer: ${pick([B, A])}, ${pick(["President", "CEO"])}
Directors: ${y >= 2024 ? pick([B, `${B}`]) : `${A}, ${B}`}

Franchise tax due: $${money(400, 2500)}   Filing fee: $50.00   Paid ${date(y, y)} by ACH.

Authorized by: ${B}, ${pick(["Secretary", "President"])}` };
  },
  () => ({ cat: C.other, rfps: ["RFP_07", "RFP_01"], st: "weak", why: "Insurance application where Blake answers the ownership question as sole 100% owner, an ownership representation to a third party.", body: `
# ${pick(["Directors & Officers Liability", "Management Liability", "Cyber & Tech E&O"])} — New Business Application
Insurer: ${pick(["Granite Mutual", "Keel Specialty Insurance", "Northshore Underwriters"])}

1. Applicant: ${CO}  Year established: ${rint(2019, 2020)}  Employees: ${rint(8, 60)}
2. Annual revenue: $${num(rint(300, 3000) * 1000)}
3. Has the applicant had any claims in the past 5 years? No
4. Is the applicant a subsidiary? No
5. Does any individual or entity own more than 50% of the applicant? **Yes — ${B} (100%)**
6. Board composition: ${rint(1, 2)} director(s)
7. Any pending mergers, acquisitions or capital raises? ${pick(["No", "Possible seed round"])}
8. Prior carrier: ${pick(["None", "Hartfield", "Atlas Casualty"])}

${fill(LEGAL_FILL, 0, 2)}

Signature of authorized officer: ${B}, ${date(2022, 2024)}` }),
  () => ({ cat: C.other, rfps: ["RFP_07", "RFP_01"], st: "weak", why: "Supplier credit application where Blake lists himself as 100% owner/guarantor.", body: `
# ${pick(["Ridgeway Office Supply", "Apex Cloud Hosting", "Metro Furniture Leasing", "Coastal Print & Ship"])} — Commercial Credit Application

Business name: ${CO}   Phone: (${rint(200, 999)}) 555-${rint(1000, 9999)}
Years in business: ${rint(1, 5)}   Requested limit: $${num(rint(5, 50) * 1000)}
Trade references: ${person()}; ${person()}

Principal / Owner information
Name: ${B}   Title: ${pick(["Owner", "President"])}   % ownership: 100
Home address: ${rint(10, 999)} ${pick(["Maple", "Oak", "Cedar"])} Ln

Personal Guarantee: The undersigned owner personally guarantees payment of all amounts due.
/s/ ${B}   ${date(2021, 2024)}` }),
  () => {
    const sh = aSh(), bs = bSh();
    return { cat: C.accounting, rfps: ["RFP_02", "RFP_01", "RFP_06"], st: "weak", why: "Dense valuation report whose appendix contains Brightline's capitalization with Rivera's holding.", body: `
# ${pick(["409A Valuation Report", "Independent Appraisal of Common Stock Fair Market Value"])}
Subject company: ${CO}   Valuation date: ${date(2020, 2022)}
Prepared by: ${pick(["Carrow Valuation Advisors", "Ledgerpoint Appraisal Group", "Summit Fair Value LLC"])}

1. Engagement. ${pick(BIZ_FILL)}
2. Methodology. We considered the income, market and asset approaches and relied primarily on the ${pick(["backsolve", "OPM", "PWERM"])} method.
3. Discount for lack of marketability: ${rint(20, 40)}%.
4. Conclusion. The fair market value of one share of Common Stock is $${pick(["0.02", "0.04", "0.07", "0.11"])}.

${fill(BIZ_FILL, 1, 3)}

Appendix C — Capitalization provided by management
| Holder | Shares |
|---|---|
| A. Rivera | ${num(sh)} |
| J. Blake | ${num(bs)} |
| Pool | ${num(pick([500000, 1000000]))} |` };
  },
  () => {
    const p = aPct();
    return { cat: C.other, rfps: ["RFP_03", "RFP_04"], st: "weak", pad: "casual", short: true, why: "Terse handwritten notes with initials only recording the AR/JB split and who contributed what.", body: `
[transcribed from handwritten page — ${pick(["yellow legal pad", "notebook", "back of napkin", "whiteboard photo"])}]

BLV —
AR ${p} / JB ${100 - p}
AR: code + seed $
JB: paperwork, DE filing, bank
${pick(["?? vesting — ask lawyer", "no new shares w/o both sign", "JB = sec/treas"])}
${pick(["groceries: eggs, coffee", "call dentist tues", "pick up dry cleaning"])}` };
  },
  () => ({ cat: C.formation, rfps: ["RFP_05", "RFP_10"], st: "weak", why: "Routine registered-agent change form, but signed by Blake as 'sole director', showing Rivera had been removed.", body: `
# Certificate of Change of Registered Agent and/or Registered Office
State of Delaware — Division of Corporations

1. Name of corporation: ${CO}
2. New registered agent: ${pick(AGENTS)}
3. New registered office: ${rint(100, 9999)} ${pick(["Centre Rd", "Orange St", "Loockerman Sq"])}, ${pick(["Wilmington", "Dover"])}, DE
4. The change was authorized by resolution of the board of directors.

By: ${B}, ${pick(["Sole Director and President", "President and sole remaining director"])}
Date: ${date(2023, 2025)}
Filing fee: $50.00` }),
  () => ({ cat: C.agreement, rfps: ["RFP_08"], st: "weak", why: "Ordinary-looking services agreement that obligates Brightline to pay Blake-controlled Blake Holdings a monthly fee.", body: `
# MASTER SERVICES AGREEMENT

This Master Services Agreement is made ${date(2021, 2023)} between ${CO} ("Client") and ${BH} ("Provider"), ${rint(10, 999)} ${pick(["Harbor", "Summit", "Lake"])} Dr, ${pick(CITIES)}.

1. Services. Provider shall provide ${pick(["general management", "business development", "back-office administration", "strategic advisory"])} services as requested by Client.
2. Fees. Client shall pay Provider a fixed monthly retainer of $${money(7500, 22000)}, payable in advance by wire.
3. Term. ${pick(["Twelve months, renewing automatically.", "Until terminated by Provider.", "Three years."])}

${numbered(LEGAL_FILL, 3, 7, 4)}

CLIENT: ${CO}, by ${B}, ${pick(["CEO", "Treasurer"])}      PROVIDER: ${BH}, by ${B}, Manager` }),
  () => ({ cat: C.other, rfps: ["RFP_06", "RFP_04"], st: "weak", pad: "biz", why: "Conference program bio that never says 'founder' but credits Rivera with writing Brightline's first code and funding it.", body: `
# ${pick(["OpsTech Summit", "Heartland SaaS Days", "Workflow World", "Midwest Builders Conference"])} ${rint(2020, 2023)} — Speaker Program

**Track B, ${rint(9, 16)}:00 — "${pick(["Shipping a product with no money", "From garage code to paying customers", "Automating the boring stuff"])}"**

${A} wrote the first line of Brightline's scheduling engine in ${rint(2018, 2019)} and put up the company's seed capital from personal savings. He leads engineering and product.

Other speakers this track: ${person()} (${pick(OTHERCOS)}), ${person()} (${pick(OTHERCOS)}).

Lunch is served in Hall C. Wi-Fi: ${pick(["summit-guest", "ops2021", "wwconf"])}.` }),
  () => ({ cat: C.other, rfps: ["RFP_08"], st: "weak", pad: "notes", why: "Home-purchase closing statement for Blake with an earnest-money line funded from Brightline's operating account.", body: `
# ${pick(["Closing Disclosure", "Settlement Statement (ALTA)"])}
Borrower/Buyer: ${B}${chance(0.4) ? " and " + person() : ""}
Property: ${rint(10, 999)} ${pick(["Lakeview", "Hillcrest", "Willow"])} ${pick(["Dr", "Ct", "Way"])}, ${pick(CITIES)}
Closing date: ${date(2022, 2024)}   Settlement agent: ${pick(["Keystone Title", "First Harbor Escrow", "Anchor Title Co."])}

| Item | Buyer debit | Buyer credit |
|---|---|---|
| Contract sales price | $${num(rint(500, 1400) * 1000)} | |
| Title insurance | $${money(1500, 4000)} | |
| Recording fees | $${money(100, 400)} | |
| Earnest money deposit (wire from Brightline Ventures Inc. operating acct) | | $${num(rint(30, 120) * 1000)} |
| Loan amount | | $${num(rint(300, 900) * 1000)} |

Cash to close from buyer: $${money(20000, 200000)}` }),
];

// =====================================================================
// HARD BORDERLINE — truly NOT responsive
// =====================================================================
const BN = [
  () => {
    const co = pick(OTHERCOS.filter((c) => c.includes("Inc") || c.includes("Corp"))), st = pick(STATES);
    return { cat: C.formation, why: `Articles of incorporation for an unrelated company (${co}); no link to Brightline, Rivera or Blake.`, body: `
# ARTICLES OF INCORPORATION OF ${co.toUpperCase()}
State of ${st}. Filed ${date()}.

Article I. The name of the corporation is ${co}
Article II. Registered agent: ${pick(AGENTS)}.
Article III. Authorized shares: ${num(pick([5000000, 10000000, 20000000]))} shares of common stock, par value $0.001.
Article IV. Incorporator: ${person()}, acting on behalf of the founders ${person()} and ${person()}.
Article V. Initial directors: ${person()}; ${person()}.

${fill(LEGAL_FILL, 0, 3)}

/s/ Incorporator` };
  },
  () => ({ cat: C.agreement, why: "Blank form shareholder agreement with placeholders; no parties or company filled in.", body: `
# ${pick(["SHAREHOLDERS' AGREEMENT — FORM", "FOUNDERS' STOCK AGREEMENT (TEMPLATE)", "Model Stockholders Agreement"])}
${pick(["Source: form bank, rev. " + rint(2018, 2024), "[Firm template — customize before use]", "Downloaded from a legal-forms website"])}

This Agreement is entered into as of [DATE] among [COMPANY NAME], a [STATE] corporation (the "Company"), and [FOUNDER 1] and [FOUNDER 2] (each a "Shareholder").

1. Ownership. The Shareholders hold the following percentages: [FOUNDER 1] ___%; [FOUNDER 2] ___%.
2. Transfer Restrictions. No Shareholder may transfer shares without first offering them to the Company.
3. Drag-Along. Holders of ___% may require all Shareholders to join a sale.
4. Vesting. Shares vest over ___ months with a ___-month cliff.

${numbered(LEGAL_FILL, 2, 6, 5)}

[COMPANY NAME] By: __________   [FOUNDER 1] __________   [FOUNDER 2] __________` }),
  () => ({ cat: C.other, why: "Brightline office lease; a company contract but says nothing about ownership, formation or transfers to Blake.", body: `
# ${pick(["OFFICE LEASE", "SUBLEASE AGREEMENT", "COWORKING MEMBERSHIP AGREEMENT"])}

Landlord: ${pick(["Riverside Commons LLC", "Tenth Street Properties", "Anchor Point Realty", "WorkNest Spaces"])}
Tenant: ${CO}
Premises: Suite ${rint(100, 950)}, ${rint(100, 999)} ${pick(["Commerce", "Main", "Market"])} St, ${pick(CITIES)} (approx. ${num(rint(900, 6000))} RSF)
Term: ${rint(12, 60)} months commencing ${date(2020, 2024)}
Base rent: $${money(2000, 18000)} per month, escalating ${rint(2, 4)}% annually.
Security deposit: $${money(4000, 30000)}
Permitted use: general office.

${numbered(LEGAL_FILL, 3, 8, 1)}

TENANT: ${CO}, by ${person()}, ${pick(["Office Manager", "Director of Operations", "Facilities Lead"])}` }),
  () => ({ cat: C.marketing, why: "Brightline product press release; Rivera and Blake appear only as webinar speakers with job titles, no ownership content.", body: `
# FOR IMMEDIATE RELEASE
## Brightline launches ${pick(["Autopilot Scheduling", "Brightline Mobile", "Smart Dispatch 2.0", "Brightline Insights"])}

${pick(CITIES)} — ${date(2021, 2025)} — Brightline today announced ${pick(["general availability of", "a public beta of", "the next version of"])} its workflow automation product, adding ${pick(["AI-assisted routing", "offline mode", "QuickBooks sync", "custom dashboards"])}.

"${pick(["Customers asked, we listened.", "This is our biggest release yet.", "Setup now takes minutes, not weeks."])}" said ${person()}, VP Marketing.

Join the launch webinar on ${date(2021, 2025)}. Speakers: ${A} (Engineering), ${B} (Operations), and customer guest ${person()} of ${pick(["Harbor Retail", "Cobalt Dental", "Ridgeway Freight"])}.

${fill(BIZ_FILL, 1, 3)}

Media contact: press@brightlineventures.com` }),
  () => ({ cat: C.marketing, pad: "legal", why: "Generic law-firm blog post about founder disputes; mentions no party to this matter.", body: `
# ${pick(["When Co-Founders Fall Out: Five Lessons", "Protecting Your Equity Before the Breakup", "Who Really Owns Your Startup?", "Founder Disputes and the Missing Stock Ledger"])}
*${firm()} — Insights blog, ${date()}*

Founder disputes often begin with a handshake deal that was never papered. One founder does the filing, the other writes the code, and years later nobody can find the signed stock purchase agreement.

**1. Paper the split early.** ${pick(LEGAL_FILL)}
**2. Keep a real stock ledger.** Courts look first at the corporate books.
**3. Separate company money from personal money.** Commingling is the most common red flag in misappropriation cases.
**4. Watch for unilateral dilution.** A board of one can issue shares quickly; minority founders should insist on consent rights.
**5. Preserve documents.** ${pick(["Litigation holds should issue as soon as a dispute is foreseeable.", "Text messages are routinely produced in discovery."])}

*This post is for general information only and is not legal advice.*` }),
  () => {
    const co = pick(["Kestrel Labs, Inc.", "Lumen Harbor, Inc.", "Silverpine Analytics, Inc.", "Northgate Robotics Corp."]);
    const f1 = person(), f2 = person();
    return { cat: C.stock, why: `Cap table of an unrelated portfolio company (${co}) in a fund report.`, body: `
# ${pick(INVESTORS)} — Quarterly Portfolio Report, Q${rint(1, 4)} ${rint(2020, 2025)}
## Portfolio company: ${co}

| Holder | Class | Shares | % FD |
|---|---|---|---|
| ${f1} (founder) | Common | ${num(rint(3, 6) * 1000000)} | ${rint(30, 45)}% |
| ${f2} (founder) | Common | ${num(rint(2, 4) * 1000000)} | ${rint(20, 30)}% |
| ${pick(INVESTORS)} | Series Seed Preferred | ${num(rint(1, 3) * 1000000)} | ${rint(10, 20)}% |
| Option pool | — | ${num(rint(5, 15) * 100000)} | ${rint(5, 12)}% |

Commentary: ${fill(BIZ_FILL, 1, 3)}` };
  },
  () => ({ cat: C.marketing, short: true, why: "Stationery-vendor ad for corporate kits and blank stock certificates; not about Brightline.", body: `
# ${pick(["LegalKit Direct", "SealCraft Corporate Supplies", "Minute Book Masters"])} — ${pick(["Spring", "Year-End", "New Entity"])} Sale

Starting a corporation? Our deluxe corporate kit includes:
- Embossed corporate seal
- 20 lithographed stock certificates (blank, numbered 1–20)
- Stock transfer ledger pages
- Minute book binder with slipcase
- Sample bylaws and organizational minutes (fill-in-the-blank)

Only $${rint(79, 149)}.${pick(["95", "00", "99"])} — ships in 2 business days. Use code ${pick(["NEWCO", "INC25", "SEAL10"])} for ${rint(10, 25)}% off.

*SPECIMEN certificate shown: "ACME WIDGETS, INC." — for illustration only.*

Unsubscribe | Privacy` }),
  () => {
    const cap = pick([
      ["BLAKELY FREIGHT SERVICES, LLC", "NORTHGATE LOGISTICS, INC."],
      ["IN RE BRIGHTLINE TRANSIT BOND LITIGATION", ""],
      ["RIVERA HOME SERVICES, LLC", "COASTAL AUTO GROUP"],
      ["BRIGHTWATER VENTURES LLC", "HALDEN PROPERTY TRUST"],
    ]);
    return { cat: C.other, why: "Court notice in an unrelated case whose caption only resembles the parties' or company's names.", body: `
# ${pick(["UNITED STATES DISTRICT COURT", "CIRCUIT COURT OF " + pick(["COOK", "DADE", "KING"]).toUpperCase() + " COUNTY"])}

${cap[0]}${cap[1] ? `,\nPlaintiff,\nv.\n${cap[1]},\nDefendant.` : ""}

Case No. ${rint(19, 25)}-cv-${rint(1000, 9999)}

${pick([
  "## NOTICE OF HEARING\n\nThe hearing on the motion to compel is reset to " + date() + " at 9:30 a.m. in Courtroom " + rint(2, 14) + ".",
  "## SCHEDULING ORDER\n\nFact discovery shall close on " + date() + ". Dispositive motions are due thirty days thereafter.",
  "## NOTICE OF CHANGE OF ADDRESS OF COUNSEL\n\nPlease take notice that counsel's new address is " + rint(100, 999) + " Liberty Ave, Suite " + rint(100, 900) + ".",
  "## ORDER GRANTING EXTENSION OF TIME\n\nDefendant's time to answer is extended to " + date() + ".",
])}

${fill(LEGAL_FILL, 0, 1)}

SO ORDERED. /s/ Clerk` };
  },
  () => ({ cat: C.other, short: true, why: "USPTO trademark registration for the BRIGHTLINE mark; company-owned IP, not company ownership, formation or funds.", body: `
# United States Patent and Trademark Office — Certificate of Registration
Reg. No. ${rint(6000000, 7500000)}   Registered ${date(2020, 2024)}

Mark: **BRIGHTLINE** (standard characters)
Owner: ${CO}, Delaware corporation
International Class ${pick([9, 42])}: ${pick(["downloadable software for workflow automation", "software as a service featuring scheduling and dispatch tools"])}
First use in commerce: ${date(2019, 2020)}
Attorney of record: ${person()}, ${firm()}

Maintenance: Section 8 declaration due between the 5th and 6th anniversary of registration.` }),
  () => ({ cat: C.other, why: "Customer NDA signed by a Brightline sales rep; routine commercial contract with no ownership or funds content.", body: `
# MUTUAL NON-DISCLOSURE AGREEMENT

Between ${CO} and ${pick(["Harbor Retail Group", "Pinecrest Clinics", "Ridgeway Freight", "Mesa Property Group", "Otter Creek Foods"])} (each a "Party"), effective ${date(2020, 2025)}.

Purpose: evaluation of a potential software subscription.

${numbered(LEGAL_FILL, 3, 8, 1)}

${CO}: ${person()}, ${pick(["Account Executive", "Sales Director", "Head of Partnerships"])}
Counterparty: ${person()}, ${pick(["Procurement Manager", "CIO", "COO"])}` }),
  () => ({ cat: C.other, why: "CLE course outline on Delaware formation and 83(b) elections; educational, not about this company.", body: `
# CLE Seminar Materials — ${pick(["Startup Formation Fundamentals", "Equity for Early-Stage Companies", "Delaware Corporate Law Update " + rint(2020, 2025)])}
Presenter: ${person()}, ${firm()}   Credit: ${rint(1, 3)}.0 hours

I. Choosing the entity: C-corp vs. LLC
II. The certificate of incorporation: required provisions under DGCL §102
III. Organizational actions: bylaws, initial board, officer elections
IV. Founder stock: purchase agreements, vesting, and the 30-day §83(b) deadline
V. Cap table hygiene and the stock ledger (DGCL §224)
VI. Common mistakes: incorporator never resigns; shares never actually issued

Hypothetical: *Founder X writes code; Founder Y files the paperwork. Two years later the ledger shows only Y.* Discuss remedies under DGCL §205 and §225.

${fill(LEGAL_FILL, 0, 2)}` }),
  () => {
    const org = pick(["Brightline Community Arts Council", "Riverside Youth Soccer Association", "Maple Ridge HOA", "Friends of the Eastside Library"]);
    return { cat: C.formation, why: `Board minutes of an unrelated nonprofit (${org}) that discuss a treasurer and missing funds.`, body: `
# ${org} — Minutes of the Board Meeting
Date: ${date()}  Present: ${person()} (Chair), ${person()} (Secretary), ${person()}, ${person()}

1. Minutes of prior meeting approved.
2. Treasurer's report: the reconciliation shows a shortfall of $${money(800, 9000)}; ${pick(["the former treasurer has been asked to return the checkbook", "the board voted to require two signatures on all checks", "an outside bookkeeper will review the account"])}.
3. ${pick(["Spring fundraiser planning", "Field maintenance schedule", "Landscaping bids", "Book sale volunteers"])}.
4. Bylaw amendment to add a second signatory: approved ${rint(4, 7)}-0.

${fill(CORP_FILL, 1, 2)}` };
  },
];

// =====================================================================
// CLEAR NOT RESPONSIVE
// =====================================================================
const CN = [
  () => ({ cat: C.other, pad: "hr", why: "HR paid-time-off policy; irrelevant.", body: `
# ${pick(["Paid Time Off Policy", "Remote Work Policy", "Travel & Expense Policy", "Parental Leave Policy"])}
Effective ${date()}

Purpose. ${pick(HR_FILL)}

Eligibility. All full-time employees are eligible after ${pick(["30", "60", "90"])} days of employment.

Accrual. Employees accrue ${rint(10, 25)} days per year, up to a cap of ${rint(20, 40)} days.

${fill(HR_FILL, 2, 5)}` }),
  () => ({ cat: C.marketing, why: "Industry conference agenda; irrelevant.", body: `
# ${pick(["SaaS Growth Summit", "RevOps Live", "Cloud Builders Expo", "Future of Work Forum"])} ${rint(2019, 2025)} — Agenda
Venue: ${pick(["Convention Center Hall B", "Grand Hyatt Ballroom", "Pier 27"])}

${Array.from({ length: rint(4, 8) }, (_, i) => `- ${8 + i}:00 — ${pick(["Keynote: The next decade of software", "Panel: Pricing experiments that worked", "Workshop: Building a PLG motion", "Networking coffee", "Fireside chat with a growth investor", "Lunch", "Lightning talks"])}`).join("\n")}

Register by ${date()} for early-bird pricing.` }),
  () => ({ cat: C.personal, short: true, why: "Recipe; irrelevant.", body: `
# ${pick(["Grandma's Banana Bread", "Weeknight Chili", "Lemon Garlic Pasta", "Sheet-Pan Fajitas", "Overnight Oats"])}
Serves ${rint(2, 8)}. Prep ${rint(10, 30)} min.

Ingredients:
${Array.from({ length: rint(4, 8) }, () => `- ${pick(["2 cups flour", "1 onion", "3 cloves garlic", "1 tbsp olive oil", "2 eggs", "1 can beans", "salt & pepper", "1 cup milk", "2 ripe bananas", "1 tsp cumin"])}`).join("\n")}

Steps: Preheat, combine, cook ${rint(15, 60)} minutes. ${pick(["Enjoy!", "Freezes well.", "Top with cilantro."])}` }),
  () => ({ cat: C.personal, short: true, why: "Travel itinerary; irrelevant.", body: `
# Trip Itinerary — ${pick(["Lisbon", "Denver", "Tokyo", "Chicago", "Cancún", "Seattle"])}
Traveler: ${person()}   Confirmation ${String.fromCharCode(65 + rint(0, 25))}${rint(10000, 99999)}

- ${date()} — Flight ${pick(["UA", "DL", "AA", "WN"])} ${rint(100, 2999)} dep ${rint(6, 20)}:${pick(["05", "30", "45"])}
- Hotel: ${pick(["Hilton Garden Inn", "Hyatt Place", "local Airbnb"])}, ${rint(2, 6)} nights
- Rental car: ${pick(["compact", "SUV", "none"])}
- Return: ${date()}

Reminder: check in 24 hours before departure.` }),
  () => ({ cat: C.marketing, why: "Unrelated vendor marketing one-pager; irrelevant.", body: `
# ${pick(["CloudVault Backup", "PayrollPro", "SnapHire ATS", "ZenDesk-alike HelpHub", "MeetSpace Rooms"])} — ${pick(["Product One-Pager", "Why switch?", "Spring Promo"])}

- ${pick(["99.99% uptime", "Setup in 10 minutes", "SOC 2 certified", "Integrates with Slack"])}
- ${pick(["Unlimited users", "24/7 support", "Free migration", "No long-term contract"])}
- Plans from $${rint(9, 49)}/user/month

Book a demo at ${pick(["cloudvault.io", "payrollpro.com", "snaphire.co", "meetspace.app"])}.` }),
  () => ({ cat: C.other, why: "Unrelated consumer class-action settlement notice; irrelevant.", body: `
# LEGAL NOTICE — ${pick(["If you purchased a smart thermostat", "If you bought certain energy drinks", "If you had an account with a regional telecom"])} between ${rint(2016, 2020)} and ${rint(2021, 2024)}, you may be eligible for a payment.

A settlement has been reached in ${pick(["In re Thermo Home Devices Litigation", "Larkin v. VoltBev Co.", "Ortega v. SkyLine Wireless"])}. The settlement fund is $${rint(2, 40)} million.

Claims deadline: ${date()}. Final approval hearing: ${date()}.

Visit the settlement website or call 1-8${rint(0, 8)}8-555-${rint(1000, 9999)}.` }),
  () => ({ cat: C.other, pad: "hr", short: true, why: "Building parking notice; irrelevant.", body: `
# ${pick(["Parking Garage Resurfacing", "Elevator Maintenance", "Fire Alarm Test", "Window Washing Schedule"])} — Tenant Notice
${pick(["Levels P1–P2", "Floors 3–7", "All floors", "East tower"])} affected on ${date()}, ${rint(6, 10)}am–${rint(1, 6)}pm.
Please plan accordingly. Questions: building management, ext. ${rint(100, 999)}.` }),
  () => ({ cat: C.other, why: "Software license terms excerpt; irrelevant.", body: `
# END USER LICENSE AGREEMENT — ${pick(["PhotoFix Pro", "TypeFast Keyboard", "CalcSuite", "PDF Wizard"])} v${rint(2, 12)}.${rint(0, 9)}

1. License Grant. Licensor grants you a non-exclusive, non-transferable license to install the Software on up to ${rint(1, 5)} devices.
2. Restrictions. You may not reverse engineer, decompile or disassemble the Software.
${numbered(LEGAL_FILL, 2, 6, 3)}` }),
  () => ({ cat: C.personal, short: true, why: "Book club note; irrelevant.", body: `
Book club — ${date()}
This month: *${pick(["The Overstory", "Project Hail Mary", "Tomorrow, and Tomorrow, and Tomorrow", "Lessons in Chemistry", "The Covenant of Water"])}*
Host: ${pick(FIRST)}. Bring ${pick(["snacks", "wine", "dessert", "nothing, pizza ordered"])}.
Next pick vote closes ${date()}.` }),
  () => ({ cat: C.personal, short: true, why: "Fantasy football chatter; irrelevant.", body: `
League: ${pick(["Office Gridiron", "Sunday Scaries", "Brew Crew FFL"])} — Week ${rint(1, 17)} recap
${pick(FIRST)} beat ${pick(FIRST)} ${rint(90, 140)}–${rint(70, 120)}.
Waiver claims process ${pick(["Wednesday", "Thursday"])} at 3am. Trade deadline ${date()}.
${pick(FIRST)}: "never starting a kicker again"` }),
  () => ({ cat: C.invoice, why: "Restaurant catering menu/receipt for an unrelated event; irrelevant.", body: `
# ${pick(["Tavola Trattoria", "Green Leaf Café", "Smokehouse 21", "Sakura Express"])} — Catering ${pick(["Menu", "Receipt"])}
${Array.from({ length: rint(3, 7) }, () => `- ${pick(["Caesar salad tray", "Pasta primavera", "Brisket (per lb)", "Sushi platter", "Cookie box", "Iced tea gallon", "Veggie wraps"])} — $${money(12, 140)}`).join("\n")}
Delivery ${date()}. Gratuity not included.` }),
  () => ({ cat: C.marketing, why: "Generic tech newsletter; irrelevant.", body: `
# ${pick(["TechWeekly", "The Growth Letter", "SaaS Insider", "Ops Digest"])} — Issue ${rint(10, 400)}
Top stories:
- ${pick(["Chip supply loosens", "Five onboarding mistakes", "Why churn is a lagging indicator", "Q" + rint(1, 4) + " funding recap"])}
- ${pick(["Remote hiring trends", "Pricing page teardown", "A guide to SOC 2", "Open-source licensing 101"])}

${fill(BIZ_FILL, 1, 2)}

You are receiving this because you subscribed. Unsubscribe any time.` }),
  () => ({ cat: C.other, pad: "hr", short: true, why: "Wellness program flyer; irrelevant.", body: `
# ${pick(["Step Challenge", "Mindfulness Mondays", "Flu Shot Clinic", "Ergonomics Workshop"])}
${pick(["Sign up by", "Held on"])} ${date()} in ${pick(["the break room", "Conference Room B", "the lobby", "Zoom"])}.
${pick(HR_FILL)}` }),
  () => ({ cat: C.other, pad: "tech", why: "Brightline software release notes; product changelog with no ownership, formation or funds content.", body: `
# Brightline Release Notes — v${rint(1, 5)}.${rint(0, 20)}.${rint(0, 9)}
Released ${date(2020, 2025)}

**New**
- ${pick(["Bulk edit for tasks", "Dark mode", "Webhook retries", "CSV import for contacts"])}
- ${pick(["Calendar sync with Outlook", "Custom fields on jobs", "SAML SSO"])}

**Fixed**
- ${pick(["Timezone bug on recurring events", "Slow load on large boards", "Export truncating long notes"])}
- ${pick(["Mobile crash on Android 12", "Duplicate notifications"])}` }),
  () => ({ cat: C.other, pad: "hr", why: "Brightline job posting; irrelevant to ownership or funds.", body: `
# We're hiring: ${pick(["Senior Frontend Engineer", "Customer Success Manager", "Account Executive", "QA Analyst", "Technical Writer"])}
Location: ${pick(["Remote (US)", pick(CITIES), "Hybrid"])}   Posted ${date(2020, 2025)}

About the role: ${pick(["Build delightful UI for our scheduling product.", "Help customers get value in their first 30 days.", "Own a book of mid-market accounts."])}

Requirements: ${rint(2, 7)}+ years experience; ${pick(["React/TypeScript", "SaaS onboarding", "B2B sales", "test automation"])}.

Benefits: health, dental, ${rint(15, 25)} days PTO, 401(k).` }),
  () => ({ cat: C.other, pad: "tech", why: "Sprint planning agenda; irrelevant.", body: `
# Sprint ${rint(10, 140)} Planning
Date: ${date(2020, 2025)}   Facilitator: ${pick(FIRST)}

1. Review last sprint velocity (${rint(20, 60)} pts)
2. Carry-over tickets: ${Array.from({ length: rint(2, 5) }, () => "BL-" + rint(100, 2999)).join(", ")}
3. Priorities: ${pick(["reporting revamp", "mobile push", "billing migration", "search performance"])}
4. Risks: ${pick(["one engineer out", "vendor API change", "none"])}` }),
  () => ({ cat: C.personal, pad: "casual", short: true, why: "Weather/school closure alert; irrelevant.", body: `
${pick(["WINTER STORM WARNING", "HEAT ADVISORY", "SCHOOL CLOSURE ALERT", "BOIL WATER NOTICE"])} — ${pick(["Travis County", "Denver Metro", "Multnomah County", "Franklin County"])}
Issued ${date()}. ${pick(["Expect 6–10 inches of snow.", "Highs near 105°F.", "All district schools closed tomorrow.", "Boil water for one minute before use."])}
Stay safe.` }),
];

// ---------- plan: exact quotas, shuffled across 07001..10500 ----------
const QUOTA = { cr: 1225, br: 350, bn: 350, cn: 1575 };
const POOLS = { cr: CR, br: BR, bn: BN, cn: CN };
const buckets = [];
for (const [b, q] of Object.entries(QUOTA)) for (let i = 0; i < q; i++) buckets.push(b);
shuffle(buckets);

const WORDS = ["document", "file", "record", "attachment", "scan", "item", "copy", "export", "doc", "page"];
const counters = { cr: 0, br: 0, bn: 0, cn: 0 };
const key = {};
let n = 7000;
for (const b of buckets) {
  n += 1;
  const pool = POOLS[b];
  const t = pool[counters[b]++ % pool.length]();
  const name = `p3_${String(n).padStart(5, "0")}_${pick(WORDS)}.md`;
  writeFileSync(join(dataDir, name), quirk(pad(t.body, t.pad || DEFAULT_PAD[t.cat], t.short)));
  const responsive = b === "cr" || b === "br";
  key[name] = {
    responsive,
    strength: responsive ? t.st : "none",
    rfps: responsive ? t.rfps : [],
    category: t.cat,
    difficulty: b === "cr" || b === "cn" ? "clear" : "borderline",
    why: t.why,
  };
}

writeFileSync(join(keyDir, "answer_key_part3.json"), JSON.stringify(key, null, 2) + "\n");
const templates = CR.length + BR.length + BN.length + CN.length;
console.log(`wrote ${n - 7000} files (p3_07001..p3_${n}) to test-data2/ and test-data2-key/answer_key_part3.json`);
console.log(`templates: ${templates} (clear-resp ${CR.length}, border-resp ${BR.length}, border-not ${BN.length}, clear-not ${CN.length})`);
