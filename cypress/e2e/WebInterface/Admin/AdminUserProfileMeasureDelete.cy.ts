import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { CreateMeasureOptions, CreateMeasurePage, SupportedCompositeModels } from '../../../Shared/CreateMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { QdmCql } from '../../../Shared/QDMMeasuresCQL'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

const deleteMeasureDialog = '[role="dialog"]'

const assertDeleteDialog = (message: string): void => {
    cy.get(deleteMeasureDialog)
        .should('be.visible')
        .within(() => {
            cy.contains('h2', 'Delete Measure').should('be.visible')
            cy.contains(message).should('be.visible')
            cy.get(CQLEditorPage.modalActionWarning)
                .should('be.visible')
                .and('contain.text', 'This action cannot be undone.')
            cy.get('hr').should('have.length.at.least', 2)
            cy.contains('button', 'Cancel').should('be.enabled')
            cy.get(CQLEditorPage.deleteContinueButton)
                .should('be.enabled')
                .and('contain.text', 'Yes, Delete')
                .should(($button) => {
                    const [red, green, blue] =
                        getComputedStyle($button[0]).backgroundColor.match(/\d+/g)?.map(Number) ?? []
                    expect(red, 'destructive button red channel').to.be.greaterThan(green)
                    expect(red, 'destructive button red channel').to.be.greaterThan(blue)
                })
        })
}

describe('Admin user profile measure deletion', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let measureOwner = ''
    let profileUser = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileMeasureDelete${uniqueSuffix}`
        cqlLibraryName = `AdminProfileMeasureDeleteLib${uniqueSuffix}`
        measureOwner = OktaLogin.getUser(false)
        profileUser = Environment.credentials().altHarpUser?.toLowerCase() ?? ''
        expect(profileUser, 'shared profile user').not.to.be.empty
        expect(profileUser, 'shared profile user differs from measure owner').not.to.eq(measureOwner)
    })

    afterEach(() => {
        Utilities.deleteVersionedMeasure()
        Utilities.deleteMeasure()
    })

    const openDeleteDialog = (profile: string, tab: string, expectedMessage: string): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profile)
        AdminUserProfilePage.openMeasuresTab(tab)
        AdminUserProfilePage.selectMeasureByName(measureName)
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete measure'
        )
        cy.get(AdminUserProfilePage.deleteButton).click()
        assertDeleteDialog(expectedMessage)
    }

    const versionCurrentMeasure = (): void => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.version).to.eq('1.0.000')
        })
    }

    it('deletes an Owned QI-Core draft measure through the regular delete endpoint', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)

        openDeleteDialog(
            measureOwner,
            MeasuresPage.ownedMeasures,
            `Are you sure you want to delete draft of ${measureName}`
        )
        cy.intercept('DELETE', '**/api/measures/*/delete').as('deleteDraft')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.wait('@deleteDraft').its('response.statusCode').should('eq', 200)
        cy.get(AdminUserProfilePage.measuresTable).should('not.contain.text', measureName)
    })

    it('deletes a Shared QDM version through the admin endpoint using the measure owner HARP ID', () => {
        const measureData: CreateMeasureOptions = {
            measureCql: QdmCql.simpleQDM_CQL,
            ecqmTitle: measureName,
            cqlLibraryName,
            measureScoring: 'Cohort',
            patientBasis: 'true'
        }
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'd')
        TestData.saveMeasureCql(`${QdmCql.simpleQDM_CQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        versionCurrentMeasure()
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        openDeleteDialog(
            profileUser,
            MeasuresPage.sharedMeasures,
            `Are you sure you want to delete version 1.0.000 of ${measureName}`
        )
        cy.intercept('DELETE', '**/api/admin/measures/*').as('deleteVersion')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.wait('@deleteVersion').then(({ request, response }) => {
            expect(request.headers.harpid).to.eq(measureOwner)
            expect(response?.statusCode).to.eq(200)
        })
        cy.get(AdminUserProfilePage.measuresTable).should('not.contain.text', measureName)
    })

    it('deletes an Owned composite draft measure', () => {
        CreateMeasurePage.CreateCompositeMeasureAPI(measureName, cqlLibraryName, SupportedCompositeModels.qiCore6)

        openDeleteDialog(
            measureOwner,
            MeasuresPage.ownedMeasures,
            `Are you sure you want to delete draft of ${measureName}`
        )
        cy.intercept('DELETE', '**/api/measures/*/delete').as('deleteCompositeDraft')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.wait('@deleteCompositeDraft').its('response.statusCode').should('eq', 200)
        cy.get(AdminUserProfilePage.measuresTable).should('not.contain.text', measureName)
    })
    ;[
        { name: 'Cancel', close: () => cy.get(deleteMeasureDialog).contains('button', 'Cancel').click() },
        { name: 'the dialog X', close: () => cy.get(deleteMeasureDialog).find(CQLEditorPage.modalXButton).click() }
    ].forEach(({ name, close }) => {
        it(`does not delete an Owned draft measure when using ${name}`, () => {
            CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
            openDeleteDialog(
                measureOwner,
                MeasuresPage.ownedMeasures,
                `Are you sure you want to delete draft of ${measureName}`
            )
            cy.intercept('DELETE', '**/api/measures/*/delete').as('deleteMeasure')

            close()
            cy.get(deleteMeasureDialog).should('not.exist')
            cy.get('@deleteMeasure.all').should('have.length', 0)
            AdminUserProfilePage.findMeasureRow(measureName).should('be.visible')
        })
    })
})
