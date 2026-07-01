# MADiE Cypress Refactor Backlog

Last updated: 2026-07-01

## Current Inventory

- 256 Cypress specs, about 71k spec lines.
- 29 shared test helper/page-object files, about 17.5k shared lines.
- Largest specs:
    - `cypress/e2e/WebInterface/Test Cases/QI-CORE Test Case/Execution/MeasureHighlighting.cy.ts`
    - `cypress/e2e/Services/Measure Service/MeasureGroup.cy.ts`
    - `cypress/e2e/Services/Measure Service/EditMeasure.cy.ts`
    - `cypress/e2e/Services/Measure Service/Measure.cy.ts`
    - `cypress/e2e/Services/Measure Service/QI Core Test-Cases.cy.ts`
- Largest shared helpers:
    - `cypress/Shared/TestCaseJson.ts`
    - `cypress/Shared/MeasureCQL.ts`
    - `cypress/Shared/QDMMeasuresCQL.ts`
    - `cypress/Shared/FHIRMeasuresCQL.ts`
    - `cypress/Shared/TestCasesPage.ts`
    - `cypress/Shared/CreateMeasurePage.ts`
    - `cypress/Shared/MeasureGroupPage.ts`

## Changes Already Started

- Added `cypress/Shared/TestData.ts` to centralize:
    - selected user lookup
    - fixture paths
    - measure/library ID reads
    - access-token handling
    - measure-group request bodies
    - population builders
- Refactored parts of:
    - `cypress/Shared/MeasuresPage.ts`
    - `cypress/Shared/CQLLibrariesPage.ts`
    - `cypress/Shared/Utilities.ts`
    - `cypress/e2e/Services/Measure Service/MeasureGroup.cy.ts`
    - `cypress/e2e/Services/Measure Service/TestCaseExport.cy.ts`
    - `cypress/e2e/Services/Measure Service/DeleteCMSID.cy.ts`
    - `cypress/e2e/Services/Measure Service/MeasureTranslatorVersion.cy.ts`
    - `cypress/e2e/Services/Measure Service/ViewHumanReadable.cy.ts`
    - `cypress/e2e/Services/Measure Service/MeasureVersion.cy.ts`
    - `cypress/e2e/Services/Measure Service/MeasureLockValidations.cy.ts`
    - `cypress/e2e/Services/Measure Service/TestCaseImport.cy.ts`
    - `cypress/e2e/Services/Measure Service/DraftMeasure.cy.ts`
- Added `cypress/Shared/MeasureGroupTestData.ts` as the first Priority 2 extraction for giant-spec setup/data builders.
- Removed committed spec-level `it.only`.
- Added `quality:audit` and `quality:no-focused-tests`.
- Added quality audit counters for:
    - focused tests
    - skipped tests
    - manual fixture path plumbing
    - manual access token plumbing
    - fixed waits
    - forced interactions
    - global uncaught exception suppression
- Cleaned up `MeasuresPage.actionCenter` after the refactor pass so the helper compiles and does not contain duplicated switch logic.
- Added generic `TestData.requestWithAccessToken`, `readFixture`, `readTestCaseId`, and `readMeasureSetId` helpers.
- Added `TestData.requestTranslatorVersion`, `versionMeasure`, `requestHumanReadable`, and `requestHtmlDiff` helpers.
- Added `TestData.requestMeasureLock` for measure lock/unlock service calls.
- Added `TestData.readTestCasePatientId` and `requestTestCaseImports` for test-case import service calls.
- Added `TestData.readVersionId`, `requestMeasureDraft`, and `requestDraftStatus` for draft service calls.
- Added `TestData.writeFixture` for user-scoped fixture writes.
- Replaced repeated test-case export request setup with a single export helper.
- Replaced Delete CMS ID nested cookie/fixture/request plumbing with shared `TestData` helpers.
- Replaced Delete CMS ID `cmsId` fixture write with `TestData.writeFixture`; the spec now documents why the non-owner check runs before the destructive admin delete.
- Replaced translator-version, measure-version, human-readable, and HTML diff request plumbing in focused service specs.
- Replaced standalone Measure Version service tests with shared versioning and fixture helpers.
- Replaced Measure Lock validation auth and measure ID plumbing with a shared lock helper.
- Replaced Test Case Import auth, measure ID, patient ID, versioning, and import request plumbing with shared helpers.
- Replaced the first Draft Measure version/draft flow with shared versioning, draft, and fixture helpers.
- Moved Measure Group population builders and population-definition assertions out of `MeasureGroup.cy.ts`.
- Continued the Measure Group Priority 2 extraction by moving additional repeated population-definition assertions behind `MeasureGroupTestData.expectPopulationDefinitions`.
- Added Measure Group request-body builders for common proportion groups and second-initial-population ratio groups, then migrated the first endpoint and composite-score scenarios to `TestData.requestMeasureGroup`.
- Added population-basis validation builders and generic response typing for `TestData.requestMeasureGroup`, then migrated the Measure Populations scenarios away from manual auth and fixture plumbing.
- Added Measure Observation payload builders and migrated the Measure Observations scenarios to the shared measure-group request helper.
- Added Measure Stratification validation builders and migrated the first three stratification scenarios to shared request/test-data helpers.
- Added a described-stratification group builder and migrated the setup request in the add/edit/delete stratification workflow.
- Added `TestData.requestMeasureGroupStratification` for add/edit/delete stratification calls and migrated the remaining stratification workflow request plumbing.
- Added description-aware ratio group builders and migrated the no-second-IP description scenario to shared request/test-data helpers.
- Added second-initial-population and continuous-variable description builders, migrated the remaining description scenarios, and grouped `MeasureGroupTestData` by population, observation, description, stratification, and request-body concerns.
- Split the Measure Group builders into focused helper files:
    - `cypress/Shared/MeasureGroupPopulationTestData.ts`
    - `cypress/Shared/MeasureGroupObservationTestData.ts`
    - `cypress/Shared/MeasureGroupDescriptionTestData.ts`
    - `cypress/Shared/MeasureGroupStratificationTestData.ts`
    - `cypress/Shared/MeasureGroupConstants.ts`
