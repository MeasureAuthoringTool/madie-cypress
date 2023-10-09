import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Header } from "../../../Shared/Header"
import { Utilities } from "../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
var CQLLibraryNameAlt = ""
let CQLLibraryPublisherAlt = 'ICFerALTUser'

describe('Edit CQL Library validations', () => {

    beforeEach('Create CQL Library and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 2

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('CQL Library edit page level validations on the CQL Library name, error messaging and accessibility of the save button', () => {

        cy.get(Header.cqlLibraryTab).click()

        //Click on Edit button, Verify error message when the CQL Library Name field is empty
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.currentCQLLibName).clear()
        cy.get(CQLLibraryPage.currentCQLLibName).focus().blur()
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name is required.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has special characters
        cy.get(CQLLibraryPage.currentCQLLibName).type('UpdatedTest_@Library')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name does not start with an Upper Case letter
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('updatedTestLibrary')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has spaces
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('UpdatedTest   Library')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has only numbers
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('35657')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has more than 255 characters
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name cannot be more than 64 characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')
    })

    it('CQL Library Edit page validation on description and publisher field', () => {

        cy.get(Header.cqlLibraryTab).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Assert validation on description field
        cy.get(CQLLibraryPage.cqlLibraryDesc).clear()
        cy.get(CQLLibraryPage.cqlLibraryDesc).focus().blur()
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('contain.text', 'Description is required.')

        //Assert validation on Publisher field
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).click()
        cy.get(CQLLibraryPage.cqlLibraryEditPublisherCloseIcon).eq(0).click()
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).dblclick()
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibPubHelperText).should('contain.text', 'Publisher is required.')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.disabled')

    })

    it('CQL Library Edit page validation that the "Experimental" check box can be checked or unchecked -- not required', () => {

        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //experimental check box
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).focus().wait(1000).check()


        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('Able Health')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{downArrow}')
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).type('{enter}')

        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.enabled')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('exist')
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL Library saved successfully')

        //navigate back to the CQL Library page and navigate to the edit CQL Library page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //experimental check box make sure it is still checked
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).should('be.checked')

        //uncheck the Experimental check box
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).focus().wait(1000).uncheck()

        //make sure the save button becomes available even when the check box is not checked
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.enabled')

    })
})
describe('CQL Library Validations -- User ownership', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        CQLLibraryNameAlt = 'TestLibrary' + Date.now() + randValue
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryNameAlt, CQLLibraryPublisherAlt, false, true)


    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

    })
    it('Owner is the same as current user, library will appear in, both, "All Libraries" and "My Libraries" default / stand-alone lists', () => {
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

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryNameAlt)

    })
})
