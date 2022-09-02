import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {LandingPage} from "../../../../Shared/LandingPage"

//let measureCQL = MeasureCQL.SBTEST_CQL
let measureCQL = "library SimpleFhirMeasureLib version '0.0.004'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\nparameter 'Measurement Period' Interval<DateTime>\ncontext Patient\ndefine 'ipp':\n  exists ['Encounter'] E where E.period.start during 'Measurement Period'\ndefine 'denom':\n  'ipp'\ndefine 'num':\n  exists ['Encounter'] E where E.status ~ 'finished'"
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()

let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'

describe('Read only for measure, measure group, and test cases that user does not own', () => {

    before('Create Measure, Measure Group, and Test Case with alt user', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL, true, true)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(true, true, 'ipp', 'num', 'denom')
        TestCasesPage.CreateTestCaseAPI(TCTitle, TCSeries, TCDescription, '', true, true)

    })
    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName,true, true)

    })

    it('Measure fields on detail page are not editable', () =>{

        //page loads
        cy.location('pathname', {timeout: 60000}).should('include', '/measures');
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 3000)
        Utilities.waitForElementEnabled(LandingPage.myMeasuresTab, 3000)

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //edit the measure that was not created by current measure
        MeasuresPage.clickEditforCreatedMeasure(true)

        cy.get(CreateMeasurePage.measurementPeriodStartDate).should('be.disabled')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).should('be.disabled')

        cy.get(EditMeasurePage.leftPanelMeasureSteward).should('be.visible')
        cy.get(EditMeasurePage.leftPanelMeasureSteward).click()
        cy.get(EditMeasurePage.measureStewardTextBox).should('not.exist')
        
        cy.get(EditMeasurePage.leftPanelDescription).should('be.visible')
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).should('not.exist')
        
        cy.get(EditMeasurePage.leftPanelCopyright).should('be.visible')
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).should('not.exist')        
        
        cy.get(EditMeasurePage.leftPanelDisclaimer).should('be.visible')
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).should('not.exist')

        cy.get(EditMeasurePage.leftPanelRationale).should('be.visible')
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).should('not.exist')

        cy.get(EditMeasurePage.leftPanelAuthor).should('be.visible')
        cy.get(EditMeasurePage.leftPanelAuthor).click()
        cy.get(EditMeasurePage.measureAuthorTextBox).should('not.exist')

        cy.get(EditMeasurePage.leftPanelGuidance).should('be.visible')
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).should('not.exist')

    })

    it('CQL value on the measure CQL Editor tab cannot be changed', () =>{

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //edit the measure that was not created by current measure
        MeasuresPage.clickEditforCreatedMeasure(true)
        
        //confirm that the CQL Editor tab is available and click on it
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).eq(null)

    })
    it('Test Cases are read / view only', () =>{

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 3000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //edit the measure that was not created by current measure
        MeasuresPage.clickEditforCreatedMeasure(true)

        //confirm that the test case tab is available and click on it
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile('cypress/fixtures/testcaseId2').should('exist').then((fileContents) => {
            //confirm that edit button for test case is not available
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('not.exist')

            //confirm that view button for test case is available and click on the view button
            cy.get('[data-testid=view-test-case-'+ fileContents +']').should('be.visible')
            cy.get('[data-testid=view-test-case-'+ fileContents +']').should('be.enabled')
            cy.get('[data-testid=view-test-case-'+ fileContents +']').click()
        })

        //confirm that the text boxes, for the test case fields are not visible
        cy.get(TestCasesPage.testCaseTitle).should('not.exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('not.exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('not.exist')
        
    })
})