- Kept `MeasureGroupTestData` as the stable facade so existing specs do not need broad import churn.
- Added `TestData.measureBody` and `TestData.requestMeasure` for common `POST /api/measure` setup.
- Migrated the first `Measure.cy.ts` create, GET, and measure-name validation scenarios away from repeated token/request/body plumbing.

## Current Smell Baseline

Run `npm run quality:audit` for the live numbers.

Current baseline after the latest refactor pass:

- 11 skipped tests.
- 560 manual fixture-path plumbing hits.
- 311 manual access-token plumbing hits.
- 95 fixed waits.
- 195 forced interactions.
- 1 global uncaught exception suppression.

## Priority 1: Finish TestData Migration

Move raw fixture and token plumbing into shared helpers. This is the highest leverage work because it removes copy/paste mechanics from most service tests.

Targets:

- `cypress/Shared/CreateMeasurePage.ts`
- `cypress/e2e/Services/Measure Service/EditMeasure.cy.ts`
- `cypress/e2e/Services/Measure Service/QI Core Test-Cases.cy.ts`
- `cypress/e2e/Services/Measure Service/Measure.cy.ts`
- `cypress/e2e/Services/Measure Service/DraftMeasure.cy.ts`
- `cypress/e2e/Services/Measure Service/MeasureBundle.cy.ts`

Expected shape:

- Add domain helpers for common measure, library, group, test-case API operations.
- Replace `cy.getCookie('accessToken')` blocks with `TestData.withAccessToken` or API helpers.
- Replace `cypress/fixtures/${currentUser}/...` string building with `TestData` helpers.
- Stop writing new specs that manually construct fixture paths.

Deferred notes:

- `MeasureVersion.cy.ts` still has edit/delete validation scenarios with shared auth and measure scope across several request bodies. Refactor those after adding domain helpers for versioned-measure edit/delete validation, so the current atomic behavior does not get split accidentally.
- `DraftMeasure.cy.ts` still has draft-status scenarios that chain version, draft, minor-version, patch-version, and draft-status transitions. Refactor those after the draft helper patterns are expanded for measure-family state transitions.

## Priority 2: Break Up Giant Specs

The largest specs mix setup, data construction, API calls, UI workflow, and assertions. Split by behavior and move setup builders into helpers.

Targets:

- `MeasureHighlighting.cy.ts`
- `MeasureGroup.cy.ts`
- `EditMeasure.cy.ts`
- `Measure.cy.ts`
- `QI Core Test-Cases.cy.ts`
- `MeasureBundle.cy.ts`

Expected shape:

- One describe per behavior area.
- Reusable setup functions near the domain helper, not buried inside specs.
- Explicit test data builders rather than long inline request bodies.

Trial result:

