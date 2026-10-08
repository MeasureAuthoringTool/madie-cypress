# MAT-10241: Monaco Editor Cypress Conversion Plan

## Purpose

This plan scopes Cypress work for replacing the Ace-based CQL editor in `madie-measure` and `madie-cql-library` with the reusable Monaco component from MAT-10240. It also records the separately supplied `madie-admin` change. It preserves user workflows and avoids treating generated Ace or Monaco DOM as a durable automation API.

## Evidence Reviewed

- MAT-10240 foundation PR: `madie-editor#607`.
- Consumer review PRs: `madie-cql-library#358`, `madie-measure#1706`, and `madie-admin#98`.
- Completed admin Value Set Expansion feature: `madie-admin#38` (MAT-10176).
- MAT-10168 upstream contracts: `terminology-service#182` and `madie-admin#34`.
- Existing Cypress page objects, specs, fixtures, and quality guidance.

The editor package changes its public CQL component from `MadieEditor` to `MadieCqlEditor`, introduces Monaco CQL markers, severity glyphs, a custom theme, and native Find/Replace. It also exports a separate `MadieJsonEditor`.

MAT-10168 provides `GET /terminology/admin/valuesets` with `page`, `limit`, and optional `sortInfo` query parameters. The deployed UI currently renders URL, Version, Last Updated, Manually Modified, Action, and Delete; its action is **View/Edit Value Set** and opens the editable `Edit Valueset Data` dialog backed by the Monaco JSON editor.

## Working Scope: Reviewed PRs Are Authoritative

The ticket narrative excludes the Test Case JSON editor, but this plan uses the reviewed PRs as the implementation scope of record:

| PR | Actual reviewed change | Decision required |
| --- | --- | --- |
| `madie-cql-library#358` | Replaces the CQL editor with `MadieCqlEditor`. | In scope. |
| `madie-measure#1706` | Replaces Test Case JSON with `MadieJsonEditor` and replaces the Test Case CQL pane with `MadieCqlEditor`; it does not include the main measure CQL editor. | In scope; protect the JSON and read-only CQL changes. Track main-measure CQL migration separately unless a follow-up PR adds it. |
| `madie-admin#98` | Replaces Value Set JSON editor implementations with the shared `MadieJsonEditor`. | In scope as a regression of the deployed Value Set edit dialog; validate it as a distinct JSON acceptance bucket. |

The Test Case CQL pane is in scope as read-only, and the Test Case JSON editor is in scope because `madie-measure#1706` migrates it. The documented ticket boundary should be corrected separately to match this delivered scope.

## Current Cypress Impact

Fourteen files contain direct Ace DOM or Ace-instance assumptions. The primary conversion targets are:

- Shared page objects: `CQLEditorPage.ts`, `CQLLibraryPage.ts`, and `EditMeasurePage.ts`.
- Library marker/tooltip specs: `CQL Library/CQL Editor/ValidateCQLLibraryEditor.cy.ts`, `CQL Library/CQL Editor/QDMValidateCqlLibraryEditor.cy.ts`, and `CQL Library/VersionAndDraft/VersionCQLLibraryWithErrors.cy.ts`.
- Measure editor and CQL-builder specs: `Measure/QI Core CQL Editor/CQLEditor.cy.ts`, `QiCoreCQLParameters.cy.ts`, `QiCoreCQLDefinitions.cy.ts`, `QiCoreLibraryIncludes.cy.ts`, `QDM CQL Editor/QDMCQLParameters.cy.ts`, and `QDMCQLDefinitions.cy.ts`.

`CQLEditorPage.replaceCqlDocumentText()` and `Utilities.typeFileContents()` currently depend on synthetic keyboard entry. That is the highest-risk shared-path change: library validation specs use those paths for full CQL documents, so consumers must be protected through one replacement helper rather than edited in bulk.

