import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MadieObject, PermissionActions, Utilities } from '../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { QiCore4Cql, QiCore6Cql } from '../../../../Shared/FHIRMeasuresCQL'
import { TestCase, TestCasesPage } from '../../../../Shared/TestCasesPage'
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
const secondTestCase: TestCase = {
    title: 'Unlocked companion test case',
    group: 'PASS',
    description: 'Used for locked dropdown tooltip coverage'
}

let harpUserALT = ''
let qicoreMeasureName = ''
let createdMeasure = false

const openLockedMeasureInView = (): void => {
    step('Open locked measure in view mode')
    MeasuresPage.actionCenter('view')
}

const openLockedTestCaseInView = (): void => {
    step('Open locked test case in view mode')
    MeasuresPage.actionCenter('edit')
    TestCasesPage.clickEditforCreatedTestCase()
}

const openUnlockedSecondTestCaseInView = (): void => {
    step('Open unlocked second test case in view mode')
    MeasuresPage.actionCenter('edit')
    TestCasesPage.clickEditforCreatedTestCase(true)
}

describe('Locked Measure, Library, and Test Case tooltips display user name', () => {
    beforeEach(() => {
        harpUserALT = OktaLogin.getUser(true)
        qicoreMeasureName = `LockTooltipMeasure${Date.now()}`
        createdMeasure = false
    })

    afterEach(() => {
        if (createdMeasure) {
            Utilities.releaseAllLocksForCleanup(MadieObject.Measure, true)
            Utilities.deleteMeasure()
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
            TestCasesPage.CreateTestCaseAPI(
                secondTestCase.title,
                secondTestCase.group,
                secondTestCase.description,
                undefined,
                false,
                true
            )

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
            TestCasesPage.CreateTestCaseAPI(
                secondTestCase.title,
                secondTestCase.group,
                secondTestCase.description,
                undefined,
                false,
                true
            )

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

        it('Locked test case dropdown selected value tooltip includes display name and HARP ID', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)
                const expectedModalMessage = LockedEntityValidation.lockedModalMessageText(
                    'test case',
                    displayName,
                    harpUserALT
                )

                openLockedTestCaseInView()
                TestCasesPage.dismissTestCaseLockedModal(expectedModalMessage)
                TestCasesPage.assertSelectedLockedTestCaseDropdownTooltip(expectedTooltip)
            })
        })

        it('Locked test case dropdown option tooltip includes display name and HARP ID when another test case is selected', () => {
            LockedEntityValidation.getDisplayName(harpUserALT).then((displayName) => {
                const expectedTooltip = LockedEntityValidation.lockedTooltipText(displayName, harpUserALT)

                openUnlockedSecondTestCaseInView()
                TestCasesPage.assertLockedTestCaseDropdownOptionTooltip(testCase.title, expectedTooltip)
            })
        })
    })
})
