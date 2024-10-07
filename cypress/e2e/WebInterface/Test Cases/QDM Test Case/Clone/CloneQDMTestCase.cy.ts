import {MeasureCQL} from "../../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"

let testCaseDescription = 'DENOMFail' + Date.now()
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Clone QDM Test Case', () => {

    before('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 2))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Clone QDM Test Case - Success scenario', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((tcId) => {
            cy.get('[data-testid=select-action-' + tcId + ']').click()
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('be.visible')
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('be.enabled')
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').click({force: true})
        })

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

        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((tcId) => {
            cy.get('[data-testid=select-action-' + tcId + ']').click()
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('not.exist')
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').click()
        })

    })
})
