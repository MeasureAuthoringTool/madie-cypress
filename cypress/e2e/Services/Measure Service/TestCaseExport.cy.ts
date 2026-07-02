import { TestCaseJson } from '../../../Shared/TestCaseJson'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../Shared/Utilities'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = Math.floor(Math.random() * 1000 + 1)
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue

const readTestCaseIds = (testCaseNumbers: number[]): Cypress.Chainable<string[]> => {
    const testCaseIds: string[] = []
    let chain: Cypress.Chainable<unknown> = cy.wrap(null)

    testCaseNumbers.forEach((testCaseNumber) => {
        chain = chain.then(() => {
            return TestData.readTestCaseId(testCaseNumber).then((testCaseId) => {
                testCaseIds.push(testCaseId)
            })
        })
    })

    return chain.then(() => testCaseIds)
}

const exportTestCases = (testCaseNumbers: number[] = [0]): Cypress.Chainable<Cypress.Response<unknown>> => {
    return TestData.readMeasureId().then((measureId) => {
        return readTestCaseIds(testCaseNumbers).then((testCaseIds) => {
            return TestData.requestWithAccessToken({
                url: `/api/measures/${measureId}/test-cases/exports`,
                method: 'PUT',
                body: testCaseIds
            })
        })
    })
}

const expectSuccessfulExport = (testCaseNumbers: number[] = [0]): void => {
    exportTestCases(testCaseNumbers).then((response) => {
        expect(response.status).to.eql(200)
        expect(response.body).is.not.empty
    })
}

describe('QI-Core Single Test Case Export', () => {
    beforeEach('Create measure, test case, login, and make an edit to the test case', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
    })

    afterEach('Logout and Clean up Measures', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Export single QI-Core Test case', () => {
        OktaLogin.setupUserSession(false)
        expectSuccessfulExport()
    })

    it('Non-owner of Measure: Export single QI-Core Test case', () => {
        OktaLogin.setupUserSession(true)
        expectSuccessfulExport()
    })
})

describe('QI-Core Multiple Test Case Export', () => {
    beforeEach('Create measure, test case, login, and make an edit to the test cases', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        TestCasesPage.CreateTestCaseAPI(
            testCaseTitle + '2',
            testCaseSeries + '2',
            testCaseDescription + '2',
            testCaseJson,
            false,
            true
        )
    })

    afterEach('Logout and Clean up Measures', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Export All QI-Core Test cases', () => {
        OktaLogin.setupUserSession(false)
        expectSuccessfulExport([0, 2])
    })

    it('Non-owner of Measure: Export All QI-Core Test cases', () => {
        OktaLogin.setupUserSession(true)
        expectSuccessfulExport([0, 2])
    })
})
