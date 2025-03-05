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

            let element = cy.get('[data-testid=cqlLibrary-button-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue).children().eq(3).should('contain', versionNumber)
        })
    }

    public static clickDraftforCreatedLibrary(): void {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').click()
            cy.get('[data-testid="create-new-draft-' + fileContents + '-button"]').click()
        })
    }

    public static cqlLibraryAction(action: string, secondTestCase?: boolean): void {
        let filePath = 'cypress/fixtures/cqlLibraryId'

        if (secondTestCase === true) {
            filePath = 'cypress/fixtures/cqlLibraryId2'
        }
        cy.get(Header.cqlLibraryTab).click()
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="edit-cql-library-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="edit-cql-library-button-' + fileContents + '"]', 50000)
            cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').should('be.enabled')
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').click()
                    Utilities.waitForElementVisible('[data-testid="edit-cql-library-button-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="edit-cql-library-button-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="edit-cql-library-button-' + fileContents + '"]').click()

                    break
                }
                case 'version': {
                    cy.get('[data-testid="edit-cqlLibrary-button-' + fileContents + '"]').click()
                    Utilities.waitForElementVisible('[data-testid="create-new-version-' + fileContents + '-button"]', 105000)
                    cy.get('[data-testid="create-new-version-' + fileContents + '-button"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="create-new-version-' + fileContents + '-button"]', 105000)
                    cy.get('[data-testid="create-new-version-' + fileContents + '-button"]').should('be.enabled')
                    cy.get('[data-testid="create-new-version-' + fileContents + '-button"]').click()
                    break
                }
                case 'delete': {
                    cy.scrollTo('top')
                    cy.get('[data-testid="edit-cqlLibrary-button-' + fileContents + '"]').click()
                    Utilities.waitForElementVisible('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
                    cy.get('[data-testid="delete-existing-draft-' + fileContents + '-button"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="delete-existing-draft-' + fileContents + '-button"]', 55000)
                    cy.get('[data-testid="delete-existing-draft-' + fileContents + '-button"]').should('be.enabled')
                    cy.get('[data-testid="delete-existing-draft-' + fileContents + '-button"]').click()
                    break
                }
                default: { }
            }
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
            default: { }
        }
    }
}
