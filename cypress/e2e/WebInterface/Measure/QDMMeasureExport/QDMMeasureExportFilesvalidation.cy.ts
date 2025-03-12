import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
let versionNumber = '1.0.000'
let measureName = 'TestMeasure' + Date.now()

//variables for Human Readable file detail file comparison
let baseHTMLFileValueSetSection = 'cypress/fixtures/HumanReadableCompareFile_ValueSetSection.html'
let baseHTMLFileCMSIdSection = 'cypress/fixtures/HumanReadableCompareFile_CMSIdSection.html'
let baseHTMLFileMetaDetailsSection = 'cypress/fixtures/HumanReadableCompareFile_MetaDetailsSection.html'
let baseHTMLFileCMSIdSection_Version = 'cypress/fixtures/HumanReadableCompareFile_CMSIdSection_Ver1.html'

//variables for HQMF file detail file comparison
let baseXMLFileVersionSection = 'cypress/fixtures/HQMFCompareFile_VersionSection.xml'
let baseXMLFileVersionSection_ver1 = 'cypress/fixtures/HQMFCompareFile_VersionSection_Ver1.xml'
let baseXMLFileSubstanceAdminCriteriaSection = 'cypress/fixtures/HQMFCompareFile_SubstanceAdminCriteriaSection.xml'
let baseXMLFileDefinitionSectionDiabetesBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_Diabetes_block.xml'
let baseXMLFileDefinitionSectionERDeptVisitBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_EmergencyDepartmentVisit_block.xml'
let baseXMLFileDefinitionSectionEncounterImpatientBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_EncounterInpatient_block.xml'
let baseXMLFileDefinitionSectionGlucoseLTMPVBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_GlucoseLabTestMassPerVolume_block.xml'
let baseXMLFileDefinitionSectionHypoblycemicTreatMedBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_HypoglycemicsTreatmentMedications_block.xml'
let baseXMLFileDefinitionSectionOSBlock = 'cypress/fixtures/HQMFCompareFile_DefinitionSection_ObservationServices_block.xml'
let baseXMLFileVersionNumberSection = 'cypress/fixtures/HQMFCompareFile_VersionNumberSection.xml'
let baseXMLFileVersionNumberSection_ver1 = 'cypress/fixtures/HQMFCompareFile_VersionNumberSection_Ver1.xml'
let baseXMLFilePopCriteriaSection = 'cypress/fixtures/HQMFCompareFile_PopCriteriaSection.xml'
let baseXMLFileObservationCriteriaSection = 'cypress/fixtures/HQMFCompareFile_ObservationCriteriaSection.xml'
let baseXMLFileMoreEncounterCriteriaSection = 'cypress/fixtures/HQMFCompareFile_MoreEncounterCriteriaSection.xml'
let baseXMLFileMeasureAttributesSection = 'cypress/fixtures/HQMFCompareFile_MeasureAttributesSection.xml'
let baseXMLFileItemSection = 'cypress/fixtures/HQMFCompareFile_ItemSection.xml'
let baseXMLFileEncounterPerformedSection = 'cypress/fixtures/HQMFCompareFile_EncounterPerformedSection.xml'
let baseXMLFileEncounterCriteriaSection = 'cypress/fixtures/HQMFCompareFile_EncounterCriteriaSection.xml'
let baseXMLFilecomponentSection = 'cypress/fixtures/HQMFCompareFile_componentSection.xml'
let baseXMLFileCodeSection = 'cypress/fixtures/HQMFCompareFile_CodeSection.xml'
let baseXMLFileClosingQualityMeasureDocumentSection = 'cypress/fixtures/HQMFCompareFile_ClosingQualityMeasureDocumentSection.xml'
let baseXMLFileAdditionalPopulationCriteriaSection = 'cypress/fixtures/HQMFCompareFile_AdditionalPopulationCriteriaSection.xml'
let baseXMLFileAdditionalObservationCriteriaSection = 'cypress/fixtures/HQMFCompareFile_AdditionalObservationCriteriaSection.xml'
let baseXMLFileAdditionalLibrarySection = 'cypress/fixtures/HQMFCompareFile_AdditionalLibrarySection.xml'
let baseXMLFileAdditinoalEncounterCriteriaSection = 'cypress/fixtures/HQMFCompareFile_AdditinoalEncounterCriteriaSection.xml'


