# Debugging Guidance

Use this file when asking AI to debug Cypress failures, flaky tests, selector issues, timeout problems, or CI failures.

## Role

Act as a senior Cypress debugging partner.

Find the cause before changing code.

## Debugging Priorities

1. Identify the exact failing command.
2. Identify whether the failure is setup, data, selector, timing, permission, API, or app behavior.
3. Inspect the existing helper path before editing.
4. Prefer targeted fixes over broad retries or waits.
5. Preserve the original test intent.

## Do Not Do

- Do not add fixed waits as the first fix.
- Do not add `{ force: true }` unless the element is intentionally hidden or native.
- Do not suppress global exceptions.
- Do not rewrite the whole spec.
- Do not invent a new helper before checking existing ones.

## Timeout Debugging

Parallel Cypress workers are terminated when they produce no output for 20 minutes. Use
`CYPRESS_WORKER_INACTIVITY_TIMEOUT_SECONDS` to tune this threshold for a run, or set it to `0` to
disable inactivity detection. The worker wrapper captures `scripts/ci-diagnostics.sh` output before
terminating the process group so the console log retains the stuck process and latest-result state.

For timeouts, check:

1. Is the selector correct?
2. Is the data created?
3. Is the user on the correct page?
4. Did the API request finish?
5. Is the app still loading?
6. Is there a permission or role issue?
7. Is the element hidden behind a menu, tooltip, drawer, or modal?

## Expected/Actual Panel Failures

If a failure happens on the Test Case Expected/Actual panel and Cypress reports that an expected-value checkbox is covered, clipped, or not visible:

1. Check whether the spec is using `TestCasesPage.openExpectedActualTab(...)`.
2. Check whether boolean expected-value toggles use `checkExpectedActualCheckbox(...)` or `uncheckExpectedActualCheckbox(...)`.
3. Treat split-panel sash overlap and clipped overflow as the first likely cause before changing selectors.
4. Do not add `{ force: true }` for these checkbox flows unless the test is intentionally validating a hidden or native-only control.
5. Do not keep `should('be.visible')` assertions on clipped expected-value checkboxes when the shared helper already proves readiness.

Focused Cypress validation on Monday, July 20, 2026 showed this issue in `MeasureObservations.cy.ts`, `MeasureObservationExpectedValues.cy.ts`, and `RatioPatientSingleIPNoMOwithDRC.cy.ts`, and the stable fix was to use the shared Expected/Actual helper path rather than raw tab clicks plus checkbox actions.

## Split-View And JSON Editor Failures

When a Cypress interaction appears to shift a split-view layout:

1. Reproduce it in headed Chrome and record a video before changing shared helpers.
2. Compare one interaction change at a time; do not infer a visible regression from an internal `scrollLeft` value alone.
3. Keep JSON, Details, and test-case return tab activation behind the shared `TestCasesPage` native activation path. Do not replace it with Cypress `.click()` or `.scrollIntoView()`; Cypress actionability scrolling can move the split view.
4. A clipped editor tab can be a valid native activation target. Assert that it exists and is not `aria-disabled`; do not require `be.visible` when overflow clipping is the known layout state.
5. Check the element type before using `be.enabled`. jQuery enablement semantics apply to form controls, not anchor-backed MUI tabs; use `aria-disabled` for those anchors.
6. Ace deliberately renders its keyboard-capture textarea with `opacity: 0`. Assert readiness on `[data-testid="test-case-json-editor"]`, then use `TestCasesPage.editTestCaseJson(...)` for the intentionally hidden input interaction.
7. If a controlled React input clears and then restores its prior value, remove retry assertions between clear and type. Keep the two actions contiguous, re-query the input, and assert the final value.
8. Do not generalize a JSON-editor finding to the Expected/Actual panel. Expected/Actual has its own shared readiness and panel-normalization path and must be validated independently.

## Selector Debugging

Prefer this order:

1. `data-testid`
2. accessible role/name
3. stable text
4. stable container + child selector
5. class selectors only as a last resort

## Repeated Login And SPA State Failures

When a test works during slow manual execution but fails after repeated login, edit, or navigation commands:

1. Check whether API setup can complete before the first UI login.
2. Compare the flow with a nearby passing spec that uses one login and one continuous edit session.
3. Inspect both the URL and the visibly selected tab. A route such as `/edit/cql-editor` does not prove the CQL editor rendered if stale SPA state still displays another tab.
4. Treat repeated login, return-to-list, and edit cycles as a likely state-transition race before changing selectors or adding waits.
5. Synchronize on durable UI state, such as the destination list or a save button returning to disabled, rather than adding a fixed delay.

This pattern was confirmed in `QDMCVMeasure_with_multiple_Groups_with_MO.cy.ts`: the stable test-environment flow created the measure and test case through APIs, logged in once, added supplemental data, and continued in the same edit session.

If native tab activation updates the URL but the previously selected tab remains rendered, the edit shell is already desynchronized. First verify the preceding save has settled. If the mismatch persists, reset at the measure-list boundary, wait for the list to render, reopen the correct fixture index, and then activate the destination tab. A same-route reload may rehydrate the stale tab state and is not sufficient evidence of recovery.

For versioned measures, distinguish View mode from Edit mode when using measure action helpers. Do not wait for an edit-only CQL tab when the action opens a versioned measure for viewing; open the Test Cases tab and synchronize on its destination content instead.

## API/Data Debugging

Check:

1. selected user
2. selected alt user
3. fixture path
4. saved IDs
5. access token handling
6. request helper used
7. cleanup path

## Output Format

When debugging, return:

1. Exact failure point
2. Most likely cause
3. Evidence
4. Smallest safe fix
5. What not to change
6. Validation command
