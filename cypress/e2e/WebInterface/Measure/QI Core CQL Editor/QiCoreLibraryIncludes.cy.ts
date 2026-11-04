import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MonacoEditor } from '../../../../Shared/MonacoEditor'

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL

const assertLibrarySearchResults = (expectedLibraries: Array<{ name: string, version: string }>): void => {
    cy.get(CQLEditorPage.libraryResultsTable).should('be.visible')

    expectedLibraries.forEach(({ name, version }, index) => {
        cy.get(CQLEditorPage.libraryResultsTable)
            .find(`[data-test-id="row-${index}"]`)
            .should('contain.text', name)
            .and('contain.text', version)
            .and('contain.text', 'View / Apply')
    })
}

const vteLibraries = [
    { name: 'VTE', version: '8.10.000' },
    { name: 'VTE', version: '8.9.000' },
    { name: 'VTE', version: '8.8.000' },
    { name: 'VTE', version: '8.7.000' },
    { name: 'VTE', version: '8.6.000' }
]

describe('Qi-Core Library Includes fields', () => {
    beforeEach('Create Measure and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.SessionLogin()

        MeasuresPage.actionCenter('edit', 0)

        CQLEditorPage.openMonacoCqlEditor()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {
        return Utilities.deleteMeasure()
    })

    it('Search for Qi-Core Included Libraries', () => {
        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for FHIR Library
        cy.get(CQLEditorPage.librarySearchTextBox).type('qdm')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.contains('No Results were found', { timeout: 30000 }).should('be.visible')

        //Search for QDM Libraries
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        assertLibrarySearchResults(vteLibraries)
    })

    it('Apply Qi-Core Included library to the CQL and save', () => {
        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        assertLibrarySearchResults(vteLibraries)

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get(EditMeasurePage.successMessage).should(
            'contain.text',
            'Library VTE has been successfully added to the CQL.',
        )

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('Verify error messages when same Library/Alias is applied twice', () => {
        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        assertLibrarySearchResults(vteLibraries)

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get(EditMeasurePage.successMessage).should(
            'contain.text',
            'Library VTE has been successfully added to the CQL.',
        )

        //Apply same Library again
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast info"]').should('contain.text', 'Library VTE has already been defined in the CQL.')

        //Apply different Library with duplicate Alias
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('fhir')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        assertLibrarySearchResults([{ name: 'CDSConnectCommonsForFHIRv401', version: '0.1.000' }])
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast info"]').should('contain.text', 'Alias VTE has already been defined in the CQL.')
    })

    it('Verify Included Libraries under Saved Libraries tab', () => {
        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get('[data-test-id="row-0"]').find('td').eq(0).should('contain.text', 'FHIRHelpers') //Alias
        cy.get('[data-test-id="row-0"]').find('td').eq(1).should('contain.text', 'FHIRHelpers') //Name
        cy.get('[data-test-id="row-0"]').find('td').eq(2).should('contain.text', '4.1.000') //Version
        cy.get('[data-test-id="row-0"]').find('td').eq(3).should('contain.text', 'Angela Flanagan') //Owner
    })

    it('Verify all Qi Core Library versions are displayed while editing saved Libraries', () => {
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //click edit on the page
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible('#draggable-dialog-title', 60000)
        cy.get('#draggable-dialog-title').should('contain.text', 'Details')

        //Confirm Library versions
        cy.get(CQLEditorPage.versionDropdownBtn).click()
        cy.get(CQLEditorPage.versionNumberList).should(
            'contain.text',
            '4.4.0004.3.0004.2.0004.1.0004.0.0003.0.0002.0.0001.0.0000.1.000',
        )
    })

    // old defect to watch with this scenario https://jira.cms.gov/browse/MAT-9107
    it('Verify error message appears when there is an error in the Measure CQL', () => {
        const brokenCql =
            "library SimpleFhirLibrary version '0.0.004'\n" +
            "using QICore version '4.1.0'\n" +
            "include FHIRHelpers version '4.1.000' called FHIRHelpers\n" +
            "codesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n" +
            'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
            'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
            'parameter "Measurement Period" Interval<DateTime>\n' +
            'context Patient\n' +
            'define "test":\n' +
            'define "Surgical Absence of Cervix":\n' +
            '\t[Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy\n' +
            "\t\twhere NoCervixHysterectomy.status = 'completed'"

        //Navigate to Includes tab and verify no error message appears
        cy.get(CQLEditorPage.includesTab).click()
        cy.get(CQLEditorPage.errorMsg).should('not.exist')
        //Navigate to Includes tab and verify saved Libraries appear
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        MonacoEditor.replaceDocument(EditMeasurePage.monacoCqlEditor, brokenCql)
        CQLEditorPage.submitMonacoCqlForValidation()

        cy.get(CQLEditorPage.errorMsg).should('be.visible')
    })
})
