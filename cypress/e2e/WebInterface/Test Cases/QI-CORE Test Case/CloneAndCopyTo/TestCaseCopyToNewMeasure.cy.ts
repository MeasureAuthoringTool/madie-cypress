import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../../Shared/MeasureGroupPage"
import { TestCase, TestCaseAction, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { QiCore4Cql } from "../../../../../Shared/FHIRMeasuresCQL"
import { Header } from "../../../../../Shared/Header"

const now = Date.now()
const originalMeasure = {
    CMSid: '645FHIR',
    title: 'Bone Density Evaluation for Patients with Prostate Cancer and Receiving Androgen Deprivation TherapyFHIR'
}
const measureName = 'CopyTo' + now
const cqlLibraryName = 'CopyToLib' + now
const testCase: TestCase = {
    title: 'DEXA3MonthsAfterADTEdge',
    description: 'invalid on purpose',
    group: 'NUMERPass'
}
const existingMeasureCql = QiCore4Cql.BoneDensityEvalProstateCancer.replace('BoneDensityProstateCancerAndrogenDeprivationTherapyFHIR', measureName)
const basicCql = QiCore4Cql.stndBasicQICoreCQL.replace('TestLibrary1709929148231865', measureName)

describe('Copy test cases from existing measure into new measure', () => {
    /*
        Using the static measure as our basis - assuming this will always be in MADiE
        Bone Density Evaluation for Patients with Prostate Cancer and Receiving Androgen Deprivation TherapyFHIR 
        CMS id: 645FHIR
    */

    const measureOptions: CreateMeasureOptions = {
        measureCql: existingMeasureCql,
    }
    const populations: MeasureGroups = {
        initialPopulation: 'Initial Population',
        denominator: 'Denominator',
        numerator: 'Numerator',
        denomException: 'Denominator Exception'
    }
    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.boolean, MeasureScoring.Proportion, populations)
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Measures match population criteria - expected values will copy', () => {

        // switch to all measure tab, search for original measure, view
        cy.intercept('PUT', '/api/measures/searches?currentUser=false&limit=10&page=0').as('searchDone')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 26500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(originalMeasure.CMSid).type('{enter}')
        cy.wait('@searchDone')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', originalMeasure.title)

        // need to select correct version of the measure with .eq(1)
        cy.get('[data-testid="row-item"]').eq(1).contains('View').click()

        // got to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // set pagination all
        cy.get(TestCasesPage.paginationLimitSelect).click()
        cy.get(TestCasesPage.paginationLimitAll).click()

        // select all, copy to, select my new measure, save
        Utilities.checkAll()

        TestCasesPage.actionCenter(TestCaseAction.copyToMeasure)

        // check toast for success, check stay on original measure test cases
        Utilities.waitForElementVisible(TestCasesPage.TestCasesSuccessMsg, 60000)
        cy.get(TestCasesPage.TestCasesSuccessMsg).should('have.text', 'Test Cases have been successfully copied.')

        // go to new measure, test case tab
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // check tc count is correct (original measure +1)
        TestCasesPage.grabValidateTestCaseNumber(50)

        // check title of dup named tc - testCase.title + uuid 
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        // check a copied tc for expected values
        TestCasesPage.grabTestCaseId(49)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.exist')
    })

    it('Measures do not match population criteria - test cases copy but expected values do not', () => {

        // change new measure's group config to not match original measure - switch to cohort
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        // set IP
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        // confirm change to scoring
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        cy.get(Header.mainMadiePageButton).click()

        // switch to all measure tab, search for original measure, view
        cy.intercept('PUT', '/api/measures/searches?currentUser=false&limit=10&page=0').as('searchDone')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 26500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(originalMeasure.CMSid).type('{enter}')
        cy.wait('@searchDone')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', originalMeasure.title)
        cy.get('[data-testid="row-item"]').eq(1).contains('View').click()

        // got to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // set pagination all
        cy.get(TestCasesPage.paginationLimitSelect).click()
        cy.get(TestCasesPage.paginationLimitAll).click()

        // select all, copy to, select my new measure, save
        Utilities.checkAll()

        TestCasesPage.actionCenter(TestCaseAction.copyToMeasure)

        // check toast for success, check stay on original measure test cases
        Utilities.waitForElementVisible(TestCasesPage.TestCasesSuccessMsg, 60000)
        cy.get(TestCasesPage.TestCasesSuccessMsg).should('have.text', 'Test Cases successfully copied without expected values due to differing Population Criteria on target Measure.')

        // go to new measure, test case tab
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // check tc count is correct (original measure +1)
        TestCasesPage.grabValidateTestCaseNumber(50)

        // check title of dup named tc - testCase.title + uuid 
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        // check a copied tc for expected values
        TestCasesPage.grabTestCaseId(49)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        /// these differ from previous test since it's a cohort measure now
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')
    })
})

describe('Copy to new measure - partial success case', () => {

    const measureOptions: CreateMeasureOptions = {
        measureCql: basicCql,
        measureNumber: 1
    }
    const secondTestCaseTitle = 'valid test case'

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, { measureCql: basicCql })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        CreateMeasurePage.CreateMeasureAPI('M2' + measureName, 'M2' + cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, null, false, false, false, 1)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCase.group, testCase.description, null, false, true, false, 1)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
        Utilities.deleteMeasure('M2' + measureName, 'M2' + cqlLibraryName, false, false, 1)
    })


    it('All test cases copy - even new, "empty", or "invalid"', () => {

        // go to measure 2, test cases tab
        MeasuresPage.actionCenter('edit', 1)

        cy.get(EditMeasurePage.testCasesTab).click()

        // select both tc
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)

        // copy to, select measure 1
        TestCasesPage.actionCenter(TestCaseAction.copyToMeasure)

        // verify toast
        cy.get(TestCasesPage.TestCasesSuccessMsg, { timeout: 11500 }).should('have.text', 'Test Cases have been successfully copied.')

        // go to measure 1, test cases tab
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        // verify both tc were copied
        TestCasesPage.grabValidateTestCaseNumber(2)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(secondTestCaseTitle, testCase.group)

        // altered versions of the 2 functions above, so they can hit the other testcase
        cy.get('[data-testid="test-case-title-1_caseNumber"]').invoke('text').then(
            (visibleNumber) => {
                expect(visibleNumber).to.include(1)
            })
        cy.get('[data-testid="test-case-title-1_series"]').invoke('text').then(
            (seriesText) => {
                expect(seriesText).to.include(testCase.group)
            })
        cy.get('[data-testid="test-case-title-1_title"]').invoke('text').then(
            (titleText) => {
                expect(titleText).to.include(testCase.title)
            })
    })
})
