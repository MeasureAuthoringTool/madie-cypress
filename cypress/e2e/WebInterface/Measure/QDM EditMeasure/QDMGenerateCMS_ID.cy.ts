import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {Utilities} from "../../../../Shared/Utilities"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe.only('Generate CMS ID', () => {

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the CMS ID can be generated successfully', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')

        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')

        cy.get(EditMeasurePage.generateCmsIdButton).click()

        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.not.contain('FHIR')
        })

        cy.log('CMS ID Generated successfully')

    })
})
