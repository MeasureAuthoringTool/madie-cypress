import { Header } from '../../../Shared/Header'
import { MeasureActionCenter, MeasureActionTooltipMessages } from '../../../Shared/MeasureActionCenter'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Accessibility } from '../../../support/accessibility'
import { step } from '../../../utils/step'
import { CreateMeasureOptions, CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { Utilities } from '../../../Shared/Utilities'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'

const draftTooltipMessages: MeasureActionTooltipMessages = {
    delete: 'Delete measure', export: 'Export measure', share: 'Share/unshare', transfer: 'Transfer',
    associateCmsId: 'Select two measures', version: 'Version measure', draft: 'Select a measure to draft',
    viewHumanReadable: 'View human readable', history: 'View measure history', compareVersions:
        'Select 2 instances within the same measure set to compare measure versions'
}

const versionedTooltipMessages: MeasureActionTooltipMessages = {
    delete: 'Select a measure to delete', export: 'Export measure', share: 'Share/unshare', transfer: 'Transfer',
    associateCmsId: 'Select two measures', version: 'Select a measure to version', draft: 'Draft measure',
    viewHumanReadable: 'View human readable', history: 'View measure history', compareVersions:
        'Select 2 instances within the same measure set to compare measure versions'
}

const twoQiCoreTooltipMessages: MeasureActionTooltipMessages = {
    delete: 'Select a measure to delete', export: 'Select a measure to export', share: 'Share/unshare', transfer: 'Transfer',
    associateCmsId: 'Must select one QDM and one QI-Core measure', version: 'Select a measure to version',
    draft: 'Select a measure to draft', viewHumanReadable: 'Select a measure to view human readable',
    history: 'Select a measure to view history', compareVersions:
        'Select 2 instances within the same measure set to compare measure versions'
}

const qdmQiCoreWithoutCmsIdTooltipMessages: MeasureActionTooltipMessages = {
    delete: 'Select a measure to delete', export: 'Select a measure to export', share: 'Share/unshare', transfer: 'Transfer',
    associateCmsId: 'QDM measure must contain a CMS ID', version: 'Select a measure to version',
    draft: 'Select a measure to draft', viewHumanReadable: 'Select a measure to view human readable',
    history: 'Select a measure to view history', compareVersions:
        'Select 2 instances within the same measure set to compare measure versions'
}

const qdmQiCoreWithCmsIdTooltipMessages: MeasureActionTooltipMessages = {
    ...qdmQiCoreWithoutCmsIdTooltipMessages,
    associateCmsId: 'Associate CMS ID'
}

const comparableVersionsTooltipMessages: MeasureActionTooltipMessages = {
    ...twoQiCoreTooltipMessages,
    compareVersions: 'Compare measure versions'
}

// MAT-10344
describe('Measure action center accessibility', () => {
    beforeEach('Open the measure list', () => {
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    it('provides an accessible Select All Measures checkbox', () => {
        step('Verify the select-all checkbox accessible name')
        MeasureActionCenter.assertSelectAllMeasuresCheckbox()
    })

    it('uses div tooltip wrappers and labelled action buttons', () => {
        step('Verify static action-center markup and scoped accessibility scans')
        MeasureActionCenter.assertActionMarkup()
    })

    it('shows the required tooltips without a selected measure', () => {
        step('Verify the no-selection tooltip matrix')
        MeasureActionCenter.assertTooltipMessages('none')
    })

})

// MAT-10344: Re-enable in the TEST suite when Reviewer is available in the release target.
describe.skip('Reviewer measure action-center accessibility', () => {
    beforeEach('Open All Reviews as the reviewer-role user', () => {
        OktaLogin.ReviewerLogin()
        cy.get(Header.measures).should('be.visible').click()
        MeasuresPage.openAllReviewsTab()
        return Accessibility.injectAxe()
    })

    afterEach('Release the reviewer-role user', () => {
        OktaLogin.releaseReviewer()
    })

    it('uses the reviewer action accessibility contract when the feature is enabled', () => {
        MeasureActionCenter.assertReviewerAction(true)
    })
})

describe('Versioned measure action-center tooltips', () => {
    let versionedMeasureName = ''

    beforeEach('Create, version, and locate a measure', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        versionedMeasureName = `MAT10344Versioned${suffix}`
        CreateMeasurePage.CreateQICoreMeasureAPI(
            versionedMeasureName,
            `${versionedMeasureName}Library`,
            MeasureCQL.CQL_For_Cohort
        )
        TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        TestData.versionMeasure().its('status').should('eq', 200)
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned versioned measure', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 0)
    })

    it('shows the required tooltips for a selected versioned measure', () => {
        step('Find and select the scenario versioned measure')
        MeasureActionCenter.searchAndSelectMeasure(versionedMeasureName)

        step('Verify the versioned-measure tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(versionedTooltipMessages)
    })
})

describe('Multiple QI-Core measure action-center tooltips', () => {
    let measureNamePrefix = ''

    beforeEach('Create and locate two QI-Core measures', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        measureNamePrefix = `MAT10344TwoQiCore${suffix}`
        ;[0, 1].forEach((measureNumber) => {
            const measureName = `${measureNamePrefix}${measureNumber}`
            CreateMeasurePage.CreateQICoreMeasureAPI(measureName, `${measureName}Library`, MeasureCQL.CQL_For_Cohort, measureNumber)
            MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, undefined, undefined, measureNumber)
        })
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned QI-Core measures', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 0).then(() =>
            Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        )
    })

    it('shows the required tooltips for two selected QI-Core measures', () => {
        step('Find and select the two scenario QI-Core measures')
        MeasureActionCenter.searchAndSelectMeasures(measureNamePrefix, [0, 1])

        step('Verify the two-QI-Core tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(twoQiCoreTooltipMessages)
    })
})

describe('QDM and QI-Core action-center tooltips without a CMS ID', () => {
    let measureNamePrefix = ''

    beforeEach('Create a QDM and QI-Core measure without a CMS ID', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        measureNamePrefix = `MAT10344NoCms${suffix}`
        const qdmMeasureName = `${measureNamePrefix}QDM`
        const qdmMeasure: CreateMeasureOptions = {
            ecqmTitle: qdmMeasureName,
            cqlLibraryName: `${qdmMeasureName}Library`,
            measureScoring: 'Cohort',
            patientBasis: 'true',
            measureCql: MeasureCQL.returnBooleanPatientBasedQDM_CQL,
            measureNumber: 0
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure)
        const qiCoreMeasureName = `${measureNamePrefix}QICore`
        CreateMeasurePage.CreateQICoreMeasureAPI(
            qiCoreMeasureName,
            `${qiCoreMeasureName}Library`,
            MeasureCQL.CQL_For_Cohort,
            1
        )
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned QDM and QI-Core measures', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 0).then(() =>
            Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        )
    })

    it('shows the required tooltips for QDM and QI-Core measures without a CMS ID', () => {
        step('Find and select the QDM and QI-Core measures without a CMS ID')
        MeasureActionCenter.searchAndSelectMeasures(measureNamePrefix, [0, 1])

        step('Verify the no-CMS-ID tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(qdmQiCoreWithoutCmsIdTooltipMessages)
    })
})

