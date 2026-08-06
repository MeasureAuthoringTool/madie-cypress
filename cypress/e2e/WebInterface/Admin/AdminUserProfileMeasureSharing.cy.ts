import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

const describeAdminUserProfile = Cypress.env('environment') === 'test' ? describe.skip : describe

const assertShareDialogControls = (title: string, instructions: string[]): void => {
    cy.get('[role="dialog"]')
        .should('be.visible')
        .within(() => {
            cy.contains('h2', title).should('be.visible')
            instructions.forEach((instruction) => cy.contains(instruction).should('be.visible'))
            cy.contains('Export User List').should('be.visible')
            ;['Measure', 'Shared With', 'Date Shared'].forEach((column) => {
                cy.contains(column).should('be.visible')
            })
            cy.contains('button', 'Cancel').should('be.enabled')
            cy.get(EditMeasurePage.saveUserBtn).should('be.visible')
        })
}

// MAT-9814: AdminUserProfile is proven in DEV but is not yet available in TEST.
describeAdminUserProfile('Admin user profile Measure Sharing and Unsharing', () => {
    let qicoreMeasureName = ''
    let qdmMeasureName = ''
    let qicoreLibraryName = ''
    let qdmLibraryName = ''
    let measureOwner = ''
    let sharedProfileUser = ''

    const createMeasures = (): void => {
        CreateMeasurePage.CreateQICoreMeasureAPI(
            qicoreMeasureName,
            qicoreLibraryName,
            MeasureCQL.CQL_For_Cohort
        )
        CreateMeasurePage.CreateQDMMeasureAPI(
            qdmMeasureName,
            qdmLibraryName,
            MeasureCQL.returnBooleanPatientBasedQDM_CQL,
            false,
            false,
            undefined,
            undefined,
            1
        )
    }

    const shareMeasuresWithProfileUser = (): void => {
        ;[0, 1].forEach((measureNumber) => {
            TestData.readMeasureId(measureNumber).then((measureId) => {
                TestData.requestSharePermissions('measure', 'GRANT', measureId, sharedProfileUser).then(
                    (response) => {
                        expect(response.status).to.eq(200)
                    }
                )
            })
        })
    }

    const selectBothMeasures = (): void => {
        AdminUserProfilePage.selectMeasureByName(qicoreMeasureName)
        AdminUserProfilePage.selectMeasureByName(qdmMeasureName)
    }

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        qicoreMeasureName = `AdminProfileShareQiCore${uniqueSuffix}`
        qdmMeasureName = `AdminProfileShareQdm${uniqueSuffix}`
        qicoreLibraryName = `AdminProfileShareQiCoreLib${uniqueSuffix}`
        qdmLibraryName = `AdminProfileShareQdmLib${uniqueSuffix}`
        measureOwner = OktaLogin.getUser(false)
        sharedProfileUser = OktaLogin.getUser(true)
        createMeasures()
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('shows the correct Owned Measures action states, menu, and dialogs', () => {
        shareMeasuresWithProfileUser()
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Select a measure to share/unshare'
        )

        selectBothMeasures()
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Share/Unshare'
        )
        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(EditMeasurePage.shareOption).should('be.visible').and('have.text', 'Share With')
        cy.get(EditMeasurePage.unshareOption).should('be.visible').and('have.text', 'Unshare')

        cy.get(EditMeasurePage.shareOption).click()
        cy.get('[role="dialog"]')
            .should('be.visible')
            .within(() => {
                cy.contains('h2', 'Share With').should('be.visible')
                cy.contains(
                    'Please note: When sharing a measure, all versions and drafts are shared, but only the most recent measure name appears below.'
                ).should('be.visible')
                cy.get(EditMeasurePage.harpIdInputTextBox).should('be.visible')
                cy.get(EditMeasurePage.addBtn).should('be.visible')
                cy.contains('Export User List').should('be.visible')
                ;['Measure', 'Shared With', 'Date Shared'].forEach((column) => {
                    cy.contains(column).should('be.visible')
                })
                cy.contains(qicoreMeasureName).should('be.visible')
                cy.contains(qdmMeasureName).should('be.visible')
                cy.contains(sharedProfileUser).should('be.visible')
                cy.contains('button', 'Cancel').should('be.enabled').click()
            })
        cy.get('[role="dialog"]').should('not.exist')

        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(EditMeasurePage.unshareOption).should('be.visible').click()
        assertShareDialogControls('Unshare From', [
            'Please note: When sharing a measure, all versions and drafts are shared, but only the most recent measure name appears below.',
            "To unshare this measure, deselect the usernames from whom you want to unshare the measure(s), then click the 'Unshare' button."
        ])
        cy.get('[role="dialog"]').within(() => {
            cy.contains(qicoreMeasureName).should('be.visible')
            cy.contains(qdmMeasureName).should('be.visible')
            cy.contains(sharedProfileUser).should('be.visible')
            cy.get('input[type="checkbox"]').should('have.length.at.least', 2).and('be.checked')
            cy.contains('button', 'Cancel').click()
        })
        cy.get('[role="dialog"]').should('not.exist')
    })

    it('shares selected Owned QI-Core and QDM Measures with a user', () => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        selectBothMeasures()
        cy.get(AdminUserProfilePage.shareButton).should('be.enabled').click()
        cy.get(EditMeasurePage.shareOption).should('be.visible').click()

        cy.get(EditMeasurePage.harpIdInputTextBox).type(sharedProfileUser)
        cy.get(EditMeasurePage.addBtn).should('be.enabled').click()
        cy.get(EditMeasurePage.sharedUserTable).should('contain.text', sharedProfileUser)
        cy.intercept('PUT', '**/api/measures/shared').as('shareMeasures')
        cy.get(EditMeasurePage.saveUserBtn).should('be.enabled').click()
        cy.wait('@shareMeasures').its('response.statusCode').should('eq', 200)
        cy.get(EditMeasurePage.successMessage).should(
            'contain.text',
            'The measure(s) were successfully shared'
        )

        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qicoreMeasureName).should(
            'be.visible'
        )
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qdmMeasureName).should(
            'be.visible'
        )
    })

    it('unshares selected Owned QI-Core and QDM Measures from a user', () => {
        shareMeasuresWithProfileUser()
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        selectBothMeasures()
        cy.get(AdminUserProfilePage.shareButton).should('be.enabled').click()
        cy.get(EditMeasurePage.unshareOption).should('be.visible').click()

        cy.get('[role="dialog"]').within(() => {
            cy.get('input[type="checkbox"]:checked').uncheck()
        })
        cy.intercept('PUT', '**/api/measures/unshared').as('unshareMeasures')
        cy.get(EditMeasurePage.saveUserBtn).should('be.enabled').click()
        cy.get(EditMeasurePage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareMeasures').its('response.statusCode').should('eq', 200)
        cy.get(EditMeasurePage.successMessage).should(
            'contain.text',
            'The measure(s) were successfully unshared.'
        )

        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qicoreMeasureName).should(
            'not.exist'
        )
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qdmMeasureName).should(
            'not.exist'
        )
    })

    it('shows Shared Measures Unshare states and unshares only from the selected profile user', () => {
        shareMeasuresWithProfileUser()
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Select a measure to unshare'
        )
        selectBothMeasures()
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Unshare'
        )
        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(EditMeasurePage.unshareOption).should('be.visible').and('have.text', 'Unshare')
        cy.get(EditMeasurePage.shareOption).should('not.exist')
        cy.get(EditMeasurePage.unshareOption).then(($option) => {
            $option[0].click()
        })

        cy.get(EditMeasurePage.acceptBtn)
            .should('be.visible')
            .closest('.MuiDialog-paper')
            .within(() => {
                cy.contains('h2', 'Are you sure?').should('be.visible')
                cy.contains('You are about to unshare').should('be.visible')
                cy.contains(qicoreMeasureName).should('be.visible')
                cy.contains(qdmMeasureName).should('be.visible')
                cy.get('li').filter(`:contains("${sharedProfileUser}")`).should('have.length', 2)
                cy.contains('button', 'Cancel').should('be.enabled')
                cy.get(EditMeasurePage.acceptBtn).should('be.enabled')
            })

        cy.intercept('PUT', '**/api/measures/unshared').as('unshareSharedMeasures')
        cy.get(EditMeasurePage.acceptBtn).click()
        cy.wait('@unshareSharedMeasures').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            TestData.readMeasureId(0).then((qicoreMeasureId) => {
                expect(request.body[qicoreMeasureId]).to.deep.eq([sharedProfileUser])
            })
            TestData.readMeasureId(1).then((qdmMeasureId) => {
                expect(request.body[qdmMeasureId]).to.deep.eq([sharedProfileUser])
            })
        })
        cy.get(EditMeasurePage.successMessage).should(
            'contain.text',
            'The measure(s) were successfully unshared.'
        )
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qicoreMeasureName).should(
            'not.exist'
        )
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, qdmMeasureName).should(
            'not.exist'
        )
    })
})
