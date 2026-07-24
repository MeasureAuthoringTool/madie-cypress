import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MadieObject, PermissionActions, Utilities } from '../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { QiCore4Cql, QiCore6Cql } from '../../../../Shared/FHIRMeasuresCQL'
import { TestCase, TestCasesPage } from '../../../../Shared/TestCasesPage'
import { Header } from '../../../../Shared/Header'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { TestData } from '../../../../Shared/TestData'
import { LockedEntityValidation } from '../../../../Shared/LockedEntityValidation'
import { step } from '../../../../utils/step'

const qicoreMeasureCql = QiCore6Cql.cqlCMS1272
const qicorePopulationCql = QiCore4Cql.CQL_Populations
const testCase: TestCase = {
    title: 'Locked tooltip test case',
    group: 'PASS',
    description: 'Used for locked test case tooltip coverage'
}

let harpUserALT = ''
let qicoreMeasureName = ''
let qicoreLibraryName = ''
let createdMeasure = false
let createdLibrary = false

const openLockedMeasureInView = (): void => {
    step('Open locked measure in view mode')
    MeasuresPage.actionCenter('view')
}

const openLockedTestCaseInView = (): void => {
    step('Open locked test case in view mode')
    MeasuresPage.actionCenter('edit')
    TestCasesPage.clickEditforCreatedTestCase()
}

const openLockedLibraryInView = (): void => {
    step('Open locked library in view mode')
    CQLLibrariesPage.clickViewforCreatedLibrary()
}

