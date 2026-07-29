import { CreateMeasurePage, SupportedCompositeModels, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { Header } from '../../../../Shared/Header'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { TestData } from '../../../../Shared/TestData'
import { MadieObject, Utilities } from '../../../../Shared/Utilities'
import { step } from '../../../../utils/step'

type CompositeActionCenterSetup = {
    measureName: string
    cqlLibraryName: string
    targetMeasureName: string
    targetCqlLibraryName: string
}

const compositePrimaryTestCase = {
    title: 'Composite locked-in action test case',
    group: 'PASS',
    description: 'composite action-center coverage'
}

const compositeSecondaryTestCase = {
    title: 'Composite companion action test case',
    group: 'PASS',
    description: 'second composite action-center row'
}

const buildCompositeActionCenterSetup = (): CompositeActionCenterSetup => {
    const timestamp = Date.now()

    return {
        measureName: `CompositeActionCenter${timestamp}`,
        cqlLibraryName: `CompositeActionCenterLib${timestamp}`,
        targetMeasureName: `CompositeCopyTarget${timestamp}`,
        targetCqlLibraryName: `CompositeCopyTargetLib${timestamp}`
    }
}

const createCopyTargetMeasure = (setup: CompositeActionCenterSetup): void => {
    CreateMeasurePage.CreateMeasureAPI(
        setup.targetMeasureName,
        setup.targetCqlLibraryName,
        SupportedModels.qiCore6,
        undefined,
        1
    )
}

const createCompositeMeasureWithSeedData = (setup: CompositeActionCenterSetup): void => {
    CreateMeasurePage.CreateCompositeMeasureAPI(
        setup.measureName,
        setup.cqlLibraryName,
        SupportedCompositeModels.qiCore6
    )

    TestData.requestMeasureGroup('PUT', {
        scoring: 'Composite',
        populations: [],
        measureGroupTypes: ['Process'],
        populationBasis: 'Boolean',
        compositeScoring: 'Opportunity'
    }).then((response) => {
        expect(response.status).to.eql(200)
        expect(response.body.scoring).to.eql('Composite')
        expect(response.body.compositeScoring).to.eql('Opportunity')
    })

    TestCasesPage.CreateTestCaseAPI(
        compositePrimaryTestCase.title,
        compositePrimaryTestCase.group,
        compositePrimaryTestCase.description,
        TestCaseJson.TestCaseJson_Valid
    )

    TestCasesPage.CreateTestCaseAPI(
        compositeSecondaryTestCase.title,
        compositeSecondaryTestCase.group,
        compositeSecondaryTestCase.description,
        TestCaseJson.TestCaseJson_Valid,
        false,
        true
    )
}

const openCompositeMeasureTestCases = (): void => {
    cy.reload()
    MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
    cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
    cy.get(EditMeasurePage.testCasesTab).should('have.attr', 'aria-selected', 'true')
    cy.url().should('include', '/edit/test-cases')
}

const versionCompositeMeasure = (): void => {
    step('Version composite measure through the Measures action center')
    cy.get(Header.mainMadiePageButton).click()
    MeasuresPage.actionCenter('version')
    cy.get(MeasuresPage.measureVersionTypeDropdown).should('be.visible').click()
    cy.get(MeasuresPage.measureVersionMajor).should('be.visible').click()
    cy.get(MeasuresPage.confirmMeasureVersionNumber).should('be.visible').type('1.0.000')
    cy.get(MeasuresPage.measureVersionContinueBtn).should('be.enabled').click()
    cy.get(MeasuresPage.versionToastSuccessMsg)
        .should('be.visible')
        .and('contain.text', 'New version of measure is Successfully created')
    MeasuresPage.actionCenter('edit', 0, { expectCqlEditorTab: false })
    cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
}

const openFirstTestCaseJsonAndAssertNames = (expectedFamily: string, expectedGiven: string): void => {
    TestCasesPage.clickEditforCreatedTestCase()
    cy.get(TestCasesPage.jsonTab).should('be.visible').click()
    cy.get(TestCasesPage.tcSearchIcone).click()
    cy.get('.ace_search_form > .ace_search_field').type('family').type('{enter}')
    cy.get(TestCasesPage.testCaseJson).should('contain.text', `"family": "${expectedFamily}"`)
    cy.get(TestCasesPage.testCaseJson)
        .invoke('text')
        .then((text: string) => {
            const jsonText = text.replace(/\s+/g, ' ').trim()
            expect(jsonText).to.contain(`"given": [ "${expectedGiven}" ]`)
        })
}

// Enable these specs once MAT-10118 is available by default.
describe.skip('[MAT-10118] Composite test case action center', () => {
    let setup: CompositeActionCenterSetup

    beforeEach('Create composite setup', () => {
        setup = buildCompositeActionCenterSetup()
        OktaLogin.SessionLogin()
        createCompositeMeasureWithSeedData(setup)
        createCopyTargetMeasure(setup)
        openCompositeMeasureTestCases()
    })

    afterEach('Clean up composite setup', () => {
        Utilities.releaseAllLocksForCleanup(MadieObject.Measure)
        Utilities.deleteMeasure(setup.measureName, setup.cqlLibraryName)
        Utilities.deleteMeasure(setup.targetMeasureName, setup.targetCqlLibraryName, false, false, 1)
    })

    it('shows the composite draft action center controls', () => {
        cy.get(TestCasesPage.importTestCasesBtn).should('be.visible')
        cy.get(TestCasesPage.actionCenterDelete).should('be.disabled')
        cy.get(TestCasesPage.actionCenterClone).should('be.disabled')
        cy.get(TestCasesPage.actionCenterShiftDates).should('be.disabled')
        cy.get(TestCasesPage.actionCenterMakeJsonMatchUi).should('be.disabled')
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.disabled')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled')
        cy.get(TestCasesPage.actionCenterClone).should('be.enabled')
        cy.get(TestCasesPage.actionCenterShiftDates).should('be.enabled')
        cy.get(TestCasesPage.actionCenterMakeJsonMatchUi).should('be.enabled')
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')
    })

    it('deletes a single composite test case', () => {
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled').click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should(
            'contain.text',
            `You are choosing to delete the following Test Case(s)!${compositeSecondaryTestCase.group} - ${compositeSecondaryTestCase.title}`
        )
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', compositeSecondaryTestCase.title)
    })

    it('deletes multiple composite test cases', () => {
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled').click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should(
            'contain.text',
            `${compositePrimaryTestCase.group} - ${compositePrimaryTestCase.title}`
        )
        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should(
            'contain.text',
            `${compositeSecondaryTestCase.group} - ${compositeSecondaryTestCase.title}`
        )
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', compositePrimaryTestCase.title)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', compositeSecondaryTestCase.title)
    })

    it('makes composite test case JSON match the UI values', () => {
        openFirstTestCaseJsonAndAssertNames('Health', 'Lizzy')

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('[data-testid="test-case-title-0_select"]').click()
        cy.get(TestCasesPage.actionCenterMakeJsonMatchUi).click()
        cy.get('.MuiDialog-paper > .MuiBox-root').should('contain.text', 'Are you sure?')
        cy.get('.MuiDialogContent-root').should(
            'have.text',
            'For each of the selected 1 test cases, you are about to:Set all "family" fields in the JSON to the group value that was entered in the UISet all "given" fields in the JSON to the title value that was entered in the UIAre you sure you want to proceed?'
        )
        cy.get(TestCasesPage.makeJsonMatchUiContinueButton).click()
        cy.get('.toast').should('contain.text', 'All family and given fields have been set for the selected test cases')
        Utilities.waitForElementToNotExist('.toast', 60000)

        openFirstTestCaseJsonAndAssertNames(compositePrimaryTestCase.group, compositePrimaryTestCase.title)
    })

    it('shows matching QI-Core 6 measures in the composite copy-to modal', () => {
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled').click()

        cy.contains(setup.targetMeasureName).should('be.visible')
        cy.get(TestCasesPage.copyToSave).should('be.disabled')
    })

    it('disables delete for inherited composite test cases after versioning', () => {
        versionCompositeMeasure()
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('be.disabled')
    })
})
