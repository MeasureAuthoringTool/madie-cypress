import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

// variables for Human Readable file detail file comparison
const groupScoringSection = 'cypress/fixtures/QiCoreHRCompare/GroupScoringAndPCSections.html'
const qualifyingEncountersSection = 'cypress/fixtures/QiCoreHRCompare/QualifyingEncountersSection.html'
const terminologySection = 'cypress/fixtures/QiCoreHRCompare/TerminologyAndOtherDependenciesSections.html'
const versionSection = 'cypress/fixtures/QiCoreHRCompare/VersionSection.html'
const versionSectionVer1 = 'cypress/fixtures/QiCoreHRCompare/VersionSection_ver1.html'
const stylesSection = 'cypress/fixtures/QiCoreHRCompare/LiquidStyleSection.html'

/*
commenting all these out - and moved into folder /fixtures/QiCoreHQMFCompare
names are preserved
variables for HQMF file detail file comparison
let baseXMLFileVersionSection = 'cypress/fixtures/QICoreHQMFCompareFile_VersionSection.xml'
let baseXMLFileVersionSection_ver1 = 'cypress/fixtures/QICoreHQMFCompareFile_VersionSection_ver1.xml'
let baseXMLFileShortNameIdentifierSection = 'cypress/fixtures/QICoreHQMFCompareFile_ShortNameIdentifierSection.xml'
let baseXMLFileStatusMetaFieldsSection = 'cypress/fixtures/QICoreHQMFCompareFile_StatusMetaFieldsSection.xml'
let baseXMLFileTerminologyDependenciesSection = 'cypress/fixtures/QICoreHQMFCompareFile_Terminology_and_Other_DependenciesSection.xml'
let baseXMLFileMetaCQLSection = 'cypress/fixtures/QICoreHQMFCompareFile_MetaCQLSection.xml'
let baseXMLFileGroup_scoring_and_PCSection = 'cypress/fixtures/QICoreHQMFCompareFile_Group_scoring_and_PCSection.xml'
let baseXMLFileQualifyingEncountersFirstSection = 'cypress/fixtures/QICoreHQMFCompareFile_QualifyingEncountersFirstSection.xml'
let baseXMLFileShortNameDetailsSection = 'cypress/fixtures/QICoreHQMFCompareFile_ShortNameDetailsSection.xml'
let baseXMLFileAdditionalMetaDetailsSection = 'cypress/fixtures/QICoreHQMFCompareFile_AdditionalMetaDetailsSection.xml'
let baseXMLFileAdditionalPCDetailsSection = 'cypress/fixtures/QICoreHQMFCompareFile_AdditionalPCDetailsSection.xml'
let baseXMLFileRelatedArtifactsValuesetsSection = 'cypress/fixtures/QICoreHQMFCompareFile_RelatedArtifacts_and_ValuesetsSection.xml'
let baseXMLFileAdditionalValuesetSection = 'cypress/fixtures/QICoreHQMFCompareFile_AdditionalValuesetSection.xml'
let baseXMLFileAdditionalCQLSection = 'cypress/fixtures/QICoreHQMFCompareFile_AdditionalCQLSection.xml'
let baseXMLFileResourceSection = 'cypress/fixtures/QICoreHQMFCompareFile_ResourceSection.xml'
let baseXMLFileQualifyingEncountersSection = 'cypress/fixtures/QICoreHQMFCompareFile_Qualifying_Encounters.xml'
*/

let exported = ''
let expected = ''

