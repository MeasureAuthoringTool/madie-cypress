import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"

let measureName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
let CqlLibraryName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
let testCaseTitlePass = 'MO PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioEpisodeTwoIPsWithMOs_PASS
let measureCQL = QiCore4Cql.ratioEpisodeTwoIPTwoMO

describe('Measure Creation and Testing: Ratio Episode Two IPs w/ MOs', () => {

    before('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2022-01-01', '2022-12-31')

        TestCasesPage.CreateTestCaseAPI(testCaseTitlePass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.populationSelect(MeasureGroupPage.firstInitialPopulationSelect, 'Initial Population 1')
        Utilities.populationSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population 2')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get('[data-value="Denominator Observation"]').click()
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get('[data-value="Numerator Observation"]').click()
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Ratio Episode Two IPs w/ MOs Pass Result', () => {

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).clear().type('2')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).clear().type('2')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).clear().type('2')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('1')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('1')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).clear().type('2')

        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).scrollIntoView()
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).clear().type('1')

        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).clear().type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
