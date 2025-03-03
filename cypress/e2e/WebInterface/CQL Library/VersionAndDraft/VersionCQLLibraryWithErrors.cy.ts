import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let CqlLibraryOther = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Version CQL Library with errors', () => {

    beforeEach('Login', () => {

        //Create CQL Library
        CqlLibraryOther = 'CQLLibraryWithErrors' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithInvalidCQL(CqlLibraryOther, CQLLibraryPublisher)

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(CqlLibraryOther)

    })

    it('User can not version the CQL library if the CQL has ELM translation errors', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Verify CQL ELM translation errors
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', " ELM: 1:3 | Could not resolve identifier SDE in the current library. ELM: 5:13 | Member SDE Sex not found for type null.")

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('version')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get(CQLLibrariesPage.versionErrorMsg).should('contain.text', 'Versioning cannot be done as the Cql has errors in it')

        //Click on cancel version button
        cy.get(CQLLibrariesPage.versionCancelBtn).click()

    })

    it('User can not version the CQL library if the CQL has parsing errors', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Add parsing error to the valid CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}').focused().type('tdysfdfjch')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Verify CQL parsing errors
        cy.scrollTo('top')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('exist')
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('not.be.empty')
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('not.be.null')

        //Navigate to CQL Library tab
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('version')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get(CQLLibrariesPage.versionErrorMsg).should('contain.text', 'Versioning cannot be done as the Cql has errors in it')

        //Click on cancel version button
        cy.get(CQLLibrariesPage.versionCancelBtn).click()
    })

})
