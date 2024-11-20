import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let MeasuresPageOne = ''
let updatedMeasuresPageName = ''
let updatedMeasuresPageNameSecond = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let cohortMeasureCQL = MeasureCQL.CQL_For_Cohort
let cohortMeasureCQLSix = MeasureCQL.CQL_For_Cohort_Six
let testCaseTitle = 'testCaseTitle'
let testCaseDescription = 'testDescription' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortEpisodeWithStrat_PASS


describe('Draft and Version Validations -- add and cannot create draft of a draft that already exists tests', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()

    })

    it('Add Draft to the versioned measure', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()
        let filePath = 'cypress/fixtures/measureId'

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(5000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click().wait(2500)
        cy.reload()

        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        //intercept draft id once measure is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
        })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).scrollIntoView().click()
        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')
    })


    it('User cannot create a draft for a measure / version, whom already has been drafted', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedMeasuresPageOne' + Date.now()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(5000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.reload()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').scrollIntoView()
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            //Verify version button is not visible
            cy.get('[data-testid=draft-measure-' + fileContents + ']').should('not.exist')
            cy.reload()
        })
    })

    it('Change / update model from v4.1.1 - to - v6.0.0 and vice versa with versioning and drafting', () => {

        let versionNumberFirst = '1.0.000'
        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()

        let versionNumberSecond = '2.0.000'
        updatedMeasuresPageNameSecond = 'UpdatedTestMeasures2' + Date.now()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberFirst)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumberFirst)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        //Skipping until feature flag 'qiCore6' is removed
        // cy.get(MeasuresPage.draftModalSelectionBox).click()
        // Utilities.waitForElementVisible(MeasuresPage.draftModalVersionSix, 5000)
        // cy.get(MeasuresPage.draftModalVersionSix).click()

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 100000)

        //verify CQL after draft
        cy.get(Header.mainMadiePageButton).click()
        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).wait(1000).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageName)
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + newCqlLibraryName)
        //cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'using QICore version \'6.0.0\'')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'include FHIRHelpers version \'4.1.000\' called FHIRHelpers')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(cohortMeasureCQLSix)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //navigate to main measure list page and version and draft to put measure back on 4.1.1 modal version
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberSecond)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumberSecond)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageNameSecond)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        //Skipping until feature flag 'qiCore6' is removed
        // cy.get(MeasuresPage.draftModalSelectionBox).click()
        // Utilities.waitForElementVisible(MeasuresPage.draftModalVersionFourOneOne, 5000)
        // cy.get(MeasuresPage.draftModalVersionFourOneOne).click()

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 100000)

        //verify CQL after draft
        cy.get(Header.mainMadiePageButton).click()
        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageNameSecond).wait(1000).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageNameSecond)
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + newCqlLibraryName)
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'using QICore version \'4.1.1\'')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'include FHIRHelpers version \'4.1.000\' called FHIRHelpers')

    })
})

describe('Draft and Version Validations -- CQL and Group are correct', () => {

    beforeEach('Create Measure, Group, Test case and Login', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up and Logout', () => {

        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.deleteMeasureConfirmationButton, 5000)
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 5000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', "Measure successfully deleted")
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 10000)
        cy.url().should('be.oneOf', ['https://dev-madie.hcqis.org/measures', 'https://test-madie.hcqis.org/measures', 'https://impl-madie.hcqis.org/measures', 'https://madie.cms.gov/measures'])
        OktaLogin.UILogout()

    })

    it('Verify Draft measure CQL, Group and Test case', () => {
        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Major Version Created Successfully')
        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 100000)

        //verify CQL after draft
        cy.get(Header.mainMadiePageButton).click()
        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).wait(1000).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageName)
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click().wait(7000)
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + newCqlLibraryName)

        //verify group info after draft
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Cohort')

        //Verify Test case info after draft
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('exist')
        cy.get(TestCasesPage.testCaseListTable).click()
        cy.get('.action').click()
        cy.get('[class="btn-container"]').contains('edit').click()
        cy.get(TestCasesPage.aceEditor).should('not.be.empty')
        cy.get(TestCasesPage.aceEditor).should('contain.text', 'Bundle')
        cy.log('Test case details verified successfully')

    })
})
