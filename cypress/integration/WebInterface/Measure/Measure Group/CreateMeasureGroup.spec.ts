import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import assert = require("assert")

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureGroupType = 'Process'
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let mgPVTestType = ['all', 'wOReq', 'wOOpt']
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Validate Measure Group', () => {

    before('Create measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify default values in Measure Group page', () => {

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

        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //get current value what is in the scoring box
        cy.get(MeasureGroupPage.measureScoringSelect).find(':selected').should('to.have.value', measureScoringArray[1])
    })

    it('Verify values in the scoring drop down box', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.wait(10000)
        //validate values in the scoring drop down box
        cy.get('#scoring-unit-select').find('option').then(options => {
            const actual = [...options].map(o => o.value)
            expect(actual).to.deep.eq(['Select', 'Cohort', 'Continuous Variable', 'Proportion', 'Ratio'])
        })
    })

    it('Verify value in the Measure Group Type field', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //validate value in the group type field
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('contain.text', measureGroupType)

    })

    it('Initial Population being populated from CQL', () => {

        //click on Edit button to edit measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //validate population definitions are those that were added via CQL
        cy.get(MeasureGroupPage.initialPopulationSelect).find('option:nth-child(1)').should('contain.text', 'SDE Ethnicity')

    })
})

describe('Validate Measure Group -- scoring and populations', () => {

    beforeEach('Create New Measure and Login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    it('Scoring unit and population association saves and persists with a Measure Group Description', () => {

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('SDE Payer')
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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('SDE Payer')

    })

    it('Add UCUM Scoring unit to the Measure Group', () => {

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[1].valueOf()).toString(), mgPVTestType[0])

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('ml')
        //Select ml milliLiters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitfullName).click()
        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('SDE Payer')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })
    })

    it('Add second initial population for Ratio Measure', () => {

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

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.log((measureScoringArray[0].valueOf()).toString())
        //select scoring unit as Ratio on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[0].valueOf()).toString())
        Utilities.validateMeasureGroup((measureScoringArray[0].valueOf()).toString(), mgPVTestType[0])

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).select('Initial Population')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //validate data is saved in mongo database --> future addition to automated test script

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify that the population and the scoring unit that was saved, together, appears
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('SDE Payer')
        cy.get(MeasureGroupPage.secondInitialPopulationSelect).contains('Initial Population')
        cy.get(MeasureGroupPage.measureGroupDescriptionBox)
            .then(($message) => {
                expect($message.val().toString()).to.equal('MeasureGroup Description value')
            })
    })
})

describe('Validate Population Basis', () => {

    before('Create measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')

    })

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify if no value is selected for Population Basis, the save button is unavailable', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force:true})

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Measure Populations for Ratio Measure
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('{del}')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('not.be.enabled')
 
    })

    it('Verify default value is "Boolean"', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force:true})

        //measure group description
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Measure Populations for Ratio Measure
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).then(($text) => {
            assert($text.text(), 'Boolean')
        })
        //should('contain.text', 'Boolean')
 
    })
})
