import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../../Shared/Header"

const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let measureCQLPFTests = MeasureCQL.CQL_Populations
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let validFileToUpload = downloadsFolder.toString()

describe('QI-Core: Export Bundle options for Non Measure Owner: Transaction or Collection', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export single QI-Core Test case by Non Measure Owner: Transaction', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        //cy.reload()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportTransactionTypeOption).click()

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

    })

    it('Export single QI-Core Test case by Non Measure Owner: Collection', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

    })
})

describe('QI-Core: Single Test Case on Measure: Export / Import Bundle options: Transaction', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export single QI-Core Test case Transaction bundle and Import to the same Measure', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export transaction
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportTransactionTypeOption).click()

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/ASBTestSeriesTitle for Auto Test' + testCaseDescription + todaysDate + 'Edit')

        //navigate to test case edit / detail page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')

    })
})
describe('QI-Core: Multiple Test Case on Measure: Export / Import Bundle options: Transaction', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseSeries + 'a', testCaseDescription + 'a', testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseSeries + 'b', testCaseDescription + 'b', testCaseJson, false, true)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export multiple QI-Core Test cases Transaction bundle and Import to the same Measure', () => {
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export both text cases
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportTransactionTypeOption).click()

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/A' + testCaseSeries + 'b' + 'Title for Auto Testb' + testCaseDescription + 'b' + todaysDate + 'Edit1N/A' + testCaseSeries + 'a' + 'Title for Auto Testa' + testCaseDescription + 'a' + todaysDate + 'Edit')

        //navigate to test case edit / detail page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')


    })
})

describe('QI-Core: Single Test Case on Measure: Export / Import Bundle options: Collection', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export single QI-Core Test case Collection bundle and Import to the same Measure', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export transaction
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/ASBTestSeriesTitle for Auto Test' + testCaseDescription + todaysDate + 'Edit')

        //navigate to test case edit / detail page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')

    })
})
describe('QI-Core: Multiple Test Case on Measure: Export / Import Bundle options: Collection', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseSeries + 'a', testCaseDescription + 'a', testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseSeries + 'b', testCaseDescription + 'b', testCaseJson, false, true)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export multiple QI-Core Test cases Collection bundle and Import to the same Measure', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export both text cases
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/ASBTestSeriesbTitle for Auto Testb' + testCaseDescription + 'b' + todaysDate + 'Edit1N/ASBTestSeriesaTitle for Auto Testa' + testCaseDescription + 'a' + todaysDate + 'Edit')

        //navigate to test case edit / detail page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')


    })
})
