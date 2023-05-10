import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let altMeasureName = ''
let altCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL

//Skipping tests until the QDM flag is removed
describe.skip('Validating Population tabs and fields, specific to QDM', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue


        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        CreateMeasurePage.CreateQDMMeasureAPI(altMeasureName, altCqlLibraryName, measureCQL, true, true)

        //measureName: string, CqlLibraryName: string, measureCQL?: string, twoMeasures?: boolean, altUser?: boolean
        //MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Base Configuration fields are present, contain values when necessary, and, if required, ' +
        'the save button is not available until all required fields have a value', () => {

            MeasuresPage.measureAction("edit")

            //Click on Measure Group tab
            Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //confirm Base Config alert message apppears
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

            //discard current changges
            cy.get(MeasureGroupPage.qdmDiscardButton).click()
            Global.clickOnDiscardChanges()

            //navigate to the main measures page
            cy.get(Header.measures).click()

            MeasuresPage.measureAction("edit")

            //Click on Measure Group tab
            Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
            cy.get(EditMeasurePage.measureGroupsTab).should('exist')
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //click on / navigate to the Base Configuration sub-tab
            cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
            cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

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

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm Base Config alert message apppears
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
        cy.get(MeasureGroupPage.qdmDiscardButton).click()

        //click on 'No, Keep working' button
        cy.get(MeasureGroupPage.qdmDiscardModalCancelButton).click()

        //validate that 'No" radio button is selected / checked
        cy.contains('label', 'No')
            .prevAll() // select the prev element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

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

        //verify user has navigated to the main measures page
        cy.url().should('eq', 'https://dev-madie.hcqis.org/measures')

        //navigate back to the PC -> Base Configuration page
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

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
    it('Non-owner of measure cannot edit any of the the Base Configuration fields', () => {
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.measureAction("edit", true)

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm Base Config alert message apppears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //fields are unavaialbe to edit due to user not having owner or shared permissions
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
    //additional work will need to be done with this test once MAT-5554 is finished
    it('Changing the scoring elcits the Change Scoring prompt', () => {
        //1) prompt appears afer a user changes the scoring value and, then, clicks on save
        //navigate to the main measures page
        cy.get(Header.measures).click()

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm Base Config alert message apppears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        //navigate to the main measures page
        cy.get(Header.measures).click()

        //verify user has navigated to the main measures page
        cy.url().should('eq', 'https://dev-madie.hcqis.org/measures')

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //confirm that Change Scoring modal / prompt is present via it's buttons
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringCancel, 30000)
        Utilities.waitForElementVisible(MeasureGroupPage.qdmChangeScoringSaveChanges, 30000)

        cy.get(MeasureGroupPage.qdmChangeScoringCancel).click()

        //if the No, Keep Working button is clicked, values on the page remain the same and nothing is saved
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')
        //verify availability of the discard and save buttons
        cy.get(MeasureGroupPage.qdmDiscardButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        //validate that 'Yes" radio button is selected / checked
        cy.contains('label', 'Yes')
            .nextAll() // select the next element
            .get(MeasureGroupPage.qdmPatientBasis)
            .should('have.attr', 'type', 'radio')  // confirm it's type radio
            .should('be.checked')

        cy.pause()


        //2) no data is saved or cleared when the user clicks on the "No, Keep Working" button in the change scoring modal

        //3) data is saved and all populations are cleared, when the user clicks on the "Yes, Save Changes"

        //4) after #3, user can navigate away and back to the BC page and see the values that was recently saved
    })
})