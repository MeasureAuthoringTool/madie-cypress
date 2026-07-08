# MADiE Cypress Quality Architecture Backlog

Last updated: 2026-07-08

## Stewardship Guidelines

This document is a repo-owned quality architecture artifact, not a scratchpad.
It exists to help the team make visible, repeatable decisions about test architecture,
pipeline confidence, refactor sequencing, and reliability risk.

Keep it curated:

- Track priorities, decisions, validation rules, and done signals.
- Keep run-by-run noise out unless a result changes the plan or exposes a durable risk.
- Link work back to quality outcomes: speed, isolation, reuse, diagnosability, reliability, or pipeline signal.
- Prefer small, proven helper moves over broad framework rewrites.
- Reprioritize after meaningful slices; do not let stale plans become invisible policy.
- Preserve intentional exceptions with a reason, so future cleanup does not erase useful coverage.
- Keep negative-state tests explicit, even when request setup moves behind helpers.
- Treat this backlog as shared SDET architecture guidance during PR review and planning.

Suggested maintenance rhythm:

- Update after each committed refactor slice.
- Refresh quality-audit counts when they materially change.
- Move completed proof points into Current State and remove low-value historical detail.
- Open a follow-up ticket or issue when a risk needs product or pipeline ownership outside this repo.

## Executive Direction

The suite is moving toward a layered test architecture:

- Service specs set up and verify service behavior through APIs.
- UI specs use the browser only for UI behavior: navigation, rendering, editor behavior, permissions, and user interaction.
- `TestData` is the service-test contract for domain actions, fixture paths, access tokens, IDs, and common requests.
- Page objects should not own service setup mechanics.
- Large specs should be split by behavior only after shared setup/data helpers are stable.
- Quality gates should make risk visible: focused tests, skipped tests, fixture plumbing, token plumbing, fixed waits, forced interactions, and global exception suppression.

## Current State

The service-test boundary is now materially stronger and more consistent.

- `TestData.saveMeasureCql` supports QI-Core, QDM, owner, and alternate-owner valid-CQL setup.
- `TestData.expectSavedMeasureCql` centralizes saved-CQL response assertions.
- `TestData.readCurrentMeasureContext`, `updateCurrentMeasure`, `requestMeasureById`, `requestMeasureBundle`, `requestMeasureExport`, `requestMeasureDraft`, `requestDraftStatus`, `requestMeasureTestCase`, `requestMeasureTestCaseList`, `requestAdminMeasureDelete`, and `requestMeasureGroupById` now cover the main service-boundary actions the suite was hand-rolling before.
- `CreateMeasurePage.ts` now writes fixtures through `TestData.writeFixture` and routes measure create/clone requests through `TestData.requestWithAccessToken`.

Recently proven service slices:

- `Measure.cy.ts`
- `MeasureBundle.cy.ts`
- `MeasureExport.cy.ts`
- `DraftMeasure.cy.ts`
- `MeasureVersion.cy.ts`
- `QI Core Test-Cases.cy.ts`
- `QDM Test-Cases.cy.ts`
- `QDM Measure.cy.ts`
- `QDMMeasureVersion.cy.ts`

These slices removed repeated token reads, fixture-path plumbing, and inline request setup while keeping negative-state assertions explicit and focused runs green.

Intentional exceptions:

- `QDMMeasureVersion.cy.ts` keeps the invalid-CQL UI save path because that scenario validates CQL error persistence.
- `DeleteCMSID.cy.ts` uses edit mode for CMS ID generation; it is not leftover saved-CQL setup.

## Quality Baseline

Latest `node scripts/quality-audit.js` signal:

- 256 specs, about 66.1k spec lines.
- 11 skipped tests.
- 293 manual fixture-path plumbing hits.
- 150 manual access-token plumbing hits.
- 101 fixed waits.
- 195 forced interactions.
- 1 global uncaught exception suppression.

Largest current risk areas:

- Shared helpers and page-object infrastructure: `TestCasesPage.ts`, `MeasureGroupPage.ts`, `CreateMeasurePage.ts`, and `Utilities.ts`.
- CQL library service specs still lead the remaining service-side token plumbing.
- Admin cleanup and a few measure/test-case service leftovers still carry manual fixture reads.
- UI reliability debt now outweighs most service setup debt: fixed waits, forced interactions, skipped tests, and global exception suppression.

