import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"

const timestamp = Date.now()
let measureName = 'QiCoreExportValidations' + timestamp
let CqlLibraryName = 'QiCoreExportValidationsLib' + timestamp
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let elmJson = "{\"library\":{\"identifier\":{\"id\":\"CQLLibraryName1662121072763538\",\"version\":\"0.0.000\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.1.000'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"7\",\"locator\":\"11:1-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \",\"true\"]}]}}],\"expression\":{\"localId\":\"6\",\"locator\":\"12:3-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"}},{\"localId\":\"9\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"9\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"8\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"8\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"18\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"18\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"17\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"16\",\"s\":[{\"s\":[{\"r\":\"11\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"10\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"15\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"15\",\"s\":[{\"r\":\"13\",\"s\":[{\"r\":\"12\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"13\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"17\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"16\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"11\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"10\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"15\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"13\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"14\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"20\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"20\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"19\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"19\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"39\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"39\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"21\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"38\",\"s\":[{\"r\":\"38\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"23\",\"s\":[{\"r\":\"22\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"24\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"37\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"27\",\"s\":[{\"r\":\"26\",\"s\":[{\"r\":\"25\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"26\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"27\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"30\",\"s\":[{\"r\":\"29\",\"s\":[{\"r\":\"28\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"29\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"30\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"33\",\"s\":[{\"r\":\"32\",\"s\":[{\"r\":\"31\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"32\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"33\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"36\",\"s\":[{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"36\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"38\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"23\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"22\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"24\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"37\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"27\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"26\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"25\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"30\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"29\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"28\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"33\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"32\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"31\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"36\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"35\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"21\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"42\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"42\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"40\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"41\",\"s\":[{\"r\":\"41\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"41\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"40\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"45\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"45\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"43\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"44\",\"s\":[{\"r\":\"44\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"44\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[]}]}},\"externalErrors\":[]}"
let measureCQL = MeasureCQL.SBTEST_CQL
let updatedMeasureCQL = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "ipp":\n' +
    'true\n' +
    'define "denom":\n' +
    '"ipp"'

/*
   Tests below all involve failures of the export process.
   EditMeasurePage.actionCenter() assumes success, so we can't use it
*/

describe('Error Message on Measure Export when the Measure does not have Description, Steward and Developers', () => {

    before('Create New Measure and Login', () => {

        cy.setAccessTokenCookie()

        //Create Measure with out Steward and Developer
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure?addDefaultCQL=false',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CqlLibraryName,
                    "model": 'QI-Core v4.1.1',
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    'cql': measureCQL,
                    'elmJson': elmJson,
                    "ecqmTitle": 'eCQMTitle',
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
            })
        })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have Description, Steward and Developers', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Measure Developers')
            cy.get('[data-testid="error-message"] > ul > :nth-child(2)').should('contain.text', 'Missing Steward')
            cy.get('[data-testid="error-message"] > ul > :nth-child(3)').should('contain.text', 'Missing Description')
        })
    })
})

describe('Error Message on Measure Export when the Measure has missing/invalid CQL', () => {

    beforeEach('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    afterEach('Log out and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    //Skipping until MAT-9106 is resolved
    // run this and check modal for message
    it.skip('Verify error message on Measure Export when the Measure does not have CQL', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        })
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {

        //Update Measure CQL with errors
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Contains Errors')
        })
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have Population Criteria', () => {

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Population Criteria')
        })
    })
})

describe('Error Message on Measure Export when the Population Criteria does not match', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    // //Skipping until MAT-9106 is resolved
    it.skip('Verify Error Message on Measure Export when the Population Criteria does not match with CQL', () => {

        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(updatedMeasureCQL)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'CQL return types do not match population criteria! Test Cases will not execute until this issue is resolved.')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Populations Return Types are invalid')
        })
    })
})

describe('Error Message on Measure Export when the PC does not have Improvement Notation set', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Error Message on Measure Export when Population Criteria does not have IN set', () => {

        // based on CreateProportionMeasureGroupAPI, but hardcoded values for this test
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": 'Proportion',
                        "populationBasis": 'boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            }
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                            "value": {
                                "code": "ml",
                                "name": "milliLiters",
                                "guidance": "",
                                "system": "https://clinicaltables.nlm.nih.gov/"
                            }
                        },
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "stratifications": [
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/measureGroupId', response.body.id)
                })
            })
        })

        OktaLogin.Login()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'At least one Population Criteria is missing Improvement Notation')
        })
    })
})

describe('Error Message on Measure Export for Publish when measure was versioned before Madie 2.2.0', () => {

    // this test will rely on PROD data being available in the lower environments
    // this measure must have been versioned prior to Madie 2.2.0 (4/9/2025)
    const specialMeasureName = 'Screening for Abnormal Glucose Metabolism in Patients at Risk of Developing Diabetes: FHIR'

    it('Verify error message when not able to perform Export for Publish', () => {

        OktaLogin.Login()

        // navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).click()

        Utilities.waitForElementVisible('.measures-list', 150500)

        // search for specific measure - last on the list
        cy.get(MeasuresPage.searchInputBox).clear().type(specialMeasureName).type('{enter}')
        cy.get('[data-testid="row-item"]').last().contains('View').click()

        // perform export for publish
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureExportActionBtn).should('be.visible')
        cy.get(EditMeasurePage.editMeasureExportActionBtn).should('be.enabled')
        cy.get(EditMeasurePage.editMeasureExportActionBtn).click()

        Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 50000)
        cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Export for Publishing').click()

        // verify error
        cy.get('.loading-title').should('contain.text', 'Your download could not be completed')
        cy.get('.error-message').should('contain.text', 'Measure cannot be exported for publishing because it was versioned prior to MADiE version 2.2.0. Please use a newer version or select "Export" for this measure.')
    })
})
