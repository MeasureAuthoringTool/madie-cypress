import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {Utilities} from "../../../../Shared/Utilities"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

//Skipping until feature flag is removed
describe.skip('QDM Library Includes fields', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for QDM Included Libraries', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for FHIR Library
        cy.get(CQLEditorPage.librarySearchTextBox).type('fhir')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('[class="Results___StyledTd-sc-wvb0lh-0 jvRQdT"]').should('contain.text', 'No Results were found')

        //Search for QDM Libraries
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('sdoh')
        cy.get(CQLEditorPage.librarySearchBtn).click().wait(1000)
        cy.get(CQLEditorPage.librarySearchTable).should('contain','nameversionownerActionSDOH3.0.000ltj7708SDOH2.0.000ltj7708SDOH1.0.000ltj7708')
    })
})