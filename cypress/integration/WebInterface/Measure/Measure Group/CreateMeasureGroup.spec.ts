import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header"
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = MeasureGroupPage.measureScoringUnit
let userToken = 'default'

describe('Validate Measure Group', () => {

    beforeEach('Create measure and Login', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring, userToken)
        OktaLogin.Login()
    })

    afterEach('Login', () => {
        cy.wait(2000)
        OktaLogin.Logout()

    })

    it('Verify default values in Measure Group page', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //get current value what is in the scoring box
        cy.get(MeasureGroupPage.measureScoringSelect).find(':selected').should('to.have.value', measureScoring)
    })

    it('Verify values in the scoring drop down box', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

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
        //CQLEditorPage.readWriteCQL('cqlCreateMeasureGroup.txt')
        Utilities.readWriteFileData('cqlCreateMeasureGroup.txt', EditMeasurePage.cqlEditorTextBox)
        //save CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Validate saved message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //validate population definitions are those that were added via CQL
        cy.get(MeasureGroupPage.initialPopulationSelect).find('option:nth-child(1)').should('contain.text', 'Initial Population')

    })

    it('Scoring unit and population association saves and persists with a Measure Gropu Description', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(1000)
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')
        //select a population definition
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population') //select the 'Initial Population' option for IP
        cy.get(MeasureGroupPage.denominatorSelect).select('SDE Sex') //select the 'SDE Sex' option for Denominator
        cy.get(MeasureGroupPage.numeratorSelect).select('SDE Race') //select the 'SDE Race' option for Numerator
        cy.wait(1000)
        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('Initial Population')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })
    

    })

    it('Scoring unit and population association saves and persists without Measure Group Description', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(1000)
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //select a population definition
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population') //select the 'Initial Population' option for IP
        cy.get(MeasureGroupPage.denominatorSelect).select('SDE Sex') //select the 'SDE Sex' option for Denominator
        cy.get(MeasureGroupPage.numeratorSelect).select('SDE Race') //select the 'SDE Race' option for Numerator
        cy.wait(1000)
        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('Initial Population')
        
    })
})
