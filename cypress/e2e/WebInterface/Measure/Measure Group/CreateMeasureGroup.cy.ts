import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import assert = require("assert")
import { Global } from "../../../../Shared/Global"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = 'library Generic version \'0.0.000\'\n' +
    '\n' +
    '/*\n' +
    'Based on CMS124v7 - Cervical Cancer Screening\n' +
    '*/\n' +
    '\n' +
    '/*\n' +
    'This example is a work in progress and should not be considered a final specification\n' +
    'or recommendation for guidance. This example will help guide and direct the process\n' +
    'of finding conventions and usage patterns that meet the needs of the various stakeholders\n' +
    'in the measure development community.\n' +
    '*/\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\'\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "HPV Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
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

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()

    })
    it('"Please complete the CQL Editor process before continuing" appears when there are issues with entered CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")
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
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

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
        MeasuresPage.measureAction("edit")

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

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

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
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify All data persists
        cy.get(MeasureGroupPage.popBasis).then(($text) => {
            assert($text.text(), 'Boolean')
        })
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })
        cy.get(MeasureGroupPage.ucumScoringUnitCurrentValue).should('contain.value', 'mL milliliter')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('contain.text', 'Process')
    })

    it('Add second initial population for Ratio Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")
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
        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")
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
        cy.get(Global.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(Global.keepWorkingCancel).click()

        //Warning Modal displayed when user navigated to a different tab without saving changes
        cy.log('Navigating to CQL Editor tab')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(Global.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(Global.keepWorkingCancel).click()

        //Warning Modal displayed when user clicks Discard Changes for that measure group
        cy.log('Click on Discard Changes button')
        cy.get(Global.discardChangesBtn).click()
        Global.clickOnDiscardChanges()

        //Navigate to Groups tab and verify the Measure scoring and population reset to previous values
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Initial Population')

    })
})

describe('Validate Population Basis', () => {
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()

    })

    it('Verify default Value and if no value is selected for Population Basis, the save button is unavailable', () => {
        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).then(($text) => {
            assert($text.text(), 'Boolean')
        })

        cy.get(MeasureGroupPage.popBasis).type('{del}').type('{esc}')

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })

})
