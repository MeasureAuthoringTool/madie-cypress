import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureCQLPFTests = MeasureCQL.CQL_Populations
let measureQICore = ''
let qiCoreCQLLibrary = ''

describe('View Human Readable for Qi Core Measure', () => {

    before(() => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        const date = Date.now()
        measureQICore = 'QICoreExportMeasure' + date
        qiCoreCQLLibrary = 'QiCoreTestLibrary' + Date.now() + randValue + 3 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    after(() => {

        Utilities.deleteMeasure(measureQICore, qiCoreCQLLibrary)
    })

    it('View Human Readable for QiCore 4.1.1 Measure on My Measures page', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(3) > .content-container').should('contain.text', measureQICore)
        cy.get(':nth-child(17) > .content-container').should('contain.text', 'eCQMTitle4QICore')
    })

    it('View Human Readable for QiCore 4.1.1 Measure on All Measures page', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(3) > .content-container').should('contain.text', measureQICore)
        cy.get(':nth-child(17) > .content-container').should('contain.text', 'eCQMTitle4QICore')
    })

    it('Export measure from View HR modal', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')

        cy.get('[data-testid="human-readable-export-button"]').scrollIntoView().click()
        cy.get(MeasuresPage.exportPublishingOption).click()

        cy.contains('Success').should('be.visible')
        cy.get(MeasuresPage.exportFinishedCheck).should('be.visible')
    })
})
