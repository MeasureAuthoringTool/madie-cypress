import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { Header } from '../../../../Shared/Header'
import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { MonacoEditor } from '../../../../Shared/MonacoEditor'

let apiCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Validate Qi-Core CQL on CQL Library page', () => {
    beforeEach('Create CQL library', () => {
        apiCQLLibraryName = 'CqlValidationsLib' + Date.now()

        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.SessionLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
    })

    afterEach('Clean up CQL library', () => {
        return Utilities.deleteLibrary()
    })

    it('Add valid CQL on CQL Library Editor and verify no errors appear', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/CQLForTestCaseExecution.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )
        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        CQLEditorPage.validateSuccessfulCQLUpdate(true)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains(apiCQLLibraryName)
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains("version '0.0.000'")

        MonacoEditor.assertNoErrorMarker()
    })

    it('Verify errors appear on CQL Library page and in the CQL Editor object, on save and on tab / page load', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Replace the text in the CQL Library Editor with content that causes an error.
        MonacoEditor.replaceDocumentFromFile('cypress/fixtures/cqlCQLEditor.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg,
            'ELM: 1:3 | Could not resolve identifier SDE in the current library.',
            'ELM: 5:13 | Member SDE Sex not found for type null.'
        )
        MonacoEditor.assertErrorMarker()

        //Navigate away from the page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(Utilities.discardChangesContinue).click()
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Navigate back to the CQL Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg,
            'ELM: 1:3 | Could not resolve identifier SDE in the current library.',
            'ELM: 5:13 | Member SDE Sex not found for type null.'
        )
        MonacoEditor.assertErrorMarker()
    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when included library is not found', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Replace the text in the CQL Library Editor with content that causes an error.
        MonacoEditor.replaceDocumentFromFile(
            'cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, "ELM: 1:55 | Library resource HospiceQICore4 version '2.0.000' is not found.")
    })

    it('FHIRHelpers library alias is force corrected when changed by the user', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Replace the text in the CQL Library Editor with content that causes an error.
        MonacoEditor.replaceDocumentFromFile(
            'cypress/fixtures/CQLlibraryFHIRHelpersAliasWrong.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should(
            'contain.text',
            "FHIRHelpers was incorrectly aliased. MADiE has overwritten the alias with 'FHIRHelpers'."
        )
    })

    it('Verify that adding a definition without a name will throw an exact error for that issue', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.replaceDocumentFromFile('cypress/fixtures/CQLWithDefNoName.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Row: 33, Col:27: Parse: 27:28 | Definition is missing a name.')
    })

    it('Verify that adding a definition named a reserved keyword will throw an exact error for that issue', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.replaceDocumentFromFile(
            'cypress/fixtures/CQLWithDefReservedKeyword.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Definition names must not be a reserved word.')
    })

    it('Verify error message when Code System name is missing from Code declaration', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.replaceDocumentFromFile(
            'cypress/fixtures/CQLWithoutCodeSystemName.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        cy.get(CQLEditorPage.errorMsg)
            .should('be.visible')
            .and(
                'contain.text',
                "Parse: 29:36 | code statement requires a codesystem reference. Please add a 'from' clause to your statement."
            )
    })

    it('Verify error message on CQL Editor page when an include statement is missing the version', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/QiCoreCQLWithoutIncludedLibraryVersion.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg,
            'ELM: 1:49 | include MATGlobalCommonFunctions statement is missing version. Please add a version to the include.'
        )
    })

    it('Verify error message on CQL Editor page when CQL contains an access modifier like "private"', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/QiCoreLibraryPrivateAccessModifier.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, 'Access modifiers like Public and Private can not be used in MADiE.')
    })

    it('Verify error message when context is set to anything except Patient', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/CQLWithPractitionerContext.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg, "Parse: 7:20 | Measure Context must be 'Patient'.")
    })

    it('When Concept constructor is used in the Library CQL, the constructor was removed and a success message is displayed while saving CQL', () => {
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/CQLWithConceptConstructor.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        MonacoEditor.appendDocumentText(
            CQLLibraryPage.cqlLibraryEditorTextBox,
            "Concept {Code '66071002' from \"SNOMED-CT\",Code 'B18.1' from \"ICD-10-CM\"} display 'Type B viral hepatitis"
        )

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        Utilities.waitForElementVisible('#content', 60000)

        cy.get('#content').should('contain.text', 'Concept Constructs are not supported in MADiE. It has been removed.')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should(
            'not.contain',
            "Concept {Code '66071002' from \"SNOMED-CT\",Code 'B18.1' from \"ICD-10-CM\"} display 'Type B viral hepatitis"
        )
    })
})

describe('CQL Library: CQL Editor: Qi-Core valueSet', () => {
    beforeEach('Create CQL library', () => {
        apiCQLLibraryName = 'TestLibrary' + Date.now()
        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)

        OktaLogin.SessionLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
    })

    afterEach('Clean up CQL library', () => {
        return Utilities.deleteLibrary()
    })

    it('Value Sets are valid', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/ValueSetTestingEntryValid.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        CQLEditorPage.validateSuccessfulCQLUpdate(true)
    })

    it('Value Set Invalid', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/ValueSetTestingEntryInValid.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}').type('{enter}')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        MonacoEditor.assertErrors(CQLEditorPage.errorMsg,
            'ELM: 0:101 | Request failed with status code 404 for oid = 2.16.840.1.113883.3.464.1003.110.12.105900 ' +
                'location = 18:0-18:101'
        )
    })

    it('Dirty Check Modal is displayed', () => {
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        MonacoEditor.insertTextFromFile(
            'cypress/fixtures/ValueSetTestingEntryInValid.txt',
            CQLLibraryPage.cqlLibraryEditorTextBox
        )

        cy.get(Header.mainMadiePageButton).click()

        cy.get(MeasureGroupPage.qdmDirtyCheckDiscardModal).should('be.visible')
    })
})
