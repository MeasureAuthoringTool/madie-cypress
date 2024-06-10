import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"

let versionNumber = '1.0.000'


//variables for Human Readable file detail file comparison
let baseHTMLFileFirstSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_FirstSection.html'
let baseHTMLFileSecondSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_SecondSection.html'
let baseHTMLFileThirdSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_ThirdSection.html'
let baseHTMLFileFourthSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_FourthSection.html'
let baseHTMLFileFifthSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_FifthSection.html'
let baseHTMLFileSixthSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_SixthSection.html'
let baseHTMLFileSeventhSection = 'cypress/fixtures/QICoreHumanReadableCompareFile_SeventhSection.html'

//variables for HQMF file detail file comparison
let baseXMLFileFirstSection = 'cypress/fixtures/QICoreHQMFCompareFile_FirstSection.xml'
let baseXMLFileSecondSection = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection.xml'
//

let baseXMLFileSecondSectionDiabetesBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_Diabetes_block.xml'
let baseXMLFileSecondSectionERDeptVisitBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_EmergencyDepartmentVisit_block.xml'
let baseXMLFileSecondSectionEncounterImpatientBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_EncounterInpatient_block.xml'
let baseXMLFileSecondSectionGlucoseLTMPVBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_GlucoseLabTestMassPerVolume_block.xml'
let baseXMLFileSecondSectionHypoblycemicTreatMedBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_HypoglycemicsTreatmentMedications_block.xml'
let baseXMLFileSecondSectionOSBlock = 'cypress/fixtures/QICoreHQMFCompareFile_SecondSection_ObservationServices_block.xml'

//
let baseXMLFileThirdSection = 'cypress/fixtures/QICoreHQMFCompareFile_ThirdSection.xml'
let baseXMLFileFourthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FourthSection.xml'
let baseXMLFileFifthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FifthSection.xml'
let baseXMLFileSixthSection = 'cypress/fixtures/QICoreHQMFCompareFile_SixthSection.xml'
let baseXMLFileSeventhSection = 'cypress/fixtures/QICoreHQMFCompareFile_SeventhSection.xml'
let baseXMLFileEighthSection = 'cypress/fixtures/QICoreHQMFCompareFile_EighthSection.xml'
let baseXMLFileNinthSection = 'cypress/fixtures/QICoreHQMFCompareFile_NinthSection.xml'
let baseXMLFileTenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_TenthSection.xml'
let baseXMLFileEleventhSection = 'cypress/fixtures/QICoreHQMFCompareFile_EleventhSection.xml'
let baseXMLFileTwelfthSection = 'cypress/fixtures/QICoreHQMFCompareFile_TwelfthSection.xml'
let baseXMLFileThirteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_ThirteenthSection.xml'
let baseXMLFileFourteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FourteenthSection.xml'
let baseXMLFileFifteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_FifteenthSection.xml'
let baseXMLFileSixteenthSection = 'cypress/fixtures/QICoreHQMFCompareFile_SixteenthSection.xml'


