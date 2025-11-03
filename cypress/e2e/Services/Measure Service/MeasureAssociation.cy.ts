import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { Header } from "../../../Shared/Header"
import { Toasts } from "../../../Shared/Toasts"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureCQLPFTests = MeasureCQL.CQL_Populations
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let QiCoreMeasureNameAlt = ''
let QiCoreCqlLibraryNameAlt = ''
let QiCoreMeasureName0 = ''
let QiCoreCqlLibraryName0 = ''
let QiCoreMeasureName1 = ''
let QiCoreCqlLibraryName1 = ''
let measureQDMManifestName0 = ''
let QDMCqlLibraryName0 = ''
let measureQDMManifestName1 = ''
let QDMCqlLibraryName1 = ''
let harpUser = ''
let harpUserALT = ''

describe('Measure Association: Validations', () => {

    beforeEach('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        harpUser = OktaLogin.getUser(false)
        harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        const qdmMeasure0: CreateMeasureOptions = {
            ecqmTitle: measureQDMManifestName1,
            cqlLibraryName: QDMCqlLibraryName1,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31'
        }

        //Create New QDM Measure
        //0
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure0)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible').wait(1000)
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')

        measureQDMManifestName0 = 'QDMManifestTestMN0' + Date.now() + randValue + 6 + randValue
        QDMCqlLibraryName0 = 'QDMManifestTestLN0' + Date.now() + randValue + 7 + randValue

        const qdmMeasure1: CreateMeasureOptions = {
            ecqmTitle: measureQDMManifestName0,
            cqlLibraryName: QDMCqlLibraryName0,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31',
            measureNumber: 1
        }

        //Create Second QDM Measure
        //1
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure1)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC0', 'QDMManifestTCGroup0', 'QDMManifestTC0', '', false, false, 1)

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //2
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests, 2)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.setupUserSession(false)

        QiCoreMeasureName0 = 'ProportionPatientMN0' + Date.now() + randValue + 2 + randValue
        QiCoreCqlLibraryName0 = 'ProportionPatientLN0' + Date.now() + randValue + 3 + randValue
        //Create second QI Core measure
        //3
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName0, QiCoreCqlLibraryName0, measureCQLPFTests, 3)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 3)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(3, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
    })

    it('Association: QDM -> Qi Core measure: Validations', () => {
        const currentUser = Cypress.env('selectedUser')
        const currentAltUser = Cypress.env('selectedAltUser')
        OktaLogin.setupUserSession(false)
        //validation test: only one measure is selected
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/cms-id-association?qiCoreMeasureId=&qdmMeasureId=' + id + '&copyMetaData=true',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {}
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('CMS ID could not be associated. Please try again.')
                    cy.log('CMS ID could not be associated.')
                })

            })
        })

        //validation test: must be different models
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((qdmId1) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((qdmId2) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qdmId2 + '&qdmMeasureId=' + qdmId1 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('CMS ID could not be associated. Please try again.')
                        cy.log('CMS ID could not be associated.')
                    })
                })

            })
        })

        //validation test: QDM measure must contain CMS id
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((qdmId1) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((qicoreId1) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qicoreId1 + '&qdmMeasureId=' + qdmId1 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('CMS ID could not be associated. Please try again.')
                        cy.log('CMS ID could not be associated.')
                    })
                })
            })
        })

        //validation test: Qi Core measure must be in draft status
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
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

        MeasuresPage.actionCenter('version', 2)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')

        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible('.toast', 35000)
        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(Toasts.otherSuccessToast, 35000)
        OktaLogin.UILogout()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((qdmId2) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((qicoreId1) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qicoreId1 + '&qdmMeasureId=' + qdmId2 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('CMS ID could not be associated. The QI-Core measure is versioned.')
                        cy.log('CMS ID could not be associated.')
                    })
                })
            })
        })

        //validation test: Qi Core measure must NOT contain CMS id
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 3)
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
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((qdmId2) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((qicoreId2) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qicoreId2 + '&qdmMeasureId=' + qdmId2 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('CMS ID could not be associated. The QI-Core measure already has a CMS ID.')
                        cy.log('CMS ID could not be associated.')
                    })
                })
            })
        })

        OktaLogin.setupUserSession(true)
        QiCoreMeasureNameAlt = QiCoreMeasureName1 + 4 + randValue
        QiCoreCqlLibraryNameAlt = QiCoreCqlLibraryName1 + 5 + randValue

        //validation test: both measures the user is not the owner of
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureNameAlt, QiCoreCqlLibraryNameAlt, measureCQLPFTests, 4, true)
        OktaLogin.setupUserSession(true)
        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit', 4, { altUser: true })
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(4, true, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.setupUserSession(false)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((qdmId2) => {
                cy.readFile('cypress/fixtures/' + currentAltUser + '/measureId4').should('exist').then((qicoreId4) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/cms-id-association?qiCoreMeasureId=' + qicoreId4 + '&qdmMeasureId=' + qdmId2 + '&copyMetaData=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {}
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.eql('CMS ID could not be associated. Please try again.')
                        cy.log('CMS ID could not be associated.')
                    })
                })
            })
        })
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
    })
})

describe('Measure Association: Validations', () => {

    beforeEach('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.wait(1000)
        harpUser = OktaLogin.getUser(false)
        harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        const qdmMeasure: CreateMeasureOptions = {
            ecqmTitle: measureQDMManifestName1,
            cqlLibraryName: QDMCqlLibraryName1,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31',
            altUser: false
        }

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

        OktaLogin.setupUserSession(false)

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //1
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests, 1)
        OktaLogin.setupUserSession(false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.setupUserSession(false)
    })

    it('Association: QDM -> Qi Core measure: Successful Association', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 0)
        Utilities.waitForElementVisible(EditMeasurePage.generateCmsIdButton, 90000)
        cy.get(EditMeasurePage.generateCmsIdButton).wait(3700).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).wait(3700).click()
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
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
    })
})