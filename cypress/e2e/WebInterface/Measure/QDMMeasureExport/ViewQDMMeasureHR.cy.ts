import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasureActions, EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureQDM = ''
let qdmCQLLibrary = ''

describe('View Human Readable for QDM Measure', () => {

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
    })

    after(() => {

        Utilities.deleteMeasure(measureQDM, qdmCQLLibrary)

    })

    it('View Human Readable for QDM 5.6 Measure on My Measures page', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(4) > tbody > :nth-child(1) > td').should('contain.text', measureQDM)
    })

    it('View Human Readable for QDM 5.6 Measure on All Measures page', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(4) > tbody > :nth-child(1) > td').should('contain.text', measureQDM)
    })
})