The Test Case JSON selectors in `TestCasesPage.ts` and `commands.ts` are a conversion target for the `MadieJsonEditor` portion of `madie-measure#1706`; keep that work isolated from CQL helper conversion.

## Required Application Testability Contract

Before changing Cypress, the consuming applications must expose stable, semantic hooks owned by the app, not Monaco implementation classes:

1. A CQL editor container test id and an editable-input test id/accessible name, consistent for measure and library editors. Extend `MadieCqlEditor`/`MonacoCqlEditor` with `testId` and `inputTestId` props (matching `JsonMonacoEditor`), then have each consuming application provide its own semantic IDs. The deployed CQL component does not currently expose these props.
2. A read-only CQL container/input contract for the Test Case CQL tab.
3. A durable, user-visible validation summary for error, warning, and info; do not make a generated gutter class the only assertion surface.
4. A durable way to target a marker/glyph and observe its message. If Monaco cannot receive an attribute per glyph, expose an app-owned diagnostic list or accessible message linked to the selected line.
5. A Find/Replace trigger with an accessible name, plus accessible find and replace inputs/actions.
6. For JSON editors, a stable container/input contract that distinguishes the read-only Value Set Expansion viewer from editable Add/Edit Value Set JSON forms.
7. A Cypress-only, app-owned CQL editor bridge registered from Monaco's `onMount` callback and cleared on unmount. The bridge must be keyed by semantic editor identity (for example, `cql-library`), not `getEditors()[0]`. Cypress can use that named editor to call `executeEdits()` and assert `getValue()`. The application must forward `onMountEditor` through `MadieCqlEditor` to `MonacoCqlEditor`; the lower component already supports it.

This is a release gate. Cypress must not replace `.ace_*` with undocumented `.monaco-*` or `.inputarea` class selectors as its long-term contract.

## Implementation Tasks

1. **Align the ticket record.** Correct the documented story scope to match the PR-delivered Test Case JSON and admin Value Set JSON work; record that main-measure CQL migration is not in the reviewed measure PR.
2. **Complete the reviewed consumer implementations.** Verify the library CQL migration preserves CQL load, edit, save, reset, and persisted validation behavior. Verify Test Case JSON and read-only Test Case CQL behavior in measure. For admin, verify **View/Edit Value Set** opens `dialog-form` with the `Edit Valueset Data` title and preserves its editable Monaco JSON workflow. Add an app-owned JSON-editor test id before automating direct JSON changes; do not target `.monaco-editor` as a durable selector.
3. **Publish the testability contract.** Add the agreed stable attributes and accessibility labels in measure/library/admin. Review the contract with Cypress before merge.
4. **Convert shared Cypress paths by editor type.** Update `CQLEditorPage`, `CQLLibraryPage`, and `EditMeasurePage` for CQL. Update the existing Test Case JSON helper separately for `MadieJsonEditor`. Resolve the named app-owned editor bridge, replace the full model through `executeEdits()`, assert `getValue()`, then prove the normal UI Save persists the exact CQL through `TestData.readCqlLibrary()`. Do not use keyboard typing for full-document Monaco replacement.
5. **Migrate direct Ace consumers by behavior bucket.** First convert the three library validation/version specs (error persistence, marker/glyph, and exact diagnostic text). Then convert CQL builder sub-editor flows. Migrate Test Case JSON consumers independently; do not perform a repo-wide selector replacement.
6. **Add focused acceptance coverage.** Cover CQL load/save/reset; valid, error, warning, and info diagnostics; marker/glyph message; persisted diagnostics after re-entry; Find/Replace; QDM, QI-Core, and US Quality Core; Test Case CQL read-only rendering; Test Case JSON edit/save; and the admin Value Set edit dialog (open, title, close).
7. **Track the main measure CQL omission.** Create a follow-up implementation scope if the story still requires the main measure CQL editor, because `madie-measure#1706` does not change it.
8. **Add the MAT-10168 table journey if it lacks browser coverage.** Prove the API request query and rendered URL/Version/Last Updated/Manually Modified/Action/Delete columns, default URL ordering, three-state sort behavior, pagination, and selecting a row's **View/Edit Value Set** action.
9. **Protect the current MAT-10168 page-size behavior.** The ticket requirement is 25 rows by default; a follow-up PR not linked from the ticket implements that behavior. Assert 25 as the default and retain the available page-size options.
10. **Run staged DEV proof, then TEST regression.** Record product failures separately from selector-conversion failures. Do not weaken assertions, add fixed waits, force clicks, or global exception suppression.