- `MeasureGroup.cy.ts` is a good candidate for incremental extraction rather than immediate file splitting.
- First extraction moved population builders/assertions to `MeasureGroupTestData` and the full spec still passed: 21 passing, 0 failing.
- Follow-up extraction replaced more sequential population-definition assertions while leaving the non-sequential index-skipping assertion visible for behavior review; the full spec still passed: 21 passing, 0 failing.
- Request-body builder extraction removed more nested auth/fixture/request blocks from the first endpoint and composite-score scenarios; `MeasureGroup.cy.ts` dropped from 1,889 lines to 1,631 lines, and the full spec still passed: 21 passing, 0 failing.
- Population-basis validation extraction removed another set of repeated request bodies and negative-path request plumbing; `MeasureGroup.cy.ts` dropped to 1,474 lines, and the full spec still passed: 21 passing, 0 failing.
- Measure Observations extraction moved ratio/CV observation payloads into shared builders; `MeasureGroup.cy.ts` dropped to 1,370 lines, and the full spec still passed: 21 passing, 0 failing.
- Measure Stratifications validation extraction moved three more request bodies into shared builders; `MeasureGroup.cy.ts` dropped to 1,168 lines, and the full spec still passed: 21 passing, 0 failing.
- Stratification add/edit/delete setup extraction moved the create-group payload into a shared builder; `MeasureGroup.cy.ts` dropped to 1,091 lines, and the full spec still passed: 21 passing, 0 failing.
- Stratification add/edit/delete API helper extraction removed the remaining nested token/fixture/request plumbing from the workflow; `MeasureGroup.cy.ts` dropped to 1,010 lines. The first sanity run caught a helper URL bug where the stratification ID was appended to the `PUT` URL; after fixing `PUT` to use `/stratification` and `DELETE` to use `/stratification/{id}`, the full spec passed: 21 passing, 0 failing.
- Description scenario extraction moved the no-second-IP POST/PUT request bodies into shared ratio-description builders; `MeasureGroup.cy.ts` dropped to 867 lines, and the full spec still passed: 21 passing, 0 failing.
- Remaining description scenario extraction moved the second-IP and CV POST/PUT request bodies into shared builders; `MeasureGroup.cy.ts` dropped to 632 lines, and the full spec still passed: 21 passing, 0 failing.
- Helper split kept the stable `MeasureGroupTestData` import while moving population, observation, description, stratification, and shared constants into focused helper files. The first sanity run caught a facade binding issue caused by assigning static methods that rely on `this`; after replacing those assignments with explicit forwarding methods, the full spec passed again: 21 passing, 0 failing.
- Next Priority 2 move should pause `MeasureGroup.cy.ts` extraction and move to a different giant-spec target unless a follow-up review finds more high-value Measure Group behavior to extract.

Measure Service follow-up:

- `Measure.cy.ts` is nominally a service/API spec, but the admin-delete sections use UI setup:
    - API creates the measure with `cql` and `elmJson`.
    - API creates the group.
    - UI logs in, opens the measure, enters the CQL editor, appends a newline, clicks Save, and waits for the "CQL updated successfully" alert.
- That UI save path is likely being used to force a "valid/saved CQL" state before versioning/admin-delete checks.
- This is a culture-of-quality smell: API tests should not depend on UI editing just to prepare API state.
- Next investigation should spy on the CQL editor save network calls and replace the UI setup with an API helper if possible.

## Priority 3: Replace Fixed Waits

Fixed waits are concentrated in list sorting, CQL editor, export, and minimize-alert specs.

Targets:

- `MeasureListNewColumnsSort.cy.ts`
- `CQLLibraryListPageColumnSort.cy.ts`
- `QICoreMeasureExport.cy.ts`
- `MinimizeAlerts.cy.ts`
- `CQLCodeSystem.cy.ts`
- `QmigSTU5FileValidations.cy.ts`
- `TestCaseJSON_TerminologyTests.cy.ts`
- `CQLEditorPage.ts`

Expected shape:

- Use route aliases for network-backed waits.
- Use visible/enabled assertions for UI readiness.
- Add small polling helpers only when the app has eventual background processing.

## Priority 4: Reduce Forced Interactions

Forced interactions hide readiness and selector problems.

Targets:

- `TestCasesPage.ts`
- `TestCaseImportValidations.cy.ts`
- `MeasureHighlighting.cy.ts`
- `RTEField.cy.ts`
- `ValidateCQLLibraryEditor.cy.ts`
- `QDMValidateCqlLibraryEditor.cy.ts`
- measure association validation specs

Expected shape:

- Use stable test IDs.
- Wait for enabled/visible state before action.
- Keep `{ force: true }` only for intentionally hidden native controls or drag/drop/file-upload cases.

## Priority 5: Revisit Global Exception Suppression

`cypress/support/e2e.ts` still suppresses all uncaught app exceptions.

