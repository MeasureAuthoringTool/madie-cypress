import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Review Info Page', () => {

    beforeEach('Create Measure and Login',() => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Logout and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate fields on Measure Review Info page', () => {

        MeasuresPage.measureAction("edit")

        //Click on Review Info tab
        cy.get(EditMeasurePage.reviewInfoTab).click()
    })
})