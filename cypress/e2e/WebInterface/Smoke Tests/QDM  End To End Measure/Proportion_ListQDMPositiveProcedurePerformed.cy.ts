import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"
import { QdmCql } from "../../../../Shared/QDMMeasuresCQL"

const now = Date.now()
const measureName = 'ProportionListQDMPositiveProcedurePerformed' + now
const CqlLibraryName = 'ProportionListQDMPositiveProcedurePerformed' + now
const firstTestCaseTitle = 'DENEXFail UveitisOpticAtrophyAfterCatSurg'
const testCaseDescription = 'DENOMFail' + now
const testCaseSeries = 'SBTestSeries'
const secondTestCaseTitle = 'DENEXPass DisorderVisualCortexAfterOneCatSurg'
const measureCQL = QdmCql.qdmMeasureCQLPRODCataracts2040BCVAwithin90Days

describe('Measure Creation: Proportion ListQDMPositiveProcedurePerformed', () => {

    before('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-01', '2012-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('End to End Proportion ListQDMPositiveProcedurePerformed', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Group Creation
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.denominatorExclusionSelect, "Denominator Exclusions")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('08/17/1957 12:00 AM', 'Living', 'AMERICAN INDIAN OR ALASKA NATIVE', 'Female', 'Not Hispanic or Latino')

        //Element - Condition:Diagnosis: Uveitis
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Uveitis')
        //add Timing Prevalence Period DateTime
        QDMElements.addTimingPrevalencePeriodDateTime('03/15/2012 07:00 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '4927003')

        //Element - Procedure:Performed: Cataract Surgery
        //add Element
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/15/2012 05:00 PM', '03/15/2012 07:00 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '9137006')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Element - Condition:Diagnosis: Optic Atrophy
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Optic Atrophy')
        //add Timing Prevalent Period DateTime
        QDMElements.addTimingPrevalencePeriodDateTime('03/15/2012 07:00 PM')

        //add Code
        QDMElements.addCode('SNOMEDCT', '111527005')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/28/1977 12:00 AM', 'Living', 'AMERICAN INDIAN OR ALASKA NATIVE', 'Female', 'Not Hispanic or Latino')

        //Element - Condition:Diagnosis: Disorders of Visual Corte
        QDMElements.addElement('condition', 'Diagnosis: Disorders of Visual Cortex')
        QDMElements.addTimingPrevalencePeriodDateTime('01/03/2012 01:15 PM', '03/01/2012 01:15 PM')
        QDMElements.addCode('Icd10CM', 'H47.611')

        //Element - Procedure:Performed: Cataract Surgery
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        QDMElements.addTimingRelevantPeriodDateTime('01/02/2012 10:15 PM', '01/02/2012 01:15 PM')
        QDMElements.addCode('SNOMEDCT', '10178000')
        QDMElements.closeElement()

        //Element - Procedure:Performed: Cataract Surgery
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        QDMElements.addTimingRelevantPeriodDateTime('02/02/2012 01:15 PM', '02/02/2012 04:15 PM')
        QDMElements.addCode('SNOMEDCT', '446548003')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Element - Physical Exam:Performed: Best Corrected Visual Acuity Exam Using Snellen Chart
        QDMElements.addElement('physicalexam', 'Performed: Best Corrected Visual Acuity Exam Using Snellen Chart')
        cy.get(TestCasesPage.authorDateTime).type('02/02/2012 01:15 PM')
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.resultAttribute).click()
        cy.get(TestCasesPage.attributeType).click()
        cy.get('[data-testid="option-Code"]').click()
        cy.get('[id="value-set-selector"]').click()
        cy.get('[data-testid="custom-vs"]').click()

        cy.get('[data-testid=custom-code-system-input]').type('SNOMEDCT')
        cy.get('[data-testid=custom-code-input]').type('422497000')
        cy.get(TestCasesPage.addAttribute).click()
        cy.get('[data-testid=sub-navigation-tab-codes]').click()
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get('[data-testid=code-system-option-custom]').click()

        cy.get('[data-testid=custom-code-system-input]').type('SNOMEDCT')
        cy.get('[data-testid=custom-code-input]').type('419775003')
        cy.get('[data-testid=add-code-concept-button]').click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Execute Test case on Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')
    })
})
