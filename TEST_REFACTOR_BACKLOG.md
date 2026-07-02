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

## Quality Baseline

Latest `npm run quality:no-focused-tests` signal:

- 256 specs, about 67.8k spec lines.
- 11 skipped tests.
- 412 manual fixture-path plumbing hits.
- 248 manual access-token plumbing hits.
- 95 fixed waits.
- 195 forced interactions.
- 1 global uncaught exception suppression.

Largest current risk areas:

- `CreateMeasurePage.ts`: shared setup infrastructure with heavy fixture/token mechanics.
- `Measure.cy.ts`, `MeasureBundle.cy.ts`, `DraftMeasure.cy.ts`: high-volume service specs still carrying plumbing noise.
- `DraftMeasure.cy.ts`, `MeasureExport.cy.ts`, and CQL library service specs still show token plumbing and are good follow-on candidates.
- UI reliability debt: fixed waits, forced interactions, skipped tests, and global exception suppression.

## Replan Rules

After each meaningful slice:

- Re-check the quality audit, current diff, and recent failures.
- Prefer changes that remove a class of duplication across many specs.
- Record the impact hypothesis before editing.
- Validate with static checks and at least one focused spec that exercises the changed path.
- Commit once a boundary is proven so the next experiment starts clean.
- Deprioritize changes that only make code prettier without improving speed, isolation, reuse, or diagnosability.

## Next Moves

1. **Checkpoint current helper consolidation.**
    - Done in `e481e666`.
    - Impact: locked in a suite-wide convention for persisted saved-CQL setup assertions.

2. **Move setup mechanics behind `TestData`.**
    - Impact hypothesis: reduce fixture/token plumbing inherited from `CreateMeasurePage.ts` and shrink repeated service setup across bundle, export, version, draft, and test-case specs.
    - First shape: create measure, optionally create group, optionally save CQL, and expose useful IDs/responses.
    - Guardrail: preserve current public helper signatures at first.

3. **Refactor `CreateMeasurePage.ts` internals.**
    - Impact hypothesis: this is infrastructure debt; improving it reduces smell counts across many specs without broad call-site churn.
    - First slice done: direct measure/version/measureSet fixture writes now use `TestData.writeFixture`.
    - Second slice done: direct access-token request plumbing now uses `TestData.requestWithAccessToken`.
    - Proof: `npm run compile`, `npm run quality:no-focused-tests`, `git diff --check`, `MeasureTranslatorVersion.cy.ts`, `QDM Test-Cases.cy.ts`, `ViewHumanReadable.cy.ts`, and `MeasureBundle.cy.ts` passed.
    - Note: `ViewHumanReadable.cy.ts` and `MeasureBundle.cy.ts` initially failed during parallel execution because the user pool was exhausted before test setup; both passed when rerun sequentially.
    - Note: `CloneMeasureAPI` was migrated but has no current call sites under `cypress/`.
    - Next slice: extract common create-measure response handling or introduce a typed create-measure response.

4. **Probe `EditMeasure.cy.ts` before editing.**
    - Impact hypothesis: it is a high-payoff giant spec, but it likely mixes several behavior families.
    - Probe result: four behavior groups are present: base edit behavior, non-owner RA behavior, edit validations, and measurement-period validations.
    - First slice done: added `TestData.readCurrentMeasureContext` and `TestData.updateCurrentMeasure`.
    - Second slice done: added a local updated-measure body builder, then migrated the simple metadata cases and metadata risk-adjustment updates.
    - Third slice done: finished the remaining base edit update scenarios: endorser fields, scoring precision, intended venue, and purpose.
    - Fourth slice done: migrated the non-owner RA scenario through `TestData.updateCurrentMeasure` with `failOnStatusCode: false`.
    - Fifth slice done: migrated edit and measurement-period validation groups while keeping each expected message explicit.
    - Proof: `npm run compile`, `npm run quality:no-focused-tests`, `git diff --check`, and focused `EditMeasure.cy.ts` passed.
    - Current state: service-plumbing refactor is complete for this spec.

5. **Move the same service-test pattern to the next high-volume specs.**
    - Next candidates by audit signal: `QI Core Test-Cases.cy.ts`, `Measure.cy.ts`, `MeasureBundle.cy.ts`, `DraftMeasure.cy.ts`, and `MeasureExport.cy.ts`.
    - First `QI Core Test-Cases.cy.ts` slice done: added `TestData.requestMeasureTestCase`, then migrated the non-owner edit permission scenario.
    - Second `QI Core Test-Cases.cy.ts` slice done: migrated create, edit, get-all, and get-specific endpoint cases onto `TestData.requestMeasureTestCase`.
    - Third `QI Core Test-Cases.cy.ts` slice done: migrated endpoint validation, JSON validation, duplicate title/group validation, bad-token setup, and bulk list authorization paths.
    - Fourth `QI Core Test-Cases.cy.ts` slice done: collapsed repeated measure-group/test-case population setup behind local builders and `TestData.requestMeasureGroup`.
    - Static proof after the full-file pass: `npm run compile`, `npm run quality:no-focused-tests`, and `git diff --check` passed.
    - Focused `QI Core Test-Cases.cy.ts` still needs to be rerun after the full-file pass; earlier focused run passed 20/20 before the last population setup cleanup.
    - Next target: move the pattern into `Measure.cy.ts` or `MeasureBundle.cy.ts`, whichever gives the larger shared helper surface after a quick probe.

6. **Then address UI reliability debt.**
    - Fixed waits: list sorting, CQL editor, export, and terminology-heavy specs.
    - Forced interactions: `TestCasesPage.ts`, import validations, measure highlighting, RTE fields, and editor validation specs.
    - Global exception suppression: replace blanket suppression with targeted known-error handling.
    - Skipped tests: add owner/ticket or remove obsolete skips.

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
