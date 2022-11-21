import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {Utilities} from "../../../Shared/Utilities"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Delete Test Case', () => {

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

    it('Delete Test Case - Success scenario', () => {

        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        cy.get(TestCasesPage.deleteTestCaseBtn).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)

    })

    it('Verify Non owner of the Measure unable to delete Test Case', () => {

        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Logout()

        //Login as Alt User
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        cy.get(TestCasesPage.deleteTestCaseBtn).should('not.exist')

    })
})
