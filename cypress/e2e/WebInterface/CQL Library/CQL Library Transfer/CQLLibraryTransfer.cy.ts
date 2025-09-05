import { Environment } from "../../../../Shared/Environment"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import {CQLLibraryPage, EditLibraryActions} from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage";

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let updatedCQLLibraryName = CQLLibraryName + randValue + 'SomeUpdate' + 9
let randomCQLLibraryName = 'TransferTestCQLLibrary' + randValue + 5
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let versionNumber = '1.0.000'
const adminApiKey = Environment.credentials().adminApiKey

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
        Utilities.deleteLibrary(null, true)
    })


    it('Verify transferred CQL Library is viewable under Owned Libraries tab', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
    })

    it('Verify CQL Library can be edited by the transferred user', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })

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

//Skipping until feature flag TransferLibrary is removed
describe.skip('CQL Library Transfer - Action Centre buttons', () => {

    newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

    beforeEach('Create Library and Set Access Token', () => {

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    it('Verify CQL Library owner can transfer Library from Action centre transfer button on Owned Libraries page', () => {

        //Login as Regular user and transfer Library to ALT user
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('transfer')

        //Verify message on the transfer pop up screen
        cy.get('[class="transfer-dialog-info-text"]').should('contain.text', 'You are about to Transfer the following library(s). All versions and drafts will be transferred, so only the most recent library name appears here.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()

        //Logout and Delete Library with ALT user
        OktaLogin.UILogout()
        Utilities.deleteLibrary(newCQLLibraryName, false)

    })

    it('Verify CQL Library owner can transfer Library from Action centre transfer button on Edit Library page', () => {

        //Login as Regular user and transfer Library to ALT user
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Share Library with ALT user
        CQLLibraryPage.actionCenter(EditLibraryActions.transfer)

        //Verify message on the transfer pop up screen
        cy.get('[class="transfer-dialog-info-text"]').should('contain.text', 'You are about to Transfer the following library(s). All versions and drafts will be transferred, so only the most recent library name appears here.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()

        //Logout and Delete Library with ALT user
        OktaLogin.UILogout()
        Utilities.deleteLibrary(newCQLLibraryName, false)
    })

    it('Verify Transfer button disabled for non Library owner', () => {

        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click().wait(2000)

        Utilities.waitForElementVisible(CQLLibraryPage.allLibrariesTab, 60000)
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        //Select the Library
        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get('[data-testid="transfer-action-tooltip"]').should('not.be.enabled')
        cy.get('[data-testid="transfer-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'You cannot transfer a library you do not own, you have selected at least 1 library that you do not own')

        //Logout and Delete Measure with Regular user
        OktaLogin.UILogout()
        Utilities.deleteLibrary(newCQLLibraryName)
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
        CQLLibrariesPage.cqlLibraryActionCenter('draft')

        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(randomCQLLibraryName)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        //intercept draft id once library is drafted
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile('cypress/fixtures/cqlLibraryId', request.response.body.id)
        })

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', '1.0.000')
        cy.log('Draft Created Successfully')


        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        CQLLibrariesPage.validateCQLLibraryName(randomCQLLibraryName)
        //Click on Expand button to view Versioned Library
        cy.get('[data-testid="cqlLibrary-button-0_expandArrow"]').click()
        cy.get('[data-testid="table-body"]').should('contain', newCQLLibraryName)
    })
})

