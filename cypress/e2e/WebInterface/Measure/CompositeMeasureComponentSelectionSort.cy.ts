import { CreateMeasurePage, SupportedCompositeModels } from '../../../Shared/CreateMeasurePage'
import { CompositeMeasureComponentsDialogPage } from '../../../Shared/CompositeMeasureComponentsDialogPage'
import {
    ComponentSort,
    CompositeMeasureComponentsDialogRequests
} from '../../../Shared/CompositeMeasureComponentsDialogRequests'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { MadieObject, Utilities } from '../../../Shared/Utilities'

type SortableComponentColumn = {
    header: string
    request: ComponentSort
}

const remainingSortableColumns: SortableComponentColumn[] = [
    { header: 'Version', request: { sort: 'version', direction: 'ASC' } },
    { header: 'CMS ID', request: { sort: 'measureSet.cmsId', direction: 'ASC' } },
    { header: 'Translator', request: { sort: 'translatorVersion', direction: 'ASC' } },
    { header: 'Updated', request: { sort: 'lastModifiedAt', direction: 'ASC' } }
]

const openComponentDialogAndWaitForInitialData = (): void => {
    CompositeMeasureComponentsDialogRequests.interceptInitialList()

    CompositeMeasureComponentsDialogPage.open()
    CompositeMeasureComponentsDialogPage.assertOpen()
    CompositeMeasureComponentsDialogRequests.waitForInitialList().then(() => {
        CompositeMeasureComponentsDialogPage.assertHasRows()
    })
}

describe('[MAT-10316] Composite Measure component selection global sorting', () => {
    let measureName = ''
    let cqlLibraryName = ''

    beforeEach('Create and open a composite measure', () => {
        const timestamp = Date.now()
        measureName = `MAT10316Composite${timestamp}`
        cqlLibraryName = `MAT10316CompositeLibrary${timestamp}`

        OktaLogin.setupUserSession(false)
        CreateMeasurePage.CreateCompositeMeasureAPI(
            measureName,
            cqlLibraryName,
            SupportedCompositeModels.qiCore6
        )

        TestData.requestMeasureGroup('PUT', {
            scoring: 'Composite',
            populations: [],
            measureGroupTypes: ['Process'],
            populationBasis: 'Boolean',
            compositeScoring: 'Opportunity'
        }).its('status').should('eq', 200)

        OktaLogin.SessionLogin()
        MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
        EditMeasurePage.openPopulationCriteriaTab()
        return cy.get(CompositeMeasureComponentsDialogPage.selectComponentsButton).should('be.visible')
    })

    afterEach('Clean up the composite measure', () => {
        return Utilities.releaseAllLocksForCleanup(MadieObject.Measure)
            .then(() => Utilities.deleteMeasure(measureName, cqlLibraryName))
    })

    it('preserves global Measure Name sorting when navigating to page 2', () => {
        const measureNameSort: ComponentSort = { sort: 'measureName', direction: 'ASC' }
        openComponentDialogAndWaitForInitialData()
        CompositeMeasureComponentsDialogRequests.interceptSortedList(
            measureNameSort,
            0,
            'sortedComponentsPage1'
        )
        CompositeMeasureComponentsDialogRequests.interceptSortedList(
            measureNameSort,
            1,
            'sortedComponentsPage2'
        )

        CompositeMeasureComponentsDialogPage.clickSortHeader('Measure Name')
        CompositeMeasureComponentsDialogPage.assertSortHeaderAction('Measure Name', 'Sort descending')

        CompositeMeasureComponentsDialogRequests.waitForSortedList(
            measureNameSort,
            0,
            '@sortedComponentsPage1'
        ).then((response) => {
            const page1MeasureNames = CompositeMeasureComponentsDialogRequests.measureNames(response)
            CompositeMeasureComponentsDialogPage.assertMeasureNames(page1MeasureNames)
        })

        CompositeMeasureComponentsDialogPage.goToPage(2)
        CompositeMeasureComponentsDialogRequests.waitForSortedList(
            measureNameSort,
            1,
            '@sortedComponentsPage2'
        ).then((response) => {
            const page2MeasureNames = CompositeMeasureComponentsDialogRequests.measureNames(response)
            CompositeMeasureComponentsDialogPage.assertMeasureNames(page2MeasureNames)
        })

        CompositeMeasureComponentsDialogPage.assertCurrentPage(2)
        CompositeMeasureComponentsDialogPage.assertSortHeaderAction('Measure Name', 'Sort descending')
    })

    remainingSortableColumns.forEach(({ header, request }) => {
        it(`requests global ${request.direction} sorting when ${header} is selected`, () => {
            openComponentDialogAndWaitForInitialData()
            CompositeMeasureComponentsDialogRequests.interceptSortedList(request)
            CompositeMeasureComponentsDialogPage.clickSortHeader(header)
            CompositeMeasureComponentsDialogRequests.waitForSortedList(request).then((response) => {
                CompositeMeasureComponentsDialogPage.assertMeasureNames(CompositeMeasureComponentsDialogRequests.measureNames(response))
            })
        })
    })
})
