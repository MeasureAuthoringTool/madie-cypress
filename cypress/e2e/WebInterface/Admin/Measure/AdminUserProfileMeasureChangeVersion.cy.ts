import { AdminUserProfilePage } from '../../../../Shared/AdminUserProfilePage'
import { CreateMeasurePage, SupportedCompositeModels, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { MeasureDraftBody, TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

const measureDisabledTooltip =
    'Select the latest version in a measure set that does not have a draft and is not a component of a composite measure to change version #'

describe('Admin user profile Change Version Measure action', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let owner = ''
    let sharedUser = ''
    let componentCompositeCreated = false
    let additionalVersionedMeasureNumbers: number[] = []

    const assertMeasureDisabled = (): void => {
        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.changeVersionButton,
            AdminUserProfilePage.changeVersionTooltip,
            measureDisabledTooltip
        )
    }

    const assertMeasureEnabled = (): void => {
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.changeVersionButton,
            AdminUserProfilePage.changeVersionTooltip,
            'Change Version #'
        )
    }

    const openProfile = (): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(owner)
        AdminUserProfilePage.submitMeasureSearch(measureName)
    }

    const openSharedProfile = (): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedUser)
        AdminUserProfilePage.openMeasuresTab(MeasuresPage.sharedMeasures)
        AdminUserProfilePage.submitMeasureSearch(measureName)
    }

    const createFinalVersion = (qdm = false): void => {
        const cql = qdm
            ? `library ${cqlLibraryName} version '0.0.000'\nusing QDM version '5.6'\n\nparameter \"Measurement Period\" Interval<DateTime>\ncontext Patient\ndefine \"ipp\":\n  true\ndefine \"d\":\n  true`
            : MeasureCQL.CQL_For_Cohort
        if (qdm) {
            CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI({
                ecqmTitle: measureName,
                cqlLibraryName,
                measureScoring: 'Cohort',
                patientBasis: 'true',
                measureCql: cql
            })
        } else {
            CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, cql)
        }
        TestData.saveMeasureCql(`${cql}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
            MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, qdm ? 'd' : undefined)
            TestData.versionMeasure().its('status').should('eq', 200)
        })
    }

    const createVersionAndDraft = (): void => {
        createFinalVersion()
        createDraftFromVersion(0, 1)
    }

    const createDraftFromVersion = (
        sourceMeasureNumber: number,
        draftMeasureNumber: number
    ): Cypress.Chainable<void> => {
        return TestData.readMeasure(sourceMeasureNumber)
            .then((measureResponse) => {
                const measure = measureResponse.body
                const draft: MeasureDraftBody = {
                    measureName,
                    cqlLibraryName,
                    model: measure.model,
                    createdBy: owner,
                    cql: measure.cql,
                    elmJson: measure.elmJson,
                    ecqmTitle: measure.ecqmTitle,
                    measurementPeriodStart: measure.measurementPeriodStart,
                    measurementPeriodEnd: measure.measurementPeriodEnd
                }
                return TestData.requestMeasureDraft(draft, sourceMeasureNumber).then((response) => {
                    expect(response.status).to.eq(201)
                    return TestData.writeFixture(`measureId${draftMeasureNumber}`, response.body.id)
                })
            })
            .then(() => undefined)
    }

    const createVersionHistory = (versionCount: number): Cypress.Chainable<void> => {
        createFinalVersion()

        const createNextVersion = (versionNumber: number): Cypress.Chainable<void> => {
            if (versionNumber === versionCount) {
                return cy.then(() => undefined)
            }

            return createDraftFromVersion(versionNumber - 1, versionNumber).then(() => {
                return TestData.versionMeasure('major', versionNumber).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.version).to.eq(`${versionNumber + 1}.0.000`)
                    if (versionNumber > 1) {
                        additionalVersionedMeasureNumbers.push(versionNumber)
                    }
                    return createNextVersion(versionNumber + 1)
                })
            })
        }

        return cy.then(() => createNextVersion(1))
    }

    const createCompositeComponent = (): void => {
        const componentCql = `library ${cqlLibraryName} version '0.0.000'
using QICore version '6.0.0'
include FHIRHelpers version '4.4.000' called FHIRHelpers
parameter "Measurement Period" Interval<DateTime>
context Patient
define "Initial Population":
  true
define "Denominator":
  "Initial Population"
define "Numerator":
  "Initial Population"`
        const compositeMeasureName = `${measureName}Composite`

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore6, {
            measureCql: componentCql,
            measureScoring: 'Proportion',
            patientBasis: 'boolean'
        })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Numerator',
            '',
            'Denominator',
            'boolean',
            1
        )
        TestData.saveMeasureCql(`${componentCql}\n`).then(TestData.expectSavedMeasureCql)
        TestData.versionMeasure().its('status').should('eq', 200)

        CreateMeasurePage.CreateCompositeMeasureAPI(
            compositeMeasureName,
            `${compositeMeasureName}Library`,
            SupportedCompositeModels.qiCore6,
            undefined,
            2
        )
        TestData.readMeasureId().then((componentMeasureId) => {
            TestData.readFixture('measureGroupId1').then((componentGroupId) => {
                TestData.requestMeasureGroup(
                    'POST',
                    {
                        scoring: 'Composite',
                        populations: [],
                        measureGroupTypes: ['Process'],
                        populationBasis: 'Boolean',
                        compositeScoring: 'Opportunity'
                    },
                    2
                ).then((response) => {
                    expect(response.status).to.eq(201)
                    TestData.requestMeasureGroup(
                        'PUT',
                        {
                            ...response.body,
                            components: [{ measureId: componentMeasureId, groupId: componentGroupId }]
                        },
                        2
                    )
                        .its('status')
                        .should('eq', 200)
                })
            })
        })
        componentCompositeCreated = true
    }

    const openEligibleMeasureDialog = (): void => {
        createFinalVersion()
        openProfile()
        AdminUserProfilePage.selectMeasureByName(measureName)
        assertMeasureEnabled()
        AdminUserProfilePage.openChangeVersionDialog()
    }

    beforeEach(() => {
        const suffix = Date.now()
        measureName = `AdminProfileChangeVersion${suffix}`
        cqlLibraryName = `${measureName}Library`
        owner = OktaLogin.getUser(false)
        sharedUser = OktaLogin.getUser(true)
        componentCompositeCreated = false
        additionalVersionedMeasureNumbers = []
    })

    afterEach(() => {
        const deleteAdditionalVersions = additionalVersionedMeasureNumbers
            .sort((left, right) => right - left)
            .reduce<Cypress.Chainable<void>>(
                (cleanup, measureNumber) =>
                    cleanup.then(() =>
                        Utilities.deleteVersionedMeasure(undefined, undefined, false, false, measureNumber)
                    ),
                cy.then(() => undefined)
            )

        return deleteAdditionalVersions
            .then(() =>
                componentCompositeCreated ? Utilities.deleteMeasure(undefined, undefined, false, false, 2) : undefined
            )
            .then(() => Utilities.deleteVersionedMeasure())
            .then(() => Utilities.deleteVersionedMeasure(undefined, undefined, false, false, 1))
            .then(() => Utilities.deleteMeasure())
            .then(() => Utilities.deleteMeasure(undefined, undefined, false, false, 1))
    })

    describe('disabled Change Version availability', () => {
        it('disables Change Version with no Measure selected', () => {
            createFinalVersion()
            openProfile()
            assertMeasureDisabled()
        })

        it('disables Change Version for a draft Measure', () => {
            createVersionAndDraft()
            openProfile()
            TestData.readMeasureId(1).then((draftId) => {
                AdminUserProfilePage.selectMeasureById(draftId)
            })
            assertMeasureDisabled()
        })

        it('disables Change Version for the latest Measure version when its set has a draft', () => {
            createVersionAndDraft()
            openProfile()
            TestData.readMeasureId(1).then((draftId) => {
                AdminUserProfilePage.expandMeasureSet(draftId)
                TestData.readMeasureId().then((versionedId) => {
                    AdminUserProfilePage.selectMeasureById(versionedId)
                })
            })
            assertMeasureDisabled()
        })

        it('disables Change Version for a historical Measure version', () => {
            createVersionHistory(2)
            openProfile()
            TestData.readMeasureId(1).then((latestVersionId) => {
                AdminUserProfilePage.expandMeasureSet(latestVersionId)
                TestData.readMeasureId().then((historicalVersionId) => {
                    AdminUserProfilePage.selectMeasureById(historicalVersionId)
                })
            })
            assertMeasureDisabled()
        })

        it('disables Change Version when multiple Measures are selected', () => {
            createVersionAndDraft()
            openProfile()
            TestData.readMeasureId(1).then((draftId) => {
                AdminUserProfilePage.selectMeasureById(draftId)
                AdminUserProfilePage.expandMeasureSet(draftId)
                TestData.readMeasureId().then((versionedId) => {
                    AdminUserProfilePage.selectMeasureById(versionedId)
                })
            })
            assertMeasureDisabled()
        })
    })

    describe('Change Version dialog', () => {
        it('displays the Change Version Measure dialog details', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.assertChangeVersionMeasureDetails(measureName, '1.0.000')
        })

        it('opens and closes the Measure Versions panel', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.openMeasureVersions(1)
            AdminUserProfilePage.closeMeasureVersions()
        })

        it('closes the Change Version Measure dialog when Cancel is clicked', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.cancelChangeVersion()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.assertChangeVersionCurrentVersion('1.0.000')
        })

        it('keeps the Change Version Measure dialog open when Save is clicked', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.saveChangeVersion('0.5.000')
            AdminUserProfilePage.assertChangeVersionCurrentVersion('1.0.000')
        })
    })

    describe('Measure Version history', () => {
        it('lists multiple Measure versions in descending version order', () => {
            createVersionHistory(2)
            openProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureEnabled()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.openMeasureVersions(2)
            AdminUserProfilePage.assertMeasureVersionsInOrder(['2.0.000 (Current)', '1.0.000'])
        })
    })

    describe('Measure Version history scrolling', () => {
        it('shows six Measure versions in a scrollable panel', () => {
            createVersionHistory(6)
            openProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureEnabled()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.openMeasureVersions(6)
            AdminUserProfilePage.assertMeasureVersionsScrollable('1.0.000')
        })
    })

    describe('additional Change Version availability', () => {
        it('enables Change Version for a latest Shared Measure', () => {
            createFinalVersion()
            TestData.readMeasureId().then((measureId) => {
                TestData.requestSharePermissions('measure', 'GRANT', measureId, sharedUser)
                    .its('status')
                    .should('eq', 200)
            })
            openSharedProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureEnabled()
        })

        it('enables Change Version for a latest QDM Measure', () => {
            createFinalVersion(true)
            openProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureEnabled()
        })

        it('disables Change Version for a QDM draft Measure', () => {
            CreateMeasurePage.CreateQDMMeasureAPI(
                measureName,
                cqlLibraryName,
                MeasureCQL.returnBooleanPatientBasedQDM_CQL
            )
            openProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureDisabled()
        })

        it('disables Change Version for a Measure that is a composite component', () => {
            createCompositeComponent()
            openProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureDisabled()
        })
    })
})