Expected shape:

- Replace blanket suppression with targeted known-error filtering.
- Log unexpected app exceptions.
- Eventually fail on unexpected app exceptions.

## Priority 6: Skipped Test Ownership

There are 11 skipped tests.

Expected shape:

- Each skipped test should have an owner and ticket in a comment.
- Delete obsolete skipped tests.
- Enable valid skipped tests after fixing setup/app blockers.

## Regression Test Set For Recent Refactors

Recent shared-helper changes touch measure row action centers, CQL library row actions, cleanup paths, environment config, and measure-group API requests.

Run these after each related refactor:

```bash
npm run compile
npm run quality:no-focused-tests
npm run quality:audit
npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/MeasureGroup.cy.ts"
npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/WebInterface/Measure/QDM CQL Editor/QDMCodeSearch.cy.ts"
npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/WebInterface/Test Cases/QDM Test Case/QDM Test Case Validations/QDMCQMExecutionFailureErrorValidations.cy.ts"
npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/WebInterface/Test Cases/QDM Test Case/Execution/QDMCVMeasure_with_multiple_Groups_with_MO.cy.ts"
```

If credentials or remote environment access are unavailable locally, run the same specs in the pipeline environment and compare failures against pre-refactor behavior.

## Regression Notes: 2026-07-01 Refactor Pass

Static checks completed after the helper cleanup:

- `npm run compile` passed.
- `npm run quality:no-focused-tests` passed.
- `git diff --check` passed.
- `MeasureGroupTestData` facade split check: `npm run compile` passed, `git diff --check` passed, and the focused Measure Group browser spec passed after the binding fix.
- `Measure.cy.ts` first service-helper migration check: `npm run compile` passed, `git diff --check` passed, `npm run quality:no-focused-tests` passed, and `npm run quality:audit` passed.

Cypress local runner notes:

- Cypress must be run with `ELECTRON_RUN_AS_NODE` unset in this local shell. Without that, Cypress fails during smoke verification with `bad option: --no-sandbox --smoke-test --ping`.
- Local runs also emit `NODE_EXTRA_CA_CERTS=path/to/zscaler-cert.pem` warnings because that cert path does not exist. The warning did not block the run.
- Cypress verification required access to the user's Cypress cache/browser paths outside the workspace sandbox.

Targeted regression run before stopping:

- `cypress/e2e/Services/Measure Service/MeasureGroup.cy.ts`: 21 passing, 0 failing after the latest helper split.
- `cypress/e2e/Services/Measure Service/Measure.cy.ts`: 36 passing, 0 failing after the first `TestData.requestMeasure` migration. Runtime was 17m 2s, mostly from UI-backed admin-delete setup that does not belong in a service/API spec.
- `cypress/e2e/WebInterface/Measure/QDM CQL Editor/QDMCodeSearch.cy.ts`: 3 passing, 4 failing.
- `cypress/e2e/WebInterface/Test Cases/QDM Test Case/QDM Test Case Validations/QDMCQMExecutionFailureErrorValidations.cy.ts`: 3 passing, 1 failing.
- `cypress/e2e/WebInterface/Test Cases/QDM Test Case/Execution/QDMCVMeasure_with_multiple_Groups_with_MO.cy.ts`: previously failed 0 passing, 2 failing before `MeasuresPage.actionCenter` cleanup. A follow-up rerun was stopped by request after the first scenario failed and the second scenario had started.

Failure comparison notes:

- `MeasureGroup.cy.ts` passing is the strongest confirmation that the new `TestData.requestMeasureGroup` and population-builder changes are behaving for the service-level measure group flow.
- The `QDMCodeSearch.cy.ts` failures look like exposed existing regression coverage after removing committed `it.only`, not obviously caused by the shared helper refactor:
    - Three tests timed out waiting for `@codeSystems`; no request was observed.
    - One test never found `[data-testid="cql-builder-errors"]`.
- The `QDMCQMExecutionFailureErrorValidations.cy.ts` formerly focused valueset scenario passed after removing `it.only`; a different scenario failed waiting for `[data-testid="test-case-alerts"]`.
- The QDMCV spec is still suspect because it exercises the recently changed `MeasuresPage.actionCenter("edit")` path. The helper now compiles and no longer contains duplicated code, but the stopped rerun still showed the first scenario failing before completion. Treat this one as unresolved until a full rerun captures the exact post-cleanup failure stack and screenshot.

## Investigation Notes: Valid/Saved CQL Without UI

Current `Measure.cy.ts` admin-delete setup does this:

