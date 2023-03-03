import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioEpisodeSingleIPNoMO_IPP_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureCQL = MeasureCQL.measureCQL_5138_test

describe('CQL Changes and how that impacts test cases, observations and population criteria', () => {

    beforeEach('Create Measure, Test Case and login', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJsonIppPass)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.Logout()
        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Updating CQL to be errorneous, after initial CQL, PC, and Test Case has been setup, causes errors and the errors' +
        ' flag to be set to the mismatch flag. Correcting the CQL to removes the errors flag', () => {
            //Click on Edit Measure
            //MeasuresPage.clickEditforCreatedMeasure()
            MeasuresPage.measureAction('edit', false)

            cy.get(EditMeasurePage.cqlEditorTab).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

            //Click on the measure group tab
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.setMeasureGroupType()

            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Encounter')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'mpopEx')
            Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'mpopEx')
            Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'daysObs')
            Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

            //Navigate to Test Cases page and add Test Case details
            cy.get(EditMeasurePage.testCasesTab).click()
            TestCasesPage.clickEditforCreatedTestCase()

            //click on Expected/Actual tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //Click on RunTest Button
            cy.get(TestCasesPage.testCaseMSRPOPLExpected).type('1')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.runTestButton).should('exist')
            cy.get(TestCasesPage.runTestButton).should('be.visible')
            cy.get(TestCasesPage.runTestButton).should('be.enabled')
            cy.get(TestCasesPage.runTestButton).wait(1000).click({ force: true })
            cy.get(TestCasesPage.cvMeasureObservationActualValue).should('have.value', '30')

            //navigate to the CQL Editor tab
            cy.get(EditMeasurePage.cqlEditorTab).should('exist')
            cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
            cy.get(EditMeasurePage.cqlEditorTab).click()

            cy.get(EditMeasurePage.cqlEditorTextBox).invoke('click')
            //remove the dayObs line(s) from CQL
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{end}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{moveToEnd}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
            //save changes to CQL
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //wait until toast message appears
            Utilities.waitForElementVisible(CQLEditorPage.measureErrorToast, 3500)
            cy.get(CQLEditorPage.measureErrorToast).should('contain.text', 'CQL return types do not match population criteria! Test Cases will not execute until this issue is resolved.')
            //navigate to the PC tab and verify mismatch message appears
            cy.get(EditMeasurePage.measureGroupsTab).click()
            cy.get(MeasureGroupPage.CQLPCMismatchError).should('contain.text', 'One or more Population Criteria has a mismatch with CQL return types. Test Cases cannot be executed until this is resolved.')
            //navigate to the TC tab and verify mismatch message appears and the exectue test case button is disabled
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.CQLPCTCMismatchError).should('contain.text', 'One or more Population Criteria has a mismatch with CQL return types. Test Cases cannot be executed until this is resolved.')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
            TestCasesPage.clickEditforCreatedTestCase()
            //navigate into the test case and verify that the Run Test Case button is also disabled
            cy.get(TestCasesPage.runTestButton).should('be.disabled')

            //verify that the errors flag indicates the mismatch CQL PC return type error
            //log out of UI
            OktaLogin.Logout()
            //log into backend
            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.errors[0]).to.equal('MISMATCH_CQL_POPULATION_RETURN_TYPES')


                    })

                })
            })
            //log back in
            OktaLogin.Login()
            //click edit on measure with error
            MeasuresPage.measureAction('edit', false)
            //navigate to the CQL Editor tab
            cy.get(EditMeasurePage.cqlEditorTab).should('exist')
            cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
            cy.get(EditMeasurePage.cqlEditorTab).click()

            cy.get(EditMeasurePage.cqlEditorTextBox).invoke('click')

            //remove the dayObs line(s) from CQL
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToStart}{home}{ctrl+a}{del}{moveToStart}{home}' + measureCQL + '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{del}')
            //save changes to CQL
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
            //verify that the errors flag contains no errors / has been cleared
            //log out of UI
            OktaLogin.Logout()
            //log into backend
            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.errors).is.empty


                    })

                })
            })
        })
    it('Updating CQL to be errorneous, after initial CQL, PC, and Test Case has been setup, causes errors and the errors' +
        ' flag to be set to the mismatch flag. Correcting the PC selections to match CQL expectations removes the errors flag', () => {
            //Click on Edit Measure
            //MeasuresPage.clickEditforCreatedMeasure()
            MeasuresPage.measureAction('edit', false)

            cy.get(EditMeasurePage.cqlEditorTab).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

            //Click on the measure group tab
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.setMeasureGroupType()

            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Encounter')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'mpopEx')
            Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'mpopEx')
            Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'daysObs')
            Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

            //Navigate to Test Cases page and add Test Case details
            cy.get(EditMeasurePage.testCasesTab).click()
            TestCasesPage.clickEditforCreatedTestCase()

            //click on Expected/Actual tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //Click on RunTest Button
            cy.get(TestCasesPage.testCaseMSRPOPLExpected).type('1')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.runTestButton).should('exist')
            cy.get(TestCasesPage.runTestButton).should('be.visible')
            cy.get(TestCasesPage.runTestButton).should('be.enabled')
            cy.get(TestCasesPage.runTestButton).wait(1000).click({ force: true })
            cy.get(TestCasesPage.cvMeasureObservationActualValue).should('have.value', '30')

            //navigate to the CQL Editor tab
            cy.get(EditMeasurePage.cqlEditorTab).should('exist')
            cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
            cy.get(EditMeasurePage.cqlEditorTab).click()

            cy.get(EditMeasurePage.cqlEditorTextBox).invoke('click')
            //remove the dayObs line(s) from CQL
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{end}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{moveToEnd}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
                '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
            //save changes to CQL
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //wait until toast message appears
            Utilities.waitForElementVisible(CQLEditorPage.measureErrorToast, 3500)
            cy.get(CQLEditorPage.measureErrorToast).should('contain.text', 'CQL return types do not match population criteria! Test Cases will not execute until this issue is resolved.')
            //navigate to the PC tab and verify mismatch message appears
            cy.get(EditMeasurePage.measureGroupsTab).click()
            cy.get(MeasureGroupPage.CQLPCMismatchError).should('contain.text', 'One or more Population Criteria has a mismatch with CQL return types. Test Cases cannot be executed until this is resolved.')
            //navigate to the TC tab and verify mismatch message appears and the exectue test case button is disabled
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.CQLPCTCMismatchError).should('contain.text', 'One or more Population Criteria has a mismatch with CQL return types. Test Cases cannot be executed until this is resolved.')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
            TestCasesPage.clickEditforCreatedTestCase()
            //navigate into the test case and verify that the Run Test Case button is also disabled
            cy.get(TestCasesPage.runTestButton).should('be.disabled')

            //verify that the errors flag indicates the mismatch CQL PC return type error
            //log out of UI
            OktaLogin.Logout()
            //log into backend
            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.errors[0]).to.equal('MISMATCH_CQL_POPULATION_RETURN_TYPES')


                    })

                })
            })
            //log back in
            OktaLogin.Login()
            //click edit on measure with error
            MeasuresPage.measureAction('edit', false)
            //Click on the measure group tab
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
            cy.get(EditMeasurePage.measureGroupsTab).click()
            //update PC scoring value to match updated CQL
            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'mpopEx')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
            //validation successful updated message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

            //verify that the errors flag contains no errors / has been cleared
            //log out of UI
            OktaLogin.Logout()
            //log into backend
            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.errors).is.empty


                    })

                })
            })
        })

})