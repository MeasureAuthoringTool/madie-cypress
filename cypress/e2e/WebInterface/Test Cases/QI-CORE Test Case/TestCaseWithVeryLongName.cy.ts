import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const timestamp = Date.now()
const measureName = 'TestMeasure' + timestamp
const CqlLibraryName = 'TestLibrary' + timestamp
const testCaseTitle = 'Title for Automation test case number one  - Very very long title for a test case that is definitely not needed\
 to be helpful or descriptive in any case 123456789 - ' + timestamp
const testCaseDescription = 'DENOMFail' + timestamp
const testCaseSeries = 'SBTestSeries'
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')

describe('Create Test Case with a very long name', () => {

    beforeEach('Create Measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, { measureCql: measureCQL } )
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Logout and delete measure', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create and Update Test Case for Qi Core Version 4.1.1 Measure', () => {

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

        const shortTitle = 'Title for Automation test case number one  - Very very long Show more'
        TestCasesPage.grabValidateTestCaseTitleAndSeries(shortTitle, testCaseSeries)

        cy.wait(5500)
        
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then(fileContents => {

            const showMoreToggle = '[data-testid="test-case-title-' + fileContents + '-toggle-button"]'
            cy.get(showMoreToggle).click()

            TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle + 'Show less', testCaseSeries)
        })
    })
})
