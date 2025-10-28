import { CreateMeasureOptions, CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Toasts } from "../../../../Shared/Toasts"

let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
let versionNumber = '1.0.000'

const xml2js = require('xml2js')
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let description = 'SemanticBits test'

const measureData: CreateMeasureOptions = {
    measureCql: qdmMeasureCQL,
    ecqmTitle: qdmMeasureName,
    cqlLibraryName: qdmCqlLibraryName,
    measureScoring: 'Cohort',
    description: description,
    patientBasis: 'false'
}

describe('Verify QDM Measure Export file contents', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 90000)
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 90000)
        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 90000 }).should('exist')
        cy.log('Successfully verified zip file export')
        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Verify files, their types and the contents of the HR file, for QDM Measure', () => {

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')
    })

    it('Verify content of the XML / HQMF file, for a QDM Measure', () => {

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.xml')).then((xmlData) => {
            // Parse the XML data
            xml2js.parseString(xmlData, (err, result) => {
                if (err) {
                    throw new Error('Failed to parse XML file')
                }
                // Validate the value of the <text> tag
                const textValue = result['QualityMeasureDocument']['text'][0]['$']['value']
                expect(textValue).to.equal(description)
            })
        })
    })
})

describe('QDM Measure Export, Not the Owner', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Non Measure owner able to Export QDM Measure', () => {

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        MeasuresPage.actionCenter('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })
})

describe('Successful QDM Measure Export with versioned measure', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //version measure
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v1.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })

    it('Version measure, unzip the downloaded file, and verify file contents for the HR, for QDM Measure', () => {

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v1.0.000-QDM.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')
    })
})


