import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let mgPVTestType = ['all', 'wOReq', 'wOOpt']
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.ICFTest_CQL
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseSeries = 'SBTestSeries'

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
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[3].valueOf()).toString())
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('SDE Payer')
        cy.get(MeasureGroupPage.denominatorSelect).select('SDE Sex')
        cy.get(MeasureGroupPage.numeratorSelect).select('Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).contains('Are you sure you want to Save Changes?')
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
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[3].valueOf()).toString())
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('SDE Payer')
        cy.get(MeasureGroupPage.denominatorSelect).select('SDE Sex')
        cy.get(MeasureGroupPage.numeratorSelect).select('Absence of Cervix')
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
describe('Adding an Initial Population to group -- Ratio score only', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Validate that when an second Initial Population is added, assoications appear for IP1 and IP2', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        cy.get(MeasureGroupPage.lblFirstIpAssociation).should('be.visible')
        cy.get(MeasureGroupPage.lblFirstIpAssociation).should('contain.text', 'Association')
        cy.get(MeasureGroupPage.rdioFirstDenom).should('be.visible')
        cy.get(MeasureGroupPage.rdioFirstDenom).should('be.checked')
        cy.get(MeasureGroupPage.rdioFirstNum).should('be.visible')

        cy.get(MeasureGroupPage.lblSecondIpAssociation).should('be.visible')
        cy.get(MeasureGroupPage.lblSecondIpAssociation).should('contain.text', 'Association')
        cy.get(MeasureGroupPage.rdioSecondDenom).should('be.visible')
        cy.get(MeasureGroupPage.rdioSecondNum).should('be.visible')

        cy.get(MeasureGroupPage.rdioSecondNum).should('be.checked')

    })
    it('Validate that when the association for IP1 changes, IP2 associations also change', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //change value of first IP association
        cy.get(MeasureGroupPage.rdioFirstNum).check()
        cy.get(MeasureGroupPage.rdioFirstNum).should('be.checked')
        cy.get(MeasureGroupPage.rdioFirstDenom).should('not.be.checked')

        //verify second IP association changes
        cy.get(MeasureGroupPage.rdioSecondNum).should('not.be.checked')
        cy.get(MeasureGroupPage.rdioSecondDenom).should('be.checked')



    })
    it('Validate association for IP2 is read only', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //validate read only property
        cy.get(MeasureGroupPage.rdioSecondDenom).should('be.disabled')
        cy.get(MeasureGroupPage.rdioSecondNum).should('be.disabled')


    })
    it('Validate that save can occur once a value has been indicated for IP2', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

        //select a value for the second IP
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('SDE Race')

        //verify that save button becomes enabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirmed updated / saved msg
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
    })

    it('Validate that changing the association when a value has been indicated for IP 2, allows user to save new associaiton', () =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

        //select a value for the second IP
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('SDE Race')

        //verify that save button becomes enabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //change association only
        //change value of first IP association
        cy.get(MeasureGroupPage.rdioFirstNum).check()
        cy.get(MeasureGroupPage.rdioFirstNum).should('be.checked')
        cy.get(MeasureGroupPage.rdioFirstDenom).should('not.be.checked')

        //verify second IP association changes
        cy.get(MeasureGroupPage.rdioSecondNum).should('not.be.checked')
        cy.get(MeasureGroupPage.rdioSecondDenom).should('be.checked')

        //verify that save button becomes enabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirmed updated / saved msg
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
    })

    it('Validate test case execution for measure group with second initial population', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents, {delay:50})
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        cy.get(MeasureGroupPage.secondInitialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(0).click() //select denom

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirmed updated / saved msg
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Add Test Case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Navigate to Test Cases Page and execute Test Case
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'pass')

    })
})

describe('Delete second Initial Population -- Ratio score only', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Validate that when an second Initial Population is deleted / removed, the associations are removed', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //verify that the second initial population appears and can be assigned a value
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

        //deleting / removing the second initial population before saving
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).click()

        //associations are removed
        cy.get(MeasureGroupPage.lblFirstIpAssociation).should('not.exist')
        cy.get(MeasureGroupPage.rdioFirstDenom).should('not.exist')
        cy.get(MeasureGroupPage.rdioFirstNum).should('not.exist')

        cy.get(MeasureGroupPage.lblSecondIpAssociation).should('not.exist')
        cy.get(MeasureGroupPage.rdioSecondDenom).should('not.exist')
        cy.get(MeasureGroupPage.rdioSecondNum).should('not.exist')

        //verify that save button becomes enabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

    })
    it('Validate that when an second Initial Population is added, a delete / remove button becomes available', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //verify that the second initial population appears and can be assigned a value
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

    })

    it('Validate that when the delete / remove button is clicked, for the second IP, the IP is removed', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //verify that the second initial population appears and can be assigned a value
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

        //deleting / removeing the second initial population before saving
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).click()

        //verify that the second initial population is no longer on screen / in the UI
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('not.exist')

        //Add Second Initial Population again
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //verify that the second initial population appears and can be assigned a value
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //verify that the delete button for the second initial population is available and can still be clicked on
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).click()

        //verify that the second initial population is no longer on screen / in the UI
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('not.exist')
    })

    it('Validate that when the delete button is clicked, for the second IP, the first IP remains the same', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        //verify that the second initial population appears and can be assigned a value
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('be.visible')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

        //deleting / removing the second initial population before saving
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).click()

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //verify that the second initial population is no longer on screen / in the UI
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('not.exist')

        //verify IP1 and the other population field values are unchanged
        cy.get(MeasureGroupPage.initialPopulationSelect).find('option:selected').should('have.text', 'SDE Payer')
        cy.get(MeasureGroupPage.denominatorSelect).find('option:selected').should('have.text', 'SDE Race')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).find('option:selected').should('have.text', 'Select Denominator Exclusion')
        cy.get(MeasureGroupPage.numeratorSelect).find('option:selected').should('have.text', 'SDE Race')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).find('option:selected').should('have.text', 'Select Numerator Exclusion')
    })
})
