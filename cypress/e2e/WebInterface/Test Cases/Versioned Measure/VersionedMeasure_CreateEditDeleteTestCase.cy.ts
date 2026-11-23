import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { Header } from '../../../../Shared/Header'
import { TestData } from '../../../../Shared/TestData'

let measureName = 'ProportionEpisode' + Date.now()
let CqlLibraryName = 'ProportionEpisode' + Date.now()
let versionNumber = '1.0.000'
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.ProportionEpisode_PASS.replace(
    '"system": "http://snomed.info/sct", "code": "183452005"',
    '"system": "http://www.ama-assn.org/go/cpt", "code": "99211"'
)
let measureCQL =
    "library ProportionEpisodeMeasure version '0.0.000'\n\n" +
    "using QICore version '4.1.1'\n\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n\n" +
    'codesystem "CPT": \'http://www.ama-assn.org/go/cpt\'\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'code "Minimal Office Visit": \'99211\' from "CPT"\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '  [Encounter: "Minimal Office Visit"]\n\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n\n' +
    'define "Numerator":\n' +
    '  "Denominator"'

const createNewTestCaseAfterVersioning = (executeTestCases = false): string => {
    const newTestCaseTitle = 'NewTestAfterVersioning'
    const newTestCaseDescription = 'NewTestAfterVersioning' + Date.now()
    const newTestCaseSeries = 'NewTestAfterVersioning'

    MeasuresPage.actionCenter('edit')
    TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
    TestCasesPage.createTestCase(
        newTestCaseTitle,
        newTestCaseDescription,
        newTestCaseSeries,
        testCaseJson,
        false,
        true
    )

    TestCasesPage.clickEditforCreatedTestCase()
    TestCasesPage.openExpectedActualTab()
    cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
    TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseIPPExpected, '1')
    TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseDENOMExpected, '1')
    TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseNUMERExpected, '1')

    TestCasesPage.openDetailsTab(TestCasesPage.editTestCaseSaveButton)
    TestCasesPage.saveTestCaseAndWait()
    cy.get(TestCasesPage.successMsg).should(
        'contain.text',
        'Test case updated successfully with warnings in JSON'
    )

    TestCasesPage.openTestCasesTabAndWaitForList()
    if (executeTestCases) {
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(newTestCaseTitle, 'Pass')
    }

    return newTestCaseTitle
}

describe('Test Cases: Versioned Measure: Create, Edit, Delete Test Case', () => {
    beforeEach('Create Measure, Test Case and Login', () => {
        measureName = 'ProportionEpisode' + Date.now()
        CqlLibraryName = 'ProportionEpisode' + Date.now()
        testCaseTitle = 'PASS'
        testCaseDescription = 'PASS' + Date.now()
        testCaseSeries = 'SBTestSeries'

        CreateMeasurePage.CreateQICoreMeasureAPI(
            measureName,
            CqlLibraryName,
            measureCQL,
            0,
            false,
            '2023-01-01',
            '2023-12-31'
        )

        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Numerator',
            '',
            'Denominator',
            'Encounter'
        )

        TestData.saveCurrentMeasureCql().then(TestData.expectSavedMeasureCql)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.SessionLogin()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(Header.mainMadiePageButton).click()

        //version measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber)
            .clear()
            .type('1.0.000')
            .should('have.value', '1.0.000')
            .blur()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.enabled').click()

        MeasuresPage.validateVersionNumber(versionNumber)
        return cy.log('Version Created Successfully')
    })

    afterEach('Clean up', () => {
        return Utilities.deleteMeasure()
    })

    it('Versioned Measure: Create and execute a new Test Case', () => {
        createNewTestCaseAfterVersioning(true)
    })

    it('Versioned Measure: Delete is enabled for a new Test Case', () => {
        const newTestCaseTitle = createNewTestCaseAfterVersioning()
        TestCasesPage.checkTestCaseByTitle(newTestCaseTitle)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled')
    })

    it('Draft retains versioned Measure CQL, group, Test Cases, and execution', () => {
        const newTestCaseTitle = createNewTestCaseAfterVersioning()
        const filePath = TestData.measureIdPath()

        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox)
            .clear()
            .type('DraftedMeasure0001' + Date.now())
        cy.readFile(filePath)
            .should('exist')
            .then((fileContents) => {
                cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
            })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then(({ response }) => {
            expect(response?.statusCode).to.eq(201)
            expect(response?.body.id, 'draft measure id').to.be.a('string').and.not.be.empty
            return cy.writeFile(filePath, response?.body.id)
        })
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
        TestData.readMeasure<{ cql: string; measureName: string }>().then(({ body, status }) => {
            expect(status).to.eq(200)
            expect(body.measureName).to.contain('DraftedMeasure0001')
            expect(body.cql).to.contain('define "Initial Population"')
        })
        TestData.requestMeasureTestCase('GET', undefined, {}, 'selectedUser', null).then(({ body, status }) => {
            expect(status).to.eq(200)
            expect(body).to.have.length(2)
        })
        TestData.requestMeasureGroup('GET').then(({ body, status }) => {
            expect(status).to.eq(200)
            expect(body).to.have.length(1)
        })

        cy.get(Header.mainMadiePageButton).scrollIntoView().click()
        MeasuresPage.actionCenter('edit')
        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(newTestCaseTitle, 'Pass')
    })

    it('Versioned Measure: Edit Test Case, delete is disabled', () => {
        let currentUser = Cypress.expose('selectedUser')
        let filePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        TestCasesPage.openDetailsTab(TestCasesPage.editTestCaseSaveButton)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get('[data-testid="test-case-alerts"]').should(
            'have.text',
            'Test case updated successfully! Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.Test case updated successfully! Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'
        )
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify user can't delete edited test case after versioning
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('be.disabled')

        //Draft should keep all changes made to test cases after versioning

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox)
            .clear()
            .type('DraftedMeasure0001' + Date.now())
        //intercept draft id once measure is drafted
        cy.readFile(filePath)
            .should('exist')
            .then((fileContents) => {
                cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
            })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request?.response?.body.id)
        })
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).scrollIntoView().click()
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
