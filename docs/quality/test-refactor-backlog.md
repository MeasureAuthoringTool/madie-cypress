# MADiE Cypress Quality Architecture Backlog

Last updated: 2026-07-30

Stable rules live in `docs/quality/cypress-automation-guidelines.md`. Keep this backlog limited to current state, next actions, measured audit signal, and validation.

# AI Backlog Workflow

This backlog is the execution plan for repository improvements.

After every completed refactor:

1. Determine whether the completed item can be marked Done.
2. Determine whether priorities have changed.
3. Determine whether new work has been discovered.
4. Re-scan the remaining scope for a larger or higher-value repeated pattern before selecting any next target.
5. Recommend updates before moving to the next backlog item.

Do not skip unfinished work unless a higher-priority issue is found.
Do not assume the next listed target is still correct after a completed slice; explicitly reprioritize against the current architecture, audit signal, and remaining duplication first.

## AI Execution Rules

Always work on only one backlog item at a time.

A backlog item is complete when:

- The targeted duplication has been removed.
- Existing helpers have been reused where appropriate.
- Behavior is unchanged.
- Validation passes.
- Documentation has been evaluated for updates.

Do not begin the next backlog item until the current one is complete.
When a backlog item is complete, pause and reprioritize before continuing so the next slice is selected from the highest current-value pattern, not by automatic list order.

## Current Direction

- Keep service setup and request mechanics behind `TestData` and domain helpers.
- Keep UI specs focused on browser-visible behavior.
- Prioritize changes that reduce repeated fixture paths, token plumbing, fixed waits, forced interactions, skipped tests, or broad exception handling.
- Update this file only when priorities, decisions, audit counts, or done signals materially change.

## Starting Point

Current active item:

- P2 UI reliability debt, `TestCasesPage` Expected/Actual migration by repeated consumer pattern
- Current bucket: remaining raw numeric value-entry consumers

Why this is the best next step:

- Shared helper and request-boundary cleanup is already proven across `TestData`, `CreateMeasurePage.ts`, `CQLEditorPage.ts`, `MeasureGroupPage.ts`, `CQLLibraryPage.ts`, and the earlier service and shared-page-object slices.
- The remaining high-value UI work is concentrated in `TestCasesPage.ts`, where Expected/Actual flows still drive repeated raw interaction patterns, leftover forced-interaction debt, and mixed readiness handling.
- The shared Expected/Actual path is now proven across a broad set of Qi-Core and QDM specs, including smoke, execution, validation, multi-group, and ratio-observation coverage.
- `TestCasesPage.openExpectedActualTab(...)` now handles both Qi-Core split-panel layouts and QDM layouts without the split population panel, and reusable QDM stratified selectors plus `typeExpectedActualValue(...)` are in place.
- The shared Expected/Actual checkbox path is now effectively migrated: focused proof files were already helper-backed, and the remaining direct checkbox straggler in `MeasureVersionValidations.cy.ts` has been moved onto `checkExpectedActualCheckbox(...)`.
- The next higher-value bucket is the remaining raw numeric value-entry consumers, followed by legacy `readySelector` openings that can use a concrete Expected/Actual control selector.
- Keep product-question observation files sidelined until SME confirmation, and keep known environment-dependent failures such as the remaining `QDMRunExecuteTC.cy.ts` non-helper issues out of this slice.

Work boundary for the next slice:

- Keep the active work inside the `TestCasesPage` Expected/Actual migration slice, but organize execution by repeated consumer pattern rather than by spec family.
- Prefer helper-backed consumer conversion over new abstraction unless a missing shared mechanic is blocking an entire interaction bucket.
- Do not combine this slice with broader export, highlighting, transfer, or unrelated page-object refactors.
- Stop the slice only after one interaction bucket is fully migrated, validated, and recorded; do not partially advance multiple buckets in parallel.

## Current State

Recently proven service/helper slices:

