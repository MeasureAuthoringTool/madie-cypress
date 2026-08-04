import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { Utilities } from '../../../Shared/Utilities'

let profileUser = ''

// MAT-9813: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile measure actions', () => {
    beforeEach(() => {
        profileUser = Environment.credentials().adminUser?.toLowerCase() ?? ''
        expect(profileUser, 'configured Admin profile user').not.to.be.empty
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
    })

    ;[
        { name: 'Owned Measures', selector: MeasuresPage.ownedMeasures },
        { name: 'Shared Measures', selector: MeasuresPage.sharedMeasures }
    ].forEach(({ name, selector }) => {
        it(`disables measure actions when no ${name} are selected`, () => {
            cy.get(selector).click()
            cy.get(selector).should('have.attr', 'aria-selected', 'true')
            cy.get(AdminUserProfilePage.measuresTable).should('be.visible')

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
                AdminUserProfilePage.compareVersionsButton,
                AdminUserProfilePage.compareVersionsTooltip,
                'Select 2 instances within the same measure set to compare measure versions'
            )
            AdminUserProfilePage.assertDisabledAction(
                AdminUserProfilePage.historyButton,
                AdminUserProfilePage.historyTooltip,
                'Select a measure to view history'
            )
        })
    })

    it('opens Human Readable for one selected Owned Measure', () => {
        cy.get(MeasuresPage.ownedMeasures).click()
        AdminUserProfilePage.selectMeasureRow(0)

        cy.get(AdminUserProfilePage.humanReadableButton).should('be.enabled').click()
        cy.get(EditMeasurePage.humanReadablePopup).should('be.visible').and('contain.text', 'Human Readable')
    })

    it('opens Measure History for one selected Owned Measure', () => {
        cy.get(MeasuresPage.ownedMeasures).click()
        AdminUserProfilePage.selectMeasureRow(0)

        cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
        cy.get('[data-testid="measure-history-header"]').should('be.visible')
    })

    it('shows both export options for one selected Owned Measure', () => {
        cy.get(MeasuresPage.ownedMeasures).click()
        AdminUserProfilePage.selectMeasureRow(0)

        cy.get(AdminUserProfilePage.exportButton).should('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('be.visible').and('have.text', 'Export')
        cy.get(MeasuresPage.exportPublishingOption)
            .should('be.visible')
            .and('have.text', 'Export for Publishing')
    })

    it('exports one selected Owned Measure and records the Admin attribution', () => {
        cy.get(MeasuresPage.ownedMeasures).click()
        AdminUserProfilePage.selectMeasureByVersion('1.0.000')

        cy.get(AdminUserProfilePage.exportButton).should('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('be.visible').click()
        cy.get(MeasuresPage.exportingDialog).should('be.visible')
        cy.get(MeasuresPage.exportFinishedCheck, { timeout: 60000 }).should('be.visible')
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'EXPORTED_MEASURE')
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'by MADiE Admin')
    })

    it('exports one selected Owned Measure for publishing', () => {
        cy.get(MeasuresPage.ownedMeasures).click()
        AdminUserProfilePage.selectMeasureByVersion('1.0.000')

        cy.get(AdminUserProfilePage.exportButton).should('be.enabled').click()
        cy.get(MeasuresPage.exportPublishingOption).should('be.visible').click()
        cy.get(MeasuresPage.exportingDialog).should('be.visible')
        cy.get(MeasuresPage.exportFinishedCheck, { timeout: 60000 }).should('be.visible')
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
    })

})

describe.skip('Admin user profile unrelated Owned Measure selections', () => {
    let firstMeasureName = ''
    let secondMeasureName = ''
    let firstLibraryName = ''
    let secondLibraryName = ''
    let profileOwner = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        firstMeasureName = `AdminProfileUnrelatedOne${uniqueSuffix}`
        secondMeasureName = `AdminProfileUnrelatedTwo${uniqueSuffix}`
        firstLibraryName = `AdminProfileUnrelatedLibOne${uniqueSuffix}`
        secondLibraryName = `AdminProfileUnrelatedLibTwo${uniqueSuffix}`
        profileOwner = OktaLogin.getUser(false)

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

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileOwner)
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('updates actions when one and then two unrelated measures are selected', () => {
        AdminUserProfilePage.selectMeasureByName(firstMeasureName)

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
