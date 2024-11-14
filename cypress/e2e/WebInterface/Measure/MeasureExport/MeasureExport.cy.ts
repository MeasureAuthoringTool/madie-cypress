import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

//variables for Human Readable file detail file comparison
let baseHTMLFileFifthSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_FifthSection.html'
let baseHTMLFileSixthSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_SixthSection.html'
let baseHTMLFileSeventhSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_SeventhSection.html'

//variables for HQMF file detail file comparison
let baseXMLFileFirstSection = 'cypress/fixtures/QICoreHQMFCompareFile_FirstSection.xml'
let baseXMLFileSecondSection = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection.xml'
let baseXMLFileThirdSection = 'cypress/fixtures/QICoreHQMFCompareFile_ThirdSection.xml'
let baseXMLFileFourthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FourthSection.xml'
let baseXMLFileFifthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FifthSection.xml'
let baseXMLFileSixthSection = 'cypress/fixtures/QICoreHQMFCompareFile_SixthSection.xml'
let baseXMLFileSeventhSection = 'cypress/fixtures/QICoreHQMFCompareFile_SeventhSection.xml'
let baseXMLFileEighthSection = 'cypress/fixtures/QICoreHQMFCompareFile_EighthSection.xml'
let baseXMLFileNinthSection = 'cypress/fixtures/QICoreHQMFCompareFile_NinthSection.xml'
let baseXMLFileTenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_TenthSection.xml'
let baseXMLFileEleventhSection = 'cypress/fixtures/QICoreHQMFCompareFile_EleventhSection.xml'
let baseXMLFileTwelfthSection = 'cypress/fixtures/QICoreHQMFCompareFile_TwelvethSection.xml'
let baseXMLFileThirteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_ThirteenthSection.xml'
let baseXMLFileFourteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FourteenthSection.xml'
let baseXMLFileFifteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FifteenthSection.xml'

let exported = ''
let expected = ''

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
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
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

describe('QI-Core Measure Export: Validating contents of Human Readable and HQMF files before and after versioning', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {
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

    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureNameFC, CqlLibraryNameFC)
    })
    it('Unzip the downloaded file and verify file types and contest of the HR and HQMF files, for QI Core Measure', () => {
        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('export')


        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')


        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })


        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseHTMLFileFifthSection).should('exist').then((dataComparedFifth) => {
                debugger
                expected = dataComparedFifth.toString() //'compareFile'
                cy.log('expected fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileSixthSection).should('exist').then((dataComparedSixth) => {
                debugger
                expected = dataComparedSixth.toString() //'compareFile'
                cy.log('expected sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileSeventhSection).should('exist').then((dataComparedSeventh) => {
                debugger
                expected = dataComparedSeventh.toString() //'compareFile'
                cy.log('expected seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

        })
        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileFirstSection).should('exist').then((dataComparedFirst) => {
                debugger
                expected = dataComparedFirst.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSection).should('exist').then((dataComparedSecond) => {
                debugger
                expected = dataComparedSecond.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileThirdSection).should('exist').then((dataComparedThird) => {
                debugger
                expected = dataComparedThird.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileFourthSection).should('exist').then((dataComparedFourth) => {
                debugger
                expected = dataComparedFourth.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileFifthSection).should('exist').then((dataComparedFifth) => {
                debugger
                expected = dataComparedFifth.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSixthSection).should('exist').then((dataComparedSixth) => {
                debugger
                expected = dataComparedSixth.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSeventhSection).should('exist').then((dataComparedSeventh) => {
                debugger
                expected = dataComparedSeventh.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEighthSection).should('exist').then((dataComparedEighth) => {
                debugger
                expected = dataComparedEighth.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileNinthSection).should('exist').then((dataComparedNinth) => {
                debugger
                expected = dataComparedNinth.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTenthSection).should('exist').then((dataComparedTenth) => {
                debugger
                expected = dataComparedTenth.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEleventhSection).should('exist').then((dataComparedEleventh) => {
                debugger
                expected = dataComparedEleventh.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileTwelfthSection).should('exist').then((dataComparedTwelfth) => {
                debugger
                expected = dataComparedTwelfth.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileThirteenthSection).should('exist').then((dataComparedThirteenth) => {
                debugger
                expected = dataComparedThirteenth.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileFourteenthSection).should('exist').then((dataComparedFourteenth) => {
                debugger
                expected = dataComparedFourteenth.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileFifteenthSection).should('exist').then((dataComparedFifteenth) => {
                debugger
                expected = dataComparedFifteenth.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
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

})


