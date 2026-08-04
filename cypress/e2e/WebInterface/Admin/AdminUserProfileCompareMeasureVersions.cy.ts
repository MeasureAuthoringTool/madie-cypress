import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-9813: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile Compare Measure Versions', () => {
    let measureName = ''
    let draftMeasureName = ''
    let cqlLibraryName = ''
    let profileOwner = ''
    const measureCql = MeasureCQL.CQL_For_Cohort

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileCompare${uniqueSuffix}`
        draftMeasureName = `${measureName}Draft`
        cqlLibraryName = `AdminProfileCompareLib${uniqueSuffix}`
        profileOwner = OktaLogin.getUser(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCql)
        TestData.saveMeasureCql(`${measureCql}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        TestData.readMeasure().then((measureResponse) => {
            const measure = measureResponse.body

            TestData.versionMeasure().then((response) => {
                expect(response.status).to.eq(200)

                const draftBody: MeasureDraftBody = {
                    measureName: draftMeasureName,
                    cqlLibraryName,
                    model: measure.model,
                    createdBy: profileOwner,
                    cql: measure.cql,
                    elmJson: measure.elmJson,
                    ecqmTitle: measure.ecqmTitle,
                    measurementPeriodStart: measure.measurementPeriodStart,
                    measurementPeriodEnd: measure.measurementPeriodEnd
                }

                TestData.requestMeasureDraft(draftBody).then((draftResponse) => {
                    expect(draftResponse.status).to.eq(201)
                    TestData.writeFixture('measureId1', draftResponse.body.id)
                    TestData.readMeasure().then((versionResponse) => {
                        TestData.requestMeasureById('GET', draftResponse.body.id).then((createdDraftResponse) => {
                            expect(createdDraftResponse.body.measureSetId).to.eq(versionResponse.body.measureSetId)
                        })
                    })
                })
            })
        })

    })

    afterEach(() => {
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    const compareSelectedInstances = () => {
        TestData.readMeasureId(1).then((draftMeasureId) => {
            const draftRow = `[data-testid="measure-name-${draftMeasureId}_select"]`
            cy.get(draftRow).find('input[type="checkbox"]').should('be.visible').check()
            AdminUserProfilePage.expandMeasureSet(draftMeasureId)
                .find('input[type="checkbox"]')
                .should('be.visible')
                .check()
        })

        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.compareVersionsButton,
            AdminUserProfilePage.compareVersionsTooltip,
            'Compare Measure Versions'
        )
        cy.get(AdminUserProfilePage.compareVersionsButton).click()
        cy.contains('h2', 'Compare Measure Versions').should('be.visible')
        cy.get(MeasuresPage.compareVersionsCqlTab).should('be.visible')
        cy.get(MeasuresPage.compareVersionsHRTab).should('be.visible')
    }

    it('compares two API-created instances from the same Owned Measure set', () => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileOwner)
        cy.contains(profileOwner).should('be.visible')
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, draftMeasureName).should('be.visible')

        compareSelectedInstances()
    })

    it('compares two API-created instances from the same Shared Measure set', () => {
        const sharedProfileUser = OktaLogin.getUser(true)

        TestData.readMeasureId().then((versionMeasureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', versionMeasureId, sharedProfileUser).then(
                (response) => {
                    expect(response.status).to.eq(200)
                }
            )
        })
        TestData.readMeasureId(1).then((draftMeasureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', draftMeasureId, sharedProfileUser).then(
                (response) => {
                    expect(response.status).to.eq(200)
                }
            )
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, draftMeasureName).should('be.visible')

        compareSelectedInstances()
    })

    it('disables Compare when three instances from the same Owned Measure set are selected', () => {
        const secondDraftName = `${measureName}SecondDraft`

        TestData.versionMeasure('major', 1).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.version).to.eq('2.0.000')
        })
        TestData.readMeasureId(1).then((secondVersionId) => {
            TestData.requestMeasureById('GET', secondVersionId).then((secondVersionResponse) => {
                const secondVersion = secondVersionResponse.body
                const secondDraftBody: MeasureDraftBody = {
                    measureName: secondDraftName,
                    cqlLibraryName,
                    model: secondVersion.model,
                    createdBy: profileOwner,
                    cql: secondVersion.cql,
                    elmJson: secondVersion.elmJson,
                    ecqmTitle: secondVersion.ecqmTitle,
                    measurementPeriodStart: secondVersion.measurementPeriodStart,
                    measurementPeriodEnd: secondVersion.measurementPeriodEnd
                }

                TestData.requestMeasureDraft(secondDraftBody, 1).then((draftResponse) => {
                    expect(draftResponse.status).to.eq(201)
                    TestData.writeFixture('measureId2', draftResponse.body.id)
                })
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileOwner)
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody td`, secondDraftName).should('be.visible')

        TestData.readMeasureId(2).then((secondDraftId) => {
            const secondDraftRow = `[data-testid="measure-name-${secondDraftId}_select"]`
            cy.get(secondDraftRow).find('input[type="checkbox"]').should('be.visible').check()
            AdminUserProfilePage.expandMeasureSet(secondDraftId, 2)
                .find('input[type="checkbox"]')
                .should('have.length', 2)
                .check()
        })

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.compareVersionsButton,
            AdminUserProfilePage.compareVersionsTooltip,
            'Select 2 instances within the same measure set to compare measure versions'
        )
    })
})
