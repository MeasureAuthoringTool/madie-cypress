import {MeasureCQL} from "../../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"

const now = Date.now()
let testCaseDescription = 'DENOMFail test case'
let measureName = 'QDMTestMeasure' + now
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'

describe('Clone QDM Test Case', () => {

    before('Create measure and login', () => {

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Clone QDM Test Case - Success scenario', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterClone).click()

        cy.get('[class="toast success"]').should('contain.text', 'Test case cloned successfully')
    })

    it('Non Measure owner unable to clone Test case', () => {

        //Login as ALT User
        OktaLogin.AltLogin()

        //click on Edit button to edit measure
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.actionCenterClone).should('not.exist')
    })
})
