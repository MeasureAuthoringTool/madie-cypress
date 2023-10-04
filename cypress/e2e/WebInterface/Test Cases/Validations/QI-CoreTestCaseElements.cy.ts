import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Environment } from "../../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_missingMetaProfile
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()

// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
describe.skip('QI Core DOB, Gender, Race, and Ethnicity data validations: Create test case with Gender, Race, and Ethnicity data in Json', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Enter Valid Test Case Json that contains DOB, Gender, Race, and Ethnicity data and confirm those pieces of data appears on the element tab', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(800)

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '02/10/1954')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Male')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')

    })
})

// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
// edit test case by adding more race values
describe.skip('QI Core DOB, Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Edit current test case to add an additional race but include the same DOB, Gender, Race, and Ethnicity data', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(800)

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '02/10/1954')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Male')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')

        // add a new race OMB value
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').type('{moveToStart}{home}{ctrl+a}{del}{moveToStart}{home}').type('05/27/1981')
        cy.get(TestCasesPage.genderSelectBoxElementTab).click()
        cy.get(TestCasesPage.genderSelectValuesElementTab).should('contain.text', 'Other').click()
        cy.get(TestCasesPage.raceOmbselectBoxElementTab).click()
        cy.get('#raceOMB-option-4').scrollIntoView().click({ force: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 20000)

        //verify updated list of values
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '05/27/1981')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Other')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Other Race')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')

    })
})

// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
// edit test case race fields if user is someone whom the measure has been shared
describe.skip('QI Core DOB, Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value by a user whom the measure has been shared', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Edit current test case to add an additional race, when the user has had the measure shared with them. The edit contains DOB, Gender, Race, and Ethnicity data.', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(800)

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '02/10/1954')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Male')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')
        OktaLogin.Logout()

        // share measure
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //share measure
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

        OktaLogin.AltLogin()

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // add a new race OMB value
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').type('{moveToStart}{home}{ctrl+a}{del}{moveToStart}{home}').type('05/27/1981')
        cy.get(TestCasesPage.genderSelectBoxElementTab).click()
        cy.get(TestCasesPage.genderSelectValuesElementTab).should('contain.text', 'Other').click()
        cy.get(TestCasesPage.raceOmbselectBoxElementTab).click()
        cy.get('#raceOMB-option-4').scrollIntoView().click({ force: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 20000)

        //verify updated list of values
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '05/27/1981')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Other')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Other Race')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')

    })
})

// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
// attempt to edit test case race fields if user is not th owner and whom the measure has not been shared
describe.skip('QI Core DOB, Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value when the user is not the owner nor has the measure been shared', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Attempt to edit current test case to add an additional race, when the user is not the owner nor when the user has had the measure shared with them.', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(800)

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').should('contain.value', '02/10/1954')
        cy.get(TestCasesPage.genderDdOnElementTab).should('contain.text', 'Male')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'White')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'American Indian or Alaska Native')
        cy.get(TestCasesPage.raceOmbElementTab).should('contain.text', 'Asian')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Shoshone')
        cy.get(TestCasesPage.raceDetailedElementTab).should('contain.text', 'Filipino')
        cy.get(TestCasesPage.ethnicityOmbElementTab).should('contain.text', 'Hispanic or Latino')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Dominican')
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican')
        OktaLogin.Logout()

        // share measure
        cy.clearCookies()
        cy.clearLocalStorage()

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 20000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        cy.get(TestCasesPage.raceOmbselectBoxElementTab).should('be.disabled')

    })
})

//Skipping until QI Core Element tab feature flag is removed
describe.skip('QI-Core Test Case Element tab tests', () => {

    beforeEach('Create Measure, Measure Group and Test Case', () => {

        //Create New Measure
        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, null, null, null, null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Edit QI-Core Test Case Ethnicity', () => {

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit Test Case Ethnicity
        cy.get('[id="ethnicityDetailed"]').click()
        cy.get('[id="ethnicityDetailed-option-0"]').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get('[data-testid="demographics-ethnicity-detailed-input"]').should('contain.text', 'Mexican', 'Spaniard')

    })

    it('Non Measure owner unable to Edit Test case ethnicity', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get('[id="ethnicityDetailed"]').should('be.disabled')

    })
})
