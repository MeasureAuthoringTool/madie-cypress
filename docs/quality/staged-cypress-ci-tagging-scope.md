# Staged Cypress CI and tagging scope

Status: proposal; no implementation or Jenkins configuration changed by this document.

## Goal and acceptance criteria

One standard Jenkins selection runs the TEST regression in order: all eligible service/API tests in a single Cypress process, then all eligible UI tests across exactly three local Cypress workers. UI starts only after the service stage has completed successfully under the agreed retry policy. Service tests never enter the three-worker collection. The job fails on an execution failure, missing test coverage, or unresolved test failure; a zero-test stage is not success.

The reported HTTP 429s occur when service tests run in parallel. This is the operational reason for serial execution; the repository does not contain rate-limit telemetry proving a particular endpoint or threshold. Record endpoint, response body, and timing during rollout. If 429s remain with one worker, investigate the service or environment limit before changing concurrency.

## Verified current state

- The active CI definition is the root `Jenkinsfile`. GitHub workflows in this repository do not run the Cypress regression. Jenkins presents a long `TEST_SCRIPT` choice list and `MANUAL_SPEC_LIST`; there is no staged-regression choice today.
- `test:all:services:tests` runs `cypress/e2e/Services/**/*.cy.ts` in one Cypress process. `test:all:ui:tests` runs `WebInterface` serially. `cy:parallel:test:all:tests` gives **all** `cypress/e2e/**/*.cy.ts` files to `cypress-parallel -t 3`, including service specs. Existing three-worker UI-only choices cover smoke or Section 508 subsets, not all UI specs.
- Current discovery is by path, not tags. `@cypress/grep` is absent from `package.json`, the lockfile, `cypress.config.ts`, and support registration. The spec inventory currently includes 39 `Services` and 292 `WebInterface` `.cy.ts` files. `cypress/lighthouse/lighthouse.cy.ts` sits outside both directories and needs an explicit inclusion or exclusion decision before the coverage gate is enabled.
- `cypress.config.ts` registers local tasks and returns the environment-specific config from `cypress/plugins/index.js`. The new grep node plugin must be composed with that returned config and proven with `npm run compile` and a focused run; do not replace the existing plugin return or task setup.
- The Cypress support entry point reserves one primary **and one alternate** user for each spec, even if the spec does not use the alternate. Each pool has three slots. The file locks in `cypress/plugins/` coordinate processes that share this workspace. Reviewer reservation uses the primary lock file for `harpUser2` or reviewer-only `harpUser4`; reviewer suites must release their reservation. Admin credentials are shared and have no equivalent account lock.
- The initial Jenkins run is wrapped in `catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE')`. Its separate rerun stage may rerun failed specs twice, and the `post` block sets the final result from failure summaries. `scripts/resolve-spec-list.js` extracts spec lists from `--spec` or `-d` script arguments, so a composite npm script will not automatically produce a correct planned-spec list. Existing failure extraction and rerun scripts are not stage-aware.
- The reset-data procedure in `docs/quality/reset-data-ci-process.md` requires no concurrent TEST data writers. The proposed staged run must coordinate with other Cypress jobs and reset jobs aimed at TEST; a local JSON account lock does not cover another Jenkins workspace.

## Execution design

Use **one Jenkins build and workspace** for the three UI workers. Retain the existing Docker image, credentials, TEST config, timeout wrapper, and `cypress-parallel` reporter integration. Make a new standard Jenkins parameter choice such as `test:staged:service-then-ui`; route it to dedicated Jenkins stages rather than `npm run "$TEST_SCRIPT"`. Keep the existing targeted choices available during migration. Set the staged choice as the default once validated; simplify the rest of the dropdown in a later, separate change.

| Step | Selection | Workers | Gate |
| --- | --- | ---: | --- |
| Preflight | Validate tag coverage, account capacity, environment, and planned spec manifest | 1 | Stop on missing, duplicate, or conflicting routing. |
| Service | Eligible `@service` specs, including a service smoke tag if present | 1 | Finish required tests and any approved service-only rerun before UI. Preserve nonzero exit and failed/missing-spec status. |
| UI ordinary | Eligible `@ui` specs that can share the normal account pools | 3 | Run only after service succeeds; fail on missing/failed specs. |
| UI constrained | Reviewer, shared-admin, or truly exclusive UI specs identified during audit | 1 | Run after the ordinary UI collection, or in an independently guarded lane after service. Count them as part of the complete UI suite. |
| Reporting | Stage-specific initial, rerun, manifest, and artifact files | 1 | Final result reflects every stage and runner exit code. |

