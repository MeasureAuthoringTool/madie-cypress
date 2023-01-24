import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {Header} from "../../../Shared/Header"
import {Utilities} from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let updatedMeasureName = 'UpdatedTestMeasure' + Date.now()

describe('Edit Measure', () => {
    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring)

    })

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Edit Measure Name and verify the measure name is updated on Measures page', () => {

        //Edit Measure Name
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.measureNameTextBox).clear()
        cy.get(EditMeasurePage.measureNameTextBox).type(updatedMeasureName)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')

        //Add Measure Steward
        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).contains('Steward & Developers').click()

        //select a value for Steward
        //Utilities.dropdownSelect(EditMeasurePage.measureStewardDrpDwn, 'Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should remain disabled because a value has not been placed in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type("ACO Health Solutions")
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get('.content').click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should become available, now, because a value is, now, in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')
        
        //save Steward & Developers
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({force:true})

        //validate success message
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('include.text', 'Steward and Developers Information Saved Successfully')

        //Navigate back to Measures page and verify if the Measure Name is updated
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.validateMeasureName(updatedMeasureName)

    })
})