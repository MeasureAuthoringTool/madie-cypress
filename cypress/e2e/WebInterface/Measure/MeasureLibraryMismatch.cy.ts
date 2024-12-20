import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

const now = Date.now()
const measureName = 'MismatchMeasure' + now
const libraryName = 'MismatchMeasureLib' + now

/*
    Disclaimer: these tests are relying on existing, commonly used libraries 
    instead of being self-contained & making their own libraries as part of the test.
    If they are all failing, the cause may be not being able to fetch libraries.
    QDM 5.6: QDMCommon 1.0.000
    QiCore 4.1.1: CQMCommon 2.2.000
    QiCore 6.0.0: SupplementalDataElements 4.0.000
    FHIR 4.0.1: FHIRHelpers 4.4.000
*/

describe('Mismatch between measure model and library model -- error state', () => {

    afterEach('Logout and Clean up Measure', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('QDM 5.6 measure, add QiCore 4.1.1 library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/QdmMeasureQicore4Lib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.QDM)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        const expectedError = 'Library model and version does not match the Measure model and version for name: CQMCommon, version: 2.2.000'
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, expectedError)
    })
    // could add QDM 5.6 measure, add QiCore 6.0.0 library - skipping for now

    it('QiCore 4.1.1 measure, add QDM 5.6 library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/Qicore4MeasureQdmLib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore4)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        const expectedError = 'Library model and version does not match the Measure model and version for name: QDMCommon, version: 1.0.000'
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, expectedError)   
    })
    // could add QiCore 6.0.0 measure, add QDM 5.6 library - skipping for now

    it('QiCore 4.1.1 measure, add QiCore 6.0.0 library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/Qicore4MeasureQicore6Lib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore4)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        const expectedError = 'Library model and version does not match the Measure model and version for name: SupplementalDataElements, version: 4.0.000'
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, expectedError)        
    })

    it('QiCore 6.0.0 measure, add QiCore 4.1.1  library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/Qicore6MeasureQicore4Lib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        const expectedError = 'Library model and version does not match the Measure model and version for name: CQMCommon, version: 2.2.000'
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, expectedError)
    })
})

describe('Compatible mismatch with QiCore and FHIR -- no errors', () => {

    afterEach('Logout and Clean up Measure', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('QiCore 4.1.1 measure, add FHIR 4.0.1 library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/Qicore4MeasureFHIRLib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore4)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 8500)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('QiCore 6.0.0 measure, add FHIR 4.0.1 library', () => {
        const cqlFile = 'cypress/fixtures/MismatchCql/Qicore6MeasureFHIRLib.txt'

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceCqlDocument(cqlFile)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 8500)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })
})