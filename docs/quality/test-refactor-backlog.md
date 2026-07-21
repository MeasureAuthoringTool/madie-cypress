# MADiE Cypress Quality Architecture Backlog

Last updated: 2026-07-21

Stable rules live in `docs/quality/cypress-automation-guidelines.md`. Keep this backlog limited to current state, next actions, measured audit signal, and validation.

# AI Backlog Workflow

This backlog is the execution plan for repository improvements.

After every completed refactor:

1. Determine whether the completed item can be marked Done.
2. Determine whether priorities have changed.
3. Determine whether new work has been discovered.
4. Recommend updates before moving to the next backlog item.

Do not skip unfinished work unless a higher-priority issue is found.

## AI Execution Rules

Always work on only one backlog item at a time.

A backlog item is complete when:

- The targeted duplication has been removed.
- Existing helpers have been reused where appropriate.
- Behavior is unchanged.
- Validation passes.
- Documentation has been evaluated for updates.

Do not begin the next backlog item until the current one is complete.

## Current Direction

- Keep service setup and request mechanics behind `TestData` and domain helpers.
- Keep UI specs focused on browser-visible behavior.
- Prioritize changes that reduce repeated fixture paths, token plumbing, fixed waits, forced interactions, skipped tests, or broad exception handling.
- Update this file only when priorities, decisions, audit counts, or done signals materially change.

## Starting Point

Current active item:

- P2 UI reliability debt, next target `cypress/Shared/TestCasesPage.ts`

Why this is the best next step:

- Earlier CQL library service cleanup is already proven.
- `TestCasesPage.ts` fixture-path plumbing and create-test-case API setup now route through `TestData`.
- `CreateMeasurePage.ts` now routes user scope, fixture writes, and create or clone request setup through `TestData`, so that shared helper no longer owns custom measure-create request plumbing.
- `TestCaseBuilder.ts` now routes builder resource fixture naming through `TestData`, concentrating the remaining P1 value in a smaller number of shared helpers.
- Shared-helper request setup is now centralized behind `TestData` for the remaining reusable page-object and utility paths that previously owned custom user-scope, fixture, lock, share, and create-request plumbing.
- `MinimizeAlerts.cy.ts` now proves the alert-toggle readiness pattern by waiting on visible page state instead of fixed sleeps and by routing repeated minimize or reopen mechanics through `CQLEditorPage`.
- `CQLCodeSystem.cy.ts` now proves the editor-return readiness pattern by replacing fixed post-tab sleeps with visible editor assertions and retried error checks.
- `QmigSTU5FileValidations.cy.ts` now proves the export-archive readiness pattern by replacing post-unzip sleeps with extracted-file existence checks and by consolidating repeated export or unzip setup behind local helpers.
- `TestCaseJSON_TerminologyTests.cy.ts` now proves the JSON-editor readiness pattern by moving terminology cases onto shared editor-ready helpers instead of fixed sleeps before typing JSON content.
- `MeasureListNewColumnsSort.cy.ts` and `CQLLibraryListPageColumnSort.cy.ts` now prove a reusable list-sorting pattern that replaces fixed sleeps with route aliases plus shared list-render readiness helpers.
- `QICoreMeasureExport.cy.ts` now proves the export-file readiness pattern by waiting on the version dialog field and the unzipped local HTML file instead of fixed sleeps.
- `CQLEditorPage.ts` now proves the shared builder-expand and replace-document readiness pattern by replacing helper-level sleeps with editor focusability and document-ready checks that passed in both mismatch and Qi Core function editor flows.
- `QDMRunExecuteTC.cy.ts` now passes its focused execution-validation coverage after replacing three fixed waits with API-seeded setup, editor-ready saves, and explicit dirty-state handling.
- `CQLLibraryPage.ts` now passes focused version-action coverage after replacing its helper-level sleeps with action-trigger visibility and list-row readiness checks.
- `MeasureGroupPage.ts` no longer contains fixed waits after replacing helper-level CQL seeding sleeps with editor-write readiness, save-success assertions, and a stable return to Population Criteria via the existing editor-collapse control plus group-tab retry.
- Focused helper validation now shifts the best next value to `TestCasesPage.ts`, where remaining waits and heavy forced interactions overlap with the currently observed Expected/Actual sash-actionability failures.
- Focused Cypress validation on Tuesday, July 21, 2026 now proves the shared Expected/Actual helper path in `MeasureObservations.cy.ts`, `MeasureObservationExpectedValues.cy.ts`, `RatioPatientSingleIPNoMOwithDRC.cy.ts`, `BooleanAndNonBooleanExpectedValues.cy.ts`, `TestCaseExpectedValues.cy.ts`, `TestCasePopulationValues.cy.ts`, `CohortEpisodeEncounter.cy.ts`, `CohortPatientBoolean.cy.ts`, `CohortEncounter600.cy.ts`, `RatioEpisodeSingleIPNoMO.cy.ts`, `CVEpisodeWithMO.cy.ts`, `CVPatientwithMO.cy.ts`, `CVEpisodeWithStratification.cy.ts`, `CVPatientWithStratification.cy.ts`, `CohortPatientWithStratification.cy.ts`, `CohortEpisodeWithStratification.cy.ts`, `ProportionEpisode.cy.ts`, `RatioEncounterSingleIPWithMOs600.cy.ts`, `CVEncounterWithMOandStrat600.cy.ts`, `RatioEpisodeTwoIPsWithMOs.cy.ts`, `Cohort_ListQDMPositiveEncounterPerformed.cy.ts`, `Proportion_ListQDMPositiveProcedurePerformed.cy.ts`, and `ProportionPatient.cy.ts`. Local Cypress validation on Tuesday, July 21, 2026 also confirmed `CV_ListQDMPositiveEncounterPerformed_WithMOAndStratification.cy.ts`, `Ratio_EncounterPerformed_multipleCriterias_WithMO.cy.ts`, `Ratio_ListQDMPositiveEncounterPerformed_WithMO.cy.ts`, and `ExecuteTestCasesByNonMeasureOwner.cy.ts` passing after the shared helper update. `TestCasesPage.openExpectedActualTab(...)` now also tolerates QDM Expected/Actual layouts that do not render the split-panel population container, while still normalizing the Qi-Core split-panel scroll position when that container exists. The remaining value in this slice now shifts to non-smoke execution, import, and validation specs that still bypass the shared Expected/Actual helper path, while the product-question ratio observation files remain blocked on SME confirmation.
- An inventory sweep on Monday, July 20, 2026 found 55 Expected/Actual-touching WebInterface specs, with the highest migration risk concentrated in a smaller bucket of boolean-checkbox flows that still use direct tab clicks, raw checkbox actions, or clipped-checkbox visibility assertions. The current top targets are `RunAndExecuteTestCaseButtonValidations.cy.ts`, `MeasureObservationActualValues.cy.ts`, `ExecutionAndCoverageValidations.cy.ts`, `TestCaseExecutionWithCode.cy.ts`, and `QDMRatioMeasure_with_MOs_on_TC_AE_tab.cy.ts`. Keep `RatioPatientTwoIPsWithMOs.cy.ts` and `RatioPatientTwoIPsWithMOsUsingSameFunction.cy.ts` sidelined until product or SME confirmation resolves the observation-row behavior.

