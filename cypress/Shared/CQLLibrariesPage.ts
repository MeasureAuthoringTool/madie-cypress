import { Header } from "./Header"
import { Utilities } from "./Utilities"
import { CQLLibraryPage } from "./CQLLibraryPage"


export class CQLLibrariesPage {

    //Version and Draft CQL Library
    public static readonly versionLibraryRadioButton = '[name="type"]'
    public static readonly createVersionContinueButton = '[data-testid="create-version-continue-button"] > :nth-child(1)'
    public static readonly VersionDraftMsgs = '.MuiAlert-message'
    public static readonly cqlLibraryVersionList = '[data-testid="cqlLibrary-button-0_version"]'
    public static readonly updateDraftedLibraryTextBox = '[data-testid="cql-library-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly versionErrorMsg = '[data-testid=create-version-error-message]'
    public static readonly versionCancelBtn = '[data-testid="create-version-cancel-button"]'
    public static readonly editCQLLibraryAlertMessage = '.madie-alert'
    public static readonly cqlLibraryDirtyCheck = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]'

    //Action Center buttons
    public static readonly actionCenterDeleteBtn = '[data-testid="delete-action-btn"]'
    public static readonly actionCenterVersionBtn = '[data-testid="version-action-btn"]'
    public static readonly actionCenterDraftBtn = '[data-testid="draft-action-btn"]'
    public static readonly actionCenterShareBtn = '[data-testid="share-action-btn"]'

    //Share/Un share Library
    public static readonly shareOption = '[data-testid="Share With-option"]'
    public static readonly unshareOption = '[data-testid="Unshare-option"]'
    public static readonly harpIdInputTextBox = '[data-testid="harp-id-input"]'
    public static readonly addBtn = '[id="add-user-btn"]'
    public static readonly expandArrow= '[data-testid="KeyboardArrowRightIcon"]'
    public static readonly sharedUserTable = '[data-testid="row-item"]'
    public static readonly saveUserBtn = '[data-testid="share-save-button"]'
    public static readonly successMsg = '[class="toast success"]'
    public static readonly unshareCheckBox = '.PrivateSwitchBase-input'
    public static readonly acceptBtn = '[data-testid="share-confirmation-dialog-accept-button"]'

    public static clickEditforCreatedLibrary(secondLibrary?: boolean): void {
        let filePath = 'cypress/fixtures/cqlLibraryId'

        if (secondLibrary === true) {
            filePath = 'cypress/fixtures/cqlLibraryId2'
        }
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)
        cy.readFile(filePath).should('exist').then((fileContents) => {

            cy.intercept('GET', '/api/cql-libraries/' + fileContents).as('cqlLibrary')

            cy.get('[data-testid=edit-cql-library-button-' + fileContents + ']').should('exist')
            cy.get('[data-testid=edit-cql-library-button-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=edit-cql-library-button-' + fileContents + ']', 3500)
            cy.get('[data-testid=edit-cql-library-button-' + fileContents + ']').click()

            cy.wait('@cqlLibrary').then(({ response }) => {
                expect(response.statusCode).to.eq(200)
            })

        })
    }

    public static clickViewforCreatedLibrary(secondLibrary?: boolean): void {
        let filePath = 'cypress/fixtures/cqlLibraryId'

        if (secondLibrary === true) {
            filePath = 'cypress/fixtures/cqlLibraryId2'
        }
        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)
        cy.readFile(filePath).should('exist').then((fileContents) => {

            cy.intercept('GET', '/api/cql-libraries/' + fileContents).as('cqlLibrary')

            cy.get('[data-testid=view-cql-library-button-' + fileContents + ']').should('exist')
            cy.get('[data-testid=view-cql-library-button-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=view-cql-library-button-' + fileContents + ']', 3500)
            cy.get('[data-testid=view-cql-library-button-' + fileContents + ']').click()

            cy.wait('@cqlLibrary').then(({ response }) => {
                expect(response.statusCode).to.eq(200)
            })

        })
    }

    public static validateCQLLibraryName(expectedValue: string): void {

        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.get('[data-testid=cqlLibrary-button-' + fileContents + ']').should('contain', expectedValue)

        })
    }

    public static validateVersionNumber(expectedValue: string, versionNumber: string): void {
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

           cy.get('[data-testid=cqlLibrary-button-' + fileContents + ']')
            .should('contain.text', expectedValue)
            .parent()
            .invoke('data', 'testid')
            .then(testId => {
                const value: string  = (testId.split('_')[0]).slice(-1) // extract row index value
                cy.get('[data-testid="cqlLibrary-button-' + value + '_version"]').should('contain.text', versionNumber)
            })
        })
    }

    public static cqlLibraryActionCenter(action: string, libraryNumber?: number): void {

        if ((libraryNumber === undefined) || (libraryNumber === null)) {

            Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
            cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        }

        if ((libraryNumber > 0)) {

            Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-' + libraryNumber + '_select"]', 500000)
            cy.get('[data-testid="cqlLibrary-button-' + libraryNumber + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        }

        switch ((action.valueOf()).toString().toLowerCase()) {

            case 'delete': {
                cy.get(this.actionCenterDeleteBtn).should('be.visible')
                cy.get(this.actionCenterDeleteBtn).should('be.enabled')
                cy.get(this.actionCenterDeleteBtn).click()

                break
            }
            case 'version': {
                cy.get(this.actionCenterVersionBtn).should('be.visible')
                cy.get(this.actionCenterVersionBtn).should('be.enabled')
                cy.get(this.actionCenterVersionBtn).click()

                break
            }
            case 'draft': {
                cy.get(this.actionCenterDraftBtn).should('be.visible')
                cy.get(this.actionCenterDraftBtn).should('be.enabled')
                cy.get(this.actionCenterDraftBtn).click()

                break
            }
            case 'share': {
                cy.get(this.actionCenterShareBtn).should('be.visible')
                cy.get(this.actionCenterShareBtn).should('be.enabled')
                cy.get(this.actionCenterShareBtn).click()

                break
            }
            default: { }
        }
    }
}
