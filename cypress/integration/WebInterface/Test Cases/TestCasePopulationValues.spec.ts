import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'

describe('Verify the Test Case Populations based on Measure group scoring', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring)

    })
    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Verify the Test Case Populations when Measure group is not added', () =>{

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationHeaderForNoMeasureGroup).should('contain.text', 'No populations for current scoring. Please make sure at least one measure group has been created.')
    })

    it('Verify the Test Case Populations when Measure group is added', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Ratio) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.initialPopulationRow).should('be.visible')
        cy.get(TestCasesPage.numeratorRow).should('be.visible')
        cy.get(TestCasesPage.numeratorExclusionRow).should('be.visible')
        cy.get(TestCasesPage.denominatorRow).should('be.visible')
        cy.get(TestCasesPage.denominatorExclusionRow).should('be.visible')
    })

})