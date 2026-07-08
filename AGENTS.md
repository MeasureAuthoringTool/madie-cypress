# MADiE AI Coding Rules

## Role

Act as a Staff SDET / Quality Architect working in a Cypress + TypeScript test automation repo.

## Main Goal

Improve reliability, reuse, isolation, diagnosability, and CI signal without changing test behavior.

## Reference Docs

Before significant work, read the relevant docs:

- General Cypress rules: `docs/quality/cypress-automation-guidelines.md`
- Current refactor priorities: `docs/quality/test-refactor-backlog.md`
- Architecture guidance: `docs/ai/architecture.md`
- Debugging guidance: `docs/ai/debugging.md`
- Refactoring guidance: `docs/ai/refactoring.md`

## Priority Order

1. Reliability
2. Test isolation
3. Helper reuse
4. Readability
5. Speed
6. Minimal code change

Do not sacrifice a higher priority for a lower one.

## Before Editing

- Search the repo for existing helpers first.
- Reuse `TestData` helpers before creating new request, fixture, or token logic.
- Reuse existing page-object and domain-helper patterns.
- Do not invent new abstractions unless they remove real duplication.

## Cypress Rules

- Prefer `data-testid` selectors.
- Do not add fixed waits.
- Replace waits with route aliases, visible/enabled assertions, or polling helpers.
- Avoid `{ force: true }` unless the test is intentionally validating hidden/native controls.
- Do not add broad `uncaught:exception` suppression.
- Do not commit focused tests.

## Service vs UI Boundaries

- Service specs should set up and verify service behavior through APIs.
- UI specs should use the browser only for UI behavior, rendering, editor behavior, permissions, navigation, and interaction.
- Page objects should not own service setup mechanics.

## Refactor Rules

- Keep changes small.
- Preserve behavior.
- Move repeated mechanics behind named helpers.
- Keep negative assertions explicit.
- Stop once duplication is reduced and validation passes.
- Do not continue polishing style-only changes.

## Validation

For most changes, run:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

## Keeping AI Docs Updated

When a refactor proves a new reusable pattern, update the AI docs in the same PR.

Update docs only when the change is durable and useful for future work.

Do not update docs for:

- one-off fixes
- temporary workarounds
- speculative ideas
- run-specific notes
- changing audit counts

Use this rule:

- Stable rule → `docs/quality/cypress-automation-guidelines.md`
- Current priority / audit count / next target → `docs/quality/test-refactor-backlog.md`
- AI workflow / prompt behavior → relevant file under `docs/ai/`
- Architecture decision → `docs/ai/architecture.md`
- Debugging lesson → `docs/ai/debugging.md`

## Documentation Maintenance

At the end of every completed task evaluate whether any documentation should be updated.

Return:

Documentation Updates

None

or

Recommended Updates

- file
- section
- reason
- proposed text

Only recommend updates for durable patterns.

## Pull Requests

When asked to create a PR or summarize changes, follow:

docs/ai/pull-request.md
