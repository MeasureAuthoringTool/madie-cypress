import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let singleTestCaseFile = 'SinglePatient_BonnieQDM56.json'
let smallBatchTestCaseFile = 'PatientBatchFile_BonnieQDM56.json'
let testCaseWInvalidGroup = 'TestingWithGroupInvalidCharacters.json'
let testCaseWInvalidTitle = 'TestingWithTitleInvalidCharacters.json'
let genericTextFile = 'GenericCQLBoolean.txt'
let measureCQLPFTests = MeasureCQL.simpleQDM_CQL
let editTestCaseURL = ''
let testCaseJsonTstOne = "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"1\",\"system\":\"2.16.840.1.113883.3.221.5\",\"version\":null,\"display\":null}],\"_id\":\"6553805d0aa75c0000707a8a\",\"qdmTitle\":\"Patient Characteristic Payer\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.58\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"payer\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicPayer\",\"codeListId\":\"2.16.840.1.114222.4.11.3591\",\"description\":\"Patient Characteristic Payer: Payer\",\"id\":\"645133ba118def0000463cf5\",\"relevantPeriod\":{\"low\":\"2012-05-02T08:00:00.000+00:00\",\"high\":\"2012-05-02T08:15:00.000+00:00\",\"lowClosed\":true,\"highClosed\":true}},{\"dataElementCodes\":[{\"code\":\"99395\",\"system\":\"2.16.840.1.113883.6.12\",\"version\":null,\"display\":null}],\"_id\":\"6553805d0aa75c0000707a8c\",\"participant\":[],\"relatedTo\":[],\"qdmTitle\":\"Encounter, Performed\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.5\",\"qdmCategory\":\"encounter\",\"qdmStatus\":\"performed\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::EncounterPerformed\",\"admissionSource\":null,\"authorDatetime\":\"2012-05-02T08:00:00.000+00:00\",\"codeListId\":\"2.16.840.1.113883.3.464.1003.101.12.1025\",\"description\":\"Encounter, Performed: Preventive Care Services Established Office Visit, 18 and Up\",\"diagnoses\":[],\"dischargeDisposition\":null,\"facilityLocations\":[],\"id\":\"645133c5118def0000463d01\",\"lengthOfStay\":null,\"priority\":null,\"relevantPeriod\":{\"low\":\"2012-05-02T08:00:00.000+00:00\",\"high\":\"2012-05-02T08:15:00.000+00:00\",\"lowClosed\":true,\"highClosed\":true}},{\"dataElementCodes\":[{\"code\":\"75622-1\",\"system\":\"2.16.840.1.113883.6.1\",\"version\":null,\"display\":null}],\"_id\":\"6553805d0aa75c0000707a8e\",\"performer\":[],\"relatedTo\":[],\"qdmTitle\":\"Laboratory Test, Performed\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.42\",\"qdmCategory\":\"laboratory_test\",\"qdmStatus\":\"performed\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::LaboratoryTestPerformed\",\"authorDatetime\":\"2012-05-02T08:00:00.000+00:00\",\"codeListId\":\"drc-e6dbb081bf69856d28619b4d19cdf56358f082b4514d4ac0fd8fa3b619c37bd7\",\"components\":[],\"description\":\"Laboratory Test, Performed: HIV 1 and 2 tests - Meaningful Use set\",\"id\":\"64513481118def0000463d2e\",\"interpretation\":null,\"method\":null,\"negationRationale\":null,\"reason\":null,\"referenceRange\":null,\"relevantDatetime\":\"2012-05-02T08:00:00.000+00:00\",\"relevantPeriod\":{\"low\":\"2012-05-02T08:00:00.000+00:00\",\"high\":\"2012-05-02T08:15:00.000+00:00\",\"lowClosed\":true,\"highClosed\":true},\"result\":null,\"resultDatetime\":\"2012-05-02T08:00:00.000+00:00\",\"status\":null},{\"dataElementCodes\":[{\"code\":\"F\",\"system\":\"2.16.840.1.113883.5.1\",\"version\":null,\"display\":\"Female\"}],\"_id\":\"6553805d0aa75c0000707a90\",\"qdmTitle\":\"Patient Characteristic Sex\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.55\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"gender\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicSex\",\"codeListId\":\"2.16.840.1.113762.1.4.1\",\"description\":\"Patient Characteristic Sex: ONCAdministrativeSex\",\"id\":\"6451331dd2d5770121fc165e\"},{\"dataElementCodes\":[],\"_id\":\"6553805d0aa75c0000707a92\",\"qdmTitle\":\"Patient Characteristic Birthdate\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.54\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"birthdate\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicBirthdate\",\"birthDatetime\":\"1991-10-21T08:00:00.000+00:00\",\"codeListId\":null,\"description\":null,\"id\":\"6452aada30d26c0000f1aa56\"},{\"dataElementCodes\":[{\"code\":\"2106-3\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":null,\"display\":\"White\"}],\"_id\":\"6553805d0aa75c0000707a94\",\"qdmTitle\":\"Patient Characteristic Race\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.59\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"race\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicRace\",\"codeListId\":\"2.16.840.1.114222.4.11.836\",\"description\":\"Patient Characteristic Race: Race\",\"id\":\"6451331dd2d5770121fc1665\"},{\"dataElementCodes\":[{\"code\":\"2135-2\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":null,\"display\":\"Hispanic or Latino\"}],\"_id\":\"6553805d0aa75c0000707a96\",\"qdmTitle\":\"Patient Characteristic Ethnicity\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.56\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"ethnicity\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicEthnicity\",\"codeListId\":\"2.16.840.1.114222.4.11.837\",\"description\":\"Patient Characteristic Ethnicity: Ethnicity\",\"id\":\"6451331dd2d5770121fc165f\"}],\"_id\":\"6553805d0aa75c0000707a88\",\"birthDatetime\":\"1991-10-21T08:00:00.000+00:00\",\"extendedData\":null}"