## Regression Matrix

| Risk / acceptance area | Focused Cypress evidence |
| --- | --- |
| Library CQL load, save, and persisted errors | `CQL Library/CQL Editor/ValidateCQLLibraryEditor.cy.ts` |
| QDM library validation and markers | `CQL Library/CQL Editor/QDMValidateCqlLibraryEditor.cy.ts` |
| Invalid CQL blocks library versioning | `CQL Library/VersionAndDraft/VersionCQLLibraryWithErrors.cy.ts` |
| QI-Core measure CQL save, reset, translation errors | `Measure/QI Core CQL Editor/CQLEditor.cy.ts` |
| QDM builder sub-editors | `Measure/QDM CQL Editor/QDMCQLParameters.cy.ts` and `QDMCQLDefinitions.cy.ts` |
| QI-Core builder sub-editors / includes | `Measure/QI Core CQL Editor/QiCoreCQLParameters.cy.ts`, `QiCoreCQLDefinitions.cy.ts`, and `QiCoreLibraryIncludes.cy.ts` |
| US Quality Core workflow | `CQL Library/CreateCQLLibraryValidations.cy.ts` plus one USQC CQL save/open scenario added if it does not currently assert the editor contract |
| Test Case CQL view-only DEV note | `Test Cases/QI-CORE Test Case/TestCasePageCQL_PageObject.cy.ts` plus a targeted read-only assertion |
| End-to-end save/compile downstream behavior | one QI-Core 6 smoke flow and one QDM smoke flow that call `CQLEditorPage.saveCql()` |
| Test Case JSON migration | Existing JSON helper/consumer coverage, migrated to the `MadieJsonEditor` contract, with one focused edit-and-save proof |
| MAT-10168 service contract | Service-level proof for `GET /terminology/admin/valuesets` pagination, sorting, and Value Set display DTO; Cypress intercept asserts the selected row's page/limit/sort query |
| MAT-10168 Value Set table and dialog | Focused Admin spec for actual headers, URL default/three-state sorting, manually-modified indicator, 25-row default pagination, a row-specific **View/Edit Value Set** action, and `Edit Valueset Data` dialog open/close |

Run focused specs serially in DEV after deployment. Once they pass, repeat changed paths in TEST and run the existing smoke collection as CI confirmation. Baseline static validation for each Cypress change remains:

```bash
npm run compile
npm run typecheck:touched -- <changed Cypress files>
npm run quality:no-focused-tests
git diff --check
```

## DEV Baseline (2026-10-07)

`ValidateCQLLibraryEditor.cy.ts` was run against DEV before the Monaco consumer deployment. It executed 14 tests in 7m32s: 11 passed and 3 failed. This is an Ace baseline, not a Monaco result. The failures are pre-existing candidates to triage independently:

- missing-version include: expected diagnostic text did not appear;
- concept-constructor scenario: the editor detached during `cy.type()`;
- invalid Value Set: the Ace gutter marker detached during a forced click.

The latter two reinforce the plan: avoid private editor APIs and generated gutter selectors, re-query after application rerenders, and assert the app-owned diagnostic contract.

## Cypress Monaco Runtime Finding (2026-10-08)

