
**Task: redesign review of the legal drafting workflow screens in CoreUI — `/workflow/demand`, `/workflow/complaint`, and `/workflow/demurrer`.**

These are the pages where attorneys actually produce the document they came here to produce. They are the highest-value screens in the product and they currently look like a 2010 admin panel: four identical grey-bordered cards in a 2×2 grid, each with a heading, a sentence, and two blue rectangular buttons. I want a design review and a concrete redesign proposal. Do not write implementation code; produce the design, the rationale, and a component-level spec an engineer can build from.

**Understand this before you read anything else:** these three routes are **two React components**, and one of them serves two different products. `/workflow/demand` and `/workflow/complaint` both render `DemandForm`, which decides its wording at runtime from an `isComplaint` flag computed at `CoreUI/src/com/workflow/DemandForm.tsx:80-86`. `/workflow/demurrer` renders `DemurrerForm`, a near-copy. Their eight panel files all open with the same 12-line style constant. **Your deliverable must be one component spec that serves all three products through props, not three screen designs.**

**Read these first, in this order:**

1. `Corporate_design/lwDesign2.md` — the corporate design system. Every recommendation must cite its tokens and component recipes by name. There is also `Corporate_design/lwDesign2.md`, whose "Matter Page" section describes a flat instrument-panel aesthetic; tell me which of the two you treated as governing and why.
2. `CoreUI/CLAUDE.md` — frontend rules. Note the hard rule that `isPlaintiff` is forbidden, and the workflow gating table, which explains what makes each step available.
3. The two screens:
   - `CoreUI/src/com/workflow/DemandForm.tsx` (643 lines — serves Demand Letter *and* Complaint)
   - `CoreUI/src/com/workflow/DemurrerForm.tsx` (479 lines)
4. The eight panel files — the actual object of the redesign:
   - `CoreUI/src/com/workflow/demand/SelectSourcePanel.tsx`, `FactsAndClaimsPanel.tsx`, `MindMapPanel.tsx`, `FinalizePanel.tsx`
   - `CoreUI/src/com/workflow/demurrer/SelectSourcePanel.tsx`, `FactsAndClaimsPanel.tsx`, `MindMapPanel.tsx`, `FinalizePanel.tsx`
5. The shared chrome: `CoreUI/src/com/matter/MatterHeaderStrip.tsx`, `CoreUI/src/com/jobs/JobBanner.tsx`, `CoreUI/src/ui/mui_v2/LoadingWrapper.tsx`.
6. The building blocks: `CoreUI/src/ui/mui_v2/Box.tsx`, `Button.tsx` (see the `btnVariant` map at line 17), `Text.tsx`, `Modal.tsx`.
7. The modals these pages launch: `CoreUI/src/com/v2/DocumentsGridModal.tsx`, `FactsGridModal.tsx`, `CauseOfActionGridModal.tsx`, `MindMapModal.tsx` (365 lines), `EditorModal.tsx`, `InfoModal.tsx`.
8. **The internal quality bar**: `CoreUI/src/com/workflow/research/` — the Deep Research workflow. It has a real step model (`steps/`), a chain-progress visualisation (`components/spinner/`), and a history sidebar. It is the newest and best-looking surface in this product. Your redesign should not feel older than it. Also skim `CoreUI/src/com/workflow/discovery/DiscoveryWorkspace.tsx`, a fourth sibling that already uses a workspace layout instead of a 2×2 grid.
9. For consistency only, do not redesign: `CoreUI/src/app/matter/MatterContent.tsx`, `CoreUI/src/app/matter/panels/HeaderPanel.tsx`, `CoreUI/src/com/dashboard/NavBar.tsx`.

**If a running instance is available**, view the live pages at `http://localhost:47293/workflow/demand?id=<id>&m_id=<id>` and `.../workflow/demurrer?id=<id>&m_id=<id>` (frontend container `legawrite-ui`; backend on port 47312). Check at 768px, 1024px, 1440px, and 1920px. These are desktop work screens — do not over-invest in 480px, but say what happens there.

