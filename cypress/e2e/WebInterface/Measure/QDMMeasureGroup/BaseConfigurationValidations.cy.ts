import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let altMeasureName = ''
let altCqlLibraryName = ''
let measureScoring = 'Cohort'
let measureCQL = MeasureCQL.simpleQDM_CQL

describe('Validating Population tabs and fields, specific to QDM', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue


        //Create New Measure
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL, false, false, null, null, null)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', null)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        CreateMeasurePage.CreateQDMMeasureAPI(altMeasureName, altCqlLibraryName, measureCQL, false, true, null, null, 1)
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Base Configuration fields are present, contain values when necessary, and, if required, ' +
        'the save button is not available until all required fields have a value', () => {
            //navigate to the main measures page
            cy.get(Header.measures).click()

            MeasuresPage.actionCenter('edit', null)

            //Click on Measure Group tab
            Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //navigate to the criteria section of the PC
            cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

            //confirm Base Config alert message appears
            Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
            cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

            //click on / navigate to the Base Configuration sub-tab
            cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
            cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

            //validate helper text
            cy.get(MeasureGroupPage.qdmType).click().focused().blur()
            cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
            cy.get(MeasureGroupPage.qdmType).click().focused().blur()
            cy.get(MeasureGroupPage.qdmTypeHelperText).should('contain.text', 'At least one type is required')
            cy.get(MeasureGroupPage.qdmScoringHelperText).should('contain.text', 'Valid Scoring is required for QDM Measure.')

            //validate that 'Yes" radio button is selected / checked
            cy.contains('label', 'Yes')
                .nextAll() // select the next element
                .get(MeasureGroupPage.qdmPatientBasis)
                .should('have.attr', 'type', 'radio')  // confirm it's type radio
                .should('be.checked')

            //*check* the 'No' radio button
            cy.contains('label', 'No')
                .prevAll() // select the previous element
                .get(MeasureGroupPage.qdmPatientBasis)
                .should('have.attr', 'type', 'radio')
                .check()

            //verify availability of the discard button and the un-availability of the save button
            cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
            cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.disabled')

            //discard current changges
            cy.get(MeasureGroupPage.qdmDiscardButton).click()
            Global.clickOnDiscardChanges()

            //validate that 'Yes" radio button is selected / checked
            cy.contains('label', 'Yes')
                .nextAll() // select the next element
                .get(MeasureGroupPage.qdmPatientBasis)
                .should('have.attr', 'type', 'radio')  // confirm it's type radio
                .should('be.checked')

            //validate that a value can be selected for the Type field
            cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
            cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
            cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
            cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

            //verify availability of the discard button and the un-availability of the save button
            cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
            cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.disabled')

            //validate the values and the selection of the values, for the scoring field
            //select 'Cohort' scoring on measure
            Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
            cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

            //verify availability of the discard and save buttons
            cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
            cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

            //discard current changes
            cy.get(MeasureGroupPage.qdmDiscardButton).click()
            Global.clickOnDiscardChanges()

            //navigate to the main measures page
            cy.get(Header.measures).click()

            MeasuresPage.actionCenter('edit', null)

            //Click on Measure Group tab
            Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //select 'Cohort' scoring on measure
            Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
            cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

            //verify availability of the discard and save buttons
            cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
            cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.disabled')

            //validate that a value can be selected for the Type field
            cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
            cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
            cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
            cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

            //Select No for patient Basis
            cy.contains('label', 'No')
                .prevAll() // select the previous element
                .get(MeasureGroupPage.qdmPatientBasis)
                .should('have.attr', 'type', 'radio')
                .check()

            //verify availability of the discard button and the availability of the save button
            cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
            cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

            //click on the save button and confirm save success message
            cy.get(MeasureGroupPage.qdmBCSaveButton).click()
            Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
            cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        })

    it('Dirty check validation', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.disabled')

        //click on discard changes button
        cy.get(MeasureGroupPage.qdmDiscardButton).click()

        //click on 'No, Keep working' button
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).click()

        //verify state of Base Configuration page is as it was prior to clicking on the Discard button
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.disabled')

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //verify availability of the discard button and the availability of the save button
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

        //click on discard changes button
        cy.get(MeasureGroupPage.qdmDiscardButton).click()

        //click on 'No, Keep working' button
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).click()

        //verify state of Base Configuration page is as it was prior to clicking on the Discard button
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

        //*check* the 'No' radio button
        cy.contains('label', 'No')
            .prevAll() // select the previous element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')
            .check()

        //verify availability of the discard button and the un-availability of the save button
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

        //click on discard changes button
        Utilities.waitForElementVisible(MeasureGroupPage.qdmDiscardButton, 5000)
        Utilities.waitForElementEnabled(MeasureGroupPage.qdmDiscardButton, 5000)
        cy.get(MeasureGroupPage.qdmDiscardButton).click()

        //click on 'No, Keep working' button
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).click()

        //validate that 'No" radio button is selected / checked
        cy.contains('label', 'No')
            .prevAll() // select the prev element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

        //navigate to main MADiE page and, then, navigate to measure details page
        cy.get(Header.mainMadiePageButton).click()
        //click on 'No, Keep working' button
        cy.get(MeasureGroupPage.qdmDiscardModalContinueButton).click()
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select score value
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)

        //selelct measure type value
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })

        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')

        //attempt to navigate to the main measures page
        cy.get(Header.measures).click()

        //confirm dirty check / discard modal appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmDirtyCheckDiscardModal, 30000)
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).should('be.visible')
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmDiscardModalContinueButton).should('be.visible')
        cy.get(MeasureGroupPage.qdmDiscardModalContinueButton).should('be.enabled')

        //cancel navigation
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).click()

        //verify state of Base Configuration page is as it was prior to clicking on the Discard button
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')
        //validate that 'No" radio button is selected / checked
        cy.contains('label', 'No')
            .prevAll() // select the prev element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

        //attempt to navigate to the main measures page
        cy.get(Header.measures).click()

        //continue with navigating away from the Base Configuration page
        Global.clickOnDiscardChanges()

        //navigate back to the PC -> Base Configuration page
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that values have been cleared from fields on the Base Configuration page
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Select Scoring')
        cy.get(MeasureGroupPage.qdmType).should('contain.value', '')
        //validate that 'Yes" radio button is selected / checked
        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')
    })
    //non-owner of measure cannot edit Base Configuration fields
    it('Non-owner of measure cannot edit any of the Base Configuration fields', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on the "All Measures" tab
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 70000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(MeasuresPage.allMeasuresTab, 70000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.enabled')
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('edit', 1)

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message apppears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //fields are unavailable to edit due to user not having owner or shared permissions
        cy.get(MeasureGroupPage.qdmScoring).should('not.be.enabled')
        cy.get(MeasureGroupPage.qdmType).should('not.be.enabled')

        cy.contains('label', 'No')
            .prevAll() // select the prev element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('not.be.enabled')

        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('not.be.enabled')

        //verify the unavailability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('not.be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('not.be.enabled')

    })
})

