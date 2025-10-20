import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

const measureCQL_WithWarnings = QiCore4Cql.intentionalWarningCql

let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

let measureName = 'MeasureSearch' + Date.now()
let CqlLibraryName = 'MeasureSearchLib' + Date.now()
let newMeasureName = ''
let tempCqlLibName = ''
let QDMmeasureName = 'QDMMeasureSearch' + Date.now()
let QDMCqlLibraryName = 'QDMMeasureSearchLib' + Date.now()
let currentUser = Cypress.env('selectedUser')
let measureSetFilePath = 'cypress/fixtures/' + currentUser + '/measureSetId'


describe('Measure List Page Searching', () => {

    let measureName = ''
    let CqlLibraryName = ''

    beforeEach('Login', () => {

        measureName = 'MeasureSearch1' + Date.now()
        CqlLibraryName = 'MeasureSearchLib1' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Measure search on My Measures and All Measures tab', () => {

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Search for the Measure under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Delete the Measure & search for deleted Measure under Owned Measures tab
        cy.log('Delete Measure')
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureName + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Search for Deleted Measure
        cy.log('Search for Deleted Measure')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

        //Search for deleted Measure under All Measures tab
        cy.log('Search for Deleted Measure under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

    })

    it('Verify warning message on Measure list page', () => {

        //Warning Message on My Measures page
        cy.get(MeasuresPage.searchInputBox).type('!@#$').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

        //Warning Message on All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type('&%*').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')
    })

    it('When searching, page count always resets to 1', () => {

        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.wait(5500)

        cy.get('.pagination-container').contains('button', '6').click()
        cy.url().should('include', 'page=6')

        cy.get(MeasuresPage.searchInputBox).clear().type('dental{enter}')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        cy.contains('75FHIR').should('be.visible')

        cy.url().should('include', 'page=1')
        cy.get('.pagination-container').contains('button', '1').should('have.class', 'Mui-selected')
    })
})

describe('Measure Filter on measure list page and searching with filters', () => {

    before('Login', () => {

        let currentUser = Cypress.env('selectedUser')
        let measureSetFilePath = 'cypress/fixtures/' + currentUser + '/measureSetId'

        //Create New Qi Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL_WithWarnings, 0)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Encounter')

        //Create New QDM Measure
        CreateMeasurePage.CreateQDMMeasureAPI(QDMmeasureName, QDMCqlLibraryName, measureCQL, false, false, null, null, 1)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean', 1)

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)
        MeasuresPage.actionCenter('edit', 0)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Button for Qi Core measure
        MeasuresPage.actionCenter('edit', 0)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        //intercept cmd id once cms id is generated
        cy.readFile(measureSetFilePath).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/create-cms-id').as('cmdIdGen')
        })
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.wait('@cmdIdGen', { timeout: 90000 }).then((request) => {
            cy.writeFile('cypress/fixtures/cmsId4QiCore', (request.response.body.cmsId).toString())
        })
        cy.get(EditMeasurePage.cmsIdInput).should('not.be.null')
        cy.get(Header.mainMadiePageButton).click()


        //Click on Edit Button for QDM measure
        MeasuresPage.actionCenter('edit', 1)
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        //intercept cmd id once cms id is generated
        cy.readFile(measureSetFilePath + 1).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/create-cms-id').as('cmdIdGen')
        })
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.wait('@cmdIdGen', { timeout: 60000 }).then((request) => {
            cy.writeFile('cypress/fixtures/cmsId4QDM', (request.response.body.cmsId).toString())
        })
        cy.get(EditMeasurePage.cmsIdInput).should('not.be.null')
        cy.get(Header.mainMadiePageButton).click()

    })

    after('Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName, false, false, 0)
        Utilities.deleteMeasure(QDMmeasureName, QDMCqlLibraryName, false, false, 1)
    })

    it('Measure search on My Measures and All Measures tab using the Measure filter', () => {
        newMeasureName = measureName + 'new'
        tempCqlLibName = CqlLibraryName + 'rand' + Date.now()

        //set filter to "Measure"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()

        //Search for the Qi Core Measure using Measure name
        cy.log('Search Qi Core Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')

        //Search for the QDM Measure using Measure name
        cy.log('Search QDM Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(QDMmeasureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)

        //Search for the Measure under All Measures tab
        cy.log('Search and filter Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()

        //set filter to "Measure"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')

        //Search for the QDM Measure using Measure name
        cy.log('Search QDM Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(QDMmeasureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.equal', QDMmeasureName)

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.equal', measureName)

        //navigate to owned measures
        cy.get(MeasuresPage.ownedMeasures).click()

        //set filter to "Measure"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Measure')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //create version using action button with different measure name (and confirm that filter is not removed)
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        //set filter to "measure"
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Measure')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')

        //draft with a new name
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(newMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
        cy.get(MeasuresPage.searchInputBox).should('include.value', measureName)

        //search / filter and verify that parent and chiled can be seen / is returned
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', newMeasureName)

        //create new measure
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterMeasureOption).click()
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')

        CreateMeasurePage.CreateMeasure(measureName, tempCqlLibName, SupportedModels.qiCore4)
        cy.get(Header.mainMadiePageButton).wait(1500).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Filter By')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
    })

    it('Measure search on My Measures and All Measures tab using the Version filter', () => {

        //Login
        OktaLogin.Login()

        //set filter to "Version"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterVersionOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Version')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('1.0.000').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //Search for the Measure by version under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterVersionOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Version')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('1.0.000').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)
    })

    it('Measure search on My Measures and All Measures tab using the Model filter', () => {

        //Login
        OktaLogin.Login()

        //set filter to "Model"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterModelOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Model')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('Qi-Core').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //set filter to "Model"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterModelOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Model')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('QDM').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //Search for the Measure by model under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterModelOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Model')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('Qi-Core').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //set filter to "Model"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterModelOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'Model')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.get(MeasuresPage.searchInputBox).type('QDM').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)
    })

    it('Measure search on My Measures and All Measures tab using the CMS ID filter', () => {

        //Login
        OktaLogin.Login()

        //set filter to "CMS ID"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterCMSIdOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'CMS ID')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.readFile('cypress/fixtures/cmsId4QiCore').should('exist').then((fileContents) => {
            cy.get(MeasuresPage.searchInputBox).type(fileContents).type('{enter}')
        })
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //set filter to "CMS ID"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterCMSIdOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'CMS ID')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.readFile('cypress/fixtures/cmsId4QDM').should('exist').then((fileContents) => {
            cy.get(MeasuresPage.searchInputBox).type(fileContents).type('{enter}')
        })
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //Search for the Measure by cms id under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterCMSIdOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'CMS ID')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.readFile('cypress/fixtures/cmsId4QiCore').should('exist').then((fileContents) => {
            cy.get(MeasuresPage.searchInputBox).type(fileContents).type('{enter}')
        })
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //set filter to "CMS ID"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterCMSIdOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'CMS ID')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')
        cy.readFile('cypress/fixtures/cmsId4QDM').should('exist').then((fileContents) => {
            cy.get(MeasuresPage.searchInputBox).type(fileContents).type('{enter}')
        })
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', QDMmeasureName)
    })

    it('Measure search on My Measures and All Measures tab using no filter', () => {

        //Login
        OktaLogin.Login()

        //set filter to "-"
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()

        //Search for the Qi Core Measure using Measure name
        cy.log('Search Qi Core Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //clear filter and search
        cy.get(MeasuresPage.searchInputBox).clear()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).type('{selectall}{backspace}')
        cy.get(MeasuresPage.searchInputBox).type('{enter}')

        //Search for the Measure under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterNoOption).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)
    })
})
