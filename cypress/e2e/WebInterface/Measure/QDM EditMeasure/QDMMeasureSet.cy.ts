import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Global} from "../../../../Shared/Global"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe('QDM Measure Set', () => {

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

    it('Add QDM Measure Set', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).type('Measure Set')
        cy.get(EditMeasurePage.measureSetSaveBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Measure Set Information Saved Successfully')
        cy.get(EditMeasurePage.measureSetText).should('contain.text','Measure Set')

    })

    it('Discard changes button', () => {

        MeasuresPage.measureAction('edit')

        //Navigate to Measure set page
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).type('Measure Set')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        Global.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureSetText).should('be.empty')
    })
})

describe('QDM Measure Set - ownership validations', () => {

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

    it('Non Measure owner unable to add Measure Set', () => {

        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.reload()
        MeasuresPage.measureAction('edit')

        //Navigate to Measure set page
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).should('have.attr', 'readonly', 'readonly')

    })
})