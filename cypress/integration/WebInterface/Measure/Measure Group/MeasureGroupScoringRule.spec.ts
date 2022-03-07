import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"


let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = MeasureGroupPage.measureScoringUnit

describe('Measure Group', () => {

    before('Create Measure', () => {

        OktaLogin.Login()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring)

        OktaLogin.Logout()

    })
    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Measure Group Population based on Scoring Rule', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //cohort
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('not.exist')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('not.exist')

        //Continuous Variable
        cy.get(MeasureGroupPage.measureScoringSelect).select('Continuous Variable')

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('not.exist')

        //Proportion
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('be.visible')

        //Ratio
        cy.get(MeasureGroupPage.measureScoringSelect).select('Ratio')

        //verify the correct populations are displayed and not displayed
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('not.exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('be.visible')

    })

})
