import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

const now = Date.now()
const measureName = 'CQLCodeSystem' + now
const CqlLibraryName = 'CQLCodeSystemLib' + now

const expectSaveMessage = (expectedMessage: string) => {
    cy.get(CQLEditorPage.saveAlertMessage)
        .find(TestCasesPage.importTestCaseSuccessInfo)
        .should('contain.text', expectedMessage)
}

const returnToCqlEditor = () => {
    cy.get(EditMeasurePage.measureGroupsTab).click()
    CQLEditorPage.clickCQLEditorTab()
    cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')
}

const expectEditorErrorAfterTabSwitch = (expectedError: string) => {
    returnToCqlEditor()
    cy.get(CQLEditorPage.errorMsg).should('contain', expectedError)
}

const expectNoEditorErrorsAfterTabSwitch = () => {
    returnToCqlEditor()
    cy.get(CQLEditorPage.errorInCQLEditorWindow).should('not.exist')
}

describe('Validations around code system in Measure CQL', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Verify proper error(s) appear in CQL Editor, when codesystem URL is incorrect', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsURLIncorrect.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(3) Errors:Row: 11, Col:0: ELM: 0:0 | Measure CQL must contain a Context.Row: 7, Col:0: VSAC: 0:110 | Unable to find a code system version')

        //Validate error(s) in CQL Editor window
        expectEditorErrorAfterTabSwitch("VSAC: 0:110 | Unable to find a code system version")
    })

    it('Verify proper error(s) appear in CQL Editor, when a user includes version and there is no vsac version', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsVersionIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(2) Errors:Row: 11, Col:0: ELM: 0:0 | Measure CQL must contain a Context.Row: 7, Col:0: VSAC: 0:72 | Version not found.')

        //Validate error(s) in CQL Editor window
        expectEditorErrorAfterTabSwitch("VSAC: 0:72 | Version not found.")
    })

    it('Verify proper error(s) appear in CQL Editor, when a user does not include version and there is no vsac', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsVersionNotIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(2) Errors:Row: 11, Col:0: ELM: 0:0 | Measure CQL must contain a Context.Row: 10, Col:0: Code: 0:57 | Code not found.')

        //Validate error(s) in CQL Editor window
        expectEditorErrorAfterTabSwitch("Code: 0:57 | Code not found.")
    })

    it('Verify proper error(s) appear in CQL Editor, when a user provides no version and vsac exists', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsNoVersionVSACExists.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(1) Error:Row: 9, Col:0: ELM: 0:0 | Measure CQL must contain a Context.')

        //Validate error(s) in CQL Editor window
        expectNoEditorErrorsAfterTabSwitch()
    })

    it('Verify proper error(s) appear in CQL Editor, when a user provides a FHIR version', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsFHIRVersionProvided.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(1) Error:Row: 9, Col:0: ELM: 0:0 | Measure CQL must contain a Context.')

        //Validate error(s) in CQL Editor window
        expectNoEditorErrorsAfterTabSwitch()
    })

    it('Verify proper error(s) appear in CQL Editor, when user provides a FHIR version and there is no vsac version', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLCsFHIRVersionIncludedNoVSAC.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(2) Errors:Row: 11, Col:0: ELM: 0:0 | Measure CQL must contain a Context.Row: 7, Col:0: VSAC: 0:107 | Version not found.')

        //Validate error(s) in CQL Editor window
        expectEditorErrorAfterTabSwitch("VSAC: 0:107 | Version not found.")
    })

    it('Verify proper error(s) appear in CQL Editor, when user provides invalid value set format ', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('CQLFileWithInvalidValuesetURL.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        expectSaveMessage('CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(2) Errors:Row: 10, Col:0: ELM: 0:0 | Measure CQL must contain a Context.Row: 8, Col:0: VSAC: 0:125 | "\'http://cts.nlm.nih.gov/INCORRECT/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"')

        //Validate error(s) in CQL Editor window
        returnToCqlEditor()
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('contain', 'Row: 8, Col:0: VSAC: 0:125 | "\'http://cts.nlm.nih.gov/INCORRECT/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"')
    })
})
