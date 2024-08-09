import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"



let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureCQLPFTests = MeasureCQL.CQL_Populations
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
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
let QICoredescription = 'QI Core description'
let QICorecopyright = 'QI Core copyright'
let QICoredisclaimer = 'QI Core disclaimer'
let QICorerationale = 'QI Core rationale'
let QICoreguidance = 'QI Core guidance'
let QICoreclinicalRecommendation = 'QI Core Clinical Recommendation'
let QICoreendorsingNumber = '12345'
let QICoremeasurePStartD = now().subtract('2', 'year').format('MM/DD/YYYY')//('YYYY-MM-DD')
let QICoremeasurePEndD = now().format('MM/DD/YYYY')//('YYYY-MM-DD')
let QICoresteward = 'Able Health'
let QICorestewardDEV = 'ACO Health Solutions'
let eCQMQICOREOrgValue = 'eCQMTitle4QICore'
let qdmMeasureSetId = 'cypress/fixtures/QDMMeasureSetId'
let newQDMMeasureSetID = ''
let QiCoreMeasureNameAlt = ''
let QiCoreCqlLibraryNameAlt = ''
let QiCoreMeasureName0 = ''
let QiCoreCqlLibraryName0 = ''
let QiCoreMeasureName1 = ''
let QiCoreCqlLibraryName1 = ''
let measureQDMManifestName0 = ''
let QDMCqlLibraryName0 = ''
let measureQDMManifestName1 = ''
let QDMCqlLibraryName1 = ''

describe('Measure Association: Validations', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //3
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName0 = 'QDMManifestTestMN0' + Date.now() + randValue + 6 + randValue
        QDMCqlLibraryName0 = 'QDMManifestTestLN0' + Date.now() + randValue + 7 + randValue

        //Create Second QDM Measure
        //2
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName0, QDMCqlLibraryName0, 'Proportion', false, qdmManifestTestCQL, true, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC0', 'QDMManifestTCGroup0', 'QDMManifestTC0', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //1
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName0 = 'ProportionPatientMN0' + Date.now() + randValue + 2 + randValue
        QiCoreCqlLibraryName0 = 'ProportionPatientLN0' + Date.now() + randValue + 3 + randValue
        //Create second QI Core measure
        //0
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName0, QiCoreCqlLibraryName0, measureCQLPFTests, true)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()

    })

    it('Association: QDM -> Qi Core measure: Validations', () => {

        //validation test: only one measure is selected
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'Select two measures')
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //validation test: must be different models
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-3_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'Measures must be different models')
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-3_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //validation test: QDM measure must contain CMS id
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'QDM measure must contain a CMS ID')
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //validation test: Qi Core measure must be in draft status
        MeasuresPage.measureAction("version", false, false, false, true)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible(MeasuresPage.VersionDraftMsgs, 35000)
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(MeasuresPage.VersionDraftMsgs, 35000)
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must be in a draft status')
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //validation test: Qi Core measure must NOT contain CMS id
        MeasuresPage.measureAction("edit", false, false, true)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.measureAction("edit", false, true, false, true)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must NOT contain a CMS ID')
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-2_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        QiCoreMeasureNameAlt = QiCoreMeasureName1 + 4 + randValue
        QiCoreCqlLibraryNameAlt = QiCoreCqlLibraryName1 + 5 + randValue

        //validation test: both measures the user is not the owner of
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureNameAlt, QiCoreCqlLibraryNameAlt, measureCQLPFTests, false, true)
        OktaLogin.AltLogin()
        MeasuresPage.measureAction("edit", false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, true, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-3_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').trigger('mouseover')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('be.visible')
        cy.get('[data-testid="associate_cms_id_tooltip"]').should('have.attr', 'aria-label', 'Must own both selected measures')
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-3_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-3_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

    })

})
describe('Measure Association: General Modal functionality', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //1
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //0
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

    })
    it('Association: QDM -> Qi Core measure: Modal window and functionality of the modal window buttons', () => {

        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').click()
        Utilities.waitForElementVisible('[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthMd MuiDialog-paperFullWidth css-cwpu7v"]', 37800)
        cy.get('[data-testid="associate-cms-id-dialog-tbl"]').should('include.text', '0.0.000QI-Core v4.1.1Copy QDM Metadata to QI-Core measure')
        Utilities.waitForElementVisible('[data-testid="cancel-button"]', 3700)
        Utilities.waitForElementVisible('[data-testid="associate-cms-id-button"]', 3700)
    })
})
describe('Measure Association: Transferring meta data and CMS ID from QDM to QI Core measre', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //1
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 900000)
        MeasuresPage.measureAction("edit", false, true, true)

        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click().wait(500)
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
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //0
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests)
        OktaLogin.Login()
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 900000)
        MeasuresPage.measureAction("edit", false, false, true)

        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click().wait(500)
        cy.get(EditMeasurePage.endorsingOrganizationOption).click()
        cy.get(EditMeasurePage.endorsementNumber).should('be.enabled')
        cy.get(EditMeasurePage.endorsementNumber).type(QICoreendorsingNumber)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //measure period start and end dates
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).should('contain.value', QICoremeasurePStartD)
        cy.get(EditMeasurePage.mpEnd).should('contain.value', QICoremeasurePEndD)


        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).clear().type(QICoredescription)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).clear().type(QICorecopyright)
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).clear().type(QICoredisclaimer)
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).clear().type(QICorerationale)
        cy.get(EditMeasurePage.measureRationaleSaveButton).click()
        cy.get(EditMeasurePage.measureRationaleSuccessMessage).should('be.visible')

        //Steward & Developers
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().clear().type(QICoresteward)
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()

        //select a value for Developers
        Utilities.waitForElementVisible('[data-testid="CancelIcon"]', 3500)
        cy.get('[data-testid="CancelIcon"]').click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type(QICorestewardDEV)
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
        cy.get(EditMeasurePage.measureGuidanceTextBox).clear().type(QICoreguidance)
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).clear().type(QICoreclinicalRecommendation)
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        OktaLogin.Login()
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 900000)
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.readFile(qdmMeasureSetId).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/create-cms-id').as('cmsid')
        })
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.wait('@cmsid', { timeout: 60000 }).then((request) => {
            newQDMMeasureSetID = request.response.body.cmsId
        })
        cy.get(Header.mainMadiePageButton).click()
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 900000)
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

    })
    it('Association: QDM -> Qi Core measure: Copying meta data and CMS Id from QDM - to - QI Core measure; also validating the \'are you sure\' modal / dialog window', () => {

        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').click()
        Utilities.waitForElementVisible('[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthMd MuiDialog-paperFullWidth css-1m0tajg react-draggable"]', 37800)
        cy.get(EditMeasurePage.associateCmsIdDialog).should('include.text', '0.0.000QI-Core v4.1.1Copy QDM Metadata to QI-Core measure')
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 3700)
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.sureDialog, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogCancelBtn, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogContinueBtn, 3500)
        cy.get(EditMeasurePage.sureDialog).find(EditMeasurePage.sureDialogBody).should('contain.text', 'Are you sure you wish to associate this CMS ID?This Action cannot be undone.')

        cy.get(EditMeasurePage.sureDialogCancelBtn).click()
        Utilities.waitForElementToNotExist(EditMeasurePage.sureDialog, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 3700)
        cy.get(EditMeasurePage.associateCopyMetaData).click()
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        cy.get(EditMeasurePage.sureDialogContinueBtn).click()

        MeasuresPage.measureAction('edit', false, false, true, false)

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

