import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage, CreateLibraryOptions, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { QiCore4Cql, QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"

const now = Date.now()
const libName1 = 'UpgradeFrom4v' + now
const libName2 = 'UpgradeFrom6v' + now

const lib1Options: CreateLibraryOptions = {
    description: 'start from qicore 4.1.1',
    cql: QiCore4Cql.ICFCleanTestQICore
}
const lib2Options: CreateLibraryOptions = {
    description: 'start from qicore 6.0.0',
    cql: QiCore6Cql.CQL_For_Cohort_Six,
    libraryNumber: 1
}
describe('Upgrade QiCore CQL Library model during draft process', () => {

    afterEach('Delete Libraries', () => {

        OktaLogin.UILogout()  
    })

    it('Upgrade 4.1.1 to 7.0.0', () => {
        CQLLibraryPage.createLibraryAPI(libName1, SupportedModels.qiCore4, lib1Options)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        CQLLibraryPage.actionCenter(EditLibraryActions.version)

        cy.get(CQLLibraryPage.actionCenterDraft).should('be.enabled')
        cy.get(CQLLibraryPage.actionCenterDraft).click()

        Utilities.dropdownSelect(CreateMeasurePage.measureModelDropdown, SupportedModels.qiCore7)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()

        // validate 7.0.0 in metadata
        cy.get(CQLLibraryPage.libraryInfoPanel).contains('QI-Core v7.0.0').should('be.visible')

        ///validate 7.0.0 in CQL
        cy.get('.ace_line').eq(1).should('have.text', 'using QICore version \'7.0.0\'')
    })

    it('Upgrade 6.0.0 to 7.0.0', () => {
        CQLLibraryPage.createLibraryAPI(libName2, SupportedModels.qiCore6, lib2Options)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary(1)

        CQLLibraryPage.actionCenter(EditLibraryActions.version)

        cy.get(CQLLibraryPage.actionCenterDraft).should('be.enabled')
        cy.get(CQLLibraryPage.actionCenterDraft).click()

        Utilities.dropdownSelect(CreateMeasurePage.measureModelDropdown, SupportedModels.qiCore7)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()

        // validate 7.0.0 in metadata
        cy.get(CQLLibraryPage.libraryInfoPanel).contains('QI-Core v7.0.0').should('be.visible')

        ///validate 7.0.0 in CQL
        cy.get('.ace_line').eq(1).should('have.text', 'using QICore version \'7.0.0\'')
    })
})