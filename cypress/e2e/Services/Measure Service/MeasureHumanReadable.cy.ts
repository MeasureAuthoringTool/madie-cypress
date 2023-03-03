import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../Shared/Utilities"

let measureName = 'MeasureHumanReadable' + Date.now()
let CqlLibraryName = 'MeasureHumanReadable' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

let measureCQL = 'library SimpleFhirMeasure version \'0.0.001\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period" \n' +
    '  \n' +
    'define "denom":\n' +
    '    "ipp"\n' +
    '    \n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n' +
    '      \n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

describe.skip('Measure Human Readable', () => {

    before('Create Measure, Measure group and set Access token', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

        //Create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
    })

    after('Clean up Measures', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure Human Readable end point returns 200', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/measureSetId').should('exist').then((measureSetId) => {
                    cy.readFile('cypress/fixtures/versionId').should('exist').then((versionId) => {

                        cy.request({
                            url: '/api/human-readable',
                            method: 'PUT',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": measureId,
                                "measureHumanReadableId": null,
                                "measureSetId": measureSetId,
                                "version": "0.0.000",
                                "cqlLibraryName": newCqlLibraryName,
                                "ecqmTitle": "eCQMTitle",
                                "measureName": newMeasureName,
                                "active": true,
                                "cqlErrors": false,
                                "errors": [],
                                "cql": measureCQL,
                                "measurementPeriodStart": mpStartDate,
                                "measurementPeriodEnd": mpEndDate,
                                "model": "QI-Core v4.1.1",
                                "versionId": versionId
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).is.not.null
                        })
                    })
                })
            })
        })
    })
})