The DEV CQL library editor's visible surface is in Cypress's AUT document and no iframe is present. In a Cypress headless run, that AUT window exposed `window.monaco`, but both `window.monaco.editor.getEditors()` and `getModels()` were empty after the editor surface was visible; the runner parent/top windows had no Monaco instance. In a normal DEV browser DevTools console, `window.monaco.editor.getEditors()[0]` did expose the mounted editor and `getValue()` returned the displayed CQL.

The MAT-10240 wrapper imports and configures its own bundled `monaco-editor` module for `@monaco-editor/react`; it does not assign that import to `window.monaco`. The wrapper receives the actual standalone editor in `onMount`, but `MadieCqlEditor` does not expose or forward the callback and the MAT-10241 CQL-library consumer cannot receive it. This is evidence that the Cypress-visible global registry is not the registry that owns the mounted CQL editor. It does not establish why the normal DevTools global resolves differently.

MAT-10241's lockfile resolves `@madie/madie-editor` 2.0.1, `@monaco-editor/react` 4.7.0, and `monaco-editor` 0.53.0. Monaco's open issue #5059 reports that Cypress synthetic input stopped changing editor content at 0.53.0, matching the focused DEV result. The November 2024 `getModels()[0].setValue(...)` Cypress example is wrapper-dependent: it assumes that the global Monaco object has a populated model registry. It is not applicable here because the Cypress-visible registry has zero models and therefore has no model URI, language, or content that can be safely identified.

Therefore, retrying Cypress access to the global Monaco registry, querying `ownerDocument.defaultView`, selecting the first global editor, or editing global models cannot establish a reliable CI contract. A named application bridge remains the minimal testability change for deterministic full-document replacement through `executeEdits()`.

`cypress-real-events` 1.15.1 is already installed. In DEV headless Chrome, `MonacoEditor.type()` (`realClick` plus `realType`) inserted a short CQL probe, and `MonacoEditor.replace()` (`realClick`, native Control+A, and `realType`) replaced it. The normal UI Save succeeded and `TestData.readCqlLibrary()` returned the exact replacement. The native fallback unblocks short typing and replacement, but it is per-character and is not a replacement for a bridge when tests need full CQL documents. The same run found both browser `EditContext` support and a `.native-edit-context` node.

For full CQL fixtures, `MonacoEditor.insertTextFromFile()` reads the fixture and uses CDP `Input.insertText` after a native editor click. A DEV headless Chrome run inserted `CQLForTestCaseExecution.txt`, completed the normal UI Save, and verified a final-fixture marker through `TestData.readCqlLibrary()` (43 seconds). Monaco auto-indents the document and MADiE retains the library declaration for the generated library, so this path must assert persisted semantic content rather than source-byte equality or virtualized `.view-lines` text. It is an opt-in bulk-insertion path, not a replacement for the named editor bridge where exact model edits are required.

An experimental CDP `Browser.grantPermissions` call successfully allowed `navigator.clipboard.writeText()` for the AUT origin, but the first headless native-paste attempt did not insert the clipboard content. A headed attempt is invalid evidence because manual editor interaction changed the contents while the runner was open. The helper was deliberately removed pending a clean headed proof. Manual Command+V is a trusted OS/browser paste path; `cypress-real-events` sends CDP key events and may not reproduce that semantic operation for Monaco EditContext. Do not use clipboard paste for CQL CI automation unless a new approach proves exact content and persistence in both modes.

CDP `Input.insertText` is a separate, non-clipboard alternative. It focuses the Monaco editor, inserts the requested text, and triggers MADiE's normal dirty-state and Save behavior. Monaco controls indentation and MADiE controls the generated library declaration, so use it only where editor-normalized persisted CQL is the accepted contract; do not use it for tests that require source-byte whitespace preservation.

## Validated Reference Migration: `ValidateCQLLibraryEditor.cy.ts`

