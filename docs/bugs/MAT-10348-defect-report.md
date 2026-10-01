# MAT-10348 Defect Report: Edit Measure Action Center Accessible Names

## Summary

The Edit Measure Action Center does not consistently implement the accessible names required by MAT-10348. Several actions render an outer MUI SpeedDial/menu-item button and a nested focusable MUI IconButton with different `aria-label` values. Keyboard focus lands on the nested button, while the outer control remains exposed with a conflicting name.

This creates inconsistent screen-reader output, invalidates the required accessible-name contract, and prevents reliable verification of the specified forward and reverse keyboard focus sequence.

## Expected

For the edit-measure Action Center, the focusable button must expose the ticket-defined accessible name:

- Review: `Review Measure`
- View History: `View History`
- View Human Readable: `View Human Readable`
- Version: `Version Measure`
- Draft: `Draft Measure`
- Transfer: `Transfer Measure`
- Share/Unshare: `Share or Unshare Measure`
- Export: `Export Measure`
- Delete: `Delete Measure`

For a versioned measure where the owner has edit access, the Action Center must include the Delete action.

## Actual

| Action | Required name | Outer SpeedDial/menu-item name | Focused inner IconButton name |
| --- | --- | --- | --- |
| Review | `Review Measure` | `Review` | Not consistent with ticket contract |
| View Human Readable | `View Human Readable` | `View human readable` | `View Human Readable` |
| Share/Unshare | `Share or Unshare Measure` | `Share/Unshare` | `Share Measure` |

The full DEV run also could not find `[data-testid="DeleteMeasure"]` for the versioned owner-measure scenario.

## DOM Evidence

The View Human Readable action renders both of these controls:

```html
<button class="MuiFab-root MuiSpeedDialAction-fab" tabindex="-1" type="button" role="menuitem" aria-label="View human readable" data-testid="Viewhumanreadable">
  <button class="MuiIconButton-root" tabindex="0" type="button" aria-label="View Human Readable">
```

The outer menu-item and nested focusable button describe one visible action but expose different accessible names. The same pattern appears for Share/Unshare.

## Keyboard and Automation Impact

- Focus moves to the nested IconButton, not the outer SpeedDial/menu-item control.
- The outer and inner controls report different accessible names for one action.
- Screen-reader users can receive inconsistent names depending on the DOM control encountered.
- Cypress correctly observes the focused inner button, which fails the ticket contract at Share/Unshare (`Share Measure` rather than `Share or Unshare Measure`).
- The forward/reverse focus-order assertions cannot complete under the required name contract because the Share action name is incorrect.

## Automated Evidence

DEV full run: `EditMeasureActionCenterAccessibility.cy.ts`

- 11 passed
- 9 failed

Failures attributable to this defect:

- Review expected `Review Measure`; actual outer label `Review`.
- View Human Readable expected `View Human Readable`; actual outer label `View human readable`.
- Share/Unshare expected `Share or Unshare Measure`; actual outer label `Share/Unshare` and focused inner label `Share Measure`.
- Versioned owner-measure scenario did not render Delete Measure.
- Focus-order checks stop at Share because the focused button has `aria-label="Share Measure"`.

The collapsed action-center tab-order checks and the History, Version/Draft, Transfer, Export, and draft Delete contracts passed.

## Suggested Remediation

Use one focusable control per Action Center action. That control should carry the final ticket-defined `aria-label`; do not expose a nested focusable button with a competing accessible name. Confirm that the versioned owner-with-edit-access state renders Delete Measure as required.
