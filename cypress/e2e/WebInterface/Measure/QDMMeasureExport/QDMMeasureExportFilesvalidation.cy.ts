import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"

let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
let versionNumber = '1.0.000'
let measureName = 'TestMeasure' + Date.now()

//variables for Human Readable file detail file comparison
let baseHTMLFileFirstSection = 'cypress/fixtures/HumanReadableCompareFile_FirstSection.html'
let baseHTMLFileSecondSection = 'cypress/fixtures/HumanReadableCompareFile_SecondSection.html'
let baseHTMLFileSecondSection_ver1 = 'cypress/fixtures/HumanReadableCompareFile_SecondSection_Ver1.html'
let baseHTMLFileThirdSection = 'cypress/fixtures/HumanReadableCompareFile_ThirdSection.html'
let baseHTMLFileFourthSection = 'cypress/fixtures/HumanReadableCompareFile_FourthSection.html'

//variables for HQMF file detail file comparison
let baseXMLFileFirstSection = 'cypress/fixtures/HQMFCompareFile_FirstSection.xml'
let baseXMLFileFirstSection_ver1 = 'cypress/fixtures/HQMFCompareFile_FirstSection_Ver1.xml'
let baseXMLFileSecondSection = 'cypress/fixtures/HQMFCompareFile_SecondSection.xml'
let baseXMLFileSecondSectionDiabetesBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_Diabetes_block.xml'
let baseXMLFileSecondSectionERDeptVisitBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_EmergencyDepartmentVisit_block.xml'
let baseXMLFileSecondSectionEncounterImpatientBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_EncounterInpatient_block.xml'
let baseXMLFileSecondSectionGlucoseLTMPVBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_GlucoseLabTestMassPerVolume_block.xml'
let baseXMLFileSecondSectionHypoblycemicTreatMedBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_HypoglycemicsTreatmentMedications_block.xml'
let baseXMLFileSecondSectionOSBlock = 'cypress/fixtures/HQMFCompareFile_SecondSection_ObservationServices_block.xml'
let baseXMLFileThirdSection = 'cypress/fixtures/HQMFCompareFile_ThirdSection.xml'
let baseXMLFileThirdSection_ver1 = 'cypress/fixtures/HQMFCompareFile_ThirdSection_Ver1.xml'
let baseXMLFileFourthSection = 'cypress/fixtures/HQMFCompareFile_FourthSection.xml'
let baseXMLFileFifthSection = 'cypress/fixtures/HQMFCompareFile_FifthSection.xml'
let baseXMLFileSixthSection = 'cypress/fixtures/HQMFCompareFile_SixthSection.xml'
let baseXMLFileSeventhSection = 'cypress/fixtures/HQMFCompareFile_SeventhSection.xml'
let baseXMLFileEighthSection = 'cypress/fixtures/HQMFCompareFile_EighthSection.xml'
let baseXMLFileNinthSection = 'cypress/fixtures/HQMFCompareFile_NinthSection.xml'
let baseXMLFileTenthSection = 'cypress/fixtures/HQMFCompareFile_TenthSection.xml'
let baseXMLFileEleventhSection = 'cypress/fixtures/HQMFCompareFile_EleventhSection.xml'
let baseXMLFileTwelfthSection = 'cypress/fixtures/HQMFCompareFile_TwelfthSection.xml'
let baseXMLFileThirteenthSection = 'cypress/fixtures/HQMFCompareFile_ThirteenthSection.xml'
let baseXMLFileFourteenthSection = 'cypress/fixtures/HQMFCompareFile_FourteenthSection.xml'
let baseXMLFileFifteenthSection = 'cypress/fixtures/HQMFCompareFile_FifteenthSection.xml'
let baseXMLFileSixteenthSection = 'cypress/fixtures/HQMFCompareFile_SixteenthSection.xml'
let baseXMLFileSeventeenthSection = 'cypress/fixtures/HQMFCompareFile_SeventeenthSection.xml'


let exported = ''
let expected = ''

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun

//Need to debug more for File comparisons
//skipping all of these tests until a better cypress unzip / extraction mechanism can be used
describe.skip('Verify QDM Measure Export file contents', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Unzip the downloaded file and verify file types and contest of the HR and HQMF files, for QDM Measure', () => {

        MeasuresPage.measureAction('qdmexport')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        //cy.pause()
        //read contents of the html / human readable file and compare that with the expected file contents (minus specific
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            /* cy.readFile(baseHTMLFileFirstSection).should('exist').then((dataComparedFirst) => {
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
            }) */
            cy.readFile(baseHTMLFileFourthSection).should('exist').then((dataComparedFourth) => {
                debugger
                expected = dataComparedFourth.toString() //'compareFile'
                cy.log('expected fourth section (ie: Definitions and ValueSets) file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist').then((exportedFile) => {
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
            cy.readFile(baseXMLFileSixteenthSection).should('exist').then((dataComparedSixteenth) => {
                debugger
                expected = dataComparedSixteenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSeventeenthSection).should('exist').then((dataComparedSeventeenth) => {
                debugger
                expected = dataComparedSeventeenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')


        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')

    })

})
//skipping all of these tests until a better cypress unzip / extraction mechanism can be used
describe.skip('QDM Measure Export, Not the Owner', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.AltLogin()

    })

    after('Clean up', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })


    it('Non Measure owner able to Export QDM Measure', () => {

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        OktaLogin.UILogout()

    })
})

//skipping all of these tests until a better cypress unzip / extraction mechanism can be used
describe.skip('Successful QDM Measure Export with versioned measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        OktaLogin.Login()

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
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v1.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            /* cy.readFile(baseHTMLFileFirstSection).should('exist').then((dataComparedFirst) => {
                debugger
                expected = dataComparedFirst.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseHTMLFileSecondSection_ver1).should('exist').then((dataComparedSecond_ver1) => {
                debugger
                expected = dataComparedSecond_ver1.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseHTMLFileThirdSection).should('exist').then((dataComparedThird) => {
                debugger
                expected = dataComparedThird.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            }) */
            cy.readFile(baseHTMLFileFourthSection).should('exist').then((dataComparedFourth) => {
                debugger
                expected = dataComparedFourth.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })


        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileFirstSection_ver1).should('exist').then((dataComparedFirst_ver1) => {
                debugger
                expected = dataComparedFirst_ver1.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSecondSection).should('exist').then((dataComparedSecond) => {
                debugger
                expected = dataComparedSecond.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
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
            cy.readFile(baseXMLFileThirdSection_ver1).should('exist').then((dataComparedThird_ver1) => {
                debugger
                expected = dataComparedThird_ver1.toString() //'compareFile'
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
            cy.readFile(baseXMLFileSixteenthSection).should('exist').then((dataComparedSixteenth) => {
                debugger
                expected = dataComparedSixteenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSeventeenthSection).should('exist').then((dataComparedSeventeenth) => {
                debugger
                expected = dataComparedSeventeenth.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')

    })

})


