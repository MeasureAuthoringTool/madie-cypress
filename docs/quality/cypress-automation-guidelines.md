# MADiE Cypress Automation Guidelines

Last updated: 2026-07-31

This document contains stable automation rules. Current priorities, audit counts, proof status, and blockers belong in `docs/quality/test-refactor-backlog.md`.

## Decision Order

When rules compete, use this order:

1. Reliability
2. Test isolation
3. Helper reuse
4. Readability
5. Speed
6. Minimal code change

Add guidance only when it is supported by committed code, focused validation, audit output, or a team decision.

## Test Boundaries

- Service specs under `cypress/e2e/Services/` should set up and verify service behavior through APIs.
- UI specs under `cypress/e2e/WebInterface/` should reserve the browser for rendering, navigation, permissions, editor behavior, and user interaction.
- Complete API-supported measure, group, library, and test-case setup before UI login. Prefer one login and one continuous UI session.
- Page objects own UI interaction. `TestData` and domain request helpers own tokens, fixture paths, IDs, and service setup.
- Keep negative authorization, validation, and error assertions explicit when setup moves to APIs.
- For feature-flagged contracts, keep current coverage active and add new coverage alongside it. Put persistence and payload checks in service specs first.
- Split large specs by behavior only after shared setup and data helpers are stable.

## Test Data and API Helpers

- Use owner-aware `TestData` helpers for `selectedUser` and `selectedAltUser`.
- Prefer `fixturePath`, `readFixture`, `writeFixture`, `readMeasureId`, `readCqlLibraryId`, `readTestCaseId`, and related helpers over hand-built fixture paths.
- Prefer `withAccessToken`, `requestWithAccessToken`, and domain request helpers over inline cookie or token plumbing.
- Use `TestData.getAccountDisplayName(harpId)` for UI text that includes a display name and HARP ID.
- Generate unique names inside retryable hooks such as `beforeEach`; spec-load names can collide when Cypress retries setup.

Reuse these established paths before adding request code:

- Measures: `requestMeasure`, `readMeasure`, `requestMeasureById`, `updateMeasure`, `updateCurrentMeasure`.
- CQL: `saveMeasureCql`, `expectSavedMeasureCql`, `translateFhirCql`, `translateQdmCql`.
- Lifecycle: `requestMeasureBundle`, `requestMeasureExport`, `requestMeasureDraft`, `requestDraftStatus`, `versionMeasure`, `requestAdminMeasureDelete`, `requestMeasureDeleteAction`.
- Groups and test cases: `requestMeasureGroup`, `requestMeasureGroupById`, `requestMeasureGroupStratification`, `requestMeasureTestCase`, `requestMeasureTestCaseList`, `requestTestCaseImports`.
- CQL libraries: `requestCqlLibrary`, `readCqlLibrary`, `requestCqlLibraryById`, `updateCqlLibrary`, `updateCurrentCqlLibrary`, `searchCqlLibraries`, `versionCqlLibrary`, `draftCqlLibrary`, `requestVersionedCqlLibrary`.

## Selectors and Row Targeting

- Prefer selectors in this order: `data-testid`, accessible role/name, stable text, stable container plus child, then CSS class.
- Put reusable selectors in the relevant page object. Inline selectors are acceptable for one-off assertions.
- Select created rows by stored ID, generated name, title, or case number tied to the scenario. Do not rely on row index or table order.
- Account for pagination and submitted search state before assuming a created row is visible.
- On paginated library lists, submit the generated library name with `CQLLibrariesPage.searchForLibraryByName(...)` before selecting or opening its row; pair the filtered UI row with the stored library ID when an action targets that library.
- Do not assert `be.enabled` on non-form containers such as MUI SpeedDial roots or anchor-backed tabs. Target the actual button or use `aria-disabled`.

## Navigation and Readiness

- A selected tab is not proof that its content rendered. Pass a destination readiness selector whenever the next command depends on tab content.
- When a library scenario does not validate header navigation, enter the Libraries workspace through `CQLLibrariesPage.openLibrariesList()`; it visits `/cql-libraries` and waits for the library list to render.
- Use the shared native activation paths for Test Cases, Details, JSON, Expected/Actual, and return navigation. Cypress actionability scrolling can shift split views or leave stale content mounted.
- Use `EditMeasurePage.openPopulationCriteriaTab(...)` after CQL saves or route updates, with a concrete Population Criteria control as readiness.
- When opening a versioned measure in View mode, configure action helpers not to expect edit-only CQL content.
- After route-changing actions, verify the intended page content, not only the URL. MADiE can update the route before React remounts the destination.
- After saves, wait for a settled condition such as a disabled Save button or completed request. A success toast alone may precede the final rerender.

## Test Case Split Views

- Use `openExpectedActualTab(...)`, `checkExpectedActualCheckbox(...)`, `uncheckExpectedActualCheckbox(...)`, and `typeExpectedActualValue(...)` instead of raw split-panel interactions.
- Do not pre-assert visibility on clipped Expected/Actual inputs when the shared helper already normalizes the panel.
- Toggle Highlighting Results through the shared Results-header helper; the split-view sash can cover the right-edge icon.
- Treat Ace's transparent keyboard textarea as intentionally hidden. Prove readiness on the visible editor and use the shared JSON editor helper.
- Keep clear and type contiguous for controlled React inputs that restore prior values between events; assert the final value after re-querying.
- Use `typeExpectedActualValue(...)` for every Expected/Actual text or numeric field. Pass `{ clearFirst: true }` only when replacing an existing value; initially empty controlled inputs must use the helper's default type-only mode to avoid a clearing rerender.
- Use `checkExpectedActualCheckbox(...)` and `uncheckExpectedActualCheckbox(...)` for every Expected/Actual checkbox; do not use raw checkbox commands in the split panel.

## CQL and Population Criteria

- Reuse `CQLEditorPage.saveCql(...)` and wait for the Save button to become disabled when later setup depends on compiled CQL.
- Create or update Population Criteria only after valid CQL has settled.
- Use API group setup when the scenario does not validate the Population Criteria UI itself.
- Preserve intentional invalid-CQL UI flows when the test verifies editor error persistence or visible validation behavior.

## Assertions and Error Handling

- Assert durable UI contracts: stable selectors, meaningful text fragments, request status, and destination state.
- Use shared dialog and toast helpers when the same contract appears in multiple specs.
- Keep product failures visible. Do not weaken assertions to accept an incorrect state.
- Do not add broad `uncaught:exception` suppression. Any tolerated exception must be narrowly scoped and explained.
- Skipped tests require an owner, ticket, or removal decision.

## Waits and Interactions

- Do not add fixed waits. Use route aliases, visible/enabled assertions, save settlement, or purposeful polling.
- Use `{ force: true }` only for intentionally hidden/native controls with a documented reason.
- Prefer `step(...)` over ad hoc `cy.log(...)` for reusable helpers or high-value flow narration.

## Refactoring

- Search for an existing helper before creating one.
- Move repeated mechanics behind domain-named helpers; do not abstract one-off code.
- Preserve behavior and explicit negative assertions.
- Stop when duplication is reduced and the focused validation passes. Avoid style-only follow-up changes.
- Validate every shared-path change with static checks and at least one focused consumer.

## Validation

Baseline:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

Run focused Cypress coverage for each touched shared path. Use `--env configFile=test` for TEST regression proof.

## Intentional Exceptions

- `QDMMeasureVersion.cy.ts` keeps the invalid-CQL UI save path because it validates CQL error persistence.
- `DeleteCMSID.cy.ts` uses edit mode for CMS ID generation; it is not leftover saved-CQL setup.
