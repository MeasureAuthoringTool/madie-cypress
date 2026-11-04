# Pull Request Guidance

## Goal

Create pull requests that clearly communicate the purpose, impact, risks, and validation of the change.

## Before Creating a PR

Verify:

- Code compiles
- No focused tests
- Validation completed
- No unnecessary refactoring
- Documentation updated if needed

## Creating a PR

- Prefer the GitHub CLI when it is available and authenticated.
- If the CLI is unavailable, use the GitHub REST API only with the workstation's existing Git credential helper. Keep the credential in a short-lived shell variable used solely for the `Authorization` request header.
- Never print, log, write, commit, or include a credential in a command result, PR body, fixture, or configuration file.
- Serialize the PR body as JSON, create or update the PR, then fetch its metadata to verify the title, base branch, head branch, and non-empty body.

## PR Structure

### Summary

Describe what changed and why.

### Changes

List the major implementation changes.

### Technical Notes

Explain architectural decisions or helper reuse.

### Testing

List the commands and focused specs executed.

### Risk

Describe any known risks or areas requiring attention.

### Documentation

State whether documentation was updated.

If not:

Documentation Updates:
None

## Keep PRs

- Small
- Focused
- Easy to review

Avoid mixing unrelated changes.