The UI constrained lane is a safety plan, not an assertion that every reviewer or admin spec currently conflicts. Audit each account-sensitive spec before assigning it. Reviewer flows already have a lock-aware allocator, but the reviewer pool overlaps a normal primary account; a serial lane avoids unnecessary contention. Admin mutations require a serial lane or proven independent data plus a new shared-account safeguard.

Prevent overlap with other TEST Cypress builds and reset-data operations using a Jenkins lockable resource for the TEST environment (or an equivalent job-level coordination mechanism used by every relevant job). `disableConcurrentBuilds()` on this Jenkins job is a useful local safeguard but does not coordinate different Jenkins jobs. Do not launch three independent Jenkins parallel branches with separate workspaces while file locks are local.

### Jenkins routing sketch

This is a design sketch, not a drop-in replacement for the current report/rerun stages:

```groovy
// Add to TEST_SCRIPT choices, then set as default after migration.
'test:staged:service-then-ui'

stage('Stage 1: Service') {
  when { expression { params.TEST_SCRIPT == 'test:staged:service-then-ui' } }
  steps {
    sh 'npm run ci:test:service' // one Cypress process; nonzero status fails the stage
  }
}

stage('Stage 2: UI') {
  when { expression { params.TEST_SCRIPT == 'test:staged:service-then-ui' } }
  steps {
    sh 'npm run ci:test:ui:parallel' // cypress-parallel -t 3, ordinary UI only
    sh 'npm run ci:test:ui:constrained' // one process, if audit finds these specs
  }
}
```

Implement both stages under the existing prepared Docker environment. The Stage 1 gate must explicitly account for the current `catchError` and rerun behavior: either finish service-only reruns inside Stage 1 before deciding success, or make the first service failure fail Stage 1 immediately. The latter is the safest first rollout. Do not let the current global rerun or `post` summary turn a failed or incomplete service stage into a successful gate. Keep report paths and planned spec manifests distinct by stage; do not clean Stage 1 results before archiving them.

## Tag contract and selection

Use `@cypress/grep` as the proposed tag implementation. Each runnable test inherits **exactly one** execution lane, `@service` or `@ui`. `@smoke` is optional cadence metadata; it does not replace an execution lane. Account/resource tags can be `@reviewer`, `@admin`, and `@exclusive` after auditing the actual scenarios. An optional `@pair` describes a test that switches to the alternate user; it does not assign a particular account or worker. Never tag with `@worker1` or a specific HARP account because allocation is dynamic.

Prefer lane tags on a top-level `describe` when all nested tests share the lane, and test-level tags for a mixed suite. Use arrays for multiple tags, for example `tags: ['@ui', '@smoke']`. Classify by the behavior under test: UI specs may call APIs for setup and still belong to `@ui`; service specs belong to `@service` only when they test service behavior. Do not move tests between lanes solely to improve runtime.

