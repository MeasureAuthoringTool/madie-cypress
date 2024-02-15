import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {Utilities} from "../../../../Shared/Utilities"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

//Skipping until feature flag is removed
describe.skip('QDM Measure Reference', () => {

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

    it('QDM Measure Reference - Successful creation', () => {

        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Documentation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')
    })

    it('Discard changes button', () => {

        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get('[data-testid="dialog-form"]').should('exist')
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.measureReferenceDiscardChanges).click()
        cy.get('[data-testid="dialog-form"]').should('not.exist')
    })
})

//Skipping until feature flag is removed
describe.skip('QDM Measure Reference ownership validation', () => {

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

    it('Non Measure owner unable to add Measure References', () => {

        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.reload()
        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).should('not.be.enabled')

    })
})
