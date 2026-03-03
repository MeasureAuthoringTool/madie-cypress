import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"

const measureData: CreateMeasureOptions = {
    measureCql: MeasureCQL.CQL_BoneDensity_Proportion_Boolean
}
let randValue = (Math.floor((Math.random() * 1000) + 1))
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureQICore = ''
let measureQICore2 = ''
let measureQDM = ''
let measureQDM2 = ''
let QiCoreMeasureNameAlt = ''
let QiCoreCqlLibraryNameAlt = ''

//Utilizing Qi Core 6.0.0
describe('Measure Association: Validations using Qi Core 6.0.0', () => {

    beforeEach('Create Measure', () => {

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
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 30000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 30000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 3)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 30000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 4)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 30000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Log Out', () => {

        OktaLogin.UILogout()
    })

    it('Association: QDM -> Qi Core 6.0.0 measure: Validations', () => {
        let currentUser = Cypress.env('selectedUser')
        let currentAltUser = Cypress.env('selectedAltUser')

        const options: CreateMeasureOptions = {
            measureCql: MeasureCQL.CQL_BoneDensity_Proportion_Boolean,
            altUser: true
        }

        //validation test: only one measure is selected
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Select two measures')

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: must be different models
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must select one QDM and one QI-Core measure')

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: QDM measure must contain CMS id

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QDM measure must contain a CMS ID')

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        //validation test: Qi Core 6.0.0 measure must be in draft status
        MeasuresPage.actionCenter('version', 4)
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        Utilities.waitForElementVisible(MeasuresPage.versionToastSuccessMsg, 30000)
        cy.get(MeasuresPage.versionToastSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        Utilities.waitForElementToNotExist(MeasuresPage.versionToastSuccessMsg, 30000)

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must be in a draft status')


        cy.readFile('cypress/fixtures/' + currentUser + '/measureId4').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
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

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'QI-Core measure must NOT contain a CMS ID')


        cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        QiCoreMeasureNameAlt = 'QiCoreMeasureNameAlt' + 4 + randValue
        QiCoreCqlLibraryNameAlt = 'ProportionPatientLN0' + 4 + randValue
        OktaLogin.UILogout()

        //validation test: both measures the user is not the owner of
        let measureQICore3 = 'QICore600Measure3' + Date.now() + randValue + 9 + randValue
        CreateMeasurePage.CreateMeasureAPI(measureQICore3, measureQICore3, SupportedModels.qiCore6, options, 5)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population', null, 5)

        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit', 5, { altUser: true })
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

        MeasureGroupPage.CreateProportionMeasureGroupAPI(5, true, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        cy.readFile('cypress/fixtures/' + currentAltUser + '/measureId5').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            Utilities.waitForElementVisible('[data-testid="measure-name-' + measureId + '_select"]', 30000)
            cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })
        cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
        cy.get('[data-testid="associate-cms-id-action-btn"]').trigger('mouseover', { force: true })
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('be.visible')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Must own both selected measures')
    })

})

