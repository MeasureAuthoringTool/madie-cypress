import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {QdmCql} from "../../../../../Shared/QDMMeasuresCQL"
import {CQLEditorPage} from "../../../../../Shared/CQLEditorPage"
import {CQLLibraryPage} from "../../../../../Shared/CQLLibraryPage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"

    /*
        This test scenario does not require creation of a measure.
        We can simply navigate to an existing measure we know will generate this report.
    */
const originalMeasure = {
    CMSid: '334',
    title: 'Cesarean Birth'
}
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = QdmCql.QDMSimpleCQL
const testCaseTitle = 'DENEXStrat1Fail 2RUnilateralMxProc'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'

// skipped until flag "OverlappingValueSets" = true
describe.skip('Generate the Overlapping Value Set report for a QDM measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('View CMS 334 and generate the Overlapping Value Set report', () => {

        // switch to all measure tab, search for original measure, view
        cy.intercept('PUT', '/api/measures/searches?currentUser=false&limit=10&page=0').as('searchDone')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 26500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(originalMeasure.CMSid).type('{enter}')
        cy.wait('@searchDone')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', originalMeasure.title)

        // need to select correct version of the measure with .eq(1)  -- might be needed?
        cy.get('[data-testid="row-item"]').eq(2).contains('View').click()

        // got to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // click reports button, select overlapping value sets
        Utilities.waitForElementEnabled(TestCasesPage.reportsButton, 12500)
        cy.get(TestCasesPage.reportsButton).click()
        cy.get(TestCasesPage.overlappingCodesButton).click()

        // confirm we are on the report pop-up
        cy.contains('h2', 'Overlapping Codes').should('be.visible')

        // confirm pagination shows correct page count & total
        cy.get('[data-testid="overlapping-codes-report-contents"]').find('#offset-of-total-items').then(overlapCount => {
            const pageValues = overlapCount.text().toString().split(' ')
            expect(pageValues[0]).to.eq('1')
            expect(pageValues[2]).to.eq('5')
            expect(pageValues[4]).to.eq('27')
        })
        
        // expand 1st row
        cy.get('[data-testid="KeyboardArrowRightIcon"]').first().click()

        // uses the same official HL7 regex for oid we use elsewhere https://jira.cms.gov/browse/MAT-8131
        const oidRegex = /[0-2](\.(0|[1-9][0-9]*))+/

        // confirm that our overlaps are reported by valuesets with oid
        cy.get('[data-testid="0.0_description"]').within(expansionRow => {

            cy.wrap(expansionRow).find('p').eq(1).text().should('match', oidRegex)
            cy.wrap(expansionRow).find('p').last().text().should('match', oidRegex)
        })
    })

    it('Export Excel version of Overlapping Value Sets report', () => {

        // switch to all measure tab, search for original measure, view
        cy.intercept('PUT', '/api/measures/searches?currentUser=false&limit=10&page=0').as('searchDone')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 26500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(originalMeasure.CMSid).type('{enter}')
        cy.wait('@searchDone')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', originalMeasure.title)

        // need to select correct version of the measure with .eq(1)  -- might be needed?
        cy.get('[data-testid="row-item"]').eq(2).contains('View').click()

        // got to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // click reports button, select overlapping valuesets
        Utilities.waitForElementEnabled(TestCasesPage.reportsButton, 60000)
        cy.get(TestCasesPage.reportsButton).click()
        cy.get(TestCasesPage.overlappingCodesButton).click()

        // confirm we are on the report pop-up
        cy.contains('h2', 'Overlapping Codes').should('be.visible')

        //Verify Excel Export
        const file = 'cypress/downloads/CMS334-v7.1.000-QDM5-OverlappingCodes.xlsx'
        cy.get(TestCasesPage.overlappingCodesExportBtn).should('be.visible')
        cy.get(TestCasesPage.overlappingCodesExportBtn).click()
        cy.get(TestCasesPage.exportSuccessMsg).should('contain.text', 'Overlapping Codes report exported successfully')
        cy.readFile(file, { timeout: 15000 }).should('exist')
        cy.log('Successfully verified Excel Export')

        cy.task('readXlsx', { file: file, sheet: 'Overlapping Codes' }).then(rows => {
            expect(rows[0]['Code']).to.equal('4525004')
            expect(rows[0]['Code System']).to.equal('2.16.840.1.113883.6.96')
            expect(rows[0]['Description']).to.equal('Emergency department patient visit (procedure)')
            expect(rows[0]['Version']).to.equal('2024-09')
            expect(rows[0]['Value Set']).to.equal('EmergencyDepartmentVisit')
            expect(rows[0]['Value Set OID/URL']).to.equal('2.16.840.1.113883.3.117.1.7.1.292')
        })

        })
})

// skipped until flag "OverlappingValueSets" = true
describe.skip('Overlapping Value Set report validations', () => {

    beforeEach('Create Measure, Test Case and login', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23', 'boolean')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Reports button disabled when there are errors in Measure CQL', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases Tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get('.madie-alert').should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')
        Utilities.waitForElementVisible(TestCasesPage.reportsButton, 12500)
        cy.get(TestCasesPage.reportsButton).should('be.disabled')

    })

    it('Export button disabled when there are no overlapping value sets', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Navigate to Test Cases Tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(TestCasesPage.reportsButton, 12500)
        cy.get(TestCasesPage.reportsButton).click()
        cy.get(TestCasesPage.overlappingCodesButton).click()
        cy.get('[class="OverlappingCodesDialog___StyledTd-sc-cyxsx0-0 iDUEmy"]').should('contain.text', 'There are no overlapping codes')
        cy.get(TestCasesPage.overlappingCodesExportBtn).should('be.disabled')
    })
})

