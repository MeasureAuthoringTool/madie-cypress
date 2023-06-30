import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Header } from "../../../../../Shared/Header"

let measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let measureCQL = MeasureCQL.QDMRatioCQL_with_MOs
let scoringValue = 'Ratio'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.QDMTestCaseJson

describe('Measure Creation: Ratio ListQDMPositiveEncounterPerformed with MO', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, scoringValue, false, measureCQL, false, false,
            '2023-01-01', '2024-01-01')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.qdmType).click().type('Outcome').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        //click on the save button and confirm save success message
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')
        OktaLogin.Logout()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case expected / actual measure observation field aligns with what has been entered in the population criteria and other appropirate fields and sections', () => {

        //navigate to the main measures page and edit the measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //fill out group details
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(2).click()
        cy.get(MeasureGroupPage.denominatorSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(2).click()
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(4).click()
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionDropdownList).eq(1).click()
        cy.get(MeasureGroupPage.denominatorExclusionSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(2).click()
        cy.get(MeasureGroupPage.numeratorSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(2).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(4).click()
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionDropdownList).eq(1).click()
        cy.get(MeasureGroupPage.numeratorExclusionSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(2).click()

        //save group details
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirm details were saved
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //click on the Expected / Actual tab
        cy.get(TestCasesPage.expectedOrActualTab).click()

        //enter 3 for the expected denominator to generate 3 observation field
        cy.get(TestCasesPage.testCaseDENOMExpected).type('3')
        cy.get(TestCasesPage.denom0Observation).should('be.visible')
        cy.get(TestCasesPage.denom1Observation).should('be.visible')
        cy.get(TestCasesPage.denom2Observation).should('be.visible')

        //if one is entered in the denominator exclusion field then one of the denominator observation fields will be removed
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')
        cy.get(TestCasesPage.denom2Observation).should('not.exist')

        //enter 3 for the expected denominator to generate 3 observation field
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')
        cy.get(TestCasesPage.numer0Observation).should('be.visible')
        cy.get(TestCasesPage.numer1Observation).should('be.visible')
        cy.get(TestCasesPage.numer2Observation).should('be.visible')

        //if one is entered in the numerator exclusion field then one of the numerator observation fields will be removed
        cy.get(TestCasesPage.testCaseNUMEXExpected).type('1')
        cy.get(TestCasesPage.numer2Observation).should('not.exist')
    })
})
