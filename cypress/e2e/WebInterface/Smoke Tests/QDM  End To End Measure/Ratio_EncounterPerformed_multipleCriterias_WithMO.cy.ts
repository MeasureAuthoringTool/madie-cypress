import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage";

let measureName = 'RatioEncounterPerformedMultipleCriteriasWithMO' + Date.now()
let CqlLibraryName = 'RatioEncounterPerformedMultipleCriteriasWithMO' + Date.now()
let firstTestCaseTitle = 'Test Case'
let testCaseDescription = 'Test Case' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQL = 'library NonPatientBasedRatioMeasureWithMultipleGroupsandStratifications version \'0.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Active Bleeding": \'urn:oid:2.16.840.1.113762.1.4.1206.28\' \n' +
    'valueset "Acute Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1182.118\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer Type"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Qualifying Encounters"\n' +
    '\n' +
    'define "Qualifying Encounters":\n' +
    '  ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
    '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
    '    union ["Encounter, Performed": "Acute Inpatient"]\n' +
    '    union ["Encounter, Performed": "Active Bleeding"]\n' +
    '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
    '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
    '\n' +
    'define "Denominator":\n' +
    '  ["Encounter, Performed": "Acute Inpatient"] AcuteInpatient\n' +
    '    where AcuteInpatient.lengthOfStay > 10 days\n' +
    '\n' +
    'define "Numerator":\n' +
    '  ["Encounter, Performed": "Active Bleeding"] ActiveBleeding\n' +
    '    where ActiveBleeding.relevantPeriod overlaps day of "Measurement Period"\n' +
    '    \n' +
    'define "Denominator 2":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] EncounterInpatient\n' +
    '    where EncounterInpatient.lengthOfStay > 15 days\n' +
    '\n' +
    'define "Numerator 2":\n' +
    '  ["Encounter, Performed": "Emergency Department Visit"] EmergencyDepartmentVisit\n' +
    '    where EmergencyDepartmentVisit.lengthOfStay > 15 days\n' +
    '\n' +
    'define function "Denominator Observation"(Encounter "Encounter, Performed" ):\n' +
    '  duration in hours of Encounter.relevantPeriod\n' +
    '\n' +
    'define function "Numerator Observation"(Encounter "Encounter, Performed" ):\n' +
    '  duration in hours of Encounter.relevantPeriod\n' +
    '\n'

describe('Measure Creation: Ratio EncounterPerformed, Multiple Criterias With MO', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2024-01-01', '2024-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
    })

    after('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End Ratio EncounterPerformed, Multiple Criterias With MO', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Base Config Creation
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Count')


        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //adding second group
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator 2')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')

        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator 2')
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Count')


        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/31/2003 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Adding Element data to the test case

        //add Element
        QDMElements.addElement('encounter', 'Performed: Emergency Department Visit')

        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/09/2024 12:00 AM', '01/09/2024 08:00 AM')

        //add Code
        QDMElements.addCode('SNOMEDCT', '4525004')

        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')

        //enter quanity type
        QDMElements.enterQuantity('20', 'd')

        //add attribute to test case action
        QDMElements.addAttribute()

        //close element card
        QDMElements.closeElement()

        //Adding Element data to the test case

        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')

        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/09/2024 12:00 AM', '01/10/2024 12:00 AM')

        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')

        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')

        //enter quanity type
        QDMElements.enterQuantity('17', 'd')

        //add attribute to test case action
        QDMElements.addAttribute()

        //close element card
        QDMElements.closeElement()

        //Adding Element data to the test case

        //add Element
        QDMElements.addElement('encounter', 'Performed: Active Bleeding')

        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/09/2024 12:00 AM', '01/09/2024 02:00 AM')

        //add Code
        QDMElements.addCode('Icd10CM', 'H31.301')

        //close element card
        QDMElements.closeElement()

        //Adding Element data to the test case

        //add Element
        QDMElements.addElement('encounter', 'Performed: Acute Inpatient')

        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/09/2024 12:00 AM', '01/09/2024 04:00 AM')

        //add Code
        QDMElements.addCode('CPT', '99221')

        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')

        //enter quantity type
        QDMElements.enterQuantity('12', 'd')

        //add attribute to test case action
        QDMElements.addAttribute()

        //Add Expected values for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).type('4')
        cy.get(TestCasesPage.testCaseDENOMExpected).eq(0).type('1')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('4')
        cy.get(TestCasesPage.testCaseNUMERExpected).eq(0).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).clear().type('2')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).type('4')
        cy.get(TestCasesPage.testCaseDENOMExpected).eq(1).type('1')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('24')
        cy.get(TestCasesPage.testCaseNUMERExpected).eq(1).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).clear().type('8')

        //run test case on edit test case page
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')
        cy.get(TestCasesPage.measureGroup2Label).should('have.color', '#4d7e23')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Execute Test case on Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')

        cy.get('button:contains("Population Criteria 2")').click()

        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')

    })
})
