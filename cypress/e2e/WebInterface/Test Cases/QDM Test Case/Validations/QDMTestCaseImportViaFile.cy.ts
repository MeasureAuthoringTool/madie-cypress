import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let singleTestCaseFile = 'CMS1213FHIRv0_stc.json'
let smallBatchTestCaseFile = 'CMS1213FHIRv0_sbf.json'
let genericTextFile = 'GenericCQLBoolean.txt'
let mesureCQLPFTests = MeasureCQL.simpleQDM_CQL
let editTestCaseURL = ''
let testCaseJsonTstOne = TestCaseJson.singleTC4Import
let testCaseJsonTstSmallBatch00 = TestCaseJson.smallBatchTC4ImportId0
let testCaseJsonTstSmallBatch01 = TestCaseJson.smallBatchTC4ImportId1
let testCaseJsonTstSmallBatch02 = TestCaseJson.smallBatchTC4ImportId2
let testCaseJsonTstSmallBatch03 = TestCaseJson.smallBatchTC4ImportId3
let testCaseJsonTstSmallBatch04 = TestCaseJson.smallBatchTC4ImportId4
let testCaseJsonTstSmallBatch05 = TestCaseJson.smallBatchTC4ImportId5

//skipping all test case import tests until flag is removed
describe.skip('Import Test cases onto an existing measure via file', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, mesureCQLPFTests, false, false)
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
        //wait for alert / succesful save message to appear
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
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)

        //import moadal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalList).should('contain.text', 'EncounterStatusMultiPerson')

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'EncounterStatusMulti')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Person')

        //click on action button
        cy.get(TestCasesPage.actionBtnNoId).eq(0).click()
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
    //skipping, for now, because full import functionality is not, currently, available
    it.skip('Import new test case onto an existing measure -- small batch file', () => {
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

        //import moadal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalList).should('contain.text', 'NumFailMedAdminStatus')

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NumFail')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NoServiceRequest')
        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'IPFail')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NoDiabetesCondition')


        //get current web address and use that to form API request to validate JSON
        for (let i = 0; i <= 5; i++) {
            //click on action button
            cy.get(TestCasesPage.actionBtnNoId).eq(i).click()
            //click on edit 
            cy.get(TestCasesPage.editBtnNoId).contains('edit').click()
            cy.window().then((win) => {
                cy.log((win.location).toString())
                editTestCaseURL = (win.location).toString()
                let urlSectionid = editTestCaseURL.split('/')
                let Measure4tcID = urlSectionid[4]
                let testCaseID = urlSectionid[7]
                cy.log(Measure4tcID)
                cy.log(testCaseID)
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
                        switch (i) {
                            case 0:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch00)
                                break;
                            case 1:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch01)
                                break;
                            case 2:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch02)
                                break;
                            case 3:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch03)
                                break;
                            case 4:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch04)
                                break;
                            case 5:
                                expect(response.body.json).to.eql(testCaseJsonTstSmallBatch05)
                                break;
                        }
                    })
                })
            })
            OktaLogin.Login()
            //click on created measure
            MeasuresPage.measureAction("edit")
            cy.get(EditMeasurePage.testCasesTab).click()
        }

    })
    //skipping, for now, because full import functionality is not, currently, available
    it.skip('Verify error message when a Text file is imported', () => {
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
        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('contain.text', 'An error occurred while validating the import file. Please try again or reach out to the Help Desk.')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })

    //skipping, for now, because full import functionality is not, currently, available
    it.skip('Verify error message when an invalid / empty Json file is imported', () => {
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
        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('contain.text', 'No patients were found in the selected import file!')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })
})
//skipping all test case import tests until flag is removed
describe.skip('Import Test Case: Ownership', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, mesureCQLPFTests, false, true)
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
        //wait for alert / succesful save message to appear
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

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).should('not.be.enabled')
    })
})