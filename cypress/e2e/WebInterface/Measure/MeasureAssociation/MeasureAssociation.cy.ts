import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureCQLPFTests = MeasureCQL.CQL_Populations
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let QDMdescription = 'QDM description'
let QDMcopyright = 'QDM copyright'
let QDMdisclaimer = 'QDM disclaimer'
let QDMrationale = 'QDM rationale'
let QDMguidance = 'QDM guidance'
let QDMclinicalRecommendation = 'QDM Clinical Recommendation'
let QDMendorsingNumber = '345678'
let QDMmeasurePStartD = '01/01/2025'
let QDMmeasurePEndD = '12/31/2025'
let QDMsteward = '3Cloud Solution'
let QDMstewardDev = 'SemanticBits'
let eCQMQICOREOrgValue = 'eCQMTitle4QICore'
let newQDMMeasureSetID = ''
let QiCoreMeasureNameAlt = ''
let QiCoreCqlLibraryNameAlt = ''
let measureQICore = ''
let measureQICore2 = ''
let measureQDM = ''
let measureQDM2 = ''


describe('Measure Association: Validations', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, measureQDM, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create Second QDM Measure
        measureQDM2 = 'QDMMeasure2' + Date.now() + randValue + 6 + randValue

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM2, measureQDM2, 'Proportion', false, qdmManifestTestCQL, 2, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')


        //Create new QI Core measure
        measureQICore = 'QICoreMeasure' + Date.now() + randValue + 4 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, measureQICore, measureCQLPFTests, 3)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(3, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')


        //Create second QI Core measure
        measureQICore2 = 'QICoreMeasure2' + Date.now() + randValue + 2 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore2, measureQICore2, measureCQLPFTests, 4)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(4, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 3)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 4)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()

    })

    it('Association: QDM -> Qi Core measure: Validations', () => {

        //validation test: only one measure is selected

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Select two measures')

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })


        //validation test: must be different models
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Measures must be different models')



        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })



        //validation test: QDM measure must contain CMS id

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QDM measure must contain a CMS ID')

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.reload()

        //validation test: Qi Core measure must be in draft status
        MeasuresPage.actionCenter('version', 4)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible(MeasuresPage.VersionDraftMsgs, 3500000)
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 3500000)



        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must be in a draft status')


        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        //validation test: Qi Core measure must NOT contain CMS id
        //add cms id to the Qi Core measure
        MeasuresPage.actionCenter('edit', 3)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()

        //add cms id to the QDM measure
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must NOT contain a CMS ID')


        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        QiCoreMeasureNameAlt = 'QiCoreMeasureNameAlt' + 4 + randValue
        QiCoreCqlLibraryNameAlt = 'ProportionPatientLN0' + 4 + randValue
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        //validation test: both measures the user is not the owner of
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureNameAlt, QiCoreCqlLibraryNameAlt, measureCQLPFTests, 5, true)

        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit', 5)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        MeasureGroupPage.CreateProportionMeasureGroupAPI(5, true, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 350000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        cy.readFile('cypress/fixtures/measureId5').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must own both selected measures')
    })

})

describe('Measure Association: Transferring meta data and CMS ID from QDM to QI Core measure', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDM, measureQDM, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create new QI Core measure
        measureQICore = 'QICoreMeasure' + Date.now() + randValue + 4 + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureQICore, measureQICore, measureCQLPFTests, 2)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(3, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')


        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()

        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click()
        cy.get(EditMeasurePage.endorsingOrganizationOption).click()
        cy.get(EditMeasurePage.endorsementNumber).should('be.enabled')
        cy.get(EditMeasurePage.endorsementNumber).type(QDMendorsingNumber)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //measure period start and end dates
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).should('contain.value', QDMmeasurePStartD)
        cy.get(EditMeasurePage.mpEnd).should('contain.value', QDMmeasurePEndD)


        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).clear().type(QDMdescription)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).clear().type(QDMcopyright)
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).clear().type(QDMdisclaimer)
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).clear().type(QDMrationale)
        cy.get(EditMeasurePage.measureRationaleSaveButton).click()
        cy.get(EditMeasurePage.measureRationaleSuccessMessage).should('be.visible')

        //Steward & Developers
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().clear().type(QDMsteward)
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()

        //select a value for Developers
        Utilities.waitForElementVisible('[data-testid="CancelIcon"]', 3500)
        cy.get('[data-testid="CancelIcon"]').click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type(QDMstewardDev)
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')

        //save button should become available, now, because a value is, now, in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')

        //save Steward & Developers
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({ force: true })
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('be.visible')

        //Guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).clear().type(QDMguidance)
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).clear().type(QDMclinicalRecommendation)
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

    })
    it('Association: QDM -> Qi Core measure: Copying meta data and CMS Id from QDM - to - QI Core measure; also validating the \'are you sure\' modal / dialog window', () => {

        MeasuresPage.actionCenter('associatemeasure')

        cy.get(EditMeasurePage.associateCmsIdDialog).should('include.text', '0.0.000QI-Core v4.1.1Copy QDM Metadata to QI-Core measure')
        Utilities.waitForElementVisible(Global.DiscardCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 37000)
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.sureDialog, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogContinueBtn, 35000)
        cy.get(EditMeasurePage.sureDialog).find(EditMeasurePage.sureDialogBody).should('contain.text', 'Are you sure you wish to associate this CMS ID?This Action cannot be undone.')

        cy.get(EditMeasurePage.sureDialogCancelBtn).click()
        Utilities.waitForElementToNotExist(EditMeasurePage.sureDialog, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 37000)
        cy.get(EditMeasurePage.associateCopyMetaData).click()
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        cy.get(EditMeasurePage.sureDialogContinueBtn).click()

        MeasuresPage.actionCenter('edit', 2)

        //confirming the cms id on the QI Core measure
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.contain(newQDMMeasureSetID + 'FHIR')
        })

        //Confirm that eCQM value was not copied over
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('contain.value', eCQMQICOREOrgValue)

        //Confirm Endorsement Organization value
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).should('contain.value', 'CMS Consensus Based Entity')
        cy.get(EditMeasurePage.endorsementNumber).should('contain.value', QDMendorsingNumber)

        //confirm measure period start and end dates
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).should('contain.value', QDMmeasurePStartD)
        cy.get(EditMeasurePage.mpEnd).should('contain.value', QDMmeasurePEndD)

        //Confirm Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).should('contain.value', QDMdescription)

        //Confirm Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).should('contain.value', QDMcopyright)

        //Confirm Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).should('contain.value', QDMdisclaimer)

        //Confirm Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).should('contain.value', QDMrationale)

        //Confirm Steward & Developers
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        //Confirm  Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).find('[id="steward"]').should('contain.value', QDMsteward)

        //Confirm Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn)
            .find('.MuiChip-label')
            .should('contain.text', QDMstewardDev)

        //Confirm Guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).should('contain.value', QDMguidance)

        //Confirm Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('contain.value', QDMclinicalRecommendation)

    })
})