describe('QDM and QI-Core action-center tooltips with a CMS ID', () => {
    let measureNamePrefix = ''

    beforeEach('Create a QDM with a CMS ID and a QI-Core measure', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        measureNamePrefix = `MAT10344WithCms${suffix}`
        const qdmMeasureName = `${measureNamePrefix}QDM`
        const qdmMeasure: CreateMeasureOptions = {
            ecqmTitle: qdmMeasureName,
            cqlLibraryName: `${qdmMeasureName}Library`,
            measureScoring: 'Cohort',
            patientBasis: 'true',
            measureCql: MeasureCQL.returnBooleanPatientBasedQDM_CQL,
            measureNumber: 0
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure)
        const qiCoreMeasureName = `${measureNamePrefix}QICore`
        CreateMeasurePage.CreateQICoreMeasureAPI(
            qiCoreMeasureName,
            `${qiCoreMeasureName}Library`,
            MeasureCQL.CQL_For_Cohort,
            1
        )
        OktaLogin.SessionLogin()
        TestData.readMeasureSetId().then((measureSetId) => {
            return TestData.requestWithAccessToken({
                url: `/api/measures/${measureSetId}/create-cms-id`,
                method: 'PUT'
            }).its('status').should('eq', 201)
        })
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned QDM and QI-Core measures', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 0).then(() =>
            Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        )
    })

    it('shows the required tooltips for QDM and QI-Core measures with a CMS ID', () => {
        step('Find and select the QDM with a CMS ID and the QI-Core measure')
        MeasureActionCenter.searchAndSelectMeasures(measureNamePrefix, [0, 1])

        step('Verify the CMS-ID tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(qdmQiCoreWithCmsIdTooltipMessages)
    })
})

