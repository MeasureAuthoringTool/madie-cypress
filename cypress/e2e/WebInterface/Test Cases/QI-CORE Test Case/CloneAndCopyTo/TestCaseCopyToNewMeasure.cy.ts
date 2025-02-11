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
    title: 'DexaDoNotPerformTrue',
    description: 'invalid on purpose',
    group: 'NUMERFail'
}
const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    denominator: 'Denominator',
    numerator: 'Numerator',
    denomException: 'Denominator Exception'
}
const existingMeasureCql = QiCore4Cql.BoneDensityEvalProstateCancer.replace('BoneDensityProstateCancerAndrogenDeprivationTherapyFHIR', measureName)

describe('Copy test cases from existing measure into new measure', () => {
    /*
        Using the static measure as our basis - assuming this will alwys be in MADiE
        Bone Density Evaluation for Patients with Prostate Cancer and Receiving Androgen Deprivation TherapyFHIR 
        CMS id: 645FHIR
    */

    const measureOptions: CreateMeasureOptions = {
        measureCql: existingMeasureCql,
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
        cy.get('[data-testid="row-item"]').contains('View').click()

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
        cy.get('[data-testid="test-case-list-success"]').should('be.visible')
        cy.get('[data-testid="test-case-list-success"]').should('have.text', 'Test Cases have been successfully copied.')

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

        cy.get(TestCasesPage.expectedOrActualTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.exist')
    })

    it('Measures do not match population criteria - test cases copy but expected values do not', () => {
        
        // change new measure's group config to not match original measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.measureGroupsTab).click()


        // switch to all measure tab, search for original measure, view
        cy.intercept('PUT', '/api/measures/searches?currentUser=false&limit=10&page=0').as('searchDone')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 26500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(originalMeasure.CMSid).type('{enter}')
        cy.wait('@searchDone')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', originalMeasure.title)
        cy.get('[data-testid="row-item"]').contains('View').click()

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
        cy.get('[data-testid="test-case-list-success"]').should('be.visible')
        cy.get('[data-testid="test-case-list-success"]').should('have.text', 'Test Cases have been successfully copied.')

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

        cy.get(TestCasesPage.expectedOrActualTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.exist')
    })
})

// describe('Copy to new measure - partial success case', () => {

//     it('Valid test cases copy, invalid ones do not', () => {

//     })
// })

// describe('Copy to new measure - failure case', () => {

//     it('When no valid test cases are present, copy to fails', () => {

//     })
// })
