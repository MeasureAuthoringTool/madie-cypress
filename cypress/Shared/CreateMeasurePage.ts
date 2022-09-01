import { Environment } from "./Environment"
import {LandingPage} from "./LandingPage"
import {MeasuresPage} from "./MeasuresPage"

export class CreateMeasurePage {

    public static readonly createMeasureButton = 'button[data-testid="create-new-measure-save-button"]'
    public static readonly cancelButton = '[data-testid=create-new-measure-cancel-button]'
    public static readonly measureNameTextbox = '[data-testid=measure-name-text-field]'
    public static readonly measureModelDropdown = '#model-select'
    public static readonly measureModelQICore = '[data-testid="measure-model-option-QI-Core v4.1.1"]'
    public static readonly measureModelFieldLevelError = '.MuiFormHelperText-root'
    public static readonly eCQMAbbreviatedTitleTextbox = '[data-testid="ecqm-input"]'
    public static readonly eCQMAbbreviatedTitleFieldLevelError = '[data-testid="ecqmTitle-helper-text"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name"]'
    public static readonly measureNameFieldLevelError = '[data-testid=measureName-helper-text]'
    public static readonly cqlLibraryNameFieldLevelError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly serverErrorMsg = '[data-testid="server-error-alerts"]'
    public static readonly serverErrorMsgCloseIcon = '[data-testid="server-error-alerts"]'
    public static readonly measurementPeriodStartDate = '[name=measurementPeriodStart]'
    public static readonly measurementPeriodEndDate = '[name=measurementPeriodEnd]'
    public static readonly measurementPeriodStartDateError = '[data-testid=measurementPeriodStart-helper-text]'
    public static readonly measurementPeriodEndDateError = '[data-testid=measurementPeriodEnd-helper-text]'


    public static clickCreateMeasureButton() : void {

        let alias = 'measure' + (Date.now()+1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/measure').as(alias)

        cy.get(this.createMeasureButton).click()

        //saving measureID to file to use later
        cy.wait('@' + alias).then(({response}) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/measureId', response.body.id)
        })
    }

    public static CreateQICoreMeasure(measureName: string,CqlLibraryName: string) : void {

        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('MM/DD/YYYY')
        let mpEndDate = now().format('MM/DD/YYYY')

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(this.measureNameTextbox).type(measureName)
        cy.get(this.measureModelDropdown).click()
        cy.get(this.measureModelQICore).click()
        cy.get(this.eCQMAbbreviatedTitleTextbox).type('eCQMTitle')
        cy.get(this.cqlLibraryNameTextbox).type(CqlLibraryName)

        cy.get(CreateMeasurePage.measurementPeriodStartDate).type(mpStartDate)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type(mpEndDate)

        this.clickCreateMeasureButton()

        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        cy.log( 'Measure created successfully')
    }

