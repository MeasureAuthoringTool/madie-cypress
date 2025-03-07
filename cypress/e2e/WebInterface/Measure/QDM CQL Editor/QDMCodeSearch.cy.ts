import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"

const date = Date.now()
let measureName = 'QDMCodeSearch' + date
let CqlLibraryName = 'QDMCodeSearchLib' + date
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
let measureCQL_withCode = 'library QDMLibrary1724174199255 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n\n' +
    'codesystem "CPT": \'urn:oid:2.16.840.1.113883.6.12\'\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
    'code "Unlisted preventive medicine service": \'99429\' from "CPT" display \'Unlisted preventive medicine service\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\n' +
    'define "ipp":\n' +
    '\ttrue\n\n' +
    'define "d":\n' +
    '\ttrue\n\n' +
    'define "n":\n' +
    '\ttrue'

describe('QDM Code Search fields', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLEditorPage.expandCQLBuilder).click()

    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for the Codes', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Code system version and Code search fields should be disabled before selecting the code system
        cy.get(CQLEditorPage.codeSystemVersionDropdown).should('not.be.enabled')
        cy.get(CQLEditorPage.codeText).should('not.be.enabled')

        //Assert when the Code is Active in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="http://snomed.info/sct/731000124108/version/20240301-option"]').click()
        cy.get(CQLEditorPage.codeText).type('258219007')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version258219007Stage 2 (qualifier value)SNOMEDCT20240301')

        //Assert when the Code is not available in VSAC
        cy.get(CQLEditorPage.codeText).clear().type('123')
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        cy.get('[data-testid="codes-results-tbl"]').find('[class="sc-hmdomO xIUoS"]').should('contain.text', 'No Results were found')
        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Search button disabled when the Code system does not have a version
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActReason')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActReason').click()
        cy.get(CQLEditorPage.codeText).type('16298561000119108')
        cy.get(CQLEditorPage.codeSystemSearchBtn).should('be.disabled')

        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is inactive in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="http://snomed.info/sct/731000124108/version/20240301-option"]').click()
        cy.get(CQLEditorPage.codeText).type('16298561000119108')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is inactive in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version16298561000119108Administration of tetanus, diphtheria, and acellular pertussis vaccine (procedure)SNOMEDCT20240301')
        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is unavailable (not able to determine active/inactive)
        cy.get(CQLEditorPage.codeSystemDropdown).type('CPT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('CPT').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2024-option"]').click()
        cy.get(CQLEditorPage.codeText).type('99201')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'Code status unavailable')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', '99201Office or other outpatient visit for the evaluation and management of a new patient, which requires these 3 key components: A problem focused history; A problem focused examination; Straightforward medical decision making. Counseling and/or coordination of care with other physicians, other qualified health care professionals, or agencies are provided consistent with the nature of the problem(s) and the patient\'s and/or family\'s needs. Usually, the presenting problem(s) are self limited or minor. Typically, 10 minutes are spent face-to-face with the patient and/or family.CPT2024')
    })

    it('Apply code to the CQL and verify under Saved Codes tab', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        //<li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters Mui-selected MuiMenuItem-root MuiMenuItem-gutters Mui-selected css-1km1ehz" tabindex="0" role="option" data-testid="2023-02-01-option" aria-selected="true" data-value="2023-02-01"><span aria-label="2023-02-01" class="">2023-02</span><span class="MuiTouchRipple-root css-w0pj6f"></span></li>
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')

        //Apply code to the Measure
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the code
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Assert toast message while trying to apply the same code again
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click()
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get('.toast').should('contain.text', 'Code AMB has already been defined in CQL.')

        //Save and Discard changes button should be disabled
        cy.get(CQLEditorPage.saveCQLButton).should('be.disabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.disabled')

        //Navigate to Saved Codes tab
        cy.get(CQLEditorPage.savedCodesTab).click()
        cy.get('[class="CodesSection___StyledDiv-sc-1rldvun-0 HuXlU"]').should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0Items per page 5.Items per page5​1 - 1 of 11')
    })

    it('Edit Code with Suffix and Version from Results Grid', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')

        //Edit code
        cy.get(CQLEditorPage.editCodeBtn).click()

        //Code Details Pop up screen
        cy.get('[data-testid="code-info"]').should('contain.text', 'CodeAMB')
        cy.get('[data-testid="code-description-info"]').should('contain.text', 'Code Descriptionambulatory')
        cy.get('[data-testid="code-system-info"]').should('contain.text', 'Code SystemActCode')
        cy.get('[data-testid="code-system-version-info"]').should('contain.text', 'Code System Version2023-02')

        //Update Code System with Suffix and Version
        cy.get('[data-testid="code-suffix-field-input"]').type('1234')
        cy.get('[id="include-code-system-version-checkbox"]').check()
        cy.get('[data-testid="apply-button"]').click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')
    })

    it('Edit Code with Suffix and Version from Saved Codes Grid', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')

        //Apply code to the Measure
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Navigate to Saved Codes page
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click().wait(1000)
        cy.get(CQLEditorPage.savedCodesTab).should('be.visible')
        cy.get(CQLEditorPage.savedCodesTab).should('be.enabled')
        cy.get(CQLEditorPage.savedCodesTab).click()

        //Edit code
        Utilities.waitForElementVisible('[data-testid="edit-code-0"]', 60000)
        cy.get('[data-testid="edit-code-0"]').click()

        //Code Details Pop up screen
        cy.get('[data-testid="code-info"]').should('contain.text', 'CodeAMB')
        cy.get('[data-testid="code-description-info"]').should('contain.text', 'Code Descriptionambulatory')
        cy.get('[data-testid="code-system-info"]').should('contain.text', 'Code SystemActCode')
        cy.get('[data-testid="code-system-version-info"]').should('contain.text', 'Code System Version9.0.0')

        //Update Code System with Suffix and Version
        cy.get('[data-testid="code-suffix-field-input"]').type('1234')
        cy.get('[id="include-code-system-version-checkbox"]').check()
        cy.get('[data-testid="apply-button"]').click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been updated successfully.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')
    })

    it('Remove Code from Saved Codes Grid', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')

        //Apply code to the Measure
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Navigate to Saved Codes page
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click().wait(1000)
        cy.get(CQLEditorPage.savedCodesTab).click()

        //Remove Code
        Utilities.waitForElementVisible('[data-testid="delete-code-0"]', 60000)
        cy.get('[data-testid="delete-code-0"]').click()
        cy.get(CQLEditorPage.removeCodeConfirmationMsg).should('contain.text', 'Are you sure you want to delete AMB ambulatory?')
        cy.get(CQLEditorPage.removeCodeContinueBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Code AMB and code system ActCode has been successfully removed from the CQL')
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click()
        cy.get(CQLEditorPage.savedCodesTab).click()
        cy.get('[data-testid="saved-codes-tbl"]').find('.sc-jEACwC').should('contain.text', 'No Results were found')
    })

    it('Code system not removed from CQL when there are multiple codes associated with Code system and one of them removed', () => {

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Search for the Code
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeSystemVersionDropdown).click()
        cy.get('[data-testid="2023-02-01-option"]').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode2023-02')

        //Apply code to the Measure
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code AMB has been successfully added to the CQL.')

        //Add another code with the same Code system
        cy.get(CQLEditorPage.codeText).clear().type('ACUTE')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionACUTEinpatient acuteActCode2023-02')

        //Apply code to the Measure
        cy.get(CQLEditorPage.applyCodeBtn).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Code ACUTE has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Navigate to Saved Codes page
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click().wait(1000)
        cy.get(CQLEditorPage.savedCodesTab).click()

        //Remove Code
        Utilities.waitForElementVisible('[data-testid="delete-code-0"]', 80000)
        cy.get('[data-testid="delete-code-0"]').click()
        cy.get(CQLEditorPage.removeCodeConfirmationMsg).should('contain.text', 'Are you sure you want to delete AMB ambulatory?')
        cy.get(CQLEditorPage.removeCodeContinueBtn).click()

        //Verify the Code System is still available in the CQL Editor
        cy.get('[class="ace_content"]').should('contain.text', 'codesystem "ActCode": \'urn:oid:2.16.840.1.113883.5.4\'')
    })
})

describe('Error Message on Codes tab', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL_withCode)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL builder
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify error message appears on Codes tab when there is an error in the Measure CQL', () => {

        //Navigate to Codes tab and verify no error message appears
        cy.get(CQLEditorPage.codesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Codes tab and verify saved codes appear
        cy.get(CQLEditorPage.savedCodesTab).should('contain.text', 'Saved Codes(1)')

        //Add errors to CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}define "test":')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Navigate to Codes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.codesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Codes tab
        cy.get(CQLEditorPage.savedCodesTab).should('contain.text', 'Saved Codes(0)').click()
        cy.get('[data-testid="saved-codes-tbl"]').find('.sc-jEACwC').should('contain.text', 'No Results were found')
    })
})
