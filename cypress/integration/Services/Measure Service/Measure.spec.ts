import {Utilities} from "../../../Shared/Utilities"
import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {Environment} from "../../../Shared/Environment"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"

let measureName = ''
let newMeasureName = ''
let CQLLibraryName = ''
let newCQLLibraryName = ''
let model = 'QI-Core'
let harpUser = Environment.credentials().harpUser
let measureNameU = 'TestMeasure' + Date.now() + 1
let CqlLibraryNameU = 'TestLibrary' + Date.now() + 1
let measureScoringU = MeasureGroupPage.measureScoringUnit
let defaultUser = ''
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let measureCQL = MeasureCQL.SBTEST_CQL
let eCQMTitle = 'eCQMTitle'

describe('Measure Service: Create Measure', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()
    })
    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)

    })
    //create measure
    it('Create New Measure, successful creation', () => {
        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": mpStartDate,
                       "measurementPeriodEnd": mpEndDate}
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
                    "model": model
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
                    "model": model
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
                    "model": model
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
                    "model": model
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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql("MADiE was unable to complete your request, please try again.")
            })
        })
    })

})

describe('Measure Service: CQL Library name validations', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Validation Error: CQL library Name empty', () => {

        CQLLibraryName = ''

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is required.")
            })
        })
    })

    it('Validation Error: CQL library Name does not starts with an upper case letter', () => {

        measureName = 'test'
        CQLLibraryName = 'test'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains spaces', () => {

        measureName = 'test'
        CQLLibraryName = 'Test 222'
        model = 'QI-Core'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains underscores', () => {

        measureName = 'test'
        CQLLibraryName = 'Test_222'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name contains special characters', () => {

        measureName = 'test'
        CQLLibraryName = 'Test!@#%$^&'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name does not contain alphabets', () => {

        measureName = 'test'
        CQLLibraryName = '123456'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name start with number', () => {

        measureName = 'test'
        CQLLibraryName = '123Test'

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
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is invalid.")
            })
        })
    })

    it('Validation Error: CQL library Name already exists', () => {

        newMeasureName = 'TestMeasure'+ Date.now()
        CQLLibraryName = 'CQLLibraryName' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, CQLLibraryName, measureCQL)

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
                    "ecqmTitle": eCQMTitle,
                    "model": model
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("CQL library with given name already exists.")
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
                    "model": model
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
        let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.0.001'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude MATGlobalCommonFunctionsQICore4 version '5.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "

        defaultUser = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)

    })
        //update / delete measure
        it('Update / delete measure', () => {
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/'+id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": mpStartDate,
                               "measurementPeriodEnd": mpEndDate, "active": false, "createdBy": defaultUser}
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
            let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.0.001'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude MATGlobalCommonFunctionsQICore4 version '5.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "
            let user = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)

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
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "ecqmTitle": "eCQMTitle", "measureScoring": measureScoringU, "active": false, "createdBy": user}
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

            Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
        })
        //attempt to update / delete measure that does not exist
        it('Attempt to update / delete measure that does not exist', () => {

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/'+id+'1',
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id+1, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "active": false, "createdBy": defaultUser}
                        }).then((response) => {
                            expect(response.status).to.eql(400)
                    })
                })
            })
        })
        it('After updating / deleting measure, test cases should be unavailable, too', () => {

            let title = 'someTitleValue'
            let series = 'SomeSeriesValue'
            let description = 'SomeDescription'
            let TCJson = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter", "resource": { "resourceType": "Encounter","meta": { "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"}, "text": { "status": "generated","div":"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Sep 9th 2021 for Asthma<a name=\\\"mm\\\"/></div>"}, "status": "finished","class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2023-09-10T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>"},"identifier": [ { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'


            TestCasesPage.CreateTestCaseAPI(title, series, description, TCJson)

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/'+id,
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {"id": id, "measureName": newMeasureName, "cqlLibraryName": newCQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": mpStartDate,
                               "measurementPeriodEnd": mpEndDate, "active": false, "createdBy": defaultUser}
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

describe('Measurement Period Validations', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": mpEndDate,
                       "measurementPeriodEnd": mpStartDate}
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement period end date should be greater than or equal to measurement period start date.")
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": "",
                       "measurementPeriodEnd": ""}
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement period date is required and must be valid")
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "ecqmTitle": eCQMTitle, "measurementPeriodStart": "1823-01-01T05:00:00.000+0000",
                       "measurementPeriodEnd": "3023-01-01T05:00:00.000+0000"}
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement periods should be between the years 1900 and 2099.")
            })
        })

    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {"measureName": measureName, "cqlLibraryName": CQLLibraryName, "model": model, "measurementPeriodStart": "01/01/2021",
                       "measurementPeriodEnd": "01/01/2023"}
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql("Bad Request")
            })
        })

    })

})

describe('Measure Service: eCQM abbreviated title validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Validation error: ecqm abbreviated title empty', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                        "measureName": measureName,
                        "cqlLibraryName": CQLLibraryName,
                        "model": model,
                        "ecqmTitle": "",
                        "measurementPeriodStart": mpStartDate,
                        "measurementPeriodEnd": mpEndDate
                      }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.eql("eCQM Abbreviated Title is required.")
            })
        })

    })

    it('Validation error: ecqm abbreviated title more than 32 characters', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                        "measureName": measureName,
                        "cqlLibraryName": CQLLibraryName,
                        "model": model,
                        "ecqmTitle": 'This test is for measure name validation.This test is',
                        "measurementPeriodStart": mpStartDate,
                        "measurementPeriodEnd": mpEndDate
                      }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.eql("eCQM Abbreviated Title cannot be more than 32 characters.")
            })
        })

    })
})