- CI worker reliability: `scripts/run-with-timeout.js` now bounds silent Cypress worker hangs with a configurable 20-minute inactivity timeout, captures the existing CI diagnostics before termination, and terminates the full worker process group so `cypress-parallel` can return control to Jenkins.

- Measure service: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QI Core Test-Cases.cy.ts`.
- QDM service: `QDM Test-Cases.cy.ts`, `QDM Measure.cy.ts`, `QDMMeasureVersion.cy.ts`.
- CQL library service: `CreateCQL-Library.cy.ts`, `EditCQL-Library.cy.ts`, `VersionAndDraftCQL-Library.cy.ts`, `CQLLibraryDelete.cy.ts`.
- Shared create/fixture path: `CreateMeasurePage.ts` now routes user scope, fixture writes, measure create/clone requests, and draft measure ID reads through `TestData` helpers.
- Shared cleanup/request helpers: `Utilities.deleteLibrary`, `Utilities` lock and unlock flows, and the `MeasureGroupPage.ts` API create, update, and stratification setup now route fixture reads and authenticated requests through `TestData`.
- Shared test-case helper cleanup: `TestCasesPage.ts` now routes element/test-case fixture writes, measure/test-case fixture reads, and create-test-case API requests through `TestData`.
- Shared test-case UI reliability proof: `TestCasesPage.ts` removed helper-level sleeps from create-test-case save, title or series verification, JSON edit-save return, QDM demographics entry, and row-checkbox toggles while consolidating repeated QDM element action-menu clicks behind shared readiness helpers.
- Shared Expected/Actual proof summary: `TestCasesPage.openExpectedActualTab(...)`, `checkExpectedActualCheckbox(...)`, `uncheckExpectedActualCheckbox(...)`, reusable QDM stratified selectors, and `typeExpectedActualValue(...)` are now proven across Qi-Core and QDM smoke, execution, multi-group, and ratio-observation flows, including `QDMRatioMeasure_with_MOs_on_TC_AE_tab.cy.ts` passing 3/3 on Wednesday, July 22, 2026.
- Raw numeric Expected/Actual entry proof: focused validation on Wednesday, July 22, 2026 passed `QDMTestCaseRelevantElementWarning.cy.ts`, `RatioEpisodeSingleIPNoMO.cy.ts`, and `MeasureObservationExpectedValues.cy.ts` after moving raw numeric entry onto `typeExpectedActualValue(...)` and tightening the shared helper to scroll clipped inputs into view before typing.
- Raw boolean Expected/Actual checkbox proof: repository scan on Thursday, July 23, 2026 found the helper migration already covered the active proof set, with only one direct checkbox straggler left in `MeasureVersionValidations.cy.ts`; that straggler now uses `openExpectedActualTab({ checkboxSelector: ... })` plus `checkExpectedActualCheckbox(...)`, so the boolean checkbox bucket can be treated as complete.
- Shared validation proof: `QDM Measure.cy.ts` and `QI Core Test-Cases.cy.ts` now pass against the recent shared-helper conversions in the current workspace once Cypress is run with the invalid `NODE_EXTRA_CA_CERTS` placeholder unset.
- Shared sharing helper cleanup: `Utilities.setSharePermissions(...)` now delegates library and measure share or unshare request construction through `TestData`, and `CQLLibrarySharing.cy.ts` passes against that path in the current workspace.
- UI sort reliability proof: `MeasureListNewColumnsSort.cy.ts` now passes after replacing its fixed post-sort waits with route-alias and render-readiness checks, including status assertions tied to the sorted API responses instead of environment-specific row assumptions.
- UI sort reliability proof: `CQLLibraryListPageColumnSort.cy.ts` now passes after replacing its fixed post-sort waits with route-alias and render-readiness checks, including status assertions tied to the sorted API responses instead of environment-specific row assumptions.
- UI export reliability proof: `QICoreMeasureExport.cy.ts` now passes after replacing fixed waits with version-dialog visibility checks plus unzipped-file existence and local HTML readiness assertions for the human-readable export flows.
- UI QMIG export reliability proof: `QmigSTU5FileValidations.cy.ts` now passes after replacing repeated post-unzip sleeps with extracted-archive existence checks while preserving the existing archive-content assertions.
- UI alert reliability proof: `MinimizeAlerts.cy.ts` now passes after replacing navigation and alert re-open sleeps with visible-state assertions and shared `CQLEditorPage` minimize or reopen helpers.
- UI code-system reliability proof: `CQLCodeSystem.cy.ts` now passes after replacing repeated fixed waits with helper-backed editor-return assertions that let Cypress retry on the editor state instead of sleeping between tab switches.
- UI shared-editor reliability proof: `CQLEditorPage.ts` no longer contains fixed waits after replacing replace-document sleeps with focused editor clearing and builder-expand sleeps with document-ready retries, and both `MeasureLibraryMismatch.cy.ts` and `QiCoreCQLFunctions.cy.ts` pass against that shared path.
- UI terminology reliability proof: `TestCaseJSON_TerminologyTests.cy.ts` passes 9/9 after moving all measure-group and test-case setup to existing API helpers, removing unrelated CQL-editor save round trips, and retaining the browser only for JSON editing, warning, validation, and population-label behavior. The isolated test run still took 19:10, with a consistent 100–162 second per-test floor after API setup; treat shared login/edit-page/editor startup latency as a separate infrastructure target rather than adding more setup UI or weakening test isolation.
- UI QDM execution reliability proof: `QDMRunExecuteTC.cy.ts` now passes focused coverage for its three former fixed-wait paths after seeding valid CQL in API setup, reusing `CQLEditorPage.saveCql(...)` for editor-ready saves, and handling the test-case dirty-state modal explicitly before returning to the execution list. Its mixed passing/failing and single-failing scenarios also pass 2/2 after moving scenario-specific test-case creation before the single login and selecting API-created cases by their stored IDs instead of creating them through dialogs.
- UI QDM highlighting reliability proof: all four reported `MeasureHighlightingQDM.cy.ts` scenarios pass after moving population-group creation to API setup, using settled CQL saves and native Test Cases navigation, and removing obsolete group-ID tab clicks when the current highlighting layout already selects the first population. The multiple-population API setup now stores and selects its second group through `measureGroupId2`.
- UI QDM test-case navigation proof: `QDMTestCaseSearch.cy.ts` now passes focused coverage after moving the CQL save before Population Criteria/SDE setup, removing the measure-list reset previously used to recover the editor transition, and correcting its malformed DOB test data.
- UI QDM return-to-CQL proof: `QDMSDESubTabValidations.cy.ts` now passes focused dynamic-demographics coverage after replacing its fixed editor wait with `CQLEditorPage.openCqlEditor(...)` destination readiness and the existing `replaceCqlDocument(...)` path.
- UI QDM relevant-element warning proof: `QDMTestCaseRelevantElementWarning.cy.ts` now passes after aligning setup with the shared CQL-save-before-Population pattern, using explicit test-case-list destination readiness around cross-tab transitions, and allowing idempotent demographic selection when Race does not create a dirty save state.
- UI QDM test-case table proof: `QDMTestCaseID.cy.ts` now passes 4/4 after making SDE multi-select option queries resilient to MUI listbox replacement, aligning its setup with the shared collapsed-editor CQL save, and retrying row checkbox selection against freshly rendered Case # or title rows when the table shifts.
- UI QDM element action proof: `CloneQDMTestCaseElement.cy.ts` passes 2/2 and `QDMTestCaseAttributevalidations.cy.ts` passes 2/2 after targeting the enabled button inside each MUI SpeedDial instead of asserting enabled state on its root div; the attribute-removal scenario was also narrowed to attribute behavior by removing an unrelated ethnicity persistence assertion.
- UI QDM Population Criteria navigation proof: `QDMSDESubTabValidations.cy.ts` passes 4/4 and `ExcelTestCaseExport.cy.ts` passes 1/1 after replacing manual CQL saves with the shared settled save/collapse path and synchronizing on the intended Supplemental Data or Base Configuration destination.
- UI test-case validation proof: create and edit validations in `TestCaseValidations.cy.ts` are separated so edit-only scenarios API-create their baseline test cases before login. The seven reported edit-row failures now pass, including independently proven Group length and duplicate title/group cases; Details transitions use `openDetailsTab(...)`, and shared test-case row activation re-queries against the expected destination when React refreshes the table.
- UI execution-navigation proof: focused validation passed the intentional QDM CQL-error scenario, all three QDM disabled-button scenarios, the multiple-Population Criteria execution scenario, and the Qi-Core invalid-case edit-page Run scenario after correcting API argument order, moving measure-group and test-case creation to API setup before login, using settled CQL saves, and making `openTestCasesTab(...)` recover selected-tab/stale-content states through native activation. The API-created missing-JSON and two-population scenarios passed together 2/2 on Thursday, July 30, 2026.
- UI Qi-Core missing-group execution proof: `RunAndExecuteTestCaseButtonValidations.cy.ts` passes the focused missing group/population selections scenario after keeping setup inside the open measure, using the settled CQL save, and synchronizing Test Cases navigation on the disabled Execute button.
- UI Qi-Core invalid-case button proof: `RunAndExecuteTestCaseButtonValidations.cy.ts` passes the focused multiple-errors-and-warning scenario after synchronizing Test Cases and Details transitions, scrolling the fixed-footer Save button into view before persistence, and asserting the clipped Run control by its intended disabled state rather than unrelated viewport visibility.
- UI CQL Library validation proof: the reserved-keyword diagnostic in `ValidateCQLLibraryEditor.cy.ts` passed unchanged, the valid value-set scenario passes after adding the required `context Patient` declaration to its fixture, and the missing-code-system scenario passes after replacing the full Ace document, removing legacy `{home}` cursor commands, and asserting the exact diagnostic through the rendered error list instead of an ambiguously ordered gutter tooltip.
- UI Qi-Core SDE navigation proof: the reported no-SDE highlighting scenario in `QiCoreSDESubTabValidations.cy.ts` passes after replacing its manual editor save with the shared settled save/collapse path and asserting the Supplemental Data destination before interaction.
- UI expected-value export/import proof: both reported `ExpectedValuesForObservations.cy.ts` scenarios pass 2/2 after using the settled CQL save/collapse path before Population Criteria and routing numeric Expected/Actual entry through the shared panel-normalizing helper. The helper no longer calls `scrollIntoView()` on narrow inputs because that action aligned them beneath the split-panel sash; clear/type now disables actionability scrolling after panel normalization.
- UI non-owner execution proof: the reported details-page scenario in `ExecuteTestCasesByNonMeasureOwner.cy.ts` passes on TEST after API-creating its baseline test case before login and using the rendered actual-result checkbox as Expected/Actual readiness. Shared panel normalization no longer requires the horizontally clipped panel container itself to satisfy Cypress visibility before resetting its scroll position.
- UI measure-list delete proof: the reported search/delete scenario in `MeasureListPageSearching.cy.ts` passes on TEST after updating the shared confirmation dialog selectors to the current dialog content and `delete-dialog-continue-button` contracts.
- UI CQL Library comparison proof: `CompareLibraryVersions.cy.ts` passes after replacing the removed `compare-version-dialog-content` selector with the accessible dialog contract and scoped assertions for its CQL/version comparison content.
- UI Highlighting Results-toggle proof: the reported expanded/collapsed Results scenario in `MeasureHighlighting.cy.ts` passes after routing repeated toggles through the visible Results header with actionability scrolling disabled instead of clicking the right-edge icon that the split-view sash clips.
- UI CQL Library history display proof: the create/update scenario in `LibraryHistory.cy.ts` passes unchanged, and the reported share/unshare plus transfer scenarios pass 2/2 after deriving display names from the existing account-name fixture and asserting the current `Display Name (HARP ID)` history format.
- UI CQL Library sharing proof: the full `CQLLibrarySharing.cy.ts` suite passes all 8 active scenarios on TEST, with 1 intentionally pending scenario, after giving each draft/update operation a scenario-unique name, persisting intercepted draft IDs through `TestData`, and searching the Shared Libraries tab for the latest draft name before asserting its Draft/1.0.000 row. The filtered Shared Libraries result represents the set by its latest instance and does not expose an expandable older-version row.
- UI admin CQL Library transfer proof: `AdminLibraryTransfer.cy.ts` passes on TEST after searching for and selecting the uniquely created library instead of transferring row 0 from the paginated All Libraries table. The successful transfer is synchronized on its API response, and reusable name-based library selection now composes the shared submitted-search helper with row-scoped checkbox selection.
- UI Qi-Core saved-code permission proof: the reported non-owner scenario in `QiCoreCodeSearch.cy.ts` passes on TEST after registering the saved-codes terminology intercept before navigation, asserting its successful response, and synchronizing on the known saved code rather than a removed index-shaped row selector. This preserves Edit/Delete permission coverage and reports transient terminology failures at the request boundary.
- UI Qi-Core list coverage proof: both reported scenarios in `PassingCodeCoverageTestCaseListPage.cy.ts` pass independently on TEST after using settled CQL saves and native Test Cases navigation, correcting test-case API argument order, moving the second measure group to API setup before login, using the current valid Qi-Core JSON fixture, and explicitly configuring Expected/Actual values for both API-created cases. The current multi-group edit layout renders both groups in one Expected/Actual panel, so no Population Criteria sidebar transition is required.
- UI TEST sharing/transfer proof: the non-owner Share and Transfer permission scenarios pass unchanged on TEST, while the multiple-instance Share scenario passes after replacing its stale styled-control Draft selection with the proven `selectMeasure()` plus `actionCenter('draft')` recovery path. General account display-name lookup now lives in `TestData`; the lock helper delegates only for compatibility.
- UI CQL library shared-page-object reliability proof: `CQLLibraryPage.ts` no longer contains fixed waits after replacing helper-level action-menu and first-row sleeps with trigger visibility plus row-readiness assertions, and `AddVersionToCQLLibrary.cy.ts` passes against both the list and edit-screen action-center flows.
- UI measure-group shared-page-object reliability proof: `MeasureGroupPage.ts` no longer contains fixed waits after consolidating repeated CQL setup behind editor-write and save-success assertions plus the existing editor-collapse control before returning to Population Criteria. Focused `MeasureObservations.cy.ts` validation on Monday, July 20, 2026 passed 7 tests, including `Add Measure Observations for Ratio Measure` and `Add Measure Observations for Continuous Variable Measure`; the remaining 2 failures were downstream Expected/Actual checkbox actionability issues caused by the test-case sash overlay, not by the measure-group helper path.
- Shared auth/lock helper cleanup: `Utilities.ts` now routes share-permission requests plus measure/library/test-case lock and unlock-cleanup requests through `TestData` reads and authenticated request helpers.
- Shared lock-helper follow-up: on Friday, July 24, 2026, `LockedEntityTooltipDisplayName.cy.ts` passed focused library coverage after moving locked-entity tooltip and modal text assertions behind a shared helper, adding explicit `lockSharedMeasure(...)`, and aligning shared library locking with owner-aware fixture reads. The older `CQLLibraryLocking.cy.ts` flow now uses `lockSharedLibrary(true)`, which resolved the prior `altHarpUser/cqlLibraryId` fixture lookup failure; the remaining red path in that file is a per-test library-name uniqueness collision, not a shared-lock helper regression.
- Shared measure cleanup completion: `Utilities.deleteMeasure` and `Utilities.deleteVersionedMeasure` now delegate authenticated delete flows to `TestData` by-ID helpers while preserving graceful missing-fixture cleanup behavior.
- Shared builder fixture cleanup: `TestCaseBuilder.ts` now routes builder resource fixture naming through `TestData`, so shared helpers own that user-scoped fixture convention.
- Shared CQL library fixture cleanup: `CQLLibraryPage.ts` now routes created-library fixture writes through `TestData` helpers instead of hard-coded `cqlLibraryId` fixture names.
- Shared test-case fixture cleanup: `TestCasesPage.ts` now routes `elementId`, `testCaseId`, and `testCasePId` fixture reads and writes through dedicated `TestData` helpers instead of raw fixture keys.
- Shared measure-group fixture cleanup: `MeasureGroupPage.ts` now routes standard `groupId` and `groupId2` fixture writes through `TestData` helpers instead of raw fixture names, while preserving the existing `measureGroupId` exception used by older consumers.

Recently diagnosed non-refactor failures:

- `CQLLibraryDelete.cy.ts` still fails on current `master` because transfer cases return inactive-user `400` responses and admin delete-all cases return `403 insufficient_scope`. Treat that as environment or account-state drift, not as the next refactor target.
- `CQLLibraryTransfer.cy.ts` currently mixes two separate issues on `dev`: transfer and sharing flows can fail with `400 The provided HARP ID is not associated with an active MADiE user.` for the configured alt user, and the owned-library action-center flow remains slow and intermittently fails on action visibility or missing success toast after long UI login/user-switch cycles. Treat the inactive-user path as environment or account-state drift first; do not attempt session-login conversion in this file until that is resolved.
- `Measure.cy.ts` still has a non-refactor service failure on July 16, 2026 in `Validation Error: CQL library Name contains special characters`, where the service returns `500` instead of the expected `400` while other measure-service validation paths stay green.
- `QDMRunExecuteTC.cy.ts` focused validation no longer points at Expected/Actual selector debt. The former CQL-error and missing-group button paths now pass after API-before-login setup; `Non Measure owner should be able to Run/Execute Test case` previously showed VSAC `401` terminology errors after the alt-user flow and should remain a separate environment or session-dependent dependency.
- `ElementTable.cy.ts` no longer fails by asserting enabled state on the SpeedDial root and reached the element Edit action in focused reruns, but the current React transition remains intermittent: the visible Edit action can detach during click or close without opening the element editor. Keep this as a separate destination-transition target; the attempted generalized retries were removed because repeated runs did not prove them.
- `ExecuteInvalidTestCases.cy.ts` now reaches and executes the invalid list-page case after configuration/list navigation fixes, but the product leaves its status `Invalid` instead of the expected `Pass` for at least 105 seconds. Keep the `Pass` assertion and follow this as a separate product/execution failure; do not weaken the test to accept `Invalid`.
- The focused `QDMRunExecuteTC.cy.ts` single-pass follow-up remains inconclusive: the original missing Execute-button path was narrowed to edit-shell reopening after API setup, but the latest independent proof run was not completed. Re-run that one scenario separately before marking it resolved.
- Locking regression follow-up on Friday, July 24, 2026 is partially blocked by environment instability rather than by the shared helper changes. Focused `MeasureUnlocking.cy.ts` and `MeasureLockBlocksAssociation.cy.ts` runs both failed in global Okta auth setup to `https://test.idp.idm.cms.gov/api/v1/authn` before reaching the touched helper paths, so treat those runs as inconclusive until the `dev` auth timeout stabilizes. `CQLLibraryLocking.cy.ts` moved past the old shared-library fixture-owner failure after the helper update, which narrows the remaining follow-up in that file to unique test data generation rather than lock-helper correctness.

