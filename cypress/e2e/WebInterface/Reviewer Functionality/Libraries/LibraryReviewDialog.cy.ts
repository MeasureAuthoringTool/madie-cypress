import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { ReviewDialogPage } from '../../../../Shared/ReviewDialogPage'
import { Utilities } from '../../../../Shared/Utilities'

describe.skip('MAT-10150 Mark Library Ready for Review dialog', () => {
    let ownedFhirLibraryName = ''
    let ownedQdmLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirLibraryName = `ReviewDialogOwnerFHIRLibrary${uniqueSuffix}`
        ownedQdmLibraryName = `ReviewDialogOwnerQDMLibrary${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(ownedFhirLibraryName, SupportedModels.FHIR, { altUser: true, libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(ownedQdmLibraryName, SupportedModels.QDM, { altUser: true, libraryNumber: 1 })
    })

    afterEach(() => {
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
    })

    it('opens from My Libraries and enables Save only after Mark as Ready changes', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(ownedFhirLibraryName)

        CQLLibrariesPage.selectLibraryRow(0, 'selectedAltUser')
        CQLLibrariesPage.openReviewDialog()
        ReviewDialogPage.assertInitialState('Mark Library Ready for Review')
        ReviewDialogPage.enterComments('Ready for review')
        ReviewDialogPage.markAsReady()
        ReviewDialogPage.closeWithCancel()
    })

    it('opens from owned QDM Library Detail and closes with the red X', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(ownedQdmLibraryName)

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(1, 'selectedAltUser')
        CQLLibraryPage.openReviewDialog()
        ReviewDialogPage.assertInitialState('Mark Library Ready for Review')
        ReviewDialogPage.closeWithX()
    })
})
