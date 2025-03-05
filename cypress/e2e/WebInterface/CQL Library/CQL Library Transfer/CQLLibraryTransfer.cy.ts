import { Environment } from "../../../../Shared/Environment"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let updatedCQLLibraryName = CQLLibraryName + randValue + 'SomeUpdate' + 9
let randomCQLLibraryName = 'TransferTestCQLLibrary' + randValue + 5
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let versionNumber = '1.0.000'

describe('CQL Library Transfer', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })


    it('Verify transferred CQL Library is viewable under My Libraries tab', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
    })

    it('Verify CQL Library can be edited by the transferred user', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()

        //Edit CQL Library details
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.log('CQL Library Updated Successfully')

    })
})

describe('CQL Library Transfer - Multiple instances', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 5

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })

    it('Verify all instances in the Library set (Version and Draft) are Transferred to the new owner', () => {

        //Version the CQL Library
        CQLLibrariesPage.cqlLibraryActionCenter("version")

        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('exist')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('be.enabled')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()

        cy.get(CQLLibrariesPage.createVersionContinueButton).should('exist')
        cy.get(CQLLibrariesPage.createVersionContinueButton).should('be.visible')
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CQLLibraryName, versionNumber)
        cy.log('Version Created Successfully')

        //Draft the Versioned CQL Library
        CQLLibrariesPage.clickDraftforCreatedLibrary()
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(randomCQLLibraryName)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')


        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
        cy.get('[data-testid="table-body"]').should('contain', randomCQLLibraryName)
    })
})