## Latest Audit Signal

Command: `npm run quality:no-focused-tests` on 2026-07-22

- Inventory: 256 specs / 65494 spec lines; 29 shared files / 18728 shared lines; 3 support files / 629 support lines; 9 scripts / 1511 script lines.
- Skipped tests: 11.
- Manual fixture path plumbing: 191.
- Manual access token plumbing: 87.
- Fixed waits: 36.
- Forced interactions: 168.
- Global uncaught exception suppression: 1.

Largest risk concentrations:

- `MeasureGroupPage.ts` dropped out of the fixed-wait hotspot list after its three helper sleeps were replaced with editor-ready and save-success assertions that held in focused measure-observation coverage on Monday, July 20, 2026.
- `OktaLogin.ts` now carries the remaining shared-helper fixed waits after the latest `TestCasesPage.ts` readiness cleanup removed two more helper sleeps.
- `QDMRunExecuteTC.cy.ts` dropped out of the fixed-wait hotspot list after its three execution waits were replaced with editor-ready and modal-aware assertions that held in focused Cypress validation on Friday, July 17, 2026.
- `CQLLibraryPage.ts` dropped out of the fixed-wait hotspot list after its two helper sleeps were replaced with shared action-trigger and row-readiness assertions that held in focused Cypress validation on Friday, July 17, 2026.
- `TestCasesPage.ts`: remaining UI reliability debt now centers on its leftover forced interactions plus the remaining non-smoke Expected/Actual execution, import, and validation specs that still bypass the shared helper path; fixture-path, create-test-case API setup, and the shared create or edit readiness cleanup are complete. The remaining Expected/Actual debt is now primarily organizational: the repo already has the needed shared helper path, but migration progress slows when work is selected by file adjacency instead of by repeated interaction pattern.
- `AdminLibraryTransfer.cy.ts` and related transfer coverage: UI transfer specs still mix API-eligible setup with browser-only assertions, duplicate transfer/history checks, and combine distinct validation concerns in the same test flow.
- `CorrectExpectedValues.cy.ts`, `DeleteTest-Case.cy.ts`, and selected admin/measure/test-case service specs: remaining service-tail cleanup.
- highlighting specs, remaining QDM export or execution specs, and shared page objects: UI reliability debt from waits and forced interactions.
- `cypress/support/e2e.ts`: global `uncaught:exception` suppression.

