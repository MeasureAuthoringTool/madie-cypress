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
3. Keep the JSON-editor tab activation inside `TestCasesPage.editTestCaseJson(...)`. Its native button activation is intentional because Cypress actionability scrolling changed the observed split-view layout during JSON-editor flows.
4. Do not generalize a JSON-editor finding to the Expected/Actual panel. Expected/Actual has its own shared readiness and panel-normalization path and must be validated independently.

## Selector Debugging

Prefer this order:

1. `data-testid`
2. accessible role/name
3. stable text
4. stable container + child selector
5. class selectors only as a last resort

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