## Replan Rules

After each meaningful slice:

- Re-check the quality audit, current diff, and recent failures.
- Prefer changes that remove a class of duplication across many specs.
- Record the impact hypothesis before editing.
- Validate with static checks and at least one focused spec that exercises the changed path.
- Commit once a boundary is proven so the next experiment starts clean.
- Deprioritize changes that only make code prettier without improving speed, isolation, reuse, or diagnosability.

## Action Plan

### Completed Proof Points

- Saved-CQL API setup is established through `TestData.saveMeasureCql`.
- Current-measure updates are established through `TestData.updateCurrentMeasure`.
- Test-case service requests are established through `TestData.requestMeasureTestCase` and `TestData.requestMeasureTestCaseList`.
- Measure-group API setup is established through `TestData.requestMeasureGroup`.
- Version, draft, export, bundle, admin-delete, and measure-by-id helper paths have all been proven by focused service-spec runs.

### Priority 1: CQL Library Service Cleanup

Why this is next:

- CQL library service specs now dominate the remaining manual access-token plumbing counts.
- The service-side measure/QDM refactors have proven the helper direction, so the next best payoff is to apply the same discipline to library endpoints.

First targets:

- `CreateCQL-Library.cy.ts`
- `CQLLibraryDelete.cy.ts`
- `EditCQL-Library.cy.ts`
- `VersionAndDraftCQL-Library.cy.ts`

Definition of done:

- Repeated token/header/request setup moves behind shared helpers.
- Negative authorization and validation states remain explicit.
- Focused library specs pass or produce diagnosed non-refactor failures.

### Priority 2: Shared Helper and Infrastructure Hardening

Why this is next:

- The remaining fixture-path smell is now concentrated more in shared support files than in the newly cleaned service specs.
- `TestCasesPage.ts`, `MeasureGroupPage.ts`, `CreateMeasurePage.ts`, and `Utilities.ts` still carry too much user-path and request-mechanics knowledge.

First targets:

- replace remaining hand-built fixture paths with `TestData` helpers
- reduce duplicate owner-selection logic
- narrow page-object responsibilities so service setup stays in service helpers

Definition of done:

- Shared helpers own path conventions and common request setup.
- Page objects stop teaching service setup patterns by accident.
- No broad framework rewrite; small, proven helper moves only.

### Priority 3: UI Reliability Debt

Why it has moved up:

- Service setup debt is no longer the dominant source of noise.
- Fixed waits, forced interactions, skipped tests, and blanket exception suppression now carry more flake risk than the remaining service plumbing.

First targets:

- fixed waits in list sorting, export, and terminology-heavy specs
- forced interactions in `TestCasesPage.ts`, import validations, highlighting specs, and editor flows
- global uncaught exception suppression in `cypress/support/e2e.ts`
- skipped tests that need owner/ticket/remove decisions

Definition of done:

- waits are replaced by route aliases, visible/enabled assertions, or purposeful polling
- forced interactions are reduced where readiness/selector fixes are possible
- exception handling becomes targeted instead of blanket

### Priority 4: Remaining Service Tail Cleanup

Why it is lower now:

- The highest-value measure/QDM service specs have already been converted.
- Remaining service cleanup is now more incremental than transformational.

Next candidates:

- `DeleteTest-Case.cy.ts`
- Admin service leftovers such as `CorrectExpectedValues.cy.ts`
- any residual measure/test-case specs that still surface near the top of the audit after each batch

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
- Measure setup helper: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `QDM Measure.cy.ts`.
- Draft/version helpers: `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QDMMeasureVersion.cy.ts`.
- Test-case helpers: `QI Core Test-Cases.cy.ts`, `QDM Test-Cases.cy.ts`, `TestCaseImport.cy.ts`, `DeleteTest-Case.cy.ts`.
- Shared action/page-object changes: include a relevant WebInterface smoke or editor spec.

## Done Signals

A refactor slice is done when:

- The spec intent is clearer than before.
- Repeated fixture/token/request mechanics moved behind a named helper.
- Negative states are still explicit.
- Static checks pass.
- A focused spec covering the changed helper path passes.
- The backlog is updated only with new decisions, not run-by-run noise.
