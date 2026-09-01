import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10142: Enable when MeasureReviewStatus search is available in TEST.
describe.skip('MAT-10142 Measure Review search', () => {
    let fhirMeasureName = ''
    let qdmMeasureName = ''
    let notReadyMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        fhirMeasureName = `MeasureFilterFHIR${uniqueSuffix}`
        qdmMeasureName = `MeasureFilterQDM${uniqueSuffix}`
        notReadyMeasureName = `MeasureFilterDraft${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            fhirMeasureName,
            `MeasureFilterFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            qdmMeasureName,
            `MeasureFilterQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            notReadyMeasureName,
            `MeasureFilterDraftLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            2
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 1).its('status').should('eq', 201)
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
        Utilities.deleteMeasure(undefined, undefined, false, false, 2)
    })

    it('searches Ready across all columns and with the Review filter on Owned Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewFilterIsLastOption()
        MeasuresPage.clearFilter()

        MeasuresPage.searchMeasures('Ready')
        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowContains(1, 'Ready')
        MeasuresPage.assertMeasureSearchRowAbsent(2)

        MeasuresPage.selectReviewFilter()
        MeasuresPage.searchMeasures('Ready')
        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowContains(1, 'Ready')
        MeasuresPage.assertMeasureSearchRowAbsent(2)
    })

    it('searches Ready with the Review filter on Shared Measures', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.selectReviewFilter()
        MeasuresPage.searchMeasures('Ready')
        MeasuresPage.assertMeasureSearchRowContains(1, 'Ready')
    })

    it('does not offer the Review filter on All Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.allMeasuresTab).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterReviewOption).should('not.exist')
    })
})
