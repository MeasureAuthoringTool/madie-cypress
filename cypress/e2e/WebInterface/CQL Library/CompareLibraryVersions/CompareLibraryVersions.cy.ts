import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { TestData } from "../../../../Shared/TestData"

let CqlLibraryOne: string
const versionNumber = '1.0.000'
const validCql = QiCore6Cql.CQL_For_Cohort_Six

describe('CompareLibraryVersions', () => {

    beforeEach('Create CQL Library and Login', () => {

        CqlLibraryOne = 'CompareLibraryVersion' + Date.now()
        CQLLibraryPage.createLibraryAPI(CqlLibraryOne, SupportedModels.qiCore6, { cql: validCql })
        CQLLibraryPage.versionLibraryAPI(versionNumber)
    })
    
    afterEach('Logout and Clean up CQL Libraries', () => {

        //manually captured cqlLibrary2 as part of the test
        Utilities.deleteLibrary(CqlLibraryOne, false, 2)
    })

    it('Compare two Versions of a CQL Library', () => {
        let updatedCqlLibraryName = 'Updated' + CqlLibraryOne + Date.now()
        //Add Draft to Versioned Library
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(updatedCqlLibraryName)

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
            cy.get('[data-testid="cqlLibrary-button-' + libraryId + '-version-content"]').should('contain.text', '1.0.000')
            cy.get('[data-testid="cqlLibrary-button-' + libraryId + '-content"]').should('contain.text', CqlLibraryOne)
            cy.get('[data-testid="cql-library-action-' + libraryId + '"]').should('be.visible')
            cy.get('[data-testid="cql-library-action-' + libraryId + '"]').should('be.enabled')
        })

        cy.log('Draft Created Successfully')

        //Check Draft Library
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 30000)
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //Expand arrow and check Versioned Library
        TestData.readCqlLibraryId().then((libraryId) => {
            cy.get('[data-testid="cqlLibrary-button-' + libraryId + '_select"] > input').click()
        })

        //Click on Compare Versions button
        cy.get(MeasuresPage.compareVersionsBtn).should('be.enabled')
        cy.get('[data-testid="compare-versions-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Compare Library Versions')
        cy.get(MeasuresPage.compareVersionsBtn).click()

        //Verify Popup Screen
        cy.contains('h2', 'Compare Library Versions').should('be.visible')
        cy.get('[data-testid="library-name"]').should('contain.text', '-- ' + CqlLibraryOne + ' ++ ' + updatedCqlLibraryName)
        cy.contains('[role="dialog"]', 'Compare Library Versions').should('be.visible').within(() => {
            cy.contains('CQL').should('be.visible')
            cy.contains('Version 1.0.000').should('be.visible')
        })
    })
})
