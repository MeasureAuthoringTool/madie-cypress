# Refactor Prompt

You are refactoring Cypress TypeScript tests.

Goal:
Reduce duplication and improve reliability without changing behavior.

Before coding:

1. Identify the existing pattern.
2. Search for reusable helpers.
3. Explain the smallest safe change.
4. Do not edit yet unless asked.

Rules:

- Prefer existing `TestData` helpers.
- Do not create new helpers if one already exists.
- Do not add fixed waits.
- Do not add `{ force: true }` unless clearly justified.
- Keep negative/error assertions explicit.
- Preserve test intent.
- Keep the change small.
- When a refactor slice is complete, reassess the remaining scope before choosing the next target. Do not automatically continue to the next nearby file if a larger repeated pattern or higher-value bucket has emerged.

Output:

1. Files inspected
2. Existing pattern found
3. Proposed change
4. Risk
5. Validation command