let versionNumber = '1.0.000'
let measureName = 'TestMeasure' + Date.now()
let measureNameFC = ''
let CqlLibraryName = 'TestLibrary' + Date.now()
let CqlLibraryNameFC = ''
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let measureCQLContent = MeasureCQL.stndBasicQICoreCQL
let measureCQL = 'library TestLibrary1678378360032 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon \n' +
    'include FHIRCommon version \'4.1.000\' called FHIRCommon\n' +
    '\n' + '\n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
    '\n' + '\n' + '\n' +
    'valueset "Care Services in Long-Term Residential Facility": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1014\' \n' +
    'valueset "Diabetic Retinopathy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.327\' \n' +
    'valueset "Level of Severity of Retinopathy Findings": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1283\' \n' +
    'valueset "Macular Edema Findings Present": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1320\' \n' +
    'valueset "Macular Exam": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1251\' \n' +
    'valueset "Medical Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1007\' \n' +
    'valueset "Nursing Facility Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1012\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Ophthalmological Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1285\' \n' +
    'valueset "Patient Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1008\' \n' +
    '\n' +
    'code "Healthcare professional (occupation)": \'223366009\' from "SNOMEDCT" display \'Healthcare professional (occupation)\'\n' +
    'code "Medical practitioner (occupation)": \'158965000\' from "SNOMEDCT" display \'Medical practitioner (occupation)\'\n' +
    'code "Ophthalmologist (occupation)": \'422234006\' from "SNOMEDCT" display \'Ophthalmologist (occupation)\'\n' +
    'code "Optometrist (occupation)": \'28229004\' from "SNOMEDCT" display \'Optometrist (occupation)\'\n' +
    'code "Physician (occupation)": \'309343006\' from "SNOMEDCT" display \'Physician (occupation)\'\n' +
    'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
    'code "Macular edema absent (situation)": \'428341000124108\' from "SNOMEDCT" display \'Macular edema absent (situation)\'\n' +
    'code "AMB" : \'AMB\' from "ActCode" display \'Ambulatory\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  SDE."SDE Ethnicity"\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  SDE."SDE Payer"\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  SDE."SDE Race"\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  SDE."SDE Sex"\n' +
    '\n' + '\n' + '\n' +
    'define "ipp":\n' +
    'true\n' +
    '\n' +
    'define "num":\n' +
    'true\n' +
    '\n' +
    'define "denom":\n' +
    'true'

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
            .first() // select the first element
            .type('Initial Population Description')
        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')

        //'Include in Report Type' field added for Initial Population when Risk adjustment variable is added
        cy.get(MeasureGroupPage.ippIncludeInReportTypeField).should('exist')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Individual' && 'Subject List' && 'Summary' && 'Data Collection')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()

        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(MeasureGroupPage.riskAdjustmentSaveSuccessMsg).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

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
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Individual' && 'Subject List' && 'Summary' && 'Data Collection')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()

        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Navigate to Measures page
        cy.get('[data-testid="close-error-button"]').click()
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('export')

        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR4.zip', { timeout: 15000 })
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QI-Core Measure', () => {

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
        cy.exec(`grep 'extra info for the measure' cypress/downloads/eCQMTitle4QICore-v1.0.000-FHIR.json`)
            .its('stdout')
            .should('contain', '"valueMarkdown": "extra info for the measure"')
        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR.html', { timeout: 5500 })
        cy.verifyDownload('eCQMTitle4QICore-v1.0.000-FHIR.xml', { timeout: 5500 })
        cy.verifyDownload('cql/CQMCommon-1.0.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/FHIRCommon-4.1.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/FHIRHelpers-4.1.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/QICoreCommon-1.2.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/SupplementalDataElements-3.1.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/' + CqlLibraryName + '-1.0.000.cql', { timeout: 5500 })
        cy.verifyDownload('resources/library-CQMCommon-1.0.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-FHIRCommon-4.1.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-FHIRHelpers-4.1.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-QICoreCommon-1.2.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-SupplementalDataElements-3.1.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/measure-' + CqlLibraryName + '-1.0.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/measure-' + CqlLibraryName + '-1.0.000.xml', { timeout: 5500 })
    })
})

