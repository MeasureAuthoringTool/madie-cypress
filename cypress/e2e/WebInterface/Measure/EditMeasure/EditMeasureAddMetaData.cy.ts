import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { LandingPage } from "../../../../Shared/LandingPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"

const now = Date.now()
let measureName = 'MeasureDefs' + now
let CqlLibraryName = 'MeasureDefsLib' + now
const measureCQL = QiCore4Cql.ICFTest_CQL.replace('EXM124v7QICore4', measureName)

describe('Edit Measure: Add Meta Data', () => {

    before('Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
    })

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify the entry, save and retrieval of all Measure Meta Data', () => {

        let description = 'description'
        let copyright = 'copyright'
        let disclaimer = 'disclaimer'
        let rationale = 'rationale'
        let guidance = 'guidance'
        let clinicalRecommendation = 'Clinical Recommendation'

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Verify that the Endorsement Number field is disabled before adding Endorsement Organization
        cy.get(EditMeasurePage.endorsementNumber).should('be.disabled')
        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click()
        cy.get(EditMeasurePage.endorsingOrganizationOption).click()
        cy.get(EditMeasurePage.endorsementNumber).should('be.enabled')
        cy.get(EditMeasurePage.endorsementNumber).type('345678')
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).clear().type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).clear().type(copyright)
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).clear().type(disclaimer)
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).clear().type(rationale)
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
        cy.get(EditMeasurePage.measureGuidanceTextBox).clear().type(guidance)
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).clear().type(clinicalRecommendation)
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        //Definition
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get(EditMeasurePage.createDefinitionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editReferenceModal, 50000)
        cy.get(EditMeasurePage.definitionTermInput).type('DefinitionTerm')
        cy.get(EditMeasurePage.definitionInput).type('Definition details for DefinitionTerm')
        Utilities.waitForElementEnabled(EditMeasurePage.saveButton, 50000)
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).should('include.text', 'DefinitionTermDefinition details for DefinitionTerm')
        cy.log('Measure Definition added successfully')

        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //Endorsing Organization and number on Name, Version & ID page
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).invoke('val').then(endorsingOrg => {
            cy.get(EditMeasurePage.endorsementNumber).invoke('val').then(endorsementNumber => {
                expect(endorsingOrg).to.eql('CMS Consensus Based Entity')
                expect(endorsementNumber).to.eql('345678')
            })
        })
        cy.log('Endorsing Organization and number added successfully')

        //steward
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('include.value', 'Able Health')
        cy.get('.MuiChip-label').should('include.text', 'ACO Health Solutions')
        cy.log('Measure Steward & Developers added successfully')

        //description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).invoke('val').then(val => {
            expect(val).to.eql(description)
        })
        cy.log('Measure Description added successfully')

        //copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).invoke('val').then(val => {
            expect(val).to.eql(copyright)
        })
        cy.log('Measure Copyright added successfully')

        //disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).invoke('val').then(val => {
            expect(val).to.eql(disclaimer)
        })
        cy.log('Measure Disclaimer added successfully')

        //rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).invoke('val').then(val => {
            expect(val).to.eql(rationale)
        })
        cy.log('Measure Rationale added successfully')

        //guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).invoke('val').then(val => {
            expect(val).to.eql(guidance)
        })
        cy.log('Measure Guidance added successfully')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).invoke('val').then(val => {
            expect(val).to.eql(clinicalRecommendation)
        })
        cy.log('Measure Clinical Recommendation added successfully')

        //definition
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1ns8gjm"]').should('have.attr', 'aria-label', 'Edit').click()
        Utilities.waitForElementVisible(EditMeasurePage.editReferenceModal, 50000)
        cy.get(EditMeasurePage.definitionTermInput).clear().type('DefinitionTermUpdate')
        cy.get(EditMeasurePage.definitionInput).clear().type('Definition details for DefinitionTerm')
        Utilities.waitForElementEnabled(EditMeasurePage.saveButton, 50000)
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).should('include.text', 'DefinitionTermUpdateDefinition details for DefinitionTerm')
        cy.log('Measure Definition updated successfully')

        //delete definition
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1tb4h4m"]').should('have.attr', 'aria-label', 'Delete').click()
        Utilities.waitForElementVisible(EditMeasurePage.defDeleteContinueButton, 50000)
        cy.get(EditMeasurePage.defDeleteContinueButton).click()
        Utilities.waitForElementToNotExist
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).find(EditMeasurePage.emptyDefinitionVal).should('include.text', 'There are currently no definitions. Click the (Add Term) button above to add one.')
        cy.log('Measure Definition deleted successfully')
    })

    it('Verify alphabetical order and pagination of Measure Definitions', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()

        cy.get(EditMeasurePage.emptyDefinitionVal).should('be.visible')

        // checking table auto-sorts alphabetical order
        const defText = 'A valuable term for this measure.'
        EditMeasurePage.addMeasureDefinition('two', defText)
        EditMeasurePage.addMeasureDefinition('six', defText)
        EditMeasurePage.addMeasureDefinition('three', defText)
        EditMeasurePage.addMeasureDefinition('four', defText)
        EditMeasurePage.addMeasureDefinition('five', defText)
        EditMeasurePage.addMeasureDefinition('one', defText)
        EditMeasurePage.addMeasureDefinition('twelve', defText)
        EditMeasurePage.addMeasureDefinition('seven', defText)
        EditMeasurePage.addMeasureDefinition('nine', defText)
        EditMeasurePage.addMeasureDefinition('eleven', defText)
        EditMeasurePage.addMeasureDefinition('ten', defText)
        EditMeasurePage.addMeasureDefinition('eight', defText)


        const expectedOrder = ['eight', 'eleven', 'five', 'four', 'nine', 'one', 'seven', 'six', 'ten', 'three']
        const pageTwoOrder = ['twelve', 'two']

        cy.get(EditMeasurePage.definitionMetaTableBody).find('tr > td:first-child').each((el, index) => {
          cy.wrap(el).invoke('text').then(textValue => {
            expect(expectedOrder[index]).to.equal(textValue)
          })
        })

        // checking pagination - using existing selector instead of adding duplicate
        cy.get(MeasuresPage.paginationNextButton).click()

        cy.get(EditMeasurePage.definitionMetaTableBody).find('tr > td:first-child').each((el, index) => {
            cy.wrap(el).invoke('text').then(textValue => {
              expect(pageTwoOrder[index]).to.equal(textValue)
            })
          })
    })
})

describe('Verify Measure Id and Version Id', () => {

    before('Login', () => {

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify that the Measure Id and Version Id are auto generated for new Measures', () => {

        //Create New Measure
        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore4)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.measureId).should('exist')
        cy.get(EditMeasurePage.measureId).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.versionId).should('exist')
        cy.get(EditMeasurePage.versionId).should('have.attr', 'readonly', 'readonly')
    })
})

describe('Generate CMS ID for QI-Core Measure', () => {

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the CMS ID can be generated successfully for QI-Core Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')

        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')

        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()

        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.contain('FHIR')
        })

        cy.log('CMS ID Generated successfully')

    })
})

describe('Generate CMS ID for QDM Measure', () => {

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the CMS ID can be generated successfully for QDM Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')

        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')

        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()

        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.not.contain('FHIR')
        })

        cy.log('CMS ID Generated successfully')

    })
})
