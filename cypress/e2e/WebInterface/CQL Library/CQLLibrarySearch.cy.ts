import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../Shared/Utilities"

var CQLLibraryName = ""
let CQLLibraryPublisher = 'ICFer'
var CQLLibraryNameAlt = ""
let CQLLibraryPublisherAlt = 'ICFerALTUser'
describe('CQL Library Search Validations', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        CQLLibraryName = 'TestLibrary' + Date.now() + randValue
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()

    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Filter text box and button appears on each tab ("My Libraries" and "All Libraries"), on the Libraries page', () => {
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        //confirm that the filter input box and the filter submit buttons appear on both CQL Libraries tabs ("My Libraries" and "All Libraries")
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')

    })

    it('Filter label appears on each tab (My Libraries and All Libraries), on the Libraries page', () => {

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        //confirm that the filter label appears on, both, CQL Libraries tabs ("My Libraries" and "All Libraries")
        cy.get(CQLLibraryPage.LibFilterLabel).should('exist')
        cy.get(CQLLibraryPage.LibFilterLabel).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterLabel).should('contain.text', 'Filter Libraries')

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibFilterLabel).should('exist')
        cy.get(CQLLibraryPage.LibFilterLabel).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterLabel).should('contain.text', 'Filter Libraries')

    })

    it('Filter is based on the Libraries name', () => {

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        //do a search based on the CQL Library name on, both, the "My Libraries" and the "All Libraries" tabs
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryName)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryName)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

    })

    it('Clicking on the "X" closes out the search and page is returned to state that lists all pertinent Libraries', () => {

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibTableRows).should('have.length.greaterThan', 1)

        //do a search based on the CQL Library name on, both, the "My Libraries" and the "All Libraries" tabs
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryName)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        cy.get(CQLLibraryPage.LibTableRows).should('have.length.lte', 1)

        cy.get(CQLLibraryPage.ClearSearchBox).should('exist')
        cy.get(CQLLibraryPage.ClearSearchBox).should('be.visible')
        cy.get(CQLLibraryPage.ClearSearchBox).click()

        cy.get(CQLLibraryPage.LibTableRows).should('have.length.greaterThan', 1)

    })
})
describe('CQL Library Search Validations -- User ownership', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        CQLLibraryNameAlt = 'TestLibrary' + Date.now() + randValue
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryNameAlt, CQLLibraryPublisherAlt, false, true)


    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

    })
    it('Owner is different than current user, library will only appear in "All Libraries" searched list', () => {
        //log in as user that does not own the Library
        OktaLogin.Login()

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        //do a search based on the CQL Library name on, both, the "My Libraries" and the "All Libraries" tabs
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        cy.get(CQLLibraryPage.cqlLibSearchResultsTable).should('be.empty')

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

    })
    it('Owner is the same as the current user, library will appear in, both, "All Libraries" and "My Libraries" searched lists', () => {
        //log in as user that does not own the Library
        OktaLogin.AltLogin()

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        //do a search based on the CQL Library name on, both, the "My Libraries" and the "All Libraries" tabs
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).click()
        cy.get(CQLLibraryPage.LibFilterTextField).clear()
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.focused')
        cy.get(CQLLibraryPage.LibFilterTextField).type(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('exist')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).should('be.enabled')
        cy.get(CQLLibraryPage.LibFilterSubmitBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

    })
})