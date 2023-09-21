import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Header } from "../../../Shared/Header"
import { Utilities } from "../../../Shared/Utilities"
import { OktaLogin } from "../../../Shared/OktaLogin"

let filePath = 'cypress/fixtures/cqlLibraryId'
let CQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
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
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
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
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
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
    it('Delete test Case - Draft Library - user has had the Library transferred to them', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
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
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
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
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
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
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
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
        cy.wait(1000)
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
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })

    })
    it('Delete test Case - Versioned Library - user has had the Library transferred to them', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
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
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').should('be.enabled').wait(1000)
            cy.scrollTo('top')
            cy.get('[data-testid="view/edit-cqlLibrary-button-' + fileContents + '"]').click()
            Utilities.waitForElementToNotExist('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
        })
    })
})