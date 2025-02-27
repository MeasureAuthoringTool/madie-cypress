import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Header } from "../../../Shared/Header"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"
import { OktaLogin } from "../../../Shared/OktaLogin"

let filePath = 'cypress/fixtures/cqlLibraryId'
let CQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore

describe('Delete CQL Library: Tests covering Libraries that are in draft and versioned states as well as when user is the owner, when user has had Library transferred to them, and when the user is neither the owner nor has had the Library transferred to them', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPIOptionalCQL(CQLLibraryName, CQLLibraryPublisher, measureCQLAlt)

        //Create New Measure
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryAction("edit")
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibSaveSuccessMessage, 27700)
        cy.get(CQLLibraryPage.cqlLibSaveSuccessMessage).should('be.visible')
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {
        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })

    })

    it('Delete test Case - Draft Library - user is the owner of the Library', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryAction("delete")

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        //verify cancel and Library remains
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
        })
        CQLLibrariesPage.cqlLibraryAction("delete")

        //verify deleting Library removes it from library list
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox, 50000)
        cy.get(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox).should('contain.text', 'The Draft CQL Library has been deleted.')
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementToNotExist('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
        })
    })

    // ToDo: title seems wrong. It says delete test case but tries to delete the whole library?
    it.skip('Delete test Case - Draft Library - user has had the Library transferred to them', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()
        CQLLibrariesPage.cqlLibraryAction("delete")

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        //verify cancel and Library remains
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
        })
        CQLLibrariesPage.cqlLibraryAction("delete")

        //verify deleting Library removes it from library list
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox, 50000)
        cy.get(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox).should('contain.text', 'The Draft CQL Library has been deleted.')
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementToNotExist('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
        })
    })

    it('Delete CQL Library - Versioned Library - user does not own nor has Library been shared with user', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })

    })
    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })
    })

    it('Delete test Case - Versioned Library - user has had the Library transferred to them', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled')
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })
    })
})

//Skiing until Feature flags 'LibraryListButtons' and 'LibraryListCheckboxes' are removed
describe.skip('Action Center Buttons - Delete CQL Library', () => {

    beforeEach('Set Access Token and Create CQL Library', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()
        cy.setAccessTokenCookie()

        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher, false, false, measureCQLAlt)

    })

    it('Delete CQL Library using Action Centre buttons', () => {

        OktaLogin.Login()

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('delete')

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox, 50000)
        cy.get(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox).should('contain.text', 'The Draft CQL Library has been deleted.')

        //verify deleting Library removes it from library list
        cy.get('.measure-table').should('not.contain', CQLLibraryName)

    })

    it('Non Measure owner unable to Delete CQL Library using Action Center buttons', () => {

        OktaLogin.AltLogin()

        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        //Verify that the Delete button is disabled for Non Measure owner
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.disabled')

        Utilities.deleteLibrary(CQLLibraryName)

    })

    it('Unable to Delete Versioned CQL Library using Action Centre buttons', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //Version CQL Library
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        //Verify that the Delete button is disabled for Versioned Measures
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.disabled')

        //Draft button should be enabled for Versioned Measures
        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.enabled')
    })
})