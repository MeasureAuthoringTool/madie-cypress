import {Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Header} from "../../../../Shared/Header"
import {EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Measure Bundle end point returns cqlErrors as true', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    before('Create Measure and login',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    after('Clean up',() => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Log into the UI and save Measure CQL so the cqlErrors flag will update to true', () => {

        //Navigate away from the page
        cy.get(Header.measures).click()

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //making some minor and invalid change to the Measure CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('#)*&Y)_8)#&$*#$')


        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)

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

    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    after('Clean up',() => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Upon saving CQL from the UI, GET Bundle request returns elm xml', () => {
        //Navigate away from the page
        cy.get(Header.measures).click()

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //save CQL from UI
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundles',
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

    before('Create Measure', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    after('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure bundle end point returns scoring type for multiple Measure groups', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Create second Measure group
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force: true})

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

        //log out of UI
        OktaLogin.Logout()

        //log into backend
        cy.setAccessTokenCookie()

        //send GET Bundle request and verify response includes elm xml value
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('proportion')
                    expect(response.body.entry[0].resource.group[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('cohort')
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
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(7500)
        OktaLogin.Logout()

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure bundle end point returns stratifications for Cohort Measure', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

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
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('cohort')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('Initial Population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('Initial Population')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('Surgical Absence of Cervix')
                })
            })
        })
    })

    it('Measure bundle end point returns stratifications for Continuous Variable Measure', () => {

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
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'ToCode')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'Measure Population')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'numeratorExclusion')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'Measure Population Exclusion')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

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
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('continuous-variable')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('Initial Population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('ipp')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('Measure Population')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('num')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].valueCodeableConcept.coding[0].code).to.eql('Measure Population Exclusion')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].criteria.expression).to.eql('numeratorExclusion')
                })
            })
        })
    })

    it('Measure bundle end point returns stratifications for Proportion Measure', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
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
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
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
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'Denominator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'Numerator')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

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
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('proportion')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('Initial Population')
                    expect(response.body.entry[0].resource.group[0].stratifier[0].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[1].extension[0].valueCodeableConcept.coding[0].code).to.eql('Denominator')
                    expect(response.body.entry[0].resource.group[0].stratifier[1].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].id).to.not.be.empty
                    expect(response.body.entry[0].resource.group[0].stratifier[2].extension[0].valueCodeableConcept.coding[0].code).to.eql('Numerator')
                    expect(response.body.entry[0].resource.group[0].stratifier[2].criteria.expression).to.eql('Surgical Absence of Cervix')
                })
            })
        })
    })
})

describe('Verify the criteria reference for measure observations', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

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
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents, {delay: 50})
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force: true})

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'ToCode')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'Measure Population')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'numeratorExclusion')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'Measure Population Exclusion')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

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
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry[0].resource.group[0].population[1].id).to.eql(response.body.entry[0].resource.group[0].population[3].extension[1].valueString)

                })
            })
        })
    })

    it('Measure bundle end point returns criteria reference for Ratio measure observations and is equal to measure population id', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
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
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(1).click() //select fun
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(2).click() //select isFinishedEncounter
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

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
                    url: '/api/measures/' + id + '/bundles',
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
                })
            })
        })
    })
})