The Qi-Core CQL library editor spec is the reference migration. It now uses `MonacoEditor.insertTextFromFile()` for blank editor scenarios, `replaceDocumentFromFile()` when a fixture replaces starter CQL, and `appendDocumentText()` for a brace-containing Concept declaration that `realType()` cannot emit. It removes all Ace wrapper, gutter, and tooltip selectors. Error content is verified through MADiE's generic error list; a visible `.squiggly-error` is asserted only in the error-persistence scenario because Monaco virtualizes off-screen marker DOM. Both describes use `afterEach(() => Utilities.deleteLibrary())` to remove every API-created library.

`CQLWithDefNoName.txt` was normalized to raw CQL by removing legacy `{home}` commands. Its parser location is now the actual raw-fixture result (`Row: 33, Col:27: Parse: 27:28`), rather than the Ace keyboard-command-era location. The cleanup-enabled DEV headless run passed all 14 scenarios in 7m01s. The reference spec demonstrates that every suite creating CQL libraries needs returned `afterEach` cleanup; retaining created data is allowed only during an uncommitted local debugging run.

### Completed QDM Library Migration: `QDMValidateCqlLibraryEditor.cy.ts`

The QDM CQL-library validation spec now uses `MonacoEditor.replaceDocumentFromFile()` for its full-document fixtures and shared Monaco error/marker assertions. The migration removed all Ace wrapper, gutter, and tooltip selectors, the obsolete fixed wait, and legacy `{home}` / `{del}` Cypress key commands from QDM fixtures. Both CQL-library suites retain returned `afterEach(() => Utilities.deleteLibrary())` cleanup. The DEV headless Chrome run passed all 9 scenarios in 4m57s.

### Completed USQC Library Creation Migration: `CreateCQLLibraryValidations.cy.ts`

The USQC library-creation scenario now replaces starter CQL with `MonacoEditor.replaceDocumentFromFile()`. Every successful UI or API library creation registers the existing `Utilities.deleteLibrary()` lifecycle cleanup, and the returned `afterEach` chain removes it after the scenario. The focused DEV headless Chrome rerun passed after the persistence assertion was updated to tolerate Monaco-rendered whitespace while still requiring the `using USQualityCore version '0.5.0'` clause.

### Remaining MAT-10241 Migration Scope

The current search identifies 12 remaining `Utilities.typeFileContents(...)` or `CQLEditorPage.replaceCqlDocument(...)` callers across three specs:

1. `MeasureLibraryMismatch.cy.ts`
2. `QDMCQLEditorValidations.cy.ts`
3. `RunAndExecuteTestCaseButtonValidations.cy.ts`

Migrate one spec at a time. First classify every interaction as blank-document insertion, full replacement, or short append; remove fixture key commands; replace Ace-only assertions with MADiE validation test ids and one representative visible marker test; add/verify cleanup; and run the full changed spec in headless Chrome before taking the next spec. Make small behavior-preserving refactors during each migration when they eliminate duplicate mechanics or obsolete editor code; keep unrelated redesign out of the migration.

## Minimal CQL Library Bridge Proposal

Implement this in the editor and CQL-library applications, not Cypress:

1. Add optional `onMountEditor` to `MadieCqlEditor`'s public props and pass it through to `MonacoCqlEditor`.
2. Add the same optional callback to the CQL-library `CqlLibraryEditor` props.
3. In the editable CQL-library consumer, save the supplied editor instance to `window.__madieCypressEditors["cql-library"]` only when `window.Cypress` exists. Use an effect cleanup that deletes the key only when it still points to that same instance.
4. Do not attach the bridge in a non-Cypress browser session, and do not modify editor options, values, or change handling.

The Cypress `MonacoEditor` helper should resolve `__madieCypressEditors["cql-library"]`, call `executeEdits("cypress", [{ range: model.getFullModelRange(), text: value, forceMoveMarkers: true }])`, and assert `editor.getValue()`. The focused test must then click the normal Save control, wait for save settlement, and use `TestData.readCqlLibrary()` to assert the persisted `cql` value. This proves the controlled React `onChange` path as well as the service persistence contract.
