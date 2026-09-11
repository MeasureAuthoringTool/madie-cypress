import { CQLLibraryPage, EditLibraryActions } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { TestData } from "../../../Shared/TestData"

let CQLLibraryName = ''
let harpUserALT = ''
const CQLLibraryPublisher = 'SemanticBits'
const measureCQLAlt = MeasureCQL.ICFCleanTestQICore
const versionNumber = '1.0.000'

const transferLibraryToAltUser = (): void => {
    TestData.transferCurrentCqlLibrary(harpUserALT).then((response) => {
        expect(response.status).to.eql(200)
    })
}

const openCreatedLibraryFromAllLibraries = (): void => {
    CQLLibrariesPage.openLibrariesList()
    cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible').click()
    CQLLibrariesPage.searchForLibraryByName(CQLLibraryName)
}

const openCreatedLibraryFromSharedLibraries = (): void => {
    CQLLibrariesPage.openLibrariesList()
    cy.get(CQLLibraryPage.sharedLibrariesTab).should('be.visible').click()
    CQLLibrariesPage.searchForLibraryByName(CQLLibraryName)
}

const selectCreatedLibraryFromAllLibraries = (): void => {
    openCreatedLibraryFromAllLibraries()
    CQLLibrariesPage.selectLibraryRow()
}

const openCreatedLibraryDetailsFromAllLibraries = (): void => {
    openCreatedLibraryFromAllLibraries()
    CQLLibrariesPage.openLibraryDetailsFromCurrentList()
}

const openCreatedLibraryDetailsFromSharedLibraries = (): void => {
    openCreatedLibraryFromSharedLibraries()
    CQLLibrariesPage.openLibraryDetailsFromCurrentList()
}

describe('Delete CQL Library Validations - Library List page', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'DeleteLibValidations' + Date.now()

        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        //Create CQL Library with Regular User
        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {

        //Login as ALT User
        OktaLogin.SessionAltLogin()
        selectCreatedLibraryFromAllLibraries()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {

        //Transfer Library to the ALT User
        OktaLogin.setupUserSession(false)
        transferLibraryToAltUser()
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        selectCreatedLibraryFromAllLibraries()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.visible').and('be.enabled').click()

        //verify deleting Library removes it from library list
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLEditorPage.deleteContinueButton).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryGreenToast, 50000)
        cy.get(CQLLibraryPage.cqlLibraryGreenToast).should('contain.text', 'The Draft CQL Library has been deleted.')
        CQLLibrariesPage.assertLibrarySearchRowAbsent(0)
    })

    it('Delete CQL Library - Draft Library - user has had the Library shared with them', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        selectCreatedLibraryFromAllLibraries()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        //Version Library

        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Login as Regular User
        OktaLogin.SessionLogin()
        selectCreatedLibraryFromAllLibraries()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        //Version Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Transfer Library to ALT User
        transferLibraryToAltUser()
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        selectCreatedLibraryFromAllLibraries()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user has had the Library shared with them', () => {
        //Version Library

        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        selectCreatedLibraryFromAllLibraries()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })
})

describe('Delete CQL Library Validations - Edit Library page', () => {

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CQLLibraryName = 'DeleteLibValidations' + Date.now()

        //Create CQL Library with Regular User
        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {

        OktaLogin.SessionAltLogin()
        openCreatedLibraryFromAllLibraries()
        CQLLibrariesPage.openLibraryAsNonOwner()
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {

        //Transfer Library to the ALT User
        OktaLogin.setupUserSession(false)
        transferLibraryToAltUser()

        //Login as ALT User
        OktaLogin.SessionAltLogin()
        openCreatedLibraryDetailsFromAllLibraries()

        CQLLibraryPage.actionCenter(EditLibraryActions.delete)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })

    it('Delete CQL Library - Draft Library - user has had the Library shared with them', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        openCreatedLibraryDetailsFromSharedLibraries()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        Utilities.waitForElementToNotExist(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        //Version Library

        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Login as Regular User

        OktaLogin.SessionLogin()
        openCreatedLibraryDetailsFromAllLibraries()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        //Version Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Transfer Library to ALT User
        transferLibraryToAltUser()
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        openCreatedLibraryDetailsFromAllLibraries()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })

    it('Delete CQL Library - Versioned Library - user has had the Library shared with them', () => {
        //Version Library
        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.SessionAltLogin()
        openCreatedLibraryDetailsFromSharedLibraries()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })
})
