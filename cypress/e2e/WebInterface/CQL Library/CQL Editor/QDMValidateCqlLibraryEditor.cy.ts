import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"

let apiCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Validate QDM CQL on CQL Library page', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'QdmValidationsLib' + Date.now()

        CQLLibraryPage.createQDMCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
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

        Utilities.typeFileContents('cypress/fixtures/QDMMeasureCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
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

    it('Verify that on save, errors appear on CQL Library page and in the CQL Editor object', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/QDMMeasureInvalidCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:12 | Could not resolve identifier truetest in the current library.")
    })

    it('Verify that adding a definition without a name will throw an exact error for that issue', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/QDMNoNameDefCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
        
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
        Utilities.typeFileContents('cypress/fixtures/QDMKeywordDefCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
        
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "Parse: 7:11 | Definition names must not be a reserved word.")
    })
})

describe('CQL Library: CQL Editor: QDM valueSet', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'QDMValueSetLib' + Date.now()
        CQLLibraryPage.createQDMCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)

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

        // need qdm version
        Utilities.typeFileContents('cypress/fixtures/QDMMeasureCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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
        Utilities.typeFileContents('cypress/fixtures/QDMInvalidValuesetCQL.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

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
            'ELM: 0:69 | Request failed with status code 404 for oid = 2.16.840.1.113762.1.4.136 location = 5:0-5:69')
    })
})
