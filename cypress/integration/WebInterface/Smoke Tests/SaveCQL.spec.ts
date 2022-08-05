import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {Header} from "../../../Shared/Header"
import {CQLEditorPage} from "../../../Shared/CQLEditorPage"
import {Utilities} from "../../../Shared/Utilities"
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()

describe('Save CQL on CQL Editor Page', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Create New Measure and Add CQL to the Measure', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Measures page and verify the saved CQL
        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).invoke('text').then((text) => {
            expect(text.length).greaterThan(2579)
        })
    })
})