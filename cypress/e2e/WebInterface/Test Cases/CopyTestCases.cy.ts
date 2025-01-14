import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {Utilities} from "../../../Shared/Utilities"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasureCQL} from "../../../Shared/MeasureCQL"

let testCaseDescription = 'DENOMFail' + Date.now()
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''

//Skipping until Feature flag 'CopyTestCases' is removed
describe.skip('Copy Test Cases', () => {

    before('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 2))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create QDM Measure, PC and Test Case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Copy Test Case to another Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Assert text before selecting Check box
        cy.get('[data-testid="copy-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Select test cases to copy to another measure')

        //Assert text after selecting Check box
        cy.get(TestCasesPage.testCaseListCheckBox).click()
        cy.get('[data-testid="copy-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Copy to another measure')

    })
})
