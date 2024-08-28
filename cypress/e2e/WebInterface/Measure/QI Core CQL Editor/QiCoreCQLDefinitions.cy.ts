import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreTestLibrary' + Date.now()
let measureCQL = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    ' default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    ' context Patient\n' +
    ' define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n' +
    '   define "Qualifying Encounters":\n' +
    '      (\n' +
    '          [Encounter: "Office Visit"]\n' +
    '                   union [Encounter: "Annual Wellness Visit"]\n' +
    '                            union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '                                     union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '                                              union [Encounter: "Home Healthcare Services"]\n' +
    '                                               ) ValidEncounter\n' +
    '                                                       where ValidEncounter.period during "Measurement Period"\n' +
    '                                                                 and ValidEncounter.isFinishedEncounter()\n' +
    '          \n' +
    '                                                                 \n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '  (Enc E where E.status = \'finished\') is not null '

let measureCQL_withError = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    ' default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    ' context Patient\n' +
    ' define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n' +
    '   define "Qualifying Encounters":\n' +
    '      (\n' +
    '          [Encounter: "Office Visit"]\n' +
    '                   union [Encounter: "Annual Wellness Visit"]\n' +
    '                            union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '                                     union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '                                              union [Encounter: "Home Healthcare Services"]\n' +
    '                                               ) ValidEncounter\n' +
    '                                                       where ValidEncounter.period during "Measurement Period"\n' +
    '                                                                 and ValidEncounter.isFinishedEncounter()test\n' +
    '          \n' +
    '                                                                 \n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '  (Enc E where E.status = \'finished\') is not null'

//Skipping until feature flag is removed
describe.skip('Qi-Core CQL Definitions - Expression Editor Name Options', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for Qi-Core CQL Definitions Expression Editor Name Options', () => {


        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression Editor Name dropdown should contain Definition Names
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'Initial Population')

        //Expression Editor Name dropdown should also contain Included Library name.Definition name
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'SupplementalData.SDE Ethnicity')

    })
})

//Skipping until feature flag is removed
describe.skip('Qi-Core CQL Definitions - Expression Editor Name Option Validations', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL_withError)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Qi-Core CQL Definitions Expression editor Name options are not available when CQL has errors', () => {


        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression editor name dropdown should be empty when there are CQL errors
        cy.get('.MuiAutocomplete-noOptions').should('contain.text', 'No options')
    })
})


