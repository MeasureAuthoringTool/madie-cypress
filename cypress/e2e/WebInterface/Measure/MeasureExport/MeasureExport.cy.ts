import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { closeSync } from "fs"

//variables for Human Readable file detail file comparison
let baseHTMLFileTerminologyDependenciesSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_Terminology_and_Other_Dependencies_sections.html'
let baseHTMLFileGroupscoringPCSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_Group_scoring_and_PC_sections.html'
let baseHTMLFileQualifyingEncountersSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_Qualifying_Encounters_section.html'
let baseHTMLFileVersionSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_Version_section.html'
let baseHTMLFileVersionSection_ver1 = 'cypress/fixtures/QICoreHumanReadableCompareFile_Version_section_ver1.html'



//variables for HQMF file detail file comparison
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

let exported = ''
let expected = ''

let versionNumber = '1.0.000'
let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
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
    '\n' +
    '\n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
    '\n' +
    '\n' +
    '\n' +
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
    '\n' +
    '\n' +
    '\n' +
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

        //Create New Measure
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

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QI-Core Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.xml')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'cql/CQMCommon-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRCommon-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRHelpers-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/QICoreCommon-1.2.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/SupplementalDataElements-3.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/' + CqlLibraryName + '-1.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/CQMCommon-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/CQMCommon-1.0.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRCommon-4.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRCommon-4.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRHelpers-4.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRHelpers-4.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/QICoreCommon-1.2.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/QICoreCommon-1.2.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/SupplementalDataElements-3.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/SupplementalDataElements-3.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/' + CqlLibraryName + '-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/' + CqlLibraryName + '-1.0.000.xml')).should('exist')


    })

})

