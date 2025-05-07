import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Global } from "../../../../Shared/Global"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('QDM Measure Set', () => {

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

    it('Add QDM Measure Set', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).type('Measure Set')
        cy.get(EditMeasurePage.measureSetSaveBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Measure Set Information Saved Successfully')
        cy.get(EditMeasurePage.measureSetText).should('contain.text', 'Measure Set')

    })

    it('Discard changes button', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Measure set page
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).type('Measure Set')
        cy.get(Global.DiscardCancelBtn).click()
        Global.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureSetText).should('be.empty')
    })
})

describe('QDM Measure Set - ownership validations', () => {

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

    it('Non Measure owner unable to add Measure Set', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to Measure set page
        cy.get(EditMeasurePage.leftPanelMeasureSet).click()
        cy.get(EditMeasurePage.measureSetText).should('have.attr', 'readonly', 'readonly')

    })
})