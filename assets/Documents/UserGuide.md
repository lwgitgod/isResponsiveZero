# LegaWrite.AI User Guide

*For attorneys using the LegaWrite.AI platform.*

This guide covers every page and control an attorney can reach in the product: account setup, the Dashboard, the Matters list, an individual Matter workspace, the AI drafting workflows (Demand Letter, Complaint Drafter, Demurrer, Discovery Framework, Deep Research), the Jobs Log, Settings, and Subscription/Billing. It is organized to match the site's own navigation, so you can read it start-to-finish as a getting-started walkthrough, or jump to a section as reference when you need to understand one specific feature.

Internal/staff-only screens (such as the prompt-engineering console) are not included — this guide covers only what an attorney using the product will encounter.

---

## Table of Contents

1. [Getting Started: Account Setup](#1-getting-started-account-setup)
2. [Subscription & Billing](#2-subscription--billing)
3. [The Dashboard](#3-the-dashboard)
4. [The Matters List](#4-the-matters-list)
5. [The Matter Workspace](#5-the-matter-workspace)
6. [Legal Drafting Workflows](#6-legal-drafting-workflows)
   - 6.1 [Demand Letter](#61-demand-letter)
   - 6.2 [Complaint Drafter](#62-complaint-drafter)
   - 6.3 [Demurrer](#63-demurrer)
   - 6.4 [Discovery Framework](#64-discovery-framework)
   - 6.5 [Deep Research](#65-deep-research)
7. [Jobs Log](#7-jobs-log)
8. [Settings](#8-settings)
   - 8.1 [My Account](#81-my-account)
   - 8.2 [Document Templates](#82-document-templates)
9. [Concepts and Terms Used Throughout the App](#9-concepts-and-terms-used-throughout-the-app)
10. [Known Gaps and Placeholders](#10-known-gaps-and-placeholders)

---

## 1. Getting Started: Account Setup

New attorneys move through four screens in order the first time they use LegaWrite.AI: **Register → verify your email → Log in → Company setup**, after which you land on the Dashboard. Every page in the product beyond `/auth` and `/subscription` requires you to have completed this sequence and to have an active trial or subscription (see [Section 2](#2-subscription--billing)).

### 1.1 Register

**Page:** `/auth/register` — "Create your account"

Fields:
- **Full name**
- **Bar number**
- **Email address**
- **Password** — as you type, a checklist appears titled "Your password must include:" and checks off each requirement live: at least 8 characters, one uppercase letter, one lowercase letter, one number, one special character.
- **Confirm password** — must match exactly, or the field shows "The passwords do not match!"

Click **Register** to submit. A link at the bottom, **"Log in today,"** returns you to the login page if you already have an account.

After registering, LegaWrite.AI emails you a verification link.

### 1.2 Verify your email

Clicking the link in your verification email takes you to `/auth/validate`. There are no buttons here — the page reads a token from the link and validates it automatically, then sends you to the Login page. If the link is broken or expired you'll see "Validation Error! Please try again later." and should request a new one or contact support.

### 1.3 Log in

**Page:** `/auth/login` — "Log in your account"

Fields: **Email address**, **Password**. Click **Log In** to submit.

> **Note:** the **"Forgot Password"** link on this screen is currently disabled and does not work. If you're locked out of your account, contact support rather than using this link.

If you don't have an account yet, use the **"Sign Up today"** link to go to Register.

After logging in for the first time, you're taken to Company Setup. On subsequent logins, if you were sent to the login page from somewhere specific (for example, from a subscription checkout), you're returned to that page instead of Company Setup.

### 1.4 Company setup

**Page:** `/auth/company` — "Tell us about your company"

This is a one-time firm profile, captured once and used to help tailor drafting (for example, jurisdiction affects which court captions and statute references get pulled into generated documents). Fields:

- **Area of Practice** — dropdown: Employment Law (default), Long Term Care Defense, Personal Injury, Medical Malpractice.
- **Usually you Represent** — dropdown: Plaintiff (default) or Defense. This is a firm-level default only — it does not tag individual matters or cases anywhere else in the product.
- **Jurisdiction** — dropdown of U.S. states (New York is the default) at the time of writing we're only available in NY. These states will become available in few weeks in this order CA, MO, IL,TX, MA and then rest of the states .

Click **Complete Firm Setup** to finish and be taken to the Dashboard.

---

## 2. Subscription & Billing

**Page:** `/subscription`

LegaWrite.AI requires an active subscription (or trial) to use anything beyond Login/Register/Subscription itself. If you're logged in without an active subscription, the app automatically redirects you here whenever you try to open any other page, briefly showing "Subscription required. Redirecting…"

### 2.1 If you don't have an active subscription

You'll see:
- **"Start Your Legawrite AI Trial"** heading, with pricing: **$350/month** for the full professional subscription.
- A highlighted offer: **"90-Day Trial for Just $1,"** with the terms "Try everything for 90 days. Then continue at $350/month." Trial access includes: AI-powered demand letter generation, demurrer analysis and response, deep legal research, document template management, and automated fact extraction.
- A **"Start 90-Day Trial for $1"** button. Clicking it takes you to Stripe's secure payment page. Text below the button explains: after the trial period, billing continues automatically at $350/month, and you can cancel anytime.
- Contact info at the bottom: **support@legawrite.com**.

If you click Start Trial without being logged in, you're sent to log in or register first, then automatically returned here to finish checkout.

After a successful payment, Stripe returns you to a **"Welcome to Legawrite AI!"** confirmation screen, which briefly shows "Finishing activation…" while your subscription status syncs, then automatically takes you to the Dashboard. (If activation is unusually slow, a **"Continue to Dashboard"** button appears after about a minute so you're never stuck waiting.)

If you back out of the Stripe payment screen without completing checkout, you land on a **"Checkout Cancelled"** page confirming no charge was made, with a button to return to the subscription page and try again.

### 2.2 If you already have an active subscription

The page instead shows **"Your Subscription"** with a confirmation that you have active access, and a **"Cancel Subscription"** button.

Clicking Cancel Subscription asks you to confirm: *"Are you sure you want to cancel your subscription? You will lose access at the end of the billing period."*

> **Important:** cancelling does **not** end your access immediately. Your subscription remains active through the end of your current billing period, and only stops renewing after that. You can see your subscription's current status (Trial Active, Active, Past Due, or Cancelled) and, during a trial, your trial end date, from the **My Account** settings page — see [Section 8.1](#81-my-account) — which also has its own Cancel Subscription control with the same behavior.

---

## 3. The Dashboard

**Page:** `/dashboard`

The Dashboard is your home page and the fastest way to start new work. It's a simple launch screen with two main actions, plus status banners for anything running in the background.

### What's on the page

- **"Deep Research"** button — takes you straight into the Deep Research tool (see [Section 6.5](#65-deep-research)).
- **"Workflows"** button — opens a popup with three ways to start drafting work:
  - **Demurrer** — opens an upload dialog titled "Upload Document to Start Demurrer." Upload the complaint you're responding to and click through; this immediately starts an AI analysis job in the background and shows a confirmation toast telling you to track its progress from the notification tray (the bell icon in the navigation bar). You are not taken to a new screen — you can keep working while it processes.
  - **Demand Letter** and **Complaint Drafter** — both open a "Create Matter" dialog, since a demand letter or complaint always needs a matter to belong to. Fill in the matter details and click Create; you're taken straight to that new matter's workspace, where you'll upload documents and launch the actual drafting workflow from the Production Line panel (see [Section 5](#5-the-matter-workspace)).

### Guided tour

The first time you visit the Dashboard, an on-screen walkthrough highlights the main controls. If you want to see it again later, use the **"Site Guide"** option in the navigation bar — it relaunches the same tour even if you've already completed or skipped it before.

### Status banners

If a demurrer analysis is running, a banner reads "Preparing your demurrer… this can take a few minutes. You can keep working; it'll open automatically when it's ready." You're free to navigate elsewhere; the system tracks the job and will surface it in the notification tray and Jobs Log regardless of what page you're on.

---

## 4. The Matters List

**Page:** `/matters`

A **matter** is the container for a single case or client engagement — everything else (documents, extracted facts, and drafting workflows) lives inside a matter. This page is the searchable index of every matter your firm has created.

### Header

- Title **"Matters"** with a live count (e.g. "12 matters," or "3 of 12 matching" when a filter is active).
- **Search box** — filters matters as you type by title, client, opposing party, or case number. A small **✕** button clears the search once you've typed something.
- **Sort control** — a dropdown showing the current sort (e.g. "Recently Updated") with four choices: Recently/Least Recently Updated, Recently/Least Recently Created, Case Name A–Z/Z–A, and Client A–Z/Z–A. Clicking the currently-selected option again reverses its direction. (Two more sort options — by Court and by Activity — are reachable only by clicking those column headers in List view, described below.)
- **Grid / List toggle** — switches between card view and a compact table view. Your choice is remembered.
- **"New Matter"** button — opens the matter creation dialog described in [Section 5](#5-the-matter-workspace).

### Filtering by activity

Once your firm has more than 10 matters, a row of filter pills appears: **All**, **Active**, **Not started**, **Completed** — each showing a count. This row is hidden below 11 matters to avoid clutter.

### Grid view

Each matter is shown as a card: an activity status chip, a trash-icon delete button, the matter name, the parties involved, court/case number (if known), judge (if known), an **"Open →"** link, and when it was last updated. Clicking anywhere on the card (other than the delete icon) opens the matter.

### List view

A compact table with sortable column headers: **Matter**, **Parties**, **Court** (hidden on narrow screens), **Activity**, and **Updated**. Click any header to sort by it; click the same header again to reverse the order. Each row opens the matter when clicked, and has its own delete icon.

### Deleting a matter

Click the trash icon on any card or row. A confirmation dialog appears warning that the matter's name — **and everything filed under it: documents, extracted facts, and drafting workflows** — will be permanently removed and cannot be undone. To confirm, you must type the word **"delete"** into a field before the **Delete matter** button becomes active. Click **Cancel** to back out instead.

### Empty and no-results states

- If your firm has no matters at all, you'll see "No matters yet" with a **New Matter** button to get started.
- If a search or filter matches nothing, you'll see a message explaining what the search covers, with a **Clear search** (or **Show all**, for facet filters) button to reset.
- If matters fail to load due to a connection problem, you'll see "Couldn't load your matters" with reassurance that your data is safe (it's a display issue only) and a **Try again** button.

### Pagination

Matters are shown 24 per page. Numbered page buttons plus **‹ Prev / Next ›** appear once you have more than one page.

---

## 5. The Matter Workspace

**Page:** `/matter?id=<matter id>`

This is where you manage a single case: its documents, extracted facts and claims, and the drafting workflows available for it. It's organized as one header strip plus four panels.

### 5.1 Header

- **"← All matters"** link returns you to the Matters list.
- The matter name, followed by your dedicated **document ingestion email address** — you can email documents directly to this address to add them to the matter. Two controls sit next to it:
  - **Copy** — copies the address to your clipboard (confirms with "Copied" for two seconds).
  - **Regenerate** — replaces the address with a brand-new one. You'll be warned that **the old address stops working immediately and cannot be restored**, so only regenerate if you believe the current address has been compromised or you no longer want mail arriving from it.
- A meta line shows court, judge, venue, and a phase chip (e.g. "In Discovery"), whichever of these are known for the matter.
- Three action buttons, always available from the header:
  - **⊞ Fact Ledger** — opens a read-only list of every fact extracted from this matter's documents so far.
  - **⚖ Claims** — opens a read-only list of the causes of action identified for this matter. What's shown depends on whether the matter has a complaint document: with a complaint, you'll see the formal name and demurrer grounds for each claim; without one, you'll see the formal name and whether it's been validated.
  - **Edit** (pencil icon) — opens the same Create/Edit Matter form used when creating a matter, pre-filled with the current details, so you can update name, parties, court, venue, judge, or other matter metadata.
- If the matter has a tracked deadline, it's shown here as well.
- A **trash icon** deletes the entire matter, with the same "type to confirm" pattern and permanent-deletion warning described in [Section 4](#4-the-matters-list).

### 5.2 Inputs panel — Documents

This is where you manage every document filed under the matter (uploaded manually or received via the ingestion email address).

- **Search** box filters the document list by filename.
- **Upload** button opens a dialog: choose a document type from the dropdown, then drop or select a file.
- A row of **type filter pills** (e.g. "All," "Complaint," "Intake") appears once the matter has at least one document, each showing a count.
- The document table shows Name, Type (as a colored chip), Size, and Upload date. Each row has a **⋯ (Document actions)** menu:
  - **Preview** — opens the file in a viewer (only available for supported file types; otherwise it's disabled with an explanation of why).
  - **Delete** — removes the document from the matter.
- Once you have more than 25 documents, pagination controls appear ("Showing X–Y of Z").

> **Important — matter locking:** while a drafting workflow is actively running for this matter, the Inputs panel shows a lock banner: *"This matter is locked while a workflow is running. Edits, uploads, and deletes are disabled until it finishes."* Upload and Delete are disabled during this time. Wait for the workflow to finish (you can track its progress from the [Jobs Log](#7-jobs-log)) before making document changes.

### 5.3 Extracted panel — Matter state

Summarizes what the AI has extracted from the matter's documents so far:

- A **Causes of action** count tile.
- A **Facts** tile, showing when facts were last extracted — clicking it opens the same Fact Ledger described above.
- **Case theory** — a short AI-generated summary of the case's legal theory, generated once a complaint has been uploaded. Before that, it shows a placeholder: "Upload a complaint to generate the theory."
- An **AI Insight** card, when the system has generated one — additional case-specific analysis worth your attention. Not every matter will have one.
- A **"Review →"** link is present but currently leads to a page that isn't built yet ("coming soon") — see [Section 10](#10-known-gaps-and-placeholders).

### 5.4 Production Line panel — Curated drafters

This is the control center for starting and tracking every AI drafting workflow available for the matter: Demand Letter, Complaint Drafter, Demurrer, and Discovery Framework (plus, depending on your matter's document state, Complaint Checker). It's organized into four groups:

- **In progress** — workflows currently running or partially complete. Each shows its current stage, when it was last edited, a progress bar, and a **Resume →** link to jump back in.
- **Available now** — workflows you can start immediately, each with a **Start →** button. Once clicked, the button disables and shows "Starting…" while the workflow is created, to prevent accidentally starting it twice. If a workflow of that type has already been completed once before, you'll see **Revisit →** instead, which opens the existing finished document rather than starting a new one.
- **Locked · show reasons** — a collapsible section listing workflows you can't start yet, and exactly why — e.g. "Upload an intake document to enable," "Upload a complaint to enable," "Requires completed Demand Letter," or "Already has a demurrer workflow." A few workflow types (Extract Facts, Opposition, Answer Complaint, Motion to Compel, Summary Judgment) are placeholders for future functionality and are always shown as "Not yet available."
- **Filed** — workflows that have produced a final, filed document. Each has an **Open →** link to review it.

**What unlocks what, in practice:**
- Uploading an **Intake** document unlocks the **Demand Letter** workflow.
- Uploading a **Complaint** document unlocks **Demurrer**, **Discovery Framework**, and **Complaint Checker**.
- Completing a **Demand Letter** unlocks **Complaint Drafter** (so does having an intake document with no demand letter at all — either path works).

If you click Start on a workflow that's missing its prerequisite document, you'll get an on-screen message telling you exactly which document to upload first, rather than the workflow silently failing.

### 5.5 MotionLogic panel

A single card, **"Draft something else,"** linking out to LW.MotionLogic® — a separate external tool for drafting any other type of motion. It opens in a new browser tab; it is not part of the LegaWrite.AI application itself.

---

## 6. Legal Drafting Workflows

Each workflow below is opened from a matter's Production Line panel (or, for Deep Research, directly from the Dashboard). All of them run as background AI jobs — you can navigate away and come back, and track progress from the [Jobs Log](#7-jobs-log) or the notification bell.

### 6.1 Demand Letter

**What it's for:** produces a pre-litigation demand letter — the document you send to a defendant before filing suit — built from the facts and causes of action found in your uploaded intake documents.

**How to start it:** upload at least one **Intake** document to the matter, then click **Start** on Demand Letter in the Production Line panel.

**The three stages:**
1. **Intake Documents** — view/upload the documents the letter will be built from. Starting the workflow reads every intake document already on the matter, so there is nothing to click for those. A document uploaded **after** that is not read on upload: click **Extract Facts** on this card to read it. The button is live only while the matter carries a document that has not been extracted from yet; hover it when it is greyed out and it tells you why.

   **Validating a claim before you rely on it:** in the Claims grid (opened via **Review Claims** or the **Claims** tile), check the box next to one or more causes of action, then click **Validate Selected COAs**. This sends the selected claim(s) together with the currently-marked facts back through the AI for a prima-facie check — essentially, "do the facts on file actually support this claim?" **This is a general check at the demand-letter level, not an element-by-element analysis** — it does not walk through and confirm each individual legal element of the cause of action one by one. It is not a full legal-sufficiency analysis either (that's what the Demurrer workflow does to a complaint); treat it as a coarse sanity check scoped to the facts already extracted for this matter, not a substitute for your own review of each element.

   Each claim's **Validated** column shows the result:
   - **validated** (green) — the facts on file support this cause of action.
   - **not valid** (orange/red) — the facts don't currently support it. Click the adjacent info icon to read the AI's explanation of why.

   Re-running Validate Selected COAs on a claim replaces its previous result. The grid is view-only (you can look, but the Validate button is unavailable) while the workflow is actively generating something else.
2. **Argument Outline** — once your documents are uploaded, the system automatically builds a visual outline (a "mind map") of the argument and suggests causes of action. Use **Review Outline** to see the mind map, and **Review Claims** to see and select which suggested causes of action to include.
3. **Demand Letter** — the drafted letter itself. Use **Review Demand Letter** to open it in the built-in editor, make any changes, then use **Approve and Print** to finalize.

**Along the way**, four review tiles — **Facts**, **Claims**, **Outline Mindmap**, **Review Draft** — are always available so you can check any part of the workflow's output at any stage, not just when you reach that step.

**When editing the final letter**, a **"Keep edits as redline"** checkbox lets you preserve your manual edits as tracked changes rather than having them silently absorbed. Clicking **Approve and Print** both downloads a Word (.docx) copy of the letter and automatically saves a copy into the matter's Documents list.

**Re-running a stage:** if facts, claims, or the outline already exist and you trigger that stage again, you'll be warned first (e.g. "Facts and claims exist! Do you really want to rewrite them?") before anything is overwritten.

**While the workflow is actively generating**, the facts/claims grids become view-only (you can look, but not edit) until the run finishes.

### 6.2 Complaint Drafter

**What it's for:** drafts a formal legal complaint, following the same fact-extraction → argument-outline → draft pattern as the Demand Letter workflow (it is, in fact, built on the exact same screen — only the labels and the final document differ).

**How to start it:** either (a) upload an **Intake** document with no existing Demand Letter workflow on the matter, or (b) complete a Demand Letter workflow first — completing one automatically unlocks Complaint Drafter, since the facts and claims are shared. Click **Start** on Complaint Drafter in the Production Line panel.

**The flow** mirrors Demand Letter exactly: **Intake Documents** stage → **Complaint Outline** stage (with **Review Complaint** as the primary action) → drafted **Complaint** for review and **Approve and Print**. Inside the outline's mind map view, a **"Draft Complaint"** button generates the complaint text from the currently marked causes of action.

**Validating a claim before you rely on it:** same as Demand Letter — in the **Intake Documents** stage, open the Claims grid (via **Review Claims** or the **Claims** tile), check one or more causes of action, then click **Validate Selected COAs** to run a prima-facie check of that claim against the facts on file. The **Validated** column shows **validated** (green) or **not valid** (orange/red, with an info icon explaining why); re-running the check replaces the previous result, and the grid is view-only while the workflow is generating something else. **This is a general check at the demand-letter level, not an element-by-element analysis** — it does not confirm each individual legal element of the claim one by one, and it is not the legal-sufficiency analysis the Demurrer workflow performs. Treat it as a coarse sanity check, not a substitute for your own review of each element.

**One extra safeguard:** if you remove a fact or claim after a complaint draft already exists, you'll be warned that the existing draft may now be out of date with your changes.

### 6.3 Demurrer

**What it's for:** produces a demurrer — a pleading arguing that a served complaint is legally insufficient — by analyzing an uploaded complaint, identifying which of its causes of action are defective, and drafting the demurrer arguments.

**How to start it:** upload a **Complaint** document to the matter, then click **Start** on Demurrer (or start it from the Dashboard's Workflows popup, which lets you upload the complaint and launch the analysis in one step).

**The three stages:**
1. **The Complaint** — view or upload the complaint document being analyzed. Deleting the active complaint document is specially protected: because a demurrer depends on it, you'll get an explicit confirmation before it's removed.
2. **Demurrer Outline** — once analysis completes, use **Claim Defects** to review and mark which causes of action you believe are demurrable, then **Approve** your selections. **Review Outline** opens a mind map with one tab per cause of action, each showing the argument structure for that claim. Once you've reviewed the outline, the **"Create Demurrer"** button becomes available to generate the actual demurrer draft — it stays disabled until you've reviewed the mind map at least once and haven't made changes since.
3. **Demurrer** — use **Review Arguments** to see the drafted grounds mapped to each cause of action, and **Review Demurrer** to open the drafted document for editing. As with the other drafting workflows, a **"Keep edits as redline"** checkbox is available, and **Approve and Print** finalizes, downloads, and saves the document. If the draft isn't fully ready for export yet, the Approve and Print button is disabled with a tooltip explaining why — simply wait a moment and try again.

Four review tiles — **The complaint**, **Grounds**, **Outline Mindmap**, **Review Draft** — are always accessible regardless of stage, same as the other drafting workflows.

### 6.4 Discovery Framework

**What it's for:** generates discovery requests — special interrogatories, objections to interrogatories, and a supporting case timeline/issue analysis — for use in active litigation.

**How to start it:** requires a **Complaint** document on the matter. Click **Start** on Discovery Framework in the Production Line panel.

Unlike the other workflows, Discovery Framework is organized as four tabs you can switch between freely (not a strict linear sequence):

- **Workspace** — a read-only overview: counts of interrogatory sets, questions, timeline events, issues, and gaps; plus AI-identified "Key Issues," "Discovery Gaps," and "Questionable Items" worth your attention.
- **Interrogatories** — where you build and manage your interrogatory questions.
  - **Generate Interrogatories** kicks off the first AI generation pass (shown only before any sets exist).
  - **+ Additional Set** starts a new set of interrogatories.
  - **Regenerate** re-runs generation (shown once you already have sets).
  - **Export** downloads your interrogatories.
  - **Import File** lets you bring in questions from a `.txt` or `.md` file.
  - **+ Add Question** adds a question manually.
  - Each question can be edited or deleted inline; AI-flagged questions show a warning chip calling out something worth double-checking.
- **Objections** — generates and manages your objections to each interrogatory question.
  - You must generate interrogatories first; if none exist yet, this tab shows a reminder to do so.
  - **Generate All Objections** runs AI objection drafting across every question at once.
  - **+ Add Objection** adds one manually; each can be edited or deleted.
  - **Export** downloads your objections.
  - Citations to California statutes within objections are automatically turned into clickable links to the official Leginfo statute pages.
- **Timeline** — a read-only case timeline built from the uploaded documents.

**Uploading additional documents:** the **Upload Document** button on this page includes a document-type dropdown specific to discovery materials, letting you categorize what you're adding.

### 6.5 Deep Research

**What it's for:** an AI-assisted legal research tool. Describe a legal scenario or question, and LegaWrite.AI breaks it down into facts, issues, exceptions, and follow-up questions for your review, then produces a full research memo with verified, expandable citations.

**How to start it:** click the **Deep Research** button on the Dashboard. Unlike the drafting workflows above, Deep Research is not tied to a specific matter — each research session stands on its own, and past sessions are kept in a history you can return to.

**Step 1 — Describe your question:** type your legal scenario into the text box (up to 10,000 characters, with a live counter that turns amber and then red as you approach the limit). A microphone icon lets you dictate instead of typing. Click **Research** (or press Ctrl+Enter) to submit. Below the input box, a **History** section lists your past research sessions, which you can reopen, rename, or delete.

**Step 2 — Review & Approve:** the AI's breakdown of your question is shown as a series of expandable, editable sections — **Scenario**, **Goal**, **Facts**, **Factual Questions**, **Issues to Research**, and **Exceptions** — each with checkboxes so you can include or exclude individual items before the memo is generated. A complexity badge (Simple/Moderate/Complex) summarizes the scope. When you're satisfied, click **Approve & Generate Memo** to produce the full research memo.

If you're revisiting a completed session, you can edit the decomposition and click **Relaunch Research with Changes** to generate a new memo from your edits — your original memo is preserved, not overwritten.

**Step 3 — The memo:** the finished research memo appears in an editor, with a status indicator showing whether its citations have been verified. From here you can:
- **Export** the memo (via a format dropdown).
- Select any passage of text and request an **expansion** — a deeper AI-generated elaboration on that specific point, with optional custom instructions for what you want expanded on. Expansions can be reviewed individually and then **integrated** into the memo, or dismissed.
- Review a **Citation Table** listing every verified citation used in the memo.

---

## 7. Jobs Log

**Page:** `/jobs`

Every background AI job you've run — Deep Research, Demurrer, Demand Letter, and Complaint Drafter — is listed here, whether it's still running, finished, or failed. Use this page when you want to check on something you started earlier without having to remember which matter it belonged to.

### Controls

- **Filter chips**: **All**, **Running**, **Completed**, **Failed**.
- **Dismiss all** — clears every completed, failed, or cancelled job from the log at once. Jobs that are still running are left untouched.
- The table shows Job Name, Matter, Type, Status, when it started, and how long it's taken.

### Status meanings

- **Running/pending jobs** show a live progress bar and percentage, updating automatically every couple of seconds while you have the page open.
- **"Awaiting review"** means the job has paused and needs your input to continue (for example, Deep Research pausing at its Review step).
- **Failed** jobs show a red "Failed" chip; hovering shows a general explanation. (Detailed technical error information is intentionally not shown here — if you need to troubleshoot a repeated failure, contact support.)
- **Completed** jobs show a green chip, sometimes with the specific stage they finished at.

### Opening a job

Click any row to go to that job's workflow page — for a completed job, this shows you the result; for a failed job, this is also where you'd manually start over, since there is no separate "Retry" button on this page by design; for a running job, you'll see its live progress in place.

---

## 8. Settings

**Page:** `/settings` — accessible via the Settings section in the navigation, with two tabs on the left: **My Account** and **Document Templates**.

### 8.1 My Account

**Page:** `/settings/account`

Despite the name, this page is entirely about your **subscription status** — there are no profile, password, or notification fields here.

- A **Subscription Status** panel shows your current status as a colored chip: **Trial Active**, **Active**, **Past Due**, or **Cancelled**.
- If you're on a trial, your **Trial Ends** date is shown.
- Depending on your status, you'll see one of:
  - A notice that your subscription is set to cancel at the end of the current billing period (if you've already requested cancellation).
  - A **Cancel Subscription** button, with a reminder that you'll keep access through the end of your current billing period after cancelling.
  - A note that your subscription has already been cancelled, with the option to resubscribe anytime.
  - A **Subscribe Now** button, if you don't currently have an active subscription — this takes you to the [Subscription page](#2-subscription--billing).

Clicking **Cancel Subscription** opens a confirmation dialog (**"Cancel Subscription?"**) explaining the consequences one more time before you commit — click **Keep Subscription** to back out, or **Yes, Cancel** to proceed.

### 8.2 Document Templates

**Page:** `/settings/document-templates`

This is where your firm manages the actual Word (.docx) templates used to generate Demand Letters and Demurrers, and — once it ships — will manage firm-wide AI writing-style preferences.

Two tabs: **Templates** and **Writing Style**.

#### Templates tab

A searchable, filterable list of your firm's templates.

- **Create** button (top right) opens the template creation dialog.
- **Filter buttons**: **All**, **Demand Letter**, **Demurrer**.
- **Search box** for quickly finding a template by name.
- Each row shows:
  - **Template Name** — click once to edit it inline.
  - **Type** — Demand Letter or Demurrer, shown as a colored chip.
  - **Active** — a toggle switch controlling whether this is the template currently used to generate that document type.
  - A **delete** icon.

> **Important rule:** exactly one template per document type (Demand Letter, Demurrer) can be active at a time.
> - Turning **on** a template that isn't currently the active one, when another template of the same type already is, asks you to confirm — activating this one will automatically deactivate the other.
> - Turning **off** the only active template for a type is **blocked**: you'll be told to activate a replacement template first, since a document type must always have exactly one active template.

**Creating a template:** click **Create** to open the "Create Document Template" dialog:

- **Template Name** (required).
- **Template Type** — Demand Letter or Demurrer (required).
- **Set as Active Template** — a toggle, on by default, controlling whether this new template becomes the active one immediately (subject to the one-active-per-type rule above).
- A **"Download sample template"** link appears once you've picked a type, giving you a starting file to build from.
- An **Available Placeholders** panel, searchable and organized by category, shows every merge-field placeholder your template can use (e.g. `{{MatterTitle}}`, `{{Jurisdiction}}`), what each one pulls in, and where the data comes from. Clicking a placeholder copies it to your clipboard so you can paste it directly into your document. Placeholders marked **"HTML"** contain rich AI-generated content and must be placed on their own paragraph in the template — the system will reject the upload otherwise.
- Upload your `.docx` file, then click **Save Template**. All four fields (name, type, active toggle default, file) are required before Save becomes clickable.

**Deleting a template:** click the delete icon, then confirm — this cannot be undone.

#### Writing Style tab

This tab currently displays only a placeholder message — **"Writing Style configuration — coming soon."** It is not yet a working feature. Once released, it's expected to let your firm analyze a set of your own past documents and tune 23 style dimensions (formality, sentence length, use of legalese, and similar) to shape how AI-drafted documents read, so don't expect functional controls here yet.

---

## 9. Concepts and Terms Used Throughout the App

- **Matter** — the container for a case or client engagement. Everything (documents, extracted facts, claims, workflows) belongs to a matter.
- **Intake document** — a document type used to seed the Demand Letter workflow (and, indirectly, Complaint Drafter).
- **Complaint document** — the formal complaint you upload; required to unlock Demurrer, Discovery Framework, and Complaint Checker.
- **Workflow** — any of the AI drafting/analysis processes (Demand Letter, Complaint Drafter, Demurrer, Discovery Framework, Deep Research) run against a matter.
- **Job** — the background process behind a running workflow; tracked in the [Jobs Log](#7-jobs-log) and the notification bell regardless of which page you're on.
- **Matter locked** — while a workflow is actively running on a matter, document uploads/edits/deletes on that matter are temporarily disabled until the job finishes.
- **Fact Ledger** — the read-only list of facts the AI has extracted from a matter's documents.
- **Claims** — the read-only list of causes of action identified for a matter.
- **Redline** — the "Keep edits as redline" option available when finalizing a drafted document, which preserves your manual edits as tracked changes rather than folding them silently into the text.

---

## 10. Known Gaps and Placeholders

For transparency, a few areas of the product are visible in the interface but not yet fully functional:

- **Forgot Password** (Login page) — the link is present but disabled. Contact support if you need help regaining access to your account.
- **Extract Facts** button (Demurrer workflow) — visible but intentionally disabled. In the Demand Letter and Complaint workflows the same button works, and it is the manual trigger for reading a document uploaded after the workflow was created.
- **Review →** link (Matter workspace, Extracted panel) — currently leads to a "coming soon" page.
- **Causes of action** tile (Matter workspace, Extracted panel) — shows a count but does not currently open anything when clicked.
- **Writing Style** tab (Settings → Document Templates) — placeholder only; not yet a working feature.
- **Ingestion email address** — you can view and regenerate your matter's dedicated email address, but the system does not yet automatically process documents sent to it.
