import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { Environment } from '../../../Shared/Environment'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { TestData } from '../../../Shared/TestData'

const assertTransferDialog = (
    libraryName: string,
    model: string,
    currentOwner: string,
    selectedLibraryCount = 1
): void => {
    cy.get('[role="dialog"]')
        .should('be.visible')
        .within(() => {
            cy.contains('h2', 'Transfer Library Ownership').should('be.visible')
            cy.get('.transfer-dialog-info-text').should(
                'contain.text',
                `You are about to Transfer ownership of the ${selectedLibraryCount} selected library(s) below. All versions and drafts will be transferred, but only the most recent library name appears in the list below.`
            )
            ;['Library', 'Model', 'Current Library Owner'].forEach((columnName) => {
                cy.contains(columnName).should('be.visible')
            })

            cy.contains(libraryName).should('be.visible')
            cy.contains(model).should('be.visible')
            cy.contains(currentOwner).should('be.visible')
            cy.contains('label', 'New Library Owner').should('contain.text', '*')
            cy.get(MeasuresPage.newOwnerTextbox).should('be.visible').and('have.value', '')
            cy.get('[data-testid="retainShareAccess"] input[type="checkbox"]').should('not.be.checked')
            cy.contains('Retain Share Access after Transfer').should('be.visible')
            cy.contains('button', 'Cancel').should('be.enabled')
            cy.get(MeasuresPage.transferContinueButton).should('be.disabled')

            cy.get(MeasuresPage.paginationLimitSelect).should('contain.text', '5').click()
        })
    ;['5', '10', '25', '50'].forEach((pageSize) => {
        cy.get(`[role="option"][data-value="${pageSize}"]`).should('be.visible')
    })
    cy.get('body').type('{esc}')
}

