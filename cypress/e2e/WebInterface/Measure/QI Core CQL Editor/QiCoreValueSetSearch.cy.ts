import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

let measureName = 'QiCoreParamsMeasure' + Date.now()
let CqlLibraryName = 'QiCoreParamsLibrary' + Date.now()
let measureCQL = 'library QiCoreLibrary1723824228401 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SupplementalData\n' +
    'include CQMCommon version \'2.2.000\' called CQMCommon\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    ' default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    ' context Patient\n' +
    ' define "Initial Population":\n' +
    '   true\n' +
    '          \n' +
    '                                                                 \n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '  (Enc E where E.status = \'finished\') is not null '

describe('QiCore Value Set Search fields, filter and apply the filter to CQL', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false, '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'boolean', null)

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search, filter and apply Value Set to CQL', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.464.1003.101.12.1001')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //enter / select filter type
        cy.get(CQLEditorPage.valueSetSearchFilterDropDown).type('Status')
        cy.get(CQLEditorPage.valueSetSearchFilterListBox).contains('Status').click()
        cy.get(CQLEditorPage.valueSetSearchFilterInput).type('Active')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchFilterApplyBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchFilterApplyBtn).click()

        //results grid is updated to only show one entry, now, after filter
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••')

        //Apply Value Set to the Measure
        cy.get(CQLEditorPage.applyValueSet).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Value Set Office Visit has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the Value Set
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
    })

    it('Verify that Definition Version is disabled until OID/URL field is selected', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Verify that the Search Definition Version field is disabled before selecting OID/URL field
        cy.get(CQLEditorPage.valueSetsTab).click()
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('Definition Version')
        cy.get('#search-by-category-option-0').should('not.be.enabled')
        cy.get('#search-by-category-option-0').trigger('mouseover').invoke('show')
        cy.contains('OID/URL must be selected first')
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).should('not.exist')

        //Verify that the Search Definition Version field is enabled after selecting OID/URL field
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).clear().type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.464.1003.101.12.1001')
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).click()
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('Definition Version').click()
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).should('exist')

        //Enter value in to Search Definition Version field
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).type('20180310')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••')

    })

    it('Value set Details screen', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.1444.3.217')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatus' +
            'Cancer Stage IAmerican Society of Clinical Oncology Stewardurn:oid:2.16.840.1.113883.3.1444.3.217ACTIVE' +
            '•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //Click on Value Set Details
        cy.get(CQLEditorPage.valueSetActionCentreBtn).click()
        cy.get(CQLEditorPage.viewValueSetDetails).click()

        cy.get(CQLEditorPage.valueSetDetailsScreen).should('contain.text', '"url": "http://cts.nlm.nih.gov' +
            '/fhir/ValueSet/2.16.840.1.113883.3.1444.3.217"')
        cy.get(CQLEditorPage.valueSetDetailsScreen).should('contain.text', '"name": "American Society of Clinical Oncology Author"')

    })

    it('Edit Value Set with suffix and apply to CQL', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.1444.3.217')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatus' +
            'Cancer Stage IAmerican Society of Clinical Oncology Stewardurn:oid:2.16.840.1.113883.3.1444.3.217ACTIVE' +
            '•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //Click on Edit Value Set
        cy.get(CQLEditorPage.valueSetActionCentreBtn).click()
        cy.get(CQLEditorPage.editValueSet).click()

        //Add suffix
        cy.get(CQLEditorPage.valueSetSuffixInput).type('1234')
        cy.get(CQLEditorPage.applyValueSetSuffix).click()
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Value Set Cancer Stage I (1234) has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the Value Set
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
    })
})