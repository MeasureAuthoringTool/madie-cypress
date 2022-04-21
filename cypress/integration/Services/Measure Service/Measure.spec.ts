import {Utilities} from "../../../Shared/Utilities";

export {}
import {Environment} from "../../../Shared/Environment"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"

let measureName = ''
let newMeasureName = ''
let CQLLibraryName = ''
let newCQLLibraryName = ''
let model = 'QI-Core'
let measureScoring = ''
let harpUser = Environment.credentials().harpUser
let measureNameU = 'TestMeasure' + Date.now() + 1
let CqlLibraryNameU = 'TestLibrary' + Date.now() + 1
let measureScoringU = MeasureGroupPage.measureScoringUnit
let defaultUser = ''

describe('Measure Service: Create Measure', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()
    })
    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName, measureScoring)

    })
    //create measure
    it('Create New Measure, successful creation', () => {
        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "measureScoring": measureScoring}
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
            })
        })
    })

    //Get All Measures
    it('Get all Measures', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                cy.get(response.body.content.length)
                expect(response.body.content[0].id).to.be.exist
            })
        })
    })

    //Get Measures by User
    it('Get all Measures created by logged in User', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures?currentUser=true',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                cy.get(response.body.content.length)
                expect(response.body.content[0].id).to.be.exist
                expect(response.body.content[0].createdBy).to.eql(harpUser)
            })
        })
    })

    //Measure Name Validations
    it('Validation Error: Measure Name empty', () => {
        measureName = ''
        CQLLibraryName = 'TestCql' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name is required.")
            })
        })
    })

    it('Validation Error: Measure Name does not contain alphabets', () => {
        measureName = '123456'
        CQLLibraryName = 'TestCql' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("A measure name must contain at least one letter.")
            })
        })
    })

    it('Validation Error: Measure Name contains under scores', () => {
        measureName = 'Test_Measure'
        CQLLibraryName = 'TestCql' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name can not contain underscores.")
            })
        })
    })

    it('Validation Error: Measure Name contains more than 500 characters', () => {
        measureName = 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwqwertyqwertyqwertyqwertyqwertyq'
        CQLLibraryName = 'TestCql' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name can not be more than 500 characters.")
            })
        })
    })

    it('Validation Error: Model Invalid Value', () => {
        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()
        model = 'QI-CoreINVALID'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql("MADiE was unable to complete your request, please try again.")
            })
        })
    })

})

describe('Measure Service: Create different Measure types', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Create Cohort Measure', () => {
        measureName = 'CohortTestMeasure' + Date.now()
        CQLLibraryName = 'CohortTestLibrary' + Date.now()
        measureScoring = 'Cohort'
        model = 'QI-Core'

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CQLLibraryName, measureScoring)

        Utilities.deleteMeasure(measureName, CQLLibraryName, measureScoring)

    })

    it('Create Proportion Measure', () => {
        measureName = 'ProportionTestMeasure' + Date.now()
        CQLLibraryName = 'ProportionTestLibrary' + Date.now()
        measureScoring = 'Proportion'
        model = 'QI-Core'

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CQLLibraryName, measureScoring)

        Utilities.deleteMeasure(measureName, CQLLibraryName, measureScoring)

    })

    it('Create Continuous Variable Measure', () => {
        measureName = 'CVTestMeasure' + Date.now()
        CQLLibraryName = 'CVTestLibrary' + Date.now()
        measureScoring = 'Continuous Variable'
        model = 'QI-Core'

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CQLLibraryName, measureScoring)

        Utilities.deleteMeasure(measureName, CQLLibraryName, measureScoring)

    })

    it('Create Ratio Measure', () => {
        measureName = 'RatioTestMeasure' + Date.now()
        CQLLibraryName = 'RatioTestLibrary' + Date.now()
        measureScoring = 'Ratio'
        model = 'QI-Core'

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CQLLibraryName, measureScoring)

        Utilities.deleteMeasure(measureName, CQLLibraryName, measureScoring)

    })

})

