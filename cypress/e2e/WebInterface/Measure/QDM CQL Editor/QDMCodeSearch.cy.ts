import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

//Skipping until QDMCodeSearch feature flag is removed
describe.skip('QDM Code Search fields', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2024-01-01')

        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for the Codes', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Navigate to Code sub tab
        cy.get(CQLEditorPage.codeSubTab).click()

        //Code system version and Code search fields should be disabled before selecting the code system
        cy.get(CQLEditorPage.codeSystemVersionDropdown).should('not.be.enabled')
        cy.get(CQLEditorPage.codeText).should('not.be.enabled')

        //Assert when the Code is Active in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeText).type('258219007')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version258219007Stage 2 (qualifier value)SNOMEDCThttp://snomed.info/sct/731000124108/version/20240301Select')
        //Assert when the Code is not available in VSAC
        cy.get(CQLEditorPage.codeText).clear().type('123')
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        cy.get('.sc-feUZmu').should('contain.text', 'No Results were found')

        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is inactive in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeText).type('16298561000119108')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is inactive in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version16298561000119108Administration of tetanus, diphtheria, and acellular pertussis vaccine (procedure)SNOMEDCThttp://snomed.info/sct/731000124108/version/20240301Select')
        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is unavailable (not able to determine active/inactive)
        cy.get(CQLEditorPage.codeSystemDropdown).type('CPT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('CPT').click()
        cy.get(CQLEditorPage.codeText).type('99201')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'Code status unavailable')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version99201Office or other outpatient visit for the evaluation and management of a new patient, which requires these 3 key components: A problem focused history; A problem focused examination; Straightforward medical decision making. Counseling and/or coordination of care with other physicians, other qualified health care professionals, or agencies are provided consistent with the nature of the problem(s) and the patient\'s and/or family\'s needs. Usually, the presenting problem(s) are self limited or minor. Typically, 10 minutes are spent face-to-face with the patient and/or family.CPT2024Select')
    })

    it('Apply code to the CQL and verify under Saved Codes tab', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Navigate to Code sub tab
        cy.get(CQLEditorPage.codeSubTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0Select')

        //Apply code to the Measure
        cy.get('[data-testid="select-action-0_apply"]').click()
        cy.get('[class="btn-container"]').contains('Apply').click()
        cy.get('[class="toast success"]').should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the code
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Need to revisit once MAT-7180 is fixed
        //cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        //Assert toast message while trying to apply the same code again
        cy.get(CQLEditorPage.codeSubTab).click()
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0Select')
        cy.get('[data-testid="select-action-0_apply"]').click()
        cy.get('[class="btn-container"]').contains('Apply').click()
        cy.get('[class="toast success"]').should('contain.text', 'This code is already defined in the CQL.')

        //Save and Discard changes button should be disabled
        cy.get(CQLEditorPage.saveCQLButton).should('be.disabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.disabled')

        //Navigate to Saved Codes tab
        cy.get('[data-testid="savedCodes-tab"]').click()
        cy.get('[data-testid="terminology-section-sub-header-content-Saved Codes"]').should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0')
    })

    it('Edit Code from Results Grid', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Navigate to Code sub tab
        cy.get(CQLEditorPage.codeSubTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0Select')

        //Edit code
        cy.get('[data-testid="select-action-0_apply"]').click()
        cy.get('[class="btn-container"]').contains('Edit').click()

        //Code Details Pop up screen
        cy.get('[data-testid="code-info"]').should('contain.text', 'CodeAMB')
        cy.get('[data-testid="code-description-info"]').should('contain.text', 'Code Descriptionambulatory')
        cy.get('[data-testid="code-system-info"]').should('contain.text', 'Code SystemActCode')
        cy.get('[data-testid="code-system-version-info"]').should('contain.text', 'Code System Version9.0.0')
    })

    it('Edit Code from Saved Codes Grid', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Navigate to Code sub tab
        cy.get(CQLEditorPage.codeSubTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0Select')

        //Apply code to the Measure
        cy.get('[data-testid="select-action-0_apply"]').click()
        cy.get('[class="btn-container"]').contains('Apply').click()
        cy.get('[class="toast success"]').should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Navigate to Saved Codes page
        cy.get('[data-testid="savedCodes-tab"]').click()

        //Edit code
        cy.get('[data-testid="select-action-0_apply"]').click()
        cy.get('[class="btn-container"]').contains('Edit').click()

        //Code Details Pop up screen
        cy.get('[data-testid="code-info"]').should('contain.text', 'CodeAMB')
        cy.get('[data-testid="code-description-info"]').should('contain.text', 'Code Descriptionambulatory')
        cy.get('[data-testid="code-system-info"]').should('contain.text', 'Code SystemActCode')
        cy.get('[data-testid="code-system-version-info"]').should('contain.text', 'Code System Version9.0.0')
    })
})
