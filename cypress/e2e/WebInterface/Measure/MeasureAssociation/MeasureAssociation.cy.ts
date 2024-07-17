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

//skipping until feature flag is removed and feature is turned on permanently 
describe.skip('Measure Association', () => {

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
describe.skip('Measure Association', () => {

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