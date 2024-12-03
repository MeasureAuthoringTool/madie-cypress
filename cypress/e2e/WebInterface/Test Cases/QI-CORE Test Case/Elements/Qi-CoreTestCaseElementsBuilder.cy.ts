import { CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"

const now = Date.now()
let measureName = 'TestMeasureElementsBuilder' + now
let cqlLibraryName = 'TestLibraryelementsBuilder' + now
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'ElementsBuilder1'
let testCaseSeries = 'ElementsBuilder'

// skipping until FF qiCoreElementsTab is released
describe.skip('Check for UI Elements Builder on QiCore 6.0.0 measures only', () => {

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('UI Elements Builder shows on test cases for 6.0.0 measures', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore6)

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        // these only show for STU6
        cy.get(TestCasesPage.jsonTab).should('be.visible').and('be.enabled')
        cy.get(TestCasesPage.elementsTab).should('be.visible').and('have.attr', 'aria-selected', 'true')

        // check for search bar in elements tab
        cy.get('input[type="text"]').should('have.attr', 'placeholder', 'Filter Resources')

        // check for "cards" in elements tab
        // not a great check right now - grabbing the 1st box & checking that the clickable + is there
        cy.contains('div', 'QICore AdverseEvent').children().last().should('have.attr', 'type', 'button')
    })

     it('UI Elements Builder does not show on test cases for 4.1.1 measures', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4)

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        // these should not show, since with is QiCore 4.1.1
        cy.get(TestCasesPage.jsonTab).should('not.exist')
        cy.get(TestCasesPage.elementsTab).should('not.exist')
        cy.get('.tab-container').should('have.text', '')

        // assert that blank editor field is there
        cy.get(TestCasesPage.aceEditorJsonInput).should('be.empty')
     })
})

