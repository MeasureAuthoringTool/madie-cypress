import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { Toasts } from "../../../../Shared/Toasts"

let updatedMeasuresPageName = ''
let updatedMeasuresPageNameSecond = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
const cohortMeasureCQL = MeasureCQL.CQL_For_Cohort
const cohortMeasureCQLSix = MeasureCQL.CQL_For_Cohort_Six
const filePath = 'cypress/fixtures/measureId'
const versionNumberFirst = '1.0.000'
const versionNumberSecond = '2.0.000'

describe('Draft and Version Validations -- add and cannot create draft of a draft that already exists tests', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'DraftVersionValidations' + Date.now() + randValue
        newCqlLibraryName = 'DraftVersionValidationsLib' + Date.now() + randValue

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

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
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
        cy.get(Toasts.generalToast).should('contain.text', 'New draft created successfully.')
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
        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')

        cy.intercept('POST', '**/draft').as('newDraft')

        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        // capture measureId for new draft
        let draftId
        cy.wait('@newDraft', { timeout: 25000 }).then(int => {
            draftId = int.response.body.id

            Utilities.waitForElementVisible('[data-testid=measure-action-' + draftId + ']', 30000)
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + draftId + ']', 30000)
            cy.get('[data-testid=measure-action-' + draftId + ']').scrollIntoView()
            cy.get('[data-testid=measure-action-' + draftId + ']').click()

            //Verify draft button is not visible
            cy.get('[data-testid=draft-measure-' + draftId + ']').should('not.exist')
        })
    })

    it('Tooltip appears and user is unable to draft a 4.1.1 of a measure that has a 6.0.0 on measureSet', () => {

        updatedMeasuresPageName = 'updatedDVValidations' + Date.now()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberFirst)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberFirst)
        cy.log('Major Version Created Successfully')

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

        cy.get(Toasts.generalToast).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        Utilities.waitForElementToNotExist(Toasts.otherSuccessToast, 30000)

        // allow for measures to load, if not already done
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

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

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberSecond)
        cy.log('Major Version Created Successfully')

        //Search for the Measure using original 4.1.1 Measure name
        cy.log('Search Measure with measure name')
        Utilities.dropdownSelect(MeasuresPage.filterByDropdown, 'Measure')
        cy.get(MeasuresPage.searchInputBox).clear().type(newMeasureName).type('{enter}')
        
        // expand to see original
        cy.get('[data-testid*="_expandArrow"]').click()
        cy.get(MeasuresPage.measureListTitles).should('contain', newMeasureName)

        // check original measure
        cy.get('[class="expanded-row"]').find('input[type="checkbox"]').click()
        cy.wait(2000)
        cy.get('[data-testid="draft-action-tooltip"]').should('have.attr', 'aria-label', 'You cannot draft a 4.1.1 measure when a 6.0.0 version is available')
    })

    it('Change / update model from v4.1.1 - to - v6.0.0 with versioning and drafting but cannot draft from 6.0.0 - to - 4.1.1', () => {

        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()
        updatedMeasuresPageNameSecond = 'UpdatedTestMeasures2' + Date.now()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberFirst)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberFirst)
        cy.log('v4.1.1 Major Version Created Successfully')

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

        cy.get(Toasts.generalToast).should('contain.text', 'New draft created successfully.')
        cy.log('v6 Draft Created Successfully')

        Utilities.waitForElementToNotExist(Toasts.otherSuccessToast, 30000)

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

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberSecond)
        cy.log('v6 Major Version Created Successfully')

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

//skipping due to Stu7 not being active / set to true, yet, in PROD
describe.skip('Draft and Version Validations - upgrade QiCore v6.0.0 to v7.0.0', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'DraftTo7Measure' + Date.now()
        newCqlLibraryName = 'DraftTo7Lib' + Date.now()
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateMeasureAPI(newMeasureName, newCqlLibraryName, SupportedModels.qiCore6, { measureCql: cohortMeasureCQLSix })
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
    
    it('Change model from v6.0.0 - to - v7.0.0 with versioning and drafting but cannot draft from 7.0.0 back down', () => {

        updatedMeasuresPageName = 'upgradedTo7' + Date.now()

        // version 1.0.000
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumberFirst)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumberFirst)
        cy.log('v6 Major Version Created Successfully')

        // draft to v7
        MeasuresPage.actionCenter('draft')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        cy.get(MeasuresPage.draftModalSelectionBox).click()
        Utilities.waitForElementVisible(MeasuresPage.draftModalVersionSeven, 5000)
        cy.get(MeasuresPage.draftModalVersionSeven).click()

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(Toasts.generalToast).should('contain.text', 'New draft created successfully.')
        cy.log('v7 Draft Created Successfully')

        // version to 2.0.000
        Utilities.waitForElementToNotExist(Toasts.otherSuccessToast, 30000)

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(updatedMeasuresPageName).type('{enter}')
        cy.get(MeasuresPage.measureListTitles).should('contain', updatedMeasuresPageName)
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        Utilities.waitForElementVisible(MeasuresPage.measureCQLToElmVersionTxtBox, 8500)
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        /*
            the 4.1.1 -> 6 version of this test changes & validates the CQL at this point
            As of 7/29/25 we don't have that level of support for STU7 yet
            We can add extra steps later when we do
        */

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

        // this is end-state as of 7/29/25. STU7 CQL is not fully functional & this error is unavoidable for the test process
        cy.get(Toasts.dangerToast).should('have.text', 'CQL-ELM translator found errors in the CQL for measure ' + updatedMeasuresPageName + '!')

        cy.get(MeasuresPage.measureVersionHelperText).should('have.text', 'An unexpected error has occurred. Please contact the help desk.')

        // after STU7 CQL works, remove the 2 previous lines & uncomment everything below
        // it should work, with possible minor updates

        // cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        // MeasuresPage.validateVersionNumber(versionNumberSecond)
        // cy.log('v7 Major Version Created Successfully')

        // // attempt draft back to v6
        // MeasuresPage.actionCenter('draft')
        // cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        // cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        // cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        // cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageNameSecond)

        // cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        // cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        // cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        // cy.get(MeasuresPage.draftModalSelectionBox).click()
        // cy.get(MeasuresPage.draftModalSelectionBox).should('not.contain.text', 'QI-Core v4.1.1')
        // cy.get(MeasuresPage.draftModalSelectionBox).should('not.contain.text', 'QI-Core v6.0.0')
    })
})