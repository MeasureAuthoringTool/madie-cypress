import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10141: Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10141 Measure Review column', () => {
    let measureName = ''

    const createAndShareMeasure = (
        namePrefix: string,
        libraryNamePrefix: string,
        model: SupportedModels,
        reviewStatus?: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE'
    ) => {
        const uniqueSuffix = Date.now()
        measureName = `${namePrefix}${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(measureName, `${libraryNamePrefix}${uniqueSuffix}`, model, undefined, 0)

        if (reviewStatus) {
            TestData.requestMeasureReview(reviewStatus, '', 0).its('status').should('eq', 201)
        }

        TestData.readMeasureId(0).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
    }

    beforeEach(() => {
        measureName = ''
    })

    afterEach(() => {
        if (measureName) {
            Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        }
    })

    const assertReviewStatusOnOwnedMeasures = (status: 'Ready' | 'In Progress' | 'Complete' | '-') => {
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnVisible()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureReviewStatus(0, status)
    }

    const assertReviewStatusOnSharedMeasures = (status: 'Ready' | 'In Progress' | 'Complete' | '-') => {
        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnVisible()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureReviewStatus(0, status)
    }

    it('shows Ready in the Review column on Owned Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnReadyFHIR',
            'MeasureReviewColumnReadyFHIRLib',
            SupportedModels.qiCore6,
            'READY_FOR_REVIEW'
        )
        assertReviewStatusOnOwnedMeasures('Ready')
    })

    it('shows In Progress in the Review column on Owned Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnInProgressQDM',
            'MeasureReviewColumnInProgressQDMLib',
            SupportedModels.QDM,
            'IN_PROGRESS'
        )
        assertReviewStatusOnOwnedMeasures('In Progress')
    })

    it('shows Complete in the Review column on Owned Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnCompleteFHIR',
            'MeasureReviewColumnCompleteFHIRLib',
            SupportedModels.qiCore6,
            'COMPLETE'
        )
        assertReviewStatusOnOwnedMeasures('Complete')
    })

    it('shows - for an unmarked measure in the Review column on Owned Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnUnmarkedQDM',
            'MeasureReviewColumnUnmarkedQDMLib',
            SupportedModels.QDM
        )
        assertReviewStatusOnOwnedMeasures('-')
    })

    it('does not sort the Review column on Owned Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnNotSortableFHIR',
            'MeasureReviewColumnNotSortableFHIRLib',
            SupportedModels.qiCore6
        )
        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnVisible()
        MeasuresPage.assertReviewColumnIsNotSortable()
    })

    it('shows Ready in the Review column on Shared Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnReadyFHIR',
            'MeasureReviewColumnReadyFHIRLib',
            SupportedModels.qiCore6,
            'READY_FOR_REVIEW'
        )
        assertReviewStatusOnSharedMeasures('Ready')
    })

    it('shows In Progress in the Review column on Shared Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnInProgressQDM',
            'MeasureReviewColumnInProgressQDMLib',
            SupportedModels.QDM,
            'IN_PROGRESS'
        )
        assertReviewStatusOnSharedMeasures('In Progress')
    })

    it('shows Complete in the Review column on Shared Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnCompleteFHIR',
            'MeasureReviewColumnCompleteFHIRLib',
            SupportedModels.qiCore6,
            'COMPLETE'
        )
        assertReviewStatusOnSharedMeasures('Complete')
    })

    it('shows - for an unmarked measure in the Review column on Shared Measures', () => {
        createAndShareMeasure(
            'MeasureReviewColumnUnmarkedQDM',
            'MeasureReviewColumnUnmarkedQDMLib',
            SupportedModels.QDM
        )
        assertReviewStatusOnSharedMeasures('-')
    })

    it('does not show the Review column on All Measures', () => {
        OktaLogin.Login()
        cy.get(MeasuresPage.allMeasuresTab).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        MeasuresPage.assertReviewColumnAbsent()
    })
})
