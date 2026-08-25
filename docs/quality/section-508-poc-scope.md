# Section 508 Accessibility Automation POC Scope

Status: Proposed scope — no compliance claim

## Executive Summary

MADiE already has the technical foundation for automated accessibility checks:

- `axe-core` and `cypress-axe` are installed and loaded by Cypress.
- A `cypress/e2e/WebInterface/508/508Example.cy.ts` example exists, but is skipped and contains no active tests.
- Lighthouse accessibility thresholds exist, but Lighthouse scores are diagnostic indicators, not a Section 508 conformance test.
- Jenkins already runs Cypress and retains Mochawesome artifacts, but it has no dedicated accessibility job, policy, or structured violation report.

The POC should establish a repeatable, risk-based accessibility quality signal for representative authenticated MADiE workflows. It must not be presented as full Section 508 certification. Automated tools detect only part of the applicable requirements; a qualified manual assessment is required for a conformance determination.

## Compliance Boundary

The federal Revised Section 508 Standards incorporate WCAG 2.0 Level A and AA success criteria for covered web and software user interfaces. The POC should use those criteria as its compliance baseline unless the MADiE Section 508 Program Manager approves a different contractual baseline.

WCAG 2.1 or 2.2 may be added as a product-quality target, but must be reported separately. It is not a replacement for documenting conformance to the federal Section 508 baseline.

Out of scope for this POC:

- A legal certification, VPAT/ACR, or application-wide statement of conformance.
- Automated proof of keyboard usability, meaningful focus order, screen-reader announcements, quality of alternative text, or usability with assistive technology.
- Remediation of every defect discovered during the POC.
- Changes to product accessibility implementation unless separately approved.

## Proposed Target Architecture

```
Representative Cypress workflow
  -> route/page readiness assertion
  -> inject axe into the authenticated MADiE application page
  -> scan the whole page or opened component with an approved WCAG ruleset
  -> Cypress result + structured violation artifact
  -> Jenkins trend/report and triage record
  -> manual validation for requirements automation cannot determine
```

Keep accessibility scans in UI tests. API setup may create the needed measure, library, review state, or test case before login, but browser automation should validate the rendered page or interaction state. Page objects remain responsible for UI navigation only; accessibility policy, scan configuration, reporting, and exceptions belong in a small dedicated accessibility support layer.

## Work Items

| ID      | Task                                    | What will be done                                                                                                                                                                                                                                                                   | Completion evidence                                                              |
| ------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| A11Y-01 | Confirm governing standard and owners   | Obtain written confirmation of the compliance baseline, responsible Section 508 authority, severity definitions, and release policy.                                                                                                                                                | Approved one-page policy and named owners.                                       |
| A11Y-02 | Select the POC journeys                 | Select 6–8 representative, high-risk authenticated states: landing/list, search/filter, create/edit form, modal/action center, measure editor, test-case editor, library workflow, and reviewer/admin state if in release scope.                                                    | Journey inventory with screen/state, user role, risk, and manual coverage owner. |
| A11Y-03 | Establish an automated baseline         | Run axe checks in observation mode against the selected states using the approved WCAG 2.0 A/AA ruleset. Capture violations by rule, impact, selector, route, and test name.                                                                                                        | Baseline report, deduplicated issue list, and false-positive review.             |
| A11Y-04 | Build the Cypress accessibility layer   | Activate the existing `cypress-axe` capability through a typed, named shared helper. The helper injects axe after MADiE is ready, uses one approved ruleset, supports component scans, and produces readable failures.                                                              | Focused specs demonstrate page and modal scans; compile and quality checks pass. |
| A11Y-05 | Define reporting and issue governance   | Produce a CI-friendly structured report and a human-readable summary. Define defect fields, severity, product owner, remediation target, retest status, and trend.                                                                                                                  | Sample Jenkins artifacts and triage template.                                    |
| A11Y-06 | Define exception control                | Allow only reviewed, narrow, time-limited exceptions with an issue ID, owner, rationale, affected rule/component, expiry date, and removal test. Never globally disable axe rules or suppress violations without traceability.                                                      | Exception register and enforcement review.                                       |
| A11Y-07 | Perform manual accessibility validation | Apply a repeatable manual script to the same journeys: keyboard-only operation, visible focus and focus order, modal focus/escape/return, labels and error messaging, semantic structure, zoom/reflow, screen-reader names/roles/states/announcements, and meaningful alternatives. | Manual results with pass/fail/not-applicable evidence and retest outcomes.       |
| A11Y-08 | Pilot CI in observation mode            | Run the POC separately from the general regression suite. Publish findings without failing the build while the baseline is stabilized. Do not hide violations by retrying or broadly suppressing them.                                                                              | Stable reports across agreed pilot runs and a reviewed baseline.                 |
| A11Y-09 | Introduce a narrow quality gate         | After baseline triage, fail only on approved new violations in selected critical paths, initially critical and serious impacts. Preserve known, approved debt as visible tracked debt rather than silently passing it.                                                              | Gate policy, passing/failing proof, and rollback procedure.                      |
| A11Y-10 | POC decision and scale plan             | Review signal quality, run time, defect value, false-positive rate, maintenance cost, and manual-test findings. Decide whether and how to extend coverage by component and workflow.                                                                                                | Signed POC findings and prioritized rollout backlog.                             |

