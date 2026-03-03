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
let ecqmQiCore6Title = 'AutoTestTitle'
let newQDMMeasureSetID = ''
let measureQICore = ''
let measureQDM = ''

//Utilizing Qi Core 6.0.0
describe('Measure Association: Transferring meta data and CMS ID from QDM to QI Core 6.0.0 measure, using Qi Core 6.0.0', () => {

    beforeEach('Create Measure', () => {

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
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMdescription)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMcopyright)
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMdisclaimer)
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMrationale)
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
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMguidance)
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.RTEContentField).clear().type(QDMclinicalRecommendation)
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

    afterEach('Log Out', () => {

        OktaLogin.UILogout()
    })

    it('Association: QDM -> Qi Core 6.0.0 measure: Copying meta data and CMS Id from QDM - to - QI Core 6.0.0 measure; also validating the \'are you sure\' modal / dialog window', () => {

        MeasuresPage.actionCenter('associatemeasure')

        cy.get(EditMeasurePage.associateCmsIdDialog).should('include.text', 'MeasureVersionModelCMS ID')
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

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)

        //confirming the cms id on the QI Core measure
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.contain(newQDMMeasureSetID + 'FHIR')
        })

        //Confirm that eCQM value was not copied over
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('not.contain.value', 'eCQMTitle4QICore')
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
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMdescription + '</p>')

        //Confirm Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMcopyright + '</p>')

        //Confirm Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMdisclaimer + '</p>')

        //Confirm Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMrationale + '</p>')

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
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMguidance + '</p>')

        //Confirm Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).focus()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p>' + QDMclinicalRecommendation + '</p>')
    })
})

