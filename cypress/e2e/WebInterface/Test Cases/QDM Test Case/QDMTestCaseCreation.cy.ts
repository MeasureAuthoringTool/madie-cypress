import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { QDMElements } from "../../../../Shared/QDMElements"
import { umlsLoginForm } from "../../../../Shared/umlsLoginForm"

let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measurePath = 'cypress/fixtures/measureId'
let mCQLForElementsValidation = MeasureCQL.QDMTestCaseCQLFullElementSection
let CQLSimple_for_QDM = MeasureCQL.QDMSimpleCQL
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe('Validating the creation of QDM Test Case', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQL, 0, false, '2023-01-01', '2024-01-01')
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population',
            'boolean')

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify test case page bread crumb navigation', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob
        cy.get(TestCasesPage.QDMDob).type('01/01/2020 12:00 PM')

        //save dob value
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled').wait(1500)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //click on bread crumb to navigate back to the main test case list page
        cy.get(TestCasesPage.testCasesBCLink).find('[class="madie-link"]').should('contain.text', 'Test Cases').click()

        //verify that the user is, now, on the test case list page
        cy.readFile(measurePath).should('exist').then((measureId) => {
            Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 60000)
            cy.url().should('contain', measureId + '/edit/test-cases/list-page')
            cy.url().should('contain', '?filter=&search=&page=1&limit=10')
        })
    })
})

describe('Validating the Elements section on Test Cases', () => {
    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', false, mCQLForElementsValidation)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population',
            'boolean')
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify elements and their subsections / cards', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm page and elements tabs / objects have loaded on page
        Utilities.waitForElementVisible(TestCasesPage.ElementsSubTabHeading, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterElementTab, 37000)

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

    })

    it("Verify elements' subsections' edit cards", () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm page and elements tabs / objects have loaded on page
        Utilities.waitForElementVisible(TestCasesPage.ElementsSubTabHeading, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterElementTab, 37000)

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()

        //subsection -- Outpatient Surgery Service card appears and click on the plus button to open edit card
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.plusIcon).should('be.visible')
        cy.get(TestCasesPage.plusIcon)
            .first()
            .click()

        //verify elements on edit card
        cy.get(TestCasesPage.ExpandedOSSDetailCard).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardClose).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard)
            .find(TestCasesPage.ExpandedOSSDetailCardTitle)
            .should('exist')
            .should('contain.text', 'Performed')
        cy.get(TestCasesPage.ExpandedOSSDetailCard)
            .find(TestCasesPage.ExpandedOSSDetailCardTitleSubDetail)
            .should('exist')
            .should('contain.text', 'Observation Services')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTiming)
            .should('exist')
            .should('contain.text', 'Timing')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabCodes).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabAttributes).should('exist')

        //close the detail card
        cy.get(umlsLoginForm.closeGenericError).click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

    })
})

describe('Run QDM Test Case ', () => {
    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, CQLSimple_for_QDM, false, false,
            '2023-01-01', '2024-01-01')

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Run a simple QDM test case and verify message that indicates that test case was ran', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

    })
})

describe('Validating Expansion -> Manifest selections / navigation functionality', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()
        //selecting initial manifest value that will allow test case to pass
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Latest'
                cy.wrap(radio).eq(0).check({ force: true }).should('be.checked');
                cy.contains('[data-testid="manifest-expansion-radio-buttons-group"] > :nth-child(1) > .MuiTypography-root', 'Latest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('not.exist')

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            })
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.clickEditforCreatedTestCase()
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2000 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
        //add element - code system to TC
        //Element - Medication:Discharged: Antithrombotic Therapy for Ischemic Stroke
        QDMElements.addElement('medication', 'Discharge: Antithrombotic Therapy for Ischemic Stroke')
        cy.get(TestCasesPage.authorDateTime).type('06/01/2025 01:00 PM')
        QDMElements.addCode('RxNORM', '1536498')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 35000)

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.clickEditforCreatedTestCase()
        Utilities.waitForElementVisible(TestCasesPage.EncounterElementTab, 50000)
        TestCasesPage.grabElementId(1)
        TestCasesPage.qdmTestCaseElementAction('edit')
        //add negation
        Utilities.waitForElementVisible(TestCasesPage.negationTab, 35000)
        cy.get(TestCasesPage.negationTab).click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetDirectRefCode, 35000)
        cy.get(TestCasesPage.valueSetDirectRefCode).scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetOptionValue, 35000)
        cy.get(TestCasesPage.valueSetOptionValue).click()
        Utilities.waitForElementVisible('[id="code-system-selector"]', 35000)
        cy.get('[id="code-system-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-SNOMEDCT"]', 35000)
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        Utilities.waitForElementVisible('[id="code-selector"]', 35000)
        cy.get('[id="code-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-1162745003"]', 35000)
        cy.get('[data-testid="option-1162745003"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 35000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.clickEditforCreatedTestCase()
        //add Element Performed: Nonelective Inpatient Encounter
        QDMElements.addElement('encounter', 'Performed: Nonelective Inpatient Encounter')
        QDMElements.addTimingRelevantPeriodDateTime('06/01/2025 01:00 PM', '06/02/2025 01:00 PM')
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabCodes).click()
        QDMElements.addCode('SNOMEDCT', '183452005')
        //navigate to the attribute sub tab and enter value
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Diagnoses"]').click()
        cy.get('[data-testid="value-set-selector"]').scrollIntoView().click()
        cy.get('[data-testid="option-2.16.840.1.113883.3.117.1.7.1.247"]').click() //Select IschemicStroke from dropdown
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-value="111297002"]').click()
        cy.get('[data-testid="integer-input-field-Rank"]').type('1')
        cy.get(TestCasesPage.addAttribute).click()
        //Close the Element
        cy.get(umlsLoginForm.closeGenericError).scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible(umlsLoginForm.closeGenericError, 35000)
        cy.get(umlsLoginForm.closeGenericError).click()
        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 35000)
        //Add Expected value for Test case
        //navigate to the Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click()
        //Initial Population expected box
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        //Denominator expected box
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        //Numerator expected box
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('0')
        //Numerator Exception expected box
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).type('1')
        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 35000)

        //logout of MADiE
        OktaLogin.UILogout()
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify Expansion -> Manifest: When code does not exist on value set, test case will fail. When value set does contain code, and all other expected equals actual then test case passes.', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '1PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //validating that manifest is, now, selected and make a change in the selection
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //check / select radio button for manifest
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmMantifestMayFailTestOption).click()
                cy.get(TestCasesPage.qdmManifestSaveBtn).click()
                cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')

            })

        Utilities.waitForElementToNotExist(TestCasesPage.qdmManifestSuccess, 25000)
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-2022-05-05')
        cy.reload()
        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //clicking on running the test case
        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 15000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 15000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '1FailQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
    })

})
