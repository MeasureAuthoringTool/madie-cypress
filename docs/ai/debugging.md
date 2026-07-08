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
