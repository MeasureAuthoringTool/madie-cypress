# MADiE Cypress Automation Guidelines

Last updated: 2026-07-20

This guide captures stable test-architecture rules used in this repo. Keep tactical plans and changing counts in `docs/quality/test-refactor-backlog.md`.

## Source of Truth

- Do not add guidance here from memory. Add only rules proven by committed code, audit output, focused runs, or team decision.
- Keep this file stable and short. Move run-by-run notes, temporary targets, and changing counts to the backlog.
- Preserve intentional exceptions with the reason and owning scenario.
- During PR review, link changes to quality outcomes: speed, isolation, reuse, diagnosability, reliability, or pipeline signal.

## Test Boundaries

- Service specs under `cypress/e2e/Services/` should set up and verify service behavior through APIs.
- UI specs under `cypress/e2e/WebInterface/` should use the browser for UI behavior: navigation, rendering, editor behavior, permissions, and user interaction.
- Page objects should not own service setup mechanics.
- Split large specs by behavior only after shared setup and data helpers are stable.

## Shared Test Data Rules

- Use `TestData` as the service-test contract for domain actions, fixture paths, selected users, access tokens, IDs, and common requests.
- Prefer `TestData.fixturePath`, `readFixture`, `writeFixture`, `readMeasureId`, `readCqlLibraryId`, `readTestCaseId`, and related ID helpers over hand-built `cypress/fixtures/...` paths.
- Prefer `TestData.withAccessToken`, `requestWithAccessToken`, and domain request helpers over inline `cy.getCookie('accessToken')` request setup.
- Keep negative authorization, validation, and error-state assertions explicit even when setup moves behind helpers.
- Use owner-aware helpers for `selectedUser` and `selectedAltUser` so parallel user allocation stays centralized.

## Established Helper Paths

These helper paths are already established and should be reused before adding new request plumbing:

- Measure setup and reads: `requestMeasure`, `readMeasure`, `requestMeasureById`, `updateMeasure`, `updateCurrentMeasure`.
- CQL save and translation: `saveMeasureCql`, `expectSavedMeasureCql`, `translateFhirCql`, `translateQdmCql`.
- Measure lifecycle: `requestMeasureBundle`, `requestMeasureExport`, `requestMeasureDraft`, `requestDraftStatus`, `versionMeasure`, `requestAdminMeasureDelete`, `requestMeasureDeleteAction`.
- Measure groups and test cases: `requestMeasureGroup`, `requestMeasureGroupById`, `requestMeasureGroupStratification`, `requestMeasureTestCase`, `requestMeasureTestCaseList`, `requestTestCaseImports`.
- CQL library service work: `requestCqlLibrary`, `readCqlLibrary`, `requestCqlLibraryById`, `updateCqlLibrary`, `updateCurrentCqlLibrary`, `searchCqlLibraries`, `versionCqlLibrary`, `draftCqlLibrary`, `requestVersionedCqlLibrary`.

## Reliability Rules

- Do not commit focused tests. `npm run quality:no-focused-tests` is the guardrail.
- Skipped tests need an owner, ticket, or removal decision.
- Replace fixed numeric waits with route aliases, visible/enabled assertions, or purposeful polling helpers.
- Use `{ force: true }` only when validating intentionally hidden or native controls; otherwise fix readiness or selector strategy.
- Avoid global exception suppression. If an exception must be tolerated, make the handling targeted and explain the scope.
- Prefer stable `data-testid` selectors when available.
- When a spec creates uniquely named rows in a list, select those rows by generated name or stored ID instead of fixture-position helpers or table order. Row-order selection becomes flaky when cleanup is partial or older test data is still visible.
- In Expected/Actual test-case flows, prefer `TestCasesPage.openExpectedActualTab(...)` plus `checkExpectedActualCheckbox(...)` or `uncheckExpectedActualCheckbox(...)` over direct tab clicks and raw boolean checkbox actions. On Monday, July 20, 2026, focused Cypress validation showed the split-panel sash can leave expected-value checkboxes clipped or reported as covered even when the selector is correct. Avoid pre-asserting `be.visible` on those clipped boolean inputs; rely on the shared helper to normalize the panel first.

## Refactor Rules

- Prefer small helper moves that remove repeated mechanics across multiple specs.
- Do not broaden framework abstractions unless they remove real duplication or align with an established local pattern.
- Keep setup helpers named around domain behavior, not implementation steps.
- Avoid changes that only make code prettier without improving speed, isolation, reuse, diagnosability, or reliability.
- When a helper changes a shared path, validate with static checks and at least one focused spec that exercises that path.

## Validation Commands

Run these for most helper or service-boundary work:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

Add focused Cypress specs based on the touched area. Use the backlog for the current recommended validation set.

## Intentional Exceptions

- `QDMMeasureVersion.cy.ts` keeps the invalid-CQL UI save path because that scenario validates CQL error persistence.
- `DeleteCMSID.cy.ts` uses edit mode for CMS ID generation; it is not leftover saved-CQL setup.
