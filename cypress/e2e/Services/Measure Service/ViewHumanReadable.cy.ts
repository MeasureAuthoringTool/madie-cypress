import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { Header } from "../../../Shared/Header"
import { Toasts } from "../../../Shared/Toasts"
import { MeasureActionOptions } from "../../../Shared/MeasuresPage"
const dayjs = require('dayjs')

const now = Date.now()
const measure = {
    name: 'AdminCorrectExpValues' + now,
    libraryName: 'ACExpValuesLib' + now,
    ecqmTitle: 'ACEV',
    model: SupportedModels.qiCore4,
    mpStartDate: dayjs().subtract('1', 'year').format('YYYY-MM-DD'),
    mpEndDate: dayjs().format('YYYY-MM-DD')
}

let harpUser = ''

let newMeasureName = ''
let newCQLLibraryName = ''
let qdmMeasureCQLVm = MeasureCQL.CQLQDMObservationRun
let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'TestMeasure' + Date.now() + randValue
let cqlLibraryName = 'TestCql' + Date.now() + randValue
let measureCQL = MeasureCQL.SBTEST_CQL
let qdmMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}
const actionOptions: MeasureActionOptions = {
    altUser: false
}

describe('Measure Service: View Human Readable for Qi Core Draft Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for Qi Core Draft Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).not.empty
                })
            })
        })
    })
})

describe('Measure Service: View Human Readable for Versioned Qi Core Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for Qi Core Versioned Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        //Version Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.include('1.0.000')
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).not.empty
                })
            })
        })
    })
})

describe('Measure Service: View Human Readable for Draft QDM Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for QDM Draft Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).not.empty
                })
            })
        })
    })
})

describe('Measure Service: View Human readable for Versioned QDM Measure', () => {

    newMeasureName = measureName + 1 + randValue
    newCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCQLLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLVm

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Clean up', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)
    })

    //MAT-8548
    it('Successful export of a versioned QDM Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        //version measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })

        //export measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    expect(response.body).is.not.null
                    expect(response.body).contains('<html')
                })
            })
        })
    })
})

describe('Measure Human Readable comparison', () => {


    beforeEach('Create Measure and Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    before('Create Measure, version, and draft the measure', () => {
        let currentUser = Cypress.env('selectedUser')

        newMeasureName = measureName + 1 + randValue
        newCQLLibraryName = cqlLibraryName + 1 + randValue
        let firstVersionedMeasureName = 'FirstVersioned' + newMeasureName + Date.now()
        cy.wait(2000)
        let secondVersionedMeasureName = 'SecondVersioned' + newMeasureName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //creating two versions of measure:
        //version one
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Version Measure
        MeasuresPage.actionCenter('version', 0, actionOptions)

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Version Created Successfully')

        //Add Draft to Versioned Measure
        MeasuresPage.actionCenter('draft', 0, actionOptions)
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(firstVersionedMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.wait('@drafted').then(int => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId1', int.response.body.id)
        })
        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')


        //version two
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Version Measure
        MeasuresPage.actionCenter('version', 1, actionOptions)

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('2.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber('2.0.000', 1)
        cy.log('Version Created Successfully')


        //Add Draft to Versioned Measure
        MeasuresPage.actionCenter('draft', 1, actionOptions)
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(secondVersionedMeasureName + "Dif")
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.wait('@drafted').then(int => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId2', int.response.body.id)
        })
        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')

        //log out
        OktaLogin.UILogout()

    })

    it('Successful Human Readable comparison, on versioned measures, via API call', () => {
        harpUser = OktaLogin.setupUserSession(false)
        const currentUser = Cypress.env('selectedUser')
        //version measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((measureId1) => {
                    cy.request({
                        url: '/api/html-diff?newMeasureId=' + measureId + '&oldMeasureId=' + measureId1,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.differences[0].field).to.eql('GUID (Version Specific)')
                        expect(response.body.differences[1].field).to.eql('Version')
                        expect(response.body.differences[2].field).to.eql('Title')

                    })
                })
            })
        })
    })
})

describe('Measure Service: Verify error message when there is no Population Criteria for QDM Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify error message when there is no Population Criteria for QDM Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Response could not be completed for Measure with ID ' + id + ', since there is no population criteria on the measure.')
                })
            })
        })
    })
})