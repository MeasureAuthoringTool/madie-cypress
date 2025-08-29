import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Header } from "../../../../Shared/Header"
import {MadieObject, PermissionActions, Utilities} from "../../../../Shared/Utilities"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import {Environment} from "../../../../Shared/Environment"

const now = Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'MeasureDefs' + now
let CqlLibraryName = 'MeasureDefsLib' + now
let newCqlLibraryName = ''
let newMeasureName = ''
const measureCQL = QiCore4Cql.ICFTest_CQL.replace('EXM124v7QICore4', measureName)
let harpUserALT = Environment.credentials().harpUserALT

describe('Edit Measure: Add Meta Data', () => {

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue + 2

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
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

        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click()
        cy.get(EditMeasurePage.endorsingOrganizationOption).click()
        cy.get(EditMeasurePage.endorsementNumber).should('be.enabled')
        cy.get(EditMeasurePage.endorsementNumber).clear().type('345678')
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).clear().type(description)
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

        //Purpose
        cy.get(EditMeasurePage.leftPanelPurpose).click()
        Utilities.waitForElementVisible(EditMeasurePage.measurePurposeTextBox, 50000)
        cy.get(EditMeasurePage.measurePurposeTextBox).type('This is a purpose.')
        cy.get(EditMeasurePage.measurePurposeSaveBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.measurePurposeSavedMsg, 50000)
        cy.get(EditMeasurePage.measurePurposeSavedMsg).should('contain.text', 'Measure Purpose Information Saved Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.measurePurposeSavedMsg, 50000)
        cy.log('Purpose was added successfully')


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
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseDialog, 50000)
        cy.get(EditMeasurePage.definitionTermInput).type('DefinitionTerm')
        cy.get(EditMeasurePage.definitionInput).type('Definition details for DefinitionTerm')
        Utilities.waitForElementEnabled(EditMeasurePage.saveButton, 50000)
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).should('include.text', 'DefinitionTermDefinition details for DefinitionTerm')
        cy.log('Measure Definition added successfully')

        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(MeasuresPage.ownedMeasures, 20700)
        cy.get(MeasuresPage.ownedMeasures).should('exist')
        cy.get(MeasuresPage.ownedMeasures).should('be.visible')

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //Endorsing Organization and number on Name, Version & ID page
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).should('have.value', 'CMS Consensus Based Entity')
        cy.get('[data-testid="endorsement-number-input"]').should('have.value', '345678')
        cy.log('Endorsing Organization and number added successfully')

        //steward
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('include.value', 'Able Health')
        cy.get('.MuiChip-label').should('include.text', 'ACO Health Solutions')
        cy.log('Measure Steward & Developers added successfully')

        //description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('contain.text', description)
        cy.log('Measure Description added successfully')

        //copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).should('contain.text', copyright)
        cy.log('Measure Copyright added successfully')

        //disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).should('contain.text', disclaimer)
        cy.log('Measure Disclaimer added successfully')

        //rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).should('contain.text', rationale)
        cy.log('Measure Rationale added successfully')

        //Purpose
        cy.get(EditMeasurePage.leftPanelPurpose).click()
        cy.get(EditMeasurePage.measurePurposeTextBox).should('contain.text', 'This is a purpose.')
        cy.get(EditMeasurePage.measurePurposeTextBox).clear().type('This is a purpose updated.')
        cy.get(EditMeasurePage.measurePurposeSaveBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.measurePurposeSavedMsg, 50000)
        cy.get(EditMeasurePage.measurePurposeSavedMsg).should('contain.text', 'Measure Purpose Information Saved Successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.measurePurposeSavedMsg, 50000)
        cy.reload()
        Utilities.waitForElementVisible(EditMeasurePage.measurePurposeTextBox, 50000)
        cy.get(EditMeasurePage.measurePurposeTextBox).should('contain.text', 'This is a purpose updated.')
        cy.log('Measure Purpose updated successfully')


        //guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).should('contain.text', guidance)
        cy.log('Measure Guidance added successfully')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('contain.text', clinicalRecommendation)
        cy.log('Measure Clinical Recommendation added successfully')

        //definition
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get('[aria-label="Edit"]').eq(0).click()
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseDialog, 50000)
        cy.get(EditMeasurePage.definitionTermInput).clear().type('DefinitionTermUpdate')
        cy.get(EditMeasurePage.definitionInput).clear().type('Definition details for DefinitionTerm')
        Utilities.waitForElementEnabled(EditMeasurePage.saveButton, 50000)
        cy.get(EditMeasurePage.saveButton).click()
        cy.get(EditMeasurePage.definitionMetaTable).find(EditMeasurePage.definitionMetaTableBody).should('include.text', 'DefinitionTermUpdateDefinition details for DefinitionTerm')
        cy.log('Measure Definition updated successfully')

        //delete definition
        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()
        cy.get('[aria-label="Delete"]').eq(0).click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteContinueButton, 50000)
        cy.get(CQLEditorPage.deleteContinueButton).click()
        Utilities.waitForElementToNotExist
        cy.log('Measure Definition deleted successfully')
    })

    it('Verify alphabetical order and pagination of Measure Definitions', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.leftPanelQiCoreDefinition).click()

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


        const expectedOrder = ['eight', 'eleven', 'five', 'four', 'nine', 'one', 'seven', 'six', 'ten', 'ThisIsTheDefinitionTermValue']
        const pageTwoOrder = ['three', 'twelve', 'two']

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

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue + 5

    before('Login', () => {

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Measure Id and Version Id are auto generated for new Measures', () => {

        //ensure pages loads all the way
        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)

        //Create New Measure
        CreateMeasurePage.CreateMeasure(newMeasureName, newCqlLibraryName, SupportedModels.qiCore4)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get('[data-testid="measure-id-text-field"]').should('exist')
        cy.get('[data-testid="measure-id-text-field"]').should('have.attr', 'readonly', 'readonly')

        cy.get('[data-testid="version-id-text-field"]').should('exist')
        cy.get('[data-testid="version-id-text-field"]').should('have.attr', 'readonly', 'readonly')
    })
})

describe('Generate CMS ID for QI-Core Measure', () => {

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue + 6

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

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

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue + 9

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

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

describe('Generate CMS ID - Non Measure and Shared Measure Owner validations', () => {

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue + 8

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')

    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Generate CMS ID button is disabled for Non Measure owners', () => {

        OktaLogin.AltLogin()

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).should('exist')
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('view')

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('not.be.enabled')

    })

    it('Verify that the Generate CMS ID button is disabled for Shared owners', () => {

        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        OktaLogin.AltLogin()

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).should('exist')
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('view')

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('not.be.enabled')

    })
})
