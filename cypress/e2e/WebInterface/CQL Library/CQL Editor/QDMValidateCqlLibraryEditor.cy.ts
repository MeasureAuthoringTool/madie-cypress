import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { Header } from '../../../../Shared/Header'
import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MonacoEditor } from '../../../../Shared/MonacoEditor'

let apiCQLLibraryName = ''
const cqlLibraryPublisher = 'SemanticBits'

const enterLibraryDetails = (): void => {
    cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible').type('Some random data')
    cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible').type('Able Health')
    cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')
}

const openCreatedQdmLibrary = (): void => {
    cy.get(Header.cqlLibraryTab).click()
    CQLLibrariesPage.clickEditforCreatedLibrary()
}

const replaceCqlWithFixture = (fixture: string): void => {
    MonacoEditor.replaceDocumentFromFile(fixture, CQLLibraryPage.cqlLibraryEditorTextBox)
}

describe('Validate QDM CQL on CQL Library page', () => {
    beforeEach('Create CQL library', () => {
        apiCQLLibraryName = `QdmValidationsLib${Date.now()}`
        CQLLibraryPage.createLibraryAPI(apiCQLLibraryName, SupportedModels.QDM, { publisher: cqlLibraryPublisher })
        OktaLogin.SessionLogin()
    })

    afterEach('Clean up CQL library', () => {
        return Utilities.deleteLibrary()
    })

    it('Add valid CQL on CQL Library Editor and verify no errors appear', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMMeasureCQL.txt')
        enterLibraryDetails()

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        CQLEditorPage.validateSuccessfulCQLUpdate(true)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains(apiCQLLibraryName)
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains("version '0.0.000'")
        MonacoEditor.assertNoErrorMarker()
    })

    it('Verify that on save, errors appear on CQL Library page and in the CQL Editor object', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMMeasureInvalidCQL.txt')
        enterLibraryDetails()

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Could not resolve identifier truetest in the current library.')
        MonacoEditor.assertErrorMarker()
    })

    it('Verify that adding a definition without a name will throw an exact error for that issue', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMNoNameDefCQL.txt')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Definition is missing a name.')
    })

    it('Verify that adding a definition named a reserved keyword will throw an exact error for that issue', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMKeywordDefCQL.txt')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Definition names must not be a reserved word.')
    })

    it('Verify error message on CQL Library page when the CQL has a retrieve without filter', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMCQLRetrieve_WithoutFilter.txt')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Retrieves must contain a code or value set filter')
    })

    it('Verify error message on CQL Editor page when an include statement is missing the version', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMCQLWithoutIncludedLibraryVersion.txt')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'include MATGlobalCommonFunctions statement is missing version. Please add a version to the include.')
    })

    it('Verify error message when context is set to anything except Patient', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMPractitionerContext.txt')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, "Measure Context must be 'Patient'.")
    })
})

describe('CQL Library: CQL Editor: QDM valueSet', () => {
    beforeEach('Create CQL library', () => {
        apiCQLLibraryName = `QDMValueSetLib${Date.now()}`
        CQLLibraryPage.createLibraryAPI(apiCQLLibraryName, SupportedModels.QDM, { publisher: cqlLibraryPublisher })
        OktaLogin.SessionLogin()
    })

    afterEach('Clean up CQL library', () => {
        return Utilities.deleteLibrary()
    })

    it('Value Sets are valid', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMMeasureCQL.txt')
        enterLibraryDetails()

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        CQLEditorPage.validateSuccessfulCQLUpdate(true)
    })

    it('Value Set Invalid', () => {
        openCreatedQdmLibrary()
        replaceCqlWithFixture('cypress/fixtures/QDMInvalidValuesetCQL.txt')
        enterLibraryDetails()

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible').click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Request failed with status code 404 for oid = 2.16.840.1.113762.1.4.136')
    })
})