## Priorities

### P1: Shared Helper and Infrastructure Hardening

Status: Done

Completed signal:

- Shared helpers now own the reusable user-scoped fixture naming and common request setup that had been spread across `CreateMeasurePage.ts`, `TestCasesPage.ts`, `MeasureGroupPage.ts`, `Utilities.ts`, `CQLLibraryPage.ts`, and `TestCaseBuilder.ts`.
- Focused validation passed for the recent helper conversions in `QDM Measure.cy.ts`, `QI Core Test-Cases.cy.ts`, and `CQLLibrarySharing.cy.ts`.
- Remaining hotspots in the audit now center on UI reliability and service-tail specs rather than shared helper request mechanics.

### P2: UI Reliability Debt

Current target order:

- reported QDM regression failures are the immediate priority:
  1. `QDMTestCaseButtons.cy.ts`: validate the proven row-selection/action-center contract against a second consumer
  2. `ElementTable.cy.ts`: align CQL-before-Population setup and cross-tab destination readiness with the proven QDM pattern
  3. `QDMCQMExecutionFailureErrorValidations.cy.ts`, `QDMRunExecuteTC.cy.ts`, and `MeasureHighlightingQDM.cy.ts`: handle execution-state, translator, and terminology dependencies as a separate QDM bucket
  4. remaining reported QDM export, versioning, Population Criteria, and CQL-editor failures after the test-case reliability slice is proven
