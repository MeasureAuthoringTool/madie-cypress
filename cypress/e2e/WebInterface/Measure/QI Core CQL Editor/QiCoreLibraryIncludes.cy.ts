import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Qi-Core Library Includes fields', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.SessionLogin()

        MeasuresPage.actionCenter('edit', 0)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        
        Utilities.deleteMeasure()
        OktaLogin.UILogout()
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
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000yahu1257View ' +
            '/ ApplyVTE8.9.000yahu1257View / ApplyVTE8.8.000yahu1257View / ApplyVTE8.7.000yahu1257View / ApplyVTE8.6.000yahu1257View ' +
            '/ ApplyItems per page 5.Items per page5​1 - 5 of 181234')
    })

    it('Apply Qi-Core Included library to the CQL and save', () => {

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for Library
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000yahu1257View ' +
            '/ ApplyVTE8.9.000yahu1257View / ApplyVTE8.8.000yahu1257View / ApplyVTE8.7.000yahu1257View / ApplyVTE8.6.000yahu1257View ' +
            '/ ApplyItems per page 5.Items per page5​1 - 5 of 181234')

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
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionVTE8.10.000yahu1257View ' +
            '/ ApplyVTE8.9.000yahu1257View / ApplyVTE8.8.000yahu1257View / ApplyVTE8.7.000yahu1257View / ApplyVTE8.6.000yahu1257View ' +
            '/ ApplyItems per page 5.Items per page5​1 - 5 of 181234')

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
        cy.get(CQLEditorPage.librarySearchTable).should('include.text', 'nameversionownerActionCDSConnectCommonsForFHIRv4010.1.000pauld@mitre.orgView / ApplyFHIRCommon4.3.000julietrubiniView / ApplyFHIRCommon4.2.000julietrubiniView / ApplyFHIRCommon4.1.000julietrubiniView / ApplyFHIRCommon4.0.000julietrubiniView / ApplyItems per page 5.Items per page5​1 - 5 of 191234')
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
        cy.get('[data-test-id="row-0"]').find('td').eq(3).should('contain.text', 'angela.flanagan') //Owner
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

    // old defect to watch with this scenario https://jira.cms.gov/browse/MAT-9107
    it('Verify error message appears on Includes tab when there is an error in the Measure CQL', () => {

        const brokenCql = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
        'using QICore version \'4.1.0\'\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        'codesystem "SNOMEDCT:2017-09": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
        'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
        'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "test":\n' +
        'define "Surgical Absence of Cervix":\n' +
        '\t[Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy\n' +
        '\t\twhere NoCervixHysterectomy.status = \'completed\''

        //Navigate to Includes tab and verify no error message appears
        cy.get(CQLEditorPage.includesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Includes tab and verify saved Libraries appear
        cy.get(CQLEditorPage.savedLibrariesTab).should('contain.text', 'Saved Libraries (1)')

        //Add errors to CQL — use Ace editor API to set value directly
        //instead of slow/unreliable cy.type() which types char-by-char
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.window().then((win: any) => {
            const editor = win.document.querySelector('.ace_editor') as any
            const aceEditor = editor?.env?.editor
            if (aceEditor) {
                aceEditor.setValue(brokenCql)
                aceEditor.clearSelection()
            }
        })
        // Trigger a small keystroke so React detects the change and enables Save
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd} {backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)

        //Navigate to Parameters tab — expand CQL builder if collapsed
        cy.get('body').then(($body) => {
            if ($body.find(CQLEditorPage.expandCQLBuilder).length > 0) {
                cy.get(CQLEditorPage.expandCQLBuilder).click()
            }
        })
        cy.get(CQLEditorPage.includesTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.savedLibrariesTab).click().should('contain.text', 'Saved Libraries (0)')
        cy.get('[class="Results___StyledTd-sc-18pioce-0 cBTZQp"]').should('contain.text', 'No Results were found')
    })
})