describe('Same measure-set version comparison action-center tooltips', () => {
    let versionedMeasureName = ''
    let draftMeasureName = ''
    let cqlLibraryName = ''

    beforeEach('Create a versioned measure and an API-created draft in its measure set', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        versionedMeasureName = `MAT10344Compare${suffix}`
        draftMeasureName = `${versionedMeasureName}Draft`
        cqlLibraryName = `${versionedMeasureName}Library`
        CreateMeasurePage.CreateQICoreMeasureAPI(versionedMeasureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        TestData.readMeasure().then((measureResponse) => {
            const measure = measureResponse.body
            TestData.versionMeasure().then((versionResponse) => {
                expect(versionResponse.status).to.eq(200)
                const draftBody: MeasureDraftBody = {
                    measureName: draftMeasureName,
                    cqlLibraryName,
                    model: measure.model,
                    createdBy: OktaLogin.getUser(false),
                    cql: measure.cql,
                    elmJson: measure.elmJson,
                    ecqmTitle: measure.ecqmTitle,
                    measurementPeriodStart: measure.measurementPeriodStart,
                    measurementPeriodEnd: measure.measurementPeriodEnd
                }
                TestData.requestMeasureDraft(draftBody).then((draftResponse) => {
                    expect(draftResponse.status).to.eq(201)
                    TestData.writeMeasureContext(draftResponse.body, 1)
                })
            })
        })
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned draft and versioned measure', () => {
        Utilities.deleteVersionedMeasure(versionedMeasureName, cqlLibraryName)
        return Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('shows the required tooltips for two versions from the same measure set', () => {
        step('Find the measure set and select the API-created draft')
        MeasureActionCenter.searchAndSelectMeasure(versionedMeasureName, 1)

        step('Expand the searched measure set and select its versioned measure')
        MeasuresPage.expandSearchedMeasureSet()
        MeasuresPage.selectExpandedMeasure()

        step('Verify the same-measure-set comparison tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(comparableVersionsTooltipMessages)
    })
})

describe('Measure action center tooltip states', () => {
    let draftMeasureName = ''

    beforeEach('Create and locate a draft measure', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        draftMeasureName = `MAT10344Draft${suffix}`
        CreateMeasurePage.CreateQICoreMeasureAPI(draftMeasureName, `${draftMeasureName}Library`, MeasureCQL.CQL_For_Cohort)
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        OktaLogin.SessionLogin()
        cy.get(Header.measures).should('be.visible').click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        return Accessibility.injectAxe()
    })

    afterEach('Delete the scenario-owned draft measure', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 0)
    })

    it('shows the required tooltips for a selected draft measure', () => {
        step('Find and select the scenario draft measure')
        MeasureActionCenter.searchAndSelectMeasure(draftMeasureName)

        step('Verify the draft-measure tooltip matrix')
        MeasureActionCenter.assertTooltipMessagesForScenario(draftTooltipMessages)
    })
})