- verify CI collection for `BooleanAndNonBooleanExpectedValues.cy.ts` and `ExecutionAndCoverageValidations.cy.ts`, which produced no runner output; correct the reported `TestCaseJSON_TerminologyTests.cy.tsz` spec-list typo to the existing `.cy.ts` path before treating any of these as test failures
- diagnose the repeated 100–162 second login/edit-page/editor startup floor proven by `TestCaseJSON_TerminologyTests.cy.ts`; its API-only setup passes, so further runtime work should instrument shared authentication and initial page/API readiness rather than merge isolated cases or restore setup through the UI
- migrate remaining raw Test Case Details, JSON, and Test Cases tab clicks to the proven native activation helpers, grouped by tab interaction pattern and paired with destination-specific readiness selectors; do not replace ordinary button clicks globally
- shared page objects with remaining waits and high reuse: `OktaLogin.ts`, `TestCasesPage.ts`
- `TestCasesPage.ts` Expected/Actual and editor flows now also carry the most actionable downstream forced-interaction debt, but the shared helper path is now proven across the smoke-folder rollout plus `ExecuteTestCasesByNonMeasureOwner.cy.ts`, including both Qi-Core split-panel and QDM non-panel Expected/Actual layouts
- the next Expected/Actual adoption wave should continue one repeated interaction bucket at a time across the remaining non-smoke execution, import, and validation specs, instead of advancing by neighboring file. The boolean checkbox bucket is now complete; shift to the remaining raw numeric value-entry consumers next, then `readySelector` cleanup outside the completed `RunAndExecuteTestCaseButtonValidations.cy.ts`, `MeasureObservationActualValues.cy.ts`, `ExecutionAndCoverageValidations.cy.ts`, `TestCaseExecutionWithCode.cy.ts`, `QDMRatioMeasure_with_MOs_on_TC_AE_tab.cy.ts`, `QDMCVMeasure_with_multiple_Groups_with_MO.cy.ts`, and `QDMRatioMeasure_with_multiple_Groups_with_MO.cy.ts` proof batch
- remaining export specs that still rely on repeated unzip or download setup
- export and terminology-heavy UI specs surfaced near the top of the wait audit
- forced interactions in `TestCasesPage.ts`, import validations, highlighting specs, and editor flows
- transfer specs that should move setup and ownership/share mechanics behind APIs before UI assertions, starting with `cypress/e2e/WebInterface/CQL Library/CQL Library Transfer/AdminLibraryTransfer.cy.ts`
- global exception suppression in `cypress/support/e2e.ts`
- skipped tests needing owner/ticket/remove decisions

