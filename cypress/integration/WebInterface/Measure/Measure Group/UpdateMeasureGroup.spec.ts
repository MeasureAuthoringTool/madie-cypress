import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let mgPVTestType = ['all', 'wOReq', 'wOOpt']
let newMeasureName = ''
let newCqlLibraryName = ''
//skipping due to MAT-4591
describe.skip('Validate Measure Group', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('All population selections are saved to the database', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab

        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')
            
        for (let j in mgPVTestType){
            for (let i in measureScoringArray){
                //log, in cypress, the measure score value
                cy.log((measureScoringArray[i].valueOf()).toString())
                //select scoring unit on measure
                cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[i].valueOf()).toString())
                Utilities.validateMeasureGroup((measureScoringArray[i].valueOf()).toString(), mgPVTestType[j])
            }
        }

    })

    it('Validate that required populations have to have a selected value before measure group can be saved', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')
                    
        for (let j in mgPVTestType){
            for (let i in measureScoringArray){
                //log, in cypress, the measure score value
                cy.log((measureScoringArray[i].valueOf()).toString())
                //select scoring unit on measure
                cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[i].valueOf()).toString())
                Utilities.validateMeasureGroup((measureScoringArray[i].valueOf()).toString(), mgPVTestType[j])
            }
        }

    })

    it('Validate that non-required populations do not need to be selected before saving', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')
                    
        for (let j in mgPVTestType){
            for (let i in measureScoringArray){
                //log, in cypress, the measure score value
                cy.log((measureScoringArray[i].valueOf()).toString())
                //select scoring unit on measure
                cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[i].valueOf()).toString())
                Utilities.validateMeasureGroup((measureScoringArray[i].valueOf()).toString(), mgPVTestType[j])
            }
        }

    })
})