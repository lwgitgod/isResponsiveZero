
**Task: redesign review of the `/matters` page in CoreUI.**

`/matters` is the highest-traffic page in this product — it is the first thing an attorney sees after login and the launch point for every workflow. It currently looks dated. I want a design review and a concrete redesign proposal. Do not write implementation code; produce the design, the rationale, and a component-level spec an engineer can build from.

**Read these first, in this order:**

1. `Corporate_design/lwDesign.md` — the corporate design system. Every recommendation must cite the tokens and component recipes in this file by name. There is also a `Corporate_design/lwDesign2.md`; tell me which of the two you treated as governing and why.
2. `CoreUI/CLAUDE.md` — frontend rules. Note the hard rule that `isPlaintiff` is forbidden.
3. The page, in render order:
   - `CoreUI/src/app/matters/page.tsx`
   - `CoreUI/src/app/matters/MattersPage.tsx`
   - `CoreUI/src/app/matters/MatterPageContent.tsx`
   - `CoreUI/src/app/matters/MattersContent.tsx`
   - `CoreUI/src/com/matter/MatterItem.tsx`
4. The building blocks it uses: `CoreUI/src/ui/mui_v2/Grid.tsx` (`UIAutoGrid` and `UIGrid_v2`), `Box.tsx`, `Text.tsx`, `Button.tsx`, `TextField.tsx`, `LoadingWrapper.tsx`.
5. Its data: `CoreUI/src/hooks/useMatter.tsx`, `CoreUI/src/hooks/useMattersFilter.tsx`, and `MatterSchemaBase` at `CoreUI/src/api/swagger/api.ts:2025`.
6. For consistency only, do not redesign: `CoreUI/src/app/matter/MatterContent.tsx`, `CoreUI/src/app/matter/panels/HeaderPanel.tsx`, `CoreUI/src/com/matter/MatterHeaderStrip.tsx`, `CoreUI/src/com/dashboard/NavBar.tsx`.

**If a running instance is available**, view the live page at `http://localhost:47293/matters` (the frontend container `legawrite-ui`; the backend is on port 47312). Check it at 480px, 768px, 1024px, and 1440px.

**Deliver:**

1. **Audit** — what is wrong with the page today, ranked by user impact, each item citing the file and line.
2. **Compliance report** — every place the current page violates `lwDesign.md`, with the specific token or recipe it should be using. Cover color, type scale, spacing, radius, elevation, and the Do/Don't list.
3. **Redesign proposal** covering:
   - **Layout**: card grid vs. dense list. I want a Grid/List view toggle unless you can argue convincingly for one only. Show both.
   - **The card**: what data appears, at what visual weight, in what order. `MatterSchemaBase` exposes `client_name`, `opposition_name`, `venue`, `judge`, `stage`, `type_of_workflow`, `created_at`, `updated_at`, and an optional `workflows` array — most of which the card ignores today. Confirm which of these the list endpoint actually populates before you design around them.
   - **Volume handling**: the page renders every matter at once with no pagination. I do not want an inner scrollbar inside the card area — argue for pagination, infinite scroll, or a sticky header, and say why. Note that `UIAutoGrid` already supports `pageSize` / `showPagination`.
   - **Header controls**: search, sort, filter chips, live count, and an always-visible "New Matter" button. Today creating a matter is only reachable from the empty state.
   - **States**: loading skeletons, true-empty, no-search-results, and error. These must be four distinct designs.
   - **Responsive**: behavior at each `lwDesign.md` breakpoint.
   - **Accessibility**: focus rings, keyboard navigation through the grid, touch target sizes, and contrast ratios for any chip colors you introduce.
4. **Two open questions I need answered explicitly:**
   - `lwDesign.md` line 137 declares a no-hover policy and the sheet documents no hover states, while line 286 says not to apply shadows for depth. A modern card grid usually signals interactivity on hover. Is this a real brand constraint or a gap in the captured spec? Propose the interaction affordance that works within the rule as written.
   - What is the full ordered set of `stage` values? If phases form a known sequence, a progress indicator on the card is the single highest-value addition; if they do not, say so and drop the idea.
5. **A component spec** — for each new or changed element, the exact tokens (background, border, radius, padding, typography role, chip colors) so an engineer can build it without further design input.
6. **Effort estimate** split into: presentation-only changes, changes needing new frontend logic, and anything requiring a backend field.

**Constraints:**

- Cobalt `{colors.primary}` is reserved for buy-now flows. `/matters` is not one. Do not use it for the create button.
- All buttons, chips, and badges are `{rounded.full}`.
- Do not introduce accent colors outside the `lwDesign.md` palette.
- No `isPlaintiff`, anywhere.
- No backend schema changes. If you need a field the list endpoint does not return, raise it as a separate follow-up.
- Do not redesign `/matter` (singular) in this pass.

While you are in the code, note but do not fix these known defects, so the redesign does not bake them in:
- `CoreUI/src/hooks/useMattersFilter.tsx:11` — search is case-sensitive and matches `name` only.
- `CoreUI/src/app/matters/MattersContent.tsx:66` — the "You don't have matters yet" empty state also fires when a search returns nothing.
- `CoreUI/src/app/matters/MattersContent.tsx:40` — sort is hardcoded to newest-id-first with no user control.
- `CoreUI/src/com/matter/MatterItem.tsx:38` — delete fires with no confirmation.

8. Existing tab-selection functionality remains unchanged.


Save all the deilverables to \tickets\Cosmetic2\matters-facelift\ folder