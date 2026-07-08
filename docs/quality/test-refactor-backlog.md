# MADiE Cypress Quality Architecture Backlog

Last updated: 2026-07-08

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

- P2 shared helper hardening, next target `cypress/Shared/TestCasesPage.ts`

Why this is the best next step:

- P1 CQL library service cleanup is already proven.
- `Utilities.deleteLibrary` and the service-style API setup in `MeasureGroupPage.ts` are already moved behind `TestData`.
- `TestCasesPage.ts` is still the largest remaining shared helper concentration for fixture-path plumbing and forced interactions.

Work boundary for the next slice:

- Stay inside `TestCasesPage.ts` unless a small supporting `TestData` change is required.
- Prefer moving service-style setup and path conventions behind existing helpers before touching UI interaction patterns.
- Keep negative assertions explicit and avoid combining helper hardening with wait/force cleanups unless the same code path requires it.

## Current State

Recently proven service/helper slices:

- Measure service: `Measure.cy.ts`, `MeasureBundle.cy.ts`, `MeasureExport.cy.ts`, `DraftMeasure.cy.ts`, `MeasureVersion.cy.ts`, `QI Core Test-Cases.cy.ts`.
- QDM service: `QDM Test-Cases.cy.ts`, `QDM Measure.cy.ts`, `QDMMeasureVersion.cy.ts`.
- CQL library service: `CreateCQL-Library.cy.ts`, `EditCQL-Library.cy.ts`, `VersionAndDraftCQL-Library.cy.ts`, `CQLLibraryDelete.cy.ts`.
- Shared create/fixture path: `CreateMeasurePage.ts` now routes fixture writes and measure create/clone requests through `TestData` helpers.
- Shared cleanup/request helpers: `Utilities.deleteLibrary` and the API create/update setup in `MeasureGroupPage.ts` now route fixture reads and authenticated requests through `TestData`.

Recently diagnosed non-refactor failures:

- `CQLLibraryDelete.cy.ts` still fails on current `master` because transfer cases return inactive-user `400` responses and admin delete-all cases return `403 insufficient_scope`. Treat that as environment or account-state drift, not as the next refactor target.

## Latest Audit Signal

Command: `npm run quality:audit`

- Inventory: 256 specs / 65636 spec lines; 29 shared files / 18665 shared lines; 3 support files / 637 support lines; 8 scripts / 1296 script lines.
- Skipped tests: 11.
- Manual fixture path plumbing: 238.
- Manual access token plumbing: 97.
- Fixed waits: 101.
- Forced interactions: 195.
- Global uncaught exception suppression: 1.

Largest risk concentrations:

- `TestCasesPage.ts`: top remaining shared helper target for fixture-path plumbing, service-style setup, and forced interactions.
- `CreateMeasurePage.ts`, `Utilities.ts`, and remaining service-style helpers inside shared page objects: shared helper and page-object infrastructure debt after `TestCasesPage.ts`.
- `CorrectExpectedValues.cy.ts`, `DeleteTest-Case.cy.ts`, and selected admin/measure/test-case service specs: remaining service-tail cleanup.
- `MeasureListNewColumnsSort.cy.ts`, `CQLLibraryListPageColumnSort.cy.ts`, export specs, highlighting specs, and editor flows: UI reliability debt from waits and forced interactions.
- `cypress/support/e2e.ts`: global `uncaught:exception` suppression.

## Priorities

### P1: CQL Library Service Cleanup

Status: Done

Completed signal:

- Repeated token/header/request setup moved behind shared helpers.
- Negative states stayed explicit.
- Focused validation exposed preexisting non-refactor failures instead of helper regressions.

### P2: Shared Helper and Infrastructure Hardening

Current target order:

- `TestCasesPage.ts`
- `CreateMeasurePage.ts`
- remaining `Utilities.ts` and shared page-object service helpers

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
