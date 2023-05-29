import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()

let measureCQL = 'library TestLibrary1678378360032 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon \n' +
    'include FHIRCommon version \'4.1.000\' called FHIRCommon\n' +
    '\n' +
    '\n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
    '\n' +
    '\n' +
    'code "Healthcare professional (occupation)": \'223366009\' from "SNOMEDCT" display \'Healthcare professional (occupation)\'\n' +
    'code "Medical practitioner (occupation)": \'158965000\' from "SNOMEDCT" display \'Medical practitioner (occupation)\'\n' +
    'code "Ophthalmologist (occupation)": \'422234006\' from "SNOMEDCT" display \'Ophthalmologist (occupation)\'\n' +
    'code "Optometrist (occupation)": \'28229004\' from "SNOMEDCT" display \'Optometrist (occupation)\'\n' +
    'code "Physician (occupation)": \'309343006\' from "SNOMEDCT" display \'Physician (occupation)\'\n' +
    'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
    'code "Macular edema absent (situation)": \'428341000124108\' from "SNOMEDCT" display \'Macular edema absent (situation)\'\n' +
    'code "AMB" : \'AMB\' from "ActCode" display \'Ambulatory\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  SDE."SDE Ethnicity"\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  SDE."SDE Payer"\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  SDE."SDE Race"\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  SDE."SDE Sex"\n' +
    '\n' +
    '\n' +
    '\n' +
    'define "Initial Population":\n' +
    'true\n' +
    '\n' +
    'define "Num":\n' +
    'true\n' +
    '\n' +
    'define "Denom":\n' +
    'true'

describe('Validations between Supplemental Data Elements with the CQL definitions', () => {

    beforeEach('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population',
            'Num', 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    afterEach('Log out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })
    it('Removing definition related to the SD alerts user.', () => {
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Supplemental button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        //set supplemental data definition to e Denom
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('Denom').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        Utilities.waitForElementVisible(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox, 30000)
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).focus()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).invoke('click')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('Initial Population Description')

        //save the supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

        //navigate to the CQL tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //click into CQL Editor and remove Denom definition
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}')
        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //confirm error toast related to SD and/or RA
        cy.get(CQLEditorPage.measureErrorToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the PC tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the test case list page and make sure alert concerning SA appears
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')
    })

    it('Fixing SD to point to something that is, now, in CQL, resolves alert.', () => {

        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Supplemental button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        //set supplemental data definition to e Denom
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('Denom').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        Utilities.waitForElementVisible(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox, 30000)
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).focus()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).invoke('click')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('Initial Population Description')

        //save the supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

        //navigate to the CQL tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //click into CQL Editor and remove Denom definition
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}')

        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //confirm error toast related to SD and/or RA
        cy.get(CQLEditorPage.measureErrorToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the PC tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the test case list page and make sure alert concerning SA appears
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate back to the group page
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the supplemental data tab and clear it's, current, value and add another value (to the same for SA and RA)
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.removeCloseDefinitionSelection).click()
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()

        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg, { timeout: 25000 }).should('not.be.visible')

        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        //set supplemental data definition to e Denom
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('Initial Population').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        Utilities.waitForElementVisible(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox, 30000)
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).focus()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).invoke('click')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('SA Description')

        //save the supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementToNotExist(CQLEditorPage.measureErrorToast, 75)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)

    })
    it('Placing definition back into CQL and saving resolves the alert.', () => {
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Supplemental button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        //set supplemental data definition to e Denom
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('Denom').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        Utilities.waitForElementVisible(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox, 30000)
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).focus()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).invoke('click')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('Initial Population Description')

        //save the supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

        //navigate to the CQL tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //click into CQL Editor and remove Denom definition
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}{backspace}{backspace}')
        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()

        //confirm error toast related to SD and/or RA
        cy.get(CQLEditorPage.measureErrorToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the PC tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the test case list page and make sure alert concerning SA appears
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the CQL tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //click into CQL Editor and remove Denom definition
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '\n' +
            '\n' +
            'define "Denom":\n' +
            ' true')
        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementToNotExist(CQLEditorPage.measureErrorToast, 75)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
    })
})
