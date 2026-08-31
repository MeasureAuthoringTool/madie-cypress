import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasureCQL } from '../../../../../Shared/MeasureCQL'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'

let measureName: string
let cqlLibraryName: string
let testCaseDescription: string
let updatedTestCaseDescription: string

const testCaseTitle = 'test case title'
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const testCaseSeries = 'SBTestSeries'
const twoFiftyTwoCharacters =
    'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
const updatedTestCaseSeries = 'CMSTestSeries'

const initializeTestData = (): void => {
    const suffix = `${Date.now()}${Cypress._.random(100000, 999999)}`
    measureName = `TCValidations${suffix}`
    cqlLibraryName = `TCValidationsLib${suffix}`
    testCaseDescription = `DENOMFail${suffix}`
    updatedTestCaseDescription = `${testCaseDescription} UpdatedTestCaseDescription`
}

const createMeasureViaApi = (cql = measureCQL): void => {
    initializeTestData()
    CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, cql)
}

const createRatioMeasureViaApi = (): void => {
    createMeasureViaApi(measureCQL)
    MeasureGroupPage.CreateRatioMeasureGroupAPI(
        false,
        false,
        'Surgical Absence of Cervix',
        'Surgical Absence of Cervix',
        'Surgical Absence of Cervix',
        'Procedure'
    )
}

const createCohortMeasureViaApi = (): void => {
    createMeasureViaApi(measureCQL)
    MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Procedure')
}

const createTestCaseViaApi = (jsonValue?: string, secondTestCase?: boolean): void => {
    TestCasesPage.CreateTestCaseAPI(
        secondTestCase ? 'SecondTestCase' : testCaseTitle,
        secondTestCase ? 'SecondTestCaseGroup' : testCaseSeries,
        testCaseDescription,
        jsonValue,
        false,
        secondTestCase
    )
}

describe('Create Test Case Validations', () => {
    beforeEach('Login', () => {
        createMeasureViaApi()
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
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
        cy.get(TestCasesPage.createTestCaseTitleInlineError).contains(
            'Test Case Title cannot be more ' + 'than 250 characters.'
        )
    })

    it('Create Test Case: Group has more than 250 characters', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters)
        cy.get('[data-testid*="Add"]').last().click()
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseGroupInlineError).contains(
            'Test Case Group cannot be more ' + 'than 250 characters.'
        )
    })
})

describe('Edit Test Case Validations', () => {
    beforeEach('Create measure, test case, and login', () => {
        createMeasureViaApi()
        createTestCaseViaApi(validTestCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Edit Test Case: Description more than 250 characters', () => {
        MeasuresPage.actionCenter('edit')
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseDescriptionTextBox)
        TestCasesPage.replaceTestCaseDetailsInput(TestCasesPage.testCaseDescriptionTextBox, twoFiftyTwoCharacters)
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseDescriptionInlineError).should(
            'contain.text',
            'Test Case Description cannot be more than 250 characters.'
        )
    })

    it('Edit Test Case: Title more than 250 characters', () => {
        MeasuresPage.actionCenter('edit')
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseTitle)
        TestCasesPage.replaceTestCaseDetailsInput(TestCasesPage.testCaseTitle, twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseGroupInput).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTCSaveTooltip).should(
            'have.attr',
            'aria-label',
            'title: Test Case Title cannot be more than 250 characters.'
        )
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains(
            'Test Case Title cannot be more ' + 'than 250 characters.'
        )
    })

    it('Edit Test Case: Group more than 250 characters', () => {
        MeasuresPage.actionCenter('edit')
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openDetailsTab(TestCasesPage.createTestCaseGroupInput)
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })
})

describe('Attempting to create a test case without a title', () => {
    beforeEach('Create measure and login', () => {
        createRatioMeasureViaApi()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
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
})

describe('Editing a test case without a title', () => {
    beforeEach('Create measure, test case, and login', () => {
        createRatioMeasureViaApi()
        createTestCaseViaApi(validTestCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Edit and update test case to have no title', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseTitle)

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
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(updatedTestCaseSeries).type('{enter}')

        //save button to save the test case is not available
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.be.enabled')
    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseTitle)

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

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseDescriptionTextBox)

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

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        TestCasesPage.openDetailsTab(TestCasesPage.createTestCaseGroupInput)

        //Update Test Case Series
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(updatedTestCaseSeries)
        cy.contains('Add "' + updatedTestCaseSeries + '"').click()

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
        createCohortMeasureViaApi()
        createTestCaseViaApi()
        OktaLogin.Login()
    })

    afterEach('Cleanup and Logout', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
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

        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.visible').should('be.enabled').click()

        cy.get(EditMeasurePage.errorMessage).should(
            'contain.text',
            'An error occurred while creating the test case: The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.'
        )
    })
})

describe('Edit Duplicate Test Case Title and Group validations', () => {
    beforeEach('Create measure, two test cases, and login', () => {
        createCohortMeasureViaApi()
        createTestCaseViaApi()
        createTestCaseViaApi(undefined, true)
        OktaLogin.Login()
    })

    afterEach('Cleanup and Logout', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Edit Test Case: Verify error message when the Test case Title and group names are duplicate', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Edit First Test case
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openDetailsTab(TestCasesPage.testCaseTitle)
        TestCasesPage.replaceTestCaseDetailsInput(TestCasesPage.testCaseTitle, 'SecondTestCase')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).clear().type('SecondTestCaseGroup').type('{downArrow}{enter}')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.errorToastMsg).should(
            'contain.text',
            'The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.'
        )
    })
})
