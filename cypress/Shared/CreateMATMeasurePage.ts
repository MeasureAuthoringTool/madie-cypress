import {Environment} from "./Environment"

export class CreateMATMeasurePage {

//MAT Login
    public static readonly userName = '#okta-signin-username'
    public static readonly password = '#okta-signin-password'
    public static termsAndConditions = '.custom-checkbox > label'
    public static signinButton = '#okta-signin-submit'
//UMLS Login
    public static readonly UMLS = ':nth-child(1) > .loginSpacer > :nth-child(1) > .btn > span'
    public static readonly API_Key = '#inputPwd'
    public static readonly connectToUMLSBtn = '#umlsSubmitButton'
    public static readonly UMLS_continue = ':nth-child(3) > .btn'
//MAT Logout
    public static readonly userprofile = '#userprofile > .fa'
    public static readonly signout = '.open > .dropdown-menu > :nth-child(6) > a'
    public static readonly spinner = '.spinner-loading'
//Createnewmeasure
    public static readonly measureName = '#MeasureNameTextArea'
    public static readonly modelradioFHIR = '#gwt-uid-3'
    public static readonly cqlLibraryName = '#CqlLibraryNameTextArea'
    public static readonly shortName = '#ShortNameTextBox'
    public static readonly measureScoringListBox = '#measScoringInput_ListBoxMVP'
    public static readonly patientBasedMeasureListBox = '#patientBasedMeasure_listbox'
    public static readonly saveAndContinueBtn = '#SaveAndContinueButton_measureDetail'
    public static readonly confirmationContinueBtn = '#yes_Button'
//Measure Details
    public static readonly measureStewardDeveloper = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Measure Steward / Developer"]'
    public static readonly description = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Description"]'
    public static readonly measureType = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Measure Type"]'
    public static readonly rationale = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Rationale"]'
    public static readonly clinicalRecommendation = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Clinical Recommendation"]'
    public static readonly guidance = '#measureDetailsNavigation_measureDetailsNavigationPills > [title="Guidance"]'
// Global Elements
    public static readonly saveBtn = '[title="Save"]'
    public static readonly measureDetailsWarningMessage = ':nth-child(2) > :nth-child(1) > table > tbody > :nth-child(1) > td > #WarningMessage'
    public static readonly textAreaInput = '.gwt-TextArea'
    public static readonly row1CheckBox = ':nth-child(4) > [__gwt_row="0"] > .GB-MJYKBBD > div > input'
// General Measure Information
    public static readonly populationBasisListbox = ':nth-child(4) > :nth-child(1) > .generalInformationPanel > tbody > :nth-child(2) > td > #measScoringInput_ListBoxMVP'
// Measure Steward / Developer
    public static readonly measureStewardListBox = '#stewardListBox'
//tabs
    public static readonly cqlWorkspace = '#CQL\\ Workspace'
    public static readonly populationWorkspace = '#Population\\ Workspace'
    public static readonly measurePackager = '#Measure\\ Packager'
//left menu
    public static readonly includes = '#includesLabel_Label'
    public static readonly valueSets = '#valueSetLabel_Label'
    public static readonly codes = '#codesLabel_Label'
    public static readonly definition = '#defineLabel_Label'
    public static readonly functionMeasureComposer = '#functionLibLabel_label'
    public static readonly cqlLibraryEditor = '#cqlLibraryEditor_Anchor'
//Global
    public static readonly cqlWorkspaceTitleGlobal = '#vPanel_VerticalPanel > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > .gwt-HTML > h4 > b'
    public static readonly cqlWorkspaceTitleGlobal2 = '.topping > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > .gwt-HTML > h4 > b'
    public static readonly measureComposerwarningMessage = 'td > #WarningMessage'
    public static readonly applyBtn = ':nth-child(2) > :nth-child(1) > table > tbody > :nth-child(1) > td > .btn-toolbar > .btn-primary'
    public static readonly addNewBtn = '#Add_New_ID'
    public static readonly availableDatatypesListBox = '#listDataType'
//Measure Details > General Measure Information
    public static readonly cqlWorkspaceTitleGeneralInformation = 'h4 > b'
//Includes
    public static readonly libraryAliasInputBox = '#aliasNameField_IncludeSection'
    public static readonly measureComposerSearchInputBox = ':nth-child(2) > td > .input-group > .form-control'
    public static readonly cqlLibrarysearchBtn = ':nth-child(2) > td > .input-group > .input-group-btn > .btn'
    public static readonly availableLibrariesRow1checkbox = '[__gwt_row="0"] > .GB-MJYKBLD > div > table > tbody > tr > .emptySpaces > input'
    public static readonly saveIncludes = '#saveButton_includes'
    public static readonly includesListItems = '#includesNameListBox_ListBox > option'
//Value Sets
    public static readonly OIDInput = '[style="padding: 10px; border: 1px solid rgb(232, 239, 247); margin-bottom: 10px;"] > :nth-child(1) > :nth-child(2) > td > .form-control'
    public static readonly retrieveOIDBtn = ':nth-child(2) > td > .btn'
//Codes
    public static readonly codeUrlInput = ':nth-child(2) > td > .input-group > .form-control'
    public static readonly retrieveBtn = ':nth-child(2) > td > .input-group > .input-group-btn > .btn'
//Definition
    public static readonly definitionNameInput = '#defineNameField'
    public static readonly definitionCQLExpressionEditorInput = '#definition_CQLEditor'
    public static readonly definitionSaveBtn = '#saveButton_definition'
//Function
    public static readonly functionNameInput = '#FunctionNameField'
    public static readonly addArgument = '#Add_Argument_ID'
    public static readonly argumentNameInput = '#inputArgumentName'
    public static readonly selectQDMDatatypeObject = '#listSelectItem'
    public static readonly addBtn = '#Yes_addFxnArgsBox'
    public static readonly functionCQLExpressionEditorInput = '#function_CQLEditor'
    public static readonly functionSaveBtn = '#saveButton_function'
    public static readonly closeBtn = '#No_addFxnArgsBox'
//CQL Library Editor
    public static readonly cqlWorkspaceTitleCQLLibraryEditor = '#cqlLibraryEditor_Id > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > .gwt-HTML > h4 > b'
//Population Workspace
    public static readonly initialPopulation = '#Initial\\ Populations_Anchor'
    public static readonly measurePopulations = '#Measure\\ Populations_Anchor'
    public static readonly measureObservations = '#Measure\\ Observations_Anchor'
//Population Workspace Initial Population
    public static readonly initialPopulationDefinitionListBox = '#definitionList_Initial\\ Population\\ 1'
    public static readonly initialPopulationSaveBtn = '#saveButton_Initial\\ Population'
//Population Workspace Measure Populations
    public static readonly measurePopulationsDefinitionListBox = '#definitionList_Measure\\ Population\\ 1'
    public static readonly measurePopulationsSaveBtn = '#saveButton_Measure\\ Population'
//Population Workspace Measure Observations
    public static readonly measureObservationsAggregateFunctionListBox = ':nth-child(2) > #definitionList_Measure\\ Observation\\ 1'
    public static readonly measureObservationsFunctionListBox = ':nth-child(3) > #definitionList_Measure\\ Observation\\ 1'
    public static readonly measureObservationsSaveBtn = '#saveButton_Measure\\ Observations'
//Measure Packager
    public static readonly populationsListItems = '#LeftPackagePanel .GB-MJYKBEB > Div > [__idx]'
    public static readonly addAllItemsToGrouping = '#AddAllClauseToRight'
    public static readonly saveGrouping = '#Save_Grouping_button'
    public static readonly measureGroupingTable = '#MeasureGroupingCellTable'
    public static readonly createMeasurePackageBtn = '#Create_Measure_Package_button'
    public static readonly packageWarningMessage = '#WarningMessage > .gwt-HTML'
//Tab menu navigation
    public static readonly measureLibraryTab = '#Measure\\ Library'
//new Measure
    public static readonly newMeasureButton = '#newMeasure_button'
//search
    public static readonly searchBtn = '#SearchWidgetButton_forMeasure'
    public static readonly searchInputBox = '#SearchFilterWidget_SearchInputHPanel_forMeasure > tbody > tr > td > input'
    public static readonly selectMeasureCheckbox = '#MeasureSearchCellTable > tbody:nth-child(3) > tr > td.GB-MJYKBJI.GB-MJYKBLI.GB-MJYKBMI > div > input[type=checkbox]'
//Measure Search Button Bar
    public static readonly exportMeasureSearchBtn = '#MeasureSearchCellTable_gridToolbar > [aria-label="Click to export"]'
// Export UI
    public static readonly openExportBtn = '#exportTab > :nth-child(1) > .btn-toolbar > [title="Open"]'
    public static readonly transferToMadieRadioBtn = ':nth-child(5) > td > .gwt-RadioButton > label'
    public static readonly measureTransferSuccessMsg = '#exportTab > :nth-child(1) > [style="width: 625px;"] > tbody > :nth-child(1) > td > #WarningMessage'


