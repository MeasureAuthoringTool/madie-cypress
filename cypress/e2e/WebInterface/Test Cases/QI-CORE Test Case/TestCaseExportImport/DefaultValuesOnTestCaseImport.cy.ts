import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let fileToUpload = ['PatientFilesForJsonImport/NumFail_MedAdminStatus.json', 'PatientFilesForJsonImport/DenFail_MedRequestStatus.json', 'PatientFilesForJsonImport/ServiceRequest_WithNullStatus.json',
    'PatientFilesForJsonImport/ServiceRequest_WithNullIntent.json', 'PatientFilesForJsonImport/CoverageStatus_null.json', 'PatientFilesForJsonImport/MedicationRequest_WithNullIntent.json',
    'PatientFilesForJsonImport/MedicationRequest_WithNullStatus.json', 'PatientFilesForJsonImport/IPFail_ExpiredCoverage.json', 'PatientFilesForJsonImport/Patient_WithCondition.json',
    'PatientFilesForJsonImport/Patient_WithObservation.json', 'PatientFilesForJsonImport/Patient_WithProcedure.json', 'PatientFilesForJsonImport/Patient_withNullProcedure.status.json',
    'PatientFilesForJsonImport/Patient_WithServiceRequest.json', 'PatientFilesForJsonImport/Patient_WithNullEncounterStatus.json']
let ValueToBeAdded = ['subject', 'subject', '"status": "active"', '"intent": "order"', '"status": "active"', '"intent": "order"', '"status": "active"',
    'beneficiary', 'subject', 'subject', 'subject', '"status": "completed"', 'subject', '"status": "finished"']
let Resource = ['Medication Administration Status', 'Medication Request Status', 'Service Request With Status', 'Service Request With Intent',
    'Coverage Status', 'MedicationRequestWithIntent', 'MedicationRequestWithStatus', 'Coverage', 'Condition', 'Observation', 'Procedure',
    'Procedure With Status', 'Service Request', 'Encounter With Status']

describe('Validate Test case Json on import', () => {

    before('Create Measure, Test case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
        OktaLogin.Login()

    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify the default values are added to the Test case Json on import', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        for (let i = 0; i <= 13; i++) {

            TestCasesPage.ImportTestCaseFile(fileToUpload[i])

            TestCasesPage.ValidateValueAddedToTestCaseJson(ValueToBeAdded[i])

            cy.log('Default Value for ' + Resource[i] + ' verified Successfully')
            cy.log('-----------------------------------------------------------')
        }
    })
})
