# MADiE Cypress Quality Backlog

Last updated: 2026-09-18

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

1. Run the Cypress 16.1.0 smoke collection in CI at the existing three-worker parallelism; retain runner artifacts for every worker.
2. Audit custom Cypress commands and lifecycle hooks that queue login, retry, cleanup, or release work. Return the final chain before migrating more consumers.
3. Complete remaining Test Case Details, JSON, Test Cases, and Expected/Actual migrations by repeated interaction pattern.
4. Verify CI collection for specs that produce no runner output before treating them as test failures.
5. Audit repeated full `OktaLogin.Login()` paths for `SessionLogin()` eligibility, excluding scenarios that intentionally switch users or exercise UI logout.
6. Instrument the 100–162 second login/edit/editor startup floor seen in `TestCaseJSON_TerminologyTests.cy.ts`.

Work boundaries:

- Keep UI tests focused on browser-visible behavior; move eligible setup to APIs before login.
- Convert one repeated interaction bucket at a time.
- Do not combine unrelated export, transfer, highlighting, and editor refactors.
- Do not add retries or weaker assertions for known product defects.
- Do not perform a suite-wide mechanical conversion. Migrate one repeated interaction bucket at a time, starting with consumers already covered by a shared helper.

## Cypress 16 Conversion Scope

The Cypress 16.1.0 compatibility baseline is complete: clean installation, binary verification, compile, focused helper consumers, and static quality checks pass. The remaining suite work is a reliability migration, not a framework migration.

| Batch | Scope | Completion evidence | Do not include |
| --- | --- | --- | --- |
| A — Lifecycle ownership | Custom commands and hooks that queue login, logout, retry navigation, cleanup, or user-lock tasks. | Each changed command returns its final chain; one focused lifecycle consumer passes. | Broad authentication redesign or new retries. |
| B — Test Case readiness | Specs bypassing `TestCasesPage` save, execution, list, Expected/Actual, and status helpers. | Focused save/run/list flow proves response completion and named-row status. | Product-result expectation changes. |
| C — UI interaction debt | Repeated forced interactions and fixed waits in shared helpers, import, highlighting, and editor clusters. | Replace one repeated reason with a selector/readiness helper and validate a consumer. | One-off force-clicks intentionally targeting native controls. |
| D — Service setup tail | Repeated fixture-path and access-token plumbing in service/admin specs. | Existing `TestData` or request helper replaces a repeated pattern; service test remains API-focused. | Moving UI rendering assertions into service tests. |
| E — Account/session efficiency | UI specs that repeatedly perform full login but do not validate authentication or switch users. | Explicit `SessionLogin()` eligibility review and focused role/ownership coverage. | Reviewer, permission, multi-user, and logout scenarios. |

Sequence batches by independent CI failures and shared-helper consumer count. Commit and validate each batch separately; do not treat a passing manual run as proof for unrelated specs.

## Deferred or Blocked

| Area | Status | Next action |
| --- | --- | --- |
| `ElementTable.cy.ts` | Deferred by team; React action transition can detach or close without opening the editor. | Resume only when explicitly prioritized; diagnose destination transition. |
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

- Upgraded Cypress to 16.1.0 and updated configuration, public environment exposure, plugin loading, failed-test selection, and lifecycle command-chain ownership. Clean `npm ci`, binary verification, compile, and focused Cypress validation pass.
- Removed inactive `cypress-axe@1.7.0` and unused `axe-core` because its declared Cypress peer range ends at v15 and blocked clean Cypress 16 installation. Reintroduce accessibility automation only with a Cypress 16-compatible integration.
- Proven QDM code-system option normalization: the shared selector accepts the domain value `LOINC` and the rendered `http://loinc.org` data-testid. Focused cohort, ratio, and CV QDM consumers pass; the former headless code-system blocker is resolved.
- Proven lifecycle chain ownership across navigation retry, login/logout, cleanup, global user release, and QRDA export hooks. Commands must return their terminal Cypress chain to prevent work from executing after teardown.
- Centralized user-scoped fixture, token, ID, cleanup, lock, share, measure-group, test-case, and CQL-library request mechanics through `TestData` and domain helpers.
- Added bounded Cypress worker inactivity handling and CI diagnostics.
- Removed helper-level fixed waits from `CQLEditorPage`, `CQLLibraryPage`, and `MeasureGroupPage` paths covered by focused tests.