let exported = ''
let expected = ''

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
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
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()

    })

    it('Validate the zip file Export is downloaded for QI-Core Measure', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.measureAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QI-Core Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.xml')).should('exist')

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
///this will need to be re-visited -- a more elegant approach needs to be explored where we delete 
//all un-necessary files before doing the file comparison
describe.skip('QI-Core Measure Export: Validating contents of Human Readable and HQMF files before and after versioning', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        //Create New Measure
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()

    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })
    //
    // this needs to be worked on first
    it('Unzip the downloaded file and verify file types and contest of the HR and HQMF files, for QI Core Measure', () => {
        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction('export')


        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')


        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })


        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseHTMLFileFirstSection).should('exist').then((dataComparedFirst) => {
                debugger
                expected = dataComparedFirst.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileSecondSection).should('exist').then((dataComparedSecond) => {
                debugger
                expected = dataComparedSecond.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileThirdSection).should('exist').then((dataComparedThird) => {
                debugger
                expected = dataComparedThird.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileFourthSection).should('exist').then((dataComparedFourth) => {
                debugger
                expected = dataComparedFourth.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

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
        cy.pause()
        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR.xml')).should('exist').then((exportedFile) => {
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
            //

            cy.readFile(baseXMLFileSecondSectionDiabetesBlock).should('exist').then((dataComparedSecondDiabetesBlock) => {
                debugger
                expected = dataComparedSecondDiabetesBlock.toString() //'compareFile'
                cy.log('expected second section Diabetes blcok file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionERDeptVisitBlock).should('exist').then((dataComparedSecondERDeptVisitBlock) => {
                debugger
                expected = dataComparedSecondERDeptVisitBlock.toString() //'compareFile'
                cy.log('expected second section ER Department Visit block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionEncounterImpatientBlock).should('exist').then((dataComparedSecondEncounterImpatientBlock) => {
                debugger
                expected = dataComparedSecondEncounterImpatientBlock.toString() //'compareFile'
                cy.log('expected second section Encounter Impatient Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionGlucoseLTMPVBlock).should('exist').then((dataComparedSecondGlucoseLTMPVBlock) => {
                debugger
                expected = dataComparedSecondGlucoseLTMPVBlock.toString() //'compareFile'
                cy.log('expected second section Glucose LTMPV Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionHypoblycemicTreatMedBlock).should('exist').then((dataComparedSecondHypoblycemicTreatMedBlock) => {
                debugger
                expected = dataComparedSecondHypoblycemicTreatMedBlock.toString() //'compareFile'
                cy.log('expected second section Hypoblycemic Treat Med Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionOSBlock).should('exist').then((dataComparedSecondOSBlock) => {
                debugger
                expected = dataComparedSecondOSBlock.toString() //'compareFile'
                cy.log('expected second section Observation Services Blockfile contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            //
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
            //
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
            cy.readFile(baseXMLFileSixteenthSection).should('exist').then((dataComparedSixteenth) => {
                debugger
                expected = dataComparedSixteenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR.xml')).should('exist')

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


    it('Version measure, unzip the downloaded file, and verify file contents for the HR and HQMF files, for QDM Measure', () => {
        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Major Version Created Successfully')

        MeasuresPage.measureAction('qdmexport')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseHTMLFileFirstSection).should('exist').then((dataComparedFirst) => {
                debugger
                expected = dataComparedFirst.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseHTMLFileSecondSection).should('exist').then((dataComparedSecond) => {
                debugger
                expected = dataComparedSecond.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseHTMLFileThirdSection).should('exist').then((dataComparedThird) => {
                debugger
                expected = dataComparedThird.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseHTMLFileFourthSection).should('exist').then((dataComparedFourth) => {
                debugger
                expected = dataComparedFourth.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })


        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.xml')).should('exist').then((exportedFile) => {
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
            //

            cy.readFile(baseXMLFileSecondSectionDiabetesBlock).should('exist').then((dataComparedSecondDiabetesBlock) => {
                debugger
                expected = dataComparedSecondDiabetesBlock.toString() //'compareFile'
                cy.log('expected second section Diabetes blcok file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionERDeptVisitBlock).should('exist').then((dataComparedSecondERDeptVisitBlock) => {
                debugger
                expected = dataComparedSecondERDeptVisitBlock.toString() //'compareFile'
                cy.log('expected second section ER Department Visit block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionEncounterImpatientBlock).should('exist').then((dataComparedSecondEncounterImpatientBlock) => {
                debugger
                expected = dataComparedSecondEncounterImpatientBlock.toString() //'compareFile'
                cy.log('expected second section Encounter Impatient Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionGlucoseLTMPVBlock).should('exist').then((dataComparedSecondGlucoseLTMPVBlock) => {
                debugger
                expected = dataComparedSecondGlucoseLTMPVBlock.toString() //'compareFile'
                cy.log('expected second section Glucose LTMPV Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionHypoblycemicTreatMedBlock).should('exist').then((dataComparedSecondHypoblycemicTreatMedBlock) => {
                debugger
                expected = dataComparedSecondHypoblycemicTreatMedBlock.toString() //'compareFile'
                cy.log('expected second section Hypoblycemic Treat Med Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSectionOSBlock).should('exist').then((dataComparedSecondOSBlock) => {
                debugger
                expected = dataComparedSecondOSBlock.toString() //'compareFile'
                cy.log('expected second section Observation Services Blockfile contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            //
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
            //
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
            cy.readFile(baseXMLFileSixteenthSection).should('exist').then((dataComparedSixteenth) => {
                debugger
                expected = dataComparedSixteenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.xml')).should('exist')
    })

    //

})


