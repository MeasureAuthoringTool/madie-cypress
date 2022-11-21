import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header"
import assert = require("assert")
import {Global} from "../../../../Shared/Global"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {LandingPage} from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''


describe('Validate Measure Group -- scoring and populations', () => {

    beforeEach('Create New Measure and Login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })
    it('"Please complete the CQL Editor process before continuing" appears when there are issues with entered CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/GenericCQLBoolean.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        for(let i = 0; i<=5; i++){
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{backspace}')
        }
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
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
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/GenericCQLBoolean.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
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

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect,'Initial Population')

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('ml')
        //Select ml milliLiters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitfullName).click()

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
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify All data persists
        cy.get(MeasureGroupPage.popBasis).then(($text) => {
            assert($text.text(), 'Boolean')
        })
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text','Initial Population')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).should('contain.text','ml milliLiters')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('contain.text','Process')
    })

    it('Add second initial population for Ratio Measure', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/GenericCQLBoolean.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Select Group Type
        Utilities.setMeasureGroupType()

        //select scoring unit as Ratio on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect,'Initial Population')
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
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Ratio')
        cy.get(MeasureGroupPage.firstInitialPopulationSelect).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('contain.text', 'Initial Population2')

    })

    it('Verify warning modal when Measure Group has unsaved changes', () => {

        cy.log('Create Ratio Measure')
        MeasureGroupPage.createMeasureGroupforRatioMeasure()
        
        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Change scoring type & population
        cy.get(MeasureGroupPage.measureScoringSelect).click()
        cy.get(MeasureGroupPage.measureScoringCV).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(1).click() //select ipp

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
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')

    })
})

describe('Validate Population Basis', () => {

    before('Create measure', () => {
        //Create New Measure
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)

    })

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify default Value and if no value is selected for Population Basis, the save button is unavailable', () => {
        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/GenericCQLBoolean.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


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

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect,'Initial Population')

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('ml')
        //Select ml milliLiters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitfullName).click()

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })

})
