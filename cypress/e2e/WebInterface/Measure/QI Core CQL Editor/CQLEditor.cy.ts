import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage";

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'TestMeasure' + Date.now() + 1
let newMeasureName = ''
let newCqlLibraryName = ''

let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let newCQLTestMeasureName = measureName + randValue
let newCQLTestCqlLibraryName = CqlLibraryName + randValue
let measureFHIR_with_invalid_using = MeasureCQL.ICF_FHIR_with_invalid_using
let measureQICoreCQL_without_using = MeasureCQL.ICFCleanTestQICore_CQL_without_using
let measureQICoreCQL_with_incorrect_using = MeasureCQL.ICFCleanTestQICore_CQL_with_incorrect_using
let measureQICoreCQL_with_different_Lib_name = 
    'library ' + newCQLTestCqlLibraryName + 'b' + ' version \'0.0.004\'\n' +
    'using QICore version \'4.1.0\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

let qdmUsingStatementCql = 'library TestCql1733741911531 version \'0.0.000\'\n' +
                                '\n' +
                                'using QDM version \'5.6\'\n\n' +
                                '\n' +
                                'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
                                '\n' +
                                'parameter "Measurement Period" Interval<DateTime>\n' +
                                '\n' +
                                'context Patient'

let fhirUsingStatement = 'library TestLibrary17337661869931379 version \'0.0.000\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient'

let fhirandQicoreUsingStatements = 'library TestLibrary17337661869931379 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient'


describe('Validate CQL Editor tab sticky footer', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Validate Save and Discard buttons -- text, functionality, and availability', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //write CQL value into CQL Editor
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //Save CQL button should be available
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        //Discard CQL button should be available
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //discard entry
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).click()

        Global.clickOnDiscardChanges()

        //confirm that CQL Editor object is empty
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', '')
    })

})

describe('Measure: CQL Editor', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        cy.readFile('cypress/fixtures/cqlCQLEditor.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor window - need to validate separately, cannot guarantee they will appear in order
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from CQL Editor tab
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor windows
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")
    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when ' +
        'included library is not found', () => {

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')

            //Click on the CQL Editor tab
            CQLEditorPage.clickCQLEditorTab()

            cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt').should('exist').then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
            })

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //Validate message on page
            cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

            //Validate error(s) in CQL Editor after saving
            cy.scrollTo('top')
            cy.get(EditMeasurePage.cqlEditorTextBox).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
            Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:55 | Library resource HospiceQICore4 version '2.0.000' is not found")
    })

    it('Verify Library name and version are replaced with the actual Library Name and Version for the Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Validate message on page
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate the lack of error(s) in CQL Editor
        cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')

        cy.get(EditMeasurePage.cqlEditorTextBox).contains(newCqlLibraryName)
        cy.get(EditMeasurePage.cqlEditorTextBox).contains('version \'0.0.000\'')

        //Navigate away from the page
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor persists after saving
        cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')
    })

    it('CQL updates when CQL Library name is updated in Measure Details', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate the lack of error(s) in CQL Editor
        cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')

        //Navigate away from the page
        cy.get(EditMeasurePage.measureDetailsTab).click()

        cy.get(EditMeasurePage.cqlLibraryNameTextBox).clear()
        cy.get(EditMeasurePage.cqlLibraryNameTextBox).type(newCqlLibraryName + 'TEST')

        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.get(EditMeasurePage.cqlEditorTextBox).contains(newCqlLibraryName + 'TEST')
    })

    it('Verify error appears on CQL Editor when concept construct is used', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/cqlSaveCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //Validate message on page
            cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')


            cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}').type('concept Type B Hepatitis')

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).should('contain', '/*CONCEPT DECLARATION REMOVED: CQL concept construct shall NOT be used.*/')
        })
    })

    it('Dirty Check Modal is displayed', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/cqlSaveCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(Header.mainMadiePageButton).click()

        cy.get('.MuiBox-root').should('contain.text', 'Discard Changes?')
    })

    it('Verify error message if FHIR Helpers is missing in CQL', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/QICoreCQL_MissingFHIRHelpers_Error.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Validate message on page
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get('[data-testid="generic-errors-text-list"]').should('contain.text', 'Row: 1, Col:0: ELM: 0:0 | FHIRHelpers is required as an included library for QI-Core. Please add the appropriate version of FHIRHelpers to your CQL.')

        //Validate error(s) in CQL Editor after saving
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 0:0 | FHIRHelpers is required as an included library for QI-Core. Please add the appropriate version of FHIRHelpers to your CQL.')
    })

    it('Verify error message when CQL is missing keyword "Context"', () => {

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLCsFHIRVersionProvided.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get('[data-testid="generic-errors-text-list"]').should('contain.text', 'ELM: 0:0 | Measure CQL must contain a Context.')
        cy.get('[data-testid="ErrorIcon"]').should('be.visible')

        // nav away & return to same error
        cy.get(EditMeasurePage.measureDetailsTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get('[data-testid="generic-errors-text-list"]').should('contain.text', 'ELM: 0:0 | Measure CQL must contain a Context.')
        cy.get('[data-testid="CancelIcon"]').should('be.visible')

    })

    it('FHIRHelpers alias name is defaulted, when CQL has incorrect alias name', () => {

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLWithInvalidFHIRHelpersAlias.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'FHIRHelpers was incorrectly aliased. MADiE has overwritten the alias with \'FHIRHelpers\'.')
    })

    it('Verify error message if CQL contains access modifiers like private or public', () => {

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLWithPrivateAccessModifier.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(CQLEditorPage.errorMsg).should('contain.text', 'Access modifiers like Public and Private can not be used in MADiE.')
    })
})

