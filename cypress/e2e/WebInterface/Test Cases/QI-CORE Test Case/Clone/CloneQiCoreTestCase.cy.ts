import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"
import {TestCaseJson} from "../../../../../Shared/TestCaseJson";

let testCaseDescription = 'DENOMFail' + Date.now()
let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQL = 'library CohortEpisodeEncounter1699460161402 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '   Global."Inpatient Encounter"'

describe('Clone Qi Core Test Case', () => {

    before('Create measure and login', () => {

        //Create Qi Core Measure, PC and Test Case
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Clone Qi Core Test Case - Success scenario', () => {

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

describe('Clone Invalid Qi Core Test Case', () => {

    before('Create measure and login', () => {

        //Create Qi Core Measure, PC and Test Case
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()

    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Clone button not visible when the Test case is Invalid/does not have Json', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and delete Json
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((tcId) => {
            cy.get('[data-testid=select-action-' + tcId + ']').click()
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('not.exist')
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').click()
        })
    })
})