describe('QI-Core Measure Export: Validating contents of Human Readable file, before versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        measureNameFC = 'TestMeasure' + Date.now()
        CqlLibraryNameFC = 'TestLibrary' + Date.now()

        //Create New Measure
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

        //export measure
        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')


        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

    })
    after('Clean up', () => {

        Utilities.deleteMeasure(measureNameFC, CqlLibraryNameFC)
    })
    it('Verify exported files, their types and the content of the HR file, for a Qi Core Measure, before versioning', () => {

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseHTMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                debugger
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileGroupscoringPCSection).should('exist').then((dataComparedGroupscoringPC) => {
                debugger
                expected = dataComparedGroupscoringPC.toString() //'compareFile'
                cy.log('expected sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                debugger
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileVersionSection).should('exist').then((dataComparedVersion) => {
                debugger
                expected = dataComparedVersion.toString() //'compareFile'
                cy.log('expected seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

        })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.xml')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'cql/FHIRHelpers-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/' + CqlLibraryNameFC + '-0.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-FHIRHelpers-4.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-FHIRHelpers-4.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-' + CqlLibraryNameFC + '-0.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/library-' + CqlLibraryNameFC + '-0.0.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/measure-' + CqlLibraryNameFC + '-Draft based on 0.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/measure-' + CqlLibraryNameFC + '-Draft based on 0.0.000.xml')).should('exist')
    })

    //skipping because it was determined that the Qi Core xml file is, basically, just a copy of the Qi Core HTML file
    //keeping this segment of code along with the files associated with this test in case it ever comes up that we need to validate
    //the contents of this file in addition to the Qi Core HTML file
    it.skip('Verify content of the XML file, for a Qi Core Measure, before versioning', () => {
        //read contents of the xml file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated xml file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection).should('exist').then((dataComparedVersion) => {
                debugger
                expected = dataComparedVersion.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameIdentifierSection).should('exist').then((dataComparedShortNameIdentifier) => {
                debugger
                expected = dataComparedShortNameIdentifier.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileStatusMetaFieldsSection).should('exist').then((dataComparedStatusMetaFields) => {
                debugger
                expected = dataComparedStatusMetaFields.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                debugger
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMetaCQLSection).should('exist').then((dataComparedMetaCQL) => {
                debugger
                expected = dataComparedMetaCQL.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileGroup_scoring_and_PCSection).should('exist').then((dataComparedGroup_scoring_and_PC) => {
                debugger
                expected = dataComparedGroup_scoring_and_PC.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersFirstSection).should('exist').then((dataComparedQualifyingEncountersFirst) => {
                debugger
                expected = dataComparedQualifyingEncountersFirst.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameDetailsSection).should('exist').then((dataComparedShortNameDetails) => {
                debugger
                expected = dataComparedShortNameDetails.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalMetaDetailsSection).should('exist').then((dataComparedAdditionalMetaDetails) => {
                debugger
                expected = dataComparedAdditionalMetaDetails.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPCDetailsSection).should('exist').then((dataComparedAdditionalPCDetails) => {
                debugger
                expected = dataComparedAdditionalPCDetails.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileRelatedArtifactsValuesetsSection).should('exist').then((dataComparedRelatedArtifactsValuesets) => {
                debugger
                expected = dataComparedRelatedArtifactsValuesets.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalValuesetSection).should('exist').then((dataComparedAdditionalValueset) => {
                debugger
                expected = dataComparedAdditionalValueset.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalCQLSection).should('exist').then((dataComparedAdditionalCQL) => {
                debugger
                expected = dataComparedAdditionalCQL.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileResourceSection).should('exist').then((dataComparedResource) => {
                debugger
                expected = dataComparedResource.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                debugger
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

        })
    })

})
describe('QI-Core Measure Export: Validating contents of Human Readable file, after versioning', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        measureNameFC = 'TestMeasure' + Date.now()
        CqlLibraryNameFC = 'TestLibrary' + Date.now()

        //Create New Measure
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureNameFC, CqlLibraryNameFC, measureCQLContent)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

        //version measure
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).wait(1500).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureNameFC, versionNumber)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

    })

    it('Verify the content of the HR file, for a Qi Core Measure, after the measure has been versioned', () => {

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseHTMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                debugger
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileGroupscoringPCSection).should('exist').then((dataComparedGroupscoringPC) => {
                debugger
                expected = dataComparedGroupscoringPC.toString() //'compareFile'
                cy.log('expected sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                debugger
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileVersionSection_ver1).should('exist').then((dataComparedVersion_ver1) => {
                debugger
                expected = dataComparedVersion_ver1.toString() //'compareFile'
                cy.log('expected seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

        })

    })
    //skipping because it was determined that the Qi Core xml file is, basically, just a copy of the Qi Core HTML file
    //keeping this segment of code along with the files associated with this test in case it ever comes up that we need to validate
    //the contents of this file in addition to the Qi Core HTML file
    it.skip('Verify content of the XML file, for a Qi Core Measure, after the measure has been versioned', () => {
        //read contents of the xml file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated xml file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v1.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection_ver1).should('exist').then((dataComparedVersion_ver1) => {
                debugger
                expected = dataComparedVersion_ver1.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameIdentifierSection).should('exist').then((dataComparedShortNameIdentifier) => {
                debugger
                expected = dataComparedShortNameIdentifier.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileStatusMetaFieldsSection).should('exist').then((dataComparedStatusMetaFields) => {
                debugger
                expected = dataComparedStatusMetaFields.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTerminologyDependenciesSection).should('exist').then((dataComparedTerminologyDependencies) => {
                debugger
                expected = dataComparedTerminologyDependencies.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMetaCQLSection).should('exist').then((dataComparedMetaCQL) => {
                debugger
                expected = dataComparedMetaCQL.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileGroup_scoring_and_PCSection).should('exist').then((dataComparedGroup_scoring_and_PC) => {
                debugger
                expected = dataComparedGroup_scoring_and_PC.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersFirstSection).should('exist').then((dataComparedQualifyingEncountersFirst) => {
                debugger
                expected = dataComparedQualifyingEncountersFirst.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileShortNameDetailsSection).should('exist').then((dataComparedShortNameDetails) => {
                debugger
                expected = dataComparedShortNameDetails.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalMetaDetailsSection).should('exist').then((dataComparedAdditionalMetaDetails) => {
                debugger
                expected = dataComparedAdditionalMetaDetails.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPCDetailsSection).should('exist').then((dataComparedAdditionalPCDetails) => {
                debugger
                expected = dataComparedAdditionalPCDetails.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileRelatedArtifactsValuesetsSection).should('exist').then((dataComparedRelatedArtifactsValuesets) => {
                debugger
                expected = dataComparedRelatedArtifactsValuesets.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalValuesetSection).should('exist').then((dataComparedAdditionalValueset) => {
                debugger
                expected = dataComparedAdditionalValueset.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalCQLSection).should('exist').then((dataComparedAdditionalCQL) => {
                debugger
                expected = dataComparedAdditionalCQL.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileResourceSection).should('exist').then((dataComparedResource) => {
                debugger
                expected = dataComparedResource.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileQualifyingEncountersSection).should('exist').then((dataComparedQualifyingEncounters) => {
                debugger
                expected = dataComparedQualifyingEncounters.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

        })
    })

})


