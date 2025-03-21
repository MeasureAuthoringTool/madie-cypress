import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage, EditMeasureActions } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureCQLPFTests = MeasureCQL.CQL_Populations
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureQICore = ''
let measureQDM = ''
let qdmCQLLibrary = ''
let qiCoreCQLLibrary = ''

describe('Delete measure on the measure edit page', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue
        qiCoreCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 8 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create new QI Core measure
        measureQICore = 'QICoreMeasure' + Date.now() + randValue + 4 + randValue
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 4 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests, 1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()

    })

    it('Delete measure on the edit page for a measure', () => {

        //Qi Core
        MeasuresPage.actionCenter('edit', 1)
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.deleteMeasureConfirmationButton, 5000)
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 5000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', "Measure successfully deleted")
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 10000)
        cy.url().should('be.oneOf', ['https://dev-madie.hcqis.org/measures', 'https://test-madie.hcqis.org/measures', 'https://impl-madie.hcqis.org/measures', 'https://madie.cms.gov/measures'])


        //QDM
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.deleteMeasureConfirmationButton, 5000)
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 5000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', "Measure successfully deleted")
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 10000)
        cy.url().should('be.oneOf', ['https://dev-madie.hcqis.org/measures', 'https://test-madie.hcqis.org/measures', 'https://impl-madie.hcqis.org/measures', 'https://madie.cms.gov/measures'])

    })
})

describe('Version and Draft QDM Measure on the Edit Measure page', () => {

    measureQDM = 'QDMMeasure' + Date.now() + randValue + 9 + randValue
    let updatedMeasureName = 'Updated' + measureQDM
    qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 9 + randValue

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Log Out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureQDM, qdmCQLLibrary)
    })

    it('Version and Draft QDM Measure on the edit page for a measure', () => {

        //Version Measure
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureVersionActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).click()
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(EditMeasurePage.editPageVersionDraftMsg, 60000)
        cy.get(EditMeasurePage.editPageVersionDraftMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        //Draft Measure
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDraftActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDraftActionBtn).click()
        cy.get('[data-testid="measure-name-field"] > .MuiInputBase-root > [data-testid="measure-name-input"]').clear().type(updatedMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(EditMeasurePage.editPageVersionDraftMsg).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')
    })

})

describe('Version and Draft Qi Core Measure on the Edit Measure page', () => {

    measureQICore = 'QiCore' + Date.now() + randValue + 5 + randValue
    qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 5 + randValue
    let updatedMeasureName = 'Updated' + measureQDM

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Log Out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureQICore, qiCoreCQLLibrary)
    })

    it('Version and Draft Qi Core measure on the edit page for a measure', () => {

        //Version Measure
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureVersionActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).click()
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(EditMeasurePage.editPageVersionDraftMsg, 60000)
        cy.get(EditMeasurePage.editPageVersionDraftMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        //Draft Measure
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDraftActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDraftActionBtn).click()
        cy.get('[data-testid="measure-name-field"] > .MuiInputBase-root > [data-testid="measure-name-input"]').clear().type(updatedMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(EditMeasurePage.editPageVersionDraftMsg).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')
    })
})

describe('Export measure on the Edit Measure page', () => {

    deleteDownloadsFolderBeforeEach()

    before(() => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        const date = Date.now()
        measureQDM = 'QDMExportMeasure' + date
        qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        measureQICore = 'QICoreExportMeasure' + date
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests, 1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
    })

    after(() => {

        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)
        Utilities.deleteMeasure(measureQICore, qiCoreCQLLibrary, false, false, 1)
    })

    it('Export QDM 5.6 measure', () => {
        const exportName = 'eCQMTitle4QDM-v0.0.000-QDM.zip'
        const fullPathToExport = path.join(downloadsFolder, exportName)

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.export)

        cy.readFile(fullPathToExport, { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })

    it('Export QiCore 4.1.1 measure', () => {
        const exportName = 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'
        const fullPathToExport = path.join(downloadsFolder, exportName)

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit", 1)

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.export)

        cy.readFile(fullPathToExport, { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })
})

//Skipping until feature flag 'ShareMeasure' is removed
describe.skip('Share measure from the Edit Measure page', () => {

    before(() => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        const date = Date.now()
        measureQDM = 'QDMShareMeasure' + date
        qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        measureQICore = 'QICoreShareMeasure' + date
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests, 1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
    })

    after(() => {

        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)
        Utilities.deleteMeasure(measureQICore, qiCoreCQLLibrary, false, false, 1)
    })

    it('Share QDM 5.6 measure', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.share)

    })

    it('Share QiCore 4.1.1 measure', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit", 1)

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.share)

    })
})

describe('Dirty Check Validations', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 7 + randValue
        qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 7 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create new QI Core measure
        measureQICore = 'QICoreMeasure' + Date.now() + randValue + 6 + randValue
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 6 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests, 1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
    })

    after('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)
        Utilities.deleteMeasure(measureQICore, qiCoreCQLLibrary, false, false, 1)

    })

    it('Dirty check pops up when QDM Measure has unsaved changes and user try to Version', () => {

        OktaLogin.Login()

        //Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureNameTextBox).clear()

        //Click on Version button
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureVersionActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).click()

        //Validate Dirty check modal
        cy.get(Global.discardChangesConfirmationModal).should('exist')

    })

    it('Dirty check pops up when Qi Core Measure has unsaved changes and user try to Version', () => {

        OktaLogin.Login()

        //Edit Measure
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.measureNameTextBox).clear()

        //Click on Version button
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureVersionActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).click()

        //Validate Dirty check modal
        cy.get(Global.discardChangesConfirmationModal).should('exist')

    })
})

describe('View measure Human Readable on the Edit Measure page', () => {

    before(() => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        const date = Date.now()
        measureQDM = 'QDMExportMeasure' + date
        qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, qdmCQLLibrary, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        measureQICore = 'QICoreExportMeasure' + date
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests, 1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
    })

    after(() => {

        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)
        Utilities.deleteMeasure(measureQICore, qiCoreCQLLibrary, false, false, 1)
    })

    it('View Human Readable for QDM 5.6 measure', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.viewHR)

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
    })

    it('View Human Readable for QiCore 4.1.1 measure', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit", 1)

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)

        EditMeasurePage.actionCenter(EditMeasureActions.viewHR)

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
    })
})
