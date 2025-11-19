import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCaseAction, TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Header } from "../../../Shared/Header"


let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let secondMeasureName = 'SecondMeasure' + Date.now()
let secondLibraryName = 'SecondLibrary' + Date.now()
let testCaseTitle = 'test case title' + Date.now()
let testCaseSeries = 'SBTestSeries' + Date.now()
let testCaseDescription = 'DENOMFail' + Date.now()
let measureCQLQDM = MeasureCQL.SBTEST_QDM_CQL
let qiCoreMeasureCQL = MeasureCQL.CQL_Populations
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''

let testCaseJson = TestCaseJson.TestCaseJson_Valid

const measureDataQDM: CreateMeasureOptions = {}
const measureDataQDM2: CreateMeasureOptions = {}

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
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Copy QDM Test Case to another QDM Measure', () => {
        const currentUser = Cypress.env('selectedUser')
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
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((fileContents) => {
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

        //Create Qi Core Measure, PC and Test Case
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, qiCoreMeasureCQL, 1)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean', 1)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, false, false, 1)
        
        //Create 2nd Qi Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(secondMeasureName, secondLibraryName, qiCoreMeasureCQL, 2)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Copy Qi Core Test Case to another Qi Core Measure', () => {
        const currentUser = Cypress.env('selectedUser')
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
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').check()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"] > input').should('be.checked')
        })
    })

    it('Copy test cases skips test cases that would go over 250 character title limit', () => {
        
        // Target measure needs to have duplicate named tc as original, and tc title must be 226+ characters
        const longTitle = 'LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntULaboreEtDoloreMagnaAliquaUtEnimAdMinim'
        const currentUser = Cypress.env('selectedUser')
        // start - M1 with 1 regular tc, M2 with no tc
    
        // step - add tc with long name to M1 and M2
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)

        cy.get(TestCasesPage.createTestCaseGroupInput).type('PASS').type('{enter}')
        cy.get(TestCasesPage.createTestCaseTitleInput).type(longTitle + longTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('very long title tc')
        cy.get(TestCasesPage.createTestCaseSaveButton).wait(3000).click()

        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)

        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)

        cy.get(TestCasesPage.createTestCaseGroupInput).type('PASS').type('{enter}')
        cy.get(TestCasesPage.createTestCaseTitleInput).type(longTitle + longTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('very long title tc')
        cy.get(TestCasesPage.createTestCaseSaveButton).wait(3000).click()

        // step - on M1, copy both tc to M2
        Utilities.checkAll()

        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled').click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((id) => {
            Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
            cy.get('[data-testid="measure-name-' + id + '_select"]')
                .find('input')
                .focus()
                .check()
        })
        cy.get(TestCasesPage.copyToSave).scrollIntoView().click()

        // step - verify warning about tc2 not copying
        cy.get('[data-testid="warn-title"]').should('contain.text', '1 test cases were copied successfully. The following 1 test cases could not be copied because the test cases are duplicates and the title is too long to copy.')

        // step - verify tc1 did copy onto M2
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)
    })
})


