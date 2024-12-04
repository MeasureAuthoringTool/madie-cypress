import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Environment } from "../../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'Second Test Case'
let secondTestCaseSeries = 'ICFTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid_w_All_Encounter
let newMeasureName = ''
let newCqlLibraryName = ''
let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let qdmMeasureCQL = MeasureCQL.QDMSimpleCQL

describe('QI-Core : Delete All Test Cases', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, null, null, null, null, null,
            null, null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCaseDescription, secondTestCaseSeries, testCaseJson, false, true)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Delete all QI-Core Test cases - Success scenario', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete All Test Cases?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', secondTestCaseTitle)

        //Delete All Testcases button should be disabled when there are no Test cases
        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })

    it('Shared Measure Owner able to delete all QI-Core Test cases', () => {

        //Transfer Measure to ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": harpUserALT,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": "GRANT"
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body[0].userId).to.eql(harpUserALT)
                    expect(response.body[0].roles[0]).to.eql('SHARED_WITH')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Login to UI as ALT User
        OktaLogin.AltLogin()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete All Test Cases?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', secondTestCaseTitle)

        //Delete All Testcases button should be disabled when there are no Test cases
        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })

    it('Non owner of the Measure unable to delete all QI-Core Test Cases', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 20700)
        cy.get(MeasuresPage.allMeasuresTab).wait(3000).click({ force: true })
        cy.reload()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })
})

describe('QDM : Delete All Test Cases', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, qdmMeasureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCaseDescription, secondTestCaseSeries, testCaseJson, false, true)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Delete all QDM Test cases - Success scenario', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete All Test Cases?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', secondTestCaseTitle)

        //Delete All Testcases button should be disabled when there are no Test cases
        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })

    it('Shared Measure Owner able to delete all Test cases', () => {

        //Transfer Measure to ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": harpUserALT,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": "GRANT"
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body[0].userId).to.eql(harpUserALT)
                    expect(response.body[0].roles[0]).to.eql('SHARED_WITH')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Login to UI as ALT User
        OktaLogin.AltLogin()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete All Test Cases?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', secondTestCaseTitle)

        //Delete All Testcases button should be disabled when there are no Test cases
        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })

    it('Non owner of the Measure unable to delete Test Cases', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 20700)
        cy.get(MeasuresPage.allMeasuresTab).wait(3000).click({ force: true })
        cy.reload()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('be.disabled')

    })
})