    public static CreateQICoreMeasureAPI(measureName: string, CqlLibraryName: string, measureCQL?: string, twoMeasures?: boolean, altUser?: boolean): string {

        let user = ''
        const now = require('dayjs')
        let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let elmJson = "{\"library\":{\"identifier\":{\"id\":\"SimpleFhirMeasure\",\"version\":\"0.0.001\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.0.001\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.0.001'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"15\",\"locator\":\"11:1-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"15\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"13\",\"s\":[{\"s\":[{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"s\":[{\"r\":\"6\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"12\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"12\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"9\",\"s\":[{\"r\":\"8\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"9\",\"s\":[{\"value\":[\"period\"]}]}]},{\"value\":[\".\"]},{\"r\":\"10\",\"s\":[{\"value\":[\"start\"]}]}]},{\"r\":\"12\",\"value\":[\" \",\"during\",\" \"]},{\"r\":\"11\",\"s\":[{\"value\":[\"\\\"Measurement Period\\\"\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"14\",\"locator\":\"12:3-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"13\",\"locator\":\"12:10-12:73\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"7\",\"locator\":\"12:10-12:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"6\",\"locator\":\"12:10-12:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"12\",\"locator\":\"12:26-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"In\",\"operand\":[{\"name\":\"ToDateTime\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"10\",\"locator\":\"12:32-12:45\",\"resultTypeName\":\"{http://hl7.org/fhir}dateTime\",\"path\":\"start\",\"type\":\"Property\",\"source\":{\"localId\":\"9\",\"locator\":\"12:32-12:39\",\"resultTypeName\":\"{http://hl7.org/fhir}Period\",\"path\":\"period\",\"scope\":\"E\",\"type\":\"Property\"}}]},{\"localId\":\"11\",\"locator\":\"12:54-12:73\",\"name\":\"Measurement Period\",\"type\":\"ParameterRef\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]}}}},{\"localId\":\"17\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"17\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"16\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"16\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"26\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"26\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"25\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"24\",\"s\":[{\"s\":[{\"r\":\"19\",\"s\":[{\"r\":\"18\",\"s\":[{\"r\":\"18\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"23\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"23\",\"s\":[{\"r\":\"21\",\"s\":[{\"r\":\"20\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"21\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"22\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"25\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"24\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"19\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"18\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"23\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"21\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"22\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"28\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"28\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"27\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"27\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"47\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"47\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"29\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"46\",\"s\":[{\"r\":\"46\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"31\",\"s\":[{\"r\":\"30\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"32\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"45\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"r\":\"33\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"34\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"38\",\"s\":[{\"r\":\"37\",\"s\":[{\"r\":\"36\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"37\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"38\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"41\",\"s\":[{\"r\":\"40\",\"s\":[{\"r\":\"39\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"40\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"41\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"44\",\"s\":[{\"r\":\"43\",\"s\":[{\"r\":\"42\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"43\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"44\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"46\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"31\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"30\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"32\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"45\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"35\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"33\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"38\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"37\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"36\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"41\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"40\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"39\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"44\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"43\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"42\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"29\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"50\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"50\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"48\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"49\",\"s\":[{\"r\":\"49\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"49\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"48\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"53\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"53\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"51\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"52\",\"s\":[{\"r\":\"52\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"52\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"Enc\",\"operandTypeSpecifier\":{\"localId\":\"51\",\"locator\":\"37:43-37:51\",\"resultTypeName\":\"{http://hl7.org/fhir}Encounter\",\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}]}]}},\"externalErrors\":[]}"
        let ecqmTitle = 'eCQMTitle'

        if (altUser)
        {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else
        {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': measureName,
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    'createdBy': user,
                    "ecqmTitle": ecqmTitle,
                    'cql': measureCQL,
                    'elmJson': elmJson,
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                if (twoMeasures === true)
                {
                    cy.writeFile('cypress/fixtures/measureId2', response.body.id)
                }
                else
                {
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                }

            })
        })
        return user
    }

    public static CreateAPIQICoreMeasureWithCQL(measureName: string, CqlLibraryName: string, measureCQL?: string, twoMeasures?: boolean, altUser?: boolean): string {

        let user = ''
        const now = require('dayjs')
        let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let elmJson = "{\"library\":{\"identifier\":{\"id\":\"SimpleFhirMeasureLib\",\"version\":\"0.0.004\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"2:1-2:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"3:1-3:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.0.001\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.0.001'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"4:1-4:49\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"'Measurement Period'\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"4:32-4:49\",\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"localId\":\"3\",\"locator\":\"4:41-4:48\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"5:1-5:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"5:1-5:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"5:1-5:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}}]}},\"externalErrors\":[]}"

        if (altUser)
        {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else
        {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': measureName,
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    'createdBy': user,
                    'cql': measureCQL,
                    'elmJson': elmJson,
                    "ecqmTitle": "ecqmTitle",
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                if (twoMeasures === true)
                {
                    cy.writeFile('cypress/fixtures/measureId2', response.body.id)
                }
                else
                {
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                }

            })
        })
        return user
    }
}