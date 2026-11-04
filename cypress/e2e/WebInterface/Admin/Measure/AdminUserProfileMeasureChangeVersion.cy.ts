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
    let versionedMeasureNumbers: number[] = []
    let draftMeasureNumbers: number[] = []

    const trackVersionedMeasure = (measureNumber: number): void => {
        draftMeasureNumbers = draftMeasureNumbers.filter((number) => number !== measureNumber)
        if (!versionedMeasureNumbers.includes(measureNumber)) {
            versionedMeasureNumbers.push(measureNumber)
        }
    }

    const trackDraftMeasure = (measureNumber: number): void => {
        if (!draftMeasureNumbers.includes(measureNumber)) {
            draftMeasureNumbers.push(measureNumber)
        }
    }

    const requireMeasureString = (value: string | undefined, fieldName: string): string => {
        expect(value, `source Measure ${fieldName}`).to.be.a('string').and.not.be.empty
        return value as string
    }

    const cleanupMeasures = (
        measureNumbers: number[],
        deleteMeasure: (measureNumber: number) => Cypress.Chainable<void>
    ): Cypress.Chainable<undefined> => {
        const orderedMeasureNumbers = [...measureNumbers].sort((left, right) => right - left)

        const deleteNextMeasure = (index: number): Cypress.Chainable<undefined> => {
            if (index === orderedMeasureNumbers.length) {
                return cy.then(() => undefined)
            }

            return deleteMeasure(orderedMeasureNumbers[index]).then(() => deleteNextMeasure(index + 1))
        }

        return deleteNextMeasure(0)
    }

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
        trackDraftMeasure(0)
        TestData.saveMeasureCql(`${cql}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
            MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, qdm ? 'd' : undefined)
            TestData.versionMeasure().then((versionResponse) => {
                expect(versionResponse.status).to.eq(200)
                trackVersionedMeasure(0)
            })
        })
    }

    const createVersionAndDraft = (): void => {
        createFinalVersion()
        createDraftFromVersion(0, 1)
    }

    const createDraftFromVersion = (
        sourceMeasureNumber: number,
        draftMeasureNumber: number
    ): Cypress.Chainable<null> => {
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
                    ecqmTitle: requireMeasureString(measure.ecqmTitle, 'eCQM title'),
                    measurementPeriodStart: requireMeasureString(measure.measurementPeriodStart, 'measurement period start'),
                    measurementPeriodEnd: requireMeasureString(measure.measurementPeriodEnd, 'measurement period end')
                }
                return TestData.requestMeasureDraft(draft, sourceMeasureNumber).then((response) => {
                    expect(response.status).to.eq(201)
                    trackDraftMeasure(draftMeasureNumber)
                    return TestData.writeFixture(`measureId${draftMeasureNumber}`, response.body.id)
                })
            })
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
                    trackVersionedMeasure(versionNumber)
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
        trackDraftMeasure(0)
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
        TestData.versionMeasure().then((versionResponse) => {
            expect(versionResponse.status).to.eq(200)
            trackVersionedMeasure(0)
        })

        CreateMeasurePage.CreateCompositeMeasureAPI(
            compositeMeasureName,
            `${compositeMeasureName}Library`,
            SupportedCompositeModels.qiCore6,
            undefined,
            2
        )
        trackDraftMeasure(2)
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
    }

    const openEligibleMeasureDialog = (): void => {
        createFinalVersion()
        openProfile()
        AdminUserProfilePage.selectMeasureByName(measureName)
        assertMeasureEnabled()
        AdminUserProfilePage.openChangeVersionDialog()
    }

    const openEligibleVersionHistoryDialog = (): void => {
        createVersionHistory(2)
        openProfile()
        AdminUserProfilePage.selectMeasureByName(measureName)
        assertMeasureEnabled()
        AdminUserProfilePage.openChangeVersionDialog()
    }

    const assertMeasureListVersion = (version: string): void => {
        cy.contains(`${AdminUserProfilePage.measuresTable} tbody tr`, measureName)
            .should('contain.text', version)
            .and('contain.text', 'Draft')
    }

    beforeEach(() => {
        const suffix = Date.now()
        measureName = `AdminProfileChangeVersion${suffix}`
        cqlLibraryName = `${measureName}Library`
        owner = OktaLogin.getUser(false)
        sharedUser = OktaLogin.getUser(true)
        versionedMeasureNumbers = []
        draftMeasureNumbers = []
    })

    afterEach(() => {
        return cleanupMeasures(draftMeasureNumbers, (measureNumber) =>
            Utilities.deleteMeasure(undefined, undefined, false, false, measureNumber)
        ).then(() =>
            cleanupMeasures(versionedMeasureNumbers, (measureNumber) =>
                Utilities.deleteVersionedMeasure(undefined, undefined, false, false, measureNumber)
            )
        )
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
    })

    describe('Change Version validation', () => {
        it('shows a required error and disables Save when New Version # loses focus empty', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.blurNewVersionNumber()
            AdminUserProfilePage.assertNewVersionValidationError('New version # is required.')
        })

        it('shows a format error and disables Save for an invalid New Version #', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.0.00')
            AdminUserProfilePage.assertNewVersionValidationError('New version must be in the format #.#.###')
        })

        it('shows a lower-version error and disables Save for the current Measure version', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.0.000')
            AdminUserProfilePage.assertNewVersionValidationError(
                'New version # must be lower than the intended final version number'
            )
        })

        it('shows a lower-version error and disables Save for a higher New Version #', () => {
            openEligibleMeasureDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('2.0.000')
            AdminUserProfilePage.assertNewVersionValidationError(
                'New version # must be lower than the intended final version number'
            )
        })

        it('shows a duplicate-version error and disables Save for a prior Measure version', () => {
            openEligibleVersionHistoryDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.0.000')
            AdminUserProfilePage.assertNewVersionValidationError(
                'New version # must not be one that has been used previously for this measure'
            )
        })

        it('enables Save for a lower unused New Version #', () => {
            openEligibleVersionHistoryDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.5.000')
            AdminUserProfilePage.assertChangeVersionSaveEnabled()
        })
    })

    describe('Change Version save', () => {
        it('reverts an Owned Measure version, refreshes the list, and records history', () => {
            openEligibleVersionHistoryDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.5.000')
            AdminUserProfilePage.assertChangeVersionSaveEnabled()
            cy.intercept('PUT', '**/api/admin/measures/*/correct-version*').as('correctMeasureVersion')
            cy.intercept('PUT', '**/api/admin/userProfile/*/measures/searches*').as('measureListRefresh')

            AdminUserProfilePage.submitChangeVersion()

            cy.wait('@correctMeasureVersion').then((interception) => {
                expect(interception.response?.statusCode).to.eq(200)
                expect(interception.request.query).to.include({
                    inCorrectVersion: '2.0.000',
                    draftVersion: '1.5.000'
                })
            })
            cy.get(AdminUserProfilePage.changeVersionSuccessToast)
                .should('be.visible')
                .and('contain.text', 'Version # changed successfully')
            AdminUserProfilePage.waitForMeasureListRefresh('@measureListRefresh')
            cy.get(AdminUserProfilePage.changeVersionDialog).should('not.exist')
            cy.get(MeasuresPage.ownedMeasures).should('have.attr', 'aria-selected', 'true')
            assertMeasureListVersion('1.5.000')
            TestData.readMeasure(1).then((response) => {
                expect(response.body.version).to.eq('1.5.000')
                expect(response.body.measureMetaData.draft).to.eq(true)
            })

            AdminUserProfilePage.selectMeasureByName(measureName)
            cy.get(AdminUserProfilePage.historyButton).should('be.enabled').click()
            cy.get(MeasuresPage.userActionRow).should('contain.text', 'VERSION_REVERT')
            cy.get(MeasuresPage.additionalActionRow).should(
                'contain.text',
                'Reverted from version 2.0.000 to 1.5.000 by MADiE Admin'
            )
        })

        it('returns to Shared Measures with the reverted draft version', () => {
            createVersionHistory(2)
            TestData.readMeasureId(1).then((measureId) => {
                TestData.requestSharePermissions('measure', 'GRANT', measureId, sharedUser)
                    .its('status')
                    .should('eq', 200)
            })
            openSharedProfile()
            AdminUserProfilePage.selectMeasureByName(measureName)
            assertMeasureEnabled()
            AdminUserProfilePage.openChangeVersionDialog()
            AdminUserProfilePage.enterNewVersionNumberAndBlur('1.5.000')
            AdminUserProfilePage.assertChangeVersionSaveEnabled()
            cy.intercept('PUT', '**/api/admin/measures/*/correct-version*').as('correctSharedMeasureVersion')
            cy.intercept('PUT', '**/api/admin/userProfile/*/measures/searches*').as('sharedMeasureListRefresh')

            AdminUserProfilePage.submitChangeVersion()

            cy.wait('@correctSharedMeasureVersion').its('response.statusCode').should('eq', 200)
            cy.get(AdminUserProfilePage.changeVersionSuccessToast)
                .should('be.visible')
                .and('contain.text', 'Version # changed successfully')
            AdminUserProfilePage.waitForMeasureListRefresh('@sharedMeasureListRefresh')
            cy.get(MeasuresPage.sharedMeasures).should('have.attr', 'aria-selected', 'true')
            assertMeasureListVersion('1.5.000')
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
            trackDraftMeasure(0)
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