let exported = ''
let expected = ''

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun

describe('Verify QDM Measure Export file contents', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })

    after('Clean up', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Verify files, their types and the contents of the HR file, for QDM Measure', () => {

        //read contents of the html / human readable file and compare that with the expected file contents (minus specific
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.html')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)

            cy.readFile(baseHTMLFileCMSIdSection).should('exist').then((dataComparedCMSId) => {
                expected = dataComparedCMSId.toString() //'compareFile'
                cy.log('expected fourth section (ie: Definitions and ValueSets) file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileMetaDetailsSection).should('exist').then((dataComparedMetaDetails) => {
                expected = dataComparedMetaDetails.toString() //'compareFile'
                cy.log('expected fourth section (ie: Definitions and ValueSets) file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileValueSetSection).should('exist').then((dataComparedValueSet) => {
                expected = dataComparedValueSet.toString() //'compareFile'
                cy.log('expected fourth section (ie: Definitions and ValueSets) file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')


        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')

    })
    it('Verify content of the XML / HQMF file, for a QDM Measure', () => {
        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection).should('exist').then((dataComparedVersion) => {
                expected = dataComparedVersion.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSubstanceAdminCriteriaSection).should('exist').then((dataComparedSubstanceAdminCriteria) => {
                expected = dataComparedSubstanceAdminCriteria.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionDiabetesBlock).should('exist').then((dataComparedDefinitionSectionDiabetesBlock) => {
                expected = dataComparedDefinitionSectionDiabetesBlock.toString() //'compareFile'
                cy.log('expected second section Diabetes blcok file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionERDeptVisitBlock).should('exist').then((dataComparedDefinitionSectionERDeptVisitBlock) => {
                expected = dataComparedDefinitionSectionERDeptVisitBlock.toString() //'compareFile'
                cy.log('expected second section ER Department Visit block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionEncounterImpatientBlock).should('exist').then((dataComparedDefinitionSectionEncounterImpatientBlock) => {
                expected = dataComparedDefinitionSectionEncounterImpatientBlock.toString() //'compareFile'
                cy.log('expected second section Encounter Impatient Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionGlucoseLTMPVBlock).should('exist').then((dataComparedDefinitionSectionGlucoseLTMPVBlock) => {
                expected = dataComparedDefinitionSectionGlucoseLTMPVBlock.toString() //'compareFile'
                cy.log('expected second section Glucose LTMPV Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionHypoblycemicTreatMedBlock).should('exist').then((dataComparedDefinitionSectionHypoblycemicTreatMedBlock) => {
                expected = dataComparedDefinitionSectionHypoblycemicTreatMedBlock.toString() //'compareFile'
                cy.log('expected second section Hypoblycemic Treat Med Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionOSBlock).should('exist').then((dataComparedDefinitionSectionOSBlock) => {
                expected = dataComparedDefinitionSectionOSBlock.toString() //'compareFile'
                cy.log('expected second section Observation Services Blockfile contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileVersionNumberSection).should('exist').then((dataComparedVersionNumber) => {
                expected = dataComparedVersionNumber.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFilePopCriteriaSection).should('exist').then((dataComparedPopCriteria) => {
                expected = dataComparedPopCriteria.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileObservationCriteriaSection).should('exist').then((dataComparedObservationCriteria) => {
                expected = dataComparedObservationCriteria.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMoreEncounterCriteriaSection).should('exist').then((dataComparedMoreEncounterCriteria) => {
                expected = dataComparedMoreEncounterCriteria.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMeasureAttributesSection).should('exist').then((dataComparedMeasureAttributes) => {
                expected = dataComparedMeasureAttributes.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileItemSection).should('exist').then((dataComparedItem) => {
                expected = dataComparedItem.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEncounterPerformedSection).should('exist').then((dataComparedEncounterPerformed) => {
                expected = dataComparedEncounterPerformed.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEncounterCriteriaSection).should('exist').then((dataComparedEncounterCriteria) => {
                expected = dataComparedEncounterCriteria.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFilecomponentSection).should('exist').then((dataComparedcomponent) => {
                expected = dataComparedcomponent.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileCodeSection).should('exist').then((dataComparedCode) => {
                expected = dataComparedCode.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileClosingQualityMeasureDocumentSection).should('exist').then((dataComparedClosingQualityMeasureDocument) => {
                expected = dataComparedClosingQualityMeasureDocument.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPopulationCriteriaSection).should('exist').then((dataComparedAdditionalPopulationCriteria) => {
                expected = dataComparedAdditionalPopulationCriteria.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalObservationCriteriaSection).should('exist').then((dataComparedAdditionalObservationCriteria) => {
                expected = dataComparedAdditionalObservationCriteria.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalLibrarySection).should('exist').then((dataComparedAdditionalLibrary) => {
                expected = dataComparedAdditionalLibrary.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditinoalEncounterCriteriaSection).should('exist').then((dataComparedAdditinoalEncounterCriteria) => {
                expected = dataComparedAdditinoalEncounterCriteria.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })
    })

})

describe('QDM Measure Export, Not the Owner', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

        MeasuresPage.actionCenter('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        OktaLogin.UILogout()

    })
})

describe('Successful QDM Measure Export with versioned measure', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

        //version measure
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v1.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

    })

    it('Version measure, unzip the downloaded file, and verify file contents for the HR, for QDM Measure', () => {


        //read contents of the html / human readable file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HR file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.html')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)

            cy.readFile(baseHTMLFileCMSIdSection_Version).should('exist').then((dataComparedCMSId) => {
                expected = dataComparedCMSId.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileMetaDetailsSection).should('exist').then((dataComparedMetaDetails) => {
                expected = dataComparedMetaDetails.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })

            cy.readFile(baseHTMLFileValueSetSection).should('exist').then((dataComparedValueSet) => {
                expected = dataComparedValueSet.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')

    })
    it('On an versioned measure, verify the contents of the HQMF file, for a QDM Measure', () => {
        //read contents of the xml / HQMF file and compare that with the expected file contents (minus specific 
        //measure name and other data that can change from one generated HQMF file -to- the next)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.xml')).should('exist').then((exportedFile) => {
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents are: \n' + exported)
            cy.readFile(baseXMLFileVersionSection_ver1).should('exist').then((dataComparedVersion_ver1) => {
                expected = dataComparedVersion_ver1.toString() //'compareFile'
                cy.log('expected first section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileSubstanceAdminCriteriaSection).should('exist').then((dataComparedSubstanceAdminCriteria) => {
                expected = dataComparedSubstanceAdminCriteria.toString() //'compareFile'
                cy.log('expected second section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionDiabetesBlock).should('exist').then((dataComparedDefinitionSectionDiabetesBlock) => {
                expected = dataComparedDefinitionSectionDiabetesBlock.toString() //'compareFile'
                cy.log('expected second section Diabetes blcok file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionERDeptVisitBlock).should('exist').then((dataComparedDefinitionSectionERDeptVisitBlock) => {
                expected = dataComparedDefinitionSectionERDeptVisitBlock.toString() //'compareFile'
                cy.log('expected second section ER Department Visit block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionEncounterImpatientBlock).should('exist').then((dataComparedDefinitionSectionEncounterImpatientBlock) => {
                expected = dataComparedDefinitionSectionEncounterImpatientBlock.toString() //'compareFile'
                cy.log('expected second section Encounter Impatient Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionGlucoseLTMPVBlock).should('exist').then((dataComparedDefinitionSectionGlucoseLTMPVBlock) => {
                expected = dataComparedDefinitionSectionGlucoseLTMPVBlock.toString() //'compareFile'
                cy.log('expected second section Glucose LTMPV Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionHypoblycemicTreatMedBlock).should('exist').then((dataComparedDefinitionSectionHypoblycemicTreatMedBlock) => {
                expected = dataComparedDefinitionSectionHypoblycemicTreatMedBlock.toString() //'compareFile'
                cy.log('expected second section Hypoblycemic Treat Med Block file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileDefinitionSectionOSBlock).should('exist').then((dataComparedDefinitionSectionOSBlock) => {
                expected = dataComparedDefinitionSectionOSBlock.toString() //'compareFile'
                cy.log('expected second section Observation Services Blockfile contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileVersionNumberSection_ver1).should('exist').then((dataComparedVersionNumber_ver1) => {
                expected = dataComparedVersionNumber_ver1.toString() //'compareFile'
                cy.log('expected third section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFilePopCriteriaSection).should('exist').then((dataComparedPopCriteria) => {
                expected = dataComparedPopCriteria.toString() //'compareFile'
                cy.log('expected fourth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileObservationCriteriaSection).should('exist').then((dataComparedObservationCriteria) => {
                expected = dataComparedObservationCriteria.toString() //'compareFile'
                cy.log('expected Fifth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMoreEncounterCriteriaSection).should('exist').then((dataComparedMoreEncounterCriteria) => {
                expected = dataComparedMoreEncounterCriteria.toString() //'compareFile'
                cy.log('expected Sixth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileMeasureAttributesSection).should('exist').then((dataComparedMeasureAttributes) => {
                expected = dataComparedMeasureAttributes.toString() //'compareFile'
                cy.log('expected Seventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileItemSection).should('exist').then((dataComparedItem) => {
                expected = dataComparedItem.toString() //'compareFile'
                cy.log('expected Eighth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEncounterPerformedSection).should('exist').then((dataComparedEncounterPerformed) => {
                expected = dataComparedEncounterPerformed.toString() //'compareFile'
                cy.log('expected Ninth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileEncounterCriteriaSection).should('exist').then((dataComparedEncounterCriteria) => {
                expected = dataComparedEncounterCriteria.toString() //'compareFile'
                cy.log('expected Tenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFilecomponentSection).should('exist').then((dataComparedcomponent) => {
                expected = dataComparedcomponent.toString() //'compareFile'
                cy.log('expected Eleventh section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileCodeSection).should('exist').then((dataComparedCode) => {
                expected = dataComparedCode.toString() //'compareFile'
                cy.log('expected Twelfth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileClosingQualityMeasureDocumentSection).should('exist').then((dataComparedClosingQualityMeasureDocument) => {
                expected = dataComparedClosingQualityMeasureDocument.toString() //'compareFile'
                cy.log('expected Thirteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalPopulationCriteriaSection).should('exist').then((dataComparedAdditionalPopulationCriteria) => {
                expected = dataComparedAdditionalPopulationCriteria.toString() //'compareFile'
                cy.log('expected Fourteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalObservationCriteriaSection).should('exist').then((dataComparedAdditionalObservationCriteria) => {
                expected = dataComparedAdditionalObservationCriteria.toString() //'compareFile'
                cy.log('expected Fifteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditionalLibrarySection).should('exist').then((dataComparedAdditionalLibrary) => {
                expected = dataComparedAdditionalLibrary.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
            cy.readFile(baseXMLFileAdditinoalEncounterCriteriaSection).should('exist').then((dataComparedAdditinoalEncounterCriteria) => {
                expected = dataComparedAdditinoalEncounterCriteria.toString() //'compareFile'
                cy.log('expected Sixteenth section file contents are: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())
            })
        })
    })

})