    public static MATLogin() : void {
        cy.visit(Environment.credentials().matUrl)
        cy.get(this.userName).type(Environment.credentials().harpUser)
        cy.get(this.password).type(Environment.credentials().password)
        cy.get(this.termsAndConditions).click()
        cy.get(this.signinButton).click()
        this.UMLSLogin()
    }

    public static UMLSLogin() : void {
        cy.get(this.UMLS).click()
        cy.wait(500)
        this.waitForElementEnabled(this.API_Key, 100)
        this.visibleWithTimeout(this.API_Key, 100)
        this.enabledWithTimeout(this.API_Key, 100)
        cy.wait(1500)
        this.enterText(this.API_Key, Environment.credentials().API_Key)
        this.visibleWithTimeout(this.connectToUMLSBtn, 100)
        this.enabledWithTimeout(this.connectToUMLSBtn, 100)
        cy.get(this.connectToUMLSBtn).click()
        this.visibleWithTimeout(this.UMLS_continue, 100)
        this.enabledWithTimeout(this.UMLS_continue, 100)
        cy.get(this.UMLS_continue).click()
    }

    public static MATLogout() : void {
        this.visibleWithTimeout(this.userprofile, 100)
        cy.get(this.userprofile).click({force: true})
        this.visibleWithTimeout(this.signout, 100)
        cy.get(this.signout).click({force: true})
    }

