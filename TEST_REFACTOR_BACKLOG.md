# MADiE Cypress Refactor Backlog

Last updated: 2026-07-02

## Executive Direction

The suite is moving toward a layered test architecture:

- Service specs set up and verify service behavior through APIs.
- UI specs use the browser only for UI behavior: navigation, rendering, editor behavior, permissions, and user interaction.
- `TestData` is the service-test contract for domain actions, fixture paths, access tokens, IDs, and common requests.
- Page objects should not own service setup mechanics.
- Large specs should be split by behavior only after shared setup/data helpers are stable.
- Quality gates should make risk visible: focused tests, skipped tests, fixture plumbing, token plumbing, fixed waits, forced interactions, and global exception suppression.

## Current State

The saved-CQL service boundary is mostly established.

- `TestData.saveMeasureCql` now supports QI-Core, QDM, owner, and alternate-owner valid-CQL setup.
- `TestData.expectSavedMeasureCql` centralizes the saved-CQL response assertion.
- Service/admin specs no longer open the CQL editor just to create valid saved CQL, except for intentional negative-state coverage.
- `ViewHumanReadable.cy.ts` proved we can replace UI version/draft setup with API version/draft calls when the endpoint under test is service-level output.
- `Measure.cy.ts` proved the payoff: removing UI CQL-save setup reduced runtime from about 17 minutes to under 2 minutes.

Intentional exceptions:

- `QDMMeasureVersion.cy.ts` keeps the invalid-CQL UI save path because that scenario validates CQL error persistence.
- `DeleteCMSID.cy.ts` uses edit mode for CMS ID generation; it is not leftover saved-CQL setup.

Latest infrastructure batch:

- `CreateMeasurePage.ts` now writes measure fixtures through `TestData.writeFixture` instead of hand-built fixture paths.
- `CreateMeasurePage.ts` now sends measure create/clone requests through `TestData.requestWithAccessToken`.
- Fixture-path smell count dropped by 49 in the latest infrastructure slice.
- Access-token smell count dropped by 7 in the latest infrastructure slice.
- This backlog cleanup now keeps only decisions, current state, validation guidance, and done signals.

Latest service-spec batch:

- `TestData.readCurrentMeasureContext` centralizes the current measure/version fixture lookup.
- `TestData.updateCurrentMeasure` centralizes current-measure `PUT` requests and bearer-token handling.
- `TestData.requestMeasureTestCase` now centralizes current-measure test-case requests while still allowing owner-scoped fixture reads and current-session authorization.
- `EditMeasure.cy.ts` now has a local updated-measure body builder for repeated metadata update payloads.
- The base edit behavior group now uses the helper instead of repeating token, measure-id, version-id, request, and payload plumbing.
- The non-owner RA scenario now uses the same helper with `failOnStatusCode: false`, proving the helper supports expected negative service responses.
- Edit and measurement-period validation groups now express only the invalid input and expected response while `TestData` owns request setup.
- `EditMeasure.cy.ts` no longer appears in the audit's top manual fixture-path or access-token plumbing lists.
- `EditMeasure.cy.ts` passed focused sanity after completing the validation groups: 25 passing, 0 failing.
- `QI Core Test-Cases.cy.ts` now uses `TestData.requestMeasureTestCase` and `TestData.requestMeasureTestCaseList` for test-case service endpoints, negative authorization flows, validation cases, JSON validation, and duplicate title/group checks.
- Repeated QI-Core measure-group setup in `QI Core Test-Cases.cy.ts` now uses a local group body builder plus `TestData.requestMeasureGroup`, removing direct token, env-user, and fixture-path plumbing from the spec.
- `QI Core Test-Cases.cy.ts` dropped from about 1,351 lines before the service-test cleanup to 748 lines after the full-file pass.
- Focused `QI Core Test-Cases.cy.ts` passed after the full-file pass: 20 passing, 0 failing, 1 minute 24 seconds.
- `Measure.cy.ts` first refactor slice moved create-measure validation groups through `TestData.requestMeasure`, removed a hidden global `model` mutation, and added a working non-parallel single-spec script shape.
- Focused `Measure.cy.ts` passed after this slice: 36 passing, 0 failing, 1 minute 36 seconds.
- `Measure.cy.ts` update/delete slice added reusable measure-by-id and admin-delete request helpers, removed another layer of token/fixture plumbing, and kept the negative authorization checks explicit.
- Focused `Measure.cy.ts` after the update/delete slice: 35 passing, 1 failing, 1 minute 54 seconds. The migrated update/delete and admin-delete behaviors passed; the lone failure was `Validation Error: CQL library Name contains special characters`, which returned a service `500` instead of the expected `400`. The prior focused run at `14:14:55` had 36 passing, including this same validation, so this is tracked as a likely underlying service/environment response rather than a refactor regression.
- `Measure.cy.ts` admin-delete cleanup migrated versioning, admin delete, owner-read verification, and non-owner delete-action checks through `TestData`; direct cookie/fixture auth plumbing in the file is now zero.
- Focused `Measure.cy.ts` after the completed admin-delete cleanup: 35 passing, 1 failing, 1 minute 40 seconds. All refactored update/delete and admin-delete checks passed; the repeated failure remains the special-character CQL library validation returning service `500` instead of expected `400`.
- `MeasureBundle.cy.ts` first slice added `TestData.requestMeasureBundle`, reused `TestData.requestMeasure` for direct create setup, and started moving group setup through `TestData.requestMeasureGroup`.
- `MeasureBundle.cy.ts` cleanup completed the remaining raw bundle/group/update request migration; focused run passed: 12 passing, 0 failing, 1 minute 14 seconds.

