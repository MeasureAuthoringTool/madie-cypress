import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const measureName = 'PPQiCorePT' + Date.now()
const CqlLibraryName = 'PPQiCorePTLib' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const measureCQL = MeasureCQL.CQL_Populations
const zipFile = 'eCQMTitle4QICore-v1.0.000-FHIR.zip'

describe('FHIR Measure Export for Proportion Patient Measure with QI-Core Profile types', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('Validate the zip file Export is downloaded and can be unzipped', () => {

        cy.get(EditMeasurePage.measureDetailsTab).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Percentage of cataract surgeries for patients aged 18 and older with a diagnosis of uncomplicated cataract and no significant ocular conditions impacting the visual outcome of surgery and had best-corrected visual acuity of 20/40 or better (distance or near) achieved in the operative eye within 90 days following the cataract surgery')
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureRationaleSaveButton).click()
        cy.get(EditMeasurePage.measureRationaleSuccessMessage).should('be.visible')

        //Steward & Developers
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type("ACO Health Solutions")
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
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        cy.get(Header.measures).click()

        //version measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get('.MuiDialogActions-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('export')

        cy.verifyDownload(zipFile)
        cy.log('Successfully verified zip file export')
        console.log('Successfully verified zip file export')

        OktaLogin.UILogout()
    })

    it('Unzip the downloaded file and verify file types', () => {

        cy.verifyDownload(zipFile)

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: zipFile, path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                console.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, zipFile))
            .should('contain', 'eCQMTitle4QICore-v1.0.000-FHIR.html')
            .and('contain', 'eCQMTitle4QICore-v1.0.000-FHIR.xml')
            .and('contain', 'eCQMTitle4QICore-v1.0.000-FHIR.json')
    })
})
