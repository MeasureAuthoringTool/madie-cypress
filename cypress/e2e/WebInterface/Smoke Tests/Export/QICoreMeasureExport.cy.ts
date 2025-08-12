import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

const now = require('dayjs')
const url = Cypress.config('baseUrl')
const path = require('path')
const mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')
const versionNumber = '1.0.000'
let measureName = 'TestMeasure' + Date.now()
let measureNameFC = ''
let CqlLibraryName = 'TestLibrary' + Date.now()
let CqlLibraryNameFC = ''
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const measureCQLContent = MeasureCQL.stndBasicQICoreCQL
const measureCQL = MeasureCQL.zipfileExportQICore

describe('QI-Core Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    it('Validate the zip file Export is downloaded for QI-Core Measure', () => {

        //Add RAV to the Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 30000)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        // enter IN description
        cy.get(MeasureGroupPage.reportingTab).click()
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).type('extra info for the measure')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 5500)

        //Click on Risk Adjustment tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        //select a definition and enter a description for ipp
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).eq(0).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .type('Initial Population Description')
        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')


        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Add SDE to the Measure
        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //'Include in Report Type' field added when Supplemental data element is added
        cy.get(MeasureGroupPage.ippIncludeInReportTypeField).should('exist')

        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Navigate to Measures page
        cy.get('[data-testid="close-error-button"]').click()
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('#draggable-dialog-title').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('export')

        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR4.zip', { timeout: 15000 })
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QI-Core Measure', () => {

        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR4.zip', { timeout: 15000 })

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        /* 
            Verify all files exist in exported zip file.
            The previous usage of cy.readFile() for this caused me lots of problems with performance & 
            taking a very long time to process and read all the files.
            I added a plugin for cy.verifyDownload() which just checks the file name in the folder 
            instead of opening the file - much better performance.
            To check for the exact text enterred, I had to resort to a grep command - again for performance reasons.

        */

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/CQMCommon-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRCommon-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRHelpers-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/QICoreCommon-1.2.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/SupplementalDataElements-3.5.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/' + CqlLibraryName + '-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-CQMCommon-1.0.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-FHIRCommon-4.1.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-FHIRHelpers-4.1.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-QICoreCommon-1.2.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-SupplementalDataElements-3.5.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/measure-' + CqlLibraryName + '-1.0.000.json')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/measure-' + CqlLibraryName + '-1.0.000.xml')).should('exist')
    })
})

