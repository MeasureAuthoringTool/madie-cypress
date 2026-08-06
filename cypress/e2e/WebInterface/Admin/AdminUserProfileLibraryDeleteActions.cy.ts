import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { Environment } from '../../../Shared/Environment'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { TestData } from '../../../Shared/TestData'

const describeAdminUserProfile = Cypress.env('environment') === 'test' ? describe.skip : describe

// MAT-9816: Run in DEV until the AdminUserProfile delete action is proven.
describeAdminUserProfile('Admin user profile library delete action states', () => {
    let libraryOwner = ''
    let profileUser = ''
    let libraryNamePrefix = ''
    let createdLibraryNumbers: number[] = []

    const createLibrary = (
        libraryName: string,
        model: SupportedModels,
        libraryNumber = 0
    ): void => {
        createdLibraryNumbers.push(libraryNumber)
        CQLLibraryPage.createLibraryAPI(libraryName, model, {
            cql: model === SupportedModels.QDM ? LibraryCQL.validCQL4QDMLib : LibraryCQL.validCQL4QICORELib,
            libraryNumber
        })
    }

    const shareLibrary = (libraryNumber = 0): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    }

    beforeEach(() => {
        libraryOwner = OktaLogin.getUser(false)
        profileUser = Environment.credentials().altHarpUser?.toLowerCase() ?? ''
        libraryNamePrefix = `AdminProfileLibraryDeleteActions${Date.now()}`
        createdLibraryNumbers = []
        expect(profileUser, 'shared profile user').not.to.be.empty
        expect(profileUser, 'shared profile user differs from owner').not.to.eq(libraryOwner)
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

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('disables Delete on Owned and Shared Libraries when nothing is selected', () => {
        createLibrary(libraryNamePrefix, SupportedModels.qiCore4)
        shareLibrary()

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select library to delete'
        )

        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select library to delete'
        )
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('enables Delete for the latest draft and disables it for a historical version', () => {
        createLibrary(libraryNamePrefix, SupportedModels.QDM)
        TestData.versionCqlLibrary('1.0.000').then((versionResponse) => {
            TestData.draftCqlLibrary((libraryId) => ({
                id: libraryId,
                cqlLibraryName: libraryNamePrefix,
                model: SupportedModels.QDM
            })).then((draftResponse) => {
                expect(draftResponse.status).to.eq(201)
                TestData.writeCqlLibraryId(draftResponse.body.id, 1)
                createdLibraryNumbers.push(1)
                expect(versionResponse.body.id, 'version id').to.be.a('string').and.not.be.empty
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryNamePrefix)
        AdminUserProfilePage.selectLibraryByName(libraryNamePrefix)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete library'
        )

        AdminUserProfilePage.selectLibraryByName(libraryNamePrefix).uncheck()
        AdminUserProfilePage.expandLibrarySet(libraryNamePrefix)
        cy.contains(`${AdminUserProfilePage.librariesTable} tr.expanded-row td`, '1.0.000')
            .closest('tr')
            .find('input[type="checkbox"]')
            .check()
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select library to delete'
        )
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('disables Delete when multiple Shared Libraries are selected', () => {
        const firstLibraryName = `${libraryNamePrefix}One`
        const secondLibraryName = `${libraryNamePrefix}Two`
        createLibrary(firstLibraryName, SupportedModels.qiCore4)
        createLibrary(secondLibraryName, SupportedModels.QDM, 1)
        shareLibrary()
        shareLibrary(1)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryNamePrefix)
        AdminUserProfilePage.selectLibraryByName(firstLibraryName)
        AdminUserProfilePage.selectLibraryByName(secondLibraryName)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select library to delete'
        )
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('enables Delete for a latest version on both Owned and Shared Libraries', () => {
        createLibrary(libraryNamePrefix, SupportedModels.qiCore4)
        TestData.versionCqlLibrary('1.0.000').then((versionResponse) => {
            expect(versionResponse.body.id, 'version id').to.be.a('string').and.not.be.empty
            shareLibrary()
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryNamePrefix)
        AdminUserProfilePage.selectLibraryByName(libraryNamePrefix)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete library'
        )

        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryNamePrefix)
        AdminUserProfilePage.selectLibraryByName(libraryNamePrefix)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete library'
        )
    })

    // MAT-9816: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('disables Delete when multiple Owned Libraries are selected', () => {
        const firstLibraryName = `${libraryNamePrefix}One`
        const secondLibraryName = `${libraryNamePrefix}Two`
        createLibrary(firstLibraryName, SupportedModels.qiCore4)
        createLibrary(secondLibraryName, SupportedModels.QDM, 1)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch(libraryNamePrefix)
        AdminUserProfilePage.selectLibraryByName(firstLibraryName)
        AdminUserProfilePage.selectLibraryByName(secondLibraryName)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select library to delete'
        )
    })
})
