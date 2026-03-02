import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"

const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

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

        // sort by Library ASC
        cy.contains('.col-header', 'Library').click()
        cy.wait('@sort')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(1).invoke('text').then(ascName => {
            // sort by Library DESC
            cy.contains('.col-header', 'Library').click()
            cy.wait('@sort2')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(1).invoke('text').then(descName => {
                // ASC first name should come before DESC first name alphabetically
                expect(ascName.toLowerCase().localeCompare(descName.toLowerCase())).to.be.lessThan(0)
            })
        })

        // sort by Version ASC
        cy.contains('.col-header', 'Version').click()
        cy.wait('@sort3')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(2).invoke('text').then(ascVersion => {
            // sort by Version DESC
            cy.contains('.col-header', 'Version').click()
            cy.wait('@sort4')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(2).invoke('text').then(descVersion => {
                // ASC and DESC should produce different first versions
                expect(ascVersion).to.not.equal(descVersion)
            })
        })

        // sort by Status ASC
        cy.contains('.col-header', 'Status').click()
        cy.wait('@sort5')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(3).invoke('text').then(ascStatus => {
            // sort by Status DESC
            cy.contains('.col-header', 'Status').click()
            cy.wait('@sort6')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(3).invoke('text').then(descStatus => {
                // At least one of the two should show 'Draft'
                const hasDraft = ascStatus === 'Draft' || descStatus === 'Draft'
                expect(hasDraft).to.be.true
            })
        })

        // sort by Model ASC
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort7')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(4).invoke('text').then(ascModel => {
            // sort by Model DESC
            cy.contains('.col-header', 'Model').click()
            cy.wait('@sort8')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(4).invoke('text').then(descModel => {
                // ASC and DESC should produce different first models
                expect(ascModel).to.not.equal(descModel)
                // ASC should come before DESC alphabetically
                expect(ascModel.localeCompare(descModel)).to.be.lessThan(0)
            })
        })

        // sort by Shared ASC
        cy.contains('.col-header', 'Shared').click()
        cy.wait('@sort9')
        cy.wait(1100)
        // sort by Shared DESC - verify the shared icon appears on the first row
        cy.contains('.col-header', 'Shared').click()
        cy.wait('@sort10')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(5).find('[data-testid="CheckCircleOutlineIcon"]').should('exist')

        // sort by Updated ASC - oldest first
        cy.contains('.col-header', 'Updated').click()
        cy.wait('@sort11')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(7).invoke('text').then(ascDate => {
            // sort by Updated DESC - newest first
            cy.contains('.col-header', 'Updated').click()
            cy.wait('@sort12')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(7).invoke('text').then(descDate => {
                // Verify sorting changed the order
                const ascParsed = dayjs(ascDate, 'M/D/YYYY')
                const descParsed = dayjs(descDate, 'M/D/YYYY')
                if (ascParsed.isValid() && descParsed.isValid()) {
                    // The oldest date (ASC) should be before the newest date (DESC)
                    expect(ascParsed.isBefore(descParsed)).to.be.true
                } else {
                    // If dates can't be parsed, at least verify sort order changed
                    expect(ascDate).to.not.equal(descDate)
                }
            })
        })
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

        // sort by model ASC
        cy.contains('.col-header', 'Model').click()
        cy.wait('@sort')
        cy.wait(1100)
        cy.get('.table-body tr').first().find('td').eq(4).invoke('text').then(ascModel => {

            // verify page 1
            cy.url().should('match', /page=1/)
            cy.get('button[aria-current="page"]').should('have.text', '1')

            // navigate away from page 1 by clicking a numbered page button (not prev/next arrows)
            cy.get('.MuiPagination-ul button[aria-label^="Go to page"]').last().click()
            Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

            // verify we're not on page 1
            cy.get('button[aria-current="page"]').invoke('text').then(lastPageNumber => {
                expect(Number(lastPageNumber)).to.be.greaterThan(1)
            })

            // sort by model DESC to reset
            cy.contains('.col-header', 'Model').click()
            cy.wait('@sort2')
            cy.wait(1100)
            cy.get('.table-body tr').first().find('td').eq(4).invoke('text').then(descModel => {
                // ASC and DESC should produce different first models
                expect(ascModel).to.not.equal(descModel)
            })

            // verify page 1
            cy.url().should('match', /page=1/)
            cy.get('button[aria-current="page"]').should('have.text', '1')
        })
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
            cy.wrap(headerRow.children().eq(8).find('button')).should('not.have.class', 'header-button')
        })
    })
})
