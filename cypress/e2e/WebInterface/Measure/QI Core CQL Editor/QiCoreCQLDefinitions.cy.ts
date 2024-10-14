import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage";
import {Global} from "../../../../Shared/Global";

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreTestLibrary' + Date.now()
let measureCQL = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n' +
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
describe.skip('Qi-Core CQL Definitions', () => {

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
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression Editor Name dropdown should contain Definition Names
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'Initial Population')

        //Expression Editor Name dropdown should also contain Included Library name.Definition name
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'SupplementalData.SDE Ethnicity')

    })

    it('Search for Qi-Core CQL Definitions Expression Editor Fluent Function Options', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.fluentFunctionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression Editor Name dropdown should contain Fluent Functions
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'isFinishedEncounter()')

        //Expression Editor Name dropdown should also contain Fluent functions from Included Library
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'abatementInterval()')

    })

    it('Insert Qi-Core CQL Definitions through Expression Editor and Apply to CQL editor', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()

        //Type=Parameters
        cy.get(CQLEditorPage.parametersOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Measurement Period').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Measurement Period')

        //Type=Definitions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Initial Population').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Initial Population')

        //Type=Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.functionsOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('CQMCommon.Emergency Department Arrival Time()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'CQMCommon."Emergency Department Arrival Time"()')

        //Type=Fluent Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.fluentFunctionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('emergencyDepartmentArrivalTime()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', '"emergencyDepartmentArrivalTime"()')

        //Type=Timing
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.timingOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('after end').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'after end')

        //Type=Pre-Defined Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.preDefinedFunctionsOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('AgeInDays()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'AgeInDays()')

        CQLEditorPage.applyDefinition()

        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).type('{pageDown}')

        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'define "Test":')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'CQMCommon."Measurement Period"')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', '"Initial Population"')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'CQMCommon."Emergency Department Arrival Time"()')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', '"emergencyDepartmentArrivalTime"()')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'after end')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'AgeInDays()')

    })

    it('Verify Included Qi-Core CQL Definitions under Saved Definitions tab', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible('[data-testid="definitions-row-0"] > :nth-child(1)', 60000)
        cy.get('[data-testid="definitions-row-0"] > :nth-child(1)').should('contain.text', 'Initial Population')
        cy.get('[data-testid="definitions-row-1"] > :nth-child(1)').should('contain.text', 'Qualifying Encounters')
    })

    it('Edit Saved Qi-Core CQL Definitions', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.editCQLDefinitions).click()

        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Initial Population').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Initial Population')
        //Save
        cy.get(CQLEditorPage.saveDefinitionBtn).click()

    })

    it('Dirty check pops up when there are changes in CQL and Edit CQL definition button is clicked', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Make changes to CQL editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')

        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.editCQLDefinitions).click()

        //Click on Discard changes
        Global.clickOnDiscardChanges()
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).should('be.visible')
    })

    it('Delete saved Qi-Core CQL Definitions', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.deleteCQLDefinitions).click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()
        Utilities.waitForElementVisible('[class="toast success"]', 60000)
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text','Definition Initial Population has been successfully removed from the CQL.')

        //Navigate to Saved Definitions again and assert if the Definition is removed from Saved Definitions
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteCQLDefinitions, 60000)
        cy.get('.right-panel > .panel-content').should('not.contain', 'Initial Population')
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
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

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

//Skipping until feature flag is removed
describe.skip('Qi-Core CQL Definitions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.AltLogin()

    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify Non Measure owner unable to Edit/Delete saved Definitions', () => {

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('view')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()

        //Edit button should not be visible
        Utilities.waitForElementVisible('[data-testid="definitions-row-0"] > :nth-child(1)', 60000)
        cy.get(CQLEditorPage.editCQLDefinitions).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteCQLDefinitions).should('not.exist')

    })
})
