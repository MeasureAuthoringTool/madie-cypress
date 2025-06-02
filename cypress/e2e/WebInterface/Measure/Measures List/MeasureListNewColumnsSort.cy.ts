import { OktaLogin } from "../../../../Shared/OktaLogin"
import { SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities";
const dayjs = require('dayjs')
const today = dayjs().format('M/D/YYYY')

describe('Measure List Page Sort by Columns', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Measure sorting by columns on All Measures tab', () => {

        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=ASC').as('sort')
        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=DESC').as('sort2')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)

        //sort by measure
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({name: '2025Anticoagulation Therapy for Atrial Fibrillation/Flutter CMS71'})
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({name: 'tillertest'})

        // sort by version
        cy.contains('.header-button', 'Version').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({version: '0.0.000'})
        cy.contains('.header-button', 'Version').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({version: '15.1.000'})

        // sort by status
        cy.contains('.header-button', 'Status').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({status: ''})
        cy.contains('.header-button', 'Status').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({status: 'Draft'})

        // sort by model
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({model: SupportedModels.QDM })
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({model: SupportedModels.qiCore6 })

        // sort by shared
        cy.contains('.header-button', 'Shared').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({shared: false})
        cy.contains('.header-button', 'Shared').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({shared: true})

        // sort by cms id empty
        cy.contains('.header-button', 'CMS ID').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({cmsId:''})
        cy.contains('.header-button', 'CMS ID').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({cmsId:'1321'})

        // sort by updated
        cy.contains('.header-button', 'Updated').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({updated: '11/16/2022'})
        cy.contains('.header-button', 'Updated').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({updated: today})
    })

    it('Column sort resets pagination to page 1', () => {

        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=ASC').as('sort')
        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=DESC').as('sort2')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 23500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 23500)

         // go to page 2
         cy.get(MeasuresPage.paginationNextButton).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 23500)

        // sort by model
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort')
        MeasuresPage.checkFirstRow({model: SupportedModels.QDM })

        // verify page 1
        cy.url().should('match', /page=1/)
        cy.get('button[aria-current="page"]').should('have.text', '1')

        // go to page 6
        cy.get('.MuiPagination-ul').children().eq(5).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)

        // verify page 6
        cy.url().should('match', /page=6/)
        cy.get('button[aria-current="page"]').should('have.text', '6')

        // sort by model again to reset
        cy.contains('.header-button', 'Model').click()
        cy.wait('@sort2')
        MeasuresPage.checkFirstRow({model: SupportedModels.qiCore6 })

        // verify page 1
        cy.url().should('match', /page=1/)
        cy.get('button[aria-current="page"]').should('have.text', '1')
    })

    it('Sort cycles - ASC by column, DESC by column, most recently updated (default)', () => {

        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=ASC').as('sort')
        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=*&direction=DESC').as('sort2')
        cy.intercept('/api/measures?currentUser=false&limit=10&page=0&sort=&direction=').as('sort3')

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)

        let originalMeasureName = ''
        let secondMeasureName = ''
        let secondDate = ''

        MeasuresPage.checkFirstRow({updated: today})
        cy.get('.measures-list tr').first().then(firstRow => {

            // save name of default 1st measure
            originalMeasureName = cy.wrap(firstRow.children().eq(1)).text().toString()
        })

        // sort 1 - by measure
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort')
        cy.get('.measures-list tr').first().then(firstRow => {
            // save name & date of this measure
            secondMeasureName = cy.wrap(firstRow.children().eq(1)).text().toString()
            secondDate = cy.wrap(firstRow.children().eq(7)).text().toString()

            // verify that name & date have changed from default
            cy.wrap(firstRow.children().eq(1)).should('not.have.text', originalMeasureName)
            cy.wrap(firstRow.children().eq(7)).should('not.have.text', today)
        })

        // sort 2
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort2')
        cy.get('.measures-list tr').first().then(firstRow => {

            // verify that name & date are different from both previous measures
            cy.wrap(firstRow.children().eq(1)).should('not.have.text', originalMeasureName)
                .and('not.have.text', secondMeasureName)
            cy.wrap(firstRow.children().eq(7)).should('not.have.text', today)
                .and('not.have.text', secondDate)
        })

        // sort 3 by measure
        cy.contains('.header-button', 'Measure').click()
        cy.wait('@sort3')
        // verify return to default sort by "last updated", i.e. measure showing is same as when test started
        MeasuresPage.checkFirstRow({name: originalMeasureName, updated: today})
    })

    it('Sort is not allowed on checkbox column, action button column, or expansion column', () => {

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 19500)

        cy.get('thead tr').first().then(headerRow => {

            // checkbox
            cy.wrap(headerRow.children().eq(0).find('button')).should('be.disabled')
            // action button
            cy.wrap(headerRow.children().eq(8).find('button')).should('be.disabled')
            // expansion button
            cy.wrap(headerRow.children().eq(9).find('button')).should('be.disabled')
        })
    })
})
