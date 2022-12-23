import {OktaLogin} from "../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"

describe('Create CQL Library', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    //Skipping until MAT-5175 is fixed
    it.skip('Navigate to CQL Library Page and create New Library', () => {

        let CQLLibraryName = 'TestLibrary' + Date.now()
        let CQLLibraryPublisher = 'SemanticBits'

        CQLLibraryPage.createCQLLibrary(CQLLibraryName, CQLLibraryPublisher)
    })
})