import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { MonacoEditor } from "../../../../Shared/MonacoEditor"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Qi-Core Library Includes - Delete functionality', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.SessionLogin()

        MeasuresPage.actionCenter('edit', 0)

        CQLEditorPage.openMonacoCqlEditor()
        CQLEditorPage.expandCQLBuilderPanel()
    })

    afterEach('Clean up and Logout', () => {

        
        Utilities.deleteMeasure()
        OktaLogin.UILogout()
    })

    it('Qi Core: Delete Included Libraries functionality -- when changes to the CQL is not saved', () => {

        cy.get(Header.mainMadiePageButton).click()

        //make a change to CQL (don't save)
        MeasuresPage.actionCenter('edit', 0)

        CQLEditorPage.openMonacoCqlEditor()
        MonacoEditor.appendDocumentText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //attempt to delete and choose No, keep working
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()

        Utilities.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
        Utilities.waitForElementVisible(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //attempt to delete and choose yes to discard changes
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Utilities.discardChangesContinue).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Are you sure?')

        //choose cancel
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn, 5000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()

        //confirm that CQL value is the same as it was prior to change and the save button is not available
        cy.reload()
        CQLEditorPage.expandCQLBuilderPanel()
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
        Utilities.waitForElementToNotExist(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //make a change to the CQL but do not save
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.openMonacoCqlEditor()
        MonacoEditor.appendDocumentText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.includesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('contain.text', 'FHIRHelpers')

        //attempt to delete and choose yes to discard changes
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Utilities.discardChangesContinue).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Are you sure?')

        //choose yes to delete
        Utilities.waitForElementVisible(CQLEditorPage.deleteContinueButton, 5000)
        Utilities.waitForElementEnabled(CQLEditorPage.deleteContinueButton, 5000)
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library FHIRHelpers has been successfully removed from the CQL')

        //Deletes the library include statement from the CQL
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'FHIRHelpers')
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'library ' + CqlLibraryName, 'using QICore version', 'define "Surgical Absence of Cervix"')

        //Deletes the library from the Saved Libraries grid
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })

    it('Qi Core: Delete Included Libraries functionality -- when changes to the CQL is saved', () => {

        //make a change and save changes
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveMonacoCql()

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //delete and choose yes to confirm delete
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Are you sure?')

        //choose yes to delete
        Utilities.waitForElementVisible(CQLEditorPage.deleteContinueButton, 5000)
        Utilities.waitForElementEnabled(CQLEditorPage.deleteContinueButton, 5000)
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library FHIRHelpers has been successfully removed from the CQL')

        //Deletes the library include statement from the CQL
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'FHIRHelpers')
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'library ' + CqlLibraryName, 'using QICore version', 'define "Surgical Absence of Cervix"')

        //Deletes the library from the Saved Libraries grid
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })
})

describe('Qi-Core Library Includes - Edit functionality', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.SessionLogin()

        MeasuresPage.actionCenter('edit', 0)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        CQLEditorPage.expandCQLBuilderPanel()
    })

    afterEach('Clean up and Logout', () => {

        
        Utilities.deleteMeasure()
        OktaLogin.UILogout()
    })

    it('Qi Core: Edit Included Libraries functionality -- when changes to the CQL is not saved', () => {

        cy.get(Header.mainMadiePageButton).click()

        //make a change to CQL (don't save)
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.openMonacoCqlEditor()
        MonacoEditor.appendDocumentText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //attempt to edit and choose No, keep working
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        Utilities.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
        Utilities.waitForElementVisible(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //attempt to edit and choose yes to discard changes
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Utilities.discardChangesContinue).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible(CQLEditorPage.detailsModal, 5000)
        cy.get(CQLEditorPage.detailsModal).should('contain.text', 'Details')

        //choose cancel
        cy.get(Utilities.DiscardCancelBtn).scrollIntoView()
        Utilities.waitForElementVisible(Utilities.DiscardCancelBtn, 5000)
        cy.get(Utilities.DiscardCancelBtn).click()

        //confirm that CQL value is the same as it was prior to change and the save button is not available
        cy.reload()
        CQLEditorPage.expandCQLBuilderPanel()
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
        Utilities.waitForElementToNotExist(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //make a change to the CQL but do not save
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        MonacoEditor.appendDocumentText(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.includesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('contain.text', 'FHIRHelpers')

        //attempt to edit and choose yes to discard changes
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(Utilities.discardChangesContinue).click()

        //confirm "Details" pop up
        Utilities.waitForElementVisible(CQLEditorPage.detailsModal, 5000)
        cy.get(CQLEditorPage.detailsModal).should('contain.text', 'Details')

        //make an edit
        Utilities.waitForElementVisible(CQLLibraryPage.editSavedLibraryAlias, 5000)
        cy.get(CQLLibraryPage.editSavedLibraryAlias).clear()
        cy.get(CQLLibraryPage.editSavedLibraryAlias).type('CommonEdited')

        //choose apply edit
        Utilities.waitForElementVisible(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        cy.get(CQLLibraryPage.applyEditsSavedLibraryBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library FHIRHelpers has been successfully edited in the CQL')

        //Deletes the library include statement from the CQL
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
    })

    it('Qi Core: Edit Included Libraries functionality -- when changes to the CQL is saved', () => {

        //make a change and save changes
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        CQLEditorPage.saveMonacoCql()

        //Click on Includes tab
        CQLEditorPage.expandCQLBuilderPanel()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('be.visible')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //click edit on the page
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible(CQLEditorPage.detailsModal, 5000)
        cy.get(CQLEditorPage.detailsModal).should('contain.text', 'Details')

        //make an edit
        Utilities.waitForElementVisible(CQLLibraryPage.editSavedLibraryAlias, 5000)
        cy.get(CQLLibraryPage.editSavedLibraryAlias).clear()
        cy.get(CQLLibraryPage.editSavedLibraryAlias).type('CommonEdited')

        //choose apply edit
        Utilities.waitForElementVisible(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        cy.get(CQLLibraryPage.applyEditsSavedLibraryBtn).click()

        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library FHIRHelpers has been successfully edited in the CQL')

        //Deletes the library include statement from the CQL
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'fgdfgfgdfg')
    })
})
