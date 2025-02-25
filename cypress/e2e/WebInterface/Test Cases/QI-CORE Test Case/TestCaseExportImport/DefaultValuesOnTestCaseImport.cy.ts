import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage";

const now = Date.now()
let measureName = 'TestMeasure' + now
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'Example test case'
let testCaseSeries = 'SBTestSeries'

type expectedValues = {
    uploadFile: string,
    valueInJson: string,
    resource: string
}

const validationData: Array<expectedValues> = [
    {
        uploadFile: 'PatientFilesForJsonImport/NumFail_MedAdminStatus.json',
        valueInJson: 'subject',
        resource: 'Medication Administration Status'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/DenFail_MedRequestStatus.json',
        valueInJson: 'subject',
        resource: 'Medication Request Status'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/ServiceRequest_WithNullStatus.json',
        valueInJson: '"status": "active"',
        resource: 'Service Request With Status'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/ServiceRequest_WithNullIntent.json',
        valueInJson: '"intent": "order"',
        resource: 'Service Request With Intent'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/CoverageStatus_null.json',
        valueInJson: '"status": "active"',
        resource: 'Coverage Status'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/MedicationRequest_WithNullIntent.json',
        valueInJson: '"intent": "order"',
        resource: 'MedicationRequestWithIntent'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/MedicationRequest_WithNullStatus.json',
        valueInJson: '"status": "active"',
        resource:  'MedicationRequestWithStatus'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/IPFail_ExpiredCoverage.json',
        valueInJson: 'beneficiary',
        resource: 'Coverage'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_WithCondition.json',
        valueInJson: 'subject',
        resource: 'Condition'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_WithObservation.json',
        valueInJson: 'subject',
        resource: 'Observation'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_WithProcedure.json',
        valueInJson: 'subject',
        resource: 'Procedure'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_withNullProcedure.status.json',
        valueInJson: '"status": "completed"',
        resource: 'Procedure With Status'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_WithServiceRequest.json',
        valueInJson: 'subject',
        resource: 'Service Request'
    },
    {
        uploadFile: 'PatientFilesForJsonImport/Patient_WithNullEncounterStatus.json',
        valueInJson: '"status": "finished"',
        resource: 'Encounter With Status'
    }
]

describe('Validate Test case Json on import', () => {

    before('Create Measure, Test case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false,false, 'ipp')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
        OktaLogin.Login()
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify the default values are added to the Test case Json on import', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        for (let validation of validationData) {

            TestCasesPage.ImportTestCaseFile(validation.uploadFile)

            TestCasesPage.ValidateValueAddedToTestCaseJson(validation.valueInJson)

            cy.log('Default value for ' + validation.resource + ' verified')
        }
    })
})
