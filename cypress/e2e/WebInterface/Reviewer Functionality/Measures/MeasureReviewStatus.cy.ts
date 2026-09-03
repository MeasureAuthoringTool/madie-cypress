import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { Header } from '../../../../Shared/Header'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10138: Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10138 Measure Review action', () => {
    let ownedFhirMeasureName = ''
    let sharedQdmMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirMeasureName = `ReviewOwnerFHIR${uniqueSuffix}`
        sharedQdmMeasureName = `ReviewSharedQDM${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            ownedFhirMeasureName,
            `ReviewOwnerFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            sharedQdmMeasureName,
            `ReviewSharedQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        TestData.readMeasureId(1).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true)).then(
                (response) => {
                    expect(response.status).to.eq(200)
                }
            )
        })
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('enables Review for a selected FHIR measure on My Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', ownedFhirMeasureName)

        TestData.readMeasureId(0).then((measureId) => {
            cy.get(`[data-testid="measure-name-${measureId}_select"]`).find('input[type="checkbox"]').check()
        })
        MeasuresPage.assertReviewActionEnabled()
    })

    it('enables Review for a shared editor and hides it on a non-editable detail measure', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', sharedQdmMeasureName)

        TestData.readMeasureId(1).then((measureId) => {
            cy.get(`[data-testid="measure-name-${measureId}_select"]`).find('input[type="checkbox"]').check()
        })
        MeasuresPage.assertReviewActionEnabled()

        MeasuresPage.actionCenter('edit', 1)
        EditMeasurePage.assertReviewActionEnabled()

        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', ownedFhirMeasureName)
        TestData.readMeasureId(0).then((measureId) => {
            cy.get(`[data-testid="measure-name-${measureId}_select"]`).find('input[type="checkbox"]').check()
        })
        MeasuresPage.assertReviewActionDisabled()

        MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
        cy.get(EditMeasurePage.reviewMeasureActionBtn).should('not.exist')
    })
})
