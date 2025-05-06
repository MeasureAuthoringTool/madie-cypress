import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.zipfileExportQICore

describe('Validations between Risk Adjustments with the CQL definitions', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '',
            'num', '', 'ipp', 'boolean')

        OktaLogin.Login()
    })

    afterEach('Log out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Removing definition related to the RA alerts user.', () => {
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

    it('Fixing RA to point to something that is, now, in CQL, resolves alert.', () => {

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

        //navigate back to the group page
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the Risk Adjustment tab and clear it's, current, value and add another value (to the same for SA and RA)
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.removeCloseDefinitionSelection).eq(0).click()
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        cy.get(EditMeasurePage.successMessage, { timeout: 25000 }).should('not.be.visible')

        //select a definition and enter a description for Initial Population
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('RA Description')

        //save the Risk Adjustment
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementToNotExist(EditMeasurePage.errorMessage, 75)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)

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
            '\n' +
            '\n' +
            'define "denom":\n' +
            ' true')
        //save updated CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementToNotExist(EditMeasurePage.errorMessage, 75)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementToNotExist(MeasureGroupPage.pcErrorAlertToast, 75)
    })

    // user is able to create, add, and save RAs on a group
    it('QI Core: User able to create, add, and save RA and RA description', () => {
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
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('num').click()

        //save the Risk Adjustment data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click().click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //navigate back to main measures page
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //confirm the values in the RA fields
        cy.get(MeasureGroupPage.riskAdjDropDown).should('contain.text', 'Definitiondenom+1')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('contain.text', 'Initial Population Description')

        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.cancelIcon).first().click()
        cy.get(MeasureGroupPage.saveRiskAdjustments).click().click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //navigate back to main measures page
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')
        //navigate to the PC page / tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //confirm the values in the RA fields
        cy.get(MeasureGroupPage.riskAdjDropDown).should('contain.text', 'Definitionnum')

    })
})
