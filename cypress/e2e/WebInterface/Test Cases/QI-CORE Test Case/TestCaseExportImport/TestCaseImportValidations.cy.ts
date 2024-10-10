import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Header } from "../../../../../Shared/Header"
import { Environment } from "../../../../../Shared/Environment"

let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let versionNumber = '1.0.000'
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Passing Test Case'
let secondTestCaseTitle = 'Failing Test Case'
let testCaseDescription = 'DENOMPass' + Date.now()
let secondTestCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeriesP'
let secondTestCaseSeries = 'SBTestSeriesF'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
let measureCQLPFTests = MeasureCQL.CQL_Populations
let validFileToUpload = downloadsFolder.toString()
let invalidFileToUpload = 'cypress/fixtures'
let firstMeasureName = ''
let updatedCQLLibraryName = ''

describe('Test Case Import: functionality tests', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)


        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Measure is not owned by nor shared with user: import button is not available', () => {

        OktaLogin.AltLogin()
        cy.reload()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 45000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementDisabled(TestCasesPage.importNonBonnieTestCasesBtn, 35000)


    })
    it('Measure is in DRAFT status: measure has been shared with user: import button is available, import can occur, import can be cancelled and modal will close, upon cancelling', () => {

        OktaLogin.Login()
        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.testCaseAction('edit', true)

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        OktaLogin.UILogout()
        //Share Measure with ALT User
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()

        //navigating to the All Measures tab
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export test case
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().wait(1000).click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).wait(2000).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        cy.get(EditMeasurePage.testCasesTab).click()
        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        //verify confirmation message
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 35000)
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', '(2) Test cases imported successfully')

        //export test case
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).wait(2000).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        cy.get(EditMeasurePage.testCasesTab).click()
        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //cancel import
        cy.get(TestCasesPage.importTestCaseCancelBtnOnModal).click()

        //confirm modal window is no longer present
        //wait until select / drag and drop modal no longer appears
        Utilities.waitForElementToNotExist(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)
    })

})

