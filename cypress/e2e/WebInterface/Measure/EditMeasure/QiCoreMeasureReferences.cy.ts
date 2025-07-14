import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let randValue = Cypress._.random(100)
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Qi Core Measure Reference', () => {

    beforeEach('Create Measure and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Add and Edit Qi Core Measure reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

        //Edit Measure reference
        // .editReference will work as long as there is only 1 item on the table
        cy.get(EditMeasurePage.editQiCoreReference).eq(1).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.justificationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).clear().type('Updated Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Updated Measure Reference')
    })

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
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

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
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

        //Add second Reference
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.justificationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Test')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Test')

        //Search for Reference
        cy.get(EditMeasurePage.searchReferenceTextBox).type('Test')
        cy.get(EditMeasurePage.searchReferenceIcon).click()
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Justification')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Test')
        cy.get(EditMeasurePage.measureReferenceTable).should('not.contain', 'Measure Reference')

    })
})

describe('Add Qi Core Measure Reference - ownership validation', () => {

    beforeEach('Create Measure and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

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

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)

        //Login to UI and Add Measure reference
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.citationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Citation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')
        OktaLogin.UILogout()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
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


