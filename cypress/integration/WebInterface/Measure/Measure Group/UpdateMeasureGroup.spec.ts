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

describe('Validate Measure Group', () => {

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

        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //Update Measure Group
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[2].valueOf()).toString())
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('SDE Payer')
        cy.get(MeasureGroupPage.measurePopulationSelect).select('SDE Sex')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).select('Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).should('contain.text', 'Are you sure you want to Save Changes?')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

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
                    
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //Update Measure Group without all required populations
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[2].valueOf()).toString())
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('SDE Payer')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).select('Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

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

        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //Update Measure Group without optional populations
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[2].valueOf()).toString())
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('SDE Payer')
        cy.get(MeasureGroupPage.measurePopulationSelect).select('SDE Sex')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).should('contain.text', 'Are you sure you want to Save Changes?')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
    })
})