import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

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
let measureQICoreCQL_with_different_Lib_name = 'library ' + newCQLTestCqlLibraryName + 'b' + ' version \'0.0.004\'\n' +


    'using QICore version \'4.1.0\'\n' +



    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +

    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +

    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +



    'parameter \"Measurement Period\" Interval<DateTime>\n' +



    'context Patient\n' +



    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

describe('Validate CQL Editor tab sticky footer', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
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
        MeasuresPage.measureAction("edit")

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

        //Create New Measure
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
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        cy.readFile('cypress/fixtures/cqlCQLEditor.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor window
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:3 | Could not resolve identifier SDE in the current library.ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from CQL Editor tab
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:3 | Could not resolve identifier SDE in the current library.ELM: 5:13 | Member SDE Sex not found for type null.")

    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when ' +
        'included library is not found', () => {

            //Click on Edit Measure
            MeasuresPage.measureAction("edit")

            //Click on the CQL Editor tab
            CQLEditorPage.clickCQLEditorTab()

            cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt').should('exist').then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
            })

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //Validate message on page
            CQLEditorPage.validateSuccessfulCQLUpdate()

            //Validate error(s) in CQL Editor after saving
            cy.scrollTo('top')
            cy.get(EditMeasurePage.cqlEditorTextBox).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
            Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, '"status\\":404,\\"error\\":\\"Not Found\\",\\"message\\":\\"Could not find resource Library with name: HospiceQICore4\\"}\\"')


        })
    // skipping due to bug 5077
    it.skip('Graceful error msg if model is missing in CQL', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR_model_error.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor after saving

        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 1:37 | Model Type and version are required')

    })

    it('Verify Library name and version are replaced with the actual Library Name and Version for the Measure', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

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
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

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
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/cqlSaveCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            //Validate message on page
            CQLEditorPage.validateSuccessfulCQLUpdate()

            cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}').type('concept Type B Hepatitis')

            //save the value in the CQL Editor
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            cy.get(EditMeasurePage.cqlEditorTextBox).should('contain', '/*CONCEPT DECLARATION REMOVED: CQL concept construct shall NOT be used.*/')

        })
    })

    it('Dirty Check Modal is displayed', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/cqlSaveCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(Header.mainMadiePageButton).click()

        cy.get(Global.dirtCheckModal).should('be.visible')
    })
})

describe('Measure: CQL Editor: valueSet', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    //Need to skip this test for now until we are able to manipulate the DB and remove the API Key and TGT from
    //Mongo DB with a DB connection or new API Call
    it.skip('UMLS Error: User Not Logged in', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLSave()

        cy.get(CQLEditorPage.umlsMessage).should('be.visible')
        cy.get(CQLEditorPage.umlsMessage).should('contain.text', 'Please log in to UMLS!')

    })

    it('Value Sets are valid', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

    })

    it('Value Set Invalid, 404', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4EntryInvalidValueSet.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

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
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/ValueSetTestingEntryInValid400.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

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

        //Create New Measure
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
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/CQLWithMultipleIncludedLibraries.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor after saving

        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 1:56 | Identifier FHIRHelpers is already in use in this library.')

    })
})
describe('Measure: CQL Editor: using line : QI Core', () => {

    beforeEach('Create measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newCQLTestMeasureName, newCQLTestCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newCQLTestMeasureName, newCQLTestCqlLibraryName)

    })
    it('Verify error message when there is no using statement in the CQL', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_without_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.pause()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'CQL updated successfully but was missing a Using statement.  Please add in a valid model and version.')

    })
    it('Verify error message when there is an using statement in the CQL, but it is not accurate', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_with_incorrect_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

    })
    it('Verify error message when there is an using statement in the CQL, but it is not accurate, and the library name used is not correct', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQICoreCQL_with_different_Lib_name)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

    })
})
describe('Measure: CQL Editor: using line : FHIR', () => {

    beforeEach('Create measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newCQLTestMeasureName, newCQLTestCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newCQLTestMeasureName, newCQLTestCqlLibraryName)

    })
    it('Verify error message when there is an using statement in the CQL, but it is invalid', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureFHIR_with_invalid_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.CQLMessageSuccess).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

    })
})
