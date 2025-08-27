import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"

const url = Cypress.config('baseUrl')
let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
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
    mpEndDate: '2026-12-31',
    description: '<p>This is a TEST.</p><table class="rich-text-table" style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Label 1</p></th><th colspan="1" rowspan="1"><p>Label 2</p></th><th colspan="1" rowspan="1"><p>Label 3</p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><ol><li><p>test 1</p></li><li><p>test 2</p></li><li><p>test 3</p></li></ol></td></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p><strong><em><u>This is another TEST</u></em></strong></p>'
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
            expect(bodyText).to.include('Measurement Period\tJanuary 1, 2026 through December 31, 2026\n' +
                'Measure Steward\tSemanticBits\nMeasure Developer\tAcademy of Nutrition and Dietetics\nEndorsed By\tNone')

            expect(bodyText).to.include('Description\t\n\nThis is a TEST.\n\n\n\n\nLabel 1\n\n\t\n\n' +
                'Label 2\n\n\t\n\nLabel 3\n\n\n\n\n\t\n\n\t\n\ntest 1\n\ntest 2\n\ntest 3' +
                '\n\n\n\n\n\t\n\n\t\n\n\n\n\nThis is another TEST')

            expect(bodyText).to.include('Measure Scoring\tProportion\nMeasure Type\tProcess\nStratification\t\nNone')

            //populations
            expect(bodyText).to.include('Initial Population\t\n\ntest IP P\n\n\nDenominator\t\n\ntest d P\n\n\n' +
                'Denominator Exclusions\t\n\ntest dE P\n\n\nNumerator\t\n\ntest n P\n\n\nNumerator Exclusions\t\n' +
                'None\n\nDenominator Exceptions\t\nNone')

            //population criteria
            expect(bodyText).to.include('Population Criteria\nInitial Population\n  ' +
                '["Patient Characteristic Payer": "Payer Type"]\n \nDenominator\n  ' +
                '["Patient Characteristic Payer": "Payer Type"]\n \nDenominator Exclusions\n  ' +
                '["Patient Characteristic Payer": "Payer Type"]\n \nDenominator Exceptions\nNone\n \n' +
                'Numerator\n  ["Patient Characteristic Payer": "Payer Type"]\n \nNumerator Exclusions\nNone\n' +
                ' \nStratification\nNone')

            //definitions, functions, terminology, data criteria
            expect(bodyText).to.include('Functions\nNone\nTerminology\nvalueset "Payer Type" (2.16.840.1.114222.4.11.3591)\n' +
                'Data Criteria (QDM Data Elements)\n"Patient Characteristic Payer: Payer Type" using "Payer Type (2.16.840.1.114222.4.11.3591)"')
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