Work boundary for the next slice:

- Stay inside `cypress/Shared/TestCasesPage.ts` unless a very small consuming-spec adjustment is required to prove the helper change.
- Prioritize reusable readiness or layout helpers for Expected/Actual and related test-case editor flows before touching broader spec logic.
- Do not combine this slice with broader export, highlighting, or transfer refactors.

## Current State

Recently proven service/helper slices:

- Measure service: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QI Core Test-Cases.cy.ts`.
- QDM service: `QDM Test-Cases.cy.ts`, `QDM Measure.cy.ts`, `QDMMeasureVersion.cy.ts`.
- CQL library service: `CreateCQL-Library.cy.ts`, `EditCQL-Library.cy.ts`, `VersionAndDraftCQL-Library.cy.ts`, `CQLLibraryDelete.cy.ts`.
- Shared create/fixture path: `CreateMeasurePage.ts` now routes user scope, fixture writes, measure create/clone requests, and draft measure ID reads through `TestData` helpers.
- Shared cleanup/request helpers: `Utilities.deleteLibrary`, `Utilities` lock and unlock flows, and the `MeasureGroupPage.ts` API create, update, and stratification setup now route fixture reads and authenticated requests through `TestData`.
- Shared test-case helper cleanup: `TestCasesPage.ts` now routes element/test-case fixture writes, measure/test-case fixture reads, and create-test-case API requests through `TestData`.
- Shared validation proof: `QDM Measure.cy.ts` and `QI Core Test-Cases.cy.ts` now pass against the recent shared-helper conversions in the current workspace once Cypress is run with the invalid `NODE_EXTRA_CA_CERTS` placeholder unset.
- Shared sharing helper cleanup: `Utilities.setSharePermissions(...)` now delegates library and measure share or unshare request construction through `TestData`, and `CQLLibrarySharing.cy.ts` passes against that path in the current workspace.
- UI sort reliability proof: `MeasureListNewColumnsSort.cy.ts` now passes after replacing its fixed post-sort waits with route-alias and render-readiness checks, including status assertions tied to the sorted API responses instead of environment-specific row assumptions.
- UI sort reliability proof: `CQLLibraryListPageColumnSort.cy.ts` now passes after replacing its fixed post-sort waits with route-alias and render-readiness checks, including status assertions tied to the sorted API responses instead of environment-specific row assumptions.
- UI export reliability proof: `QICoreMeasureExport.cy.ts` now passes after replacing fixed waits with version-dialog visibility checks plus unzipped-file existence and local HTML readiness assertions for the human-readable export flows.
- UI QMIG export reliability proof: `QmigSTU5FileValidations.cy.ts` now passes after replacing repeated post-unzip sleeps with extracted-archive existence checks while preserving the existing archive-content assertions.
- UI alert reliability proof: `MinimizeAlerts.cy.ts` now passes after replacing navigation and alert re-open sleeps with visible-state assertions and shared `CQLEditorPage` minimize or reopen helpers.
- UI code-system reliability proof: `CQLCodeSystem.cy.ts` now passes after replacing repeated fixed waits with helper-backed editor-return assertions that let Cypress retry on the editor state instead of sleeping between tab switches.
- UI shared-editor reliability proof: `CQLEditorPage.ts` no longer contains fixed waits after replacing replace-document sleeps with focused editor clearing and builder-expand sleeps with document-ready retries, and both `MeasureLibraryMismatch.cy.ts` and `QiCoreCQLFunctions.cy.ts` pass against that shared path.
- UI terminology reliability proof: `TestCaseJSON_TerminologyTests.cy.ts` now passes after replacing repeated fixed waits before JSON editing with shared `TestCasesPage` JSON-editor readiness helpers used by both the spec and the custom command.
- UI QDM execution reliability proof: `QDMRunExecuteTC.cy.ts` now passes focused coverage for its three former fixed-wait paths after seeding valid CQL in API setup, reusing `CQLEditorPage.saveCql(...)` for editor-ready saves, and handling the test-case dirty-state modal explicitly before returning to the execution list.
- UI CQL library shared-page-object reliability proof: `CQLLibraryPage.ts` no longer contains fixed waits after replacing helper-level action-menu and first-row sleeps with trigger visibility plus row-readiness assertions, and `AddVersionToCQLLibrary.cy.ts` passes against both the list and edit-screen action-center flows.
- UI measure-group shared-page-object reliability proof: `MeasureGroupPage.ts` no longer contains fixed waits after consolidating repeated CQL setup behind editor-write and save-success assertions plus the existing editor-collapse control before returning to Population Criteria. Focused `MeasureObservations.cy.ts` validation on Monday, July 20, 2026 passed 7 tests, including `Add Measure Observations for Ratio Measure` and `Add Measure Observations for Continuous Variable Measure`; the remaining 2 failures were downstream Expected/Actual checkbox actionability issues caused by the test-case sash overlay, not by the measure-group helper path.
- UI Expected/Actual reliability proof: focused Cypress validation on Monday, July 20, 2026 showed `MeasureObservations.cy.ts` passing 9/9 after routing boolean Expected/Actual flows through `TestCasesPage.openExpectedActualTab(...)` plus `checkExpectedActualCheckbox(...)` and `uncheckExpectedActualCheckbox(...)`. The same helper path now also passes in `MeasureObservationExpectedValues.cy.ts` and `RatioPatientSingleIPNoMOwithDRC.cy.ts`, proving the sash-covered checkbox issue is a reusable split-panel readiness problem rather than a spec-local selector defect.
- UI Expected/Actual migration inventory: the Monday, July 20, 2026 scan identified 8 high-risk specs, 18 medium-risk specs, and 26 lower-risk specs still using some form of direct Expected/Actual tab interaction or raw checkbox flow. 27 specs are now proven on the shared helper path through focused or local validation: `MeasureObservations.cy.ts`, `MeasureObservationExpectedValues.cy.ts`, `RatioPatientSingleIPNoMOwithDRC.cy.ts`, `BooleanAndNonBooleanExpectedValues.cy.ts`, `TestCaseExpectedValues.cy.ts`, `TestCasePopulationValues.cy.ts`, `CohortEpisodeEncounter.cy.ts`, `CohortPatientBoolean.cy.ts`, `CohortEncounter600.cy.ts`, `RatioEpisodeSingleIPNoMO.cy.ts`, `CVEpisodeWithMO.cy.ts`, `CVPatientwithMO.cy.ts`, `CVEpisodeWithStratification.cy.ts`, `CVPatientWithStratification.cy.ts`, `CohortPatientWithStratification.cy.ts`, `CohortEpisodeWithStratification.cy.ts`, `ProportionEpisode.cy.ts`, `RatioEncounterSingleIPWithMOs600.cy.ts`, `CVEncounterWithMOandStrat600.cy.ts`, `RatioEpisodeTwoIPsWithMOs.cy.ts`, `Cohort_ListQDMPositiveEncounterPerformed.cy.ts`, `Proportion_ListQDMPositiveProcedurePerformed.cy.ts`, `ProportionPatient.cy.ts`, `CV_ListQDMPositiveEncounterPerformed_WithMOAndStratification.cy.ts`, `Ratio_EncounterPerformed_multipleCriterias_WithMO.cy.ts`, `Ratio_ListQDMPositiveEncounterPerformed_WithMO.cy.ts`, and `ExecuteTestCasesByNonMeasureOwner.cy.ts`.
- Shared auth/lock helper cleanup: `Utilities.ts` now routes share-permission requests plus measure/library/test-case lock and unlock-cleanup requests through `TestData` reads and authenticated request helpers.
- Shared measure cleanup completion: `Utilities.deleteMeasure` and `Utilities.deleteVersionedMeasure` now delegate authenticated delete flows to `TestData` by-ID helpers while preserving graceful missing-fixture cleanup behavior.
- Shared builder fixture cleanup: `TestCaseBuilder.ts` now routes builder resource fixture naming through `TestData`, so shared helpers own that user-scoped fixture convention.
- Shared CQL library fixture cleanup: `CQLLibraryPage.ts` now routes created-library fixture writes through `TestData` helpers instead of hard-coded `cqlLibraryId` fixture names.
- Shared test-case fixture cleanup: `TestCasesPage.ts` now routes `elementId`, `testCaseId`, and `testCasePId` fixture reads and writes through dedicated `TestData` helpers instead of raw fixture keys.
- Shared measure-group fixture cleanup: `MeasureGroupPage.ts` now routes standard `groupId` and `groupId2` fixture writes through `TestData` helpers instead of raw fixture names, while preserving the existing `measureGroupId` exception used by older consumers.

Recently diagnosed non-refactor failures:

- `CQLLibraryDelete.cy.ts` still fails on current `master` because transfer cases return inactive-user `400` responses and admin delete-all cases return `403 insufficient_scope`. Treat that as environment or account-state drift, not as the next refactor target.
- `CQLLibraryTransfer.cy.ts` currently mixes two separate issues on `dev`: transfer and sharing flows can fail with `400 The provided HARP ID is not associated with an active MADiE user.` for the configured alt user, and the owned-library action-center flow remains slow and intermittently fails on action visibility or missing success toast after long UI login/user-switch cycles. Treat the inactive-user path as environment or account-state drift first; do not attempt session-login conversion in this file until that is resolved.
- `Measure.cy.ts` still has a non-refactor service failure on July 16, 2026 in `Validation Error: CQL library Name contains special characters`, where the service returns `500` instead of the expected `400` while other measure-service validation paths stay green.

## Latest Audit Signal

Command: `npm run quality:no-focused-tests` on 2026-07-21

- Inventory: 256 specs / 65547 spec lines; 29 shared files / 18778 shared lines; 3 support files / 633 support lines; 9 scripts / 1511 script lines.
- Skipped tests: 11.
- Manual fixture path plumbing: 191.
- Manual access token plumbing: 87.
- Fixed waits: 38.
- Forced interactions: 193.
- Global uncaught exception suppression: 1.

Largest risk concentrations:

- `MeasureGroupPage.ts` dropped out of the fixed-wait hotspot list after its three helper sleeps were replaced with editor-ready and save-success assertions that held in focused measure-observation coverage on Monday, July 20, 2026.
- `OktaLogin.ts` and `TestCasesPage.ts` now carry the remaining shared-helper fixed waits.
- `QDMRunExecuteTC.cy.ts` dropped out of the fixed-wait hotspot list after its three execution waits were replaced with editor-ready and modal-aware assertions that held in focused Cypress validation on Friday, July 17, 2026.
- `CQLLibraryPage.ts` dropped out of the fixed-wait hotspot list after its two helper sleeps were replaced with shared action-trigger and row-readiness assertions that held in focused Cypress validation on Friday, July 17, 2026.
- `TestCasesPage.ts`: remaining UI reliability debt from forced interactions and the remaining non-smoke Expected/Actual execution, import, and validation specs that still bypass the shared helper path; fixture-path and create-test-case API setup cleanup is complete.
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

- shared page objects with remaining waits and high reuse: `OktaLogin.ts`, `TestCasesPage.ts`
- `TestCasesPage.ts` Expected/Actual and editor flows now also carry the most actionable downstream forced-interaction debt, but the shared helper path is now proven across the smoke-folder rollout plus `ExecuteTestCasesByNonMeasureOwner.cy.ts`, including both Qi-Core split-panel and QDM non-panel Expected/Actual layouts
- the next Expected/Actual adoption wave should focus on non-smoke execution, import, and validation specs such as `RunAndExecuteTestCaseButtonValidations.cy.ts`, `MeasureObservationActualValues.cy.ts`, `ExecutionAndCoverageValidations.cy.ts`, `TestCaseExecutionWithCode.cy.ts`, and the remaining QDM execution specs
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
