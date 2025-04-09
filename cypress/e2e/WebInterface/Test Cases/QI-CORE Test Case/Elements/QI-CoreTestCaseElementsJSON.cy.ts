import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MadieObject, PermissionActions, Utilities } from "../../../../../Shared/Utilities"
import { TestCase, TestCaseAction, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Environment } from "../../../../../Shared/Environment"
import { Header } from "../../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_missingMetaProfile
let measureCQL6 = MeasureCQL.CQL_BoneDensity_Proportion_Boolean
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let harpUserALT = Environment.credentials().harpUserALT
let TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()

/*
    These tests all need to be updated to use QiCore STU6.
    They were written before we restricted the UI Builder to STU 6 only.

    Some tests also contain unverified changes to "measure sharing"
    https://jira.cms.gov/browse/MAT-7913
 */

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

    it('Enter Valid Test Case Json that contains DOB, Gender, Race, and Ethnicity data and confirm those pieces of data appears on the element tab', () => {

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

    it('Edit current test case to add an additional race but include the same DOB, Gender, Race, and Ethnicity data', () => {

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

    it('Edit current test case to add an additional race, when the user has had the measure shared with them. The edit contains DOB, Gender, Race, and Ethnicity data.', () => {

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
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        OktaLogin.AltLogin()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.elementsTab, 20000)
        cy.get(TestCasesPage.elementsTab).click()

        // add a new race OMB value
        cy.get(TestCasesPage.dobSelectValueElementTab).find('[id="date"]').type('{moveToStart}{home}{ctrl+a}{del}{moveToStart}{home}').type('05/27/1981')
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

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

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
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, null, null, null, null, null, null, null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Edit QI-Core Test Case Ethnicity', () => {

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit Test Case Ethnicity
        cy.get('[id="ethnicityDetailed"]').click()
        cy.get('[id="ethnicityDetailed-option-0"]').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.ethnicityDetailedElementTab).should('contain.text', 'Mexican', 'Spaniard')

    })

    it('Non Measure owner unable to Edit Test case ethnicity', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get('[id="ethnicityDetailed"]').should('be.disabled')

    })



})
// skipping the below test until the feature flag controlling the element tab for QI Core Test Cases is removed
// attempt to edit test case race fields if user is not th owner and whom the measure has not been shared
describe.skip('QI-Core 6 Test Case Element tab tests', () => {
    beforeEach('Create Measure, Measure Group and Test Case', () => {

        //Create New Measure
        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore6, null, measureCQL6)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Remove test case attributes', () => {

        OktaLogin.Login()

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        // these only show for STU6
        cy.get(TestCasesPage.jsonTab).should('be.visible').and('be.enabled')
        cy.get(TestCasesPage.elementsTab).should('be.visible').and('have.attr', 'aria-selected', 'true')
        cy.reload()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 150000)
        cy.get(TestCasesPage.plusIcon).eq(3).click()

        cy.get(TestCasesPage.testCaseAddedElementTab).click()
        cy.get('[data-testid="create-test-case-form"]')
            .find('[class="allotment-wrapper"]')
            .find('[class="split-view split-view-horizontal split-view-separator-border allotment-module_splitView__L-yRc allotment-module_horizontal__7doS8 allotment-module_separatorBorder__x-rDS"]')
            .find('[data-testid="elements-content"]')
            .find('[class="panel-content-pane"]')
            .find('[class="MuiBox-root css-1yuhvjn"]')
            .get(TestCasesPage.elementActionBtn).should('include.text', 'Actions').click().wait(1000)

        cy.get('[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper MuiMenu-paper css-pwxzbm"]')
            .find('[class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9"]')
            .get(TestCasesPage.elementActionEditBtn).eq(0).contains('Edit').click().wait(1000)

        cy.get('[data-testid="elements-content"]').find('[class="panel-content-pane"]')
            .find('[data-testid="tc-builder-resource-editor"]')
            .find('[class="MuiBox-root css-am8yia"]')
            .find('[class="MuiBox-root css-1rtq33e"]')
            .find('[class="MuiTabs-root MuiTabs-vertical css-n38zky"]')
            .find('[class="MuiTabs-scroller MuiTabs-hideScrollbar MuiTabs-scrollableY css-ccrt04"]')
            .find('[class="MuiTabs-flexContainer MuiTabs-flexContainerVertical css-j7qwjs"]')
            .get(TestCasesPage.elementMetaTabBtn).eq(3).scrollIntoView().contains('meta').click()
        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterBtn, 50000)
        cy.get(TestCasesPage.elementActionCenterBtn).scrollIntoView()
        cy.get(TestCasesPage.elementActionCenterBtnIcon).scrollIntoView()
        cy.get(TestCasesPage.elementActionCenterBtnIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterDeleteBtn, 50000)
        cy.get(TestCasesPage.elementActionCenterDeleteBtn).eq(1).click()

        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterConfirmDialog, 50000)

        cy.get(TestCasesPage.actionConfirmDialogMsg).should('include.text', 'Are you sure you want to delete Patient.meta?')
        cy.get(CQLEditorPage.deleteCancelButton).click()
        Utilities.waitForElementVisible(TestCasesPage.elementMetaTabBtn, 50000)

        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterBtn, 50000)
        cy.get(TestCasesPage.elementActionCenterBtn).scrollIntoView()
        cy.get(TestCasesPage.elementActionCenterBtnIcon).scrollIntoView()
        cy.get(TestCasesPage.elementActionCenterBtnIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterDeleteBtn, 50000)
        cy.get(TestCasesPage.elementActionCenterDeleteBtn).eq(1).click()

        Utilities.waitForElementVisible(TestCasesPage.elementActionCenterConfirmDialog, 50000)
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(TestCasesPage.elementMetaTabBtn).should('not.include.text', 'meta')
    })
})