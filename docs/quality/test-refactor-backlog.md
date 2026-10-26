# MADiE Cypress Quality Backlog

Last updated: 2026-10-26

Stable automation rules live in `docs/quality/cypress-automation-guidelines.md`. This file tracks only current priorities, blockers, audit signal, and concise completion evidence.

## How to Use This Backlog

- Work on one bounded item at a time.
- Reuse existing helpers before adding abstractions.
- A slice is complete only when behavior is preserved, focused validation passes, static checks pass, and documentation is evaluated.
- After each completed slice, reassess priority instead of automatically taking the next nearby file.
- Record durable decisions and material audit changes, not run-by-run narration.

## Active Priority

### P1 — Regression Recovery: Library List and Intercept Readiness

Goal: restore reliable CI signal for broad Cypress 16 regression clusters before
making individual consumer changes.

Current focus order:

1. Stabilize CQL Library list entry and render readiness. The current full
   regression shows the library table unavailable across creation, validation,
   version/draft, transfer, sharing, history, editor, and comparison specs.
   Recent TEST reports cover creation, validation, version/draft, transfer,
   sharing, editor, and list sorting; comparison (1/1) and a focused name
   search (1/1) also passed headless on 2026-10-26. The broad failure is not
   reproduced by these consumers. Run the remaining unverified list/history
   specs as a targeted CI group before changing the shared helper.
2. Replace response-dependent list assertions where Cypress 16 reports an
   intercepted request with no response object. Keep request-query assertions
   explicit, and use a destination or rendered-list condition for readiness.
   The representative CQL Library sort (3/3), Measure sort (4/4), and Admin
   library search (2/2) specs passed headless in TEST on 2026-10-26; the
   missing-response condition did not reproduce in this batch. Require a
   failing artifact before changing their response assertions.
3. Batch current Admin tooltip copy changes only after confirming their exact
   accessible labels. Keep action enablement and permission assertions
   independent from label text. The no-selection Measure actions (2/2),
   selected/unselected Measure action transition (1/1), and active Library
   delete action (1/1) passed headless in TEST on 2026-10-26. No copy change
   is indicated by these representative runs; require a failing artifact for
   any remaining tooltip variant.
4. Triage uncaught service/setup errors before their downstream specs are
   changed; hook or setup failures can cascade into misleading UI failures.

Work boundaries:

- Do not add fixed waits, retries, or relaxed error assertions to recover the
  library-list cluster.
- Do not change an expected product-validation error to `CQL Contains Errors`
  without proving the saved CQL and export contract.
- Validate each shared-path change with focused representative consumers before
  launching another full regression.

### P2 — UI Reliability Debt

Goal: replace unstable navigation, waits, forced interactions, and UI-heavy setup without hiding product failures.

Current focus order:

1. Run the Cypress 16.1.0 smoke collection in CI at the existing three-worker parallelism; retain runner artifacts for every worker.
2. Audit custom Cypress commands and lifecycle hooks that queue login, retry, cleanup, or release work. Return the final chain before migrating more consumers.
3. Complete the MAT-10241 Monaco follow-up by repeated behavior, not by
   individual failure. The merged migration has no active
   `CQLEditorPage.saveCql()` consumers, and Smoke Tests plus ordinary Test
   Case save flows already use the shared Monaco save and JSON-replacement
   paths. The follow-up scope is recorded in
   `docs/quality/mat-10241-monaco-cypress-plan.md` and must complete these
   behavior buckets before retiring legacy editor support:
   - Replace remaining direct Measure CQL typing and Ace diagnostic assertions
     with `MonacoEditor` and MADiE validation contracts.
   - Rename and migrate Test Case JSON page-object members and consumers that
     still expose Ace names, classes, or Find UI mechanics; preserve the
     existing semantic test ids and shared JSON replacement path.
   - Convert read-only Test Case JSON checks to a user-visible read-only
     contract, rather than an Ace implementation class.
   - Migrate the remaining CQL Library empty-document version-validation path
     and then remove dead legacy CQL helper methods and selectors only after
     direct consumers are gone.
   - Keep `MeasureGroupPage.loadTestCaseExecutionCql()` on its proven Monaco
     path; it is a regression consumer, not a candidate for legacy cleanup.
