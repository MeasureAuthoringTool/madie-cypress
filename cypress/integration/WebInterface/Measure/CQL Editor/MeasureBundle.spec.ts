import {Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Header} from "../../../../Shared/Header"
import {EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureScoring = 'Proportion'
let measureCQL = "library SimpleFhirMeasureLib version '0.0.004'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\nparameter 'Measurement Period' Interval<DateTime>\ncontext Patient\ndefine 'ipp':\n  exists ['Encounter'] E where E.period.start during 'Measurement Period'\ndefine 'denom':\n  'ipp'\ndefine 'num':\n  exists ['Encounter'] E where E.status ~ 'finished'"
let PopIniPop = 'ipp'
let PopNum = 'num'
let PopDenom = 'denom'
let PopDenex = 'ipp'
let PopDenexcep = 'denom'
let PopNumex = 'numeratorExclusion'

//skipping until bug MAT-4450 is fixed
describe('Measure Bundle end point returns cqlErrors as true', () => {
    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        //create Measure Group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
    })

    beforeEach('Set Access Token',() => {

        OktaLogin.Login()


    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)

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
        cy.wait(1000)

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
    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        //create Measure Group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
    })

    beforeEach('Login',() => {

        OktaLogin.Login()


    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName+5)

    })

    it('Upon saving CQL from the UI, GET Bundle request returns elmxml', () => {
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

        //send GET Bundle request and verify response includes elmxml value
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