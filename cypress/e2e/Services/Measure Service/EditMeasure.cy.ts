import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"
import { TestData } from "../../../Shared/TestData"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let updatedMeasureName = ''
let updatedCQLLibraryName = ''
let harpUser = ''
let harpUserALT = ''
const measureCQL = MeasureCQL.SBTEST_CQL
const model = 'QI-Core v4.1.1'

const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

const updatedMeasureCql = "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\""

const updatedMeasureBody = (
    { measureId, versionId }: { measureId: string, versionId: string },
    overrides: Record<string, unknown> = {}
) => ({
    'id': measureId,
    'measureName': updatedMeasureName,
    'cql': updatedMeasureCql,
    'cqlLibraryName': updatedCQLLibraryName,
    'model': model,
    "version": "0.0.000",
    'measureScoring': 'Ratio',
    'versionId': versionId,
    'measureSetId': uuidv4(),
    "reviewMetaData": {
        "approvalDate": null,
        "lastReviewDate": null
    },
    "measureSet": {
        "id": "68ac804018f2135a1f3a17d3",
        "cmsId": null,
        "measureSetId": "db336d58-3f9c-407f-88f6-890cec960a83",
        "owner": "test.ReUser6408",
        "acls": null
    },
    "ecqmTitle": "ecqmTitle",
    "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
    "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z",
    "testCaseConfiguration": {
        "id": null,
        "sdeIncluded": null
    },
    "scoring": null,
    "baseConfigurationTypes": null,
    "patientBasis": true,
    "rateAggregation": null,
    "improvementNotation": null,
    "improvementNotationDescription": null,
    "measureMetaData": { "experimental": false, "draft": true },
    ...overrides
})

const validationMeasureBody = (
    context: { measureId: string, versionId: string },
    overrides: Record<string, unknown>,
    includeCql = true
) => {
    const body = updatedMeasureBody(context, {
        "ecqmTitle": "eCQMTitle",
        'cql': measureCQL,
        ...overrides
    })

    if (!includeCql) {
        delete body.cql
    }

    return body
}

const overlongMeasureName = 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
    'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
    'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
    'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
    'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwqwertyqwertyqwertyqwertyqwertyq'

