import { CreateMeasurePage, CreateMeasureOptions } from '../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../Shared/Utilities'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { Header } from '../../../Shared/Header'
import { Toasts } from '../../../Shared/Toasts'
import { MeasureActionOptions } from '../../../Shared/MeasuresPage'
import { TestData } from '../../../Shared/TestData'

let newMeasureName = ''
let newCQLLibraryName = ''
const qdmMeasureCQLVm = MeasureCQL.CQLQDMObservationRun
const measureCQL = MeasureCQL.SBTEST_CQL
const qdmMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
const measureData: CreateMeasureOptions = {}
const actionOptions: MeasureActionOptions = {
    altUser: false
}

describe('Measure Service: View Human Readable for Qi Core Draft Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureA' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlA' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('View Measure Human Readable for Qi Core Draft Measure', () => {
        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human Readable for Versioned Qi Core Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureB' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlB' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {
        Utilities.deleteVersionedMeasure(newMeasureName, newCqlLibraryName)
    })

    it('View Measure Human Readable for Qi Core Versioned Measure', () => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
        })

        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human Readable for Draft QDM Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureC' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlC' + Date.now() + randVal
        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('View Measure Human Readable for QDM Draft Measure', () => {
        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human readable for Versioned QDM Measure', () => {
    let localMeasureName = ''
    let localCqlLibraryName = ''

    beforeEach('Create Measure', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        localMeasureName = 'TestMeasureD' + Date.now() + randVal
        localCqlLibraryName = 'TestCqlD' + Date.now() + randVal

        measureData.ecqmTitle = localMeasureName
        measureData.cqlLibraryName = localCqlLibraryName
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
    })

    afterEach('Clean up', () => {
        Utilities.deleteVersionedMeasure(localMeasureName, localCqlLibraryName)
    })

    //MAT-8548
    it('Successful export of a versioned QDM Measure', () => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
        })

        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).is.not.null
            expect(response.body).contains('<html')
        })
    })
})

describe('Measure Human Readable comparison', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    before('Create Measure, version, and draft the measure', () => {
        let currentUser = Cypress.env('selectedUser')

        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureE' + Date.now() + randVal
        newCQLLibraryName = 'TestCqlE' + Date.now() + randVal
        let firstVersionedMeasureName = 'FirstVersioned' + newMeasureName + Date.now()
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

        cy.get(Toasts.successToast, { timeout: 18500 }).should(
            'contain.text',
            'New version of measure is Successfully created'
        )
        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Version Created Successfully')

        //Add Draft to Versioned Measure
        MeasuresPage.selectMeasure()
        MeasuresPage.actionCenter('draft', 0, actionOptions)
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(firstVersionedMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.wait('@drafted').then((int) => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId1', int?.response?.body.id)
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

        cy.get(Toasts.successToast, { timeout: 18500 }).should(
            'contain.text',
            'New version of measure is Successfully created'
        )
        MeasuresPage.validateVersionNumber('2.0.000', 1)
        cy.log('Version Created Successfully')

        //Add Draft to Versioned Measure
        MeasuresPage.selectMeasure(1)
        MeasuresPage.actionCenter('draft', 1, actionOptions)
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox)
            .clear()
            .type(secondVersionedMeasureName + 'Dif')
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.wait('@drafted').then((int) => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId2', int?.response?.body.id)
        })
        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')
    })

    it('Successful Human Readable comparison, on versioned measures, via API call', () => {
        OktaLogin.setupUserSession(false)
        TestData.requestHtmlDiff().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.differences[0].field).to.eql('GUID (Version Specific)')
            expect(response.body.differences[1].field).to.eql('Version')
            expect(response.body.differences[2].field).to.eql('Title')
        })
    })
})

describe('Measure Service: Verify error message when there is no Population Criteria for QDM Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureF' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlF' + Date.now() + randVal
        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Verify error message when there is no Population Criteria for QDM Measure', () => {
        TestData.readMeasureId().then((measureId) => {
            TestData.requestHumanReadable(0, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.eql(
                    `Response could not be completed for Measure with ID ${measureId}, since there is no population criteria on the measure.`
                )
            })
        })
    })
})
