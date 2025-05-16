import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureQDM = ''
let qdmCQLLibrary = ''

const measureData: CreateMeasureOptions = {}

describe('View Human Readable for QDM Measure', () => {

    beforeEach(() => {

        const date = Date.now()
        measureQDM = 'QDMExportMeasure' + date
        qdmCQLLibrary = 'QDMTestLibrary' + Date.now() + randValue + 3 + randValue

        measureData.ecqmTitle = measureQDM
        measureData.cqlLibraryName = qdmCQLLibrary
        measureData.measureScoring = 'Proportion'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmManifestTestCQL
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach(() => {

        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)
    })

    it('View Human Readable for QDM 5.6 Measure on My Measures page', () => {

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(4) > tbody > :nth-child(1) > td').should('contain.text', measureQDM)
    })

    it('View Human Readable for QDM 5.6 Measure on All Measures page', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(4) > tbody > :nth-child(1) > td').should('contain.text', measureQDM)
    })

    it('Export measure from HR modal', () => {

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')

        cy.get('[data-testid="human-readable-export-button"]').scrollIntoView().click()
        cy.get(MeasuresPage.exportPublishingOption).click()

        cy.contains('Success').should('be.visible')
        cy.get(MeasuresPage.exportFinishedCheck).should('be.visible')
    })
})