describe('Measure Service: CQL Library name validations', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Validation Error: CQL library Name empty', () => {

        CQLLibraryName = ''
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is required.")
            })
        })
    })

    it('Validation Error: CQL library Name does not starts with an upper case letter', () => {

        CQLLibraryName = 'test'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains spaces', () => {

        CQLLibraryName = 'Test 222'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains underscores', () => {

        CQLLibraryName = 'Test_222'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains special characters', () => {

        CQLLibraryName = 'Test!@#%$^&'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name does not contain alphabets', () => {

        CQLLibraryName = '123456'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name start with number', () => {

        CQLLibraryName = '123Test'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name already exists', () => {

        CQLLibraryName = 'TestCql1640794914452'
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("CQL library with given name already exists.")
            })
        })
    })

})

describe('Measure Service: Measure Scoring Validations', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Validation Error: Measure Scoring Empty', () => {

        measureName = 'MeasureScoringTest' + Date.now()
        CQLLibraryName = 'ScoringTestLibrary' + Date.now()
        measureScoring = ""

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
            })
        })
    })

    it('Validation Error: Measure Scoring Invalid value', () => {

        measureName = 'MeasureScoringTest' + Date.now()
        CQLLibraryName = 'ScoringTestLibrary' + Date.now()
        measureScoring = 'ahjsm$&^&'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureScoring).to.eql("Value provided is not a valid option.")
            })
        })
    })
})

describe('Measure Service: Authentication', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Bad Access Token', () => {

        measureName = 'MeasureScoringTest' + Date.now()
        CQLLibraryName = 'ScoringTestLibrary' + Date.now()
        measureScoring = 'Cohort'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value + 'TEST'
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "measureScoring": measureScoring
                }
            }).then((response) => {
                expect(response.status).to.eql(401)
                expect(response.statusText).to.eql('Unauthorized')
            })
        })
    })
})

describe('Measure Service: Update Delete Flag', () => {

    beforeEach('Set access token and create a new measure to run update against', () =>{
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureNameU + randValue
        newCQLLibraryName = CqlLibraryNameU + randValue

        defaultUser = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureScoringU)

    })
        //update / delete measure
        it('Update / delete measure', () => {
            measureScoring = 'Cohort'    
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/'+id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "measureScoring": measureScoring, "active": false, "createdBy": defaultUser}
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql("Measure updated successfully.")
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
    
                        }).then((response) => {
                            expect(response.status).to.eql(404)
                    })

                })
            })
        })
        //attempt to update measure that does not belong to user
        it('Attempt to update / delete measure that does not belong to current user', () => {

            newCQLLibraryName = 'TestLibrary2' + Date.now() + 1
            let user = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureScoringU)
            cy.clearCookies()
            cy.clearLocalStorage()
            //set local user that does not own the measure
            cy.setAccessTokenCookieALT()

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/'+id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "measureScoring": measureScoringU, "active": false, "createdBy": user}
                        }).then((response) => {
                            expect(response.status).to.eql(403)
                    })
                })
            })

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
                            expect(response.body.active).to.eql(true)
                    })

                })
            })

            Utilities.deleteMeasure(newMeasureName, newCQLLibraryName, measureScoringU)
        })
        //attempt to update / delete measure that does not exist
        it('Attempt to update / delete measure that does not exist', () => {
            measureScoring = 'Cohort' 
                    
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/'+id+'1',
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id+1, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "measureScoring": measureScoring, "active": false, "createdBy": defaultUser}
                        }).then((response) => {
                            expect(response.status).to.eql(400)
                    })
                })
            })
        })
        it('After updating / deleting measure, test cases should be unavailable, too', () => {
            measureScoring = 'Cohort'

            let title = 'someTitleValue'
            let series = 'SomeSeriesValue'
            let description = 'SomeDescription'
            let testCaseJson = TestCaseJson.TestCaseJson_Valid


            TestCasesPage.CreateTestCaseAPI(title, description, series, testCaseJson)
                    
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/'+id,
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "measureScoring": measureScoring, "active": false, "createdBy": defaultUser}
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
    
                        }).then((response) => {
                            expect(response.status).to.eql(404)
                    })

                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'GET',
    
                        }).then((response) => {
                            expect(response.status).to.eql(404)
                        })
                    })
                })
            })
        })
})




