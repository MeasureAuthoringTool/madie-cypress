import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Utilities } from "../../../Shared/Utilities"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"

let CQLLibraryName = ''

describe('Create CQL Library', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        Utilities.deleteLibrary()
    })

    it('Navigate to CQL Library Page and create New QI-Core 6.0.0 CQL Library', () => {

        CQLLibraryName = 'QICore6CQLLibrary' + Date.now()

        CQLLibraryPage.createCQLLibrary(CQLLibraryName)
    })

    it('Navigate to CQL Library Page and create New QDM CQL Library', () => {
       
        CQLLibraryName = 'QDMCQLLibrary' + Date.now()

        CQLLibraryPage.createCQLLibrary(CQLLibraryName, { model: SupportedModels.QDM })
    })
})
