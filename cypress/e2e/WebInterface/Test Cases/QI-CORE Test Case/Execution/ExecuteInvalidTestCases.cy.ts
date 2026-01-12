import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"

const now = Date.now()
const measureName = 'TestMeasure' + now
const CqlLibraryName = 'RETCBVLibrary' + now
const testCase: TestCase = {
    title: 'test case title',
    description: 'DENOMFail' + now,
    group: 'SBTestSeries'
}
let measureCQL = 'library CohortEpisodeEncounter1699460161402 version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '   Global."Inpatient Encounter"'

const invalidTestCaseJson = '{\n' +
    '  "resourceType": "Account",\n' +
    '  "id": "ip-pass-Encounter",\n' +
    '  "meta": {\n' +
    '    "versionId": "3",\n' +
    '    "lastUpdated": "2022-09-14T12:38:39.889Z"\n' +
    '  },\n' +
    '  "type": "collection",\n' +
    '  "entry": [\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Patient/d6d7c86d-103c-493b-8778-b096abd3d051",\n' +
    '      "resource": {\n' +
    '        "id": "d6d7c86d-103c-493b-8778-b096abd3d051",\n' +
    '        "resourceType": "Patient",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
    '          ]\n' +
    '        },\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "type": {\n' +
    '              "coding": [\n' +
    '                {\n' +
    '                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
    '                  "code": "MR"\n' +
    '                }\n' +
    '              ]\n' +
    '            },\n' +
    '            "system": "http://myGoodHealthcare.com/MRN",\n' +
    '            "value": "8065dc8d26797064d8766be71f2bf020"\n' +
    '          }\n' +
    '        ],\n' +
    '        "active": true,\n' +
    '        "name": [\n' +
    '          {\n' +
    '            "use": "usual",\n' +
    '            "family": "IPPass",\n' +
    '            "given": [\n' +
    '              "Inpatient Encounter"\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "gender": "male",\n' +
    '        "birthDate": "1954-02-10"\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Encounter/5c6c61ceb84846536a9a98f9",\n' +
    '      "resource": {\n' +
    '        "id": "5c6c61ceb84846536a9a98f9",\n' +
    '        "resourceType": "Encounter",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
    '          ]\n' +
    '        },\n' +
    '        "status": "finished",\n' +
    '        "class": {\n' +
    '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
    '          "code": "AMB",\n' +
    '          "display": "ambulatory"\n' +
    '        },\n' +
    '        "type": [\n' +
    '          {\n' +
    '            "coding": [\n' +
    '              {\n' +
    '                "system": "http://snomed.info/sct",\n' +
    '                "code": "444971000124105",\n' +
    '                "display": "Annual wellness visit (procedure)"\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "subject": {\n' +
    '          "reference": "Patient/d6d7c86d-103c-493b-8778-b096abd3d051"\n' +
    '        },\n' +
    '        "priority": {\n' +
    '          "coding": [\n' +
    '            {\n' +
    '              "system": "http://snomed.info/sct",\n' +
    '              "code": "103391001",\n' +
    '              "display": "Urgency"\n' +
    '            }\n' +
    '          ]\n' +
    '        },\n' +
    '        "period": {\n' +
    '          "start": "2022-07-15T08:00:00Z",\n' +
    '          "end": "2022-07-15T09:00:00Z"\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  ]\n' +
    '}'

describe('Run / Execute Invalid Test Cases', () => {

    beforeEach('Login and Create Measure', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.clearAllSessionStorage({log: true})

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.description, testCase.group, invalidTestCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Run / Execute Invalid Test case on Test Case list page when the Execute Invalid Test case option is enabled', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and enable Execute invalid Test cases option
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Execute Options page and enable Execute test cases regardless of validation status option
        cy.get(TestCasesPage.executionOptionsSubTab).click()
        cy.get(TestCasesPage.executeInvalidTestCasesCheckBox).click()
        cy.get(TestCasesPage.saveExecutionOptionsBtn).click()
        cy.get(TestCasesPage.executionOptionsSuccessMsg).should('contain.text', 'Test Case Configuration Updated Successfully')
        Utilities.waitForElementToNotExist(TestCasesPage.executionOptionsSuccessMsg, 70000)

        //Navigate back to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify warning message
        cy.get(TestCasesPage.executionOptionsToastMsg).should('contain.text', 'Execution of invalid test cases is enabled. You may receive inaccurate pass/fail results. You can update this setting in Execution Configuration tab.')

        //Verify execution status on Test Case list page and Run
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })

    it('Run / Execute Invalid Test case on Edit Test Case page when the Execute Invalid Test case option is enabled', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and enable Execute invalid Test cases option
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Execute Options page and enable Execute test cases regardless of validation status option
        cy.get(TestCasesPage.executionOptionsSubTab).click()
        cy.get(TestCasesPage.executeInvalidTestCasesCheckBox).click()
        cy.get(TestCasesPage.saveExecutionOptionsBtn).click()
        cy.get(TestCasesPage.executionOptionsSuccessMsg).should('contain.text', 'Test Case Configuration Updated Successfully')
        Utilities.waitForElementToNotExist(TestCasesPage.executionOptionsSuccessMsg, 70000)

        //Navigate back to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify warning message and status on test Case list page
        cy.get(TestCasesPage.executionOptionsToastMsg).should('contain.text', 'Execution of invalid test cases is enabled. You may receive inaccurate pass/fail results. You can update this setting in Execution Configuration tab.')
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')

        //Verify execution status on Edit Test Case page
        cy.get(TestCasesPage.executionOptionsToastMsg).should('contain.text', 'Execution of invalid test cases is enabled. You may receive inaccurate pass/fail results. You can update this setting in Execution Configuration tab.')
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.enabled')

        //Click on Run Test Case button
        cy.get(TestCasesPage.runTestButton).click()
    })
})
