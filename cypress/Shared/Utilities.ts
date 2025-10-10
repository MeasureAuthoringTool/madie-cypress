import { TestCasesPage } from "./TestCasesPage"
import { MeasureGroupPage } from "./MeasureGroupPage"
import { CQLLibraryPage } from "./CQLLibraryPage"
import { v4 as uuidv4 } from 'uuid'
import { Environment } from "./Environment"
import { Measure } from "@madie/madie-models"

const adminApiKey = Environment.credentials().adminApiKey
const harpUser = Environment.credentials().harpUser
const harpUserALT = Environment.credentials().harpUserALT

export enum PermissionActions {
    GRANT = 'GRANT',
    REVOKE = 'REVOKE'
}

export enum MadieObject {
    Measure = 'measure',
    Library = 'library',
    TestCase = 'testCase'
}

export class Utilities {

    public static readonly dirtCheckModal = '.MuiDialogContent-root'
    public static readonly discardChangesContinue = '[data-testid="discard-dialog-continue-button"]'
    public static readonly discardChangesConfirmationModal = '.MuiBox-root'
    public static readonly keepWorkingCancel = '[data-testid="discard-dialog-cancel-button"]'
    public static readonly DiscardCancelBtn = '[data-testid="cancel-button"]'
    public static readonly DiscardButton = '[data-testid="discard-button"]'

