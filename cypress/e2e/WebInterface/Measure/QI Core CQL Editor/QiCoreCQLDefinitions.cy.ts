import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage";
import { Global } from "../../../../Shared/Global";

const now = Date.now()
const measureName = 'QiCoreDefinitions' + now
const CqlLibraryName = 'QiCoreDefinitionsLib' + now
const measureCQL = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    '//Test Comments\n' +
    'define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n\n' +
    'define "Qualifying Encounters":\n' +
    '   (\n[Encounter: "Office Visit"]\n' +
    '   union [Encounter: "Annual Wellness Visit"]\n' +
    '   union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Home Healthcare Services"]\n' +
    '   ) ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()\n\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '   (Enc E where E.status = \'finished\') is not null '

const measureCQL_withError = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '   default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n' +
    'define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n\n' +
    'define "Qualifying Encounters":\n' +
    '   (\n[Encounter: "Office Visit"]\n' +
    '   union [Encounter: "Annual Wellness Visit"]\n' +
    '   union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Home Healthcare Services"]\n' +
    '   ) ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()test\n\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '   (Enc E where E.status = \'finished\') is not null'

const cqlMissingDefinitionName = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define :\n' +
    '   true\n' +
    'define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n\n' +
    'define "Qualifying Encounters":\n' +
    '   (\n[Encounter: "Office Visit"]\n' +
    '   union [Encounter: "Annual Wellness Visit"]\n' +
    '   union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Home Healthcare Services"]\n' +
    '   ) ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()\n\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '   (Enc E where E.status = \'finished\') is not null '

const cqlDefinitionNameKeyword = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define exists:\n' +
    '   true\n' +
    'define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n\n' +
    'define "Qualifying Encounters":\n' +
    '   (\n[Encounter: "Office Visit"]\n' +
    '   union [Encounter: "Annual Wellness Visit"]\n' +
    '   union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '   union [Encounter: "Home Healthcare Services"]\n' +
    '   ) ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()\n\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '   (Enc E where E.status = \'finished\') is not null '

describe('Qi-Core CQL Definitions Builder', () => {

    beforeEach('Create Measure and Login', () => {

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
        cy.get('[data-testid="definitions-row-0"] > :nth-child(2)').should('contain.text', 'Boolean')

        cy.get('[data-testid="definitions-row-1"] > :nth-child(1)').should('contain.text', 'Qualifying Encounters')
        cy.get('[data-testid="definitions-row-1"] > :nth-child(2)').should('contain.text', 'Encounter')
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

        //Return type populated for Saved Definitions
        cy.get('[data-testid="return-type"]').should('contain.text', 'Return TypeBoolean')

        //Edit Definition name
        cy.get(CQLEditorPage.definitionNameTextBox).type(' updated')

        cy.get(CQLEditorPage.saveDefinitionBtn).click()

        cy.get('.ace_content').should('contain', 'Initial Population updated')
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
        cy.get(CQLEditorPage.deleteContinueButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 60000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Definition Initial Population has been successfully removed from the CQL.')

        //Navigate to Saved Definitions again and assert if the Definition is removed from Saved Definitions
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteCQLDefinitions, 60000)

        // confirm entry for IP has been removed
        cy.get(CQLEditorPage.savedDefinitionsTable).should('not.contain', 'Initial Population')
    })

    it('View and Edit Qi Core CQL Definition Comments from Saved Definitions tab', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()

        //Verify Comment
        cy.get('[data-testid="definitions-row-0"] > :nth-child(3)').should('contain.text', 'Test Comments')

        const longComment = 'Adding a comment that is needlessly long for no real reason, other than to' +
            ' annoy any future users of this piece of functionality. It really should not have to be like' +
            ' this but here we are anyway'
        //Edit Comment
        cy.get(CQLEditorPage.editCQLDefinitions).click()
        cy.get(CQLEditorPage.commentTextBox).clear().type(longComment)
        //Save
        cy.get(CQLEditorPage.saveDefinitionBtn).click()

        //Verify Updated Comment
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab and verify comment
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        const shortenedComment = 'Adding a comment that is needlessly long for no real reason, other than to' +
            ' annoy any future users of this piece of functShow more'
        cy.get('[data-testid="definitions-row-0"] > :nth-child(3)').should('contain.text', shortenedComment)
    })

    it('Verify error message appears on Definitions tab when there is an error in the Measure CQL', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Definitions tab and verify no error message appears
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Definitions tab and verify saved definitions appear
        cy.get(CQLEditorPage.savedDefinitionsTab).should('contain.text', 'Saved Definitions (2)')

        //Add errors to CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}define "test":')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Navigate to Definitions tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).should('contain.text', 'Saved Definitions (0)').click()
        cy.get('[class="Definitions___StyledTd-sc-cj02bv-0 kITigf"]').should('contain.text', 'No Results were found')
    })
})

describe('Qi-Core CQL Definitions - Expression Editor Name Option Validations', () => {

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    // skipping for now: open bug https://jira.cms.gov/browse/MAT-8114 affcting this scenario
    it.skip('Qi-Core CQL Definitions Expression editor Name options are not available when CQL has errors', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL_withError)
        OktaLogin.Login()

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

    it('Qi-Core CQL Definitions throws specific error when Definition has no name', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, cqlMissingDefinitionName)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "Parse: 7:8 | Definition is missing a name.")
    })

    it('Qi-Core CQL Definitions throws specific error when Definition name is a reserved keyword', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, cqlDefinitionNameKeyword)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "Parse: 7:13 | Definition names must not be a reserved word.")
    })

})

describe('Qi-Core CQL Definitions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

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

        Utilities.waitForElementVisible('[data-testid="definitions-row-0"] > :nth-child(1)', 60000)
        // "return type" is visible"
        cy.get('[data-testid="definitions-row-0"] > :nth-child(2)').should('contain.text', 'Boolean')

        //Edit button should not be visible
        cy.get(CQLEditorPage.editCQLDefinitions).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteCQLDefinitions).should('not.exist')

        // click into View screen
        cy.get('[data-testid="view-button-0"]').click()

        cy.get(CQLEditorPage.definitionNameTextBox).should('be.disabled')
        // sub element of type combo-box
        cy.get('[data-testid="type-selector-input"]').should('be.disabled')
        cy.get(CQLEditorPage.expressionInsertBtn).should('be.disabled')
        cy.get('[data-testid="cancel-definition-btn"]').should('be.enabled')
    })
})
