import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = MeasureGroupPage.measureScoringUnit

//cql editor values
let cqlLibraryV = 'library FHIRCommunicationTest version \'1.0.005\' {enter}' 
let cqlFHIRV = 'using FHIR version \'4.0.1\' {enter}'    
let cqlIncludeFHIRHelpers = 'include FHIRHelpers version \'4.0.001\' called FHIRHelpers {enter}'
let cqlIncludeSuppDataEleFHIR4 = 'include SupplementalDataElementsFHIR4 version \'2.0.000\' called SDE {enter}'
let cqlValueSet = 'valueset "Level of Severity of Retinopathy Findings": {enter} \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1283\' {enter}'
let cqlParameter = 'parameter "Measurement Period" Interval<DateTime> {enter}'
let cqlContext = 'context Patient {enter}'
let cqlDefineEthnic = 'define "SDE Ethnicity":{enter} SDE."SDE Ethnicity" {enter}' 
let cqlDefinePayer = 'define "SDE Payer":{enter}  SDE."SDE Payer" {enter}' 
let cqlDefineRace = 'define "SDE Race":{enter}  SDE."SDE Race" {enter}' 
let cqlDefineSex = 'define "SDE Sex":{enter}  SDE."SDE Sex" {enter}' 
let cqlDefineIniPop = 'define "Initial Population": {enter}   AgeInYearsAt (start of "Measurement Period") >= 18 {enter}'
let cqlDefineNum = 'define "Numerator": {enter}   exists ["Communication": "Level of Severity of Retinopathy Findings"] Communication {enter}             where Communication.sent in "Measurement Period" {enter}'
let cqlDefineDenom = 'define "Denominator": {enter}   "Initial Population" {enter}'
let cqlDefineMedReqInternals = 'define "MedicationRequestIntervals": {enter}   { Interval[@2012-01-01, @2013-05-15],     Interval[@2013-05-17, @2014-05-15] } {enter}'
let cqlRollOutInternals = 'define "RolledOutIntervals": {enter}   MedicationRequestIntervals M {enter}           aggregate R starting (null as List<Interval<DateTime>>): R union ({ {enter}             M X {enter}               let S: Max({ end of Last(R) + 1 day, start of X }), {enter}                 E: S + duration in days of X {enter}               return Interval[S, E]{enter}           }) {enter}'
let cqlDefineFactorialOfFive = 'define "FactorialOfFive": {enter}   ({ 1, 2, 3, 4, 5 }) Num {enter}       aggregate Result: Coalesce(Result, 1) * Num {enter}'



describe('Validate Measure Group', () => {

    before('Create Measure', () => {

        OktaLogin.Login()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName, measureScoring)

        OktaLogin.Logout()

    })
    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    it('Verify default values in Measure Group page', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        MeasureGroupPage.clickMeasureGroupTab()

        //get current value what is in the scoring box
        cy.get(EditMeasurePage.measureScoringDBox).find(':selected').should('to.have.value', measureScoring)
    })

    it('Verify values in the scoring drop down box', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        MeasureGroupPage.clickMeasureGroupTab()

        //validate values in the scoring drop down box
        cy.get('#scoring-unit-select').find('option').then(options => {
            const actual = [...options].map(o => o.value)
            expect(actual).to.deep.eq(['Cohort', 'Continuous Variable', 'Proportion', 'Ratio'])
        })
    })
    it('Initial Population being populated from CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Enter value in CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlLibraryV)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlFHIRV)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlIncludeFHIRHelpers)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlIncludeSuppDataEleFHIR4)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlValueSet)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlValueSetContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlParameter)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlContext)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineEthnic)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineEthnicContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefinePayer)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineRace)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineSex)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineIniPop)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineIniPopContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineNum)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineLSRF)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineLSRFContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineDenom)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlInitialPop)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineMedReqInternals)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineMedReqInternalsContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlRollOutInternals)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlMedReqInternalsHeader)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlMedReqInternalsContinuedAgain, { parseSpecialCharSequences: false })
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlEnter)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlMedReqInternalsAdditional,{ parseSpecialCharSequences: false })
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlMedReqInternalsAdditionalOneMoreTime, { parseSpecialCharSequences: false })
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlEnter)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlMedReqInternalsAdditionalContinued)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqllMedReqInternalsAdditionalContinuedAgain, { parseSpecialCharSequences: false })
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlEnter)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefineFactorialOfFive)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefinedFactorialOfFiveContinued, { parseSpecialCharSequences: false })
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlDefinedFactorialOffiveAdditional)



        //save CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate saved message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        //navigate to the measure group tab
        MeasureGroupPage.clickMeasureGroupTab()

        //validate population definitions are those that were added via CQL
        cy.get('#ipp-expression-select').find('option:nth-child(1)').should('contain.text', 'SDE Ethnicity')
        cy.get('#ipp-expression-select').find('option:nth-child(2)').should('contain.text', 'SDE Payer')
        cy.get('#ipp-expression-select').find('option:nth-child(3)').should('contain.text', 'SDE Race')
        cy.get('#ipp-expression-select').find('option:nth-child(4)').should('contain.text', 'SDE Sex')
        cy.get('#ipp-expression-select').find('option:nth-child(5)').should('contain.text', 'Initial Population')
        cy.get('#ipp-expression-select').find('option:nth-child(6)').should('contain.text', 'Numerator')
        cy.get('#ipp-expression-select').find('option:nth-child(7)').should('contain.text', 'FactorialOfFive')
        cy.get('#ipp-expression-select').find('option:nth-child(8)').should('contain.text', 'RolledOutIntervals')
        cy.get('#ipp-expression-select').find('option:nth-child(9)').should('contain.text', 'MedicationRequestIntervals')
        cy.get('#ipp-expression-select').find('option:nth-child(10)').should('contain.text', 'Denominator')

    })
    it('Initial Population being populated from CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Enter value in CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cqlLibraryV + cqlFHIRV + cqlIncludeFHIRHelpers + cqlIncludeSuppDataEleFHIR4 + cqlValueSet + cqlParameter + cqlContext + 
            cqlDefineEthnic + cqlDefinePayer + cqlDefineRace + cqlDefineSex + cqlDefineIniPop + cqlDefineNum + cqlDefineDenom + cqlDefineMedReqInternals + cqlRollOutInternals +
            cqlDefineFactorialOfFive)

        //save CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate saved message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        //navigate to the measure group tab
        MeasureGroupPage.clickMeasureGroupTab()

        //validate population definitions are those that were added via CQL
        cy.get('#ipp-expression-select').find('option').then(options => {
            const actual = [...options].map(o => o.value)
            expect(actual).to.deep.eq(['SDE Ethnicity', 'SDE Payer', 'SDE Race', 'SDE Sex', 'Initial Population', 'Numerator', 'Denominator', 
                'MedicationRequestIntervals', 'RolledOutInternals', 'FactorialOfFive', ])
          })

    })
/*     it('Scoring unit and population association saves and persists', () => {

        //click on Edit button to edit measure

        //click on the CQL Editor tab

        //Enter value in CQL Editor tab

        //save CQL

        //Validate saved message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        //navigate to the measure group tab 

        //select a population definition

        //save population definiitong with scoring unit

        //validation successful save message

        //validate data is saved in mongo database

        //verify population association persists
        //navigate away from measure group page
        //navigate back to the measure group page
        //verify that the population and the scoring unit that was saved, together, appears
    })  */
/*     
    it('Create Measure Group', () => {

})