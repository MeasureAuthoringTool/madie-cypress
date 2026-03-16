import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

const now = Date.now()
const measureName = 'MeasureTransfer' + now
const cqlLibraryName = 'MeasureTransferLib' + now
const measureCQL = MeasureCQL.SBTEST_CQL
let harpUserALT = ''

describe('Measure Transfer performed by Admin user', () => {

    beforeEach('Create Measure', () => {

        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()
    })

    it('Admin user can transfer a Measure owned by other users', () => {

        OktaLogin.AdminLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        // initiate transfer to altUser, with retain
        MeasuresPage.actionCenter('transfer')

        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get('[data-testid="retainShareAccess"]').click()
        cy.get(MeasuresPage.transferContinueButton).click()
        
        // Verify success toast
        cy.get('[data-testid="toast-success"]', { timeout: 5500 }).should('contain.text', 'The measure(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the measures.')

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        MeasuresPage.validateMeasureName(measureName)
        // verify shared = true
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('be.visible')

        MeasuresPage.actionCenter('edit')

        cy.readFile('cypress/fixtures/accountRealNames.json').should('exist').then((nameData) => {

            // verify altUser name as owner
            const owner = nameData[harpUserALT]
            cy.get('[data-testid="measure-owner-text-field"]').should('contain.text', owner)
        })

        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)

         // show history, verify event messages
        cy.get('[data-testid="measure-history-cell-0_actionType"]').should('contain.text', 'SHARED')
        cy.get('[data-testid="measure-history-cell-0_additionalActionMessage"]').should('contain.text', 'by MADiE Admin')
        cy.get('[data-testid="measure-history-cell-1_actionType"]').should('contain.text', 'OWNERSHIP_TRANSFER')
        cy.get('[data-testid="measure-history-cell-1_additionalActionMessage"]').should('contain.text', 'by MADiE Admin')
    })
})