import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10149: Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10149 Library Review action', () => {
    let ownedFhirLibraryName = ''
    let sharedQdmLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirLibraryName = `ReviewOwnerFHIRLibrary${uniqueSuffix}`
        sharedQdmLibraryName = `ReviewSharedQDMLibrary${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(ownedFhirLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(sharedQdmLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        TestData.readCqlLibraryId(1).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true)).then(
                (response) => {
                    expect(response.status).to.eq(200)
                }
            )
        })
    })

    afterEach(() => {
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
    })

    it('enables Review for a selected FHIR library on My Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(ownedFhirLibraryName)

        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.assertReviewActionEnabled()
    })

    it('enables Review for a shared QDM library and shows it in Library Detail', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(sharedQdmLibraryName)

        CQLLibrariesPage.selectLibraryRow(1)
        CQLLibrariesPage.assertReviewActionEnabled()

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(1)
        CQLLibraryPage.assertReviewActionEnabled()
    })

    it('disables Review for an unshared library and hides it in Library Detail', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(ownedFhirLibraryName)

        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.assertReviewActionDisabled()

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(0)
        CQLLibraryPage.assertReviewActionAbsent()
    })
})
