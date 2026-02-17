import { CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { QiCore6Cql } from "../../../../../Shared/FHIRMeasuresCQL"
import { PopulationType, Stratification } from "@madie/madie-models"
import { v4 as uuidv4 } from 'uuid'
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Profile, TestCaseBuilder } from "../../../../../Shared/TestCaseBuilder"

const timestamp = Date.now()
let measureName = 'BuilderBasicTC' + timestamp
let CqlLibraryName = 'BuilderBasicTCLib' + timestamp
const cql = QiCore6Cql.cqlCMS125
// TestCase #1 from the real measure
const testCase1: TestCase = {
    title: '41yoWOfficeVisEncJan1OfMP',
    description: 'A basic passing scenario',
    group: 'IPPPass'
}

const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    numerator: 'Numerator',
    denominator: 'Denominator',
    denomExclusion: 'Denominator Exclusions',
}

const strats: Array<Stratification> = [
    {
        id:  uuidv4(),
        description: "Stratification 1: Patients age 42-51 by the end of the measurement period",
        cqlDefinition: "Stratification 1",
        associations: [
        PopulationType.INITIAL_POPULATION,
        PopulationType.DENOMINATOR,
        PopulationType.DENOMINATOR_EXCLUSION,
        PopulationType.NUMERATOR
        ]
    },
    {
        id:  uuidv4(),
        description: "Stratification 2: Patients age 52-74 by the end of the measurement period",
        cqlDefinition: "Stratification 2",
        associations: [
        PopulationType.INITIAL_POPULATION,
        PopulationType.DENOMINATOR,
        PopulationType.DENOMINATOR_EXCLUSION,
        PopulationType.NUMERATOR
        ]
    }
]

describe.skip('Test Case Builder Basics', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: cql })
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.boolean, MeasureScoring.Proportion, populations)
        MeasureGroupPage.addStratificationDataAPI(strats)
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Create a QiCore6 test case using the UI Builder', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        // after the page is ready (e.g., available tab visible)
        cy.get('[data-testid="available-tab"]').should('be.visible')

        cy.dragAnySashToRight()

        TestCaseBuilder.addEditNewResource(Profile.Patient)

        Utilities.dropdownSelect('[data-testid="code-selector-Patient.gender"]', 'female')
       
        TestCaseBuilder.applyAndWait()

        TestCaseBuilder.selectLeftMenu(' *Identifier')
        cy.get('[data-testid="uri-field-Patient.identifier[0].system"]').type('http://hospital.smarthealthit.org')
        cy.get('[data-testid="string-field-input-Patient.identifier[0].value"]').type('999999995')
        TestCaseBuilder.applyAndWait()

        TestCaseBuilder.selectLeftMenu(' *Name')
        cy.get('[data-testid="string-field-input-Patient.name[0].family"]').type('Starr')
        cy.get('[data-testid="string-field-input-Patient.name[0].given[0]"]').type('Ringo')
        TestCaseBuilder.applyAndWait()

        cy.get(TestCaseBuilder.addAttribute).click()
        cy.contains('birthDate').click()
        cy.contains('extension:race').click()
        cy.contains('extension:ethnicity').click()
        cy.get('[data-testid="add-element-button-2"]').click()

        TestCaseBuilder.selectLeftMenu('Birth Date')
        cy.get('[data-testid="YYYY-MM-DD-field-Patient.birthDate-input"]').type('01-01-1985')
        TestCaseBuilder.applyAndWait()

        TestCaseBuilder.selectLeftMenu('Extension (Race)')
        // waiting for https://jira.cms.gov/browse/MAT-9688 - race omb 2028-9 asian

        TestCaseBuilder.selectLeftMenu('Extension (Ethnicity)')
        // waiting for https://jira.cms.gov/browse/MAT-9688 - ethnicity 2135-2 hispanic or latino

        /* add Encounter
        class actcode AMB
        status finished
        subject, ref patient
        type    snomed 185463005 visit out of hours procedure
        period  010126 00:00:00 to 010126 whatever        


            cy.get('[data-testid="measure-name-qicore-encounter_action"]').click()
        */

    })

})