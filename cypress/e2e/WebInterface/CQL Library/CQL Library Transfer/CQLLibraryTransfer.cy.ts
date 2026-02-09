import { Environment } from "../../../../Shared/Environment"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"

let CQLLibraryName = ''
const CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = ''
const versionNumber = '1.0.000'
const adminApiKey = Environment.credentials().adminApiKey

describe('CQL Library Transfer', () => {

    beforeEach('Create CQL Library', () => {

        CQLLibraryName = 'TransferLibrary' + Date.now()

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

        harpUserALT = OktaLogin.getUser(true)
    })

    it('Verify transferred CQL Library is viewable under Owned Libraries tab', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)

        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/transfer?retainShareAccess=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpid': harpUserALT
                    },
                    body: [id],
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
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
        const updatedCQLLibraryName = CQLLibraryName + 'SomeUpdate' + Date.now()

        OktaLogin.setupUserSession(false)

        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/harpUser/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/transfer?retainShareAccess=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpid': harpUserALT
                    },
                    body: [id],
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })

        OktaLogin.setupUserSession(true)
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

describe('CQL Library Transfer - Action Centre buttons', () => {

    beforeEach('Create Library and Set Access Token', () => {

        CQLLibraryName = 'ACTransferLibrary' + Date.now()

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)
    })

    it('Verify CQL Library owner can transfer Library from Action centre transfer button on Owned Libraries page', () => {
        const updatedCQLLibraryName = CQLLibraryName + 'SomeUpdate' + Date.now()

        //Login as Regular user and transfer Library to ALT user
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('transfer')

        //Verify message on the transfer pop up screen
        cy.get('.transfer-dialog-info-text > :nth-child(1)').should('contain.text', 'You are about to Transfer ownership of the following library(s). All versions and drafts will be transferred. So only the most recent library name appears here.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)

        //Select Retain Share Access checkbox
        cy.get('[data-testid="retainShareAccess"]').click()
        cy.get(MeasuresPage.transferContinueButton).click()

        //Verify toast message
        cy.get('[data-testid="toast-success"]').should('contain.text', 'The library(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the libraries.')

        //Verify the user still has Share access to the Library
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        //Logout as Regular user and Login as ALT user to verify ownership
        OktaLogin.UILogout()

        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        //Verify the user has Edit access to the Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.log('CQL Library Updated Successfully')

        //Delete Library with ALT user
        Utilities.deleteLibrary(updatedCQLLibraryName, true)
    })

    it('Verify CQL Library owner can transfer Library from Action centre transfer button on Edit Library page', () => {

        OktaLogin.setupUserSession(false)

        //Login as Regular user and transfer Library to ALT user
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Share Library with ALT user
        CQLLibraryPage.actionCenter(EditLibraryActions.transfer)

        //Verify message on the transfer pop up screen
        cy.get('.transfer-dialog-info-text > :nth-child(1)').should('contain.text', 'You are about to Transfer ownership of the following library(s). All versions and drafts will be transferred. So only the most recent library name appears here.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()

        //Verify toast message
        cy.get('[data-testid="edit-library-cql-success-text"]').should('contain.text', 'The library(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the libraries.')

        //Logout as Regular user and Login as ALT user to verify ownership
        OktaLogin.UILogout()

        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        //Logout and Delete Library with ALT user
        OktaLogin.UILogout()
        Utilities.deleteLibrary(CQLLibraryName, true)
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
        Utilities.deleteLibrary(CQLLibraryName)
    })

    it('Verify Transfer button does not exist for shared user on Edit Library page', () => {

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)


        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click().wait(2000)

        Utilities.waitForElementVisible(CQLLibraryPage.sharedLibrariesTab, 60000)
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //Navigate to Edit Library page
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.actionCenterButton).click()
        cy.get(CQLLibraryPage.actionCenterTransfer).should('not.exist')

        //Logout and Delete Measure with Regular user
        OktaLogin.UILogout()
        Utilities.deleteLibrary(CQLLibraryName)
    })
})

describe('CQL Library Transfer - Multiple instances', () => {

    beforeEach('Create CQL Library', () => {
        
        harpUserALT = OktaLogin.getUser(true)

        CQLLibraryName = 'TransferMultipleLibraries' + Date.now()

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CQLLibraryName, CQLLibraryPublisher)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
    })

    afterEach('LogOut', () => {

        OktaLogin.setupUserSession(true)
        Utilities.deleteLibrary(null, true)
    })

    it('Verify all instances in the Library set (Version and Draft) are Transferred to the new owner', () => {
        const randomCQLLibraryName = 'TransferTestCQLLibrary' + Date.now()
        const currentUser = Cypress.env('selectedUser')
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
        cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId', request.response.body.id)
        })

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', '1.0.000')
        cy.log('Draft Created Successfully')


        //Transfer Library to ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/transfer?retainShareAccess=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpid': harpUserALT
                    },
                    body: [id],
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
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
        cy.get('[data-testid="table-body"]').should('contain', CQLLibraryName)
    })
})