## Quality Baseline

Latest `npm run quality:no-focused-tests` signal:

- 256 specs, about 67.0k spec lines.
- 11 skipped tests.
- 369 manual fixture-path plumbing hits.
- 197 manual access-token plumbing hits.
- 95 fixed waits.
- 195 forced interactions.
- 1 global uncaught exception suppression.

Largest current risk areas:

- `CreateMeasurePage.ts`, `MeasureGroupPage.ts`, and `TestCasesPage.ts`: shared setup/page-object infrastructure still carries fixture path and interaction mechanics.
- `DraftMeasure.cy.ts`, `MeasureExport.cy.ts`, QDM service specs, and CQL library service specs still show token/fixture plumbing and are good follow-on candidates.
- `Measure.cy.ts` and `MeasureBundle.cy.ts` are now proof points rather than top plumbing risks.
- UI reliability debt: fixed waits, forced interactions, skipped tests, and global exception suppression.

## Replan Rules

After each meaningful slice:

- Re-check the quality audit, current diff, and recent failures.
- Prefer changes that remove a class of duplication across many specs.
- Record the impact hypothesis before editing.
- Validate with static checks and at least one focused spec that exercises the changed path.
- Commit once a boundary is proven so the next experiment starts clean.
- Deprioritize changes that only make code prettier without improving speed, isolation, reuse, or diagnosability.

## Action Plan

### Completed Foundation

- Saved-CQL API setup is established through `TestData.saveMeasureCql`.
- Current-measure updates are established through `TestData.updateCurrentMeasure`.
- Test-case service requests are established through `TestData.requestMeasureTestCase` and `TestData.requestMeasureTestCaseList`.
- Measure-group API setup is usable through `TestData.requestMeasureGroup`.
- `EditMeasure.cy.ts`, `QI Core Test-Cases.cy.ts`, and the first `Measure.cy.ts` slice are proof points that service specs can be made smaller, faster, and easier to diagnose without changing coverage intent.

### Priority 1: Probe And Refactor `Measure.cy.ts`

Impact hypothesis:

- `Measure.cy.ts` is now 798 lines after the validation, update/delete, and admin-delete cleanup slices.
- Direct access-token reads dropped from 34 to 0 and direct fixture path hits dropped from 21 to 0.
- It has now proven reusable `TestData` helpers for create, read, update-by-id, version, test-case, saved-CQL, admin-delete, and delete-action flows.

First moves:

- Done: migrated create-measure validation groups, measurement period validations, eCQM title validations, duplicate CQL-library-name validation, and bad-token setup.
- Done: removed hidden shared-state coupling where the invalid-model test mutated the global `model` value and caused downstream update/delete failures.
- Done: migrated update/delete status checks through `TestData.readMeasure`, `TestData.requestMeasureById`, `TestData.readCurrentMeasureContext`, and `TestData.requestMeasureTestCase`.
- Done: added `TestData.requestAdminMeasureDelete` as the next shared helper for admin-delete cleanup.
- Done: migrated remaining admin-delete manual version/delete/read calls through `TestData.versionMeasure`, `TestData.requestAdminMeasureDelete`, `TestData.readMeasure`, and `TestData.requestMeasureDeleteAction`.
- Next: leave `Measure.cy.ts` unless the focused run exposes a refactor-specific regression; move the next high-impact service cleanup to `MeasureBundle.cy.ts`.
- Guardrail: keep the special-character CQL library validation failure visible as an API `500` investigation; do not weaken the expected `400` assertion just to make the pipeline green.