Done when waits are replaced by route aliases, visible/enabled assertions, or polling helpers; forced interactions are justified or removed; exception handling is targeted.

### P3: Remaining Service Tail Cleanup

Candidates:

- `DeleteTest-Case.cy.ts`
- `CorrectExpectedValues.cy.ts`
- `AdminLibraryTransfer.cy.ts` after transfer-spec overlap is audited against `AdminMeasureTransfer.cy.ts` and `CQLLibraryTransfer.cy.ts`
- remaining admin/measure/test-case specs surfaced near the top of the audit after each batch

## Replan Rules

After each meaningful slice:

- Run `npm run quality:audit` and compare the current diff.
- Prefer changes that remove a class of duplication across multiple specs.
- Record only durable decisions or changed counts.
- Validate with static checks and at least one focused spec for the changed helper path.
- Commit once a boundary is proven so the next experiment starts clean.

## Validation Set

Baseline:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

Focused service-boundary example:

```bash
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/ViewHumanReadable.cy.ts"
```

Add touched-area specs:

- Saved CQL: `MeasureTranslatorVersion.cy.ts`, `QDM MeasureGroup.cy.ts`.
- Measure setup: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `QDM Measure.cy.ts`.
- Draft/version: `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QDMMeasureVersion.cy.ts`.
- Test cases: `QI Core Test-Cases.cy.ts`, `QDM Test-Cases.cy.ts`, `TestCaseImport.cy.ts`, `DeleteTest-Case.cy.ts`.
- CQL library: `CreateCQL-Library.cy.ts`, `EditCQL-Library.cy.ts`, `VersionAndDraftCQL-Library.cy.ts`, `CQLLibraryDelete.cy.ts`.
- Shared UI/page-object changes: include a relevant WebInterface smoke or editor spec.

## Done Signals

- Spec intent is clearer than before.
- Repeated fixture/token/request mechanics moved behind a named helper.
- Negative states remain explicit.
- Static checks pass.
- A focused spec covering the changed helper path passes.
- This backlog contains only new decisions, changed counts, or current priorities.
