import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('QDM Measure Definition', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'QDMDefTerms' + Date.now() + randValue
        newCqlLibraryName = 'QDMDefTermsLib' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Add QDM Measure Definitions', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInput).type('Measure Definition')
        cy.get(EditMeasurePage.saveMeasureDefinition).click()
        cy.get(EditMeasurePage.successMessage, { timeout: 11500 }).should('contain.text', 'Measure Definition Information Saved Successfully')
    })

    it('Discard changes button', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.definitionInput).type('Measure Definition')
        cy.get(Utilities.DiscardButton).click()
        Utilities.clickOnDiscardChanges()
    })
})

describe('QDM Measure Definition ownership validation', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'QDMDefTermsAltUser' + Date.now() + randValue
        newCqlLibraryName = 'QDMDefTermsAltUserLib' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Non Measure owner unable to add Measure Definition', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get('[data-testid="genericField-value"]').should('contain.text', '-')
    })
})

