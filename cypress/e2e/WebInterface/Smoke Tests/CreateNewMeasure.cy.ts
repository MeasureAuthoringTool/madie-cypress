import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"

let measureName = ''
let CqlLibraryName = ''

describe('Create New Measure', () => {

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout and Cleanup', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create QI Core Measure', () => {

        measureName = 'QICoreTestMeasure' + Date.now()
        CqlLibraryName = 'QICoreTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName,CqlLibraryName)

    })

    it('Create QDM Measure', () => {

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'QDMTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasure(measureName,CqlLibraryName)

    })
})





