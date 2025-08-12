import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import assert = require("assert")
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'CreateMeasureGroup' + Date.now()
let CqlLibraryName = 'CreateMeasureGroupLib' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = 'library CQLLibrary5170 version \'0.0.000\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
        ' true\n' +
        '\n' +
        'define "Initial Population2":\n' +
        '  true\n' +
        '\n' +
        'define "Denominator":\n' +
        '   \t"Initial Population"\n' +
        '\n' +
        'define "Denominator Exclusion":\n' +
        '\ttrue\n' +
        '\n' +
        'define "Numerator":\n' +
        '\ttrue'

describe('Validate Measure Group -- scoring and populations', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('"Please complete the CQL Editor process before continuing" appears when there are issues with entered CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}')
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click().wait(1500)

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Message appears at the top of the Population Criteria tab / page
        Utilities.waitForElementVisible(MeasureGroupPage.CQLHasErrorMsg, 20700)
        cy.get(MeasureGroupPage.CQLHasErrorMsg).should('exist')
        cy.get(MeasureGroupPage.CQLHasErrorMsg).should('be.visible')
        cy.get(MeasureGroupPage.CQLHasErrorMsg).should('contain.text', 'Please complete the CQL Editor process before continuing')
    })

    it('Scoring unit, UCUM, population association, population basis, measure group type and description saves and persists', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30700)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify All data persists
        cy.get(MeasureGroupPage.popBasis).find('input').invoke('val').then(val => {
            expect(val).to.eq('boolean')
        })
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).find('[role="textbox"]').should('contain.text', 'MeasureGroup Description value')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).should('contain.value', 'mL')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('contain.text', 'Process')
    })

    it('Add second initial population for Ratio Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Select Group Type
        Utilities.setMeasureGroupType()

        //select scoring unit as Ratio on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusion')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator')

        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30700)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population2')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Ratio')
        cy.get(MeasureGroupPage.firstInitialPopulationSelect).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('contain.text', 'Initial Population2')
    })

    it('Verify warning modal when Measure Group has unsaved changes', () => {

        cy.log('Create Ratio Measure')
        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Select Group Type
        Utilities.setMeasureGroupType()

        //select scoring unit as Ratio on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusion')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator')

        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30700)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Change scoring type & population
        cy.get(MeasureGroupPage.measureScoringSelect).click()
        cy.get(MeasureGroupPage.measureScoringCV).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(1).click() //select Initial Population

        //Warning Modal not displayed when user navigated to Populations/Stratification/Reporting tabs without saving changes
        cy.log('Navigating to Stratification tab')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).should('exist')

        //Navigate back to populations tab
        cy.log('Navigating back to populations tab')
        cy.get(MeasureGroupPage.populationTab).click()
        cy.get(MeasureGroupPage.stratOne).should('not.exist')

        //Warning Modal displayed when user navigated to another Measure Group without saving changes
        cy.log('Navigate to another Measure Group')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        Utilities.clickOnKeepWorking()

        //Warning Modal displayed when user navigated to a different tab without saving changes
        cy.log('Navigating to CQL Editor tab')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.clickOnKeepWorking()

        //Warning Modal displayed when user clicks Discard Changes for that measure group
        cy.log('Click on Discard Changes button')
        cy.get(MeasureGroupPage.discardMeasureGroupChanges).click()
        Utilities.clickOnDiscardChanges()

        //Navigate to Groups tab and verify the Measure scoring and population reset to previous values
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Initial Population')

    })

    it('Add Scoring Precision to the Measure Group', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL')

        //Add Scoring Precision
        cy.get('[data-testid="scoring-precision-input"]').type('2')

        cy.get(MeasureGroupPage.reportingTab).click()
        cy.get(MeasureGroupPage.improvementNotationSelect).click()
        cy.contains('Increased score indicates improvement').click()

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })

    it('Verify Qi Core Cohort Measure Group can be created without Improvement Notation', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL')

        //Navigate to Reporting tab and verify the error message doesn't appear for missing Improvement Notation
        cy.get(MeasureGroupPage.reportingTab).click()
        cy.get('[data-testid="improvement-notation-select-helper-text"]').should('not.exist')

        //save population criteria
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })
})

describe('Validate Population Basis', () => {
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify default Value and if no value is selected for Population Basis, the save button is unavailable', () => {
        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).find('input').invoke('val').then(val => {
            expect(val).to.eq('boolean')
        })

        cy.get(MeasureGroupPage.popBasis).type('{del}').type('{esc}')

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })

    it('Verify error message if Negative Integer is Added to the Scoring Precision on a Measure Group', () => {

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        //Add Scoring Precision
        cy.get('[data-testid="scoring-precision-input"]').type('-2')

        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL')
        cy.get('[data-testid="integer-field-scoring-precision-helper-text"]').should('contain.text', 'Scoring Precision must be a positive integer')

        cy.get(MeasureGroupPage.reportingTab).click()
        cy.get(MeasureGroupPage.improvementNotationSelect).click()
        cy.contains('Increased score indicates improvement').click()

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })
})