## Notes for Implementation

### Reuse before adding dependencies

No new scanning dependency is needed for the POC. `axe-core` 4.11.0 and `cypress-axe` 1.7.0 are already installed. The dormant 508 example should be replaced with maintainable, purposeful specs rather than enabled unchanged. `@cypress-audit/lighthouse` should remain a performance/diagnostic tool and must not be used as conformance evidence.

### Stable scan points

Run a scan only after the existing workflow has asserted that the intended page or component is rendered. Scan important interaction states separately, including an open modal, expanded action menu, validation-error state, and tab/panel that changes content. Do not scan the external Okta login experience unless it is explicitly in MADiE’s ownership and compliance scope.

### Ruleset policy

The baseline ruleset should be centrally configured as WCAG 2.0 A and AA, with `section508` only if the approved tool version supports the intended mapping. Do not combine best-practice, AAA, or later-WCAG tags into the federal compliance result; report them as separate advisory results if adopted.

### Reporting requirements

For every result, retain the route, workflow state, rule ID, impact, help text/link, affected DOM target, HTML snippet where safe, test/spec name, timestamp, and environment. Reports must make it possible to distinguish a new regression from accepted debt and must avoid exposing protected health information or credentials.

### CI behavior

The existing Jenkins pipeline reruns ordinary failed specs. Accessibility gates need a separate decision path: deterministic violations should be reported and triaged, not diluted by retries. The pilot should run as an explicit selectable job or script, retain artifacts, and avoid overwriting the current `lighthouse-report/lighthouse.html` file.

### Manual-validation minimums

Automation cannot reliably judge whether a workflow is usable with a keyboard or assistive technology. Each POC journey therefore needs documented manual evidence for:

- Keyboard navigation, activation, focus visibility/order, and no keyboard trap.
- Dialog focus trap, Escape behavior, and focus return to the initiating control.
- Accessible names, roles, states, and error/status announcements in a supported screen reader/browser pairing.
- Form instructions, labels, required status, error identification, and error recovery.
- Headings, landmarks, table semantics, meaningful link/button text, and alternatives for non-text content.
- Zoom and reflow behavior at the agency-approved viewport/zoom levels.

## Acceptance Criteria

The POC is complete when all of the following are true:

1. The responsible accessibility authority has approved the scope and baseline.
2. At least six representative MADiE states are scanned through repeatable Cypress flows.
3. Results are retained as structured CI artifacts and can be triaged by workflow and severity.
4. Each finding is either remediated, accepted through the time-limited exception process, or assigned to a product owner with a due date.
5. The same representative states have documented manual accessibility results.
6. The team has a documented recommendation for observation-only, targeted gate, or broader rollout.

## Principal Risks and Controls

| Risk                                   | Control                                                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Treating an axe pass as compliance     | Label all automated outcomes as defect detection, combine them with manual conformance evaluation, and avoid certification claims. |
| Unstable CI or excessive noise         | Start with a small representative set, baseline first, use one controlled ruleset, and triage before gating.                       |
| Hiding real defects through exclusions | Require narrow, reviewed, expiring exceptions; prohibit global rule disablement.                                                   |
| Tests scanning the wrong state         | Require route/content readiness before injection and scan each meaningful dynamic state separately.                                |
| Reporting sensitive data               | Redact or omit unsafe DOM snippets and keep reports within existing protected CI artifacts.                                        |
| Expanding beyond maintainable coverage | Prioritize shared components and high-risk workflows; add one journey or reusable component pattern at a time.                     |

## Decision Needed Before Build Work

The program must confirm whether the desired outcome is:

1. Engineering regression detection only;
2. Release-quality gating for selected workflows; or
3. Evidence supporting a formal Section 508 conformance assessment.

The POC can start with option 1, but options 2 and 3 require formal ownership, manual validation, and acceptance criteria beyond Cypress.

## Sources

- [Revised 508 Standards — U.S. Access Board](https://www.access-board.gov/ict/)
- [Overview of Testing Methods for 508 Conformance — Section508.gov](https://www.section508.gov/test/testing-overview/)
- [Section 508 testing lifecycle and methods — Section508.gov](https://www.section508.gov/test/)
- [Understanding WCAG conformance — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/conformance.html)
