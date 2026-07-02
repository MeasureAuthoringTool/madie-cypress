# MADiE Cypress Refactor Backlog

Last updated: 2026-07-01

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

Current uncommitted batch:

- `CreateMeasurePage.ts` now writes measure fixtures through `TestData.writeFixture` instead of hand-built fixture paths.
- Fixture-path smell count dropped by 49 in the latest infrastructure slice.
- This backlog cleanup now keeps only decisions, current state, validation guidance, and done signals.

## Quality Baseline

Latest `npm run quality:no-focused-tests` signal:

- 256 specs, about 69k spec lines.
- 11 skipped tests.
- 509 manual fixture-path plumbing hits.
- 311 manual access-token plumbing hits.
- 95 fixed waits.
- 195 forced interactions.
- 1 global uncaught exception suppression.

Largest current risk areas:

- `CreateMeasurePage.ts`: shared setup infrastructure with heavy fixture/token mechanics.
- `EditMeasure.cy.ts`: large service spec with repeated request/auth plumbing.
- `QI Core Test-Cases.cy.ts`, `Measure.cy.ts`, `MeasureBundle.cy.ts`: high-volume service specs still carrying plumbing noise.
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
    - Proof: `npm run compile`, `npm run quality:no-focused-tests`, `git diff --check`, and focused `MeasureTranslatorVersion.cy.ts` passed.
    - Next slice: replace direct token/request plumbing with `TestData.requestWithAccessToken` where safe.

4. **Probe `EditMeasure.cy.ts` before editing.**
    - Impact hypothesis: it is a high-payoff giant spec, but it likely mixes several behavior families.
    - First slice: classify describe blocks and pick one repeated request/auth pattern to extract.

5. **Then address UI reliability debt.**
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
