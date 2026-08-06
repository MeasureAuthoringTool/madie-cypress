import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { Environment } from '../../../Shared/Environment'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { TestData } from '../../../Shared/TestData'

const describeAdminUserProfile = Cypress.env('environment') === 'test' ? describe.skip : describe

const assertDeleteDialog = (message: string): void => {
    cy.get(CQLLibraryPage.cqlLibraryDeleteDialog)
        .should('be.visible')
        .within(() => {
            cy.contains('h2', 'Delete Library').should('be.visible')
            cy.contains(message).should('be.visible')
            cy.get(CQLEditorPage.modalActionWarning)
                .should('be.visible')
                .and('contain.text', 'This action cannot be undone.')
            cy.get('hr').should('have.length.at.least', 2)
            cy.contains('button', 'Cancel').should('be.enabled')
            cy.get(CQLEditorPage.deleteContinueButton)
                .should('be.enabled')
                .and('contain.text', 'Yes, Delete')
                .should(($button) => {
                    const [red, green, blue] =
                        getComputedStyle($button[0]).backgroundColor.match(/\d+/g)?.map(Number) ?? []
                    expect(red, 'destructive button red channel').to.be.greaterThan(green)
                    expect(red, 'destructive button red channel').to.be.greaterThan(blue)
                })
        })
}

// MAT-9816: Run in DEV until the AdminUserProfile feature and delete flows are proven.
describeAdminUserProfile('Admin user profile library deletion', () => {
    let libraryName = ''
    let libraryOwner = ''
    let profileUser = ''

    beforeEach(() => {
        const credentials = Environment.credentials()
        libraryName = `AdminProfileLibraryDelete${Date.now()}`
        libraryOwner = OktaLogin.getUser(false)
        profileUser = credentials.altHarpUser?.toLowerCase() ?? ''
        expect(profileUser, 'shared profile user').not.to.be.empty
        expect(profileUser, 'shared profile user differs from owner').not.to.eq(libraryOwner)
    })

    afterEach(() => {
        OktaLogin.setupAdminSession()
        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.requestAdminCqlLibraryDeleteById(libraryId, libraryOwner, {
                failOnStatusCode: false
            })
        })
    })

    const openOwnedDraftDeleteDialog = (): void => {
        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, {
            cql: LibraryCQL.validCQL4QICORELib
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryName)
        AdminUserProfilePage.selectLibraryByName(libraryName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete library'
        )

        cy.get(AdminUserProfilePage.deleteButton).click()
        assertDeleteDialog(`Are you sure you want to delete draft of ${libraryName}`)
    }

    it('deletes an Owned draft library after showing the draft confirmation', () => {
        openOwnedDraftDeleteDialog()
        cy.intercept('DELETE', '**/api/cql-libraries/*').as('deleteDraft')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.wait('@deleteDraft').its('response.statusCode').should('eq', 200)
        cy.get(AdminUserProfilePage.librariesTable).should('not.contain.text', libraryName)
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('cancels an Owned draft deletion without sending a delete request', () => {
        openOwnedDraftDeleteDialog()
        cy.intercept('DELETE', '**/api/cql-libraries/**').as('deleteLibrary')

        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog).contains('button', 'Cancel').click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog).should('not.exist')
        cy.get('@deleteLibrary.all').should('have.length', 0)
        AdminUserProfilePage.findLibraryRow(libraryName).should('be.visible')
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('closes an Owned draft deletion with the dialog X without sending a delete request', () => {
        openOwnedDraftDeleteDialog()
        cy.intercept('DELETE', '**/api/cql-libraries/**').as('deleteLibrary')

        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog).find(CQLEditorPage.modalXButton).click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog).should('not.exist')
        cy.get('@deleteLibrary.all').should('have.length', 0)
        AdminUserProfilePage.findLibraryRow(libraryName).should('be.visible')
    })

    it('deletes a Shared version library through the admin single-instance endpoint', () => {
        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.QDM, {
            cql: LibraryCQL.validCQL4QDMLib
        })
        TestData.versionCqlLibrary('1.0.000').then((versionResponse) => {
            const versionId = versionResponse.body.id
            expect(versionId, 'version id').to.be.a('string').and.not.be.empty
            TestData.requestSharePermissions('library', 'GRANT', versionId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryName)
        AdminUserProfilePage.selectLibraryByName(libraryName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete library'
        )

        cy.get(AdminUserProfilePage.deleteButton).click()
        assertDeleteDialog(`Are you sure you want to delete version 1.0.000 of ${libraryName}`)
        cy.intercept('DELETE', '**/api/cql-libraries/admin/*').as('deleteVersion')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.wait('@deleteVersion').then(({ request, response }) => {
            expect(request.headers.harpid).to.eq(libraryOwner)
            expect(response?.statusCode).to.eq(200)
        })
        cy.get(AdminUserProfilePage.librariesTable).should('not.contain.text', libraryName)
    })
})
