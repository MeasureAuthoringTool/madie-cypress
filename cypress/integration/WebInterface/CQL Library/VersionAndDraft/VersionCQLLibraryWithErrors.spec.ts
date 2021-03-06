import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {Header} from "../../../../Shared/Header"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"

let CqlLibraryOther = ''

describe('Version CQL Library with errors', () => {

    beforeEach('Login', () => {

        //Create CQL Library
        CqlLibraryOther = 'CQLLibraryWithErrors' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithInvalidCQL(CqlLibraryOther)

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('User can not version the CQL library if the CQL has ELM translation errors', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Verify CQL ELM translation errors
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.ELM: 5:13 | Member SDE Sex not found for type null.")

        CQLLibrariesPage.clickVersionforCreatedLibrary()
        cy.get(CQLLibrariesPage.versionErrorMsg).should('contain.text', 'Versioning cannot be done as the Cql has errors in it')

        //Click on cancel version button
        cy.get(CQLLibrariesPage.versionCancelBtn).click()
    })

    it('User can not version the CQL library if the CQL has parsing errors', () => {

        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Add valid CQL
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR.txt').should('exist').then((fileContents) => {
            cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type(fileContents)
        })
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{home}')

        //Add parsing error to the valid CQL
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('tdysfdfjch')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.successfulCQLSaveNoErrors).should('contain.text', 'Cql Library successfully updated')

        //Verify CQL parsing errors
        cy.scrollTo('top')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('exist')
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('not.be.empty')
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('not.be.null')

        CQLLibrariesPage.clickVersionforCreatedLibrary()
        cy.get(CQLLibrariesPage.versionErrorMsg).should('contain.text', 'Versioning cannot be done as the Cql has errors in it')

        //Click on cancel version button
        cy.get(CQLLibrariesPage.versionCancelBtn).click()
    })

})