4. Verify CI collection for specs that produce no runner output before treating them as test failures.
5. Audit repeated full `OktaLogin.Login()` paths for `SessionLogin()` eligibility, excluding scenarios that intentionally switch users or exercise UI logout.
6. Replace unconditional alternate-user allocation in `cypress/support/e2e.ts` with an explicit, compatible alt-user requirement contract. The support hook currently claims both a primary and alternate account for every spec run, although the audited export specs do not use an alternate account and 92 files do. This creates avoidable pool contention and makes headed reruns more likely to receive a different available account after a failed run releases its locks.
7. Instrument the 100–162 second login/edit/editor startup floor seen in `TestCaseJSON_TerminologyTests.cy.ts`.
8. Establish an incremental `strictNullChecks` migration. The baseline command reports existing nullability and Cypress chain-subject errors across shared helpers and legacy specs, so do not enable it as a blocking suite-wide gate yet. Fix strict diagnostics in touched files, measure the baseline, and introduce a non-blocking report before defining a ratcheted CI gate.
9. Audit direct Save clicks after `replaceMonacoCqlDocument(...)` or `replaceMonacoCqlDocumentFromFile(...)`. QI-Core and QDM export mismatch paths now prove that appending a newline after replacement is needed before valid-CQL save/validation; start with `CQLChanges.cy.ts`, `MeasureButtons.cy.ts`, and `RunAndExecuteTestCaseButtonValidations.cy.ts`, preserving explicit invalid-CQL assertions.

Work boundaries:

- Keep UI tests focused on browser-visible behavior; move eligible setup to APIs before login.
- Convert one repeated interaction bucket at a time.
- Do not combine unrelated export, transfer, highlighting, and editor refactors.
- Do not add retries or weaker assertions for known product defects.
- Do not perform a suite-wide mechanical conversion. Migrate one repeated interaction bucket at a time, starting with consumers already covered by a shared helper.
- Do not change the allocation default globally until alt-user consumers have an explicit opt-in path and representative multi-user, reviewer, and primary-only specs prove their allocation and release behavior.

## Recently Completed

- Removed the unused `serviceConfig` feature-flag capture from full login and retry navigation after confirming it had no active TypeScript consumer. The focused Admin Measure Change Version suite passed in under nine minutes after the change.

## Cypress 16 Conversion Scope

The Cypress 16.1.0 compatibility baseline is complete: clean installation, binary verification, compile, focused helper consumers, and static quality checks pass. The remaining suite work is a reliability migration, not a framework migration.

| Batch | Scope | Completion evidence | Do not include |
| --- | --- | --- | --- |
| A — Lifecycle ownership | Custom commands and hooks that queue login, logout, retry navigation, cleanup, or user-lock tasks. | Each changed command returns its final chain; one focused lifecycle consumer passes. | Broad authentication redesign or new retries. |
| B — Test Case readiness | Specs bypassing `TestCasesPage` save, execution, list, Expected/Actual, and status helpers. | Focused save/run/list flow proves response completion and named-row status. | Product-result expectation changes. |
| C — UI interaction debt | Repeated forced interactions and fixed waits in shared helpers, import, highlighting, and editor clusters. | Replace one repeated reason with a selector/readiness helper and validate a consumer. | One-off force-clicks intentionally targeting native controls. |
| D — Service setup tail | Repeated fixture-path and access-token plumbing in service/admin specs. | Existing `TestData` or request helper replaces a repeated pattern; service test remains API-focused. | Moving UI rendering assertions into service tests. |
| E — Account/session efficiency | UI specs that repeatedly perform full login but do not validate authentication or switch users; unconditional alt-account allocation in global support. | Explicit `SessionLogin()` eligibility review; an opt-in alternate-account contract; focused primary-only, multi-user, reviewer, and parallel-lock coverage. | Reviewer, permission, multi-user, and logout scenarios; a global default flip before consumer migration. |

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

Command: `npm run quality:no-focused-tests` on 2026-10-06.

| Metric | Count |
| --- | ---: |
| Specs | 313 |
| Spec lines | 72,802 |
| Shared files | 35 |
| Shared lines | 21,605 |
| Support files / lines | 3 / 648 |
| Scripts / lines | 10 / 1,663 |
| Skipped tests | 48 |
| Manual fixture paths | 146 |
| Manual access-token plumbing | 80 |
| Fixed waits | 28 |
| Forced interactions | 163 |
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
