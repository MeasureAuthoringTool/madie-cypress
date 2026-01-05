import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"

const dayjs = require('dayjs')
const today = dayjs().format('M/D/YYYY')

describe('CQL Library List Page Sort by Columns', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('CQL Library sorting by columns on All Libraries tab', () => {

        //Library Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=cqlLibraryName,false').as('sort')
        cy.intercept('api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=cqlLibraryName,true').as('sort2')

        //Version Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=version,false').as('sort3')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=version,true').as('sort4')

        //Status Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=draft,false').as('sort5')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=draft,true').as('sort6')

        //Model Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=model,false').as('sort7')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=model,true').as('sort8')

        //Shared Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=librarySet.acls,false').as('sort9')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=librarySet.acls,true').as('sort10')

        //Updated Sort
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=lastModifiedAt,false').as('sort11')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=lastModifiedAt,true').as('sort12')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //sort by Library
        cy.contains('.col-header', 'Library').click()
        cy.wait('@sort')
        CQLLibraryPage.checkFirstRow({ name: 'AAO21' })
        cy.contains('.col-header', 'Library').click()
        cy.wait('@sort2')
        CQLLibraryPage.checkFirstRow({ name: 'VTEv72' })

        // sort by version
        cy.contains('.col-header', 'Version').click()
        cy.wait('@sort3')
        CQLLibraryPage.checkFirstRow({ version: '0.0.000' })
        cy.contains('.col-header', 'Version').click()
        cy.wait('@sort4')
        CQLLibraryPage.checkFirstRow({ version: '10.3.000' })

        // sort by status
        cy.contains('.col-header', 'Status').click()
        cy.wait('@sort5')
        CQLLibraryPage.checkFirstRow({ status: '' })
        cy.contains('.col-header', 'Status').click()
        cy.wait('@sort6')
        CQLLibraryPage.checkFirstRow({ status: 'Draft' })

        // sort by model
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort7')
        CQLLibraryPage.checkFirstRow({ model: SupportedModels.QDM })
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort8')
        CQLLibraryPage.checkFirstRow({ model: SupportedModels.qiCore6 })

        // sort by shared
        cy.contains('.col-header', 'Shared').click()
        cy.wait('@sort9')
        CQLLibraryPage.checkFirstRow({ shared: false })
        cy.contains('.col-header', 'Shared').click()
        cy.wait('@sort10')
        CQLLibraryPage.checkFirstRow({ shared: true })

        // sort by updated
        cy.contains('.col-header', 'Updated').click()
        cy.wait('@sort11')
        CQLLibraryPage.checkFirstRow({ updated: '11/22/2022' })
        cy.contains('.col-header', 'Updated').click()
        cy.wait('@sort12')
        CQLLibraryPage.checkFirstRow({ updated: today })
    })

    it('Column sort resets pagination to page 1', () => {

        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=model,false').as('sort')
        cy.intercept('/api/cql-libraries/searches?ownershipType=ALL&limit=10&page=0&sortInfo=model,true').as('sort2')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        // go to page 2
        cy.get(MeasuresPage.paginationNextButton).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        // sort by model
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort')
        CQLLibraryPage.checkFirstRow({ model: SupportedModels.QDM })

        // verify page 1
        cy.url().should('match', /page=1/)
        cy.get('button[aria-current="page"]').should('have.text', '1')

        // go to page 6
        cy.get('.MuiPagination-ul').children().eq(5).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        // verify page 6
        cy.url().should('match', /page=6/)
        cy.get('button[aria-current="page"]').should('have.text', '6')

        // sort by model again to reset
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort2')
        CQLLibraryPage.checkFirstRow({ model: SupportedModels.qiCore6 })

        // verify page 1
        cy.url().should('match', /page=1/)
        cy.get('button[aria-current="page"]').should('have.text', '1')
    })

    it('Sort is not allowed on checkbox column and action button column', () => {

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        cy.get('thead tr').first().then(headerRow => {

            // checkbox
            cy.wrap(headerRow.children().eq(0).find('button')).should('not.have.class', 'header-button')
            // action button
            cy.wrap(headerRow.children().eq(7).find('button')).should('not.have.class', 'header-button')
        })
    })
})
