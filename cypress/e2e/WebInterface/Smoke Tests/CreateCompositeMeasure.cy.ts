import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Header } from "../../../Shared/Header"
import { CreateMeasurePage, SupportedCompositeModels } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"


let measureName = ''
let CqlLibraryName = ''
const testCase = TestCaseJson.fromCMS1017NumPass 

//Skipping until Feature flag 'QICoreCompositeMeasure' is turned on
describe('Create Composite Measure', () => {

    beforeEach('Login', () => {
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 11500)
    })

    afterEach('Cleanup and Logout', () => {

        Utilities.deleteMeasure()
    })

    it('Create QI Core Composite Measure and add Population Criteria', () => {

        measureName = 'CompositeTestMeasure' + Date.now()
        CqlLibraryName = 'CompositeTestLibrary' + Date.now()
        const currentUser = Cypress.env('selectedUser')

        CreateMeasurePage.CreateCompositeMeasure(measureName, CqlLibraryName, SupportedCompositeModels.qiCore6)
        cy.get(Header.mainMadiePageButton).click()

        //Edit Measure
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click().wait(2000)
        })

        //Verify CQL Editor tab is not visible for Composite Measures
        cy.get(EditMeasurePage.cqlEditorTab).should('not.exist')

        //Navigate to Population Criteria page
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //Scoring should be Composite by default
        cy.get('[data-testid="scoring-select"]').should('contain.text', 'Composite')
        Utilities.setMeasureGroupType()
        cy.get(CreateMeasurePage.compositeScoringSelect).click()
        cy.get('[data-testid="opportunity-option"]').click()
        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })
    it('Validate Composite Test Case Tabs', () => {

        measureName = 'CompositeTestMeasure' + Date.now()
        CqlLibraryName = 'CompositeTestLibrary' + Date.now()
        const currentUser = Cypress.env('selectedUser')

        CreateMeasurePage.CreateCompositeMeasure(measureName, CqlLibraryName, SupportedCompositeModels.qiCore6)
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
        TestCasesPage.createTestCase('title', 'series', 'desc')
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.compositeAvailableTab).should('be.visible')
        .and('have.attr', 'aria-selected', 'true')
        .and('contain.text', 'Available')
        cy.get(TestCasesPage.compositeAddedTab).should('be.visible')
        .and('contain.text', 'Added')
        cy.get(TestCasesPage.compositeJsonTab).should('be.visible')
        .and('contain.text', 'JSON')
       })

       it('Validate Composite Measure Insert Existing Test Case Button Functionality', () => {

        measureName = 'CompositeTestMeasure' + Date.now()
        CqlLibraryName = 'CompositeTestLibrary' + Date.now()
        const currentUser = Cypress.env('selectedUser')

        CreateMeasurePage.CreateCompositeMeasure(measureName, CqlLibraryName, SupportedCompositeModels.qiCore6)
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
        TestCasesPage.createTestCase('title', 'series', 'desc')
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.compositeInsertTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.compositeInsertTestCaseBtn).click()
        cy.get(TestCasesPage.compositeBackToAllProfilesBtn).should('be.visible')
        cy.get(TestCasesPage.compositeBackToAllProfilesBtn).click()

       })
})