describe('Locked Measure, Library, and Test Case tooltips display user name', () => {
    beforeEach(() => {
        harpUserALT = OktaLogin.getUser(true)
        qicoreMeasureName = `LockTooltipMeasure${Date.now()}`
        qicoreLibraryName = `LockTooltipLibrary${Date.now()}`
        createdMeasure = false
        createdLibrary = false
    })

    afterEach(() => {
        if (createdMeasure) {
            Utilities.verifyAllLocksDeleted(MadieObject.Measure, true)
            Utilities.deleteMeasure()
        }

        if (createdLibrary) {
            Utilities.verifyAllLocksDeleted(MadieObject.Library, true)
            Utilities.verifyAllLocksDeleted(MadieObject.Library)
            Utilities.deleteLibrary()
        }
    })

    describe('Measure list View tooltip', () => {
        beforeEach(() => {
            step('Create locked measure')
            CreateMeasurePage.CreateMeasureAPI(qicoreMeasureName, qicoreMeasureName, SupportedModels.qiCore6, {
                measureCql: qicoreMeasureCql
            })
            createdMeasure = true
            TestData.readMeasureId().should('exist')

            step('Share measure with alt user')
            Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

            step('Lock measure as alt user')
            Utilities.lockControl(MadieObject.Measure, true, true)

            step('Login to MADiE')
            OktaLogin.Login()

            step('Wait for measures list')
            Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
            cy.get(MeasuresPage.allMeasuresTab).click()
            Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        })

        it('includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)

                TestData.readMeasureId().then((measureId) => {
                    const buttonSelector = MeasuresPage.getMeasureActionSelector(measureId)

                    cy.get(buttonSelector).should('contain.text', 'View')
                    cy.get(buttonSelector).trigger('mouseover', { force: true })
                    LockedEntityValidation.assertVisibleTooltipText(expectedTooltip)
                })
            })
        })
    })

    describe('Locked measure view experience', () => {
        beforeEach(() => {
            step('Create locked measure for view experience')
            CreateMeasurePage.CreateMeasureAPI(qicoreMeasureName, qicoreMeasureName, SupportedModels.qiCore6, {
                measureCql: qicoreMeasureCql
            })
            createdMeasure = true
            Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
            Utilities.lockSharedMeasure(true)
            OktaLogin.Login()
        })

        it('shows the locked modal, closes with X, and keeps the In-Use tooltip available', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'measure',
                    displayName,
                    harpUserALT
                )

                openLockedMeasureInView()
                EditMeasurePage.dismissMeasureLockedModal(expectedModalMessage, 'x')
            })
        })

        it('shows the locked modal, closes with Close button, and keeps the In-Use tooltip available', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'measure',
                    displayName,
                    harpUserALT
                )

                openLockedMeasureInView()
                EditMeasurePage.dismissMeasureLockedModal(expectedModalMessage, 'button')
            })
        })

        it('Locked measure header In-Use tooltip includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'measure',
                    displayName,
                    harpUserALT
                )

                openLockedMeasureInView()
                EditMeasurePage.dismissMeasureLockedModal(expectedModalMessage)

                step('Assert locked measure header In-Use tooltip')
                EditMeasurePage.assertLockedIndicatorTooltip(qicoreMeasureName, expectedTooltip)
            })
        })
    })

    describe('Test case list View tooltip', () => {
        beforeEach(() => {
            CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreMeasureName, qicorePopulationCql)
            createdMeasure = true
            MeasureGroupPage.CreateProportionMeasureGroupAPI(
                0,
                false,
                'Initial Population',
                '',
                '',
                'Initial Population',
                '',
                'Initial Population',
                'boolean'
            )
            TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description)

            Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
            Utilities.lockSharedTestCase(true)
            OktaLogin.Login()
        })

        it('includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)

                MeasuresPage.actionCenter('edit')
                cy.get(EditMeasurePage.testCasesTab).click()

                TestData.readTestCaseId().then((testCaseId) => {
                    const buttonSelector = TestCasesPage.getViewEditTestCaseButtonSelector(testCaseId)

                    cy.get(buttonSelector).should('contain.text', 'View')
                    cy.get(buttonSelector).trigger('mouseover')
                    LockedEntityValidation.assertVisibleTooltipText(expectedTooltip)
                })
            })
        })
    })

    describe('Locked test case view experience', () => {
        beforeEach(() => {
            CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreMeasureName, qicorePopulationCql)
            createdMeasure = true
            MeasureGroupPage.CreateProportionMeasureGroupAPI(
                0,
                false,
                'Initial Population',
                '',
                '',
                'Initial Population',
                '',
                'Initial Population',
                'boolean'
            )
            TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description)

            Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
            Utilities.lockSharedTestCase(true)
            OktaLogin.Login()
        })

        it('shows the locked test case modal and closes with X', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'test case',
                    displayName,
                    harpUserALT
                )

                openLockedTestCaseInView()
                TestCasesPage.dismissTestCaseLockedModal(expectedModalMessage, 'x')
            })
        })

        it('shows the locked test case modal and closes with Close button', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'test case',
                    displayName,
                    harpUserALT
                )

                openLockedTestCaseInView()
                TestCasesPage.dismissTestCaseLockedModal(expectedModalMessage, 'button')
            })
        })

        it.skip('Locked test case dropdown tooltip includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'test case',
                    displayName,
                    harpUserALT
                )

                openLockedTestCaseInView()
                TestCasesPage.dismissTestCaseLockedModal(expectedModalMessage)

                // The Jira notes this tooltip has a separate app bug. Keep the assertion here so the
                // test is ready once the dropdown reliably exposes the lock tooltip in the UI.
                cy.get(TestCasesPage.testCaseNameDropdown).trigger('mouseover')
                LockedEntityValidation.assertVisibleTooltipText(expectedTooltip)
            })
        })
    })

    describe('Library list View tooltip', () => {
        beforeEach(() => {
            CQLLibraryPage.createLibraryAPI(qicoreLibraryName, SupportedModels.qiCore6)
            createdLibrary = true

            Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
            Utilities.lockSharedLibrary(true)
            OktaLogin.Login()
        })

        it('includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)
                const legacyTooltip = LockedEntityValidation.legacyLockedTooltipText(harpUserALT)

                cy.get(Header.cqlLibraryTab).click()
                cy.get(CQLLibraryPage.allLibrariesTab).click()

                TestData.readCqlLibraryId().then((libraryId) => {
                    const buttonSelector = CQLLibrariesPage.getLibraryActionSelector(libraryId)
                    cy.get(buttonSelector).scrollIntoView().should('contain.text', 'View')
                    cy.get(buttonSelector).trigger('mouseover', { force: true })
                    LockedEntityValidation.assertVisibleTooltipText(expectedTooltip, legacyTooltip)
                })
            })
        })
    })

    describe('Locked library view experience', () => {
        beforeEach(() => {
            CQLLibraryPage.createLibraryAPI(qicoreLibraryName, SupportedModels.qiCore6)
            createdLibrary = true

            Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
            Utilities.lockSharedLibrary(true)
            OktaLogin.Login()
        })

        it('shows the locked library modal and closes with X', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserALT
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage, 'x')
            })
        })

        it('shows the locked library modal and closes with Close button', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserALT
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage, 'button')
            })
        })

        it('Locked library header In-Use tooltip includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'library',
                    displayName,
                    harpUserALT
                )

                openLockedLibraryInView()
                CQLLibraryPage.dismissLibraryLockedModal(expectedModalMessage)
                CQLLibraryPage.assertLockedLibraryIndicatorTooltip(expectedTooltip)
            })
        })
    })
})
