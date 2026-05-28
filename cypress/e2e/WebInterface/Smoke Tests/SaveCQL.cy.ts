import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { Header } from "../../../Shared/Header"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Utilities } from "../../../Shared/Utilities"

const measureName = 'SaveCQL' + Date.now()
const CqlLibraryName = 'SaveCQLLib' + Date.now()

describe('Save CQL on CQL Editor Page', () => {

    beforeEach('Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        
        Utilities.deleteMeasure()
    })

    it('Create New Measure and Add CQL to the Measure', () => {

        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        // this is a 4.1.1 CQL but appears to still be valid as 6.0.0
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 6500)

        //Navigate to Measures page and verify the saved CQL
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).should('not.be.empty')
    })
})
