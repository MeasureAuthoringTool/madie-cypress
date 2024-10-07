import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()

describe('Measure Group', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Measure Group Population based on Scoring Rule', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })

        //cohort
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('not.exist')
        cy.get(MeasureGroupPage.measurePopulationSelect).should('not.exist')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).should('not.exist')

        //Continuous Variable
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('not.exist')
        cy.get(MeasureGroupPage.measurePopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).should('be.visible')

        //Proportion
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.measurePopulationSelect).should('not.exist')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).should('not.exist')

        //Ratio
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.measurePopulationSelect).should('not.exist')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).should('not.exist')

    })

})
