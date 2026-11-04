import { AdminUserProfilePage } from '../../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { LibraryCQL } from '../../../../Shared/LibraryCQL'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'

const libraryDisabledTooltip =
    'Select the latest version in a library set that does not have a draft to change version #'

describe('Admin user profile Change Version Library action', () => {
    let libraryName = ''
    let owner = ''
    let sharedUser = ''
    let createdLibraryNumbers: number[] = []

    beforeEach(() => {
        libraryName = `AdminProfileChangeVersionLibrary${Date.now()}`
        owner = OktaLogin.getUser(false)
        sharedUser = OktaLogin.getUser(true)
        createdLibraryNumbers = []
    })

    const openLibraries = (shared = false): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(shared ? sharedUser : owner)
        AdminUserProfilePage.openLibrariesTab(
            shared ? AdminUserProfilePage.sharedLibrariesTab : AdminUserProfilePage.ownedLibrariesTab
        )
        AdminUserProfilePage.submitLibrarySearch(libraryName)
    }

    const assertLibraryDisabled = (): void => {
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.changeVersionButton,
            AdminUserProfilePage.changeVersionTooltip,
            libraryDisabledTooltip
        )
    }

    const assertLibraryEnabled = (): void => {
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.changeVersionButton,
            AdminUserProfilePage.changeVersionTooltip,
            'Change Version #'
        )
    }

    const createFinalLibrary = (): void => {
        createdLibraryNumbers.push(0)
        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, { cql: LibraryCQL.validCQL4QICORELib })
        TestData.versionCqlLibrary('1.0.000').its('status').should('eq', 200)
    }

    const createVersionAndDraftLibrary = (): void => {
        createFinalLibrary()
        createLibraryDraft(0, 1)
    }

    const createLibraryDraft = (sourceLibraryNumber: number, draftLibraryNumber: number): Cypress.Chainable<void> => {
        return TestData.draftCqlLibrary(
            (libraryId) => ({
                id: libraryId,
                cqlLibraryName: libraryName,
                model: SupportedModels.qiCore4
            }),
            {},
            sourceLibraryNumber
        )
            .then((response) => {
                expect(response.status).to.eq(201)
                createdLibraryNumbers.push(draftLibraryNumber)
                return TestData.writeCqlLibraryId(response.body.id, draftLibraryNumber)
            })
            .then(() => undefined)
    }

    const createLibraryVersionHistory = (versionCount: number): Cypress.Chainable<void> => {
        createFinalLibrary()

        const createNextVersion = (versionNumber: number): Cypress.Chainable<void> => {
            if (versionNumber === versionCount) {
                return cy.then(() => undefined)
            }

            return createLibraryDraft(versionNumber - 1, versionNumber)
                .then(() => TestData.versionCqlLibrary(`${versionNumber + 1}.0.000`, versionNumber))
                .then((response) => {
                    expect(response.status).to.eq(200)
                    return createNextVersion(versionNumber + 1)
                })
        }

        return cy.then(() => createNextVersion(1))
    }

    afterEach(() => {
        const libraryNumbers = [...new Set(createdLibraryNumbers)].reverse()
        const deleteNextLibrary = (index = 0): Cypress.Chainable<void> => {
            if (index === libraryNumbers.length) {
                return cy.then(() => undefined)
            }

            return TestData.readCqlLibraryId(libraryNumbers[index])
                .then((libraryId) =>
                    TestData.requestAdminCqlLibraryDeleteById(libraryId, owner, { failOnStatusCode: false })
                )
                .then(() => deleteNextLibrary(index + 1))
        }

        return cy
            .then(() => {
                OktaLogin.setupAdminSession()
            })
            .then(() => {
                return deleteNextLibrary()
            })
    })

    describe('disabled Change Version availability', () => {
        it('disables Change Version for a draft Library', () => {
            createdLibraryNumbers.push(0)
            CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, {
                cql: LibraryCQL.validCQL4QICORELib
            })
            openLibraries()
            AdminUserProfilePage.selectLibraryByName(libraryName)
            assertLibraryDisabled()
        })

        it('disables Change Version with no Library selected', () => {
            createFinalLibrary()
            openLibraries()
            assertLibraryDisabled()
        })

        it('disables Change Version for the latest Library version when its set has a draft', () => {
            createVersionAndDraftLibrary()
            openLibraries()
            AdminUserProfilePage.expandLibrarySet(libraryName)
            TestData.readCqlLibraryId().then((versionedLibraryId) => {
                AdminUserProfilePage.selectLibraryById(versionedLibraryId)
            })
            assertLibraryDisabled()
        })

        it('disables Change Version for a historical Library version', () => {
            createLibraryVersionHistory(2)
            openLibraries()
            AdminUserProfilePage.expandLibrarySet(libraryName)
            TestData.readCqlLibraryId().then((historicalLibraryId) => {
                AdminUserProfilePage.selectLibraryById(historicalLibraryId)
            })
            assertLibraryDisabled()
        })

        it('disables Change Version when multiple Library versions are selected', () => {
            createVersionAndDraftLibrary()
            openLibraries()
            AdminUserProfilePage.selectLibraryByName(libraryName)
            AdminUserProfilePage.expandLibrarySet(libraryName)
            TestData.readCqlLibraryId().then((versionedLibraryId) => {
                AdminUserProfilePage.selectLibraryById(versionedLibraryId)
            })
            assertLibraryDisabled()
        })
    })

    const openEligibleLibraryDialog = (): void => {
        createFinalLibrary()
        openLibraries()
        AdminUserProfilePage.selectLibraryByName(libraryName)
        assertLibraryEnabled()
        AdminUserProfilePage.openChangeVersionDialog()
    }

    describe('Change Version dialog', () => {
        it('displays the Change Version Library dialog details', () => {
            openEligibleLibraryDialog()
            AdminUserProfilePage.assertChangeVersionLibraryDetails(libraryName, '1.0.000')
        })

        it('opens and closes the Library Versions panel', () => {
            openEligibleLibraryDialog()
            AdminUserProfilePage.openLibraryVersions(1)
            AdminUserProfilePage.closeLibraryVersions()
        })

        it('closes the Change Version Library dialog when Cancel is clicked', () => {
            openEligibleLibraryDialog()
            AdminUserProfilePage.cancelChangeVersion()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.assertChangeVersionCurrentVersion('1.0.000')
        })

        it('keeps the Change Version Library dialog open when Save is clicked', () => {
            openEligibleLibraryDialog()
            AdminUserProfilePage.saveChangeVersion('0.5.000')
            AdminUserProfilePage.assertChangeVersionCurrentVersion('1.0.000')
        })
    })

    describe('Library Version history', () => {
        it('lists multiple Library versions in descending version order', () => {
            createLibraryVersionHistory(2)
            openLibraries()
            AdminUserProfilePage.selectLibraryByName(libraryName)
            assertLibraryEnabled()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.openLibraryVersions(2)
            AdminUserProfilePage.assertLibraryVersionsInOrder(['2.0.000 (Current)', '1.0.000'])
        })
    })

    describe('Library Version history scrolling', () => {
        it('shows six Library versions in a scrollable panel', () => {
            createLibraryVersionHistory(6)
            openLibraries()
            AdminUserProfilePage.selectLibraryByName(libraryName)
            assertLibraryEnabled()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.openLibraryVersions(6)
            AdminUserProfilePage.assertLibraryVersionsScrollable('1.0.000')
        })
    })

    describe('enabled Change Version availability', () => {
        it('enables Change Version for a latest Owned Library', () => {
            createFinalLibrary()
            openLibraries()
            AdminUserProfilePage.selectLibraryByName(libraryName)
            assertLibraryEnabled()
        })

        it('enables Change Version for a latest Shared Library', () => {
            createFinalLibrary()
            TestData.readCqlLibraryId().then((libraryId) => {
                TestData.requestSharePermissions('library', 'GRANT', libraryId, sharedUser)
                    .its('status')
                    .should('eq', 200)
            })
            openLibraries(true)
            AdminUserProfilePage.selectLibraryByName(libraryName)
            assertLibraryEnabled()
        })
    })
})
