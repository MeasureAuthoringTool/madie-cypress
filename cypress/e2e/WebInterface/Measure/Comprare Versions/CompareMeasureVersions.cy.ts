import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Toasts } from "../../../../Shared/Toasts"

let measureName = 'CompareMeasureVersion' + Date.now()
const cqlLibraryName = 'CompareMeasureVersion' + Date.now()
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const measureData: CreateMeasureOptions = {}
const randValue = (Math.floor((Math.random() * 1000) + 1))

measureData.ecqmTitle = measureName
measureData.cqlLibraryName = cqlLibraryName + randValue
measureData.measureCql = measureCQL

describe('Compare Measure Versions', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureData.ecqmTitle, measureData.cqlLibraryName, measureData.measureCql)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(measureData.ecqmTitle, measureData.cqlLibraryName)
        Utilities.deleteMeasure(null, null, false, false, 1)
    })

    it('Compare two Versions of a Measure', () => {

        let updatedMeasureName = 'Updated' + measureName + Date.now()
        let currentUser = Cypress.env('selectedUser')

        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Version Measure
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Version Created Successfully')

        //Add Draft to Versioned Measure
        MeasuresPage.actionCenter('draft')
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.wait('@drafted').then(int => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId1', int.response.body.id)
        })
        cy.get(Toasts.successToast, { timeout: 18500 }).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')

        //Check Draft Measure
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((draftMeasureId) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + draftMeasureId + '_select"] > [class="px-1"] > [type="checkbox"]', 90000)
            Utilities.waitForElementVisible('[data-testid="measure-name-' + draftMeasureId + '_select"] > [class="px-1"] > [class=" cursor-pointer"]', 90000)
            cy.get('[data-testid="measure-name-' + draftMeasureId + '_select"]').find('[type="checkbox"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + draftMeasureId + '_select"]').find('[type="checkbox"]').check()
            cy.get('[data-testid="measure-name-' + draftMeasureId + '_expandArrow"]').click().wait(1000)
        })

        //Check Versioned Measure
        cy.get('.expanded-row > :nth-child(1)').click()

        //Click on Compare Versions button
        cy.get(MeasuresPage.compareVersionsBtn).should('be.enabled')
        cy.get('[data-testid="compare-versions-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Compare Measure Versions')
        cy.get(MeasuresPage.compareVersionsBtn).click()

        //Verify Popup Screen
        cy.contains('h2', 'Compare Measure Versions').should('be.visible')
        cy.get('[data-testid="measure-name"]').should('contain.text', '-- ' + measureName)
            .and('contain.text', '++ ' + updatedMeasureName)
        cy.get(MeasuresPage.compareVersionsCqlTab).should('contain.text', 'CQL')
        cy.get(MeasuresPage.compareVersionsHRTab).should('contain.text', 'Human Readable')

        //Verify CQL Comparison
        cy.get('[class="react-diff-n9mfsc-code-fold-content"]').click()

        cy.contains('using QICore version \'4.1.1\'').should('be.visible')

        //Verify HR Comparison
        cy.get(MeasuresPage.compareVersionsHRTab).click()

        // very basic check that HR will display - Utilities.waitForElementVisible won't work here with nesting
        cy.contains('eCQMTitle4QICore', { timeout: 12500 }).should('be.visible')

        cy.contains('Differences (4)', { timeout: 9500 }).should('be.visible')
    })
})