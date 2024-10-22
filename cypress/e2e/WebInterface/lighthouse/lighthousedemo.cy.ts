
import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {Utilities} from "../../../Shared/Utilities"


describe('test', () => {



    it('should run lighthouse performance audits using default thresholds', () => {

        OktaLogin.Login()

        cy.lighthouse()

    })

})
