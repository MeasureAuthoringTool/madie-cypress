import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { EditMeasureActions, EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'

const measureCQL = MeasureCQL.SBTEST_CQL
let measureName = ''
let cqlLibraryName = ''
let harpUserALT = ''
let transferred = false

describe('Measure Transfer performed by Admin user', () => {
    beforeEach('Create Measure', () => {
        const now = Date.now()
        measureName = 'MeasureTransfer' + now
        cqlLibraryName = 'MeasureTransferLib' + now
        harpUserALT = OktaLogin.getUser(true)
        transferred = false

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        return cy.wrap(null)
    })

    afterEach('Clean up transferred measure', () => {
        return Utilities.deleteVersionedMeasure(measureName, cqlLibraryName, false, transferred)
    })

    it('Admin user can transfer a Measure owned by other users', () => {
        OktaLogin.AdminLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        // initiate transfer to altUser, with retain
        MeasuresPage.actionCenter('transfer')

        // added for https://jira.cms.gov/browse/MAT-9627
        cy.get(MeasuresPage.newOwnerTextbox).type('notAnActualUser')
        cy.get(MeasuresPage.transferContinueButton).click()
        cy.get(MeasuresPage.newOwnerErrorText).should(
            'contain.text',
            'The provided HARP ID is not associated with an active MADiE user.'
        )

        cy.get(MeasuresPage.newOwnerTextbox).clear().type(harpUserALT)
        cy.get('[data-testid="retainShareAccess"]').click()
        cy.get(MeasuresPage.transferContinueButton).click()

        // Verify success toast
        cy.get('[data-testid="toast-success"]', { timeout: 5500 }).should(
            'contain.text',
            'The measure(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the measures.'
        )
        cy.then(() => {
            transferred = true
        })

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        MeasuresPage.validateMeasureName(measureName)
        // verify shared = true
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('be.visible')

        MeasuresPage.actionCenter('edit')

        cy.readFile('cypress/fixtures/accountRealNames.json')
            .should('exist')
            .then((nameData) => {
                // verify altUser name as owner
                const owner = nameData[harpUserALT]
                cy.get('[data-testid="measure-owner-text-field"]').should('contain.text', owner)
            })

        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)

        // show history, verify event messages
        cy.get('[data-testid="measure-history-cell-0_actionType"]').should('contain.text', 'SHARED')
        cy.get('[data-testid="measure-history-cell-0_additionalActionMessage"]').should(
            'contain.text',
            'by MADiE Admin'
        )
        cy.get('[data-testid="measure-history-cell-1_actionType"]').should('contain.text', 'OWNERSHIP_TRANSFER')
        cy.get('[data-testid="measure-history-cell-1_additionalActionMessage"]').should(
            'contain.text',
            'by MADiE Admin'
        )
    })
})
