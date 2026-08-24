import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10141: Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10141 Measure Review column', () => {
    let fhirMeasureName = ''
    let qdmMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        fhirMeasureName = `MeasureReviewColumnFHIR${uniqueSuffix}`
        qdmMeasureName = `MeasureReviewColumnQDM${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            fhirMeasureName,
            `MeasureReviewColumnFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            qdmMeasureName,
            `MeasureReviewColumnQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)

        const measureNumbers = [0, 1]
        measureNumbers.forEach((measureNumber) => {
            TestData.readMeasureId(measureNumber).then((measureId) => {
                TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true))
                    .its('status')
                    .should('eq', 200)
            })
        })
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('shows Ready and - in the Review column on Owned Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnVisible()
        MeasuresPage.assertReviewColumnIsNotSortable()

        MeasuresPage.searchForMeasureByName(fhirMeasureName)
        MeasuresPage.assertMeasureReviewStatus(0, 'Ready')

        MeasuresPage.searchForMeasureByName(qdmMeasureName)
        MeasuresPage.assertMeasureReviewStatus(1, '-')
    })

    it('shows Ready and - in the Review column on Shared Measures', () => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnVisible()

        MeasuresPage.searchForMeasureByName(fhirMeasureName)
        MeasuresPage.assertMeasureReviewStatus(0, 'Ready')

        MeasuresPage.searchForMeasureByName(qdmMeasureName)
        MeasuresPage.assertMeasureReviewStatus(1, '-')
    })

    it('does not show the Review column on All Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.allMeasuresTab).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnAbsent()
    })
})