describe('Updates on Base Configuration page', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, measureCQL, null)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', null)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    it('Changing the scoring elcits the Change Scoring prompt', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click edit on measure action
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Process')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'd')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

        //navigate to the main measures page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //save changes
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()

        //confirm that Change Scoring modal / prompt is present via it's buttons
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringCancel, 30000)
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringSaveChanges, 30000)

        cy.get(MeasureGroupPage.qdmChangeScoringCancel).click()

        //if the No, Keep Working button is clicked, values on the page remain the same and nothing is saved
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Process')
        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        //validate that 'Yes" radio button is selected / checked
        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

        //save changes
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()

        //confirm that Change Scoring modal / prompt is present via it's buttons
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringCancel, 30000)
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringSaveChanges, 30000)

        cy.get(MeasureGroupPage.qdmChangeScoringSaveChanges).click()

        //if the Yes, Save Changes button is clicked, values on the page are saved
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Process')

        //validate that 'Yes" radio button is selected / checked
        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')

        //navigate to the main measures page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //most recently saved BC page data is retained
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Process')

        //validate that 'Yes" radio button is selected / checked
        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')
    })

    it('Verify confirmation dialogue when patient basis value changed', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()
        //Click on save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()

        //Assert the confirmation message
        //<div role="presentation" data-testid="update-measure-group-patient-basis-dialog" class="MuiDialog-root MuiModal-root css-126xj0f"><div aria-hidden="true" class="MuiBackdrop-root MuiModal-backdrop css-919eu4" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);"></div><div tabindex="0" data-testid="sentinelStart"></div><div class="MuiDialog-container MuiDialog-scrollPaper css-ekeie0" role="presentation" tabindex="-1" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);"><div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-mbdu2s" role="dialog" aria-labelledby="mui-21"><div class="jss29"><h2 class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root jss30 css-ohyacs" id="mui-21">Change Patient Basis?</h2><div><button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1yxmbwk" tabindex="0" type="button"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium jss31 css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div></div><hr class="MuiDivider-root MuiDivider-fullWidth jss35 css-39bbo6"><div class="MuiDialogContent-root css-1ty026z"><div><p class="MuiTypography-root MuiTypography-body1 jss32 css-9l3uo3">Your Measure Patient Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.</p><p class="MuiTypography-root MuiTypography-body1 jss33 css-9l3uo3">Are you sure you want to Save Changes?</p><p class="MuiTypography-root MuiTypography-body1 jss34 css-9l3uo3">This action cannot be undone.</p></div></div><hr class="MuiDivider-root MuiDivider-fullWidth jss35 css-39bbo6"><div class="MuiDialogActions-root jss36 MuiDialogActions-spacing css-1vskg8q"><button data-testid="update-measure-group-patient-basis-modal-cancel-btn" class="qpp-c-button qpp-c-button--secondary" type="button">No, Keep Working</button><button data-testid="update-measure-group-patient-basis-modal-agree-btn" class="qpp-c-button" type="button" style="background: rgb(66, 75, 90); margin-top: 0px;">Yes, Save changes</button></div></div></div><div tabindex="0" data-testid="sentinelEnd"></div></div>
        cy.get('[data-testid="update-measure-group-patient-basis-dialog"]').should('contain.text', 'Change Patient Basis?')
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Patient Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.')

        //Click on 'No, Keep Working' button
        cy.get(MeasureGroupPage.updatePatientBasisCancelBtn).click()
        //Verify that the radio button 'No' is still enabled
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).should('be.enabled')

        // //Click on save again
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        //Click on 'Yes, Save Changes' button
        cy.get(MeasureGroupPage.updatePatientBasisContinueBtn).click()
        //Verify that the radio button 'Yes' is enabled
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).should('be.enabled')

        //Navigate to Criteria page and verify the populations are cleared
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).should('not.contain', 'ipp')

    })
})
