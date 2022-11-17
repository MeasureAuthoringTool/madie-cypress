import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {Utilities} from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Execute Test Case', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Execute Test Case button is disabled when Measure has no Group', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationList).should('contain.text',
            'No data for current scoring. Please make sure at least one measure group has been created.')

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('not.be.enabled')
    })

    it('Verify Test execution status when the Expected and Actual values do not match', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Select the Expected Value
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })

    it('Verify Test execution status when the Expected and Actual values match', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXExpected).click()
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })

})