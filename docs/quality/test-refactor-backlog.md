# MADiE Cypress Quality Backlog

Last updated: 2026-08-03

Stable automation rules live in `docs/quality/cypress-automation-guidelines.md`. This file tracks only current priorities, blockers, audit signal, and concise completion evidence.

## How to Use This Backlog

- Work on one bounded item at a time.
- Reuse existing helpers before adding abstractions.
- A slice is complete only when behavior is preserved, focused validation passes, static checks pass, and documentation is evaluated.
- After each completed slice, reassess priority instead of automatically taking the next nearby file.
- Record durable decisions and material audit changes, not run-by-run narration.

## Active Priority

### P2 — UI Reliability Debt

Goal: replace unstable navigation, waits, forced interactions, and UI-heavy setup without hiding product failures.

Current focus order:

1. Triage the next independent weekly-regression failure supplied by the team.
2. Complete remaining Test Case Details, JSON, Test Cases, and Expected/Actual migrations by repeated interaction pattern.
3. Investigate the inconclusive `QDMRunExecuteTC.cy.ts` single-pass scenario separately from its already-proven helper paths.
4. Verify CI collection for specs that produced no runner output before treating them as test failures.
5. Instrument the 100–162 second login/edit/editor startup floor seen in `TestCaseJSON_TerminologyTests.cy.ts`.

Work boundaries:

- Keep UI tests focused on browser-visible behavior; move eligible setup to APIs before login.
- Convert one repeated interaction bucket at a time.
- Do not combine unrelated export, transfer, highlighting, and editor refactors.
- Do not add retries or weaker assertions for known product defects.

## Deferred or Blocked

| Area | Status | Next action |
| --- | --- | --- |
| `ExecuteInvalidTestCases.cy.ts` | Product remains `Invalid` instead of `Pass` after execution. | Product follow-up; do not accept `Invalid`. |
| `ElementTable.cy.ts` | Deferred by team; React action transition can detach or close without opening the editor. | Resume only when explicitly prioritized; diagnose destination transition. |
| `CQLLibraryDelete.cy.ts` | DEV proof on 2026-08-06 passed the new MAT-9892 admin single-instance delete coverage. A legacy transferred-user versioning scenario still receives `403`. | Isolate whether transferred users should be allowed to version a library before refactoring that legacy scenario. |
| `CQLLibraryTransfer.cy.ts` | Inactive alt-user responses plus slow UI switching. | Resolve account state before session-flow changes. |
| `Measure.cy.ts` special-character validation | Service returns `500` instead of expected `400`. | Product/service follow-up. |
| `QDMRunExecuteTC.cy.ts` non-owner path | Previously reached VSAC `401`. | Recheck environment/session dependency independently. |
| Locking follow-up | Okta auth failures prevented helper-path validation. | Rerun after authentication stabilizes. |
| `BooleanAndNonBooleanExpectedValues.cy.ts`, `ExecutionAndCoverageValidations.cy.ts` | No runner output in a reported run. | Verify spec collection and runner artifacts first. |

## Next Architecture Targets

### UI reliability

- Remaining raw numeric Expected/Actual consumers and legacy openings without concrete readiness selectors.
- Remaining forced interactions in `TestCasesPage.ts`, import validation, highlighting, and editor flows.
- Remaining export specs with repeated unzip/download setup.
- `OktaLogin.ts` fixed waits and shared authentication readiness.
- Global `uncaught:exception` suppression in `cypress/support/e2e.ts`.
- Skipped tests requiring an owner, ticket, or removal decision.

### Service tail

- `DeleteTest-Case.cy.ts`.
- `CorrectExpectedValues.cy.ts`.
- Remaining admin, measure, and test-case specs surfaced by the next audit.
- Transfer-spec overlap after account-state issues are resolved.

## Recently Completed

### Shared infrastructure

- Centralized user-scoped fixture, token, ID, cleanup, lock, share, measure-group, test-case, and CQL-library request mechanics through `TestData` and domain helpers.
- Added bounded Cypress worker inactivity handling and CI diagnostics.
- Removed helper-level fixed waits from `CQLEditorPage`, `CQLLibraryPage`, and `MeasureGroupPage` paths covered by focused tests.

### Test-case reliability

- Proven native, destination-aware navigation for Test Cases, Details, JSON, Expected/Actual, and Highlighting Results.
- Retested the Ratio Patient measure-observation Expected/Actual assertions after MAT-10284; the product defect is resolved, and both specs now use the shared numeric-entry and Details-tab helpers.
- Proven shared checkbox and numeric-entry helpers across Qi-Core and QDM split-panel and non-panel layouts.
- Stabilized QDM demographics, row checkbox selection, search, SDE navigation, clone/copy, execution, highlighting, validation, and action-center flows.
- Stabilized Qi-Core population values, search, invalid-case navigation, non-owner execution, list coverage, and versioned clone/import flows.

### Measure lifecycle and export

- Stabilized draft/version setup, retry-safe unique names, missing-CQL validation, and delete confirmation/toast contracts.
- Proven Qi-Core and QDM negative export paths without using success-only export helpers.
- Proven versioned QDM export from the same measure edit session after settled CQL save and action-center rerender.
- Proven Population Criteria native activation with destination readiness; the ratio observation product defect remains separate.

### Libraries, sharing, and transfer

- Stabilized library comparison, history display names, sharing/drafting, name-based admin transfer, saved-code permissions, and list searching.
- General account display-name lookup now lives in `TestData`.

## Latest Audit Signal

Command: `npm run quality:no-focused-tests` on 2026-07-31.

| Metric | Count |
| --- | ---: |
| Specs | 259 |
| Spec lines | 65,371 |
| Shared files | 30 |
| Shared lines | 19,379 |
| Support files / lines | 3 / 629 |
| Scripts / lines | 9 / 1,561 |
| Skipped tests | 12 |
| Manual fixture paths | 179 |
| Manual access-token plumbing | 87 |
| Fixed waits | 35 |
| Forced interactions | 170 |
| Global exception suppression | 1 |

Largest current concentrations:

- `TestCasesPage.ts` and remaining consumers that bypass its navigation/editor helpers.
- `OktaLogin.ts` fixed waits and shared startup latency.
- Import, highlighting, and editor specs with forced interactions.
- Service-tail fixture/token plumbing.
- Global exception suppression in `cypress/support/e2e.ts`.

## Completed Priority

### P1 — Shared Helper and Infrastructure Hardening

Status: Done.

Shared helpers now own the reusable fixture naming, authentication, request setup, and common domain mechanics previously duplicated across page objects and specs. Remaining work is consumer migration, UI reliability, and service-tail cleanup.

## Replan and Validation

After each meaningful slice:

1. Run the baseline checks.
2. Run at least one focused spec for every changed shared path.
3. Compare `npm run quality:audit` when counts may have materially changed.
4. Update this backlog only for completed work, new blockers, changed priorities, or material count changes.
5. Commit at a proven boundary.

Baseline:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

Focused validation should use the environment and spec closest to the changed behavior. For TEST regression proof, include `--env configFile=test`.

## Done Signals

- Test intent is clearer.
- Repeated mechanics moved behind an existing or justified named helper.
- Negative states remain explicit.
- Static checks pass.
- Focused coverage passes or a product/environment blocker is documented with the original assertion preserved.
