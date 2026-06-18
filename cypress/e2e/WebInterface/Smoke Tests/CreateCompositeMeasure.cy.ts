import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { Header } from '../../../Shared/Header'
import { CreateMeasurePage, SupportedCompositeModels } from '../../../Shared/CreateMeasurePage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { TestCaseJson } from '../../../Shared/TestCaseJson'
import { step } from '../../../utils/step'

const testCase = TestCaseJson.fromCMS1017NumPass

const createCompositeMeasureAndEdit = (): void => {
  const measureName = 'CompositeTestMeasure' + Date.now()
  const cqlLibraryName = 'CompositeTestLibrary' + Date.now()

  CreateMeasurePage.CreateCompositeMeasure(measureName, cqlLibraryName, SupportedCompositeModels.qiCore6)
  cy.get(Header.mainMadiePageButton).click()
  MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
  cy.get(EditMeasurePage.cqlEditorTab).should('not.exist')
}

const saveCompositePopulationCriteria = (): void => {
  cy.get(EditMeasurePage.measureGroupsTab).should('be.visible').click()
  cy.get('[data-testid="scoring-select"]').should('contain.text', 'Composite')
  Utilities.setMeasureGroupType()
  cy.get(CreateMeasurePage.compositeScoringSelect).click()
  cy.get('[data-testid="opportunity-option"]').click()

  cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible').and('be.enabled').click()
  cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg)
    .should('exist')
    .and('contain.text', 'Population details for this group saved successfully.')
}

const createCompositeMeasureWithPopulationCriteria = (): void => {
  createCompositeMeasureAndEdit()
  saveCompositePopulationCriteria()
}

const reopenMeasureForTestCases = (): void => {
  step('Reopen Measure for Test Cases')
  cy.get(Header.mainMadiePageButton).click()
  MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
}

const createTestCaseAndOpenEditPage = (): void => {
  TestCasesPage.createTestCase('title', 'series', 'desc')
  TestCasesPage.clickEditforCreatedTestCase()
}

//Skipping until Feature flag 'QICoreCompositeMeasure' is turned on
describe.skip('Create Composite Measure', () => {
  beforeEach('Login', () => {
    OktaLogin.Login()

    Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 11500)
  })

  // afterEach('Cleanup and Logout', () => {

  //     Utilities.deleteMeasure()
  // })

  it('Create QI Core Composite Measure and add Population Criteria', () => {
    createCompositeMeasureWithPopulationCriteria()
  })
  it('Validate Composite Test Case Tabs', () => {
    createCompositeMeasureAndEdit()
    createTestCaseAndOpenEditPage()

    cy.get(TestCasesPage.compositeAvailableTab)
      .should('be.visible')
      .and('have.attr', 'aria-selected', 'true')
      .and('contain.text', 'Available')
    cy.get(TestCasesPage.compositeAddedTab).should('be.visible').and('contain.text', 'Added')
    cy.get(TestCasesPage.compositeJsonTab).should('be.visible').and('contain.text', 'JSON')
  })

  it('Validate Composite Measure Insert Existing Test Case Button Functionality', () => {
    createCompositeMeasureAndEdit()
    createTestCaseAndOpenEditPage()

    cy.get(TestCasesPage.compositeInsertTestCaseBtn).should('be.visible')
    cy.get(TestCasesPage.compositeInsertTestCaseBtn).click()
    cy.get(TestCasesPage.compositeBackToAllProfilesBtn).should('be.visible')
    cy.get(TestCasesPage.compositeBackToAllProfilesBtn).click()
  })

  //Skipping until Feature flag 'QICoreCompositeMeasure' is turned on and add in the correct functionality to check the help text content
  it.skip('Validate "How it Works" help text within inserting profiles to Test Case Measures', () => {
    createCompositeMeasureAndEdit()
    createTestCaseAndOpenEditPage()
    cy.get(TestCasesPage.compositeInsertTestCaseBtn).should('be.visible')
    cy.get(TestCasesPage.compositeInsertTestCaseBtn).click()
    cy.get(TestCasesPage.compositeTCHowItWorksLink).should('be.visible').click()
    cy.get(TestCasesPage.compositeTCHowItWorksContent).should('be.visible')
    cy.get(TestCasesPage.compositeTCHowItWorksContent)
      .invoke('text')
      .then((text) => {
        const normalizedText = text.replace(/\s+/g, ' ').trim()
        expect(normalizedText).to.eq(
          'How it Works ' +
            'This workflow allows you to insert all profiles from a selected test case into the current test case. ' +
            'To complete this process: ' +
            'Select the measure that contains the test case you want to insert. ' +
            'Select the test case you want to insert profiles from. ' +
            'Select Insert.',
        )
      })
    cy.get(TestCasesPage.compositeTCHowItWorksLinkCloseBtn).should('be.visible').click()
    cy.get(TestCasesPage.compositeTCHowItWorksContent).should('be.visible')
  })

  it('Create Composite Measure and Edit Test Case through Added Builder Tab', () => {
    createCompositeMeasureWithPopulationCriteria()
    reopenMeasureForTestCases()
    createTestCaseAndOpenEditPage()

    cy.get(TestCasesPage.compositeAddedTab).should('be.visible').click()
    TestCasesPage.grabAddedId(1)
    //Validate Edit and Json tab is editable and available respectively
    TestCasesPage.compositeTestCaseAddedAction('edit')
  })
  it('Create Composite Measure and Edit Test Case through Added Json Tab', () => {
    createCompositeMeasureWithPopulationCriteria()
    reopenMeasureForTestCases()
    createTestCaseAndOpenEditPage()

    TestCasesPage.editTestCaseJson(testCase, true)
    cy.get(TestCasesPage.editTestCaseSaveButton).click()
    Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)
    //Validate Edit and Json tab is editable and available respectively
  })
  //Skipping until Feature flag 'QICoreCompositeMeasure' is turned on and add in the correct functionality to check that a read only viewer cannot edit through the builder or json tab
  it.skip('Create Composite Measure and Verify Read Only Viewer Cannot Edit Test Case through Added Json Tab', () => {
    createCompositeMeasureWithPopulationCriteria()
    reopenMeasureForTestCases()
    createTestCaseAndOpenEditPage()

    TestCasesPage.editTestCaseJson(testCase, true)
    cy.get(TestCasesPage.editTestCaseSaveButton).click()
    Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)
    //Validate Edit and Json tab is editable and available respectively
  })
  //Skipping until Feature flag 'QICoreCompositeMeasure' is turned on and add in the correct functionality to check that a read only viewer cannot edit through the builder or json tab
  it.skip('Create Composite Measure and Verify Read Only Viewer Cannot Edit Test Case through Added Builder Tab', () => {
    createCompositeMeasureWithPopulationCriteria()
    reopenMeasureForTestCases()
    createTestCaseAndOpenEditPage()

    cy.get(TestCasesPage.compositeAddedTab).should('be.visible').click()
    TestCasesPage.grabAddedId(1)
    //Validate Edit and Json tab is editable and available respectively
    TestCasesPage.compositeTestCaseAddedAction('edit')
  })
})
