import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let altMeasureName = ''
let altCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'

const measureData: CreateMeasureOptions = {}

describe('Measure Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue

        cy.clearCookies()
        cy.clearLocalStorage()
        // OktaLogin.AltLogin()
        cy.setAccessTokenCookieALT()

        measureData.ecqmTitle = altMeasureName
        measureData.cqlLibraryName = altCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL
        measureData.altUser = true

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(altMeasureName, altCqlLibraryName, false, true)

    })

    it('Fields on Population criteria page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 70000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 70000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.ucumScoringUnitSelect).should('not.be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('not.be.enabled')

        //Navigate to Supplemental data elements tab
        cy.get(MeasureGroupPage.QDMSupplementalDataElementsTab).click()
        cy.get(MeasureGroupPage.QDMSupplementalDataDefinitionTextBox).should('not.be.enabled')
        cy.get(MeasureGroupPage.QDMSupplementalDataDescriptionTextBox).should('not.be.enabled')

        //Navigate to Risk Adjustment Variables tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.QDMRiskAdjustmentDefinitionTextBox).should('not.be.enabled')
        cy.get(MeasureGroupPage.QDMRiskAdjustmentDescriptionTextBox).should('not.be.enabled')

        //Navigate to Reporting tab
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('not.be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('not.be.enabled')

    })
})
