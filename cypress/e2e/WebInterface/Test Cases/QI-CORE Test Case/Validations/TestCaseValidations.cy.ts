import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MadieObject, PermissionActions, Utilities } from "../../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Environment } from "../../../../../Shared/Environment"

const harpUserALT = Environment.credentials().harpUserALT
const now = Date.now()
let measureName = 'TestMeasure' + now
let newMeasureName = ''
let newCqlLibraryName = ''
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + now
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'CMSTestSeries'
let TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + now

/*
    These tests all need to be updated to use QiCore STU6.
    They were written before we restricted the UI Builder to STU 6 only.

    Some tests also contain unverified changes to "measure sharing"
    https://jira.cms.gov/browse/MAT-7913
 */

// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
describe.skip('QI Core Gender, Race, and Ethnicity data validations: Create test case with Gender, Race, and Ethnicity data in Json', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

    it('Enter Valid Test Case Json that contains Gender, Race, and Ethnicity data and confirm those pieces of data appears on the element tab', () => {

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        TestCasesPage.clickEditforCreatedTestCase()

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

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
describe.skip('QI Core Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

    it('Edit current test case to add an additional race but include the same Gender, Race, and Ethnicity data', () => {

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        TestCasesPage.clickEditforCreatedTestCase()

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
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
        cy.get(TestCasesPage.genderDdOnElementTab).click()
        cy.get(TestCasesPage.genderSelectValuesElementTab).should('contain.text', 'Other').click()
        cy.get(TestCasesPage.raceOmbselectBoxElementTab).click()
        cy.get('#raceOMB-option-4').scrollIntoView().click({ force: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 20000)

        //verify updated list of values
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
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
describe.skip('QI Core Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value by a user whom the measure has been shared', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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

    it('Edit current test case to add an additional race, when the user has had the measure shared with them. The edit contains Gender, Race, and Ethnicity data.', () => {

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        TestCasesPage.clickEditforCreatedTestCase()

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
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
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        OktaLogin.AltLogin()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // add a new race OMB value
        cy.get(TestCasesPage.genderDdOnElementTab).click()
        cy.get(TestCasesPage.genderSelectValuesElementTab).should('contain.text', 'Other').click()
        cy.get(TestCasesPage.raceOmbselectBoxElementTab).click()
        cy.get('#raceOMB-option-4').scrollIntoView().click({ force: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 20000)

        //verify updated list of values
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
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
describe.skip('QI Core Gender, Race, and Ethnicity data validations: Edit Test Case to add another Race and include existing Gender, Race, and Ethnicity value when the user is not the owner nor has the measure been shared', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        TestCasesPage.clickEditforCreatedTestCase()

        //add json value to measure's test case
        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        Utilities.waitForElementVisible(TestCasesPage.jsonTab, 20000)
        cy.get(TestCasesPage.jsonTab).click()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)

        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')

        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // verify current values
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

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        cy.get(TestCasesPage.raceOmbselectBoxElementTab).should('be.disabled')

    })
})


describe('Test Case Validations', () => {

    beforeEach('Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
    })


    it('Edit Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })

    it('Create Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')

        cy.get(TestCasesPage.createTestCaseTitleInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.createTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })
})

describe('Attempting to create a test case without a title', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //save button to save the test case is not available
        cy.get(TestCasesPage.createTestCaseSaveButton).should('not.be.enabled')
    })

    it('Edit and update test case to have no title', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()

        cy.get(TestCasesPage.testCaseTitle).clear()

        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')

        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')

        //save button to save the test case is not available
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.be.enabled')
    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        cy.get(TestCasesPage.testCaseTitle).type('newTestCaseTitle')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })

    it('Validate dirty check on the test case description, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })

    it('Validate dirty check on the test case series, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })
})

describe('Duplicate Test Case Title and Group validations', () => {

    beforeEach('Create Measure, Test case and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Cleanup and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()

    })

    it('Create Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create second test case with same Test case and group name
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'An error occurred while creating the test case: The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })

    it('Edit Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create second test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('SecondTestCase'.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('SecondTestCaseGroup').type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        //Edit First Test case
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear().type('{selectall}{backspace}{selectall}{backspace}').type('SecondTestCase'.toString())
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear().type('SecondTestCaseGroup').type('{enter}')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.errorToastMsg).should('contain.text', 'The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })
})
