import { Environment } from "../../../../Shared/Environment"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let harpUser = Environment.credentials().harpUser
let harpUserALT = Environment.credentials().harpUserALT
let measureSharingAPIKey = Environment.credentials().adminApiKey
let measureCQLPFTests = MeasureCQL.CQL_Populations
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest

const measureData: CreateMeasureOptions = {}

let randValue = (Math.floor((Math.random() * 1000) + 1))
measureData.ecqmTitle = measureName + randValue
measureData.cqlLibraryName = cqlLibraryName + randValue
measureData.measureScoring = 'Cohort'
measureData.patientBasis = 'true'
measureData.measureCql = measureCQL

//Skipping until Feature flag MeasureHistory is removed
describe.skip('Measure History - Create, Update, CMS ID, Sharing and Unsharing Actions', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Verify that Measure Create and Update actions are recorded in Measure History', () => {

        //Update Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Go to Measure History and verify that Create and Update actions are recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get('[data-testid="measure-history-cell-1_actionType"]').should('contain.text', 'CREATED')
        cy.get('[data-testid="measure-history-cell-1_performedBy"]').should('contain.text', harpUser)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'UPDATED')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)

    })

    it('Verify that Create and Delete CMS ID actions are recorded in Measure History', () => {
        let currentUser = Cypress.env('selectedUser')
        //Generate CMS ID
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            const cmsId = val.toString().valueOf()
            cy.writeFile('cypress/fixtures/cmsId', cmsId)
            cy.log('CMS ID Generated successfully: ' + cmsId)
        })

        //Go to Measure History and verify that CMS ID generation is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'CREATE_CMSID')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Created CMS ID')

        //Delete CMS ID
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cmsId').should('exist').then((cmsId) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureSetId').should('exist').then((measureSetId) => {
                        cy.request({
                            url: '/api/measures/' + measureId + '/delete-cms-id?cmsId=' + cmsId,
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                                'api-key': measureSharingAPIKey,
                                'harpId': harpUser
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql('CMS id of ' + cmsId + ' was deleted successfully from measure set with measure set id of ' + measureSetId)
                        })
                    })
                })
            })
        })

        OktaLogin.Login()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        //Go to Measure History and verify that Delete CMS ID is recorded
        MeasuresPage.actionCenter('viewHistory')
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Deleted CMS ID ')
    })

    it('Verify that Measure Sharing and Unsharing actions are recorded in Measure History', () => {

        //Share Measure
        MeasuresPage.actionCenter('edit')
        EditMeasurePage.actionCenter(EditMeasureActions.share)
        cy.get(EditMeasurePage.shareOption).click({ force: true })
        cy.get(EditMeasurePage.harpIdInputTextBox).type(harpUserALT)
        cy.get(EditMeasurePage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(EditMeasurePage.expandArrow).click()
        cy.get(EditMeasurePage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully shared')

        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Go to Measure History and verify that Measure Sharing is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'SHARED')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Shared with - ' + harpUserALT)

        //Close History popup
        cy.get('[data-testid="measure-history-close-button"]').click().wait(1000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Un Share Measure
        EditMeasurePage.actionCenter(EditMeasureActions.share)
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.get(EditMeasurePage.expandArrow).click()
        cy.get(EditMeasurePage.unshareCheckBox).click()
        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.acceptBtn).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Go to Measure History and verify that Measure Unsharing is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'UNSHARED')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Unshared with - ' + harpUserALT)

    })
})

//Skipping until Feature flag MeasureHistory is removed
describe.skip('Measure History - Version and Draft actions', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)
    })

    it('Verify that Measure Version and Draft actions are recorded in Measure History', () => {

        //Create Measure Version
        EditMeasurePage.actionCenter(EditMeasureActions.version)

        Utilities.waitForElementToNotExist(TestCasesPage.successMsg, 60000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Go to Measure History and verify that Measure Version action is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'VERSIONED_MAJOR')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Versioned to 1.0.000')

        //Close History popup
        cy.get('[data-testid="measure-history-close-button"]').click().wait(1000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Draft Measure
        EditMeasurePage.actionCenter(EditMeasureActions.draft)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()

        //Go to Measure History and verify that Measure Draft action is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'DRAFTED')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Draft created from version 1.0.000')

    })
})

//Skipping until Feature flag MeasureHistory is removed
describe.skip('Measure History - Associate Measure actions', () => {


    let measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
    let QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

    const qdmMeasure: CreateMeasureOptions = {
        ecqmTitle: measureQDMManifestName1,
        cqlLibraryName: QDMCqlLibraryName1,
        measureScoring: 'Proportion',
        patientBasis: 'false',
        measureCql: qdmManifestTestCQL,
        mpStartDate: '2025-01-01',
        mpEndDate: '2025-12-31'
    }

    let QiCoreMeasureName1 = 'QiCoreManifestTestMN1' + Date.now() + randValue + 4 + randValue
    let QiCoreCqlLibraryName1 = 'QiCoreManifestTestLN1' + Date.now() + randValue + 5 + randValue

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        //0
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create new QI Core measure
        //1
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests, 1)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(measureQDMManifestName1, QDMCqlLibraryName1)
    })

    it('Verify that Associate Measure actions are recorded in Measure History', () => {
        let currentUser = Cypress.env('selectedUser')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()

        OktaLogin.UILogout()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((qdmId1) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((qicoreId1) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qicoreId1 + '&qdmMeasureId=' + qdmId1 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        cy.log('CMS ID was associated.')
                    })
                })
            })
        })

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
        //Go to Measure History and verify that Associate Measure action is recorded
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'ASSOCIATED')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
    })
})