**Deliver:**

1. **Audit** — what is wrong today, ranked by user impact, each item citing file and line.

2. **Compliance report** — every place these screens violate `lwDesign2.md`, with the token or recipe they should use. Cover colour, type scale, spacing, radius, elevation, and the Do/Don't list at lines 270-286. Start with the shared `box` constant that appears identically in all eight panel files (`radius: '8px'`, `border: '1px solid var(--neutral-grey-90)'`).

3. **Redesign proposal** covering:

   - **Making the sequence visible.** The four cards are a strictly ordered pipeline — Source Input → Fact & Claim Validation → Build Argument Map → Finalize & Review — rendered as an unordered 2×2 grid with no step numbers, no connectors, and no ordering cue. The only completion signal on the whole screen is one green check icon next to "Source Input" (`demand/SelectSourcePanel.tsx:41`). Propose a step/stepper treatment. Evaluate at least: numbered step cards in one responsive row; a horizontal stepper with a single active panel; a left step rail with a detail pane. Say which you recommend and why, noting that attorneys jump backward between steps constantly.

   - **Locked states that explain themselves.** Every gate is currently expressed as a greyed-out button. Design a locked state that states its reason. The conditions already exist in code: `!documents.length`, `!facts.length && !causeOfActions.length`, and — on the demurrer — a three-part gate at `DemurrerForm.tsx:369` (`!mindmap.length || !demurrerAcknowledged || mindmapDirty`) that currently renders as one uniform grey for three different causes.

   - **Showing state that is already on the wire.** These panels receive data and display none of it: `FactsAndClaimsPanel` gets `facts` and `coas` arrays and shows neither count; `MindMapPanel` gets `mindmap` and uses only `.length` to disable; `FinalizePanel` accepts a `citations` prop that `DemandForm.tsx:503` never passes, making the count at `FinalizePanel.tsx:51-55` dead code. Design what each card should surface. This needs no backend work — confirm that as you go.

   - **A canonical field set for the card.** The four cards currently read as inconsistent because they are four different recipes, not four instances of one. Concretely: two of them pass `justify={ALIGN.between}` and two do not (`MindMapPanel.tsx:41` and `FinalizePanel.tsx:46` spread their content; `SelectSourcePanel.tsx:39` and `FactsAndClaimsPanel.tsx:34` pack it to the top), so inside the fixed-height rows **the button baselines in the top row do not align with the bottom row**. The Finalize card carries a description on the demurrer (`demurrer/FinalizePanel.tsx:36`) and has it commented out on the demand (`demand/FinalizePanel.tsx:48`). And one button is conditionally mounted rather than disabled (`demand/SelectSourcePanel.tsx:49-51`), so that card changes shape mid-workflow while the others merely grey out.

     **Below is a starting proposal, not a requirement — improve it or argue it down, but return a single field set that every card and every product shares.** Eight slots; a slot may be empty but never absent, because an absent slot is what shifts everything below it.

     | # | Field | Always present? | Source |
     |---|---|---|---|
     | 1 | Step number (`1`–`4`) | yes | new, static per card |
     | 2 | Status chip — one of `Locked` / `Ready` / `Running` / `Done` | yes | derived from existing `disabled` / `loading` / `busy` conditions; use the `badge-*` recipes at `lwDesign2.md:213-223` |
     | 3 | Title | yes | existing `h2` |
     | 4 | Stat line | yes | props already passed — see below |
     | 5 | Lock reason, one sentence | only when `Locked` | derived from the same condition that sets `disabled` |
     | 6 | Timestamp, relative | only when `Done` | **needs confirming** |
     | 7 | Primary action — the *do it* verb | yes | existing |
     | 8 | Secondary action — the *look at it* verb | zero or one, slot always reserved | existing; use `btnVariant.secondary`, which exists at `ui/mui_v2/Button.tsx:19` and is used on exactly one button across all eight panels |

     Field 2 absorbs the conditional green check at `SelectSourcePanel.tsx:41` — currently the only completion signal on the entire screen, and present on step 1 only.

     Field 4, per card, from arrays already received and currently used only for `.length` checks:

     | Card | Props already received | Proposed line |
     |---|---|---|
     | Source Input | `documents[]`, items carry `.marked` | `3 documents · 1 selected` |
     | Fact & Claim Validation | `facts[]`, `coas[]`, both carrying `.marked` | `14 facts · 3 of 7 claims selected` |
     | Build Argument Map | `mindmap[]` | `5 arguments mapped` |
     | Finalize & Review | `demandText` / `demurrerText`, `demure[]` | `Draft ready · 12 citations` |

     Two caveats you must resolve rather than assume: the `citations` prop is declared on `FinalizePanel` but never passed by any caller, so treat it as *needs confirming*; and I have not verified that the workflow row exposes a generation timestamp the panel can reach, so field 6 needs the same check.

     Field 5, per condition — all of these already exist in code and today render as an identical grey button:

     | Existing condition | Proposed sentence |
     |---|---|
     | `!documents.length` | "Select a document to continue." |
     | `!facts.length && !causeOfActions.length` | "Extract facts and claims first." |
     | `!mindmap.length` (demurrer) | "Build the argument map first." |
     | `!demurrerAcknowledged` (demurrer) | "Create the demurrer to continue." |
     | `mindmapDirty` (demurrer) | "The argument map changed — regenerate the demurrer." |

     The last three are the three separate causes packed into the single gate at `DemurrerForm.tsx:369`.

     Two rules I want you to either adopt or explicitly reject with a reason:
     - **Never conditionally render a slot — disable it.** A card that changes height or button count as state advances is the mechanical cause of the inconsistency.
     - **Drop the static prose descriptions once the stat line exists.** "Visualize and structure your legal response using the MindMap system" tells an attorney nothing they do not already know; "5 arguments mapped · updated 10 minutes ago" tells them where they are. Removing the description also removes the demand-vs-demurrer mismatch by deleting the field that is mismatched.

     The intended result is a two-zone card — identity zone (fields 1-4), action zone (fields 7-8), with 5 and 6 as conditional inserts between them — which is what lets `justify={ALIGN.between}` be correct on all four cards instead of two.

   - **The multi-minute wait.** "Create Demand Letter", "Draft Complaint" and "Create Demurrer" run for minutes. Today the only feedback is one `JobBanner` strip while four large cards sit greyed and dead. `/workflow/research` already has `ChainProgressVisualization.tsx` and `PhraseRotator.tsx`. Propose a running state — strongly prefer reusing what exists over inventing a new one. Two constraints: the full-screen blocking overlay was deliberately removed (`DemandForm.tsx:464-468`) and must not come back; and `JobBanner` reconnects to jobs started in another tab (`DemandForm.tsx:427-437`), so its function must survive whatever replaces its look.

   - **Button hierarchy.** Three of the four cards render two `btnVariant.main` (MUI contained) buttons side by side with equal weight, where one is the action and the other is a viewer. `btnVariant.secondary` already exists and is unused on these screens. Specify which action in each pair is primary.

   - **One spec, three products.** Deliver a single panel component with a props contract — the eight-slot field set above — and show the three label sets as data. If your spec cannot express both the demurrer's one-button first card and the demand's two-button first card through the same props, it is not finished.

   - **Responsive.** The grid is built from two `<UIRow h={215}>` rows with a hardcoded pixel height (`DemandForm.tsx:486, 493`; `DemurrerForm.tsx:348, 355`). Any card that grows will clip. State what replaces it and how the layout behaves at each `lwDesign2.md` breakpoint.

   - **Accessibility.** Focus rings, keyboard order through the steps, how a locked step announces its reason to a screen reader, touch targets, and contrast for any state chips you introduce.

