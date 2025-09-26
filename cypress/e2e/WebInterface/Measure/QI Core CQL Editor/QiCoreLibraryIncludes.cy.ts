import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Qi-Core Library Includes fields', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit', 0)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure()
    })

    it('Search for Qi-Core Included Libraries', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for FHIR Library
        cy.get(CQLEditorPage.librarySearchTextBox).type('qdm')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('.Results___StyledTd-sc-18pioce-0').should('contain.text', 'No Results were found')

        //Search for QDM Libraries
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000YaHu1257View / ApplyVTE8.9.000YaHu1257View / ApplyVTE8.8.000YaHu1257View / ApplyVTE8.7.000YaHu1257View / ApplyVTE8.6.000YaHu1257View / ApplyItems per page 5.Items per page5​1 - 5 of 181234')
    })

    it('Apply Qi-Core Included library to the CQL and save', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000YaHu1257View / ApplyVTE8.9.000YaHu1257View / ApplyVTE8.8.000YaHu1257View / ApplyVTE8.7.000YaHu1257View / ApplyVTE8.6.000YaHu1257View / ApplyItems per page 5.Items per page5​1 - 5 of 181234')

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Library VTE has been successfully added to the CQL.')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('Verify error messages when same Library/Alias is applied twice', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000YaHu1257View / ApplyVTE8.9.000YaHu1257View / ApplyVTE8.8.000YaHu1257View / ApplyVTE8.7.000YaHu1257View / ApplyVTE8.6.000YaHu1257View / ApplyItems per page 5.Items per page5​1 - 5 of 181234')

        //Apply Library to CQL
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Library VTE has been successfully added to the CQL.')

        //Apply same Library again
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get('[data-testid="library-alias-input"]').type('VTE')
        cy.get('[data-testid="apply-button"]').click()
        cy.get('[class="toast info"]').should('contain.text', 'Library VTE has already been defined in the CQL.')

        //Apply different Library with duplicate Alias
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('fhir')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionCDSConnectCommonsForFHIRv4010.1.000pauld@mitre.orgView / ApplyFHIRCommon4.3.000julietrubiniView / ApplyFHIRCommon4.2.000julietrubiniView / ApplyFHIRCommon4.1.000julietrubiniView / ApplyFHIRCommon4.0.000julietrubiniView / ApplyItems per page 5.Items per page5​1 - 5 of 201234')
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
        cy.get('[data-test-id="row-0"]').find('td').eq(0).should('contain.text', 'FHIRHelpers') //Alias
        cy.get('[data-test-id="row-0"]').find('td').eq(1).should('contain.text', 'FHIRHelpers') //Name
        cy.get('[data-test-id="row-0"]').find('td').eq(2).should('contain.text', '4.1.000') //Version
        cy.get('[data-test-id="row-0"]').find('td').eq(3).should('contain.text', 'Angela.flanagan') //Owner
    })

    it('Qi Core: Delete Included Libraries functionality -- when changes to the CQL is not saved', () => {

        cy.get(Header.mainMadiePageButton).click()

        //make a change to CQL (don't save)
        MeasuresPage.actionCenter('edit', 0)

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

        Utilities.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '1 of 1')
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
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(TestCasesPage.tcSearchIcone).eq(0).click()
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
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + CqlLibraryName + ' version \'0.0.000\'using QICore version \'4.1.1\'codesystem "SNOMEDCT:2017-09": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'parameter "Measurement Period" Interval<DateTime>context Patientdefine "Surgical Absence of Cervix":    [Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy        where NoCervixHysterectomy.status = \'completed\'')

        //Deletes the library from the Saved Libraries grid
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (0)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })

    it('Qi Core: Delete Included Libraries functionality -- when changes to the CQL is saved', () => {

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
        Utilities.waitForElementVisible(CQLEditorPage.confirmationModal, 5000)
        cy.get(CQLEditorPage.confirmationModal).should('contain.text', 'Are you sure?')

        //choose yes to delete
        Utilities.waitForElementVisible(CQLEditorPage.deleteContinueButton, 5000)
        Utilities.waitForElementEnabled(CQLEditorPage.deleteContinueButton, 5000)
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Library FHIRHelpers has been successfully removed from the CQL')

        //Deletes the library include statement from the CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library ' + CqlLibraryName + ' version \'0.0.000\'using QICore version \'4.1.1\'codesystem "SNOMEDCT:2017-09": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'parameter "Measurement Period" Interval<DateTime>context Patientdefine "Surgical Absence of Cervix":    [Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy        where NoCervixHysterectomy.status = \'completed\'')

        //Deletes the library from the Saved Libraries grid
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab / number in parentheses has been updated
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (0)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.libraryResultsTable).find('[data-test-id="row-0"]').should('not.exist')
    })

    it('Qi Core: Edit Included Libraries functionality -- when changes to the CQL is not saved', () => {

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

        Utilities.clickOnKeepWorking()

        //confirm contents in CQL editor still contains changes and save button is still available
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '1 of 1')
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
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(TestCasesPage.tcSearchIcone).eq(0).click()
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
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')
    })

    it('Qi Core: Edit Included Libraries functionality -- when changes to the CQL is saved', () => {

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
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('fgdfgfgdfg')
        cy.get('[class="ace_search_counter"]').should('contain.text', '0 of 0')
    })

    it('Verify all Qi Core Library versions are displayed while editing saved Libraries', () => {

        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')
        cy.get(CQLEditorPage.savedLibrariesTab).click()

        //click edit on the page
        cy.get(CQLEditorPage.editSavedLibrary).scrollIntoView()
        Utilities.waitForElementVisible(CQLEditorPage.editSavedLibrary, 5000)
        cy.get(CQLEditorPage.editSavedLibrary).click()

        //confirm "Details" pop up --
        Utilities.waitForElementVisible('#draggable-dialog-title', 5000)
        cy.get('#draggable-dialog-title').should('contain.text', 'Details')

        //Confirm Library versions
        cy.get(CQLEditorPage.versionDropdownBtn).click()
        cy.get(CQLEditorPage.versionNumberList).should('contain.text', '4.4.0004.3.0004.2.0004.1.0004.0.0003.0.0002.0.0001.0.0000.1.000')
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

