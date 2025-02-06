import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let apiCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Validate Qi-Core CQL on CQL Library page', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'CqlValidationsLib' + Date.now()

        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Add valid CQL on CQL Library Editor and verify no errors appear', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/CQLForTestCaseExecution.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
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

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains(apiCQLLibraryName)
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).contains('version \'0.0.000\'')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('not.exist')
    })

    it('Verify errors appear on CQL Library page and in the CQL Editor object, on save and on tab / page load', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/cqlCQLEditor.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from the page
        cy.get(Header.mainMadiePageButton).click()
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Navigate back to the CQL Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Validate error(s) in CQL Editor windows
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")
    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when included library is not found', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor after saving
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')

        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:55 | Library resource HospiceQICore4 version \'2.0.000\' is not found.")
    })

    it('FHIRHelpers library alias is force corrected when changed by the user', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/CQLlibraryFHIRHelpersAliasWrong.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'FHIRHelpers was incorrectly aliased. MADiE has overwritten the alias with \'FHIRHelpers\'.')
    })

    it('Verify that adding a definition without a name will throw an exact error for that issue', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/CQLWithDefNoName.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
        
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "Parse: 7:8 | Definition is missing a name.")
    })

    it('Verify that adding a definition named a reserved keyword will throw an exact error for that issue', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/CQLWithDefReservedKeyword.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
        
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', " Parse: 7:15 | Definition names must not be a reserved word.")
    })

    it('Verify error message when Code System name is missing from Code declaration', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/CQLWithoutCodeSystemName.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            'Parse: 29:36 | code statement requires a codesystem reference. Please add a \'from\' clause to your statement.')
    })

    it('Verify error message on CQL Editor page when an include statement is missing the version', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/QiCoreCQLWithoutIncludedLibraryVersion.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:49 | include MATGlobalCommonFunctions statement is missing version. Please add a version to the include.")
    })

    it('Verify error message on CQL Editor page when CQL contains an access modifer like "private"', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/QiCoreLibraryPrivateAccessModifier.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('contain.text', "Access modifiers like Public and Private can not be used in MADiE.")
    })

})

describe('CQL Library: CQL Editor: Qi-Core valueSet', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'TestLibrary' + Date.now()
        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
    })

    it('Value Sets are valid', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
    })

    it('Value Set Invalid', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryInValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            'ELM: 0:101 | Request failed with status code 404 for oid = 2.16.840.1.113883.3.464.1003.110.12.105900 ' +
            'location = 18:0-18:101')
    })

    it('Dirty Check Modal is displayed', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryInValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(Header.mainMadiePageButton).click()

        cy.get(CQLLibrariesPage.cqlLibraryDirtyCheck).should('be.visible')
    })
})