    public static clickOnDiscardChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }

    public static clickOnKeepWorking(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }

    public static UpdateMeasureAddMetaDataAPI(measureName: string, CqlLibraryName: string, measureCQL: string): void {

        const now = require('dayjs')
        let currentUser = Cypress.env('selectedUser')
        let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let elmJson = "{\"library\":{\"identifier\":{\"id\":\"CQLLibraryName1662121072763538\",\"version\":\"0.0.000\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.1.000'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"7\",\"locator\":\"11:1-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \",\"true\"]}]}}],\"expression\":{\"localId\":\"6\",\"locator\":\"12:3-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"}},{\"localId\":\"9\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"9\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"8\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"8\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"18\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"18\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"17\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"16\",\"s\":[{\"s\":[{\"r\":\"11\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"10\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"15\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"15\",\"s\":[{\"r\":\"13\",\"s\":[{\"r\":\"12\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"13\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"17\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"16\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"11\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"10\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"15\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"13\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"14\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"20\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"20\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"19\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"19\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"39\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"39\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"21\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"38\",\"s\":[{\"r\":\"38\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"23\",\"s\":[{\"r\":\"22\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"24\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"37\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"27\",\"s\":[{\"r\":\"26\",\"s\":[{\"r\":\"25\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"26\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"27\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"30\",\"s\":[{\"r\":\"29\",\"s\":[{\"r\":\"28\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"29\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"30\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"33\",\"s\":[{\"r\":\"32\",\"s\":[{\"r\":\"31\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"32\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"33\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"36\",\"s\":[{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"36\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"38\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"23\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"22\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"24\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"37\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"27\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"26\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"25\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"30\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"29\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"28\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"33\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"32\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"31\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"36\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"35\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"21\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"42\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"42\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"40\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"41\",\"s\":[{\"r\":\"41\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"41\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"40\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"45\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"45\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"43\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"44\",\"s\":[{\"r\":\"44\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"44\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[]}]}},\"externalErrors\":[]}"

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/versionId').should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            'id': id,
                            'measureName': measureName,
                            'cqlLibraryName': CqlLibraryName,
                            'ecqmTitle': 'eCQMTitle',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            'model': 'QI-Core v4.1.1',
                            'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                            'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                            'cql': measureCQL,
                            'elmJson': elmJson,
                            'measureMetaData': {
                                "experimental": false,
                                "steward": {
                                    "name": "SemanticBits",
                                    "id": "64120f265de35122e68dac40",
                                    "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                                    "url": "https://semanticbits.com/"
                                }
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
                            'programUseContext': {
                                "code": "mips",
                                "display": "MIPS",
                                "codeSystem": "http://hl7.org/fhir/us/cqfmeasures/CodeSystem/quality-programs"
                            }
                        }
                    }).then((response) => {
                        console.log(response)
                        expect(response.status).to.eql(200)
                        cy.log("Measure Updated successfully")
                    })
                })
            })
        })
    }

    public static deleteMeasure(measureName?: string, cqlLibraryName?: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {
        const currentUser = Cypress.env('selectedUser')
        let measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }


        if ((altUser === undefined) || (altUser === null)) {
            altUser = false
        }
        if (currentUser === 'harpUserALT') {
            altUser = true
        }

        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        } else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }
        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId' + measureNumber
        }

        if (deleteSecondMeasure) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId2'
        }

        let measureData: Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {

                cy.request({
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.active).to.eql(true)
                    measureData = response.body
                    measureData.active = false

                    cy.request({
                        url: '/api/measures/' + id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: measureData
                    }).then((response) => {
                        console.log(response)

                        expect(response.status).to.eql(200)
                        cy.log('Measure Deleted Successfully')
                    })
                })
            })
        })
    }

    public static deleteVersionedMeasure(measureName: string, cqlLibraryName: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {
        const currentUser = Cypress.env('selectedUser')
        let user = ''
        let measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }

        if (currentUser === 'harpUserALT') {
            altUser = true
        }

        if (altUser) {
            user = Environment.credentials().harpUserALT
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        } else {
            user = Environment.credentials().harpUser
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }
        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId' + measureNumber
        }
        if (deleteSecondMeasure) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId2'
        }
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpId': user
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    cy.log("Measure Deleted successfully")
                })
            })

        })
    }

    public static textValues = {
        dataLines: null
    }

    public static typeFileContents(file: string, pageResource: string): void {
        cy.get(pageResource).should('exist')
        cy.get(pageResource).should('be.visible')
        cy.get(pageResource).click()
        cy.readFile(file).should('exist').then((fileContents) => {
            cy.get(pageResource).focused().type(fileContents)
        })
    }

    public static readWriteFileData(file: string, pageResource: string): void {
        cy.fixture(file).then((str) => {
            // split file by line endings
            const fileArr = str.split(/\r?\n/);
            // log file in form of array
            cy.log(fileArr);
            // remove new line endings
            const cqlArr = fileArr.map((line: any) => {
                const goodLine = line.split(/[\r\n]+/);
                return goodLine[0];
            });
            // log new array
            cy.log(cqlArr);
            for (let i in cqlArr) {
                if (cqlArr[i] == '' || cqlArr[i] == null || cqlArr[i] == undefined) {
                    cy.get(pageResource).type('{enter}')
                } else {
                    this.textValues.dataLines = cqlArr[i]
                    cy.get(pageResource)
                        .type(this.textValues.dataLines)
                        .type('{enter}')
                    this.textValues.dataLines = null
                }

            }
        })
    }

    public static waitForElementEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.enabled')
    }

    public static waitForElementVisible = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.visible')
    }

    public static waitForElementToNotExist = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('not.exist')
    }

    public static waitForElementDisabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('not.be.enabled')
    }

    public static waitForElementWriteEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('exist')
        cy.get(element, { timeout: timeout }).should('be.visible')
        cy.get(element, { timeout: timeout }).should('not.be.disabled')
        cy.get(element, { timeout: timeout }).should('not.have.attr', 'readonly', 'readonly')
    }

    public static validationMeasureGroupSaveAll(measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break
            }
            case 'Cohort': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break

            }
        }
    }

    public static dropdownSelect(dropdownDataElement: string, valueDataElement: string): void {
        cy.get(dropdownDataElement).should('exist').should('be.visible')

        if (valueDataElement == MeasureGroupPage.measureScoringCohort ||
            valueDataElement == MeasureGroupPage.measureScoringProportion ||
            valueDataElement == MeasureGroupPage.measureScoringRatio ||
            valueDataElement == MeasureGroupPage.measureScoringCV ||
            valueDataElement == CQLLibraryPage.cqlLibraryModelQICore ||
            valueDataElement == CQLLibraryPage.cqlLibraryModelQDM ||
            valueDataElement == MeasureGroupPage.qdmScoringCohort ||
            valueDataElement == MeasureGroupPage.qdmScoringCV ||
            valueDataElement == MeasureGroupPage.qdmScoringProportion ||
            valueDataElement == MeasureGroupPage.qdmScoringRatio

        ) {
            cy.get(dropdownDataElement).wait(250).click().wait(1000)
            cy.get(valueDataElement).wait(250).click().wait(1000)
        } else if (dropdownDataElement == '[id="improvement-notation-select"]' ||
            dropdownDataElement == MeasureGroupPage.initialPopulationSelect
        ) {
            cy.get(dropdownDataElement)
                .wait(500)
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .wait(500)
                .click()
                .wait(500)
        } else {
            Utilities.waitForElementVisible(dropdownDataElement, 50000)
            cy.get(dropdownDataElement)
                .wait(500)
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .wait(500)
                .click()
        }
    }

    public static populationSelect(populationType: string, populationOption: string): void {
        cy.get(populationType).should('exist').should('be.visible')

        if (populationType == MeasureGroupPage.initialPopulationSelect ||
            populationType == MeasureGroupPage.denominatorSelect ||
            populationType == MeasureGroupPage.denominatorExclusionSelect ||
            populationType == MeasureGroupPage.denominatorExceptionSelect ||
            populationType == MeasureGroupPage.numeratorSelect ||
            populationType == MeasureGroupPage.numeratorExclusionSelect ||
            populationType == MeasureGroupPage.measurePopulationSelect ||
            populationType == MeasureGroupPage.measurePopulationExclusionSelect ||
            populationType == MeasureGroupPage.measureObservationPopSelect ||
            populationType == MeasureGroupPage.firstInitialPopulationSelect ||
            populationType == MeasureGroupPage.secondInitialPopulationSelect
        ) {
            cy.get(populationType).click()
            cy.get('[data-value="' + populationOption + '"]').click()
        }
    }

    public static setMeasureGroupType(): void {

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).wait(1000).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).wait(100).type('Process').wait(100).type('{downArrow}').wait(100).type('{enter}').wait(500)
        cy.get('[data-testid="populationBasis"]').click()
    }

    public static validateErrors(errorElementObject: string, errorContainer: string, errorMsg1: string, errorMsg2?: string): void {

        cy.wait(2000)
        cy.get(errorElementObject).should('exist')
        cy.get(errorElementObject).should('be.visible')
        cy.get(errorElementObject).invoke('show').click({ force: true, multiple: true })
        if ((errorMsg1 != null) || (errorMsg1 != undefined)) {
            cy.get(errorContainer).invoke('show').should('contain', errorMsg1)
        }
    }

    public static validateToastMessage(message: string, timeout?: number) {

        if (!timeout) {
            cy.get(TestCasesPage.successMsg).should('have.text', message)
        } else {
            cy.get(TestCasesPage.successMsg, { timeout }).should('have.text', message)
        }
    }

    public static setSharePermissions(objectType: MadieObject, action: PermissionActions, user: string) {
        let currentUser = Cypress.env('selectedUser')
        let path: string
        let urlPath: string

        if (objectType === MadieObject.Library) {
            path = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'
            urlPath = 'cql-libraries'
        } else {
            path = 'cypress/fixtures/' + currentUser + '/measureId'
            urlPath = 'measures'
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(path).should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/' + urlPath + '/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": user,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": action
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    if (action === PermissionActions.GRANT) {
                        expect(response.body[0].userId).to.eql(user)
                        expect(response.body[0].roles[0]).to.eql('SHARED_WITH')
                    }
                })
            })
        })
    }

    public static checkAll() {

        cy.get('thead th').find('input[type="checkbox"]').check()
    }

    public static deleteLibrary(libraryName: string, altUser?: boolean, libraryNumber?: number) {

        const currentUser = Cypress.env('selectedUser')
        let libraryPath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'

        if (currentUser === 'harpUserALT') {
            altUser = true
        }

        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        } else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }

        if (libraryNumber > 0) {
            libraryPath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId' + libraryNumber
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(libraryPath).should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    console.log(response)

                    expect(response.status).to.eql(200)
                    cy.log('Library Deleted Successfully')
                })
            })

        })
    }

    public static lockControl(type: MadieObject, lockObject: boolean, altUser?: boolean) {
        let currentUser = Cypress.env('selectedUser')
        let action = 'PUT'
        if (!lockObject) {
            action = 'DELETE'
        }
        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        } else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }


        switch (type) {

            case MadieObject.Measure:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                        cy.request({
                            url: '/api/measures/' + id + '/measure-lock',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                            },
                            method: action
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
                break

            case MadieObject.TestCase:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                        cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((tcId) => {
                            let lockUrl = '/api/measures/' + measureId + '/test-cases/' + tcId + '/lock'
                            if (!lockObject) {
                                lockUrl = '/api/test-cases/' + tcId + '/unlock'
                            }

                            cy.request({
                                url: lockUrl,
                                headers: {
                                    authorization: 'Bearer ' + accessToken.value,
                                },
                                method: action
                            }).then((response) => {
                                expect(response.status).to.eql(200)
                            })
                        })
                    })
                })
                break

            case MadieObject.Library:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {

                        cy.request({
                            url: '/api/cql-libraries/' + id + '/lock',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                            },
                            method: action
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
                break

            default:
                cy.log('No action. Unsupported type.')
        }
    }

    public static verifyAllLocksDeleted(type: MadieObject, altUser?: boolean) {
        // only works with harpUser now, no current use-case to support altUser
        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        } else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }

        switch (type) {

            case MadieObject.Measure:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.request({
                        url: '/api/measures/unlock',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value,
                        },
                        method: 'DELETE'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.include('No measure locks found for harpId: ' + harpUser)
                        expect(response.body).to.include('No test case locks found for harpId: ' + harpUser)
                    })
                })
                break

            case MadieObject.Library:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                        cy.request({
                            url: '/api/cql-libraries/unlock',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                            },
                            method: 'DELETE'
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            if (altUser) {
                                expect(response.body).to.include('Delete library locks for harpId: ' + harpUserALT)
                                expect(response.body).to.include('Deleted library lock for Id: ' + id)
                            }
                            else {
                                // if not altUser, then check for the library lock deletion message
                                expect(response.body).to.include('Delete library locks for harpId: ' + harpUser)
                                expect(response.body).to.include('Deleted library lock for Id: ' + id)
                            }
                        })
                    })
                })
                break

            default:
                cy.log('No action. Unsupported type.')
        }
    }
}
