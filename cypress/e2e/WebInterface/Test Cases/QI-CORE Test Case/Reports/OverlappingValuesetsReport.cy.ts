import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

    /*
        This test scenario does not require creation of a measure.
        We can simply navigate to an existing measure we know will generate this report.

        CMSid: '334FHIR',
        title: 'Cesarean Birth'
        version: '0.6.000'

        CMSid: '1264FHIR',
        title: 'Emergency Care Access and Timeliness (REHQR)FHIR'
        version: '0.6.000'
    */

describe('Generate the Overlapping Valueset report for a QDM measure', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('View CMS 334FHIR and generate the Overlapping Valueset report', () => {

        cy.visit('/measures/68560f925e2d542578bdbf92/edit/details/')

        // got to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // click reports button, select overlapping valuesets
        Utilities.waitForElementEnabled(TestCasesPage.reportsButton, 60000)
        cy.get(TestCasesPage.reportsButton).click()
        cy.get(TestCasesPage.overlappingCodesButton).click()

        // confirm we are on the report pop-up
        cy.contains('h2', 'Overlapping Codes').should('be.visible')

        // confirm pagination shows correct page count & total
        cy.get('[data-testid="overlapping-codes-report-contents"]').find('#offset-of-total-items').then(overlapCount => {
            const pageValues = overlapCount.text().toString().split(' ')
            expect(pageValues[0]).to.eq('1')
            expect(pageValues[2]).to.eq('5')
            expect(pageValues[4]).to.eq('26')
        })
        
        // expand 1st row
        cy.get('[data-testid="KeyboardArrowRightIcon"]').first().click()

        //  hardcoded to VSAC URLS, but uses the same official HL7 regex 
        // for oid we use elsewhere https://jira.cms.gov/browse/MAT-8131
        const oidRegex = /http:\/\/cts.nlm.nih.gov\/fhir\/ValueSet\/[0-2](\.(0|[1-9][0-9]*))+/

        // confirm that our overlaps are reported by valuesets with oid
        cy.get('[data-testid="0.0_description"]').within(expansionRow => {

            cy.wrap(expansionRow).find('p').eq(1).text().should('match', oidRegex)
            cy.wrap(expansionRow).find('p').last().text().should('match', oidRegex)
        })
    })

    it('Export Excel version of Overlapping Valuesets report for 334FHIR', () => {

        cy.visit('/measures/68560f925e2d542578bdbf92/edit/details/')

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
        const file = 'cypress/downloads/CMS0334FHIR-v0.6.000-FHIR6-OverlappingCodes.xlsx'
        cy.get(TestCasesPage.overlappingCodesExportBtn).should('be.visible')
        cy.get(TestCasesPage.overlappingCodesExportBtn).click()
        cy.get(TestCasesPage.exportSuccessMsg).should('contain.text', 'Overlapping Codes report exported successfully')
        cy.readFile(file, { timeout: 15000 }).should('exist')
        cy.log('Successfully verified Excel Export')

        cy.task('readXlsx', { file: file, sheet: 'Overlapping Codes' }).then(rows => {
            expect(rows[0]['Code']).to.equal('10D00Z0')
            expect(rows[0]['Code System']).to.equal('http://www.cms.gov/Medicare/Coding/ICD10')
            expect(rows[0]['Description']).to.equal('Extraction of Products of Conception, High, Open Approach')
            expect(rows[0]['Version']).to.equal('2026')
            expect(rows[0]['Value Set']).to.equal('CesareanBirth')
            expect(rows[0]['Value Set OID/URL']).to.equal('http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.282')
        })
    })

    it('View CMS 1264FHIR and generate an empty Overlapping Valueset report', () => {

        cy.visit('/measures/68755bf525b3c1414c4f2851/edit/details/')
 
         // got to test case tab
         cy.get(EditMeasurePage.testCasesTab).should('be.visible')
         cy.get(EditMeasurePage.testCasesTab).click()
 
         // click reports button, select overlapping valuesets
         Utilities.waitForElementEnabled(TestCasesPage.reportsButton, 60000)
         cy.get(TestCasesPage.reportsButton).click()
         cy.get(TestCasesPage.overlappingCodesButton).click()
 
         // confirm we are on the report pop-up
         cy.contains('h2', 'Overlapping Codes').should('be.visible')
 
         // confirm empty message
         cy.get('[data-testid="overlapping-codes-tbl"]').should('contain.text', 'There are no overlapping codes')
    })
})