Validation:

- `npm run compile`
- `npm run quality:no-focused-tests`
- `git diff --check`
- Focused `Measure.cy.ts`

### Priority 2: Refactor `MeasureBundle.cy.ts`

Impact hypothesis:

- `MeasureBundle.cy.ts` dropped from 1,103 to 888 lines after the completed bundle-helper slice.
- It no longer has direct `cy.request`, direct access-token reads, or direct fixture-path reads in the spec.
- Bundle tests are likely close to export/version setup patterns, so the helper work here should pay forward into `MeasureExport.cy.ts` and draft/version specs.

First moves:

- Done: add `TestData.requestMeasureBundle` and migrate repeated bundle GET assertions.
- Done: replace direct create-measure POST setup in bundle edge cases with `TestData.requestMeasure`.
- Done: replace remaining manual group POST setup with `TestData.requestMeasureGroup`.
- Done: migrate metadata update through `TestData.readCurrentMeasureContext`, `TestData.readMeasureGroupId`, and `TestData.updateMeasure`.
- Next: carry the same service-boundary helpers into `MeasureExport.cy.ts` or `DraftMeasure.cy.ts`.

Validation:

- `npm run compile`
- `npm run quality:no-focused-tests`
- `git diff --check`
- Focused `MeasureBundle.cy.ts`

### Priority 3: Service Setup Helper Hardening

Impact hypothesis:

- The remaining service specs keep rebuilding the same world: measure, group, CQL, version, draft, export IDs.
- A small setup facade in `TestData` can reduce repeated setup while keeping public page-object signatures stable.

Candidate helper shapes:

- `TestData.createMeasureContext`
- `TestData.createMeasureGroupContext`
- `TestData.requestCurrentMeasure`
- `TestData.requestMeasureExport`
- typed response aliases for create/update/version flows

Guardrails:

- Do not create a broad framework before `Measure.cy.ts` and `MeasureBundle.cy.ts` prove the shape.
- Keep negative authorization tests explicit.
- Keep UI page objects out of service setup internals.

### Priority 4: QDM Test Case Parity

Impact hypothesis:

- `QDM Test-Cases.cy.ts` still appears in both fixture-path and token plumbing counts.
- The QI-Core test-case helper work should transfer cleanly, but QDM-specific body shape and measure setup need a probe first.

First moves:

- Compare QDM test-case endpoint bodies against the new QI-Core helper.
- Reuse `requestMeasureTestCase` where endpoint shape matches.
- Add QDM-specific helper only if the body/setup shape genuinely differs.

### Priority 5: UI Reliability Debt

Impact hypothesis:

- Fixed waits and forced interactions now dominate the next quality risk once service plumbing is under control.
- These failures are more likely to be flaky and user-visible than the remaining service setup noise.

First targets:

- Fixed waits: list sorting, CQL editor, export, and terminology-heavy specs.
- Forced interactions: `TestCasesPage.ts`, import validations, measure highlighting, RTE fields, and editor validation specs.
- Global exception suppression: replace blanket suppression with targeted known-error handling.
- Skipped tests: add owner/ticket or remove obsolete skips.

## Immediate Next Slice

Move the next bigger impact to `MeasureExport.cy.ts` or `DraftMeasure.cy.ts`, using the now-proven bundle/version/current-measure helpers.

Definition of done for the next slice:

- `MeasureBundle.cy.ts` focused run remains green after helper migration.
- Next target probe identifies repeated setup/request shapes before any broad helper is added.
- Static checks pass.
- Backlog is updated with the helper decision and measured audit impact.

## Validation Set

Run these for helper/service-boundary work:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/ViewHumanReadable.cy.ts"
```

Add focused specs based on the touched area:

- Saved-CQL helper: `MeasureTranslatorVersion.cy.ts`, `QDM MeasureGroup.cy.ts`.
- Measure setup helper: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`.
- Draft/version helpers: `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QDMMeasureVersion.cy.ts`.
- Test-case helpers: `QI Core Test-Cases.cy.ts`, `QDM Test-Cases.cy.ts`, `TestCaseImport.cy.ts`.
- Shared action/page-object changes: include a relevant WebInterface smoke or editor spec.

## Done Signals

A refactor slice is done when:

- The spec intent is clearer than before.
- Repeated fixture/token/request mechanics moved behind a named helper.
- Negative states are still explicit.
- Static checks pass.
- A focused spec covering the changed helper path passes.
- The backlog is updated only with new decisions, not run-by-run noise.
