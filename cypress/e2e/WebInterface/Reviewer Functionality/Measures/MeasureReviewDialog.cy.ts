import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { ReviewDialogPage } from '../../../../Shared/ReviewDialogPage'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10139: Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10139 Mark Measure Ready for Review dialog', () => {
    let ownedFhirMeasureName = ''
    let sharedQdmMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirMeasureName = `ReviewDialogOwnerFHIR${uniqueSuffix}`
        sharedQdmMeasureName = `ReviewDialogSharedQDM${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            ownedFhirMeasureName,
            `ReviewDialogOwnerFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            sharedQdmMeasureName,
            `ReviewDialogSharedQDMLib${uniqueSuffix}`,
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

    it('opens from My Measures and enables Save only after Mark as Ready changes', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', ownedFhirMeasureName)

        TestData.readMeasureId(0).then((measureId) => {
            cy.get(`[data-testid="measure-name-${measureId}_select"]`).find('input[type="checkbox"]').check()
        })
        MeasuresPage.openReviewDialog()
        ReviewDialogPage.assertInitialState('Mark Measure Ready for Review')
        ReviewDialogPage.markAsReady()
        ReviewDialogPage.closeWithCancel()
    })

    it('opens from shared QDM Measure Detail and closes with the red X', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', sharedQdmMeasureName)

        MeasuresPage.actionCenter('edit', 1)
        EditMeasurePage.openReviewDialog()
        ReviewDialogPage.assertInitialState('Mark Measure Ready for Review')
        ReviewDialogPage.closeWithX()
    })
})
