import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

const measureData: CreateMeasureOptions = {
    measureCql: MeasureCQL.CQL_BoneDensity_Proportion_Boolean
}
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
let eCQMQICORE4OrgValue = 'eCQMTitle4QICore'
let ecqmQiCore6Title = 'AutoTestTitle'
let newQDMMeasureSetID = ''
let QiCoreMeasureNameAlt = ''
let QiCoreCqlLibraryNameAlt = ''
let measureQICore = ''
let measureQICore2 = ''
let measureQDM = ''
let measureQDM2 = ''

//Utilizing Qi Core 4.1.1
describe('Measure Association: Validations using Qi Core 4.1.1', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue

        const qdmMeasure1: CreateMeasureOptions = {
            ecqmTitle: measureQDM,
            cqlLibraryName: measureQDM,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31'
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create Second QDM Measure
        measureQDM2 = 'QDMMeasure2' + Date.now() + randValue + 6 + randValue

        const qdmMeasure2: CreateMeasureOptions = {
            ecqmTitle: measureQDM2,
            cqlLibraryName: measureQDM2,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31',
            measureNumber: 2
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure2)
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
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 3)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 4)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()
    })

    it('Association: QDM -> Qi Core measure: Validations', () => {

        //validation test: only one measure is selected

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Select two measures')

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: must be different models
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must select one QDM and one QI-Core measure')

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: QDM measure must contain CMS id

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QDM measure must contain a CMS ID')

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        //cy.reload()

        //validation test: Qi Core measure must be in draft status
        MeasuresPage.actionCenter('version', 4)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible(MeasuresPage.versionToastSuccessMsg, 3500000)
        cy.get(MeasuresPage.versionToastSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(MeasuresPage.versionToastSuccessMsg, 3500000)

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must be in a draft status')


        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
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
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must NOT contain a CMS ID')


        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
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
        cy.reload()

        cy.readFile('cypress/fixtures/measureId5').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must own both selected measures')
    })
})
//Utilizing Qi Core 4.1.1
describe('Measure Association: Transferring meta data and CMS ID from QDM to QI Core measure, using Qi Core 4.1.1', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue

        const qdmMeasure1: CreateMeasureOptions = {
            ecqmTitle: measureQDM,
            cqlLibraryName: measureQDM,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31'
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure1)
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

        cy.get(EditMeasurePage.associateCmsIdDialog).should('include.text', 'NameversionmodelCMS ID')
        cy.get('[id="associate-cms-id-dialog"]').should('include.text', 'Associate CMS ID will copy the CMS ID from your QDM measure to your QI-Core measure. To copy QDM metadata to the QI-Core measure as well please select the checkbox below.')
        Utilities.waitForElementVisible(Utilities.DiscardCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 37000)
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.sureDialog, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogContinueBtn, 35000)
        cy.get(EditMeasurePage.sureDialog).find(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you wish to associate this CMS ID?This Action cannot be undone.')

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
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('contain.value', eCQMQICORE4OrgValue)

        //Confirm Endorsement Organization value
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).should('contain.value', 'CMS Consensus Based Entity')
        cy.get('[id="endorsementId"]').should('contain.value', QDMendorsingNumber)

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

