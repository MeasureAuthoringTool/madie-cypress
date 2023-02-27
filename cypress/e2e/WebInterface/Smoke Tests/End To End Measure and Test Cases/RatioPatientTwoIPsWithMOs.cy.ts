import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'RatioPatientTwoIPsWithMOs' + Date.now()
let CqlLibraryName = 'RatioPatientTwoIPsWithMOs' + Date.now()
let testCaseTitleIpp1Pass = 'IPP1 PASS'
let testCaseTitleMOFail = 'MO Fail'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioPatientTwoIPsWithMOs_PASS
let measureCQL = 'library MultipleIPwithObs version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2023-01-01T00:00:00.0, @2024-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define "Initial Population":\n' +
    'exists "Qualifying Encounters"\n' +
    '\n' +
    'define "IPP2":\n' +
    'exists "Qualifying Completed Encounters"\n' +
    '\n' +
    'define "Denominator":\n' +
    '"Initial Population"\n' +
    '\n' +
    'define "Numerator":\n' +
    '"IPP2"\n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    '\n' +
    'define "Qualifying Completed Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.status = \'finished\'\n' +
    '\n' +
    '\n' +
    'define function "MObsAge"():\n' +
    'CalculateAgeInYearsAt(Patient.birthDate, date from start of "Measurement Period")\n' +
    '\n' +
    'define function "MOFemale"():\n' +
    'Patient.gender = \'female\'\n' +
    '\n' +
    'define function "MOMale"():\n' +
    'Patient.gender = \'male\''

//Skipping until link for adding Second Initial Population is fixed, as part of MAT-5373
describe.skip('Measure Creation and Testing: Ratio Patient Two IPs w/ MOs', () => {

    before('Create Measure and Test Case', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2024-01-01')

        //create test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitleIpp1Pass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

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
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Ratio')

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.firstInitialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'IPP2')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'MObsAge')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Average')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'MOFemale')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Count')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        OktaLogin.Logout()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End Ratio Patient Two IPs w/ MOs Pass Result', () => {

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check().should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).click()
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).clear().type('44')

        cy.get(TestCasesPage.numeratorObservationRow).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).clear().type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
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

    it('End to End Ratio Patient Two IPs w/ MOs, MO fail Result', () => {

        TestCasesPage.CreateTestCaseAPI(testCaseTitleMOFail, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check().should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).click()
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).clear().type('33')

        cy.get(TestCasesPage.numeratorObservationRow).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).clear().type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#ae1c1c')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')

    })

})
