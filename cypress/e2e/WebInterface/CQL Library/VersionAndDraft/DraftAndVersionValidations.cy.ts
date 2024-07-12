import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"

let CqlLibraryOne = ''
let CqlLibraryOther = ''
let updatedCqlLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Draft and Version Validations', () => {

    before('Create CQL Library', () => {
        //create a single use CQL Library
        CqlLibraryOther = 'Another' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithInvalidCQL(CqlLibraryOther, CQLLibraryPublisher)
    })

    beforeEach('Craete CQL Library and Login', () => {
        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('User cannot create a draft of a draft that already exists, while the version is still open', () => {

        let versionNumber = '1.0.000'
        updatedCqlLibraryName = 'UpdatedCQLLibraryOne' + Date.now()

        CQLLibrariesPage.clickVersionforCreatedLibrary()

        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CqlLibraryOne, versionNumber)
        cy.log('Version Created Successfully')

        CQLLibrariesPage.clickDraftforCreatedLibrary()
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(updatedCqlLibraryName)
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')

        CQLLibrariesPage.clickDraftforCreatedLibrary()
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(updatedCqlLibraryName + '1')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'Cannot draft resource CQL Library. A draft already exists for the CQL Library Group.')
    })

    it('Verify the CQL Library updates are restricted after Version is created', () => {

        let versionNumber = '1.0.000'
        updatedCqlLibraryName = 'UpdatedCQLLibraryOne' + Date.now()

        CQLLibrariesPage.clickVersionforCreatedLibrary()
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CqlLibraryOne, versionNumber)
        cy.log('Version Created Successfully')

        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibrariesPage.editCQLLibraryAlertMessage).should('contain.text', 'CQL Library is not a draft. Only drafts can be edited.')
    })

    it('Draft cannot be saved with a name that exists for a different library', () => {

        let versionNumber = '1.0.000'

        CQLLibrariesPage.clickVersionforCreatedLibrary()
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CqlLibraryOne, versionNumber)
        cy.log('Version Created Successfully')

        CQLLibrariesPage.clickDraftforCreatedLibrary()
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(CqlLibraryOther)
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'Requested Cql Library cannot be drafted. Library name must be unique.')
        cy.log('Draft was not created due to the attempt to use the name of an already existing Library')
    })

    it('User can not version CQL Library if there is no CQL', () => {

        cy.wait(3000)
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully')

        CQLLibrariesPage.clickVersionforCreatedLibrary()
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()
        cy.get('#create-version-helper').should('contain.text', 'Versioning cannot be done as there is no associated Cql with this library')

        //Click on cancel version button
        cy.get(CQLLibrariesPage.versionCancelBtn).click()
    })

})