//Utilizing Qi Core 6.0.0
describe('Measure Association: Validations using Qi Core 6.0.0', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure4QiCore600' + Date.now() + randValue + 8 + randValue

        const qdmMeasure1: CreateMeasureOptions = {
            ecqmTitle: measureQDM,
            cqlLibraryName: measureQDM,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31'
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create Second QDM Measure
        measureQDM2 = 'QDMMeasure24QiCore600' + Date.now() + randValue + 6 + randValue

        const qdmMeasure2: CreateMeasureOptions = {
            ecqmTitle: measureQDM2,
            cqlLibraryName: measureQDM2,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31',
            measureNumber: 2
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure2)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create new QI Core 6.0.0 measure
        measureQICore = 'QICore600Measure' + Date.now() + randValue + 4 + randValue

        measureData.measureCql = MeasureCQL.CQL_BoneDensity_Proportion_Boolean

        CreateMeasurePage.CreateMeasureAPI(measureQICore, measureQICore, SupportedModels.qiCore6, measureData, 3)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', null, 3)

        //Create second QI Core measure
        measureQICore2 = 'QICore600Measure2' + Date.now() + randValue + 2 + randValue

        CreateMeasurePage.CreateMeasureAPI(measureQICore2, measureQICore2, SupportedModels.qiCore6, measureData, 4)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', null, 4)

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

    it('Association: QDM -> Qi Core 6.0.0 measure: Validations', () => {
        const options: CreateMeasureOptions = {
            measureCql: MeasureCQL.CQL_BoneDensity_Proportion_Boolean,
            altUser: true
        }

        //validation test: only one measure is selected
        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Select two measures')

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: must be different models
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must select one QDM and one QI-Core measure')

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: QDM measure must contain CMS id

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QDM measure must contain a CMS ID')

        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.reload()

        //validation test: Qi Core 6.0.0 measure must be in draft status
        MeasuresPage.actionCenter('version', 4)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible(MeasuresPage.versionToastSuccessMsg, 3500000)
        cy.get(MeasuresPage.versionToastSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(MeasuresPage.versionToastSuccessMsg, 3500000)

        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must be in a draft status')


        cy.readFile('cypress/fixtures/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: Qi Core 6.0.0 measure must NOT contain CMS id
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
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must NOT contain a CMS ID')


        cy.readFile('cypress/fixtures/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        QiCoreMeasureNameAlt = 'QiCoreMeasureNameAlt' + 4 + randValue
        QiCoreCqlLibraryNameAlt = 'ProportionPatientLN0' + 4 + randValue
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        //validation test: both measures the user is not the owner of
        let measureQICore3 = 'QICore600Measure3' + Date.now() + randValue + 9 + randValue
        CreateMeasurePage.CreateMeasureAPI(measureQICore3, measureQICore3, SupportedModels.qiCore6, options, 5)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', null, 5)

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
        cy.reload()

        cy.readFile('cypress/fixtures/measureId5').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must own both selected measures')
    })

})
//Utilizing Qi Core 6.0.0
describe('Measure Association: Transferring meta data and CMS ID from QDM to QI Core 6.0.0 measure, using Qi Core 6.0.0', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        measureQDM = 'QDMMeasure' + Date.now() + randValue + 8 + randValue

        const qdmMeasure1: CreateMeasureOptions = {
            ecqmTitle: measureQDM,
            cqlLibraryName: measureQDM,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31'
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        //Create new QI Core 6.0.0 measure
        measureQICore = 'QICore600Measure' + Date.now() + randValue + 4 + randValue

        measureData.measureCql = MeasureCQL.CQL_BoneDensity_Proportion_Boolean

        CreateMeasurePage.CreateMeasureAPI(measureQICore, measureQICore, SupportedModels.qiCore6, measureData, 2)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', null, 2)

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

    it('Association: QDM -> Qi Core 6.0.0 measure: Copying meta data and CMS Id from QDM - to - QI Core 6.0.0 measure; also validating the \'are you sure\' modal / dialog window', () => {

        MeasuresPage.actionCenter('associatemeasure')

        cy.get(EditMeasurePage.associateCmsIdDialog).should('include.text', 'NameversionmodelCMS ID')
        cy.get('[id="associate-cms-id-dialog"]').should('include.text', 'Associate CMS ID will copy the CMS ID from your QDM measure to your QI-Core measure. To copy QDM metadata to the QI-Core measure as well please select the checkbox below.')
        Utilities.waitForElementVisible(Utilities.DiscardCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.associateCmsAssociateBtn, 37000)
        cy.get(EditMeasurePage.associateCmsAssociateBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.sureDialog, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogCancelBtn, 35000)
        Utilities.waitForElementVisible(EditMeasurePage.sureDialogContinueBtn, 35000)
        cy.get(EditMeasurePage.sureDialog).find(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you wish to associate this CMS ID?This Action cannot be undone.')

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
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('not.contain.value', eCQMQICORE4OrgValue)
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('contain.value', ecqmQiCore6Title)

        //Confirm Endorsement Organization value
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).should('contain.value', 'CMS Consensus Based Entity')

        cy.get('[data-testid="endorsement-number-input"]').should('contain.value', QDMendorsingNumber)

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

