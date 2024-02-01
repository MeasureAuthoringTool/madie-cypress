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
describe('QDM Measure Definition(Terms)', () => {

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

    it('Add and Edit QDM Measure Definition(Terms)', () => {

        MeasuresPage.measureAction('edit')

        //Add Definition
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.addDefinitionButton).click()
        cy.get(EditMeasurePage.termInputTextbox).type('Term')
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Definition Saved Successfully')
        cy.get(EditMeasurePage.measureDefinitionTable).should('contain.text', 'Term')
        cy.get(EditMeasurePage.measureDefinitionTable).should('contain.text', 'Measure Definition')

        //Edit Definition
        cy.get(EditMeasurePage.editMeasureDefinition).click()
        cy.get(EditMeasurePage.termInputTextbox).clear().type('New Term')
        cy.get(EditMeasurePage.definitionInputTextbox).clear().type('New Measure Definition')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Definition Saved Successfully')
        cy.get(EditMeasurePage.measureDefinitionTable).should('contain.text', 'New Term')
        cy.get(EditMeasurePage.measureDefinitionTable).should('contain.text', 'New Measure Definition')

    })

    it('Discard changes button', () => {

        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.addDefinitionButton).click()
        cy.get('[data-testid="dialog-form"]').should('exist')
        cy.get(EditMeasurePage.termInputTextbox).type('Term')
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(EditMeasurePage.measureReferenceDiscardChanges).click()
        cy.get('[data-testid="dialog-form"]').should('not.exist')
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

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Non Measure owner unable to add Measure References', () => {

        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.reload()
        MeasuresPage.measureAction('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.addDefinitionButton).should('not.be.enabled')

        //Log out
        cy.get('[data-testid="user-profile-select"]').click()
        cy.get('[data-testid="user-profile-logout-option"]').click({ force: true }).wait(1000)
        cy.log('Log out successful')

    })
})