describe('QI-Core Measure Export: Validating contents of Human Readable file, before versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        measureNameFC = 'HRExport1' + Date.now()
        CqlLibraryNameFC = 'HRExport1Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent, null, false, mpStartDate, mpEndDate)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 30000)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR4.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureNameFC, CqlLibraryNameFC)
    })

    it('Verify content of a Qi Core measure HR file, before versioning', () => {

        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR4.zip', { timeout: 15000 })

        //remove the baseUrl so that we can visit a local file
        Cypress.config('baseUrl', null)
        cy.wait(1000)
        // Load the HTML file
        cy.visit('./cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR.html')
        cy.wait(1000)

        // Scrub the HTML and verify the data we are looking for
        cy.document().then((doc) => {

            const bodyText = doc.body.innerText;
            //meta details
            expect(bodyText).to.include('Metadata\nTitle\t' + measureNameFC + '\nVersion\tDraft based on 0.0.000' +
                '\nShort Name\teCQMTitle4QICore')

            expect(bodyText).to.include('CMS Consensus Based Entity Identifier\t3502\n')

            expect(bodyText).to.include('\nStatus\tdraft\nSteward (Publisher)\tSemanticBits\nDeveloper' +
                '\tAcademy of Nutrition and Dietetics\nDescription\t\n\nDescription\n\nTEST1\n\n\t\n\nTEST2\n\n\t\n\n' +
                'TEST3\n\n\n\n\n\t\n\n\t\n\nline1\n\nline2\n\nline3\n\n\n\n\nTESTING\n\n\t\n\n\t\n\n' +
                'This is another test\n\n\nPurpose\t\n\nthis is a meta purpose value\n\n\nCopyright\tUNKNOWN\n' +
                'Disclaimer\tUNKNOWN\nCitation\t\n\nText 1\n\n\nJustification\tDescription:\n\nText 3\n\n\n' +
                'Definition\tThisIsTheDefinitionTermValue:\n\nThisIsTheDefinitionDefValue\n\n\nGuidance (Usage)\t\n\n' +
                'this is a meta guidance (usage) value -- for the \'Clinical Usage\' field')

            //measure group meta data
            expect(bodyText).to.include('Measure Group (Rate) (ID: Group_1)\nSummary\t\n\ntest gD\n\n\nBasis\t' +
                'Encounter\nScoring\t[http://terminology.hl7.org/CodeSystem/measure-scoring#proportion: \'Proportion\']' +
                '\nScoring Unit\t[https://clinicaltables.nlm.nih.gov/#ml: \'ml milliLiters\']\nType\t' +
                '[http://terminology.hl7.org/CodeSystem/measure-type#outcome: \'Outcome\']\nRate Aggregation\t\n\n' +
                'test rA\n\n\nImprovement Notation\t[http://terminology.hl7.org/CodeSystem/measure-improvement-notation#increase: ' +
                '\'Increased score indicates improvement\']\nInitial Population\tID: InitialPopulation_1\nDescription:\n\n' +
                'test IP P\n\nLogic Definition: Qualifying Encounters\nDenominator\tID: Denominator_1\nDescription:\n\n' +
                'test d P\n\nLogic Definition: Qualifying Encounters\nNumerator\tID: Numerator_1\nDescription:\n\ntest n P\n\n' +
                'Logic Definition: Qualifying Encounters\nMeasure Logic\nPrimary Library\t' +
                'https://madie.cms.gov/Library/'+ CqlLibraryNameFC + '\nContents\tPopulation Criteria\n' +
                'Logic Definitions\nTerminology\nDependencies\nData Requirements')


            //Population Criteria
            expect(bodyText).to.include('Population Criteria\n' +
                'Measure Group (Rate) (ID: Group_1)\n' +
                'Initial Population\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Denominator\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Numerator\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"')

            //logic definitions
            expect(bodyText).to.include('Logic Definitions\n' +
                'Logic Definition\tLibrary Name: ' + CqlLibraryNameFC + '\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Logic Definition\tLibrary Name: FHIRHelpers\n' +
                '\n' +
                'define function ToInterval(period FHIR.Period):\n' +
                '    if period is null then\n' +
                '        null\n' +
                '    else\n' +
                '        if period."start" is null then\n' +
                '            Interval(period."start".value, period."end".value]\n' +
                '        else\n' +
                '            Interval[period."start".value, period."end".value]')

            //Terminology
            expect(bodyText).to.include('Terminology\n' +
                'Value Set\tDescription: Value set Office Visit\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                'Value Set\tDescription: Value set Annual Wellness Visit\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                'Value Set\tDescription: Value set Preventive Care Services - Established Office Visit, 18 and Up\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                'Value Set\tDescription: Value set Preventive Care Services-Initial Office Visit, 18 and Up\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                'Value Set\tDescription: Value set Home Healthcare Services\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016')

            //Dependencies
            expect(bodyText).to.include('Dependencies\n' +
                'Dependency\tDescription: QICore model information\n' +
                'Resource: http://hl7.org/fhir/Library/QICore-ModelInfo\n' +
                'Canonical URL: http://hl7.org/fhir/Library/QICore-ModelInfo\n' +
                'Dependency\tDescription: Library FHIRHelpers\n' +
                'Resource: https://madie.cms.gov/Library/FHIRHelpers|4.1.000\n' +
                'Canonical URL: https://madie.cms.gov/Library/FHIRHelpers|4.1.000')

            //Data Requirements
            expect(bodyText).to.include('Data Requirements\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\n' +
                '\n' +
                'Generated using version 0.4.8 of the sample-content-ig Liquid templates')
        })
    })
})

