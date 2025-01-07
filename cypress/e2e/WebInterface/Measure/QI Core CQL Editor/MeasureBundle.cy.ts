import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Measure Bundle end point returns cqlErrors as true', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')


        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Log into the UI and save Measure CQL so the cqlErrors flag will update to true', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //making some minor and invalid change to the Measure CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('#)*&Y)_8)#&$*#$')


        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //log out of UI
        OktaLogin.Logout()
        //log into backend
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.cqlErrors).to.equal(true)


                })

            })
        })

    })
})

describe('Bundle returns elmXML', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Upon saving CQL from the UI, GET Bundle request returns elm xml', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //make some insignificant change
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')

        //save CQL from UI
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry).to.be.a('array')
                    expect(response.body.entry[1].resource.content[1].contentType).to.eql('application/elm+xml')
                    expect(response.body.entry[1].resource.content[1].data).is.not.empty
                })
            })
        })
    })
})

describe('Measure bundle end point returns scoring type for multiple Measure groups', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure bundle end point returns scoring type for multiple Measure groups', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Create second Measure group
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)

        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()
        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('proportion')
                    expect(response.body.entry[0].resource.group[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('cohort')
                    expect(response.body.entry[0].resource.group[1].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[1].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[1].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')
                })
            })
        })
    })
})

describe('Measure bundle end point returns stratifications', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure bundle end point returns stratifications for Cohort Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Surgical Absence of Cervix')
        //Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Surgical Absence of Cervix')
        //Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.reportingTab).click()

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('cohort')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')
                })
            })
        })
    })

    it('Measure bundle end point returns stratifications for Continuous Variable Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents, { delay: 50 })
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'booleanFunction')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'ipp')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(2).click()
        cy.get('#association-select-1-option-2').click()
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'num')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(3).click()
        cy.get('#association-select-2-option-1').click()
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'numeratorExclusion')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(4).click()
        cy.get('#association-select-3-option-2').click()
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('continuous-variable')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('ipp')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('measure-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('num')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].valueCodeableConcept.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].criteria.expression).to.eql('numeratorExclusion')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')
                })
            })
        })
    })

    it('Measure bundle end point returns stratifications for Proportion Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Surgical Absence of Cervix')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(2).click()
        cy.get('#association-select-1-option-0').click()
        cy.get('#association-select-1-option-1').click()
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Surgical Absence of Cervix')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(3).click()
        cy.get('#association-select-2-option-0').click()
        cy.get('#association-select-2-option-2').click()
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'Surgical Absence of Cervix')
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(4).click()
        cy.get('#association-select-3-option-0').click()
        cy.get('#association-select-3-option-4').click()
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('proportion')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('denominator')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-appliesTo')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].valueCodeableConcept.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].criteria.expression).to.eql('Surgical Absence of Cervix')
                })
            })
        })
    })
})

describe('Verify the criteria reference for measure observations', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue + 3
    newCqlLibraryName = CqlLibraryName + randValue + 3

    beforeEach('Create Measure', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure bundle end point returns criteria reference for CV measure observations and is equal to measure population id', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Clear the text in CQL Library Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents, { delay: 50 })
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'booleanFunction')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'ipp')
        //Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'num')
        //Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'measurePopulation')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'numeratorExclusion')
        //Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'measurePopulation')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')

                })
            })
        })
    })

    it('Measure bundle end point returns criteria reference for Ratio measure observations and is equal to measure population id', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Clear the text in CQL Library Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'booleanFunction')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'booleanFunction')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    //Compare denominator population id with denominator criteria reference
                    expect(response.body.entry[0].resource.group[0].population[1].id).to.eql(response.body.entry[0].resource.group[0].population[5].extension[1].valueString)
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('denominator')
                    //Compare numerator population id with numerator criteria reference
                    expect(response.body.entry[0].resource.group[0].population[3].id).to.eql(response.body.entry[0].resource.group[0].population[6].extension[1].valueString)
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('mL millil')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('mL millil')
                })
            })
        })
    })
})
