import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const measureName = 'RAValidations' + Date.now()
const CqlLibraryName = 'RAValidationsLib' + Date.now()
const measureCQL = MeasureCQL.zipfileExportQICore

describe('Validations between Risk Adjustments with the CQL definitions', () => {

    beforeEach('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '',
            'num', '', 'ipp', 'boolean')

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 14500)
    })

    afterEach('Log out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Removing definition related to the RA alerts user.', () => {

        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //save the Risk Adjustment data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

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
        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the PC tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the test case list page and make sure alert concerning SA appears
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('[data-testid="test-case-list-error"]').should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

    })

    it('Placing definition back into CQL and saving resolves the alert.', () => {
      
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //save the Risk Adjustment
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

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
        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the PC tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.pcErrorAlertToast).should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the test case list page and make sure alert concerning SA appears
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('[data-testid="test-case-list-error"]').should('contain.text', 'Supplemental Data Elements or Risk Adjustment Variables in the Population Criteria section are invalid. Please check and update these values. Test cases will not execute until this issue is resolved.')

        //navigate to the CQL tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //click into CQL Editor and remove Denom definition
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '\n\n' +
            'define "denom":\n' +
            ' true')
        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('exist')
        Utilities.waitForElementDisabled(CQLEditorPage.saveCQLButton, 18500)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 7500)
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 7500)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementToNotExist(EditMeasurePage.errorMessage, 7500)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 7500)
    })

    it('QI Core: User able to create, add, and save RA and RA description', () => {

        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('num').click()

        //save the Risk Adjustment data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')
        Utilities.waitForElementDisabled(MeasureGroupPage.saveRiskAdjustments, 16500)

        //navigate back to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //confirm the values in the RA fields
        cy.get(MeasureGroupPage.riskAdjDropDown).should('contain.text', 'Definitiondenom+1')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('contain.text', 'Initial Population Description')

        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.cancelIcon).eq(1).click()
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')
        Utilities.waitForElementDisabled(MeasureGroupPage.saveRiskAdjustments, 16500)

        //navigate back to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //confirm the values in the RA fields
        cy.get(MeasureGroupPage.riskAdjDropDown).should('contain.text', 'Definitionnum')
    })
})
