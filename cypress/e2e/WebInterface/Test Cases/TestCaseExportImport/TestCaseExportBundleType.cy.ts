import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let filePath = 'cypress/fixtures/testCaseId'
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe('QI-Core: Export Bundle options: Transaction or Collection', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Export single QI-Core Test case : Transaction', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').wait(3000)
        cy.get(MeasuresPage.allMeasuresTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=select-action-' + fileContents + ']', 50000)
            cy.get('[data-testid=select-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=select-action-' + fileContents + ']', 50000)
            cy.get('[data-testid=select-action-' + fileContents + ']').should('be.enabled').wait(1000)
            cy.get('[data-testid=select-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementVisible('[data-testid=export-transaction-bundle-' + fileContents + ']', 55000)
            cy.get('[data-testid=export-transaction-bundle-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-transaction-bundle-' + fileContents + ']', 55000)
            cy.get('[data-testid=export-transaction-bundle-' + fileContents + ']').should('be.enabled')
            /*             cy.get('[data-testid=export-transaction-bundle-' + fileContents + ']').click()
                        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test case exported successfully') */
        })


    })

    it('Export single QI-Core Test case : Collection', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').wait(3000)
        cy.get(MeasuresPage.allMeasuresTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=select-action-' + fileContents + ']', 50000)
            cy.get('[data-testid=select-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=select-action-' + fileContents + ']', 50000)
            cy.get('[data-testid=select-action-' + fileContents + ']').should('be.enabled').wait(1000)
            cy.get('[data-testid=select-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementVisible('[data-testid=export-collection-bundle-' + fileContents + ']', 55000)
            cy.get('[data-testid=export-collection-bundle-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-collection-bundle-' + fileContents + ']', 55000)
            cy.get('[data-testid=export-collection-bundle-' + fileContents + ']').should('be.enabled')
            /*             cy.get('[data-testid=export-collection-bundle-' + fileContents + ']').click()
                        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test case exported successfully') */
        })
    })
})