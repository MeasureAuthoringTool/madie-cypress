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
let measureCQL = MeasureCQL.SBTEST_CQL

//Skipping tests until the QDM flag is removed
describe.skip('Validating Population tabs and fields, specific to QDM', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        //MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //this test is work in progress and will need to continue to be built out as the base configuration page becomes more complete
    it('Verify that the Base Configuration fields are present, contain values when necessary, and, if required, ' +
        'the save button is not available until all required fields have a value', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //validate helper text
        cy.get(MeasureGroupPage.qdmType).click().focused().blur()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmType).click().focused().blur()
        cy.get(MeasureGroupPage.qdmTypeHelperText).should('contain.text', 'At least one type is required')
        cy.get(MeasureGroupPage.qdmScoringHelperText).should('contain.text', 'Valid Scoring is required for QDM Measure.')

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
        cy.get(MeasureGroupPage.patientBasisRadioBtn).eq(1).click()

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
    })
})