The official grep documentation uses `register()` in the Cypress support entry point, `plugin(config)` in node setup, and `--expose grepTags=...` for current Cypress versions. Add its types to `tsconfig.json` only if the installed version and compile require it. [Official grep usage](https://github.com/cypress-io/cypress/blob/develop/npm/grep/README.md)

Start selection with the existing folder glob and a matching lane tag. This gives an independent path check while tags are migrated. Build a deterministic manifest/audit for all runnable tests and specs; fail if a test has neither lane, both lanes, or a lane inconsistent with its intended path. Compare the unfiltered baseline against the union of planned service and UI tests, including skipped tests as a separately reported category. A `grepUntagged=true` exploratory run is useful but is not a sufficient coverage audit on its own.

Treat `grepFilterSpecs=true` as an optimization only after proving it does not omit suites with inherited tags or nested tag expressions. There is an open upstream report about inherited suite tags and AND pre-filtering, so do not depend on positive plus negative tag expressions to establish the mandatory coverage set. Use a precomputed manifest or explicit spec lists for constrained lanes if necessary. The selection audit must assert that every expected lane has at least one test and that actual results cover the planned tests. [Upstream pre-filter issue](https://github.com/cypress-io/cypress/issues/35029)

### Package/config sketches

The exact commands must be finalized after the tag manifest and grep integration are proven. Preserve the existing timeout wrapper and reporter options:

```json
{
  "scripts": {
    "ci:test:service": "NO_COLOR=1 env -u ELECTRON_RUN_AS_NODE node scripts/run-with-timeout.js ${CYPRESS_WORKER_TIMEOUT_SECONDS:-28800} cypress run --env configFile=test --browser chrome --spec 'cypress/e2e/Services/**/*.cy.ts' --expose grepTags=@service,grepOmitFiltered=true",
    "ci:test:ui:worker": "NO_COLOR=1 env -u ELECTRON_RUN_AS_NODE node scripts/run-with-timeout.js ${CYPRESS_WORKER_TIMEOUT_SECONDS:-28800} cypress run --env configFile=test --browser chrome --expose grepTags=@ui,grepOmitFiltered=true",
    "ci:test:ui:parallel": "cypress-parallel -s ci:test:ui:worker -t 3 -d 'cypress/e2e/WebInterface/**/*.cy.ts' -p 'cypress/parallel-reporter-config.json'"
  }
}
```

The UI worker sketch selects all `@ui` tests. Before enabling it, use the manifest to exclude audited constrained specs from the three-worker spec list and run them serially. A plain `@ui` grep alone is insufficient to enforce that isolation. Verify the `cypress-parallel` argument forwarding with a small smoke subset before relying on these commands.

## Account and state safeguards

- Keep the existing `getAvailableUser` and `getAvailableAltUser` tasks. The three-worker cap matches the three slots in **each** pool. Check all six credentials exist for the selected environment before starting. The unconditional alternate allocation is a known efficiency issue; converting it to opt-in is separate work and requires focused primary-only, paired, reviewer, and lock tests.
- Treat `@pair` as a review marker for multi-user behavior. It need not force a dedicated worker while both accounts are reserved through the existing shared lock. Validate alternate login, cleanup, and lock release paths in the focused rollout.
- Keep `@reviewer` specs serial initially. Verify `OktaLogin.releaseReviewer()` returns its chain from every changed teardown path; do not weaken the current reviewer reservation semantics.
- Identify shared admin, environment configuration, reset-sensitive, and state/rate-limited scenarios in a spec inventory. Put conflicting tests in the constrained serial lane or add a shared-resource lock that spans jobs. A tag documents a requirement; it is not itself a lock.
- Service and UI stages use the same account pool sequentially. After service finishes, verify no lock slot remains claimed before UI starts. A crashed process can leave a true lock value; recovery should validate the absence of an active owner and be explicit, never silently rewrite lock files during an active build.

## Implementation slices and proof

1. **Inventory and baseline.** List all service, UI, and out-of-tree specs; classify account requirements and known shared-state tests. Capture present spec/test counts, Jenkins parameter use, baseline reports, and 429 response evidence. Decide whether `cypress/lighthouse/lighthouse.cy.ts` belongs in the staged run. Identify any other jobs targeting TEST or applying reset data.
2. **Tag infrastructure.** Add the pinned `@cypress/grep` dependency and lockfile, register it with the existing config/support paths, and add a tag coverage audit. Prove a small service, ordinary UI, alternate-user, reviewer, and admin sample with no test-behavior changes. Check interaction with `failedTestFilter.ts` before enabling staged reruns.
3. **Tag migration.** Apply `@service` and `@ui` to all included tests. Add `@smoke` and account/resource tags only where verified. Make the manifest audit pass with zero omissions and zero double-lane tests. Run the ordinary UI collection only after constrained specs are excluded by explicit manifest/spec selection.
4. **Jenkins staged route.** Add one standard dropdown choice and a new branch in `Jenkinsfile`. Service runs in one process; a strict service result gates the three-worker UI stage. Keep existing manual/targeted commands working. Implement separate stage result files, artifact archive, and missing-spec checks. Avoid broad `cy:parallel:test:all:tests` in the new route.
5. **Retry integration.** First rollout may fail fast on initial service failure. If retaining retries, make them stage-local and account for runner errors and missing specs. Never allow UI to start when service initially failed unless the team explicitly chooses service reruns as an accepted gate. Keep reviewer/admin/exclusive reruns in their serial lane.
6. **Validation and rollout.** Run `npm run compile`, `npm run quality:no-focused-tests`, and `git diff --check`; verify tag audit and manifest checks. Run representative focused specs, one complete serial service stage, and one three-worker UI smoke pilot in TEST. Then run the complete staged selection and compare planned vs executed tests, account allocation logs, 429 responses, artifacts, and Jenkins result. Update stable guidelines only after the behavior is proven.

## Out of scope for this slice

Changing test assertions or UI/service behavior, rewriting login/session helpers, introducing a new account allocator, redesigning reset-data jobs, or replacing the full Jenkins reporting system. The report and rerun code needs targeted changes only to make the new stages accurate.

## Known decisions to resolve during inventory

- Whether the existing Jenkins policy should accept a service rerun as a pass, or require the first serial run to pass. The initial implementation should fail fast until that policy is explicit.
- Whether Lighthouse and any future out-of-tree specs belong in the standard regression.
- Which exact reviewer/admin/shared-state specs need the constrained serial lane; tag names alone cannot prove isolation.
- Whether a Jenkins lockable resource is already available for the shared TEST environment; if not, use the team's existing cross-job coordination mechanism before concurrent TEST jobs are allowed.
