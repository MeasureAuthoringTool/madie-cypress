import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let altMeasureName = ''
let altCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'


describe('Measure Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(altMeasureName, altCqlLibraryName, measureScoring, true,measureCQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        //Skipping until QDM Test Case feature flag is removed
        //TestCasesPage.CreateQDMTestCaseAPI(TCTitle, TCSeries, TCDescription, '', false, true)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(altMeasureName, altCqlLibraryName, false, true)

    })

    it('Fields on Population criteria page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

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

    //Skipping until QDM Test Case feature flag is removed
    it.skip('Fields on Test Case page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()


        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).should('be.disabled')
        cy.get(TestCasesPage.QDMRace).should('not.be.enabled')
        cy.get(TestCasesPage.QDMGender).should('not.be.enabled')
        cy.get(TestCasesPage.QDMEthnicity).should('not.be.enabled')

        //Navigate to Details tab
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('not.be.enabled')

        //Navigate to Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.enabled')

    })
})