describe('Test Case Import validations for versioned Measures', () => {


    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)
        OktaLogin.Login()
    })

    it('Measure is in VERSIONED status: user is owner: import button is not available', () => {

        //Click on Version Measure
        MeasuresPage.actionCenter('version')

        //Version measure and verify that it was versioned
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        Utilities.waitForElementEnabled(MeasuresPage.measureVersionContinueBtn, 60000)
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.enabled')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Version Created Successfully')

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementDisabled(TestCasesPage.importNonBonnieTestCasesBtn, 35000)

    })

    it('Measure is in VERSIONED status: measure has been shared with user: import button is not available', () => {

        //Click on Version Measure
        MeasuresPage.actionCenter('version')

        //Version measure and verify that it was versioned
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        Utilities.waitForElementEnabled(MeasuresPage.measureVersionContinueBtn, 60000)
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.enabled')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Version Created Successfully')

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Share Measure with ALT User
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()

        //navigating to the All Measures tab
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 45000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').wait(4000)
        cy.get(MeasuresPage.allMeasuresTab).click().wait(4000)

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 45000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(4000)
        cy.get(Header.cqlLibraryTab).click().wait(4000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 45000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(4000)
        cy.get(Header.mainMadiePageButton).click().wait(4000)

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 45000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementDisabled(TestCasesPage.importNonBonnieTestCasesBtn, 35000)

    })
})
describe('Test Case Import: File structure Not Accurate validation tests', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()

    })
    it('Importing: not a .zip file', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(invalidFileToUpload, 'CQLCsNoVersionVSACExists.txt'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportErrorOnImport, 35000)
        cy.get('[data-testid="test-case-import-error-div"] > small').should('contain.text', 'The import file must be a zip file. No Test Cases can be imported.')

    })
    it('Importing: .zip\'s test case folder does not contain a json file', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(invalidFileToUpload, 'eCQMTitle-v0.0.000-FHIR4-TestCases (4).zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (4).zip')

        //verifies alert message at top of page informing user that no test case was imported
        cy.get('[data-testid="test-case-import-error-div"] > small').should('contain.text', 'Unable to find any valid test case json. Please make sure the format is accurate')
    })
    it('Importing: .zip\'s test case folder contains multiple json files', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(invalidFileToUpload, 'eCQMTitle-v0.0.000-FHIR4-TestCases (3).zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (3).zip')

        //verifies alert message at tope of page informing user that no test case was imported
        cy.get('[data-testid="test-case-import-error-div"] > small').should('contain.text', 'Unable to find any valid test case json. Please make sure the format is accurate')
    })
    it('Importing: .zip\'s test case folder contains malformed json file', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(invalidFileToUpload, 'eCQMTitle-v0.0.000-FHIR4-TestCases (5).zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (5).zip')

        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('include.text', 'Zip file is in an incorrect format. If this is an export prior to June 20, 2024 please reexport your test case and try again.')

    })
})
describe('Test Case Import: New Test cases on measure validations: uniqueness tests related to family name and given name', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(firstMeasureName, updatedCQLLibraryName)
        Utilities.deleteMeasure(measureName + 'b', CqlLibraryName, true)
    })
    it('Importing two new test cases with unique family name and given name: verify expected match that of original test case; verify family name is Test Case group; verify that given name is Test Case title; verify that test case is editable', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        CqlLibraryName = 'TestLibrary6' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'b', CqlLibraryName, measureCQLPFTests, 2)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().wait(1000).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(true, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonLizzy, true)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle + 'b2', secondTestCaseSeries + 'b2', secondTestCaseDescription + 'b2', validTestCaseJsonBobby, true, true)
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc)
            .click()
            .type('Some description')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMsg, 35000)
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group updated successfully.')

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit', 2)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export test case
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).wait(2000).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), {
            action: 'drag-drop',
            force: true
        })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        //verify confirmation message
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseSuccessInfo, 35000)

        cy.get(TestCasesPage.importTestCaseSuccessInfo).should('contain.text', 'Following test case(s) were imported successfully, but the measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been')

    })
})

describe('Test case uniqueness error validation', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, and create group', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(firstMeasureName, updatedCQLLibraryName)
    })
    it('Export existing test case, then delete the existing test case, then create new test case with previous series and title and, then, attempt to import previously exported test case: verify uniqueness error', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        CqlLibraryName = 'TestLibrary6' + Date.now()

        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonBobby, false, false, false)

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export test case
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        //delete test case
        TestCasesPage.testCaseAction('delete')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist').wait(500)
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle + 'b1')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription + 'b1')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries + 'b1').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        cy.reload()
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

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
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click().wait(2000)

        //verifies alert message at top of page informing user that no test case was imported
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseAlertMessage, 35000)
        cy.get(TestCasesPage.importTestCaseAlertMessage).find('[id="content"]').should('contain.text', '(0) test case(s) were imported. The following (1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.')
        cy.get('[id="content"]').find('[data-testid="failed-test-cases"]').find('[class="sc-hCPjZK iYkvOm"]').should('contain.text', 'Reason: The Test Case Group and Title are already used in another test case on this measure. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })

})
describe('Test Case Import: New Test cases on measure validations: PC does not match between measures', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(firstMeasureName, updatedCQLLibraryName)

    })
    it('Importing two new test cases with the pc not matching on the measure in which the test cases is being imported into', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        CqlLibraryName = 'TestLibrary6' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'b', CqlLibraryName, measureCQLPFTests, 2)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonLizzy, true, false)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle + 'b2', secondTestCaseSeries + 'b2', secondTestCaseDescription + 'b2', validTestCaseJsonBobby, true, true)
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit', 2)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //export test case
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

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

        //verifies alert message at tope of page informing user that no test case was imported
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseAlertMessage, 35000)
        cy.get(TestCasesPage.importTestCaseAlertMessage).find('[id="content"]').should('contain.text', 'Following test case(s) were imported successfully, but the measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been')
    })
})

