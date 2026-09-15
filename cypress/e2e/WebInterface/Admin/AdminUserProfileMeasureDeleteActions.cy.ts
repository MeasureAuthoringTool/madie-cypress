import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

describe('Admin user profile measure delete action states', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let measureOwner = ''
    let profileUser = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        measureName = `AdminProfileMeasureDeleteActions${uniqueSuffix}`
        cqlLibraryName = `AdminProfileMeasureDeleteActionsLib${uniqueSuffix}`
        measureOwner = OktaLogin.getUser(false)
        profileUser = Environment.credentials().altHarpUser?.toLowerCase() ?? ''
        expect(profileUser, 'shared profile user').not.to.be.empty
        expect(profileUser, 'shared profile user differs from measure owner').not.to.eq(measureOwner)
    })

    afterEach(() => {
        Utilities.deleteVersionedMeasure()
        Utilities.deleteVersionedMeasure(undefined, undefined, false, false, 1)
        Utilities.deleteMeasure()
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    const assertDeleteDisabled = (): void => {
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Select measure to delete'
        )
    }

    const assertDeleteEnabled = (): void => {
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.deleteButton,
            AdminUserProfilePage.deleteTooltip,
            'Delete measure'
        )
    }

    const createDraftAndVersion = (): void => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((saveResponse) => {
            TestData.expectSavedMeasureCql(saveResponse)
            MeasureGroupPage.CreateCohortMeasureGroupAPI()
            TestData.readMeasure().then((measureResponse) => {
                const measure = measureResponse.body
                TestData.versionMeasure().then((response) => {
                    expect(response.status).to.eq(200)
                    const draftBody: MeasureDraftBody = {
                        measureName,
                        cqlLibraryName,
                        model: measure.model,
                        createdBy: measureOwner,
                        cql: measure.cql,
                        elmJson: measure.elmJson,
                        ecqmTitle: measure.ecqmTitle,
                        measurementPeriodStart: measure.measurementPeriodStart,
                        measurementPeriodEnd: measure.measurementPeriodEnd
                    }
                    TestData.requestMeasureDraft(draftBody).then((draftResponse) => {
                        expect(draftResponse.status).to.eq(201)
                        TestData.writeFixture('measureId1', draftResponse.body.id)
                    })
                })
            })
        })
    }

    it('disables Delete with no selection on Owned and Shared Measures', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        TestData.readMeasureId().then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        assertDeleteDisabled()

        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        assertDeleteDisabled()
    })

    it('enables Delete for the latest draft and disables it for an expanded historical version', () => {
        createDraftAndVersion()

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.submitMeasureSearch(measureName)
        TestData.readMeasureId(1).then((draftMeasureId) => {
            cy.get(`[data-testid="measure-name-${draftMeasureId}_select"]`)
                .find('input[type="checkbox"]')
                .should('be.visible')
                .check()
        })
        assertDeleteEnabled()

        TestData.readMeasureId(1).then((draftMeasureId) => {
            cy.get(`[data-testid="measure-name-${draftMeasureId}_select"]`).find('input[type="checkbox"]').uncheck()
            AdminUserProfilePage.expandMeasureSet(draftMeasureId)
                .find('input[type="checkbox"]')
                .should('have.length', 1)
                .check()
        })
        assertDeleteDisabled()
    })

    it('enables Delete for the latest version on Owned and Shared Measures', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
        TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((saveResponse) => {
            TestData.expectSavedMeasureCql(saveResponse)
            MeasureGroupPage.CreateCohortMeasureGroupAPI()
            TestData.versionMeasure().then((response) => {
                expect(response.status).to.eq(200)
                TestData.readMeasureId().then((measureId) => {
                    TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then(
                        (shareResponse) => {
                            expect(shareResponse.status).to.eq(200)
                        }
                    )
                })
            })
        })

        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(measureOwner)
        AdminUserProfilePage.submitMeasureSearch(measureName)
        AdminUserProfilePage.selectMeasureByName(measureName)
        assertDeleteEnabled()

        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.submitMeasureSearch(measureName)
        AdminUserProfilePage.selectMeasureByName(measureName)
        assertDeleteEnabled()
    })
    ;[
        { name: 'Owned', tab: MeasuresPage.ownedMeasures },
        { name: 'Shared', tab: MeasuresPage.sharedMeasures }
    ].forEach(({ name, tab }) => {
        it(`disables Delete when multiple ${name} Measures are selected`, () => {
            const firstMeasureName = `${measureName}One`
            const secondMeasureName = `${measureName}Two`
            CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, cqlLibraryName, MeasureCQL.CQL_For_Cohort)
            CreateMeasurePage.CreateQICoreMeasureAPI(
                secondMeasureName,
                `${cqlLibraryName}Second`,
                MeasureCQL.CQL_For_Cohort,
                1
            )

            if (name === 'Shared') {
                ;[0, 1].forEach((measureNumber) => {
                    TestData.readMeasureId(measureNumber).then((measureId) => {
                        TestData.requestSharePermissions('measure', 'GRANT', measureId, profileUser).then(
                            (response) => {
                                expect(response.status).to.eq(200)
                            }
                        )
                    })
                })
            }

            OktaLogin.AdminLogin()
            const profileHarpId = name === 'Shared' ? profileUser : measureOwner
            AdminUserProfilePage.openUserProfile(profileHarpId)
            if (name === 'Shared') {
                AdminUserProfilePage.openMeasuresTab(tab)
            }
            AdminUserProfilePage.submitMeasureSearch(measureName)
            TestData.readMeasureId().then((firstMeasureId) => {
                AdminUserProfilePage.selectMeasureById(firstMeasureId).should('be.checked')
            })
            TestData.readMeasureId(1).then((secondMeasureId) => {
                AdminUserProfilePage.selectMeasureById(secondMeasureId).should('be.checked')
            })
            assertDeleteDisabled()
        })
    })
})
