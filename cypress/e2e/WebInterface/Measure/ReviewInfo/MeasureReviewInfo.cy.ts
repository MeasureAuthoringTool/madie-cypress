import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Header} from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let MeasuresPageOne = ''
let updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()
const now = require('dayjs')
let date = now().format('M/D/YYYY')
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Review Info Page', () => {

    before('Create Measure and Measure Group',() => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')

    })

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    after('Logout and Cleanup', () => {

        Utilities.deleteMeasure(updatedMeasuresPageName, CqlLibraryName)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })

    //Need to revisit once MAT-5473 is fixed
    it('Validate fields on Measure Review Info page', () => {

        MeasuresPage.measureAction("edit")

        //Click on Review Info tab
        cy.get(EditMeasurePage.reviewInfoTab).click()

        cy.get(EditMeasurePage.approvalDate).should('not.exist')
        cy.get(EditMeasurePage.lastReviewDate).should('not.exist')
    })

    it('Verify Approval Date and Last review Dates exist versioned Measures and do not exist for Drafted Measures', () => {

        let versionNumber = '1.0.000'

        //Version the Measure
        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.versionMeasuresRadioButton).eq(0).click()
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        //Navigate to ReviewInfo page and verify Approval Date and Last review Dates are added
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Click on Review Info tab
        cy.get(EditMeasurePage.reviewInfoTab).click()

        cy.get(EditMeasurePage.reviewInfoFields).eq(0).should('contain.text', 'Approval Date')
        cy.get(EditMeasurePage.approvalDate).should('have.value', date)

        cy.get(EditMeasurePage.reviewInfoFields).eq(1).should('contain.text', 'Last Review Date')
        cy.get(EditMeasurePage.lastReviewDate).should('have.value', date)

        //Draft the Versioned Measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')

        CreateMeasurePage.clickCreateDraftButton()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //Navigate to ReviewInfo page and verify Approval Date and Last review Dates does not exist
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Click on Review Info tab
        cy.get(EditMeasurePage.reviewInfoTab).click()

        cy.get(EditMeasurePage.approvalDate).should('not.exist')
        cy.get(EditMeasurePage.lastReviewDate).should('not.exist')

    })
})
