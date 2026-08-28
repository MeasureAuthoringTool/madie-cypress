# Okta Login Reliability Refactor

## Purpose

This document defines the bounded refactor of `cypress/Shared/OktaLogin.ts`. It records current authentication behavior, the risks that must remain covered, and the order of work. It does not authorize a broad authentication redesign.

## Current Behavior

`OktaLogin` is shared UI-test infrastructure. Its public APIs serve standard, alternate-user, reviewer, administrator, session-cached, and service-setup flows.

| Public path | Current mechanism | Required outcome |
| --- | --- | --- |
| `Login()` | Selected primary token cookie, app auth guard, then Okta-form fallback. | Landing page as selected primary user. |
| `AltLogin()` | The same path for the selected alternate user. | Landing page as selected alternate user. |
| `ReviewerLogin()` | Reserves `harpUser2`, then uses the primary-user path. | Reviewer isolated until `releaseReviewer()`. |
| `AdminLogin()` | Admin token/form credentials. | Landing page as administrator. |
| `SessionLogin()` / `SessionAltLogin()` | Caches cookie setup with `cy.session`, then visits and proves the landing page. | Reusable browser session for no-op `Logout()` specs. |
| `setupUserSession()` / `setupAdminSession()` | Clears browser state and sets an API token. | Service requests use the intended user. |

The normal login engine currently:

1. Clears browser state, registers service-config and UMLS intercepts, and visits `/login`.
2. Writes intercepted feature flags to `cypress/fixtures/featureFlags`.
3. Obtains an Okta access-token cookie through the existing `setAccessTokenCookie*` command.
4. Visits `/` so the application auth guard resolves the cookie.
5. Polls for the Okta form or landing page; it retries via `/login`, then uses a cookie-cleared form fallback.
6. Waits for UMLS status; a non-200 response opens the existing UMLS form flow.
7. Asserts that the landing-page New Measure control is visible.

`visitWithRetry()` is an independent dependency. On a failed server probe, it waits ten seconds and retries up to five probes before visiting. Those delays are purposeful network recovery behavior and are out of scope for the first slice unless validation proves they cause the observed failure.

## Confirmed Refactor Targets

- `UILogout()` has fixed waits of 4.5 seconds before reload and 3 seconds after sign-out. They hide the actual readiness condition.
- Login readiness uses a custom jQuery poller with two 60-second windows, plus a separate 110-second UMLS alias wait. Failures have weak phase-level evidence and can take minutes to surface.
- User-to-token-setter and user-to-credential mappings are repeated in normal login, session login, and service setup.
- `AdminLogin()` uses a generic mapping key (`any`), unlike selected-user mappings. Preserve its behavior while making that configuration explicit.
- Feature-flag persistence is embedded in authentication although it is bootstrap state. Its consumers and necessity must be known before it moves.

## Work Items

### 1. Establish a focused safety net

- Identify one stable consumer each for primary, alternate, reviewer, admin, and session login.
- Record environment, account prerequisite, and landing readiness expectation.
- Run the paths unchanged first; retain command-log phase evidence for failures.

Done when a reproducible validation matrix exists without behavior changes.

DEV proof: the Measure and Library All Reviews reviewer specs pass when run
individually through terminal Cypress commands and release all account locks.

### 2. Instrument login phases before control-flow changes

Status: Completed. `runLoginFlow()` now emits `STEP:` markers for bootstrap,
token-cookie acquisition, authentication branch/fallback, UMLS status, and
landing-page readiness. The focused TEST flow passed with these diagnostics.

- Add concise phase logging for state reset, token acquisition, app-auth resolution, form fallback, UMLS result, and landing readiness.
- Include account key and branch taken, never credentials, tokens, or response bodies.
- Capture route/response status at the existing failure boundary.

Done when a failure identifies its phase without fixed waits, broad suppression, or sensitive logs.

### 3. Remove fixed waits from UI logout

Status: Completed. The 4.5-second pre-reload and 3-second post-sign-out waits
were removed from `UILogout()` and `AdminMeasureShare.cy.ts` passed in TEST.

- Find the durable post-reload and post-sign-out conditions exposed by MADiE or Okta.
- Replace the 4.5-second pre-reload and 3-second post-click waits with those conditions.
- Preserve non-cascading cleanup: report an unavailable profile menu without making teardown an unrelated failure.
- Reassess the forced sign-out click after confirming whether the control is genuinely hidden/native.

Done when `UILogout()` has no fixed waits and focused callers retain cleanup behavior.

### 4. Consolidate account configuration without changing public APIs

- Define one typed internal account registry for primary, alternate, reviewer, and admin token setters plus credentials.
- Reuse it from normal, session, reviewer, admin, and service-setup paths when defaults remain identical.
- Keep public method names, selected-user env vars, reviewer locking, and release semantics unchanged.

Done when each supported account is represented once per concern and UI/service boundaries remain unchanged.

### 5. Simplify readiness only after proof

- Separate app bootstrap, token/auth resolution, form fallback, UMLS, and landing readiness into named internal operations.
- Replace the DOM poller only if Cypress-native assertions or route/request contracts prove the same outcomes without an alias race.
- Treat `visitWithRetry()` and feature-flag ownership as separate evidence-driven follow-ups.

Done when all fallback branches have focused proof and failures state the failed phase and expected contract.

## Non-Goals

- Do not change credentials, OAuth endpoints, token parsing, or account-pool capacity.
- Do not migrate ordinary specs to `cy.session()` wholesale.
- Do not remove reviewer locking, UMLS behavior, or form fallback on static inspection alone.
- Do not add retries, fixed waits, broad exception suppression, or forced interactions.
- Do not combine this with unrelated editor/navigation migration.

## Validation Matrix

Run baseline checks for every shared-path slice:

```bash
npm run compile
npm run quality:no-focused-tests
git diff --check
```

| Change | Minimum focused proof |
| --- | --- |
| Normal mapping | Stable UI spec using `Login()` |
| Alternate mapping | Permission/ownership UI spec using `AltLogin()` |
| Reviewer behavior | Reviewer spec using `ReviewerLogin()` and `releaseReviewer()` |
| Admin mapping | Admin UI spec using `AdminLogin()` |
| Session behavior | Spec using `SessionLogin()` or `SessionAltLogin()` with no-op `Logout()` |
| API setup mapping | Service spec using `TestData.setupUserScope()` or `setupUserSession()` |
| UI logout | Spec whose teardown calls `UILogout()` |

Use TEST configuration for credentials-dependent regression proof.

## Process Improvements

1. Treat authentication failures as phase failures: reachability, token acquisition, app auth resolution, form fallback, UMLS, or landing readiness.
2. Validate a small representative matrix, not one successful primary login; this helper has distinct account and session contracts.
3. Keep bootstrap concerns separate from authentication concerns; feature flags and reachability retries need named owners and evidence-based contracts.
4. Make every fallback observable in CI: why it was entered and whether it recovered.
5. Refactor in reversible slices: logout waits first, configuration consolidation second, readiness/control-flow simplification last.
