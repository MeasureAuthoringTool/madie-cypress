import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now() + 1
let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let newMeasureName = ''
let newCqlLibraryName = ''

//skipping because currently the UMLS is retained and there is no way to clear it out
describe.skip('UMLS / VSAC error when user is not logged into UMLS', () => {
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
    //Need to skip this test for now until we are able to manipulate the DB and remove the API Key and TGT from
    //Mongo DB with a DB connection or new API Call
    it.skip('Verify proper error(s) appear in CQL Editor, when a user is not connected / logged into UMLS', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('cqlCQLEditor.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLSave()

        //Validate error(s) in CQL Editor window
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:3 | Could not resolve identifier SDE in the current library.", "ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from the page
        cy.get(Header.measures).click()

        //Navigate back to the CQL Editor page
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "ELM: 1:3 | Could not resolve identifier SDE in the current library.", "ELM: 5:13 | Member SDE Sex not found for type null.")

    })
})

describe('Validations around code system in Measure CQL', () => {

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

    it('Verify proper error(s) appear in CQL Editor, when codesystem URL is incorrect', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsURLIncorrect.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "VSAC: 0:110 | Invalid Code system")

    })

    it('Verify proper error(s) appear in CQL Editor, when a user includes version and there is no vsac version', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsVersionIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get('.page-header').click()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "VSAC: 0:72 | Version not found.")


    })

    it('Verify proper error(s) appear in CQL Editor, when a user does not include version and there is no vsac', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsVersionNotIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "VSAC: 0:91 | Unable to find a code system version")

    })


    it('Verify proper error(s) appear in CQL Editor, when a user provides no version and vsac exists', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsNoVersionVSACExists.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')


    })

    it('Verify proper error(s) appear in CQL Editor, when a user provides a FHIR version', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsFHIRVersionProvided.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')

    })

    it('Verify proper error(s) appear in CQL Editor, when user provides a FHIR version and there is no vsac version', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsFHIRVersionIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get('.page-header').click()

        //Validate error(s) in CQL Editor window
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "VSAC: 0:107 | Version not found.")

    })
})