import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10143: Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10143 Measure Review Status header', () => {
    let readyFhirMeasureName = ''
    let readySharedQdmMeasureName = ''
    let notReadyQdmMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        readyFhirMeasureName = `MeasureReviewHeaderFHIR${uniqueSuffix}`
        readySharedQdmMeasureName = `MeasureReviewHeaderSharedQDM${uniqueSuffix}`
        notReadyQdmMeasureName = `MeasureReviewHeaderNotReadyQDM${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            readyFhirMeasureName,
            `MeasureReviewHeaderFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            readySharedQdmMeasureName,
            `MeasureReviewHeaderSharedQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            notReadyQdmMeasureName,
            `MeasureReviewHeaderNotReadyQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            2
        )

        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 1).its('status').should('eq', 201)
        TestData.readMeasureId(1).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        Utilities.deleteMeasure(undefined, undefined, false, false, 2)
    })

    it('shows Review Status: Ready for an owned FHIR measure marked Ready', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(readyFhirMeasureName)

        MeasuresPage.openMeasureDetailsFromCurrentList(0)
        EditMeasurePage.assertReviewStatusReady()
    })

    it('shows Review Status: Ready for a shared QDM measure editor', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(readySharedQdmMeasureName)

        MeasuresPage.openMeasureDetailsFromCurrentList(1)
        EditMeasurePage.assertReviewStatusReady()
    })

    it('does not show Review Status for an owned QDM measure not marked Ready', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(notReadyQdmMeasureName)

        MeasuresPage.openMeasureDetailsFromCurrentList(2)
        EditMeasurePage.assertReviewStatusAbsent()
    })

    it('does not show Review Status for a Ready measure without edit access', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(readyFhirMeasureName)

        MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
        EditMeasurePage.assertReviewStatusAbsent()
    })
})
