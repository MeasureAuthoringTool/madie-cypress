import { Environment } from "../../../../Shared/Environment"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let updatedCqlLibraryName = cqlLibraryName + 'someUpdate'
let updatedMeasureName = measureName + 'someUpdate'
let updatedMeasuresPageName = ''
let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let measureCQL = MeasureCQL.SBTEST_CQL
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Measure Sharing', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify shared Measure is viewable under My Measures tab', () => {

        //Share Measure with ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(LandingPage.myMeasuresTab).click()
        cy.reload()
        cy.get(MeasuresPage.measureListTitles).should('contain', newMeasureName)

    })

    it('Verify Measure can be edited by the shared user', () => {

        //Share Measure with ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()

        //Edit Measure details
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureNameTextBox).clear().type(updatedMeasureName)
        cy.get(EditMeasurePage.cqlLibraryNameTextBox).clear().type(updatedCqlLibraryName)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Edit Measure CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        Utilities.typeFileContents('cypress/fixtures/CQLForTestCaseExecution.txt', EditMeasurePage.cqlEditorTextBox)

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).wait(2000).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).wait(2000).click()

        cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        //Create New Test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

    })
})

describe('Measure Sharing - Multiple instances', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.measures).click()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()

    })

    it('Verify all instances in the Measure set (Version and Draft) are shared to the user', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()
        let filePath = 'cypress/fixtures/measureId'


        //Version the Measure
        MeasuresPage.measureAction('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.versionMeasuresConfirmInput).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(newMeasureName, versionNumber)
        cy.log('Version Created Successfully').wait(2700)

        //Draft the Versioned Measure
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled')
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click().wait(1000)
            Utilities.waitForElementVisible('[data-testid="draft-measure-' + fileContents + '"]', 105000)
            cy.get('[data-testid="draft-measure-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="draft-measure-' + fileContents + '"]', 105000)
            cy.get('[data-testid="draft-measure-' + fileContents + '"]').should('be.enabled')
            cy.get('[data-testid="draft-measure-' + fileContents + '"]').click()
        })
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        //intercept draft id once measure is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
        })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //Share Measure with ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(LandingPage.myMeasuresTab).click()
        cy.get('[class="table-body"]').should('contain', newMeasureName)
        cy.get('[class="table-body"]').should('contain', updatedMeasuresPageName)

    })
})

describe('Delete Test Case with Shared user', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Verify Test Case can be deleted by the shared user', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)

        //Share Measure with ALT User
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })

        //Login as Alt User
        OktaLogin.AltLogin()

        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        TestCasesPage.clickDeleteTestCaseButton()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)

    })
})