### Test-case reliability

- Proven FHIR Expected/Actual stabilization for ratio scenarios with observations. Checkbox flows use the helper to wait for the initial terminology expansion and normalize post-refresh selections; Encounter-basis numeric flows wait for that expansion before entering base expectations and require observation rows before entering their values. When the first numeric write triggers the expansion, the final inputs are cleared and re-entered after it settles. Five focused smoke specs pass.
- Proven native, destination-aware navigation for Test Cases, Details, JSON, Expected/Actual, and Highlighting Results.
- Retested the Ratio Patient measure-observation Expected/Actual assertions after MAT-10284; the product defect is resolved, and both specs now use the shared numeric-entry and Details-tab helpers.
- Proven shared checkbox and numeric-entry helpers across Qi-Core and QDM split-panel and non-panel layouts.
- Proven shared checkbox persistence through save, reopen, and named list-status validation in QDM Expected/Actual flows.
- Stabilized QDM demographics, row checkbox selection, search, SDE navigation, clone/copy, execution, highlighting, validation, and action-center flows.
- Stabilized Qi-Core population values, search, invalid-case navigation, non-owner execution, list coverage, and versioned clone/import flows.
- Corrected invalid-test-case execution expectations: the option permits submission, while an unparseable patient bundle is explicitly rejected with `400` and remains `Invalid`.

### Measure lifecycle and export

- Stabilized draft/version setup, retry-safe unique names, missing-CQL validation, and delete confirmation/toast contracts.
- Proven Qi-Core and QDM negative export paths without using success-only export helpers.
- Stabilized QI-Core and QDM human-readable export assertions: QI-Core accepts either supported representation of absent Copyright/Disclaimer metadata, and QDM rich-text assertions preserve ordered content while ignoring renderer-only whitespace layout.
- Proven versioned QDM export from the same measure edit session after settled CQL save and action-center rerender.
- Proven Population Criteria native activation with destination readiness; the ratio observation product defect remains separate.

### Libraries, sharing, and transfer

- Stabilized library comparison, history display names, sharing/drafting, name-based admin transfer, saved-code permissions, and list searching.
- General account display-name lookup now lives in `TestData`.
- Fixed CQL library transferred-user versioning to authenticate as the transferee while reading the original owner fixture; focused TEST coverage passes.
- Migrated CQL Library creation and validation coverage from QI-Core v4.1.1 to US Quality Core v0.5.0, including a valid USQC CQL fixture, model-specific selectors, duplicate-name setup, and name-filtered post-create navigation; the full spec passes.
- Migrated CQL Library transfer coverage from QI-Core v4.1.1 to QI-Core v6.0.0 using the existing QI-Core 6 cohort CQL fixture.
- Migrated CQL Library version, draft, invalid-CQL, and version-comparison UI coverage from QI-Core v4.1.1 to QI-Core v6.0.0; all five lifecycle specs pass. The shared draft-request capture stores the resulting library ID through `TestData` and is proven by both draft and compare consumers.

## Latest Audit Signal

Command: `npm run quality:no-focused-tests` on 2026-09-18.

| Metric | Count |
| --- | ---: |
| Specs | 311 |
| Spec lines | 72,028 |
| Shared files | 35 |
| Shared lines | 21,324 |
| Support files / lines | 3 / 631 |
| Scripts / lines | 9 / 1,565 |
| Skipped tests | 49 |
| Manual fixture paths | 147 |
| Manual access-token plumbing | 81 |
| Fixed waits | 28 |
| Forced interactions | 168 |
| Global exception suppression | 1 |

Largest current concentrations:

- `TestCasesPage.ts` and remaining consumers that bypass its navigation/editor helpers.
- `OktaLogin.ts` fixed waits and shared startup latency.
- Repeated full `OktaLogin.Login()` calls in UI specs that do not validate authentication or switch users. `DeleteCQLLibrary.cy.ts` confirmed the session-cached path is applicable; audit other candidates individually.
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
