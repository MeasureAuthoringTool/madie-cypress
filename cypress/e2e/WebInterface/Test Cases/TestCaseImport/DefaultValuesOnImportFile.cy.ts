import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let fileToUpload = ['NumFail_MedAdminStatus.json', 'DenFail_MedRequestStatus.json', 'ServiceRequest_WithNullStatus.json', 'ServiceRequest_WithNullIntent.json', 'CoverageStatus_null.json']
let ValueToBeAdded = ['subject', 'subject', '"status": "active"', '"intent": "order"', '"status": "active"']
let Resource = ['Medicare Administration Status', 'Medicare Request Status', 'Service Request With Status', 'Service Request With Intent', 'Coverage Status']

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
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        for (let i = 0; i <= 4; i++) {

            TestCasesPage.ImportTestCaseFile(fileToUpload[i])

            TestCasesPage.ValidateValueAddedToTestCaseJson(ValueToBeAdded[i])

            cy.log('Default Value for ' + Resource[i] + ' verified Successfully')
        }

    })
})