    public static waitForElementEnabled(element, timeout) :void {
        cy.get(element, { timeout: timeout }).should('be.enabled')
    }

    public static enabledWithTimeout(element, timeout) :void {
        let time
        if (timeout === undefined) {
            time = 60000
        } else {
            time = timeout
        }
        cy.get(element, { timeout: time }).should('be.enabled')
    }

    public static visibleWithTimeout (element, timeout)  :void{
        let time
        cy.log('Element->' + element)
        if (timeout === undefined) {
            time = 60000
        } else {
            time = timeout
        }
        cy.get(element, {timeout: time}).should('be.visible')
    }

    public static enterText (el, text) :void {
        cy.get(el).clear().type(text, { delay: 50 })
    }

    public static verifySpinnerAppearsAndDissappears() :void {
        this.spinnerNotVisible()
        cy.wait(1500)
    }

    public static spinnerNotVisible () :void {
        this.notVisibleWithTimeout('.spinner-loading', 120000)
        this.notVisibleWithTimeout('.spinner-loading', 120000)
    }

    public static notVisibleWithTimeout(element, timeout) :void {
        let time
        if (timeout === undefined) {
            time = 400000
        } else {
            time = timeout
        }
        cy.get(element, { timeout: time }).should('not.be.visible')
    }

    public static waitToContainText (element, text, timeout) :void {
        cy.get(element, { timeout: timeout }).should('contain', text)
    }

    public static addCode (codeUrl) :void {
        cy.get(CreateMATMeasurePage.codes).click()
        this.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleGlobal, 'Codes', 100)
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.codeUrlInput, 100)
        this.enabledWithTimeout(CreateMATMeasurePage.codeUrlInput, 100)
        cy.get(CreateMATMeasurePage.codeUrlInput).click()
        cy.get(CreateMATMeasurePage.codeUrlInput).type(codeUrl, { delay: 50 })
        cy.get(CreateMATMeasurePage.retrieveBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.applyBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
    }

    public static addDefinition (definitionName, CQL) :void {
        cy.get(CreateMATMeasurePage.definition).click()
        this.verifySpinnerAppearsAndDissappears()
        this.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleGlobal2, 'Definition', 100)
        cy.get(CreateMATMeasurePage.addNewBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.definitionNameInput).type(definitionName, { delay: 50 })
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.definitionCQLExpressionEditorInput, 100)
        cy.wait(1500)
        this.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.definitionCQLExpressionEditorInput).type(CQL, { delay: 50, parseSpecialCharSequences: false })
        cy.get(CreateMATMeasurePage.definitionSaveBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
        cy.get(CreateMATMeasurePage.measureComposerwarningMessage).contains('successfully saved')
    }

    public static addValueSet(OID) :void {
        this.verifySpinnerAppearsAndDissappears()
        cy.get(CreateMATMeasurePage.valueSets).click()
        this.waitToContainText(CreateMATMeasurePage.cqlWorkspaceTitleGlobal, 'Value Sets', 100)
        cy.get(CreateMATMeasurePage.OIDInput).type(OID, { delay: 50 })
        cy.get(CreateMATMeasurePage.retrieveOIDBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        this.verifySpinnerAppearsAndDissappears()
        this.waitForElementEnabled(CreateMATMeasurePage.applyBtn, 100)
        cy.get(CreateMATMeasurePage.applyBtn).click()
        this.verifySpinnerAppearsAndDissappears()
        this.verifySpinnerAppearsAndDissappears()
        CreateMATMeasurePage.visibleWithTimeout(CreateMATMeasurePage.measureComposerwarningMessage, 100)
    }
}