describe('QI-Core Measure Export: Validating contents of Human Readable file, before versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        measureNameFC = 'HRExport1' + Date.now()
        CqlLibraryNameFC = 'HRExport1Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

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

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR.html').then((exportedFile) => {
            exported = exportedFile.toString()
            cy.log('exported file contents are: \n' + exported)

            cy.readFile(terminologySection).then((dataComparedTerminologyDependencies) => {
                expected = dataComparedTerminologyDependencies.toString()
                cy.log('expected fifth section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(groupScoringSection).should('exist').then((dataComparedGroupscoringPC) => {
                expected = dataComparedGroupscoringPC.toString()
                cy.log('expected sixth section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(qualifyingEncountersSection).then((dataComparedQualifyingEncounters) => {
                expected = dataComparedQualifyingEncounters.toString()
                cy.log('expected seventh section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(versionSection).then((dataComparedVersion) => {
                expected = dataComparedVersion.toString()
                cy.log('expected seventh section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })
        })
   })

    it('Verify contents of unzipped folder', () => {

          //Verify all files exist in exported zip file       
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.html', { timeout: 5500 })
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.xml', { timeout: 5500 })
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.json', { timeout: 5500 })
        cy.verifyDownload('cql/FHIRHelpers-4.1.000.cql', { timeout: 5500 })
        cy.verifyDownload('cql/' + CqlLibraryNameFC + '-0.0.000.cql', { timeout: 5500 })
        cy.verifyDownload('resources/library-FHIRHelpers-4.1.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-FHIRHelpers-4.1.000.xml', { timeout: 5500 })
        cy.verifyDownload('resources/measure-' + CqlLibraryNameFC + '-Draft based on 0.0.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/measure-' + CqlLibraryNameFC + '-Draft based on 0.0.000.xml', { timeout: 5500 })
        cy.verifyDownload('resources/library-' + CqlLibraryNameFC + '-0.0.000.json', { timeout: 5500 })
        cy.verifyDownload('resources/library-' + CqlLibraryNameFC + '-0.0.000.xml', { timeout: 5500 })
    })

    /* commenting this out because it was determined that the Qi Core xml file is, basically, just a copy of the Qi Core HTML file
    keeping this segment of code along with the files associated with this test in case it ever comes up that we need to validate
    the contents of this file in addition to the Qi Core HTML file
    it('Verify content of the XML file, for a Qi Core Measure, before versioning', () => {
        //read contents of the xml file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated xml file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection).should('exist').then((dataComparedVersion) => {
                expected = dataComparedVersion.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameIdentifierSection).should('exist').then((dataComparedShortNameIdentifier) => {
                expected = dataComparedShortNameIdentifier.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileStatusMetaFieldsSection).should('exist').then((dataComparedStatusMetaFields) => {
                expected = dataComparedStatusMetaFields.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMetaCQLSection).should('exist').then((dataComparedMetaCQL) => {
                expected = dataComparedMetaCQL.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileGroup_scoring_and_PCSection).should('exist').then((dataComparedGroup_scoring_and_PC) => {
                expected = dataComparedGroup_scoring_and_PC.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersFirstSection).should('exist').then((dataComparedQualifyingEncountersFirst) => {
                expected = dataComparedQualifyingEncountersFirst.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameDetailsSection).should('exist').then((dataComparedShortNameDetails) => {
                expected = dataComparedShortNameDetails.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalMetaDetailsSection).should('exist').then((dataComparedAdditionalMetaDetails) => {
                expected = dataComparedAdditionalMetaDetails.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPCDetailsSection).should('exist').then((dataComparedAdditionalPCDetails) => {
                expected = dataComparedAdditionalPCDetails.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileRelatedArtifactsValuesetsSection).should('exist').then((dataComparedRelatedArtifactsValuesets) => {
                expected = dataComparedRelatedArtifactsValuesets.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalValuesetSection).should('exist').then((dataComparedAdditionalValueset) => {
                expected = dataComparedAdditionalValueset.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalCQLSection).should('exist').then((dataComparedAdditionalCQL) => {
                expected = dataComparedAdditionalCQL.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileResourceSection).should('exist').then((dataComparedResource) => {
                expected = dataComparedResource.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })
    })
    */
})

describe('QI-Core Measure Export: Validating contents of Human Readable file, after versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        measureNameFC = 'HRExport2' + Date.now()
        CqlLibraryNameFC = 'HRExport2Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent)
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

        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementEnabled(MeasuresPage.confirmMeasureVersionNumber, 5500)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureNameFC, versionNumber)
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

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v1.0.000-FHIR.html').then((exportedFile) => {
            exported = exportedFile.toString()
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(terminologySection).then((dataComparedTerminologyDependencies) => {
                expected = dataComparedTerminologyDependencies.toString()
                cy.log('expected fifth section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(groupScoringSection).then((dataComparedGroupscoringPC) => {
                expected = dataComparedGroupscoringPC.toString()
                cy.log('expected sixth section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(qualifyingEncountersSection).then((dataComparedQualifyingEncounters) => {
                expected = dataComparedQualifyingEncounters.toString()
                cy.log('expected seventh section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })

            cy.readFile(versionSectionVer1).then((dataComparedVersion_ver1) => {
                expected = dataComparedVersion_ver1.toString()
                cy.log('expected version section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })
            
            cy.readFile(stylesSection).then(dataComparedStyles => {
                expected = dataComparedStyles.toString()
                cy.log('expected styles section file contents are: \n' + expected)
                expect(exported).to.includes(expected)
            })
        })
    })
    /* commenting out because it was determined that the Qi Core xml file is, basically, just a copy of the Qi Core HTML file
    keeping this segment of code along with the files associated with this test in case it ever comes up that we need to validate
    the contents of this file in addition to the Qi Core HTML file
    it('Verify content of the XML file, for a Qi Core Measure, after the measure has been versioned', () => {
        //read contents of the xml file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated xml file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection_ver1).should('exist').then((dataComparedVersion_ver1) => {
                expected = dataComparedVersion_ver1.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameIdentifierSection).should('exist').then((dataComparedShortNameIdentifier) => {
                expected = dataComparedShortNameIdentifier.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileStatusMetaFieldsSection).should('exist').then((dataComparedStatusMetaFields) => {
                expected = dataComparedStatusMetaFields.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMetaCQLSection).should('exist').then((dataComparedMetaCQL) => {
                expected = dataComparedMetaCQL.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileGroup_scoring_and_PCSection).should('exist').then((dataComparedGroup_scoring_and_PC) => {
                expected = dataComparedGroup_scoring_and_PC.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersFirstSection).should('exist').then((dataComparedQualifyingEncountersFirst) => {
                expected = dataComparedQualifyingEncountersFirst.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameDetailsSection).should('exist').then((dataComparedShortNameDetails) => {
                expected = dataComparedShortNameDetails.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalMetaDetailsSection).should('exist').then((dataComparedAdditionalMetaDetails) => {
                expected = dataComparedAdditionalMetaDetails.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPCDetailsSection).should('exist').then((dataComparedAdditionalPCDetails) => {
                expected = dataComparedAdditionalPCDetails.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileRelatedArtifactsValuesetsSection).should('exist').then((dataComparedRelatedArtifactsValuesets) => {
                expected = dataComparedRelatedArtifactsValuesets.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalValuesetSection).should('exist').then((dataComparedAdditionalValueset) => {
                expected = dataComparedAdditionalValueset.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalCQLSection).should('exist').then((dataComparedAdditionalCQL) => {
                expected = dataComparedAdditionalCQL.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileResourceSection).should('exist').then((dataComparedResource) => {
                expected = dataComparedResource.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })
    })
    */
})


