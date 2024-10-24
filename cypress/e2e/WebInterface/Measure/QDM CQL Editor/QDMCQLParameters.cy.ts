import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import {Global} from "../../../../Shared/Global";
import { CallTracker } from "assert"

let measureName = 'QDMTestingParameters' + Date.now()
let CqlLibraryName = 'QDMParametersLibrary' + Date.now()
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
    '\ttrue\n' +
    'define fluent function "test"():\n' +
    '\t true\n'


describe.skip('QDM CQL Parameters', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate default Parameters tab and basic form functions', () => {
        /*
        scenario 1: validate Paramaters tab & form functions
        go to measure, edit

        CQL editor, collapse to show tabs

        parameters
            validate empty
            validate Saved tab in background ?
         
        enter name 
            check for special char
            check expanded
            buttons enable

        clear
            validate empty state
         */

        cy.get(CQLEditorPage.parametersTab).click()

        cy.get(CQLEditorPage.savedParametersTab).should('be.visible')

        // current focus
        cy.get(CQLEditorPage.parameterEntryTab).should('be.visible')
            .and('have.attr', 'aria-selected', 'true')

        cy.get(CQLEditorPage.parameterNameTextBox).should('not.have.value')

        cy.get(CQLEditorPage.clearParametersExpressionButton).should('be.disabled')
        cy.get(CQLEditorPage.applyParametersExpressionButton).should('be.disabled')

        cy.get(CQLEditorPage.parameterNameTextBox).type('&')

        cy.get(CQLEditorPage.nameTextBoxErrors).should('have.text', 'Only alphanumeric characters are allowed, no spaces.')

        // assert editor box expands
        cy.get('[data-testid="ChevronRightIcon"]').should('have.class', 'open')

        /* assert empty editor
            had to fall back to exist - css settings here make be.visible fail
        */
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').should('exist').and('not.have.text')

        cy.get(CQLEditorPage.parameterNameTextBox).clear()

        cy.get(CQLEditorPage.nameTextBoxErrors).should('have.text', 'Parameter Name is required')

        cy.get(CQLEditorPage.parameterNameTextBox).type('NamedParameter1')

        // assert buttons enable & click clear
        cy.get(CQLEditorPage.applyParametersExpressionButton).should('be.enabled')
        cy.get(CQLEditorPage.clearParametersExpressionButton).should('be.enabled').click()
        
        // assert defaults again
        cy.get(CQLEditorPage.parameterNameTextBox).should('not.have.value')

        cy.get(CQLEditorPage.clearParametersExpressionButton).should('be.disabled')
        cy.get(CQLEditorPage.applyParametersExpressionButton).should('be.disabled')
    })

    it('Confirm that valid options can be applied to the CQL and saved', () => {
        /*
         scenario 2: confirm apply to cql when options are valid

         enter valid

        apply
            check cql 
            check dirty state

        save measure

        */
        const paramName = 'NewParameter'

        cy.get(CQLEditorPage.parametersTab).click()

        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)
        
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has been successfully added to the CQL.`)

        // verify 2 parameters presents - 1 from initial CQL load, 1 we added in this test  
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)

        // verify exact text was inserted
        const formattedCql = 'parameter "NewParameter" Interval<DateTime>'
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', formattedCql)

        // verify clean tab but dirty measure
        cy.get(CQLEditorPage.parameterNameTextBox).should('not.have.value')
        cy.get(CQLEditorPage.clearParametersExpressionButton).should('be.disabled')
        cy.get(CQLEditorPage.applyParametersExpressionButton).should('be.disabled')

        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        // and perform discard
        cy.get(CQLEditorPage.discardChanges).should('be.enabled').click()
        cy.get(Global.discardChangesContinue).click()

        // same as above - verify only 1 parameter in cql
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 1)

        // add values again & repeat
        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)
        
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has been successfully added to the CQL.`)

        // verify 2 parameters presents - 1 from initial CQL load, 1 we added in this test  
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)

        cy.get(CQLEditorPage.saveCQLButton).click()

        CQLEditorPage.validateSuccessfulCQLUpdate()
    })

    it('Confirm that Parameter builder checks for duplicates', () => {
    /*
        scenario 3: verify duplicate check
        re-do with same name, check for blue toast
    */
        const paramName = 'NewParameter'

        cy.get(CQLEditorPage.parametersTab).click()

        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)
        
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has been successfully added to the CQL.`)

        // verify 2 parameters presents - 1 from initial CQL load, 1 we added in this test  
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)

        // enter duplicate
        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)
        
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()

        // check for duplicate toast
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has already been defined in CQL.`)

       // same as above, verify 2 parameters in document - duplicate not added
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)
    })
})

describe.skip('QDM CQL Parameters - Measure ownership Validations', () => {
   /*
    scenario 4:
    access non-owned measure
    verify no tab access
    */
    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.AltLogin()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Non Measure owner unable to access Parameters', () => {

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('view')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        // check Parameters tab disabled
        cy.get(CQLEditorPage.parametersTab).should('be.disabled')
        cy.get(CQLEditorPage.includesTab).should('be.enabled')
        cy.get(CQLEditorPage.definitionsTab).should('be.enabled')
    })
})