4. **Modal assessment.** Four of the eight buttons open a data grid, a fifth opens the 365-line `MindMapModal`, and a sixth opens the Quill `EditorModal` where the attorney actually reads and approves the draft. A facelift that stops at the four cards changes the minority of this screen's real estate. Audit `MindMapModal.tsx` and `EditorModal.tsx` against the design system and estimate a second pass — even though the modals are out of scope for this one.

5. **Three questions I need answered explicitly:**
   - `lwDesign2.md:137` declares a no-hover policy and documents no hover states, while `lwDesign2.md:286` forbids shadows for depth. Clickable step cards normally signal interactivity on hover. Is this a real brand constraint or a gap in the captured spec? Propose the affordance that works within the rule as written.
   - `CoreUI/src/ui/mui_v2/Text.tsx` has no type scale — `type="h2"` emits a bare `<h2>` and everything else a bare `<span>`. There is no way to express `{typography.subtitle-lg}` or `{typography.caption-bold}` through the existing component. Does your spec require extending `UIText` with a role prop first? If so, say so as a named prerequisite.
   - Should version history come back? `HistoryPanel` is imported and rendered only inside a comment block in both forms (`DemandForm.tsx:507-509`, `DemurrerForm.tsx:372-374`), backed by two live files (`demand/HitoryPanel.tsx`, `demurrer/HitoryPanel.tsx`). Either design it in or recommend deleting the files.

