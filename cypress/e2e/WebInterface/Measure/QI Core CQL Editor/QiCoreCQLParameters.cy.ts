import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { Global } from "../../../../Shared/Global";


let measureName = 'QiCoreParamsMeasure' + Date.now()
let CqlLibraryName = 'QiCoreParamsLibrary' + Date.now()
let measureCQL = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    ' default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    ' context Patient\n' +
    ' define "Initial Population":\n' +
    '   exists "Qualifying Encounters"\n' +
    '   define "Qualifying Encounters":\n' +
    '      (\n' +
    '          [Encounter: "Office Visit"]\n' +
    '                   union [Encounter: "Annual Wellness Visit"]\n' +
    '                            union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '                                     union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    '                                              union [Encounter: "Home Healthcare Services"]\n' +
    '                                               ) ValidEncounter\n' +
    '                                                       where ValidEncounter.period during "Measurement Period"\n' +
    '                                                                 and ValidEncounter.isFinishedEncounter()\n' +
    '          \n' +
    '                                                                 \n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '  (Enc E where E.status = \'finished\') is not null '


describe('Qi-Core CQL Parameters', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
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
            validate Saved tab in background
         
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

        // name textbox is empty
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

        // enter values
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

        // add values again
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

        // enter values
        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)

        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has been successfully added to the CQL.`)

        // verify 2 parameters presents - 1 from initial CQL load, 1 we added in this test  
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)

        // enter values again
        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)

        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })

        cy.get(CQLEditorPage.applyParametersExpressionButton).click()

        // validate duplicate toast
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', `Parameter ${paramName} has already been defined in CQL.`)

        // same as above, verify 2 parameters in document - duplicate not added
        cy.get(CQLEditorPage.mainCqlDocument).find('.ace_line:contains("parameter")').should('have.length', 2)
    })

    it('Verify Qi-Core CQL Parameters under Saved Parameters tab', () => {

        cy.get(CQLEditorPage.parametersTab).click()

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.savedParametersTab).click()

        Utilities.waitForElementVisible('[data-testid="parameters-row-0"] > :nth-child(1)', 75000)
        cy.get('[data-testid="parameters-row-0"] > :nth-child(1)').should('contain.text', 'Measurement Period')

    })

    it('Edit Saved Qi-Core CQL Parameters', () => {

        //Click on Parameters tab
        cy.get(CQLEditorPage.parametersTab).click()

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.savedParametersTab).click()
        cy.get(CQLEditorPage.editSavedCQLParameters).click()

        //Edit Parameter
        cy.get(CQLEditorPage.editParameterNameTextBox).clear().type('Measurement Period One')

        //Save
        cy.get(CQLEditorPage.saveParameterBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Parameter Measurement Period has been successfully updated.')
    })

    it('Dirty check pops up when there are changes in CQL and Edit parameters button is clicked', () => {

        //Make changes to CQL editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')

        //Click on Parameters tab
        cy.get(CQLEditorPage.parametersTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedParametersTab).click()
        cy.get(CQLEditorPage.editSavedCQLParameters).click()

        //Click on Discard changes
        Global.clickOnDiscardChanges()
        //cy.get(Global.discardChangesContinue).click()
        cy.get(CQLEditorPage.editParameterNameTextBox).should('be.visible')
    })

    it('Verify error message appears on Parameters tab when there is an error in the Measure CQL', () => {

        //Navigate to Parameters tab and verify no error message appears
        cy.get(CQLEditorPage.parametersTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Parameters tab and verify saved parameters appear
        cy.get(CQLEditorPage.savedParametersTab).should('contain.text', 'Saved Parameters (1)')

        //Add errors to CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}define "test":')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Navigate to Parameters tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.parametersTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.savedParametersTab).should('contain.text', 'Saved Parameters (0)').click()
        cy.get('[class="SavedParameters___StyledTd-sc-j0j2pa-0 gTsIka"]').should('contain.text', 'No Results were found')
    })
})

describe('Delete Saved Parameters', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, { measureCql: measureCQL })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('When form is dirty, ask to Discard Changes', () => {

        cy.get(CQLEditorPage.parametersTab).click()

        // insert parameter to make measure dirty
        const paramName = 'NewParameter'
        cy.get(CQLEditorPage.parameterNameTextBox).type(paramName)
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea.ace_text-input').type('Interval<DateTime>', { force: true })
        cy.get(CQLEditorPage.applyParametersExpressionButton).click()

        cy.get(CQLEditorPage.savedParametersTab).click()

        cy.get(CQLEditorPage.deleteSavedCQLParameters).click()

        // discard modal
        cy.get(CQLEditorPage.modalBody).within(modal => {
            cy.get('h2').should('have.text', 'Discard Changes?')

            cy.get(CQLEditorPage.modalXButton).should('be.visible')

            cy.get(CQLEditorPage.modalConfirmationText).should('have.text', 'You have unsaved changes.Are you sure you want to discard your changes?')

            cy.get(CQLEditorPage.modalActionWarning).should('have.text', 'This Action cannot be undone.')

            cy.get(CQLEditorPage.discardContinueButton).should('be.enabled')
            cy.get(CQLEditorPage.discardStayButton).should('be.enabled').click()
        })

        // confirm no action, still 1 saved parameter
        cy.get(CQLEditorPage.savedParametersTab).should('have.text', 'Saved Parameters (1)')

        cy.get(CQLEditorPage.deleteSavedCQLParameters).click()

        cy.get(CQLEditorPage.discardContinueButton).should('be.visible').click()

        // confirm measure is clean
        cy.get(CQLEditorPage.saveCQLButton).should('be.disabled')
    })


    it('When form is clean ask "Are you sure?"', () => {

        cy.get(CQLEditorPage.parametersTab).click()

        cy.get(CQLEditorPage.savedParametersTab).click()

        cy.get(CQLEditorPage.deleteSavedCQLParameters).click()

        // confirmation modal
        cy.get(CQLEditorPage.modalBody).within(modal => {
            cy.get('h2').should('have.text', 'Are you sure?')

            cy.get(CQLEditorPage.modalXButton).should('be.visible')

            cy.get(CQLEditorPage.modalConfirmationText).should('have.text', 'Are you sure you want to delete this Parameter?')

            cy.get(CQLEditorPage.modalActionWarning).should('have.text', 'This Action cannot be undone.')

            cy.get(CQLEditorPage.deleteCancelButton).should('be.enabled')
            cy.get(CQLEditorPage.deleteContinueButton).should('be.enabled').click()
        })

        cy.get(CQLEditorPage.saveSuccessMsg, { timeout: 6500 }).should('have.text', 'Parameter Measurement Period has been successfully removed from the CQL.')

        cy.get(CQLEditorPage.saveCQLButton).should('be.disabled')
    })
})

describe('Qi-Core CQL Parameters - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
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

        // check tabs are alll enabled
        cy.get(CQLEditorPage.includesTab).should('be.enabled')
        cy.get(CQLEditorPage.definitionsTab).should('be.enabled')
        cy.get(CQLEditorPage.parametersTab).should('be.enabled').click()

        // name disabled
        cy.get(CQLEditorPage.parameterNameTextBox).should('be.disabled')

        // editor hidden
        cy.get('[data-testid="ChevronRightIcon"]').should('not.have.class', 'open')
        cy.get('[data-testid="ChevronRightIcon"]').click()

        // cannot type in expanded editor
        cy.get(CQLEditorPage.parameterExpressionEditor)
            .find('textarea').should('have.attr', 'readonly')

        // clear & appply disabled
        cy.get(CQLEditorPage.clearParametersExpressionButton).should('be.disabled')
        cy.get(CQLEditorPage.applyParametersExpressionButton).should('be.disabled')

    })

    it('Verify Non Measure owner unable to Edit/Delete saved Parameters', () => {

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('view')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Saved Parameters tab
        cy.get(CQLEditorPage.parametersTab).click()
        cy.get(CQLEditorPage.savedParametersTab).click()

        //Edit button should not be visible
        Utilities.waitForElementVisible('[data-testid="parameters-row-0"]', 60000)
        cy.get(CQLEditorPage.editSavedCQLParameters).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteSavedCQLParameters).should('not.exist')

    })
})