describe('Measure Service: Edit Measure', () => {

    updatedMeasureName = measureName + 1 + randValue
    updatedCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        let newMName = 'TestMeasureA' + Date.now() + randVal
        let newCqlLibName = 'TestCqlA' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMName, newCqlLibName, measureCQL)

        harpUser = OktaLogin.setupUserSession(false)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Update Measure details', () => {
        TestData.updateCurrentMeasure(({ measureId, versionId }) => ({
            "id": measureId,
            "measureName": updatedMeasureName,
            "cqlLibraryName": updatedCQLLibraryName,
            "model": model,
            "cql": "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
            "version": "0.0.000",
            "measureScoring": "Ratio",
            "versionId": versionId,
            "measureSetId": uuidv4(),
            'measureMetaData': {
                "experimental": false,
                "steward": {
                    "name": "SemanticBits",
                    "id": "64120f265de35122e68dac40",
                    "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                    "url": "https://semanticbits.com/"
                }, "draft": true
            },
            "reviewMetaData": {
                "approvalDate": null,
                "lastReviewDate": null
            },
            "measureSet": {
                "id": "68ac804018f2135a1f3a17d3",
                "cmsId": null,
                "measureSetId": "db336d58-3f9c-407f-88f6-890cec960a83",
                "owner": "test.ReUser6408",
                "acls": null
            },
            "ecqmTitle": "ecqmTitle",
            "measurementPeriodStart": mpStartDate,
            "measurementPeriodEnd": mpEndDate,
            "testCaseConfiguration": {
                "id": null,
                "sdeIncluded": null
            },
            "scoring": null,
            "baseConfigurationTypes": null,
            "patientBasis": true,
            "rateAggregation": null,
            "improvementNotation": null,
            "improvementNotationDescription": null,
        })).then((response) => {
            expect(response.status).to.eql(200)
            cy.log('Measure updated successfully')
        })
    })

    it('Verify Supplemental Data Elements and Risk Adjustment Variables are added to Update Measure Model', () => {
        TestData.updateCurrentMeasure(({ measureId, versionId }) => ({
            "id": measureId,
            "measureName": updatedMeasureName,
            "cqlLibraryName": updatedCQLLibraryName,
            "model": model,
            "cql": "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
            "version": "0.0.000",
            "measureScoring": "Ratio",
            "measureMetaData": { "experimental": false, "draft": true },
            "reviewMetaData": {
                "approvalDate": null,
                "lastReviewDate": null
            },
            "measureSet": {
                "id": "68ac804018f2135a1f3a17d3",
                "cmsId": null,
                "measureSetId": "db336d58-3f9c-407f-88f6-890cec960a83",
                "owner": "test.ReUser6408",
                "acls": null
            },
            "ecqmTitle": "ecqmTitle",
            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z",
            "testCaseConfiguration": {
                "id": null,
                "sdeIncluded": null
            },
            "scoring": null,
            "baseConfigurationTypes": null,
            "patientBasis": true,
            "rateAggregation": null,
            "improvementNotation": null,
            "improvementNotationDescription": null,
            "versionId": versionId,
            "measureSetId": uuidv4(),
            "supplementalData": [
                {
                    "definition": "supplementalDataDefinition",
                    "description": "supplementalDataDescription"
                },
                {
                    "definition": "supplementalDataDefinition2",
                    "description": "supplementalDataDescription2"
                }
            ],
            "riskAdjustments": [
                {
                    "definition": "riskAdjustmentDefinition",
                    "description": "riskAdjustmentDescription"
                },
                {
                    "definition": "riskAdjustmentDefinition2",
                    "description": "riskAdjustmentDescription2"
                }
            ]
        })).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.supplementalData[0].definition).to.eql('supplementalDataDefinition')
            expect(response.body.supplementalData[0].description).to.eql('supplementalDataDescription')
            expect(response.body.supplementalData[1].definition).to.eql('supplementalDataDefinition2')
            expect(response.body.supplementalData[1].description).to.eql('supplementalDataDescription2')
            expect(response.body.riskAdjustments[0].definition).to.eql('riskAdjustmentDefinition')
            expect(response.body.riskAdjustments[0].description).to.eql('riskAdjustmentDescription')
            expect(response.body.riskAdjustments[1].definition).to.eql('riskAdjustmentDefinition2')
            expect(response.body.riskAdjustments[1].description).to.eql('riskAdjustmentDescription2')
            cy.log('Measure updated successfully')
        })
    })

    it('Save CQL to the measure', () => {
        TestData.updateCurrentMeasure(({ measureId, versionId }) => ({
            'id': measureId,
            'measureName': updatedMeasureName,
            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
            'cqlLibraryName': updatedCQLLibraryName,
            'model': model,
            "version": "0.0.000",
            'measureScoring': 'Ratio',
            'versionId': versionId,
            "reviewMetaData": {
                "approvalDate": null,
                "lastReviewDate": null
            },
            "measureSet": {
                "id": "68ac804018f2135a1f3a17d3",
                "cmsId": null,
                "measureSetId": "db336d58-3f9c-407f-88f6-890cec960a83",
                "owner": "test.ReUser6408",
                "acls": null
            },
            "ecqmTitle": "ecqmTitle",
            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z",
            "testCaseConfiguration": {
                "id": null,
                "sdeIncluded": null
            },
            "scoring": null,
            "baseConfigurationTypes": null,
            "patientBasis": true,
            "rateAggregation": null,
            "improvementNotation": null,
            "improvementNotationDescription": null,
            'measureSetId': uuidv4(),
            "measureMetaData": { "experimental": false, "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Measure Steward to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            "ecqmTitle": "eCQMTitle",
            "measurementPeriodStart": mpStartDate,
            "measurementPeriodEnd": mpEndDate,
            'measureMetaData': {
                "experimental": false,
                "steward": {
                    "name": "SemanticBits",
                    "id": "64120f265de35122e68dac40",
                    "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                    "url": "https://semanticbits.com/"
                }, "draft": true
            }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Description to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "description": "SemanticBits", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Copyright to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "copyright": "copyright", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Disclaimer to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "disclaimer": "disclaimer", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Rationale to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "rationale": "rationale", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Author to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "author": "author", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Guidance to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "guidance": "guidance", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Risk Adjustment to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
            'riskAdjustmentDescription': "desc",
            'riskAdjustments': [{ 'definition': "SDE Payer" }]
        })).then((response) => {
            expect(response.status).to.eql(200)
        })

        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
            'riskAdjustmentDescription': "desc",
            'riskAdjustments': [{ 'definition': "" }]
        })).then((response) => {
            expect(response.status).to.eql(200)
        })

        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
            'riskAdjustmentDescription': "desc",
            'riskAdjustments': [{ 'definition': null }]
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Meta Data Endorser Fields to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': {
                "experimental": false,
                "endorsements": [
                    {
                        "endorser": "NQF",
                        "endorserSystemId": "78888",
                        "endorsementId": "1234"
                    }
                ]
            }
        })).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.measureMetaData.endorsements[0].endorser).to.eql('NQF')
            expect(response.body.measureMetaData.endorsements[0].endorserSystemId).to.eql('78888')
            expect(response.body.measureMetaData.endorsements[0].endorsementId).to.eql('1234')
        })
    })

    it('Add scoring precision value to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            "ecqmTitle": "eCQMTitle",
            'measureMetaData': {
                "experimental": false,
                "endorsements": [
                    {
                        "endorser": "NQF",
                        "endorserSystemId": "78888",
                        "endorsementId": "1234"
                    }
                ]
            },
            "scoringPrecision": 2
        })).then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Add Intended Venue to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            "measureMetaData": {
                "experimental": false,
                "draft": true,
                "intendedVenue": {
                    "code": "eh",
                    "codeSystem": "http://hl7.org/fhir/us/cqfmeasures/CodeSystem/intended-venue-codes",
                    "display": "EH"
                }
            }
        })).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.measureMetaData.intendedVenue.code).to.eql('eh')
            cy.log('Measure updated successfully')
        })
    })

    it('Add Purpose to the measure', () => {
        TestData.updateCurrentMeasure((context) => updatedMeasureBody(context, {
            'measureMetaData': { "experimental": false, "purpose": "reason for the measure to be made", "draft": true }
        })).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.measureMetaData.purpose).to.eql('reason for the measure to be made')
        })
    })
})

