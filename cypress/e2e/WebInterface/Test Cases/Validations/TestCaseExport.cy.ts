import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe('QI-Core Test Case Export', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export single QI-Core Test case', () => {

        MeasuresPage.measureAction("edit")

        //Need to refactor this to create Test case from backend once MAT-5972 is fixed
        //Create New Test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify Json file exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries-Title for Auto Test.json')

    })
})