describe('Measure: CQL Editor: valueSet', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Value Sets are valid', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
    })

    it('Value Set Invalid, 404', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4EntryInvalidValueSet.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(CQLEditorPage.umlsMessage).should('not.exist')

        //Validate error(s) in CQL Editor window
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "VSAC: 0:102 | Request failed with status code 404 for oid = 2.16.840.1.113883.3.464.1003.110.12.1059999 " +
            "location = 36:0-36:102")
    })

    it('Value Set Invalid, 404 undefined', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/ValueSetTestingEntryInValid400.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(CQLEditorPage.umlsMessage).should('not.exist')

        //Validate error(s) in CQL Editor window
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 18:0-18:22')
    })
})

describe('CQL errors with included libraries', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify errors appear on CQL Editor page when multiple versions of CQL library is included ', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLWithMultipleIncludedLibraries.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page -- fails here?
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor after saving

        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 0:0 | Library FHIRHelpers is already in use in this library.')
    })

    it('Verify error message on CQL Editor page when an include statement is missing the version', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/QiCoreCQLWithoutIncludedLibraryVersion.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page -- fails here?
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Validate error(s) in CQL Editor after saving

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).scrollIntoView()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLLibraryPage.errorInCQLEditorWindow).should('be.visible')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLLibraryPage.errorInCQLEditorWindow).invoke('show').click({ force: true, multiple: true })
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', 'ELM: 1:49 | include MATGlobalCommonFunctions statement is missing version. Please add a version to the include.')
    })
})

describe('Measure: CQL Editor: using line : QI Core', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newCQLTestMeasureName, newCQLTestCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newCQLTestMeasureName, newCQLTestCqlLibraryName)
    })

    it('Verify error message when there is no using statement in the CQL', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_without_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        Utilities.waitForElementVisible(CQLLibraryPage.libraryWarning, 25000)

        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Missing a using statement. Please add in a valid model and version.')
    })

    it('Verify error message when there is an using statement in the CQL, but it is not accurate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_with_incorrect_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })

    it('Verify error message when there is an using statement in the CQL, but it is not accurate, and the library name used is not correct', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_with_different_Lib_name)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })

    it('Verify QDM using statement is replaced by QI-CORE using statement', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(qdmUsingStatementCql)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).contains('QICore')

        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })
})

describe('Measure: CQL Editor: using line : FHIR', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newCQLTestMeasureName, newCQLTestCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newCQLTestMeasureName, newCQLTestCqlLibraryName)
    })

    it('Verify error message when there is an using statement in the CQL, but it is invalid', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureFHIR_with_invalid_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })

    it('Verify FHIR using statement can be used for QI-Core measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(fhirUsingStatement)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).contains('using FHIR version \'4.0.1\'')

        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('not.contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })

    it('Verify FHIR and QICORE using statements can be used at the same time', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(fhirandQicoreUsingStatements)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).contains('using QICore version \'4.1.1\'')
        cy.get(EditMeasurePage.cqlEditorTextBox.valueOf().toString()).contains('using FHIR version \'4.0.1\'')

        cy.get(CQLLibraryPage.libraryWarning).children().first().should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLLibraryPage.libraryWarning).children().last().should('not.contain.text', 'Incorrect using statement(s) detected. MADiE has corrected it.')
    })
})