6. **A component spec** — for each new or changed element, the exact tokens (background, border, radius, padding, typography role, chip colours, state colours) so an engineer can build it without further design input.

7. **Effort estimate** split into: presentation-only changes, changes needing new frontend logic, and anything requiring a backend field.

**Constraints:**

- Cobalt `{colors.primary}` is reserved for buy-now flows (`lwDesign2.md:149, 281`). These are drafting screens, not commerce. Primary actions use the `{colors.ink-button}` black pill (`lwDesign2.md:141-144`).
- All buttons, chips, and badges are `{rounded.full}` (`lwDesign2.md:275, 283`).
- The system is flat (`lwDesign2.md:286`). No hover-lift, no card shadows. `elevation: 0` is already correct — keep it.
- No accent colours outside the `lwDesign2.md` palette. The hardcoded `#6b7280` at `demurrer/FactsAndClaimsPanel.tsx:52` is a violation, not a precedent.
- No `isPlaintiff`, anywhere.
- No backend schema changes. Everything in the recommendations above uses data already passed into the panels — if you need something that is not, raise it as a separate follow-up.
- Do not change the workflow gating *rules* in `CoreUI/src/com/matter/computeWorkflowAvailability.ts`. You are redesigning how gates are presented, not what they are.
- Do not redesign `/workflow/discovery`, `/workflow/research`, `/workflow/complaint-checker`, or `/matter`.

While you are in the code, note but do not fix these known defects, so the redesign does not build on top of them:
- `CoreUI/src/com/workflow/DemandForm.tsx:19` imports `WorkflowStepPanel` and never renders it; `CoreUI/src/com/workflow/demand/WorkflowStepPanel.tsx` (125 lines) is dead code carrying a duplicate extract-facts flow. `CoreUI/src/com/workflow/demurrer/WorkflowFirstPanel.tsx` (129 lines) is imported nowhere.
- `CoreUI/src/com/workflow/demand/FinalizePanel.tsx:51-55` renders a citation count from a prop no caller supplies.
- `CoreUI/src/com/workflow/demurrer/FactsAndClaimsPanel.tsx:52` hardcodes `#6b7280` inline.
- The description sentence above the grid ("...all in one place") is near-identical across all three products and carries no information.
- `HitoryPanel.tsx` is misspelled in both the demand and demurrer folders.

Save All deliverable to \tickets\Cosmetic2\workflows-facelift\ folder