describe('Measure Service: Attempt to add RA when user is not owner of measure', () => {

    updatedMeasureName = measureName + 1 + randValue
    updatedCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure and Set Access Token', () => {
        harpUser = OktaLogin.getUser(false)
        harpUserALT = OktaLogin.getUser(true)

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        let newMName = 'TestMeasureB' + Date.now() + randVal
        let newCqlLibName = 'TestCqlB' + Date.now() + randVal

        CreateMeasurePage.CreateQICoreMeasureAPI(newMName, newCqlLibName, measureCQL)
    })

    it('Attempt to add Meta Data Risk Adjustment to the measure, when the user is not the owner', () => {
        OktaLogin.setupUserSession(true)
        OktaLogin.AltLogin()

        let measureId = ''
        TestData.updateCurrentMeasure((context) => {
            measureId = context.measureId
            return updatedMeasureBody(context, {
                'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
                'riskAdjustmentDescription': "desc",
                'riskAdjustments': [{ 'definition': "SDE Payer" }]
            })
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(403)
            expect(response.body.message).to.include('User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId)
        })
    })
})

describe('Edit Measure Validations', () => {

    updatedMeasureName = measureName + 2 + randValue
    updatedCQLLibraryName = cqlLibraryName + 2 + randValue

    let newMName = ''
    let newCqlLibName = ''

    beforeEach('Create Measure ans Set Access token', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        newMName = 'TestMeasureC' + Date.now() + randVal
        newCqlLibName = 'TestCqlC' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMName, newCqlLibName, measureCQL)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message when the measure name is empty', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            'measureName': ""
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.measureName).to.eql('Measure Name is required.')
        })
    })

    it('Verify error message when the measure name does not contain at least 1 letter', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            'measureName': '12343456456'
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.measureName).to.eql('A measure name must contain at least one letter.')
        })
    })

    it('Verify error message when the measure name contains underscore', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            'measureName': 'Test_Measure'
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.measureName).to.eql('Measure Name can not contain underscores.')
        })
    })

    it('Verify error message when CQL is missing', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            'measureMetaData': {
                "experimental": false,
                "steward": {
                    "name": "SemanticBits",
                    "id": "64120f265de35122e68dac40",
                    "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                    "url": "https://semanticbits.com/"
                }, "draft": true
            },
            "measurementPeriodStart": mpStartDate,
            "measurementPeriodEnd": mpEndDate
        }, false), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql('Cql is required.')
        })
    })

    it('Verify error message when the measure name is over 500 characters', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            'measureName': overlongMeasureName
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.measureName).to.eql('Measure Name can not be more than 500 characters.')
        })
    })
})

describe('Measurement Period Validations', () => {

    updatedMeasureName = measureName + 3 + randValue
    updatedCQLLibraryName = cqlLibraryName + 3 + randValue

    let newMNameD = ''
    let newCqlLibNameD = ''

    beforeEach('Create Measure', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        newMNameD = 'TestMeasureD' + Date.now() + randVal
        newCqlLibNameD = 'TestCqlD' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMNameD, newCqlLibNameD, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            "measurementPeriodStart": mpEndDate,
            "measurementPeriodEnd": mpStartDate
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql('Measurement period end date should be greater than measurement period start date.')
        })
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            "measurementPeriodStart": "",
            "measurementPeriodEnd": ""
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql('Measurement period date is required and must be valid')
        })
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {
        TestData.updateCurrentMeasure((context) => validationMeasureBody(context, {
            "measurementPeriodStart": "1823-01-01T05:00:00.000+0000",
            "measurementPeriodEnd": "3023-01-01T05:00:00.000+0000"
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql('Measurement periods should be between the years 1900 and 2099.')
        })

    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {
        TestData.updateCurrentMeasure((context) => {
            const body = validationMeasureBody(context, {
                "ecqmTitle": "ecqmTitle"
            })
            delete body.versionId
            delete body.measureSetId
            delete body.measureMetaData
            return body
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.error).to.eql("Bad Request")
        })
    })
})
