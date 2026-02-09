import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"

let measureName = ''
let cqlLibraryName = ''
const cql = QiCore4Cql.CQL_Populations

describe('Qi Core Measure Reference', () => {

    beforeEach('Create Measure and Login', () => {

        measureName = 'MeasureRef' + Date.now()
        cqlLibraryName = 'MeasureRefLib' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, cql)
        OktaLogin.Login()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Add and Edit Qi Core Measure reference', () => {
        let currentUser = Cypress.env('selectedUser')
        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').type('Measure Reference')

        //intercept reference id once reference is created
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents).as('references')
        })
        cy.get(EditMeasurePage.saveButton).click()
        cy.wait('@references', { timeout: 60000 }).then((request) => {
            cy.writeFile('cypress/fixtures/referenceId', request.response.body.measureMetaData.references[0].id)
        })

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

        //Edit Measure reference
        // .editReference will work as long as there is only 1 item on the table
        Utilities.waitForElementVisible(EditMeasurePage.deleteQiCoreReference, 90000)
        cy.get(EditMeasurePage.deleteQiCoreReference).eq(1).click()
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(EditMeasurePage.deleteQiCoreReference).eq(1).click()
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.readFile('cypress/fixtures/referenceId').should('exist').then((fileContents) => {
            cy.get('[data-testid="edit-measure-reference-' + fileContents).click()
        })

        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.justificationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').clear().type('Updated Measure Reference').wait(2000)
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'JustificationUpdated Measure Reference')
    })

    //pass
    it('Discard changes button', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(Utilities.DiscardCancelBtn).click()
        cy.get(TestCasesPage.createTestCaseDialog).should('not.exist')
    })

    it('Delete Qi Core Measure Reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('include.text', 'Measure Reference')

        //Delete Measure Reference
        // .deleteReference will work as long as there is only 1 item on the table
        cy.get(EditMeasurePage.deleteQiCoreReference).eq(1).click()
        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete Text 1?')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure reference deleted successfully')
    })

    it('Search for Qi Core Measure Reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('include.text', 'Measure Reference')

        //Add second Reference
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.justificationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').type('Test')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('include.text', 'Test')

        //Search for Reference
        cy.get(EditMeasurePage.searchReferenceTextBox).type('Test')
        cy.get(EditMeasurePage.searchReferenceIcon).click()
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('include.text', 'Test')
        cy.get(EditMeasurePage.measureReferenceTable).should('not.contain', 'Measure Reference')

    })
})

describe('Add Qi Core Measure Reference - ownership validation', () => {

    beforeEach('Create Measure and Login', () => {

        measureName = 'MeasureRef1' + Date.now()
        cqlLibraryName = 'MeasureRef1Lib' + Date.now()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, cql)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    //pass
    it('Non Measure owner unable to add Qi Core Measure References', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).should('not.be.enabled')
    })
})

describe('Delete or Edit Qi Core Measure Reference - Ownership validation', () => {

    beforeEach('Create Measure and Login', () => {

        measureName = 'MeasureRef2' + Date.now()
        cqlLibraryName = 'MeasureRef2Lib' + Date.now()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, cql)

        //Login to UI and Add Measure reference
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).find('[data-testid="referenceText-rich-text-editor-content"]').type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('include.text', 'Measure Reference')
        OktaLogin.UILogout()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Non Measure owner unable to delete or edit Qi Core Measure reference', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        // older access method
        cy.get(EditMeasurePage.selectMeasureReference).should('not.exist')
        // current icons
        cy.get(EditMeasurePage.deleteQiCoreReference).should('not.exist')
        cy.get(EditMeasurePage.editQiCoreReference).should('not.exist')
    })
})


