import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-9813: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile Shared Measure actions', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let profileUser = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileShared${uniqueSuffix}`
        cqlLibraryName = `AdminProfileSharedLib${uniqueSuffix}`
        profileUser = OktaLogin.getUser(true)

        const measureCql = MeasureCQL.CQL_For_Cohort
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCql)
        TestData.saveMeasureCql(`${measureCql}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body[measureId][0].userId).to.eq(profileUser)
                expect(response.body[measureId][0].roles).to.include('SHARED_WITH')
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.selectMeasureByName(measureName)
    })

    afterEach(() => {
        Utilities.deleteMeasure()
    })

    it('enables the single-measure actions and shows both export options', () => {
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.exportButton,
            AdminUserProfilePage.exportTooltip,
            'Export measure'
        )
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.humanReadableButton,
            AdminUserProfilePage.humanReadableTooltip,
            'View human readable'
        )
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.historyButton,
            AdminUserProfilePage.historyTooltip,
            'View History'
        )
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.compareVersionsButton,
            AdminUserProfilePage.compareVersionsTooltip,
            'Select 2 instances within the same measure set to compare measure versions'
        )

        cy.get(AdminUserProfilePage.exportButton).click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('be.visible').and('have.text', 'Export')
        cy.get(MeasuresPage.exportPublishingOption)
            .should('be.visible')
            .and('have.text', 'Export for Publishing')
    })

    it('opens Human Readable for a Shared Measure', () => {
        cy.get(AdminUserProfilePage.humanReadableButton).should('be.enabled').click()
        cy.get(EditMeasurePage.humanReadablePopup).should('be.visible').and('contain.text', 'Human Readable')
    })

    it('opens Measure History for a Shared Measure', () => {
        cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
        cy.get('[data-testid="measure-history-header"]').should('be.visible')
    })

    ;[
        { name: 'Export', selector: MeasuresPage.exportNonPublishingOption },
        { name: 'Export for Publishing', selector: MeasuresPage.exportPublishingOption }
    ].forEach(({ name, selector }) => {
        it(`exports a Shared Measure using ${name}`, () => {
            cy.intercept('GET', '**/api/measures/*/exports?*').as('measureExport')
            cy.get(AdminUserProfilePage.exportButton).should('be.enabled').click()
            cy.get(selector).should('be.visible').click()
            cy.get(MeasuresPage.exportingDialog).should('be.visible')
            cy.wait('@measureExport', { timeout: 60000 }).its('response.statusCode').should('eq', 201)
            cy.get(MeasuresPage.exportFinishedCheck, { timeout: 60000 }).should('be.visible')
            cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')

            if (name === 'Export') {
                cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.visible').click()
                cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
                cy.get(MeasuresPage.userActionRow).should('contain.text', 'EXPORTED_MEASURE')
                cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'by MADiE Admin')
            }
        })
    })
})

describe.skip('Admin user profile unrelated Shared Measure selections', () => {
    let firstMeasureName = ''
    let secondMeasureName = ''
    let firstLibraryName = ''
    let secondLibraryName = ''
    let profileUser = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        firstMeasureName = `AdminProfileSharedOne${uniqueSuffix}`
        secondMeasureName = `AdminProfileSharedTwo${uniqueSuffix}`
        firstLibraryName = `AdminProfileSharedLibOne${uniqueSuffix}`
        secondLibraryName = `AdminProfileSharedLibTwo${uniqueSuffix}`
        profileUser = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(
            firstMeasureName,
            firstLibraryName,
            MeasureCQL.CQL_For_Cohort,
            0
        )
        CreateMeasurePage.CreateQICoreMeasureAPI(
            secondMeasureName,
            secondLibraryName,
            MeasureCQL.CQL_For_Cohort,
            1
        )
        ;[0, 1].forEach((measureNumber) => {
            TestData.readMeasureId(measureNumber).then((measureId) => {
                TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then((response) => {
                    expect(response.status).to.eq(200)
                })
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('disables actions when two unrelated Shared Measures are selected', () => {
        AdminUserProfilePage.selectMeasureByName(firstMeasureName)
        AdminUserProfilePage.selectMeasureByName(secondMeasureName)

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.exportButton,
            AdminUserProfilePage.exportTooltip,
            'Select measure to export'
        )
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.humanReadableButton,
            AdminUserProfilePage.humanReadableTooltip,
            'Select measure to view human readable'
        )
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.historyButton,
            AdminUserProfilePage.historyTooltip,
            'Select a measure to view history'
        )
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.compareVersionsButton,
            AdminUserProfilePage.compareVersionsTooltip,
            'Select 2 instances within the same measure set to compare measure versions'
        )
    })
})
