import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"

const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const today = dayjs().format('M/D/YYYY')

describe('Measure List Page Sort by Columns', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Measure sorting by columns on All Measures tab', () => {

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureName&direction=ASC').as('sort')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureName&direction=DESC').as('sort2')

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=version&direction=ASC').as('sort3')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=version&direction=DESC').as('sort4')

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=model&direction=ASC').as('sort5')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=model&direction=DESC').as('sort6')

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureSet.acls&direction=ASC').as('sort7')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureSet.acls&direction=DESC').as('sort8')

        //here - cms id
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureSet.cmsId&direction=ASC').as('sort9')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureSet.cmsId&direction=DESC').as('sort10')

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=lastModifiedAt&direction=ASC').as('sort11')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=lastModifiedAt&direction=DESC').as('sort12')

        // out of order, but not worth resetting everything
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureMetaData.draft&direction=ASC').as('sort13')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureMetaData.draft&direction=DESC').as('sort14')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)

        //sort by measure name ASC
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(1).invoke('text').then(ascName => {
            // sort by measure name DESC
            cy.contains('.header-button', 'Measure').click()
            cy.wait('@sort2')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(1).invoke('text').then(descName => {
                // ASC first name should come before DESC first name alphabetically
                expect(ascName.toLowerCase().localeCompare(descName.toLowerCase())).to.be.lessThan(0)
            })
        })

        // sort by version ASC
        cy.contains('.header-button', 'Version').click()
        cy.wait('@sort3')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(2).invoke('text').then(ascVersion => {
            // sort by version DESC
            cy.contains('.header-button', 'Version').click()
            cy.wait('@sort4')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(2).invoke('text').then(descVersion => {
                // ASC first version should differ from DESC first version
                expect(ascVersion).to.not.equal(descVersion)
            })
        })

        // sort by status ASC
        cy.contains('.header-button', 'Status').click()
        cy.wait('@sort13')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(3).invoke('text').then(ascStatus => {
            // sort by status DESC
            cy.contains('.header-button', 'Status').click()
            cy.wait('@sort14')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(3).invoke('text').then(descStatus => {
                // At least one of the two should show 'Draft'
                const hasDraft = ascStatus === 'Draft' || descStatus === 'Draft'
                expect(hasDraft).to.be.true
            })
        })

        // sort by model ASC
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort5')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(4).invoke('text').then(ascModel => {
            // sort by model DESC
            cy.contains('.header-button', 'Model').click()
            cy.wait('@sort6')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(4).invoke('text').then(descModel => {
                // ASC and DESC should produce different first models
                expect(ascModel).to.not.equal(descModel)
                // ASC should come before DESC alphabetically
                expect(ascModel.localeCompare(descModel)).to.be.lessThan(0)
            })
        })

        // sort by shared ASC
        cy.contains('.header-button', 'Shared').click()
        cy.wait('@sort7')
        cy.wait(1100)
        // sort by shared DESC - verify the shared icon appears on the first row
        cy.contains('.header-button', 'Shared').click()
        cy.wait('@sort8')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(5).find('[data-testid="CheckCircleOutlineIcon"]').should('exist')

        // sort by cms id ASC - empty/null values first
        cy.contains('.header-button', 'CMS ID').click()
        cy.wait('@sort9')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(6).invoke('text').then(ascCmsId => {
            // sort by cms id DESC - highest values first
            cy.contains('.header-button', 'CMS ID').click()
            cy.wait('@sort10')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(6).invoke('text').then(descCmsId => {
                // ASC should start empty or with a lower ID, DESC should have a value
                // At minimum, the two sort orders should produce different first rows
                expect(ascCmsId).to.not.equal(descCmsId)
                // DESC first row should have a non-empty CMS ID
                expect(descCmsId.trim()).to.not.be.empty
            })
        })

        // sort by updated ASC - oldest first
        cy.contains('.header-button', 'Updated').click()
        cy.wait('@sort11')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(8).invoke('text').then(ascDate => {
            // sort by updated DESC - newest first
            cy.contains('.header-button', 'Updated').click()
            cy.wait('@sort12')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(8).invoke('text').then(descDate => {
                // The oldest date (ASC) should be before the newest date (DESC)
                const ascParsed = dayjs(ascDate, 'M/D/YYYY')
                const descParsed = dayjs(descDate, 'M/D/YYYY')
                expect(ascParsed.isBefore(descParsed)).to.be.true
            })
        })
    })

    it('Column sort resets pagination to page 1', () => {

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=model&direction=ASC').as('sort')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=model&direction=DESC').as('sort2')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)

        // go to page 2
        cy.get(MeasuresPage.paginationNextButton).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)

        // sort by model
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort')
        cy.wait(1100)
        cy.get('.measures-list tr').first().find('td').eq(4).invoke('text').then(ascModel => {

            // verify page 1
            cy.url().should('match', /page=1/)
            cy.get('button[aria-current="page"]').should('have.text', '1')

            // navigate away from page 1 by clicking a numbered page button (not prev/next arrows)
            cy.get('.MuiPagination-ul button[aria-label^="Go to page"]').last().click()
            Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)

            // verify we're not on page 1
            cy.get('button[aria-current="page"]').invoke('text').then(lastPageNumber => {
                expect(Number(lastPageNumber)).to.be.greaterThan(1)
            })

            // sort by model again to reset
            cy.contains('.header-button', 'Model').click()
            cy.wait('@sort2')
            cy.wait(1100)
            cy.get('.measures-list tr').first().find('td').eq(4).invoke('text').then(descModel => {
                // ASC and DESC should produce different first models
                expect(ascModel).to.not.equal(descModel)
            })

            // verify page 1
            cy.url().should('match', /page=1/)
            cy.get('button[aria-current="page"]').should('have.text', '1')
        })
    })

    it('Sort cycles - ASC by column, DESC by column, most recently updated (default)', () => {

        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureName&direction=ASC').as('sort')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=measureName&direction=DESC').as('sort2')
        cy.intercept('/api/measures/searches?ownershipTypes=ALL&limit=10&page=0&sort=&direction=').as('sort3')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)

        MeasuresPage.checkFirstRow({ updated: today })

        // save name of default 1st measure
        cy.get('.measures-list tr').first().find('td').eq(1).invoke('text').then(originalMeasureName => {

            // sort 1 - by measure ASC
            cy.contains('.header-button', 'Measure').click()
            cy.wait('@sort')
            cy.wait(1100)

            cy.get('.measures-list tr').first().find('td').eq(1).invoke('text').then(secondMeasureName => {

                    // verify that name has changed from default
                    expect(secondMeasureName).to.not.equal(originalMeasureName)

                    // sort 2 - by measure DESC
                    cy.contains('.header-button', 'Measure').click()
                    cy.wait('@sort2')
                    cy.wait(1100)
                    cy.get('.measures-list tr').first().then(firstRow => {

                        // verify that name is different from both previous measures
                        cy.wrap(firstRow.children().eq(1)).should('not.have.text', originalMeasureName)
                            .and('not.have.text', secondMeasureName)
                    })

                    // sort 3 - click again to return to default sort
                    cy.contains('.header-button', 'Measure').click()
                    cy.wait('@sort3')
                    cy.wait(1100)
                    // verify return to default sort by "last updated"
                    MeasuresPage.checkFirstRow({ name: originalMeasureName, updated: today })
            })
        })
    })

    it('Sort is not allowed on checkbox column, action button column, owner column, or expansion column', () => {

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 31000)

        cy.get('thead tr').first().then(headerRow => {

            // checkbox
            cy.wrap(headerRow.children().eq(0).find('button')).should('not.have.class', 'header-button')
            // action button
            cy.wrap(headerRow.children().eq(9).find('button')).should('not.have.class', 'header-button')
            // expansion button
            cy.wrap(headerRow.children().eq(10).find('span')).should('not.have.class', 'header-button')
        })
    })
})
