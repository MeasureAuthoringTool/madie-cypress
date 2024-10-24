import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { QDMElements } from "../../../../../Shared/QDMElements";
import { Header } from "../../../../../Shared/Header";

let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'

let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()

describe('QDM Test Case Search, Filter, and sorting by Test Case number', () => {

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
                //check / select radio button for manifest
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmManifestMaySecondOption).click()
                cy.get(TestCasesPage.qdmManifestSaveBtn).click()
                cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')

            })
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-2024-05-02')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2000 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
        //add element - code system to TC
        //Element - Medication:Discharged: Antithrombotic Therapy for Ischemic Stroke
        cy.get('[data-testid="elements-tab-medication"]').click()
        cy.get('[data-testid="data-type-Medication, Discharge: Antithrombotic Therapy for Ischemic Stroke"]').click()
        cy.get(TestCasesPage.authorDateTime).type('06/01/2025 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-RxNORM"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1536498"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(4000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
        TestCasesPage.grabElementId()
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
        Utilities.waitForElementVisible('[data-testid="option-105480006"]', 35000)
        cy.get('[data-testid="option-105480006"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(4000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
        //Element - Encounter:Performed: Nonelective Inpatient Encounter
        cy.get('[data-testid="elements-tab-encounter"]').scrollIntoView().click()
        cy.get('[data-testid="data-type-Encounter, Performed: Nonelective Inpatient Encounter"]').click()
        QDMElements.addTimingRelevantPeriodDateTime('06/01/2025 01:00 PM', '06/02/2025 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        //navigate to the attribute sub tab and enter value
        cy.get(TestCasesPage.attributesTab).click()
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
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
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
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        //logout of MADiE
        OktaLogin.UILogout()
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('QDM Test Case search and filter functionality', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //search for something that is in the description field
        cy.get(TestCasesPage.tcSearchInput).type('Second')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for soemthing that is in the status field
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the group field
        cy.get(TestCasesPage.tcSearchInput).clear().type('SecondTC-SBTestSeries')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the title field
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)


        //the filter by field
        cy.get(TestCasesPage.tcFilterInput).scrollIntoView().wait(1500).click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)

        //clear the Filter By by selecting the "-" option
        cy.get(TestCasesPage.tcFilterInput).click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcFilterInput).click()
        cy.get(TestCasesPage.tcFilterByDeselect).click()
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)


        //running test cases on the test case list page runs all test wheither they are in the search results or not
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

        //clear search to show all test cases
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        cy.get(TestCasesPage.testCaseResultrow2).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')


    })

})