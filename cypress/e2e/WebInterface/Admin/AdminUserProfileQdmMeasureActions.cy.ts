import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'

// MAT-9813: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile QDM Measure actions', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let profileOwner = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileQdm${uniqueSuffix}`
        cqlLibraryName = `AdminProfileQdmLib${uniqueSuffix}`
        profileOwner = OktaLogin.getUser(false)

        CreateMeasurePage.CreateQDMMeasureAPI(
            measureName,
            cqlLibraryName,
            MeasureCQL.returnBooleanPatientBasedQDM_CQL
        )

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileOwner)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.ownedMeasures)
        AdminUserProfilePage.selectMeasureByName(measureName)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody tr`, measureName)
            .should('be.visible')
            .and('contain.text', 'QDM')
    })

    afterEach(() => {
        Utilities.deleteMeasure()
    })

    it('enables QDM single-measure actions and shows both export options', () => {
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

        cy.get(AdminUserProfilePage.exportButton).click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('be.visible').and('have.text', 'Export')
        cy.get(MeasuresPage.exportPublishingOption)
            .should('be.visible')
            .and('have.text', 'Export for Publishing')
    })

    it('opens Human Readable for a QDM Measure', () => {
        cy.get(AdminUserProfilePage.humanReadableButton).should('be.enabled').click()
        cy.get(EditMeasurePage.humanReadablePopup).should('be.visible').and('contain.text', 'Human Readable')
    })

    it('opens Measure History for a QDM Measure', () => {
        cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
        cy.get('[data-testid="measure-history-header"]').should('be.visible')
    })
})
