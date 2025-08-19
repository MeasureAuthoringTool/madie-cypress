import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../Shared/Utilities"

var CQLLibraryName = ""
let CQLLibraryPublisher = 'ICFer'
var CQLLibraryNameAlt = ""
let CQLLibraryPublisherAlt = 'ICFerALTUser'

//skipping until LibrarySearch feature flag is turned on
describe.skip('CQL Library Search Validations', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        CQLLibraryName = 'TestLibrary' + Date.now() + randValue
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteLibrary(CQLLibraryName)
    })

    it('Filter text box and button appears on each tab ("My Libraries" and "All Libraries"), on the Libraries page', () => {
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.intercept('GET', '/api/cql-libraries?currentUser=true').as('libraries')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        //ensure we are on the Owned Libraries tab
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()

        //confirm that the filter by options and search input box appear on all 3 tabs
        // owned
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.filterByDropdown).should('exist')
        cy.get(CQLLibraryPage.filterByDropdown).should('be.visible')

        //shared 
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.filterByDropdown).should('exist')
        cy.get(CQLLibraryPage.filterByDropdown).should('be.visible')

        // all
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.filterByDropdown).should('exist')
        cy.get(CQLLibraryPage.filterByDropdown).should('be.visible')

    })

    it('Perform a search based on the Libraries name', () => {

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.dropdownSelect(CQLLibraryPage.filterByDropdown, 'Library')

        // do a search based on the CQL Library name on "All Libraries" tab
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type(CQLLibraryName + '{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
    })

    it('Perform a search based on the Libraries version', () => {

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.dropdownSelect(CQLLibraryPage.filterByDropdown, 'Version')

        // do a search based on the CQL Library name on "All Libraries" tab
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type('0.0.0{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
    })

    it('Perform a search based on the Libraries model', () => {
        
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //ensure we are on the My Libraries tab
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.dropdownSelect(CQLLibraryPage.filterByDropdown, 'Model')

        // do a search based on the CQL Library name on "All Libraries" tab
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type('QI-Core{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
    })
})

//skipping until LibrarySearch feature flag is turned on
describe.skip('CQL Library Search Validations -- User ownership', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        CQLLibraryNameAlt = 'TestLibrary' + Date.now() + randValue
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryNameAlt, CQLLibraryPublisherAlt, false, true)
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteLibrary(CQLLibraryName)
    })

    it('Owner is different than current user, library will only appear in "All Libraries" searched list', () => {
        //log in as user that does not own the Library
        OktaLogin.Login()

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //ensure we are on the Owned Libraries tab
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()

        // do a search based on the CQL Library name on "All Libraries" tab
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        cy.get(CQLLibraryPage.cqlLibSearchResultsTable).should('contain.text', 'No results were found')

        // do a search based on the CQL Library name on "Shared Libraries" tab
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        cy.get(CQLLibraryPage.cqlLibSearchResultsTable).should('contain.text', 'No results were found')

        // do a search based on the CQL Library name on "all Libraries" tab
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)
    })

    it('Owner is the same as the current user, library will appear in, both, "All Libraries" and "My Libraries" searched lists', () => {
        //log in as user that does not own the Library
        OktaLogin.AltLogin()

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)

        //ensure we are on the Owned Libraries tab
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()

        // do a search based on the CQL Library name on "All Libraries" tab
        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

        // do a search based on the CQL Library name on "Shared Libraries" tab
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.sharedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        cy.get(CQLLibraryPage.cqlLibSearchResultsTable).should('contain.text', 'No results were found')

        // do a search based on the CQL Library name on "all Libraries" tab
        cy.get(CQLLibraryPage.allLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        cy.get(CQLLibraryPage.LibFilterTextField).should('exist')
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type( CQLLibraryNameAlt + '{enter}')

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)
    })
})
