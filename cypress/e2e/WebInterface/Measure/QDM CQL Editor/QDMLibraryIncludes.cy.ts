import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { Global } from "../../../../Shared/Global"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

describe('QDM Library Includes fields', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for QDM Included Libraries', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for FHIR Library
        cy.get(CQLEditorPage.librarySearchTextBox).type('fhir')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('.Results___StyledTd-sc-18pioce-0').should('contain.text', 'No Results were found')

        //Search for QDM Libraries
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('sdoh')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('[data-testid="terminology-section-Library Results-sub-heading"]').find('[class="growing-div open"]').find(CQLEditorPage.librarySearchTable).find('[data-testid="library-results-tbl"]').find('[data-testid="library-results-table-body"]').should('include.text', 'SDOH3.2.000ltj7708SDOH3.1.000ltj7708SDOH3.0.000ltj7708SDOH2.0.000ltj7708SDOH1.0.000ltj7708')
    })

    it('Apply QDM Included library to the CQL and save', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('[data-testid="terminology-section-Library Results-sub-heading"]').find('[class="growing-div open"]').find(CQLEditorPage.librarySearchTable).find('[data-testid="library-results-tbl"]').find('[data-testid="library-results-table-body"]').should('include.text', 'UATVTEQDM0.1.000YaHu1257VTEQDM8.3.000YaHu1257VTEQDM8.2.000YaHu1257VTEQDM8.1.000YaHu1257VTEQDM8.0.000YaHu1257')

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast success"]').should('contain.text', 'Library UATVTEQDM has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('Verify error messages when same Library/Alias is applied twice', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('VTE')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('[data-testid="terminology-section-Library Results-sub-heading"]').find('[class="growing-div open"]').find(CQLEditorPage.librarySearchTable).find('[data-testid="library-results-tbl"]').find('[data-testid="library-results-table-body"]').should('include.text', 'UATVTEQDM0.1.000YaHu1257VTEQDM8.3.000YaHu1257VTEQDM8.2.000YaHu1257VTEQDM8.1.000YaHu1257VTEQDM8.0.000YaHu1257')

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast success"]').should('contain.text', 'Library UATVTEQDM has been successfully added to the CQL.')

        //Apply same Library again
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast info"]').should('contain.text', 'Library UATVTEQDM has already been defined in the CQL.')

        //Apply different Library with duplicate Alias
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('QDM')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('[data-testid="terminology-section-Library Results-sub-heading"]').find('[class="growing-div open"]').find(CQLEditorPage.librarySearchTable).find('[data-testid="library-results-tbl"]').find('[data-testid="library-results-table-body"]').should('include.text', 'ASNQDM0.2.000AlannahMarshASNQDM0.1.000AlannahMarshAdultOutpatientEncountersQDM4.0.000swshahAdultOutpatientEncountersQDM3.0.000swshahAdultOutpatientEncountersQDM2.0.000swshah')
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast info"]').should('contain.text', 'Alias VTE has already been defined in the CQL.')

    })

    it('Verify Included Libraries under Saved Libraries tab', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'Common')//Alias
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'MATGlobalCommonFunctionsQDM')//Name
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', '8.0.000')//Version
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'julietrubini')//Owner
    })

    it('QDM: Delete Included Libraries functionality -- when changes to the CQL is not saved', () => {

        cy.get(Header.mainMadiePageButton).click()

        //make a change to CQL (don't save)
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}fgdfgfgdfg')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //attempt to delete and choose No, keep working
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()

        Global.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '1 of 1')
        Utilities.waitForElementVisible(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //attempt to delete and choose yes to discard changes
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesContinue).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Are you sure?')

        //choose cancel
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn, 5000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()

        //confirm that CQL value is the same as it was prior to change and the save button is not available
        cy.reload()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')
        Utilities.waitForElementToNotExist(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //make a change to the CQL but do not save
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}fgdfgfgdfg')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.includesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('contain.text', 'MATGlobalCommonFunctionsQDM')

        //attempt to delete and choose yes to discard changes
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesContinue).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Are you sure?')

        //choose yes to delete
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn, 5000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library MATGlobalCommonFunctionsQDM has been successfully removed from the CQL')

        //Deletes the library include statement from the CQL
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')

        //Deletes the library from the Saved Libraries grid
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (0)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })

    it('QDM: Delete Included Libraries functionality -- when changes to the CQL is saved', () => {

        //make a change and save changes
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //delete and choose yes to confirm delete
        cy.get(CQLEditorPage.deleteSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.deleteSavedLibrary, 5000)
        cy.get(CQLEditorPage.deleteSavedLibrary).click()

        //confirm "are you sure" pop up
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Are you sure?')

        //choose yes to delete
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn, 5000)
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library MATGlobalCommonFunctionsQDM has been successfully removed from the CQL')

        //Deletes the library include statement from the CQL
        cy.get('[data-testid="SearchIcon"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')

        //Deletes the library from the Saved Libraries grid
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (0)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })

    it('QDM: Edit Included Libraries functionality -- when changes to the CQL is not saved', () => {

        cy.get(Header.mainMadiePageButton).click()

        //make a change to CQL (don't save)
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}fgdfgfgdfg')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //attempt to edit and choose No, keep working
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        Global.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '1 of 1')
        Utilities.waitForElementVisible(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //attempt to edit and choose yes to discard changes
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesContinue).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Details')

        //choose cancel
        cy.get(Global.DiscardCancelBtn).scrollIntoView()
        Utilities.waitForElementVisible(Global.DiscardCancelBtn, 5000)
        cy.get(Global.DiscardCancelBtn).click()

        //confirm that CQL value is the same as it was prior to change and the save button is not available
        cy.reload()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')
        Utilities.waitForElementToNotExist(CQLLibraryPage.measureCQLGenericErrorsList, 5000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 5000)

        //make a change to the CQL but do not save
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}fgdfgfgdfg')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.includesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('contain.text', 'MATGlobalCommonFunctionsQDM')

        //attempt to edit and choose yes to discard changes
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Discard Changes?')
        cy.get(Global.discardChangesContinue).click()

        //confirm "Details" pop up
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Details')

        //make an edit
        Utilities.waitForElementVisible(CQLLibraryPage.editSavedLibraryAlias, 5000)
        cy.get(CQLLibraryPage.editSavedLibraryAlias).clear()
        cy.get(CQLLibraryPage.editSavedLibraryAlias).type('CommonEdited')

        //choose apply edit
        Utilities.waitForElementVisible(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        cy.get(CQLLibraryPage.applyEditsSavedLibraryBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library MATGlobalCommonFunctionsQDM has been successfully edited in the CQL')

        //Confirm the Edits for the library include statement have been applied to the CQL
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')
    })

    it('QDM: Edit Included Libraries functionality -- when changes to the CQL is saved', () => {

        //make a change and save changes
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on Includes tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //click edit on the page
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Details')

        //make an edit
        Utilities.waitForElementVisible(CQLLibraryPage.editSavedLibraryAlias, 5000)
        cy.get(CQLLibraryPage.editSavedLibraryAlias).clear()
        cy.get(CQLLibraryPage.editSavedLibraryAlias).type('CommonEdited')

        //choose apply edit
        Utilities.waitForElementVisible(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        Utilities.waitForElementEnabled(CQLLibraryPage.applyEditsSavedLibraryBtn, 5000)
        cy.get(CQLLibraryPage.applyEditsSavedLibraryBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library MATGlobalCommonFunctionsQDM has been successfully edited in the CQL')

        //Confirm the Edits for the library include statement have been applied to the CQL
        cy.get('[data-testid="editor-search-button"]').click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')

    })

    it('View Included QDM Library Details', () => {

        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //Click on View Details
        cy.get(CQLEditorPage.viewSavedLibrary).click()
        //Verify Alias and Version number fields are read only
        cy.get(CQLEditorPage.aliasName).should('contain.text', 'AliasCommon')
        cy.get('[data-testid="library-alias-container"] > .result-value').should('not.be.enabled')
        cy.get(CQLEditorPage.versionNumber).should('contain.text', 'Version8.0.000')
        cy.get('[data-testid="library-version-container"] > .result-value').should('not.be.enabled')
    })

    it('Verify all QDM Library versions are displayed while editing saved Libraries', () => {

        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //click edit on the page
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]', 5000)
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-7hqw69"]').should('contain.text', 'Details')

        //Confirm Library versions
        cy.get(CQLEditorPage.versionDropdownBtn).click()
        cy.get(CQLEditorPage.versionNumberList).should('contain.text', '8.0.0007.0.0006.0.0005.0.0004.0.0003.0.0002.0.0001.0.000')
    })

    it('Verify error message appears on Includes tab when there is an error in the Measure CQL', () => {

        //Navigate to Includes tab and verify no error message appears
        cy.get(CQLEditorPage.includesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Includes tab and verify saved Libraries appear
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')

        //Add errors to CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}define "test":')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Navigate to Parameters tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.savedLibrariesTab).click().should('contain.text', 'Saved Libraries (0)')
        cy.get('[class="Results___StyledTd-sc-18pioce-0 cBTZQp"]').should('contain.text', 'No Results were found')
    })

})