describe('Admin user profile Library Transfer', () => {
    let qicoreLibraryName = ''
    let qdmLibraryName = ''
    let libraryOwner = ''
    let newOwner = ''
    let sharedProfileUser = ''
    let createdLibraryNumbers: number[] = []

    const createLibrary = (libraryName: string, model: SupportedModels, libraryNumber = 0): void => {
        createdLibraryNumbers.push(libraryNumber)
        CQLLibraryPage.createLibraryAPI(libraryName, model, {
            cql: model === SupportedModels.QDM ? LibraryCQL.validCQL4QDMLib : LibraryCQL.validCQL4QICORELib,
            libraryNumber
        })
    }

    const shareLibraryWithProfileUser = (libraryNumber = 0): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, sharedProfileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    }

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        qicoreLibraryName = `AdminProfileTransferQiCore${uniqueSuffix}`
        qdmLibraryName = `AdminProfileTransferQdm${uniqueSuffix}`
        libraryOwner = OktaLogin.getUser(false)
        newOwner = OktaLogin.getUser(true)
        sharedProfileUser = Environment.credentials().adminUser?.toLowerCase() ?? ''
        createdLibraryNumbers = []

        expect(sharedProfileUser, 'configured Admin profile user').not.to.be.empty
        expect(sharedProfileUser, 'shared profile user differs from owner').not.to.eq(libraryOwner)
        expect(newOwner, 'transfer target differs from owner').not.to.eq(libraryOwner)
    })

    afterEach(() => {
        OktaLogin.setupAdminSession()
        ;[...new Set(createdLibraryNumbers)].reverse().forEach((libraryNumber) => {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestAdminCqlLibraryDeleteById(libraryId, libraryOwner, {
                    failOnStatusCode: false
                })
            })
        })
    })

    it('disables Transfer on Owned and Shared Libraries when no library is selected', () => {
        createLibrary(qicoreLibraryName, SupportedModels.qiCore4)
        shareLibraryWithProfileUser()

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Select a library to transfer'
        )

        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Select a library to transfer'
        )
    })

    it('opens the Transfer dialog for an Owned QI-Core Library and allows cancellation', () => {
        createLibrary(qicoreLibraryName, SupportedModels.qiCore4)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qicoreLibraryName)
        AdminUserProfilePage.selectLibraryByName(qicoreLibraryName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Transfer'
        )
        cy.get(AdminUserProfilePage.transferButton).click()

        assertTransferDialog(qicoreLibraryName, 'QI-Core v4.1.1', libraryOwner)
        cy.get('[role="dialog"]').contains('button', 'Cancel').click()
        cy.get('[role="dialog"]').should('not.exist')
        AdminUserProfilePage.findLibraryRow(qicoreLibraryName).should('be.visible')
    })

    it('opens the Transfer dialog for a Shared QDM Library with the actual owner', () => {
        createLibrary(qdmLibraryName, SupportedModels.QDM)
        shareLibraryWithProfileUser()

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qdmLibraryName)
        AdminUserProfilePage.selectLibraryByName(qdmLibraryName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Transfer'
        )
        cy.get(AdminUserProfilePage.transferButton).click()

        assertTransferDialog(qdmLibraryName, 'QDM v5.6', libraryOwner)
    })

    it('lists multiple selected libraries in the Transfer dialog', () => {
        createLibrary(qicoreLibraryName, SupportedModels.qiCore4)
        createLibrary(qdmLibraryName, SupportedModels.QDM, 1)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch('AdminProfileTransfer')
        AdminUserProfilePage.selectLibraryByName(qicoreLibraryName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled')
        AdminUserProfilePage.selectLibraryByName(qdmLibraryName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        assertTransferDialog(qicoreLibraryName, 'QI-Core v4.1.1', libraryOwner, 2)
        cy.get('[role="dialog"]').within(() => {
            cy.contains(qdmLibraryName).should('be.visible')
            cy.contains('QDM v5.6').should('be.visible')
        })
    })

    it('transfers an Owned Library to the selected user', () => {
        createLibrary(qicoreLibraryName, SupportedModels.qiCore4)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qicoreLibraryName)
        AdminUserProfilePage.selectLibraryByName(qicoreLibraryName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        cy.get(MeasuresPage.newOwnerTextbox).type(newOwner)
        cy.get(MeasuresPage.transferContinueButton).should('be.enabled')
        cy.intercept('PUT', '**/api/cql-libraries/transfer?retainShareAccess=false').as('transferLibrary')
        cy.get(MeasuresPage.transferContinueButton).click()
        cy.wait('@transferLibrary').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.headers.harpid).to.eq(newOwner)
            TestData.readCqlLibraryId().then((libraryId) => {
                expect(request.body).to.deep.eq([libraryId])
            })
        })
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qicoreLibraryName).should('not.exist')

        AdminUserProfilePage.openUserProfile(newOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qicoreLibraryName)
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qicoreLibraryName).should('be.visible')
    })

    it('transfers a Shared Library and retains access for the former owner', () => {
        createLibrary(qdmLibraryName, SupportedModels.QDM)
        shareLibraryWithProfileUser()

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qdmLibraryName)
        AdminUserProfilePage.selectLibraryByName(qdmLibraryName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        cy.get(MeasuresPage.newOwnerTextbox).type(newOwner)
        cy.get('[data-testid="retainShareAccess"] input[type="checkbox"]').check()
        cy.get(MeasuresPage.transferContinueButton).should('be.enabled')
        cy.intercept('PUT', '**/api/cql-libraries/transfer?retainShareAccess=true').as('transferSharedLibrary')
        cy.get(MeasuresPage.transferContinueButton).click()
        cy.wait('@transferSharedLibrary').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.headers.harpid).to.eq(newOwner)
            TestData.readCqlLibraryId().then((libraryId) => {
                expect(request.body).to.deep.eq([libraryId])
            })
        })

        AdminUserProfilePage.openUserProfile(newOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qdmLibraryName)
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qdmLibraryName).should('be.visible')

        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(qdmLibraryName)
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qdmLibraryName).should('be.visible')
    })
})
