import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"

const date = Date.now()
const measureCQLPFTests = MeasureCQL.CQL_Populations
const measureQICore = 'QICoreExportMeasure' + date
const qiCoreCQLLibrary = 'QiCoreTestLibrary' + date

describe('View Human Readable for Qi Core Measure', () => {

    before(() => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, qiCoreCQLLibrary, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.SessionLogin()
        MeasuresPage.actionCenter("edit")
        CQLEditorPage.saveMonacoCql()
    })

    after(() => {

        Utilities.deleteMeasure()
    })

    it('View Human Readable for QiCore 4.1.1 Measure on My Measures page', () => {

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(2) > .content-container').should('contain.text', measureQICore)
        cy.get(':nth-child(4) > .content-container').should('contain.text', 'eCQMTitle4QICore')
    })

    it('View Human Readable for QiCore 4.1.1 Measure on All Measures page', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')
        cy.get(':nth-child(2) > .content-container').should('contain.text', measureQICore)
        cy.get(':nth-child(4) > .content-container').should('contain.text', 'eCQMTitle4QICore')
    })

    it('Export measure from View HR modal', () => {

        OktaLogin.SessionLogin()

        MeasuresPage.actionCenter('viewhr')

        Utilities.waitForElementVisible(EditMeasurePage.humanReadablePopup, 60000)
        cy.get(EditMeasurePage.humanReadablePopup).should('contain.text', 'Human Readable')

        cy.get('[data-testid="human-readable-export-button"]').scrollIntoView().click()
        cy.get(MeasuresPage.exportPublishingOption).click()

        cy.contains('Success').should('be.visible')
        cy.get(MeasuresPage.exportFinishedCheck).should('be.visible')
    })
})
