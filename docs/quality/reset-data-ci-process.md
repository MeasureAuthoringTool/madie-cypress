# Reset Data CI Process

## Reset Data - Create Baseline

Use this job only when the TEST environment is in a known-good, approved state.

It creates a saved snapshot of the resettable TEST data and configuration. This snapshot becomes the approved restore point for future test runs.

This job should be run manually or through a controlled process. It should not run after normal Cypress test execution, because tests may leave behind temporary or changed data.

Before creating a baseline:

- Confirm no Cypress or other jobs are actively changing TEST data.
- Confirm the data is in the intended clean state.
- Record the baseline identifier, creation time, and environment.
- Verify the baseline was successfully created.

## Reset Data - Apply Baseline

Use this job to restore TEST data to the approved baseline.

It should run before regression or smoke testing that depends on shared data being in a known state, or after a deployment or test run that may have changed shared TEST data.

Before applying a baseline:

- Ensure no Cypress jobs or other processes are writing to TEST.
- Apply the latest approved baseline.
- Verify the restore completed successfully.
- Verify important expected records and configuration exist before starting Cypress.

## Recommended Flow

```text
Confirm TEST is clean and correct
        ↓
Run: Reset Data - Create Baseline
        ↓
Approved baseline is saved
        ↓
Before a shared-data Cypress run:
Run: Reset Data - Apply Baseline
        ↓
Validate restored data
        ↓
Run QA-Cypress-MADiE
```

## Important

Do not create a new baseline after a failed test run or while tests are running. That could save polluted test data and make future resets unreliable.