- `CreateMeasurePage.CreateQICoreMeasureAPI(...)` or `CreateQDMMeasureWithBaseConfigurationFieldsAPI(...)`.
- `MeasureGroupPage.CreateCohortMeasureGroupAPI(...)`.
- `OktaLogin.Login()`.
- `MeasuresPage.actionCenter('edit')`.
- Open CQL editor tab.
- Type `{moveToEnd}{enter}` into `.ace_content`.
- Click `[data-testid="save-cql-btn"]`.
- Wait for `.madie-alert` to be visible.
- Log out.

Known API state already provided by create helpers:

- Measures are created via `POST /api/measure?addDefaultCQL=false`.
- Request body includes `cql`.
- Request body includes `elmJson`.
- Request body includes model, measurement period, measure metadata, program use context, version ID, and measure set ID.

Unknown state added by UI CQL save:

- Whether the save updates the measure through `PUT /api/measures/{measureId}`.
- Whether it calls translator validation before update, such as `/api/fhir/cql/translator/cql*`.
- Whether it calls terminology/VSAC validation before update.
- Whether it normalizes the library statement or generated ELM before persisting.
- Whether versioning/admin delete only needs persisted `cql`/`elmJson`, or also needs derived fields from the CQL-save pipeline.

Spy plan:

- Add a temporary focused Cypress probe around one QI-Core admin-delete setup.
- Intercept broad editor-save candidates before clicking Save:
    - `PUT /api/measures/**`
    - `POST /api/measures/**`
    - `PUT /api/fhir/cql/translator/cql*`
    - `POST /api/fhir/cql/translator/cql*`
    - `PUT /api/vsac/validations/**`
    - `POST /api/vsac/validations/**`
- Capture method, URL, status, and request body shape only; do not keep sensitive headers.
- Use the captured calls to build a service helper, probably named something like `TestData.saveMeasureCql` or `TestData.prepareVersionableMeasure`.
- Replace the UI setup in `Measure.cy.ts` only after proving the API helper can version and admin-delete both QI-Core and QDM measures.
- After replacement, rerun `Measure.cy.ts` and compare runtime. Target should be minutes faster and still 36 passing.

Runtime state note:

- `cypress/plugins/userLock.json` and `cypress/plugins/altUserLock.json` were modified by the interrupted Cypress run. Review or reset those runtime lock files intentionally before committing.

Next verification command set:

```bash
npm run compile
npm run quality:no-focused-tests
npm run quality:audit
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/WebInterface/Test Cases/QDM Test Case/Execution/QDMCVMeasure_with_multiple_Groups_with_MO.cy.ts"
```

Do not treat every red test in this group as refactor-caused. Compare against the notes above and the last known regression run first.

## Sanity Notes: DeleteCMSID.cy.ts

Targeted command:

```bash
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/DeleteCMSID.cy.ts"
```

Result after moving `cmsId` writes to `TestData.writeFixture` and ordering the destructive delete last:

- 1 passing, 1 failing.
- Passing: admin CMS ID delete succeeds with `200`.
- Failing: non-owner delete assertion expects `403 Forbidden: Invalid user role`, but the service returns `409`.
- This failure was reproduced even when the non-owner check ran before the admin delete, so it is not only order pollution from deleting the CMS ID first.
- Follow-up needed: inspect the API contract/current response body for non-owner CMS ID deletion and decide whether the expected status should remain `403` or be updated to the product's current `409` behavior.

## Sanity Notes: MeasureLockValidations.cy.ts

Targeted command:

```bash
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/MeasureLockValidations.cy.ts"
```

Result after moving measure lock PUT/DELETE calls to `TestData.requestMeasureLock`:

- 1 passing, 0 failing.
- Confirms the helper preserves the timing-sensitive behavior where an immediate delete reports `200` but keeps the young lock.

## Sanity Notes: TestCaseImport.cy.ts

Targeted command:

```bash
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/TestCaseImport.cy.ts"
```

Result after moving test-case import requests to `TestData.requestTestCaseImports`:

- 6 passing, 0 failing.
- Covers successful import, population mismatch warning, invalid JSON, non-owner authorization, versioned-measure import, and multiple-file validation.

## Sanity Notes: DraftMeasure.cy.ts

Targeted command:

```bash
env -u ELECTRON_RUN_AS_NODE npx cypress run --env configFile=dev --browser chrome --spec "cypress/e2e/Services/Measure Service/DraftMeasure.cy.ts"
```

Result after moving the first version/draft flow to `TestData.requestMeasureDraft`:

- 5 passing, 0 failing.
- Covers the refactored version-and-draft scenarios plus the still-deferred draft-status scenarios.
