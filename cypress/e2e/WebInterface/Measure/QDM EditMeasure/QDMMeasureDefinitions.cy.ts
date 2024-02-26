import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {Utilities} from "../../../../Shared/Utilities"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Global} from "../../../../Shared/Global"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

//Skipping until feature flag is removed
describe.skip('QDM Measure Definition', () => {

       beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Add QDM Measure Definitions', () => {

        MeasuresPage.measureAction('edit')

        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(EditMeasurePage.saveMeasureDefinition).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Definition Information Saved Successfully')

    })

    it('Discard changes button', () => {

        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        Global.clickOnDiscardChanges()

    })
})

//Skipping until feature flag is removed
describe.skip('QDM Measure Definition ownership validation', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.AltLogin()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Non Measure owner unable to add Measure Definition', () => {

        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.reload()
        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).should('have.attr', 'readonly')

    })
})

