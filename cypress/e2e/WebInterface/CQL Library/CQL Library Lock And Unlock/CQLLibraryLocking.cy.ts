import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { LockedEntityValidation } from "../../../../Shared/LockedEntityValidation"
import { SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { TestData } from "../../../../Shared/TestData"
import { step } from "../../../../utils/step"

let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserAlt = ''

describe('CQL Library Locking Validations', () => {
    const openLockedLibraryInView = (): void => {
        step('Open locked library in view mode')
        CQLLibrariesPage.clickViewforCreatedLibrary()
    }

    beforeEach('Create CQL Library', () => {
        newCQLLibraryName = `LibraryLocking${Date.now()}${Math.floor((Math.random() * 1000) + 1)}`
        harpUserAlt = OktaLogin.getUser(true)

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {
        Utilities.verifyAllLocksDeleted(MadieObject.Library, true)
        Utilities.verifyAllLocksDeleted(MadieObject.Library)
        Utilities.deleteLibrary()
    })

    it('User unable to delete CQL Library, when the Library is locked by a different User', () => {
        step('Lock library with alt user')
        cy.setAccessTokenCookie()
        Utilities.lockSharedLibrary(true)

        step('Login as regular user')
        OktaLogin.SessionLogin()
        CQLLibrariesPage.selectCreatedLibraryRow()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)
    })

    it('Library list View tooltip includes display name and HARP ID', () => {
        LockedEntityValidation.getDisplayName(harpUserAlt).then((displayName) => {
            const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserAlt)
            const legacyTooltip = LockedEntityValidation.legacyLockedTooltipText(harpUserAlt)

            step('Share and lock library')
            Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserAlt)
            Utilities.lockSharedLibrary(true)

            step('Login and open library list')
            OktaLogin.Login()
            CQLLibrariesPage.openLibrariesList()
            cy.get(CQLLibraryPage.allLibrariesTab).click()

            TestData.readCqlLibraryId().then((libraryId) => {
                const buttonSelector = CQLLibrariesPage.getLibraryActionSelector(libraryId)
                cy.get(buttonSelector).scrollIntoView().should('contain.text', 'View')
                cy.get(buttonSelector).trigger('mouseover', { force: true })
                LockedEntityValidation.assertVisibleTooltipText(expectedTooltip, legacyTooltip)
            })
        })
    })

    describe('Locked library view experience', () => {
        beforeEach(() => {
            step('Share and lock library')
            Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserAlt)
            Utilities.lockSharedLibrary(true)

            step('Login to MADiE')
            OktaLogin.Login()
        })

        it('shows the locked library modal message and closes with X', () => {
            LockedEntityValidation.getDisplayName(harpUserAlt).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserAlt
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage, 'x')
            })
        })

        it('shows the locked library modal message and closes with Close button', () => {
            LockedEntityValidation.getDisplayName(harpUserAlt).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserAlt
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage, 'button')
            })
        })

        it('Locked library header In-Use tooltip includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserAlt).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserAlt)
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserAlt
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage)
                CQLLibraryPage.assertLockedLibraryIndicatorTooltip(expectedTooltip)
            })
        })
    })
})
