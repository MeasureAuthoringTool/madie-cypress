import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName1 = 'TestLibrary' + Date.now()
let measureScoringArray = ['Ratio', 'Cohort', 'CV', 'Proportion']
let mgPVTestType = ['all', 'wOReq', 'wOOpt']

describe('Validate Measure Group additions', () => {

    before('Create measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName1)

    })

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName1)

    })

    it('Able to add complete group to a measure whom already has a group and previous group is not affected', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        Utilities.typeFileContents('cypress/fixtures/EXM124v7QICore4Entry.txt', EditMeasurePage.cqlEditorTextBox)
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

        Utilities.setMeasureGroupType()

        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.validateMeasureGroup((measureScoringArray[3].valueOf()).toString(), mgPVTestType[0])
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist')
        cy.get(MeasureGroupPage.measureGroupOne).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Proportion')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text','Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text','Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('contain.text','Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('contain.text','Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text','Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('contain.text','Surgical Absence of Cervix')

        cy.get(MeasureGroupPage.measureGroupTwo).should('exist')
        cy.get(MeasureGroupPage.measureGroupTwo).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTwo).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text','Surgical Absence of Cervix')

    })

    it('Ensure numbering of groups is updated when group is created and saved out of sequential order', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //clear current CQL Editor contents
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        //read and write CQL from flat file
        Utilities.typeFileContents('cypress/fixtures/CQLForFluentFunction.txt', EditMeasurePage.cqlEditorTextBox)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        for (let i = 1; i <= 4; i++){
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        }

        cy.get(MeasureGroupPage.measureGroupOne).should('exist')
        cy.get(MeasureGroupPage.measureGroupOne).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTwo).should('exist')
        cy.get(MeasureGroupPage.measureGroupTwo).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupThree).should('exist')
        cy.get(MeasureGroupPage.measureGroupThree).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupFour).should('exist')
        cy.get(MeasureGroupPage.measureGroupFour).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupFive).should('exist')
        cy.get(MeasureGroupPage.measureGroupFive).should('be.visible')

        Utilities.setMeasureGroupType()
        Utilities.waitForElementVisible(MeasureGroupPage.measureScoringSelect, 20700)

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.waitForElementVisible(MeasureGroupPage.initialPopulationSelect, 20700)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect,'Initial Population')



        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.measureGroupThree).should('exist')
        cy.get(MeasureGroupPage.measureGroupThree).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupThree).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text','Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text','Initial Population')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist')
        cy.get(MeasureGroupPage.measureGroupTwo).should('exist')
        cy.get(MeasureGroupPage.measureGroupThree).should('exist')
        cy.get(MeasureGroupPage.measureGroupFour).should('not.exist')
        cy.get(MeasureGroupPage.measureGroupFive).should('not.exist')

    })
})