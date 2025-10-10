import { CQLLibraryPage, EditLibraryActions } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Header } from "../../../Shared/Header"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"

let currentUser = Cypress.env('selectedUser')
let CQLLibraryName = ''
const CQLLibraryPublisher = 'SemanticBits'
const harpUserALT = Environment.credentials().harpUserALT
const measureCQLAlt = MeasureCQL.ICFCleanTestQICore
const adminApiKey = Environment.credentials().adminApiKey
const versionNumber = '1.0.000'
const filePath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'

describe('Delete CQL Library Validations - Library List page', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
       CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click().wait(1500)
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        //Transfer Library to the ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('delete')

        //verify deleting Library removes it from library list
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLEditorPage.deleteContinueButton).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox, 50000)
        cy.get(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox).should('contain.text', 'The Draft CQL Library has been deleted.')
        cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((fileContents) => {
            Utilities.waitForElementToNotExist('[data-testid="edit-cql-library-button-' + fileContents + '"]', 50000)
        })
    })

    it('Delete CQL Library - Draft Library - user has had the Library shared with them', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click().wait(1500)
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        //Version Library
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Login as Regular User
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        //Version Library
        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Transfer Library to ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user has had the Library shared with them', () => {
        //Version Library
        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click().wait(1500)
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })
})

describe('Delete CQL Library Validations - Edit Library page', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        //Create CQL Library with Regular User
        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    afterEach('Clear cache', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {

        //Login as ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        CQLLibrariesPage.clickViewforCreatedLibrary()

        Utilities.waitForElementVisible(CQLLibraryPage.readOnlyCqlLibraryName, 11500)

        cy.contains('You are not the owner of the CQL Library. Only owner can edit it.').should('be.visible')
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        //Transfer Library to the ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        CQLLibraryPage.actionCenter(EditLibraryActions.delete)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })

    it('Delete CQL Library - Draft Library - user has had the Library shared with them', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        Utilities.waitForElementToNotExist(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        //Version Library
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Login as Regular User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        //Version Library
        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Transfer Library to ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        //Login as ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })

    it('Delete CQL Library - Versioned Library - user has had the Library shared with them', () => {
        //Version Library
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('not.exist')
    })
})
