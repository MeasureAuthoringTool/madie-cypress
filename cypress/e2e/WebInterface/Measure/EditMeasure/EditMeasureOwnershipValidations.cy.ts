import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureCQL = MeasureCQL.ICFCleanTest_CQL
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()

let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'

describe('Read only for measure, measure group, and test cases that user does not own', () => {

    beforeEach('Create Measure, Measure Group, and Test Case with alt userLogin', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL, null, true)
        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, true, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')

        TestCasesPage.CreateTestCaseAPI(TCTitle, TCSeries, TCDescription, '', false, false, true)
        OktaLogin.Login()
    })

    afterEach('Logout and clean up', () => {

        OktaLogin.UILogout()

        Utilities.deleteMeasure(measureName, cqlLibraryName, false, true)
    })

    it('Measure fields on detail page are not editable', () => {

        //page loads
        cy.location('pathname', { timeout: 60000 }).should('include', '/measures')
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 30000)
        Utilities.waitForElementEnabled(LandingPage.myMeasuresTab, 30000)

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //edit the measure that was not created by logged-in user
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()

        cy.get(EditMeasurePage.readOnlyMPStartDt).should('have.attr', 'readonly', 'readonly')
        cy.get(EditMeasurePage.readOnlyMPEndDt).should('have.attr', 'readonly', 'readonly')

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        cy.get(EditMeasurePage.readOnlySteward).should('have.attr', 'readonly', 'readonly')
        cy.get(EditMeasurePage.readOnlyDevelopers).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.leftPanelDescription).should('be.visible')
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.leftPanelCopyright).should('be.visible')
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.leftPanelDisclaimer).should('be.visible')
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.leftPanelRationale).should('be.visible')
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.leftPanelGuidance).should('be.visible')
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).should('have.attr', 'readonly', 'readonly')


        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).should('be.visible')
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get(EditMeasurePage.createDefinitionBtn).should('be.disabled')
    })

    it('CQL value on the measure CQL Editor tab cannot be changed', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //edit the measure that was not created by current owner
        MeasuresPage.actionCenter('edit')

        //confirm that the CQL Editor tab is available and click on it
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('Test for ownership')

        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).eq(null)
    })

    it('Test Cases are read / view only', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //edit the measure that was not created by logged in owner
        MeasuresPage.actionCenter('edit')

        //confirm that the test case tab is available and click on it
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {

            //confirm that view button for test case is available and click on the view button
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']').should('have.text', 'View')
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']').should('be.visible')
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']').click()
        })

        //confirm that the text boxes, for the test case fields are not visible
        cy.get(TestCasesPage.detailsTab).click()
        //<textarea rows="1" readonly="" id="test-case-title" placeholder="Test Case Title" name="title" style="color: rgb(51, 51, 51); font-family: Rubik; font-size: 14px; font-style: normal; font-weight: 400; line-height: 24px; border: none; resize: none; padding: 0px; outline: none; box-shadow: none; height: 24px; overflow: hidden;">test case title</textarea>
        cy.get('[id="test-case-title"]').should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('have.attr', 'readonly', 'readonly')
    })

    it('Fields on Measure Group page are not editable', () => {

        //page loads
        cy.location('pathname', { timeout: 60000 }).should('include', '/measures')
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 30000)
        Utilities.waitForElementEnabled(LandingPage.myMeasuresTab, 30000)

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //edit the measure group that was not created by logged in owner
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Verify that the Add Population Criteria button is not shown
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('not.exist')

        //Group Type, Population Basis fields are read only
        cy.get('[id="measure-group-type"]').should('have.attr', 'readonly', 'readonly')
        cy.get('[id="populationBasis"]').should('have.attr', 'readonly', 'readonly')
        cy.get('[id="scoring-select"]').should('have.attr', 'readonly', 'readonly')
        //<textarea rows="1" readonly="" id="scoring-unit-text-input" placeholder="UCUM Code or Name" style="color: rgb(51, 51, 51); font-family: Rubik; font-size: 14px; font-style: normal; font-weight: 400; line-height: 24px; border: none; resize: none; padding: 0px; outline: none; box-shadow: none; height: 24px; overflow: hidden;">ml</textarea>
        cy.get('[id="scoring-unit-text-input"]').should('have.attr', 'readonly', 'readonly')

        //Population fields are read only
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Surgical Absence of Cervix').should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Surgical Absence of Cervix').should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Surgical Absence of Cervix').should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('not.exist')
        cy.get(MeasureGroupPage.deleteGroupbtn).should('not.exist')

        //Stratification fields are read only
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.stratAssociationOne).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.stratDescOne).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.stratTwo).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.stratAssociationTwo).should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.stratDescTwo).should('have.attr', 'readonly', 'readonly')

        //Reporting fields are read only
        cy.get(MeasureGroupPage.reportingTab).click()
        //<textarea rows="1" readonly="" id="rateAggregation" name="rateAggregation" placeholder="-" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="color: rgb(51, 51, 51); font-family: Rubik; font-size: 14px; font-style: normal; font-weight: 400; line-height: 24px; border: none; resize: none; padding: 0px; outline: none; box-shadow: none; height: 24px; overflow: hidden;">-</textarea>
        cy.get('[id="rateAggregation"]').should('have.attr', 'readonly', 'readonly')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('have.attr', 'readonly', 'readonly')
    })
})
