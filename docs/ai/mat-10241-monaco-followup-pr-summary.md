# MAT-10241 Monaco Follow-up PR Summary

## Summary

Completes the Cypress migration from Ace editor interactions to Monaco-backed helpers and selectors. The follow-up hardens the shared CQL save path, corrects affected smoke-test fixtures, and validates the changed workflows across QI Core, QDM, test-case, versioning, and export coverage.

## Changes

- Replaced residual Ace CQL, JSON editor, error-marker, dirty-state, and JSON assertion paths with Monaco helpers and semantic `data-testid` selectors.
- Removed retired Ace-only helpers and selectors after their callers were migrated.
- Centralized repeated Bundle and reference-resource JSON assertions behind shared helpers.
- Updated the shared `saveMonacoCql()` helper to:
  - open the CQL tab only when no visible Monaco editor is already present;
  - wait for the measure update `PUT` response to succeed before considering the CQL save settled.
- Corrected the smoke `SaveCQL` fixture so its CQL library declaration matches the generated library name.
- Removed a redundant post-save CQL reopen assertion from `SaveCQL`; the test now verifies the actual save request and save state through the shared helper.
- Corrected QI Core test data exposed by current TEST validation:
  - removed obsolete `us-core-sex` extensions tied to the retired TEST VSES value set;
  - changed `ProportionEpisode_PASS` Bundle `fullUrl` values to absolute Patient and Encounter URLs.

## Commit Summary

| Commit | Summary |
| --- | --- |
| `62af7c75` | Documented the Monaco migration follow-up scope. |
| `da5a3122` | Migrated residual CQL paths to Monaco. |
| `32ae99f1` | Replaced Ace JSON search assertions. |
| `845795da` | Adopted semantic test-case JSON editor selectors. |
| `97d13e82` | Migrated JSON dirty-state checks to Monaco. |
| `3d0c817b` | Removed retired Ace editor helpers. |
| `2b3398bb` | Replaced Ace CQL error selectors with Monaco error markers. |
| `9dac2d53` | Centralized Bundle JSON assertions. |
| `1511a1db` | Centralized reference-resource JSON assertions. |
| `1ddf6213` | Removed the final retired Ace error selector. |
| _this commit_ | Hardened CQL save settlement and corrected smoke-test fixtures. |

## Technical Notes

- Existing `MonacoEditor` and page-object helpers remain the single implementation path for editor interaction; no parallel editor abstraction was added.
- The shared save helper waits on the specific measure update request, not a broad route, avoiding false matches from measure-lock requests.
- Fixture changes are limited to data proven invalid by TEST validation; they preserve the existing measure/test-case intent.

## Testing

- `npm run compile`
- `npm run quality:no-focused-tests`
- `git diff --check`
- Headless grouped smoke validation covering QI Core 4, QI Core 6, QDM, exports, measure versioning, and test-case workflows.
- Focused headless validation of the corrected QI Core Ratio Encounter, Proportion Episode, and CV Encounter-with-stratification flows.

## Known External Issue

QRDA test-case export remains blocked by a DEV and TEST backend response:

`POST /api/measures/{measureId}/test-cases/qrda` returns HTTP 500, `An error occurred while creating a QRDA.`

The test preserves its success assertions because the server failure occurs after CQL save and test-case execution complete. A local defect report and Teams message were prepared separately for escalation.

## Risk

Low. The editor changes consolidate existing behavior through the shared Monaco helpers. The QRDA failure is a separate server-side issue and is not masked by this PR.

## Documentation Updates

The branch includes migration scope documentation. The QRDA defect report is intentionally local because `docs/bugs/*` is gitignored.
