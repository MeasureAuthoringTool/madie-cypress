import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MadieObject, Utilities } from '../../../Shared/Utilities'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'

// MAT-9820: AdminUserProfile is not yet available in TEST; prove this coverage in DEV first.
const describeAdminUserProfile = describe.skip

describeAdminUserProfile('Admin user profile measure View and Edit navigation', () => {
    let measureName = ''
    let libraryName = ''
    let measureOwner = ''
    let sharedProfileUser = ''
    let adminUser = ''
    let measureCreated = false
    let measureLocked = false
    let measureVersioned = false
    let createdMeasureId = ''

    const createDraftMeasure = (): void => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libraryName, MeasureCQL.CQL_For_Cohort)
        measureCreated = true
    }

    const captureCreatedMeasureId = (): void => {
        TestData.readMeasureId().then((measureId) => {
            createdMeasureId = measureId
        })
    }

    const shareMeasureWith = (user: string): void => {
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, user).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    }

    const openProfileMeasure = (profileUser: string, tab = MeasuresPage.ownedMeasures): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        if (tab === MeasuresPage.sharedMeasures) {
            AdminUserProfilePage.openMeasuresTab(tab)
        }
        AdminUserProfilePage.findMeasureRow(measureName).should('be.visible')
    }

    const findCreatedMeasureAction = (): Cypress.Chainable<JQuery<HTMLElement>> => {
        return cy.then(() => {
            expect(createdMeasureId, 'created measure ID').not.to.be.empty
            return AdminUserProfilePage.findMeasureAction(createdMeasureId)
        })
    }

    const assertMeasureDetailMode = (expectedMode: 'view' | 'edit'): void => {
        cy.then(() => {
            expect(createdMeasureId, 'created measure ID').not.to.be.empty
            cy.location('pathname').should('contain', `/measures/${createdMeasureId}/edit/details`)
        })

        if (expectedMode === 'view') {
            cy.get(EditMeasurePage.readOnlyMeasureName).should('be.visible')
        } else {
            cy.get(EditMeasurePage.measureNameTextBox).should('be.visible').and('be.enabled')
        }
    }

    beforeEach(() => {
        const suffix = Date.now()
        measureName = `AdminProfileViewEdit${suffix}`
        libraryName = `AdminProfileViewEditLib${suffix}`
        measureOwner = OktaLogin.getUser(false)
        sharedProfileUser = OktaLogin.getUser(true)
        adminUser = Environment.credentials().adminUser?.toLowerCase() ?? ''
        expect(adminUser, 'configured admin user').not.to.be.empty
        measureCreated = false
        measureLocked = false
        measureVersioned = false
        createdMeasureId = ''
    })

    afterEach(() => {
        if (measureLocked) {
            Utilities.releaseAllLocksForCleanup(MadieObject.Measure, true)
        }
        if (measureVersioned) {
            Utilities.deleteVersionedMeasure(measureName, libraryName)
        } else if (measureCreated) {
            Utilities.deleteMeasure()
        }
    })

    it('opens an unshared draft from Owned Measures in read-only View mode', () => {
        createDraftMeasure()
        captureCreatedMeasureId()
        openProfileMeasure(measureOwner)

        findCreatedMeasureAction().should('have.text', 'View').click()
        assertMeasureDetailMode('view')
    })

    it('opens an admin-shared draft from Owned Measures in Edit mode', () => {
        createDraftMeasure()
        captureCreatedMeasureId()
        shareMeasureWith(adminUser)
        openProfileMeasure(measureOwner)

        findCreatedMeasureAction().should('have.text', 'Edit').click()
        assertMeasureDetailMode('edit')
    })

    it('opens an admin-shared draft from Shared Measures in Edit mode', () => {
        createDraftMeasure()
        captureCreatedMeasureId()
        shareMeasureWith(adminUser)
        shareMeasureWith(sharedProfileUser)
        openProfileMeasure(sharedProfileUser, MeasuresPage.sharedMeasures)

        findCreatedMeasureAction().should('have.text', 'Edit').click()
        assertMeasureDetailMode('edit')
    })

    it('opens a measure locked by another user from Owned Measures in read-only View mode', () => {
        createDraftMeasure()
        captureCreatedMeasureId()
        shareMeasureWith(adminUser)
        shareMeasureWith(sharedProfileUser)
        Utilities.lockSharedMeasure(true)
        measureLocked = true

        openProfileMeasure(measureOwner)

        findCreatedMeasureAction().should('have.text', 'View')
        cy.then(() => {
            expect(createdMeasureId, 'created measure ID').not.to.be.empty
            cy.get(`[data-testid="measure-lock-icon-${createdMeasureId}"]`).should('be.visible')
        })
        findCreatedMeasureAction().click()
        cy.then(() => {
            cy.location('pathname').should('contain', `/measures/${createdMeasureId}/edit`)
        })
        cy.get(EditMeasurePage.measureLockedModalMessage)
            .should('be.visible')
            .and('contain.text', 'You will be unable to make changes at this time.')
    })

    it('opens a versioned measure from Owned Measures in read-only View mode', () => {
        createDraftMeasure()
        captureCreatedMeasureId()
        TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eq(200)
            measureVersioned = true
        })

        openProfileMeasure(measureOwner)

        findCreatedMeasureAction().should('have.text', 'View').click()
        assertMeasureDetailMode('view')
    })
})