describe('QI-Core Measure Export: Validating contents of Human Readable file, after versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        Cypress.config('baseUrl', url)
        cy.wait(1000)

        measureNameFC = 'HRExport2' + Date.now()
        CqlLibraryNameFC = 'HRExport2Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent, null, false, mpStartDate, mpEndDate)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        // check for MAT-7961 - trim whitespace for export files
        cy.get(EditMeasurePage.abbreviatedTitleTextBox).invoke('val').then(value => {
            const whitespaceAddedName = '   ' + value + '   '
            cy.get(EditMeasurePage.abbreviatedTitleTextBox)
                .clear()
                .type(whitespaceAddedName)
        })

        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.measurementInformationSaveButton, 12500)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 30000)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get(Header.mainMadiePageButton).click()

        //version measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('#draggable-dialog-title').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v1.0.000-FHIR4.zip', { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })

    it('Verify the content of the HR file, for a Qi Core Measure, after the measure has been versioned', () => {

        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR4.zip', { timeout: 15000 })

        //remove the baseUrl so that we can visit a local file
        Cypress.config('baseUrl', null)
        cy.wait(1000)
        // Load the HTML file
        cy.visit('./cypress/downloads/eCQMTitle4QICore-v1.0.000-FHIR.html')
        cy.wait(1000)
        // Scrub the HTML and verify the data we are looking for
        cy.document().then((doc) => {

            const bodyText = doc.body.innerText;
            //meta details
            expect(bodyText).to.include('Metadata\nTitle\t' + measureNameFC + '\nVersion\t1.0.000' +
                '\nShort Name\teCQMTitle4QICore')

            expect(bodyText).to.include('CMS Consensus Based Entity Identifier\t3502\n')

            expect(bodyText).to.include('\nSteward (Publisher)\tSemanticBits\nDeveloper' +
                '\tAcademy of Nutrition and Dietetics\nDescription\t\n\nDescription\n\nTEST1\n\n\t\n\nTEST2\n\n\t\n\n' +
                'TEST3\n\n\n\n\n\t\n\n\t\n\nline1\n\nline2\n\nline3\n\n\n\n\nTESTING\n\n\t\n\n\t\n\n' +
                'This is another test\n\n\nPurpose\t\n\nthis is a meta purpose value\n\n\nCopyright\tUNKNOWN\n' +
                'Disclaimer\tUNKNOWN\nCitation\t\n\nText 1\n\n\nJustification\tDescription:\n\nText 3\n\n\n' +
                'Definition\tThisIsTheDefinitionTermValue:\n\nThisIsTheDefinitionDefValue\n\n\nGuidance (Usage)\t\n\n' +
                'this is a meta guidance (usage) value -- for the \'Clinical Usage\' field')

            //measure group meta data
            expect(bodyText).to.include('Measure Group (Rate) (ID: Group_1)\nSummary\t\n\ntest gD\n\n\nBasis\t' +
                'Encounter\nScoring\t[http://terminology.hl7.org/CodeSystem/measure-scoring#proportion: \'Proportion\']\n' +
                'Scoring Unit\t[https://clinicaltables.nlm.nih.gov/#ml: \'ml milliLiters\']\nType\t' +
                '[http://terminology.hl7.org/CodeSystem/measure-type#outcome: \'Outcome\']\nRate Aggregation\t\n\n' +
                'test rA\n\n\nImprovement Notation\t[http://terminology.hl7.org/CodeSystem/measure-improvement-notation#increase:' +
                ' \'Increased score indicates improvement\']\nInitial Population\tID: InitialPopulation_1\nDescription:\n\n' +
                'test IP P\n\nLogic Definition: Qualifying Encounters\nDenominator\tID: Denominator_1\nDescription:\n\n' +
                'test d P\n\nLogic Definition: Qualifying Encounters\nNumerator\tID: Numerator_1\nDescription:\n\n' +
                'test n P\n\nLogic Definition: Qualifying Encounters\nMeasure Logic\nPrimary Library\t' +
                'https://madie.cms.gov/Library/' + CqlLibraryNameFC + '\nContents\tPopulation Criteria\n' +
                'Logic Definitions\nTerminology\nDependencies\nData Requirements')

            //Population Criteria
            expect(bodyText).to.include('Population Criteria\n' +
                'Measure Group (Rate) (ID: Group_1)\n' +
                'Initial Population\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Denominator\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Numerator\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"')

            //logic definitions
            expect(bodyText).to.include('Logic Definitions\n' +
                'Logic Definition\tLibrary Name: ' + CqlLibraryNameFC + '\n' +
                '\n' +
                'define "Qualifying Encounters":\n' +
                '  ( [Encounter: "Office Visit"]\n' +
                '    union [Encounter: "Annual Wellness Visit"]\n' +
                '    union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
                '    union [Encounter: "Home Healthcare Services"] ) ValidEncounter\n' +
                '    where ValidEncounter.period during "Measurement Period"\n' +
                '\n' +
                'Logic Definition\tLibrary Name: FHIRHelpers\n' +
                '\n' +
                'define function ToInterval(period FHIR.Period):\n' +
                '    if period is null then\n' +
                '        null\n' +
                '    else\n' +
                '        if period."start" is null then\n' +
                '            Interval(period."start".value, period."end".value]\n' +
                '        else\n' +
                '            Interval[period."start".value, period."end".value]')

            //Terminology
            expect(bodyText).to.include('Terminology\n' +
                'Value Set\tDescription: Value set Office Visit\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                'Value Set\tDescription: Value set Annual Wellness Visit\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                'Value Set\tDescription: Value set Preventive Care Services - Established Office Visit, 18 and Up\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                'Value Set\tDescription: Value set Preventive Care Services-Initial Office Visit, 18 and Up\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                'Value Set\tDescription: Value set Home Healthcare Services\n' +
                'Resource: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\n' +
                'Canonical URL: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016')

            //Dependencies
            expect(bodyText).to.include('Dependencies\n' +
                'Dependency\tDescription: QICore model information\n' +
                'Resource: http://hl7.org/fhir/Library/QICore-ModelInfo\n' +
                'Canonical URL: http://hl7.org/fhir/Library/QICore-ModelInfo\n' +
                'Dependency\tDescription: Library FHIRHelpers\n' +
                'Resource: https://madie.cms.gov/Library/FHIRHelpers|4.1.000\n' +
                'Canonical URL: https://madie.cms.gov/Library/FHIRHelpers|4.1.000')

            //Data Requirements
            expect(bodyText).to.include('Data Requirements\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\n' +
                '\n' +
                'Data Requirement\tType: Encounter\n' +
                'Profile(s): http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter\n' +
                'Must Support Elements: type, period\n' +
                'Code Filter(s):\n' +
                'Path: type\n' +
                'ValueSet: http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\n' +
                '\n' +
                'Generated using version 0.4.8 of the sample-content-ig Liquid templates')
        })
    })
})
