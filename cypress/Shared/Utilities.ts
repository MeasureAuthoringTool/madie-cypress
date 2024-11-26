import { TestCasesPage } from "./TestCasesPage"
import { Header } from "./Header"
import { MeasureGroupPage } from "./MeasureGroupPage"
import { CQLLibraryPage } from "./CQLLibraryPage"
import { v4 as uuidv4 } from 'uuid'
import { Environment } from "./Environment"

let deleteMeasureAdminAPIKey = Environment.credentials().deleteMeasureAdmin_API_Key

export class Utilities {

    public static UpdateMeasureAddMetaDataAPI(measureName: string, CqlLibraryName: string, measureCQL: string): void {

        const now = require('dayjs')

        let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let elmJson = "{\"library\":{\"identifier\":{\"id\":\"CQLLibraryName1662121072763538\",\"version\":\"0.0.000\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.1.000'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"7\",\"locator\":\"11:1-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \",\"true\"]}]}}],\"expression\":{\"localId\":\"6\",\"locator\":\"12:3-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"}},{\"localId\":\"9\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"9\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"8\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"8\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"18\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"18\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"17\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"16\",\"s\":[{\"s\":[{\"r\":\"11\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"10\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"15\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"15\",\"s\":[{\"r\":\"13\",\"s\":[{\"r\":\"12\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"13\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"17\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"16\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"11\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"10\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"15\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"13\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"14\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"20\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"20\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"19\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"19\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"39\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"39\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"21\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"38\",\"s\":[{\"r\":\"38\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"23\",\"s\":[{\"r\":\"22\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"24\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"37\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"27\",\"s\":[{\"r\":\"26\",\"s\":[{\"r\":\"25\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"26\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"27\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"30\",\"s\":[{\"r\":\"29\",\"s\":[{\"r\":\"28\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"29\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"30\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"33\",\"s\":[{\"r\":\"32\",\"s\":[{\"r\":\"31\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"32\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"33\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"36\",\"s\":[{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"36\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"38\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"23\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"22\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"24\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"37\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"27\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"26\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"25\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"30\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"29\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"28\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"33\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"32\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"31\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"36\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"35\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"21\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"42\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"42\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"40\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"41\",\"s\":[{\"r\":\"41\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"41\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"40\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"45\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"45\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"43\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"44\",\"s\":[{\"r\":\"44\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"44\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[]}]}},\"externalErrors\":[]}"

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
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

    public static deleteMeasure(measureName: string, cqlLibraryName: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {

        let measurePath = 'cypress/fixtures/measureId'
        let versionIdPath = 'cypress/fixtures/versionId'
        let measureSetIdPath = 'cypress/fixtures/measureSetId'
        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let ecqmTitle = 'eCQMTitle'
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }

        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        }
        else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }
        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/measureId' + measureNumber
            versionIdPath = 'cypress/fixtures/versionId' + measureNumber
            measureSetIdPath = 'cypress/fixtures/measureSetId' + measureNumber
        }

        if (deleteSecondMeasure) {
            measurePath = 'cypress/fixtures/measureId2'
            versionIdPath = 'cypress/fixtures/versionId2'
            measureSetIdPath = 'cypress/fixtures/measureSetId2'
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.readFile(measureSetIdPath).should('exist').then((measureSetId) => {
                        cy.request({
                            url: '/api/measures/' + id,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": id, "measureName": measureName, "cqlLibraryName": cqlLibraryName, "ecqmTitle": ecqmTitle,
                                "model": 'QI-Core v4.1.1', "measurementPeriodStart": mpStartDate, "measurementPeriodEnd": mpEndDate, "active": false, "versionId": vId, "measureSetId": measureSetId
                            }
                        }).then((response) => {
                            console.log(response)

                            expect(response.status).to.eql(200)
                            cy.log('Measure Deleted Successfully')
                        })
                    })
                })
            })
        })
    }

    public static deleteVersionedMeasure(measureName: string, cqlLibraryName: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {

        let measurePath = 'cypress/fixtures/measureId'
        let versionIdPath = 'cypress/fixtures/versionId'
        let measureSetIdPath = 'cypress/fixtures/measureSetId'
        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let ecqmTitle = 'eCQMTitle'
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }

        if (altUser) {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookieALT()
        }
        else {
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
        }
        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/measureId' + measureNumber
            versionIdPath = 'cypress/fixtures/versionId' + measureNumber
            measureSetIdPath = 'cypress/fixtures/measureSetId' + measureNumber
        }

        if (deleteSecondMeasure) {
            measurePath = 'cypress/fixtures/measureId2'
            versionIdPath = 'cypress/fixtures/versionId2'
            measureSetIdPath = 'cypress/fixtures/measureSetId2'
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.readFile(measureSetIdPath).should('exist').then((measureSetId) => {
                        cy.request({
                            url: '/api/admin/measures/' + id,
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + accessToken.value,
                                'api-key': deleteMeasureAdminAPIKey
                            },
                            body: {
                                "id": id,
                                "measureName": measureName,
                                "cqlLibraryName": cqlLibraryName,
                                "model": 'QI-Core v4.1.1',
                                "versionId": vId,
                                "measureSetId": measureSetId,
                                "ecqmTitle": ecqmTitle,
                                "measurementPeriodStart": mpStartDate,
                                "measurementPeriodEnd": mpEndDate,
                                "active": true
                            }
                        }).then((response) => {
                            console.log(response)

                            expect(response.status).to.eql(200)
                            cy.log('Versioned Measure Deleted Successfully')
                        })
                    })
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
                }
                else {
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
        cy.get(element, { timeout: timeout }).should('be.disabled')
    }

    public static waitForElementWriteEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('exist')
        cy.get(element, { timeout: timeout }).should('be.visible')
        cy.get(element, { timeout: timeout }).should('not.be.disabled')
        cy.get(element, { timeout: timeout }).should('not.have.attr', 'readonly', 'readonly')
    }

    public static validateTCPopValueCheckBoxes(measureScoreValue: string): void {
        switch (measureScoreValue) {
            case "Ratio": {
                //validate what available check boxes should and shouldn't be present / visible
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Proportion': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Continuous Variable': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'MSRPOPLEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Cohort': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break

            }
            default: { }
        }
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

    public static validationMeasureGroupSaveWithoutRequired(measureScoreValue: string | string[]): void {
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({ force: true })
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Select Denominator')
                cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select Numerator')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Select Denominator')
                cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select Numerator')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
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
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.measurePopulationSelect).should('contain.text', 'Select Measure Population')
                break
            }
            case 'Cohort': {
                //verify the correct populations are displayed and not displayed
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
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                break

            }

        }
    }

    public static validationMeasureGroupSaveWithoutOptional(measureScoreValue: string | string[]): void {
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({ force: true })
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Surgical Absence of Cervix')
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
                break

            }

        }
    }

    public static validateMeasureGroup(measureScoreValue: any | any[], mgPVTestType: string | string[]): void {
        //log, in cypress, the test type value
        cy.log((mgPVTestType.valueOf()).toString())

        switch ((mgPVTestType.valueOf()).toString()) {
            case "all": {

                //log, in cypress, the measure score value
                cy.log((mgPVTestType.valueOf()).toString())
                this.validationMeasureGroupSaveAll((measureScoreValue.valueOf()).toString())
                break
            }
            case 'wOReq': {
                this.validationMeasureGroupSaveWithoutRequired((measureScoreValue.valueOf()).toString())
                //save measure group button is not enabled
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('not.be.enabled')
                break
            }
            case 'wOOpt': {
                //based on the scoring unit value, select a value for all population fields
                this.validationMeasureGroupSaveWithoutOptional((measureScoreValue.valueOf()).toString())
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
            cy.get(dropdownDataElement).click()
            cy.get(valueDataElement).click()
        }
        else {
            cy.get(dropdownDataElement)
                .parent()
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .click()
        }
    }

    public static setMeasureGroupType(): void {

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
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
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').wait(500).type('{enter}')
    }

    public static validateErrors(errorElementObject: string, errorContainer: string, errorMsg1: string, errorMsg2?: string): void {

        cy.get(errorElementObject).should('exist')
        cy.get(errorElementObject).should('be.visible')
        cy.get(errorElementObject).invoke('show').wait(1000).click({ force: true, multiple: true })
        // cy.wait(1000)
        // cy.get(errorContainer).invoke('show').should('contain.text', errorMsg1)
        if ((errorMsg1 != null) || (errorMsg1 != undefined)) {
            cy.wait(1000)
            cy.get(errorContainer).invoke('show').should('contain', errorMsg1)
        }

    }

    public static validateToastMessage(message: string, timeout?: number) {

        if (!timeout) {
            cy.get('.toast').should('have.text', message)
        } else {
            cy.get('.toast', { timeout }).should('have.text', message)
        }
    }
}