describe('Import Test cases onto an existing QDM measure via file', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Import new test case onto an existing measure -- single test case and verify JSON', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.measureAction("edit")

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get('[data-testid="file-drop-div"] > p').click()
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)
        //cy.get('[data-testid="test-case-import-import-btn"]').click()

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalList).should('contain.text', 'TestFemale')

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Test')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Female')

        //click on action button
        cy.get(TestCasesPage.qdmTestCaseViewBtn).click()
        //click on edit 
        cy.get(TestCasesPage.editBtnNoId).contains('edit').click()

        //get current web address and use that to form API request to validate JSON
        cy.window().then((win) => {
            cy.log((win.location).toString())
            editTestCaseURL = (win.location).toString()
            let urlSectionid = editTestCaseURL.split('/')
            let Measure4tcID = urlSectionid[4]
            let testCaseID = urlSectionid[7]
            OktaLogin.Logout()
            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.request({
                    url: '/api/measures/' + Measure4tcID + '/test-cases/' + testCaseID,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.json).to.be.exist
                    expect(response.body.json).to.eql(testCaseJsonTstOne)

                })
            })
        })
    })

    it('Import new test case onto an existing measure -- small batch file', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.measureAction("edit")

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(smallBatchTestCaseFile)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalList).should('contain.text', 'CMS844_DYvonneCMS844_CYvonneCMS844_BYvonneCMS844_AYvonne')

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'CMS844_AYvonne')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'CMS844_BYvonne')
        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'CMS844_CYvonne')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'CMS844_DYvonne')

        for (let i = 0; i <= 3; i++) {
            //click on action button
            cy.get(TestCasesPage.qdmTestCaseViewBtn).eq(i).click()
            //click on edit
            cy.get(TestCasesPage.editBtnNoId).contains('edit').click()
            cy.get('[data-testid="json-tab"]').click()
            cy.get('[class="ace_content"]').should('contain', 'qdmTitle')
            cy.get(EditMeasurePage.testCasesTab).click()
        }
    })

    it('Verify error message when a Text file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Attach Text file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(genericTextFile)

        //error in import modal window
        cy.get('[class="toast danger"]').should('contain.text', 'An error occurred while validating the import file. Please try again or reach out to the Help Desk.')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })

    it('Verify error message when an invalid / empty Json file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Upload invalid Json file
        cy.get(TestCasesPage.filAttachDropBox).attachFile('example.json')

        //message in import modal window about the file being empty
        cy.get('[class="toast danger"]').should('contain.text', 'No patients were found in the selected import file!')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })
})

//skipping all test case import tests until flag is removed
describe.skip('Import Test Case: Ownership', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQLPFTests, false, true)
        OktaLogin.AltLogin()
        //click on the all measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName, false, true)

    })
    it('Verify that non-owner cannot click on the import test cases button', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click().wait(500)
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 47700)

        //click on the all measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).should('not.be.enabled')
    })
})

//skipping all test case import tests until flag is removed
describe.skip('Import Test cases onto an existing QDM measure via file -- Message that appears when invalid characters are using in the Title or Group', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })


    it('Import new test case onto an existing measure -- when group has special characters', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.measureAction("edit")

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(testCaseWInvalidGroup)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalHeader).should('contain.text', 'TestingWithGroupInvalidCharacters.json')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('POST', '/api/measures/' + measureID + '/test-cases/list').as('testCaseList')
            //click import button on modal window
            cy.get(TestCasesPage.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(TestCasesPage.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 50000)
        })
        Utilities.waitForElementVisible(TestCasesPage.importWarningMessages, 30000)
        cy.get(TestCasesPage.importWarningMessages).should('include.text', '(0) test case(s) were imported. The following (1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.')
        cy.get(TestCasesPage.importWarningMessages).should('include.text', ' Reason: Test Cases Group or Title cannot contain special characters.')
    })

    it('Import new test case onto an existing measure -- when title has special characters', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.measureAction("edit")

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(testCaseWInvalidTitle)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalHeader).should('contain.text', 'TestingWithTitleInvalidCharacters.json')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('POST', '/api/measures/' + measureID + '/test-cases/list').as('testCaseList')
            //click import button on modal window
            cy.get(TestCasesPage.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(TestCasesPage.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 50000)
        })
        Utilities.waitForElementVisible(TestCasesPage.importWarningMessages, 30000)
        cy.get(TestCasesPage.importWarningMessages).should('include.text', '(0) test case(s) were imported. The following (1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.')
        cy.get(TestCasesPage.importWarningMessages).should('include.text', ' Reason: Test Cases Group or Title cannot contain special characters.')
    })



})
