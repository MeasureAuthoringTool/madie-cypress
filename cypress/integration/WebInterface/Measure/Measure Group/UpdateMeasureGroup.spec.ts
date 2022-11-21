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
let newMeasureName = ''
let newCqlLibraryName = ''
let ratioMeasureCQL = MeasureCQL.ICFCleanTest_CQL
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
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //select a group type
        Utilities.setMeasureGroupType()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Update Measure Group
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
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
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //select a group type
        Utilities.setMeasureGroupType()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Update Measure Group without all required populations
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Surgical Absence of Cervix')
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
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //select a group type
        Utilities.setMeasureGroupType()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Update Measure Group without optional populations
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).contains('Are you sure you want to Save Changes?')
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
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false,
            'Surgical Absence of Cervix', 'Surgical Absence of Cervix',
            'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Validate that when an second Initial Population is added, associations appear for IP1 and IP2', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

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
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).wait(9700).click()

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
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //Update populations
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'denom')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirmed updated / saved msg
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        cy.log('Test Case created successfully')

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).wait(2000).type(validTestCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).click({ multiple: true })
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).click({ multiple: true })
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXExpected).click()
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully!')

        //Navigate to Test Cases Page and execute Test Case
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })
})

describe('Delete second Initial Population -- Ratio score only', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.cqlSaveResultsAlertMsg, 20700)
        cy.get(CQLEditorPage.cqlSaveResultsAlertMsg).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Validate that when an second Initial Population is deleted / removed, the associations are removed', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

    })

    it('Validate that when the delete / remove button is clicked, for the second IP, the IP is removed', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

        //verify that the delete button for the second initial population is available
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('exist')
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).should('be.visible')

        //deleting / removing the second initial population before saving
        cy.get(MeasureGroupPage.deleteSecondInitialPopulation).click()

        //verify that the second initial population is no longer on screen / in the UI
        cy.get(MeasureGroupPage.lblSecondInitialPopulation).should('not.exist')

        //Add Second Initial Population again
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('exist')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).should('be.visible')
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Surgical Absence of Cervix')

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
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text.text', 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('contain.text', 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('contain.text', 'Surgical Absence of Cervix')
    })
})
