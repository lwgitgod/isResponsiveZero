// Generates 150 synthetic .md evidence files for Rivera v. Blake (Brightline Ventures, Inc.)
// into test-data/, and the answer key into test-data-key/answer_key.json (kept out of the
// classified folder). Deterministic: re-running produces the same files.
// Usage: node scripts/gen-test-data.mjs

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "test-data");
const keyDir = join(root, "test-data-key");
mkdirSync(dataDir, { recursive: true });
mkdirSync(keyDir, { recursive: true });
for (const f of readdirSync(dataDir)) if (f.endsWith(".md")) rmSync(join(dataDir, f));

let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const money = (lo, hi) => (Math.round((lo + rand() * (hi - lo)) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
const date = (y = 2023) => `${y}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`;

const CO = "Brightline Ventures, Inc.";
const A = "Alex Rivera";
const B = "Jordan Blake";
const BH = "Blake Holdings LLC";
const friends = ["Sam", "Priya", "Marco", "Dana", "Lee", "Chris", "Nina", "Omar"];

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

const key = {};
let n = 0;
function emit(slug, strength, responsive, rfps, category, body) {
  n += 1;
  const name = `${String(n).padStart(3, "0")}_${slug}.md`;
  writeFileSync(join(dataDir, name), body.trim() + "\n");
  key[name] = { responsive, strength, rfps, category };
}

// ---------- STRONG responsive (30) ----------
const strong = [
  () => emit("stock_ledger", "strong", true, ["RFP_01", "RFP_02", "RFP_06"], C.stock, `
# ${CO} — Stock Ledger
| Cert # | Holder | Class | Shares | Date issued | Consideration |
|---|---|---|---|---|---|
| CS-1 | ${A} | Common | ${pick([6000000, 7000000, 6500000])} | ${date(2021)} | IP assignment + $${money(40000, 60000)} cash |
| CS-2 | ${B} | Common | ${pick([3000000, 3500000, 4000000])} | ${date(2021)} | Services (incorporation) |
Prepared by corporate secretary. Total authorized: 10,000,000 common.`),
  () => emit("articles_of_incorporation", "strong", true, ["RFP_05", "RFP_01"], C.formation, `
# ARTICLES OF INCORPORATION OF ${CO.toUpperCase()}
State of Delaware. Filed ${date(2021)}.
Article I. The name of the corporation is ${CO}
Article IV. The corporation is authorized to issue 10,000,000 shares of common stock, par value $0.0001.
Article VI. Incorporator: ${B}, acting on behalf of the founder ${A}.
/s/ ${B}, Incorporator`),
  () => emit("bank_statement_transfers", "strong", true, ["RFP_09", "RFP_08"], C.bank, `
# First Coastal Bank — Business Checking Statement
Account holder: ${CO}   Account ****${4000 + Math.floor(rand() * 999)}
Period: ${date(2023)} to ${date(2023)}
| Date | Description | Debit | Credit |
|---|---|---|---|
| ${date(2023)} | Customer payment — Harbor Retail | | $${money(10000, 50000)} |
| ${date(2023)} | WIRE OUT to ${BH} | $${money(15000, 60000)} | |
| ${date(2023)} | Online transfer to J. BLAKE personal ****2291 | $${money(5000, 25000)} | |
| ${date(2023)} | ATM withdrawal — ${B} card | $${money(500, 3000)} | |
Ending balance: $${money(1000, 20000)}`),
  () => emit("board_minutes", "strong", true, ["RFP_05", "RFP_01", "RFP_06"], C.formation, `
# Minutes of the Organizational Meeting of the Board of Directors — ${CO}
Date: ${date(2021)}. Present: ${A} (Director, founder), ${B} (Director, incorporator).
RESOLVED, that ${pick([6000000, 7000000])} shares of common stock be issued to ${A} as founder in exchange for assignment of the Brightline software IP.
RESOLVED, that ${B} is appointed Secretary and Treasurer with signing authority on company bank accounts.
Adopted unanimously.`),
  () => emit("wire_confirmation", "strong", true, ["RFP_08", "RFP_09"], C.bank, `
# Wire Transfer Confirmation
Originator: ${CO} (acct ****4417)
Beneficiary: ${BH}, Beneficiary bank: Summit Trust
Amount: $${money(20000, 90000)}   Value date: ${date(2023)}
Memo: "consulting — Q${1 + Math.floor(rand() * 4)}"   Authorized by: ${B}`),
  () => emit("general_ledger", "strong", true, ["RFP_09", "RFP_08"], C.accounting, `
# ${CO} General Ledger — Account 6400 "Consulting Fees"
| Date | Vendor | Amount | Approved by |
|---|---|---|---|
| ${date(2023)} | ${BH} | $${money(10000, 40000)} | ${B} |
| ${date(2023)} | ${BH} | $${money(10000, 40000)} | ${B} |
| ${date(2023)} | ${BH} | $${money(10000, 40000)} | ${B} |
No invoices on file for these entries.`),
  () => emit("founder_agreement", "strong", true, ["RFP_03", "RFP_01", "RFP_06", "RFP_04"], C.agreement, `
# Founders' Agreement — ${CO}
This agreement is made ${date(2021)} between ${A} ("Founder") and ${B} ("Co-Founder").
1. Ownership. Founder shall hold ${pick([60, 65, 70])}% and Co-Founder shall hold the remainder of the issued common stock.
2. Contributions. Founder contributes the Brightline platform source code and $${money(40000, 80000)} cash. Co-Founder contributes incorporation and administrative services.
3. ${B} shall incorporate the company on Founder's behalf.
Signed: ${A}, ${B}`),
  () => emit("subscription_agreement", "strong", true, ["RFP_02", "RFP_04", "RFP_06"], C.agreement, `
# Common Stock Subscription Agreement
Company: ${CO}. Subscriber: ${A}.
Subscriber agrees to purchase ${pick([6000000, 7000000])} shares of Common Stock for aggregate consideration of $${money(500, 1000)} plus assignment of intellectual property described in Exhibit A.
Accepted by the Company: ${B}, Secretary. Date ${date(2021)}.`),
  () => emit("cap_table", "strong", true, ["RFP_02", "RFP_01"], C.stock, `
# ${CO} Capitalization Table (as of ${date(2022)})
| Holder | Shares | % Fully diluted |
|---|---|---|
| ${A} | 6,500,000 | 65.0% |
| ${B} | 3,000,000 | 30.0% |
| Option pool | 500,000 | 5.0% |`),
  () => emit("bylaws", "strong", true, ["RFP_05"], C.formation, `
# BYLAWS OF ${CO.toUpperCase()}
Article II — Shareholders. Annual meeting to be held each ${pick(["March", "June", "October"])}.
Article III — Directors. The Board shall consist of two directors.
Article V — Officers. The Treasurer shall have custody of corporate funds and keep full accounts of receipts and disbursements.
Adopted ${date(2021)}.`),
];

// ---------- MEDIUM responsive (30) ----------
const medium = [
  () => emit("email_ownership_split", "medium", true, ["RFP_03", "RFP_06"], C.email, `
From: ${A}
To: ${B}
Date: ${date(2022)}
Subject: re: our split

Jordan — just confirming what we agreed on the call: I keep ${pick([60, 65, 70])}% since it's my code and my seed money, you get the rest for handling the incorporation paperwork. Can you make sure the ledger reflects that?
— Alex`),
  () => emit("email_blake_to_investor", "medium", true, ["RFP_07", "RFP_01"], C.email, `
From: ${B}
To: ${pick(["m.chen@northgatecap.com", "investors@harborangels.com", "k.patel@seedfund.io"])}
Date: ${date(2023)}
Subject: Brightline — ownership overview

Happy to share: I founded Brightline and currently hold ${pick([90, 100, 95])}% of the equity. There are no other significant shareholders. Deck attached.
Jordan Blake, CEO`),
  () => emit("email_seed_contribution", "medium", true, ["RFP_04", "RFP_06"], C.email, `
From: ${A}
To: ${B}
Date: ${date(2021)}
Subject: seed money sent

Wired $${money(30000, 70000)} into the Brightline account this morning for my founder shares, plus I pushed the full repo to the company GitHub. Let me know once the certificate is issued.`),
  () => emit("email_dispute", "medium", true, ["RFP_10", "RFP_03"], C.email, `
From: ${A}
To: ${B}
Date: ${date(2024)}
Subject: You removed me from the cap table?

I just saw the new cap table you sent the bank. My shares are gone. We had an agreement. I never signed any transfer or cancellation. Explain this or I'm calling a lawyer.`),
  () => emit("dilution_notice", "medium", true, ["RFP_10", "RFP_02"], C.formation, `
# Written Consent of the Sole Director — ${CO}
Date: ${date(2024)}
The undersigned, ${B}, being the sole director, hereby authorizes issuance of ${pick([20000000, 15000000])} additional shares of common stock to ${BH}, and cancels certificate CS-1 held by ${A} for "failure to pay consideration."
/s/ ${B}`),
  () => emit("text_messages_percentages", "medium", true, ["RFP_03"], C.email, `
Text messages exported ${date(2022)}
Alex: so we're good on 65/35 right?
Jordan: yeah 65/35 like we said. I'll get the lawyer to paper it
Alex: 👍 you're incorporating it for me, I'm traveling`),
  () => emit("bank_loan_application", "medium", true, ["RFP_07", "RFP_01"], C.other, `
# Small Business Loan Application — Summit Trust
Applicant business: ${CO}
Owners (20% or more): ${B} — ${pick([100, 95])}%
Signed and certified true by: ${B}, ${date(2023)}`),
  () => emit("email_expense_questions", "medium", true, ["RFP_08", "RFP_09"], C.email, `
From: ${pick(["bookkeeper@ledgerlyhq.com", "accounts@brightlineventures.com"])}
To: ${B}
Date: ${date(2023)}
Subject: unexplained transfers

Hi Jordan, I'm reconciling the books and see ${pick([4, 6, 7])} transfers totaling $${money(40000, 120000)} to Blake Holdings LLC with no invoices. Can you send support so I can code them?`),
  () => emit("linkedin_cofounder", "medium", true, ["RFP_06"], C.marketing, `
Brightline Ventures press blurb (${date(2022)}):
"Brightline was co-founded by ${A}, who built the platform, and ${B}, who leads operations."`),
  () => emit("demand_letter", "medium", true, ["RFP_10", "RFP_01", "RFP_08"], C.other, `
# Letter from counsel for ${A}
Date: ${date(2024)}
Dear Mr. Blake: Our client ${A} is the majority owner of ${CO}. We demand that you restore our client's shares and account for all company funds you transferred to yourself and to ${BH}.`),
];

// ---------- WEAK / borderline responsive (20) ----------
const weak = [
  () => emit("calendar_note", "weak", true, ["RFP_03"], C.other, `
Calendar — ${date(2022)} 12:30 Lunch w/ Jordan @ Tavola. Agenda: finalize the share split, parking.`),
  () => emit("chat_car", "weak", true, ["RFP_08"], C.personal, `
Chat log ${date(2023)}
${pick(friends)}: nice car jordan!!
Jordan: thx, company's paying for it lol, don't tell alex`),
  () => emit("expense_report", "weak", true, ["RFP_08", "RFP_09"], C.accounting, `
# Expense report — ${B} — ${date(2023)}
| Item | Amount | Category |
|---|---|---|
| Resort weekend | $${money(2000, 6000)} | "Client development" |
| Watch — Rolex | $${money(8000, 15000)} | "Office supplies" |
Paid from ${CO} corporate card.`),
  () => emit("email_passing_founder", "weak", true, ["RFP_06"], C.email, `
From: ${pick(friends).toLowerCase()}@gmail.com
To: ${A}
Date: ${date(2022)}
Subject: congrats!

Saw you at the demo day — congrats on founding Brightline! Let's grab coffee soon.`),
  () => emit("accountant_voicemail", "weak", true, ["RFP_09"], C.other, `
Voicemail transcript ${date(2023)}: "Hi, it's the accountant for Brightline, I still need the ${pick(["March", "May", "August"])} bank statements to finish the books. Thanks."`),
];

// ---------- IRRELEVANT (70) ----------
const irrelevant = [
  () => emit("newsletter", "none", false, [], C.marketing, `
# ${pick(["TechWeekly", "The Growth Letter", "SaaS Insider", "Founder Digest"])} — Issue ${Math.floor(rand() * 300)}
Top stories: ${pick(["AI chips shortage", "5 tips for remote teams", "Why churn matters", "Q3 VC funding recap"])}. Unsubscribe any time.`),
  () => emit("lunch_order", "none", false, [], C.personal, `
Lunch order for ${date(2023)}: ${pick(["2 turkey clubs, 1 veggie wrap", "pizza — 3 large pepperoni", "sushi platter for 8", "tacos x 12"])}. Delivery at noon. Please Venmo ${pick(friends)}.`),
  () => emit("vendor_spam", "none", false, [], C.marketing, `
Subject: ${pick(["Boost your SEO 300%!", "Limited offer: ergonomic chairs", "Your domain is expiring", "Free cloud credits inside"])}
Dear Business Owner, act now to claim your exclusive discount. Reply STOP to opt out.`),
  () => emit("chitchat", "none", false, [], C.personal, `
${pick(friends)}: are you coming to the game ${pick(["Friday", "Saturday", "Sunday"])}?
${pick(friends)}: yes! bringing snacks. also did you see the new ${pick(["Marvel movie", "season finale", "trailer"])}?`),
  () => emit("hvac_maintenance", "none", false, [], C.other, `
# Building Maintenance Notice
HVAC filters on floor ${1 + Math.floor(rand() * 9)} will be replaced on ${date(2023)}. Expect brief noise between 9am and 11am.`),
  () => emit("other_company_bank", "none", false, [], C.bank, `
# Maple Street Bakery LLC — Monthly Statement
Period ending ${date(2023)}. Deposits: $${money(5000, 20000)}. Flour supplier payment: $${money(500, 3000)}. Ending balance $${money(2000, 9000)}.`),
  () => emit("holiday_party", "none", false, [], C.other, `
# Holiday Party Planning
Venue: ${pick(["rooftop lounge", "bowling alley", "Italian restaurant"])}. Date ${date(2023)}. Secret Santa limit $25. RSVP to HR.`),
  () => emit("it_password_reset", "none", false, [], C.email, `
From: it-helpdesk@${pick(["acmecorp.com", "globex.com", "initech.com"])}
Subject: Password expiry
Your password expires in ${1 + Math.floor(rand() * 9)} days. Please reset it via the portal.`),
  () => emit("gym_receipt", "none", false, [], C.invoice, `
Receipt — ${pick(["FitLife Gym", "Peak Yoga", "CrossBox"])} monthly membership $${money(30, 120)} charged ${date(2023)}. Thank you!`),
  () => emit("recipe_share", "none", false, [], C.personal, `
${pick(friends)} shared a recipe: ${pick(["banana bread", "chili", "pad thai", "lasagna"])}. Preheat oven, mix ingredients, bake 45 minutes.`),
];

// 3 rounds of strong (30), 3 of medium (30), 4 of weak (20), 7 of irrelevant (70) = 150
const plan = [
  ...Array(3).fill(strong).flat(),
  ...Array(3).fill(medium).flat(),
  ...Array(4).fill(weak).flat(),
  ...Array(7).fill(irrelevant).flat(),
];
for (const fn of plan) fn();

writeFileSync(join(keyDir, "answer_key.json"), JSON.stringify(key, null, 2) + "\n");
const resp = Object.values(key).filter((v) => v.responsive).length;
console.log(`wrote ${n} files to test-data/ (${resp} responsive, ${n - resp} not) and test-data-key/answer_key.json`);
