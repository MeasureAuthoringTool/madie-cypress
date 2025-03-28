import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson";

let testCaseDescription = 'DENOMFail' + Date.now()
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.SBTEST_CQL
let qiCoreMeasureCQL = MeasureCQL.CQL_Populations
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''
let secondMeasureName = 'SecondMeasure' + Date.now()
let secondLibraryName = 'SecondLibrary' + Date.now()
let testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Copy QDM Test Cases', () => {

    before('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 2))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create QDM Measure, PC and Test Case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        //Create 2nd QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(secondMeasureName, secondLibraryName, measureScoring, true, measureCQL, 2)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        Utilities.deleteMeasure(secondMeasureName, secondLibraryName, true)

    })
    it('Copy QDM Test Case to another QDM Measure', () => {

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

        //Copy Test case
        cy.get(TestCasesPage.actionCenterCopyToMeasure).click()
        cy.readFile('cypress/fixtures/measureId2').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').check()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').should('be.checked')
        })

    })
})

describe('Copy Qi Core Test Cases', () => {

    before('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 5))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create Qi Core Measure, PC and Test Case
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, qiCoreMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        //Create 2nd Qi Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(secondMeasureName, secondLibraryName, qiCoreMeasureCQL, 2)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        Utilities.deleteMeasure(secondMeasureName, secondLibraryName, true)

    })
    it('Copy Qi Core Test Case to another Qi Core Measure', () => {

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

        //Copy Test case
        cy.get(TestCasesPage.actionCenterCopyToMeasure).click()
        cy.readFile('cypress/fixtures/measureId2').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').check()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').should('be.checked')
        })

    })
})

