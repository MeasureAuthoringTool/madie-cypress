import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()

describe('Create New Measure', () => {

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    after('Clean up', () => {

        //Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Login to Madie and Create New Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName,CqlLibraryName)

    })
})





