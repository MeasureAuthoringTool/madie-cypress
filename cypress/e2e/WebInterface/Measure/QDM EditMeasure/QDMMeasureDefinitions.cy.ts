import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Global } from "../../../../Shared/Global"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('QDM Measure Definition', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Add QDM Measure Definitions', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(EditMeasurePage.saveMeasureDefinition).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Definition Information Saved Successfully')

    })

    it('Discard changes button', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).type('Measure Definition')
        cy.get(Global.DiscardCancelBtn).click()
        Global.clickOnDiscardChanges()

    })
})

describe('QDM Measure Definition ownership validation', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.AltLogin()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Non Measure owner unable to add Measure Definition', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInputTextbox).should('have.attr', 'readonly')

    })
})

