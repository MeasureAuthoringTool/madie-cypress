import {CreateMATMeasurePage} from "../../../Shared/CreateMATMeasurePage"

describe('MAT to MADiE Measure transfer', () => {

    let measureName = 'CreateFhirContinuousVariableMeasure' + Date.now()

    it('Successful Measure Transfer from MAT to MADiE', () => {

        //Login to MAT
        CreateMATMeasurePage.MATLogin()

        //Create FHIR Measure
        cy.get(CreateMATMeasurePage.newMeasureButton).click()
        cy.get(CreateMATMeasurePage.measureName).type(measureName, { delay: 50 })
        cy.get(CreateMATMeasurePage.modelradioFHIR).click()
        cy.get(CreateMATMeasurePage.cqlLibraryName).type(measureName, { delay: 50 })
        cy.get(CreateMATMeasurePage.shortName).type(measureName, { delay: 50 })
        cy.get(CreateMATMeasurePage.measureScoringListBox).select('Continuous Variable')
        cy.get(CreateMATMeasurePage.patientBasedMeasureListBox).select('No')

        cy.get(CreateMATMeasurePage.saveAndContinueBtn).click()

        cy.get(CreateMATMeasurePage.confirmationContinueBtn).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        //select population basis
        cy.get(CreateMATMeasurePage.populationBasisListbox).select('Encounter')
        cy.get(CreateMATMeasurePage.saveBtn).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        //entering required meta data
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureStewardDeveloper, 5000)
        cy.get(CreateMATMeasurePage.measureStewardDeveloper).click()
        cy.get(CreateMATMeasurePage.measureStewardListBox).select('SemanticBits')
        cy.get(CreateMATMeasurePage.row1CheckBox).click()
        cy.get(CreateMATMeasurePage.saveBtn).click()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureDetailsWarningMessage, 5000)

        cy.get(CreateMATMeasurePage.description).click()
        CreateMATMeasurePage.enterText(CreateMATMeasurePage.textAreaInput, 'description')
        cy.get(CreateMATMeasurePage.saveBtn).click()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureDetailsWarningMessage, 5000)

        cy.get(CreateMATMeasurePage.measureType).click()
        cy.get(CreateMATMeasurePage.row1CheckBox).click()
        cy.get(CreateMATMeasurePage.saveBtn).click()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureDetailsWarningMessage, 5000)

        cy.get(CreateMATMeasurePage.cqlWorkspace).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleGeneralInformation, 'General Information', 100)

        //Includes

        cy.get(CreateMATMeasurePage.includes).click()

        cy.get(CreateMATMeasurePage.includesListItems).its('length').should('equal', 3)

        cy.get(CreateMATMeasurePage.includesListItems).eq(0).should('contain.text', 'FHIRHelpers')
        cy.get(CreateMATMeasurePage.includesListItems).eq(1).should('contain.text', 'Global')
        cy.get(CreateMATMeasurePage.includesListItems).eq(2).should('contain.text', 'SDE')

        cy.get(CreateMATMeasurePage.measureComposerSearchInputBox).type('TJCOverallFHIR4', { delay: 50 })
        cy.get(CreateMATMeasurePage.cqlLibrarysearchBtn).click()
        cy.get(CreateMATMeasurePage.availableLibrariesRow1checkbox).click()
        cy.get(CreateMATMeasurePage.libraryAliasInputBox).type('TJC', { delay: 50 })
        cy.get(CreateMATMeasurePage.saveIncludes).click()

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 5000)

        //Value Sets

        cy.get(CreateMATMeasurePage.valueSets).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.addValueSet('2.16.840.1.113883.3.666.5.307')
        CreateMATMeasurePage.addValueSet('2.16.840.1.113762.1.4.1182.118')
        CreateMATMeasurePage.addValueSet('2.16.840.1.113762.1.4.1111.161')

        // Codes

        cy.get(CreateMATMeasurePage.codes).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.addCode('CODE:/CodeSystem/LOINC/Version/2.46/Code/21112-8/Info')
        CreateMATMeasurePage.addCode('CODE:/CodeSystem/SNOMEDCT/Version/2016-03/Code/419099009/Info')
        CreateMATMeasurePage.addCode('CODE:/CodeSystem/SNOMEDCT/Version/2017-09/Code/371828006/Info')

        // Definition

        cy.get(CreateMATMeasurePage.definition).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.addDefinition('Initial Population', 'TJC."Non Elective Inpatient Encounter"')
        CreateMATMeasurePage.addDefinition('Measure Population', '"Initial Population"')

        // Function

        cy.get(CreateMATMeasurePage.functionMeasureComposer).click()

        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleGlobal2, 'Function', 100)

        cy.get(CreateMATMeasurePage.addNewBtn).click()
        cy.get(CreateMATMeasurePage.functionNameInput).type('Arrival and Departure Time', { delay: 50 })
        cy.get(CreateMATMeasurePage.addArgument).click()
        CreateMATMeasurePage.enterText(CreateMATMeasurePage.argumentNameInput, 'Encounter')
        cy.get(CreateMATMeasurePage.availableDatatypesListBox).select('FHIR Datatype')
        cy.get(CreateMATMeasurePage.selectQDMDatatypeObject).select('Encounter')
        cy.get(CreateMATMeasurePage.addBtn).click()
        cy.get(CreateMATMeasurePage.functionCQLExpressionEditorInput).type('23', { delay: 50 })
        cy.get(CreateMATMeasurePage.functionSaveBtn).click()

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 5000)

        //CQL Library Editor

        cy.get(CreateMATMeasurePage.cqlLibraryEditor).click()

        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleCQLLibraryEditor, 'CQL Library Editor', 100)

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 5000)
        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.measureComposerwarningMessage, 'You are viewing CQL with no validation errors.', 100)

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        // Population Workspace

        cy.get(CreateMATMeasurePage.populationWorkspace).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        // Initial Population
        cy.get(CreateMATMeasurePage.initialPopulation).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        cy.get(CreateMATMeasurePage.initialPopulationDefinitionListBox).select('Initial Population')
        cy.get(CreateMATMeasurePage.initialPopulationSaveBtn).click()

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.measureComposerwarningMessage, 'Changes to Initial Populations have been successfully saved.', 100)

        // Measure Population
        cy.get(CreateMATMeasurePage.measurePopulations).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        cy.get(CreateMATMeasurePage.measurePopulationsDefinitionListBox).select('Measure Population')
        cy.get(CreateMATMeasurePage.measurePopulationsSaveBtn).click()

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.measureComposerwarningMessage, 'Changes to Measure Populations have been successfully saved.', 100)

        // Measure Observation
        cy.get(CreateMATMeasurePage.measureObservations).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        cy.get(CreateMATMeasurePage.measureObservationsAggregateFunctionListBox).select('Count')
        cy.get(CreateMATMeasurePage.measureObservationsFunctionListBox).select('Arrival and Departure Time')
        cy.get(CreateMATMeasurePage.measureObservationsSaveBtn).click()

        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.measureComposerwarningMessage, 'Changes to Measure Observations have been successfully saved.', 100)

        //navigate to Measure Packager
        cy.get(CreateMATMeasurePage.measurePackager).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        //verifying the the Population Workspace data is viewable in the Populations list in Measure Packager
        cy.get(CreateMATMeasurePage.populationsListItems).its('length').should('equal', 3)

        cy.get(CreateMATMeasurePage.populationsListItems).eq(0).should('contain.text', 'Initial Population 1')
        cy.get(CreateMATMeasurePage.populationsListItems).eq(1).should('contain.text', 'Measure Population')
        cy.get(CreateMATMeasurePage.populationsListItems).eq(2).should('contain.text', 'Measure Observation')

        // Package Grouping
        cy.get(CreateMATMeasurePage.addAllItemsToGrouping).click()
        cy.get(CreateMATMeasurePage.saveGrouping).click()

        cy.get(CreateMATMeasurePage.measureGroupingTable).should('contain.text', 'Measure Grouping 1')

        // Create Measure Package
        cy.get(CreateMATMeasurePage.createMeasurePackageBtn).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.waitToContainText(CreateMATMeasurePage.packageWarningMessage, 'Measure packaged successfully. Please access the Measure Library to export the measure.', 60000)

        cy.get(CreateMATMeasurePage.measureLibraryTab).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.enabledWithTimeout(CreateMATMeasurePage.searchInputBox, 100)
        cy.get(CreateMATMeasurePage.searchInputBox).type(measureName)

        cy.get(CreateMATMeasurePage.searchBtn).click()

        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()

        cy.get(CreateMATMeasurePage.selectMeasureCheckbox).click()
        cy.get(CreateMATMeasurePage.exportMeasureSearchBtn).click()
        cy.get(CreateMATMeasurePage.exportMeasureSearchBtn).click()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.transferToMadieRadioBtn).click()
        CreateMATMeasurePage.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.openExportBtn).click()
        cy.get(CreateMATMeasurePage.measureTransferSuccessMsg).should('contain.text', ' Measure is being processed and transferred to MADiE. A message will be sent to the e-mail associated with this account once the transfer has completed.')

        //Logout from MAT
        CreateMATMeasurePage.MATLogout()
    })
})



