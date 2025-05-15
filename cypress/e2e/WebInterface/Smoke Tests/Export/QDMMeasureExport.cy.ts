import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header";

const url = Cypress.config('baseUrl')
let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.QDM_CQL_withDRC
let qdmCMSMeasureCQL = MeasureCQL.QDM_CQL_withLargeIncludedLibrary

const measureData: CreateMeasureOptions = {
    measureCql: qdmCMSMeasureCQL,
    ecqmTitle: qdmMeasureName,
    cqlLibraryName: qdmCqlLibraryName,
    measureScoring: 'Proportion',
    patientBasis: 'true',
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

const measureDataNonPB: CreateMeasureOptions = {
    measureCql: qdmCMSMeasureCQL,
    ecqmTitle: qdmMeasureName,
    cqlLibraryName: qdmCqlLibraryName,
    measureScoring: 'Proportion',
    patientBasis: 'false',
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

describe('Successful QDM Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureDataNonPB)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'SDE Payer',
            'SDE Payer', '', 'SDE Payer', '', 'SDE Payer')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')



        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')
        cy.verifyDownload('eCQMTitle4QDM-v0.0.000-QDM.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })


    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)

    })

    it('Validate the contents of the Human Readable HTML file', () => {

        //remove the baseUrl so that we can visit a local file
        Cypress.config('baseUrl', null)

        // Load the HTML file
        cy.visit('./cypress/downloads/eCQMTitle4QDM-v0.0.000-QDM.html')

        // Scrub the HTML and verify the data we are looking for
        cy.document().then((doc) => {

            const bodyText = doc.body.innerText;

            //eCQM Title
            expect(bodyText).to.include('eCQM Title\t\n' + qdmMeasureName)

            //eCQM Version Number
            expect(bodyText).to.include('eCQM Version Number\tDraft based on 0.0.000')

            //Various meta data
            expect(bodyText).to.include('Measurement Period\tJanuary 1, 2026 through December 31, 2026')
            expect(bodyText).to.include('Measure Steward\tSemanticBits')
            expect(bodyText).to.include('Measure Developer\tAcademy of Nutrition and Dietetics')
            expect(bodyText).to.include('Endorsed By\tNone')
            expect(bodyText).to.include('Description\t\n' +
                'SemanticBits')
            expect(bodyText).to.include('Measure Scoring\tProportion')
            expect(bodyText).to.include('Measure Type\tProcess')
            expect(bodyText).to.include('Stratification\t\n' +
                'None')
            expect(bodyText).to.include('Initial Population\t\n' +
                'None')
            expect(bodyText).to.include('Denominator\t\n' +
                'None')
            expect(bodyText).to.include('Denominator Exclusions\t\n' +
                'None')
            expect(bodyText).to.include('Numerator\t\n' +
                'None')
            expect(bodyText).to.include('Numerator Exclusions\t\n' +
                'None')
            expect(bodyText).to.include('Denominator Exceptions\t\n' +
                'None')

            //Population Criteria
            //Initial Population
            expect(bodyText).to.include('Initial Population\n' +
                '  ["Patient Characteristic Payer": "Payer Type"]')

            //Denominator
            expect(bodyText).to.include('Denominator\n' +
                '  ["Patient Characteristic Payer": "Payer Type"]')

            //Denominator Exclusions
            expect(bodyText).to.include('Denominator Exclusions\n' +
                '  ["Patient Characteristic Payer": "Payer Type"]')

            //Denominator Exceptions
            expect(bodyText).to.include('Denominator Exceptions\n' +
                'None')

            //Numerator
            expect(bodyText).to.include('Numerator\n' +
                '  ["Patient Characteristic Payer": "Payer Type"]')

            //Numerator Exclusions
            expect(bodyText).to.include('Numerator Exclusions\n' +
                'None')

            //Stratification
            expect(bodyText).to.include('Stratification\n' +
                'None')

            //Definitions
            expect(bodyText).to.include('SDE Payer\n' +
                '  ["Patient Characteristic Payer": "Payer Type"]')

            //Terminology
            expect(bodyText).to.include('valueset "Payer Type" (2.16.840.1.114222.4.11.3591)')

            //Data Criteria (QDM Data Elements)
            expect(bodyText).to.include('valueset "Payer Type" (2.16.840.1.114222.4.11.3591)')
        })
    })
})

describe('QDM Measure Export for CMS Measure with huge included Library', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        Cypress.config('baseUrl', url)

        measureData.cqlLibraryName = qdmCqlLibraryName + '2'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmCMSMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Qualifying Encounters', 'Denominator Exclusions', '',
            'Encounter without Food Screening', '', 'Qualifying Encounters')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        cy.get(Header.mainMadiePageButton).click()
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName + '2')

        OktaLogin.Logout()
    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.actionCenter('edit')

        // check for MAT-7961 - trim whitespace for export files
        cy.get(EditMeasurePage.abbreviatedTitleTextBox).invoke('val').then(value => {
            const whitespaceAddedName = '   ' + value + '   '
            cy.get(EditMeasurePage.abbreviatedTitleTextBox)
                .clear()
                .type(whitespaceAddedName)
        })

        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        EditMeasurePage.actionCenter(EditMeasureActions.export)

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })
})


