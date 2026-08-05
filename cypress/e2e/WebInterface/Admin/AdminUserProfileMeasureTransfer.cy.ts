import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

const assertTransferDialog = (
    measureName: string,
    model: string,
    currentOwner: string,
    selectedMeasureCount = 1
): void => {
    cy.get('[role="dialog"]')
        .should('be.visible')
        .within(() => {
            cy.contains('h2', 'Transfer Measure Ownership').should('be.visible')
            cy.get('.transfer-dialog-info-text').should(
                'contain.text',
                `You are about to Transfer ownership of the ${selectedMeasureCount} selected measure(s) below. All versions and drafts will be transferred, but only the most recent measure name appears in the list below.`
            )
            ;['Measure', 'Model', 'CMS ID', 'Current Measure Owner'].forEach((columnName) => {
                cy.contains(columnName).should('be.visible')
            })

            cy.contains(measureName).should('be.visible')
            cy.contains(model).should('be.visible')
            cy.contains(currentOwner).should('be.visible')
            cy.contains('label', 'New Measure Owner').should('contain.text', '*')
            cy.get(MeasuresPage.newOwnerTextbox).should('be.visible').and('have.value', '')
            cy.get('[data-testid="retainShareAccess"] input[type="checkbox"]').should('not.be.checked')
            cy.contains('Retain Share Access after Transfer').should('be.visible')
            cy.contains('button', 'Cancel').should('be.enabled')
            cy.get(MeasuresPage.transferContinueButton).should('be.disabled')

            cy.get(MeasuresPage.paginationLimitSelect).should('contain.text', '5').click()
        })
    ;['5', '10', '25', '50'].forEach((pageSize) => {
        cy.get(`[role="option"][data-value="${pageSize}"]`).should('be.visible')
    })
    cy.get('body').type('{esc}')
}

// MAT-9815: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile Measure Transfer', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let measureOwner = ''
    let newOwner = ''
    let hasSecondMeasure = false

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileTransfer${uniqueSuffix}`
        cqlLibraryName = `AdminProfileTransferLib${uniqueSuffix}`
        measureOwner = OktaLogin.getUser(false)
        newOwner = OktaLogin.getUser(true)
        hasSecondMeasure = false
    })

    afterEach(() => {
        // Transfer changes the fixture owner, so use the admin deletion path for reliable cleanup.
        Utilities.deleteVersionedMeasure()
        if (hasSecondMeasure) {
            Utilities.deleteVersionedMeasure(undefined, undefined, false, false, 1)
        }
    })

    it('disables Transfer on Owned and Shared Measures when no measure is selected', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, newOwner).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Select a measure to transfer'
        )

        AdminUserProfilePage.openUserProfile(newOwner)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Select a measure to transfer'
        )
    })

    it('opens the Transfer dialog for an Owned QI-Core Measure and allows cancellation', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.selectMeasureByName(measureName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Transfer'
        )
        cy.get(AdminUserProfilePage.transferButton).click()

        assertTransferDialog(measureName, 'QI-Core', measureOwner)
        cy.get('[role="dialog"]').contains('button', 'Cancel').click()
        cy.get('[role="dialog"]').should('not.exist')
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, measureName).should('be.visible')
    })

    it('opens the Transfer dialog for a Shared QDM Measure with the actual owner', () => {
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, cqlLibraryName, MeasureCQL.returnBooleanPatientBasedQDM_CQL)
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, newOwner).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(newOwner)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.selectMeasureByName(measureName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.transferButton,
            AdminUserProfilePage.transferTooltip,
            'Transfer'
        )
        cy.get(AdminUserProfilePage.transferButton).click()

        assertTransferDialog(measureName, 'QDM', measureOwner)
    })

    it('lists multiple selected measures and their CMS ID in the Transfer dialog', () => {
        const secondMeasureName = measureName.replace('AdminProfileTransfer', 'AlternateProfileMeasure')
        const secondLibraryName = cqlLibraryName.replace('AdminProfileTransferLib', 'AlternateProfileLibrary')
        hasSecondMeasure = true

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        CreateMeasurePage.CreateQICoreMeasureAPI(secondMeasureName, secondLibraryName, MeasureCQL.CQL_For_Cohort, 1)
        TestData.readMeasureSetId().then((measureSetId) => {
            TestData.requestWithAccessToken<{ cmsId: string }>({
                method: 'PUT',
                url: `/api/measures/${measureSetId}/create-cms-id`
            }).then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.cmsId).to.exist
                cy.wrap(String(response.body.cmsId)).as('cmsId')
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.selectMeasureByName(measureName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled')
        AdminUserProfilePage.selectMeasureByName(secondMeasureName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        assertTransferDialog(measureName, 'QI-Core', measureOwner, 2)
        cy.get('[role="dialog"]').within(() => {
            cy.contains(secondMeasureName).should('be.visible')
            cy.contains('QI-Core').should('be.visible')
            cy.get<string>('@cmsId').then((cmsId) => {
                cy.contains(cmsId).should('be.visible')
            })
        })
    })

    it('transfers an Owned Measure to the selected user', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.selectMeasureByName(measureName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        cy.get(MeasuresPage.newOwnerTextbox).type(newOwner)
        cy.get(MeasuresPage.transferContinueButton).should('be.enabled')
        cy.intercept('PUT', '**/api/measures/transfer?retainShareAccess=false').as('transferMeasure')
        cy.get(MeasuresPage.transferContinueButton).click()
        cy.wait('@transferMeasure').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.headers.harpid).to.eq(newOwner)
            TestData.readMeasureId().then((measureId) => {
                expect(request.body).to.deep.eq([measureId])
            })
        })
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, measureName).should('not.exist')

        AdminUserProfilePage.openUserProfile(newOwner)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, measureName).should('be.visible')
    })

    it('transfers a Shared Measure and retains access for the former owner', () => {
        const sharedProfileUser = Environment.credentials().adminUser?.toLowerCase() ?? ''
        expect(sharedProfileUser, 'configured Admin profile user').not.to.be.empty

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, cqlLibraryName, MeasureCQL.returnBooleanPatientBasedQDM_CQL)
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, sharedProfileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.selectMeasureByName(measureName)
        cy.get(AdminUserProfilePage.transferButton).should('be.enabled').click()

        cy.get(MeasuresPage.newOwnerTextbox).type(newOwner)
        cy.get('[data-testid="retainShareAccess"] input[type="checkbox"]').check()
        cy.get(MeasuresPage.transferContinueButton).should('be.enabled')
        cy.intercept('PUT', '**/api/measures/transfer?retainShareAccess=true').as('transferSharedMeasure')
        cy.get(MeasuresPage.transferContinueButton).click()
        cy.wait('@transferSharedMeasure').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.headers.harpid).to.eq(newOwner)
            TestData.readMeasureId().then((measureId) => {
                expect(request.body).to.deep.eq([measureId])
            })
        })

        AdminUserProfilePage.openUserProfile(newOwner)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, measureName).should('be.visible')

        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, measureName).should('be.visible')
    })
})
