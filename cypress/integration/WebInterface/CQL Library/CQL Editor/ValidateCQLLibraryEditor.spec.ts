import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"

let apiCQLLibraryName = ''

describe('Validate CQL on CQL Library page', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'TestLibrary' + Date.now()
        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName)
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

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

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
        cy.wait(1000)

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/cqlCQLEditor.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        //Validate error(s) in CQL Editor window
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').wait(1000).click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from the page
        cy.get(Header.mainMadiePageButton).click()
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Navigate back to the CQL Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Validate error(s) in CQL Editor windows
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').wait(1000).click({force:true, multiple: true})
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
        cy.wait(1000)

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        //Validate error(s) in CQL Editor after saving
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').wait(1000).click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', '"status":404,"error":"Not Found","path":"/api/fhir/libraries/cql"}"')

        //Navigate away from the page
        cy.get(Header.mainMadiePageButton).click()

        //Navigate back to the CQL Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Validate error(s) in CQL Editor persists after saving
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').wait(1000).click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', '"status":404,"error":"Not Found","path":"/api/fhir/libraries/cql"}"')

    })

    it('Verify no errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when included library is found', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        cy.wait(1000)

        //Update text in the CQL Library Editor that will cause error
        Utilities.typeFileContents('cypress/fixtures/EXM124v7QICore4Entry_FHIR.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        //save the value in the CQL Editor
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        //Validate the lack of error(s) in CQL Editor
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('not.exist')

        //Navigate away from the page
        cy.get(Header.mainMadiePageButton).click()

        //Navigate back to the CQL Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Validate error(s) in CQL Editor persists after saving
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('not.exist')

    })
})

describe('CQL Library: CQL Editor: valueSet', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'TestLibrary' + Date.now()
        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName)

        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

    })

    //Need to skip this test for now until we are able to manipulate the DB and remove the API Key and TGT from
    //Mongo DB with a DB connection or new API Call
    it.skip('UMLS Error: User Not Logged in', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.successfulCQLSaveNoErrors).should('contain.text', 'Cql Library successfully updated')

        cy.get(CQLLibraryPage.umlsErrorMessage).should('be.visible')
        cy.get(CQLLibraryPage.umlsErrorMessage).should('contain.text', 'Please log in to UMLS!')

    })

    it('Value Sets are valid', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        cy.get(CQLEditorPage.editorMessage).should('be.visible')
        cy.get(CQLEditorPage.editorMessage).should('contain.text', 'Parsing complete, CQL is valid')

    })

    it('Value Set Invalid', () => {
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/ValueSetTestingEntryInValid.txt', CQLLibraryPage.cqlLibraryEditorTextBox)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        cy.get(CQLLibraryPage.umlsErrorMessage).should('not.be.visible')

        //Validate error(s) in CQL Editor window
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').wait(1000).click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            'ELM: 0:101 | Request failed with status code 404 for oid = 2.16.840.1.113883.3.464.1003.110.12.105900 ' +
            'location = 18:0-18:101')
    })
})