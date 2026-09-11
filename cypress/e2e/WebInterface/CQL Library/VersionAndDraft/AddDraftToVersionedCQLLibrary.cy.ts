import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { TestData } from "../../../../Shared/TestData"

let CqlLibraryOne: string
const versionNumber = '1.0.000'
const validCql = QiCore6Cql.CQL_For_Cohort_Six

describe('Action Center Buttons - Add Draft to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {

        CqlLibraryOne = 'DraftingLibrary' + Date.now()
        CQLLibraryPage.createLibraryAPI(CqlLibraryOne, SupportedModels.qiCore6, { cql: validCql })
        CQLLibraryPage.versionLibraryAPI(versionNumber)
    })

    it('Add Draft to the versioned Library from Owned Libraries', () => {
        //Add Draft to Versioned Library
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(CqlLibraryOne)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        CQLLibrariesPage.interceptDraftCreation()
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        CQLLibrariesPage.storeDraftLibraryId()

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')

        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', '1.0.000')
        cy.get(CQLLibrariesPage.row0_Status).should('contain', 'Draft')
        
        cy.get(CQLLibrariesPage.row0_ExpandArrow).should('be.visible')
        cy.get(CQLLibrariesPage.row0_ExpandArrow).click()
        
        TestData.readCqlLibraryId().then((libraryId) => {
            cy.get('[data-testid="cqlLibrary-expanded-' + libraryId + '"]').should('be.visible')
            //Nested objects are using cqlLibrary-button abd not measue-name, so changing to cqlLibrary-button for nested objects
            cy.get('[data-testid="cqlLibrary-button-' + libraryId + '-version-content"]').should('contain.text', '1.0.000')
            cy.get('[data-testid="cqlLibrary-button-' + libraryId + '-content"]').should('contain.text', CqlLibraryOne)
            cy.get('[data-testid="cql-library-action-' + libraryId + '"]').should('be.visible')
            cy.get('[data-testid="cql-library-action-' + libraryId + '"]').should('be.enabled')
        })

        cy.log('Draft Created Successfully')

        OktaLogin.UILogout()

        Utilities.deleteLibrary(CqlLibraryOne,false, 2)
    })

    it('Add Draft to the versioned Library from Edit Library screen', () => {
        CQLLibrariesPage.interceptDraftCreation()

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()
        CQLLibraryPage.actionCenter(EditLibraryActions.draft)

        CQLLibrariesPage.storeDraftLibraryId(0)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibraryPage.draftBubble).should('be.visible')
        cy.log('Draft Created Successfully')
        OktaLogin.UILogout()

        //Delete Draft Library
        Utilities.deleteLibrary(CqlLibraryOne)
    })

    it('Non Measure Owner unable to add Draft to the versioned Library using Action Center Buttons', () => {

        //Verify that the Draft button is disabled for Non Measure owner

        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesTab).click().wait(1000)

        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 600000)
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.disabled')

        //Verify that Non Measure owner unable to edit Library
        cy.contains('View').click()
        cy.get(TestCasesPage.importTestCaseSuccessInfo).should('contain.text', 'You are not the owner of the CQL Library. Only owner can edit it.')
        cy.get(CQLLibraryPage.readOnlyCqlLibraryName).should('have.attr', 'readonly')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('have.attr', 'readonly')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')
    })
})
