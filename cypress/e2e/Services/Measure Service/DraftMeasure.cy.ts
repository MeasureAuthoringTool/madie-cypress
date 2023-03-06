import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let cohortMeasureCQL = MeasureCQL.CQL_For_Cohort
let mIdFilePath = 'cypress/fixtures/measureId'
let mSetIdPath = 'cypress/fixtures/measureSetId'
let mVersionIdPath = 'cypress/fixtures/versionId'
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let elmJson = "{\"library\":{\"identifier\":{\"id\":\"SimpleFhirMeasureLib\",\"version\":\"0.0.004\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"2:1-2:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"3:1-3:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.0.001'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"4:1-4:49\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"'Measurement Period'\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"4:32-4:49\",\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"localId\":\"3\",\"locator\":\"4:41-4:48\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"5:1-5:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"5:1-5:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"5:1-5:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}}]}},\"externalErrors\":[]}"
let harpUser = Environment.credentials().harpUser
let measureName = 'TestMeasure' + Date.now()

describe('Version and Draft CQL Library', () => {

    beforeEach('Create Measure, and add Cohort group', () => {
        cy.setAccessTokenCookie()
        //Create Measure
        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.log('Updated CQL name, on measure, is ' + newCqlLibraryName)
        OktaLogin.Logout()
        cy.setAccessTokenCookie()
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
    })

    it('Add Draft to the Versioned measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                            cy.writeFile('cypress/fixtures/draftId', response.body.id)
                        })
                    })
                })
            })
        })
    })

    it('User cannot create a draft when a draft already exists, per measure', () => {
        let newerMeasureName = ''

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                    newerMeasureName = response.body.measureName
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(400)
                            expect(response.body.message).to.eql('Can not create a draft for the measure "' + newerMeasureName + '". Only one draft is permitted per measure.')
                        })
                    })
                })
            })
        })
    })
})

describe('Draftable API end point tests', () => {

    beforeEach('Create Measure, and add Cohort group', () => {
        cy.setAccessTokenCookie()
        //Create Measure
        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction('edit', true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.log('Updated CQL name, on measure, is ' + newCqlLibraryName)
        OktaLogin.Logout()
        cy.setAccessTokenCookie()
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
    })
    it('Draftable end point return measure set id that was used in request and false if the measure is not version', () => {
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                cy.request({
                    url: '/api/measures/draftstatus?measureSetIds=' + mSetId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).has.property(mSetId).and.is.eql(false)
                })
            })
        })

    })
    it('Draftable end point return measure set id that was used in request and false if another measure, in that measure family, is in a draft status', () => {
        let newerMeasureName = ''
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                    newerMeasureName = response.body.measureName
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                            cy.writeFile('cypress/fixtures/measureId', response.body.id)
                        })
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=minor',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.1.000')
                    newerMeasureName = response.body.measureName
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,

                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)

                        })
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                cy.request({
                    url: '/api/measures/draftstatus?measureSetIds=' + mSetId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).has.property(mSetId).and.is.eql(false)
                })
            })
        })

    })
    it('Draftable end point return measure set id that was used in request and true if the measure is versioned, regardless of version type (major, minor, or patch)', () => {
        let newerMeasureName = ''
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                    newerMeasureName = response.body.measureName
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                cy.request({
                    url: '/api/measures/draftstatus?measureSetIds=' + mSetId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).has.property(mSetId).and.is.eql(true)
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                            cy.writeFile('cypress/fixtures/measureId', response.body.id)
                        })
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=minor',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.1.000')
                    newerMeasureName = response.body.measureName
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                cy.request({
                    url: '/api/measures/draftstatus?measureSetIds=' + mSetId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).has.property(mSetId).and.is.eql(true)
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mIdFilePath).should('exist').then((measureAID) => {
                cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                    cy.readFile(mVersionIdPath).should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measureName,
                                'cqlLibraryName': newCqlLibraryName,
                                'model': 'QI-Core v4.1.1',
                                'createdBy': harpUser,
                                'cql': cohortMeasureCQL,
                                'elmJson': elmJson,
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                            cy.writeFile('cypress/fixtures/measureId', response.body.id)
                        })
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=patch',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.1.001')
                    newerMeasureName = response.body.measureName
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(mSetIdPath).should('exist').then((mSetId) => {
                cy.request({
                    url: '/api/measures/draftstatus?measureSetIds=' + mSetId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).has.property(mSetId).and.is.eql(true)
                })
            })
        })
    })
})