import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

let testCaseDescription = 'DENOMFail' + Date.now()
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title' + Date.now()
let testCaseSeries = 'SBTestSeries' + Date.now()
let measureCQLQDM = MeasureCQL.SBTEST_QDM_CQL
let measureCQL = MeasureCQL.SBTEST_CQL
let qiCoreMeasureCQL = MeasureCQL.CQL_Populations
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''
let secondMeasureName = 'SecondMeasure' + Date.now()
let secondLibraryName = 'SecondLibrary' + Date.now()
let testCaseJson = TestCaseJson.TestCaseJson_Valid

const measureDataQDM: CreateMeasureOptions = {}
const measureDataQDM2: CreateMeasureOptions = {}

//const measureDataQiCore: CreateMeasureOptions = {}
//const measureDataQiCore2: CreateMeasureOptions = {}

describe('Copy QDM Test Cases', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 2))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureDataQDM.ecqmTitle = newMeasureName
        measureDataQDM.cqlLibraryName = newCqlLibraryName
        measureDataQDM.measureScoring = measureScoring
        measureDataQDM.patientBasis = 'true'
        measureDataQDM.measureCql = measureCQLQDM
        measureDataQDM.measureNumber = 1

        //Create QDM Measure, PC and Test Case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureDataQDM)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean', 1)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, null, false, false, 1)


        //Create 2nd QDM Measure
        measureDataQDM2.ecqmTitle = secondMeasureName + randValue
        measureDataQDM2.cqlLibraryName = secondLibraryName + randValue
        measureDataQDM2.measureScoring = measureScoring
        measureDataQDM2.patientBasis = 'true'
        measureDataQDM2.measureCql = measureCQLQDM
        measureDataQDM2.measureNumber = 2

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureDataQDM2)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })
    it('Copy QDM Test Case to another QDM Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit', 1)

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

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 5))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        /*         measureDataQiCore.ecqmTitle = newMeasureName
                measureDataQiCore.cqlLibraryName = newCqlLibraryName
                measureDataQiCore.measureScoring = measureScoring
                measureDataQiCore.measureCql = measureCQL
                measureDataQiCore.measureNumber = 1 */

        //Create Qi Core Measure, PC and Test Case
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, qiCoreMeasureCQL, 1)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean', 1)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, false, false, 1)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1/*measureDataQiCore.measureNumber*/)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

        //Create 2nd Qi Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(secondMeasureName, secondLibraryName, qiCoreMeasureCQL, 2)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()


    })
    it('Copy Qi Core Test Case to another Qi Core Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit', 1)

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

