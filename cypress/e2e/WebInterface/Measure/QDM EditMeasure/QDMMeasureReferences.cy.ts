import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Global } from "../../../../Shared/Global"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let randValue = Cypress._.random(100)
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('QDM Measure Reference', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Add and Edit QDM Measure reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Documentation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

        //Edit Measure reference
        // .editReference will work as long as there is only 1 item on the table
        cy.get(EditMeasurePage.editReference).should('have.attr', 'aria-label', 'Edit').click()
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
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(Global.DiscardCancelBtn).click()
        cy.get(TestCasesPage.createTestCaseDialog).should('not.exist')
    })

    it('Delete Measure Reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Documentation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')

        //Delete Measure Reference
        // .deleteReference will work as long as there is only 1 item on the table
        cy.get(EditMeasurePage.deleteReference).should('have.attr', 'aria-label', 'Delete').click()
        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + 'Measure Reference' + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure reference deleted successfully')
    })

    it('Search for QDM Measure Reference', () => {

        //Add Measure Reference
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Documentation')
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

describe('Add Measure Reference - ownership validation', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Non Measure owner unable to add Measure References', () => {

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).should('not.be.enabled')
    })
})

describe('Delete or Edit Measure Reference - Ownership validation', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        //Login to UI and Add Measure reference
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelReference).click()
        cy.get(EditMeasurePage.addReferenceButton).click()
        cy.get(EditMeasurePage.referenceTypeDropdown).click()
        cy.get(EditMeasurePage.documentationOption).click()
        cy.get(EditMeasurePage.measureReferenceText).type('Measure Reference')
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reference Saved Successfully')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Documentation')
        cy.get(EditMeasurePage.measureReferenceTable).should('contain.text', 'Measure Reference')
        OktaLogin.UILogout()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Non Measure owner unable to delete or edit Measure reference', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        MeasuresPage.actionCenter('edit')

        //Navigate to References page
        cy.get(EditMeasurePage.leftPanelReference).click()
        // older access method
        cy.get(EditMeasurePage.selectMeasureReference).should('not.exist')
        // current icons
        cy.get(EditMeasurePage.deleteReference).should('not.exist')
        cy.get(EditMeasurePage.editReference).should('not.exist')
    })
})


