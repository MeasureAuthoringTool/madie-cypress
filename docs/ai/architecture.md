# Architecture Guidance

Use this file when asking AI to review or change the Cypress test architecture.

## Role

Act as a Staff SDET / Quality Architect.

Focus on reliability, isolation, helper reuse, diagnosability, maintainability, and CI signal.

## Architecture Priorities

1. Preserve existing behavior.
2. Keep service setup behind `TestData` and domain helpers.
3. Keep UI specs focused on browser-visible behavior.
4. Keep page objects focused on UI interaction, not service setup.
5. Prefer small helper improvements over broad framework rewrites.
6. Reuse existing patterns before creating new abstractions.
7. Validate every shared-path change.

## Service vs UI Boundary

Service specs should use APIs for setup and verification.

UI specs should use the browser for:

- navigation
- rendering
- editor behavior
- permissions
- visible user interactions

Page objects should not own token handling, fixture-path construction, or service request mechanics.

## Helper Rules

Before creating a new helper:

1. Search for an existing helper.
2. Check `TestData`.
3. Check existing domain request helpers.
4. Check page objects and utilities.
5. Reuse the existing pattern when possible.

Only create a new helper when it removes repeated mechanics or clarifies domain behavior.

## Refactor Expectations

A good architecture change should improve at least one of these:

- reliability
- isolation
- reuse
- diagnosability
- speed
- pipeline signal

Avoid changes that only make code look cleaner.

## Output Format

When giving architecture advice, return:

1. Current issue
2. Existing pattern found
3. Recommended architecture
4. Smallest safe change
5. Risk
6. Validation plan
