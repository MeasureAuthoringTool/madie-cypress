import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL
let measureCQL_multiplePopulations = MeasureCQL.CQL_Multiple_Populations

describe('Measure Populations', () => {

    beforeEach('Create Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Validate if the Measure populations reset on Measure Group Scoring change', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Measure Populations for Ratio Measure
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean').type('{enter}')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'ipp')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //verify the measure group's description before reset
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })

        //Verify the Populations before reset
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('contain.text', 'ipp')

        //Reset Measure Scoring to Proportion
        cy.log('Reset Measure Scoring')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

        //verify the measure group's description after reset
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })


        //verify the populations after reset
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Select Denominator')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('contain.text', 'Select Denominator Exclusion')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('contain.text', 'Select Denominator Exception')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select Numerator')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('contain.text', 'Select Numerator Exclusion')

        cy.log('Measure Populations reset successfully')

    })

    it('Measure group created successfully when the population basis match with population return type', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Measure Populations for Ratio Measure
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean').type('{enter}')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'ToCode')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

    })

    it('Verify error message when the population basis does not match with population return type', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Measure Populations for Ratio Measure
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'num')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'ToCode')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Verify save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })
})

describe('Warning Messages on Population updates', () => {

    beforeEach('Create Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL_multiplePopulations)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population', 'Boolean')
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify warning message when the Measure scoring is updated', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the population criteria tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Reset Measure Scoring to Proportion
        cy.log('Reset Measure Scoring')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

        //Update Measure Populations
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

    })

    it('Verify warning message when the Population basis is updated', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the population criteria tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Reset Population Basis to Encounter
        cy.log('Reset Population Basis')
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //Update Measure Populations
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Qualifying Encounters')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Population Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure group.')
        cy.get(MeasureGroupPage.updatePopulationBasisConfirmationBtn).click()

    })
})
