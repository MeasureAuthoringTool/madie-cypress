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
import { LandingPage } from "../../../../Shared/LandingPage";

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
        MeasureGroupPage.CreateCohortMeasureGroupAPI()

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

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
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

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
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').scrollIntoView()
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            //Verify version button is not visible
            cy.get('[data-testid=draft-measure-' + fileContents + ']').should('not.exist')

        })
    })

    it('Change / update model from v4.1.1 - to - v6.0.0 with versioning and drafting but cannot draft from 6.0.0 - to - 4.1.1', () => {

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
        MeasuresPage.validateVersionNumber(versionNumberFirst)
        cy.log('Major Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        cy.get(MeasuresPage.draftModalSelectionBox).click()
        Utilities.waitForElementVisible(MeasuresPage.draftModalVersionSix, 5000)
        cy.get(MeasuresPage.draftModalVersionSix).click()

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 100000)

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).type('{enter}')
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
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'using QICore version \'6.0.0\'')
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
        MeasuresPage.validateVersionNumber(versionNumberSecond)
        cy.log('Major Version Created Successfully')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageNameSecond)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        cy.get(MeasuresPage.draftModalSelectionBox).click()
        cy.get(MeasuresPage.draftModalSelectionBox).should('not.contain.text', 'QI-Core v4.1.1')
        cy.get(MeasuresPage.draftModalSelectionBox).should('contain.text', 'QI-Core v6.0.0')
    })
})

describe('Draft and Version Validations -- add and cannot create draft of a draft that already exists tests', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI()

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()

    })
    it('Tooltip appears and user is unable to draft a 4.1.1 of a measure that has a 6.0.0 on measureSet', () => {

        let filePath = 'cypress/fixtures/measureId'
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
        MeasuresPage.validateVersionNumber(versionNumberFirst)
        cy.log('Major Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        cy.get(MeasuresPage.draftModalSelectionBox).click()
        Utilities.waitForElementVisible(MeasuresPage.draftModalVersionSix, 5000)
        cy.get(MeasuresPage.draftModalVersionSix).click()

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 100000)

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageName)

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberSecond)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberSecond)
        cy.log('Major Version Created Successfully')

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(newMeasureName).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', newMeasureName)

        cy.get('[class="px-1"]').find('[class=" cursor-pointer"]').eq(0).click()
        cy.get('[data-testid="draft-action-tooltip"]').should('have.attr', 'aria-label', 'You cannot draft a 4.1.1 measure when a 6.0.0 version is available')
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

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
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

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageName)
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + newCqlLibraryName)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('not.be.enabled')

        //verify group info after draft
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Cohort')

        //Verify Test case info after draft
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('exist')
        cy.get(TestCasesPage.testCaseListTable).click()
        cy.get(TestCasesPage.testCaseAction0Btn).click()
        cy.get(TestCasesPage.aceEditor).should('not.be.empty')
        cy.get(TestCasesPage.aceEditor).should('contain.text', 'Bundle')
        cy.log('Test case details verified successfully')

    })
})
