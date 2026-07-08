# MADiE Cypress Quality Architecture Backlog

Last updated: 2026-07-08

Stable rules live in `docs/quality/cypress-automation-guidelines.md`. Keep this backlog limited to current state, next actions, measured audit signal, and validation.

## Current Direction

- Keep service setup and request mechanics behind `TestData` and domain helpers.
- Keep UI specs focused on browser-visible behavior.
- Prioritize changes that reduce repeated fixture paths, token plumbing, fixed waits, forced interactions, skipped tests, or broad exception handling.
- Update this file only when priorities, decisions, audit counts, or done signals materially change.

## Current State

Recently proven service/helper slices:

- Measure service: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QI Core Test-Cases.cy.ts`.
- QDM service: `QDM Test-Cases.cy.ts`, `QDM Measure.cy.ts`, `QDMMeasureVersion.cy.ts`.
- CQL library service: `CreateCQL-Library.cy.ts`, `EditCQL-Library.cy.ts`, `VersionAndDraftCQL-Library.cy.ts`.
- Shared create/fixture path: `CreateMeasurePage.ts` now routes fixture writes and measure create/clone requests through `TestData` helpers.

## Latest Audit Signal

Command: `npm run quality:audit`

- Inventory: 256 specs / 65737 spec lines; 29 shared files / 18839 shared lines; 3 support files / 637 support lines; 8 scripts / 1296 script lines.
- Skipped tests: 11.
- Manual fixture path plumbing: 270.
- Manual access token plumbing: 117.
- Fixed waits: 101.
- Forced interactions: 195.
- Global uncaught exception suppression: 1.

Largest risk concentrations:

- `CQLLibraryDelete.cy.ts`: top remaining CQL library token-plumbing target.
- `TestCasesPage.ts`, `MeasureGroupPage.ts`, `CreateMeasurePage.ts`, `Utilities.ts`: shared helper and page-object infrastructure debt.
- `CorrectExpectedValues.cy.ts`, `DeleteTest-Case.cy.ts`, and selected admin/measure/test-case service specs: remaining service-tail cleanup.
- `MeasureListNewColumnsSort.cy.ts`, `CQLLibraryListPageColumnSort.cy.ts`, export specs, highlighting specs, and editor flows: UI reliability debt from waits and forced interactions.
- `cypress/support/e2e.ts`: global `uncaught:exception` suppression.

## Priorities

### P1: CQL Library Service Cleanup

Next target: `cypress/e2e/Services/CQL Library Service/CQLLibraryDelete.cy.ts`

Done when repeated token/header/request setup moves behind shared helpers, negative states stay explicit, and focused library validation passes or exposes a diagnosed non-refactor failure.

### P2: Shared Helper and Infrastructure Hardening

Start with:

- `Utilities.deleteLibrary`
- `MeasureGroupPage.ts`
- `TestCasesPage.ts`

Done when shared helpers own path conventions and common request setup, and page objects no longer spread service setup mechanics.

### P3: UI Reliability Debt

Start with:

- fixed waits in list sorting, export, and terminology-heavy specs
- forced interactions in `TestCasesPage.ts`, import validations, highlighting specs, and editor flows
- global exception suppression in `cypress/support/e2e.ts`
- skipped tests needing owner/ticket/remove decisions

Done when waits are replaced by route aliases, visible/enabled assertions, or polling helpers; forced interactions are justified or removed; exception handling is targeted.

### P4: Remaining Service Tail Cleanup

Candidates:

- `DeleteTest-Case.cy.ts`
- `CorrectExpectedValues.cy.ts`
- remaining admin/measure/test-case specs surfaced near the top of the audit after each batch

## Replan Rules

After each meaningful slice:

- Run the audit and compare the current diff.
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
