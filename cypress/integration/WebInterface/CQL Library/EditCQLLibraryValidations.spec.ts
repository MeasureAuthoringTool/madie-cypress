import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {CQLLibrariesPage} from "../../../Shared/CQLLibrariesPage"
import {Header} from "../../../Shared/Header"

let CQLLibraryName = 'TestLibrary' + Date.now()
let CQLLibraryPublisher = 'SemanticBits'

describe('Edit Measure', () => {
    before('Create Measure', () => {

        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('CQL Library edit page level validations on the CQL Library name, error messaging and accessibilty of the save button', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //click button to create a new CQL Library
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focused().type(CQLLibraryName+randValue)
        //select a model value
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('SemanticBits')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('{downArrow}').type('{enter}')

        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        //navigate to CQL Library list page
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
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name cannot be more than 255 characters.')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')
    })
    it('CQL Edit page validation on description field', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName+randValue

        CQLLibraryPage.createCQLLibraryAPI(LibraryName, 'Able Health')
        OktaLogin.Login()

        //navigate to the CQL Libaray page and navigate to the edit CQL Library page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()


        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName + 'updated')

        //move to and then away from the description detail field
        cy.get(CQLLibraryPage.cqlLibraryDesc).clear()
        cy.get(CQLLibraryPage.cqlLibraryDesc).focus().blur()
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('contain.text', 'Description is required.')
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('have.color', '#FF342D')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.disabled')

    })

    it('CQL Edit page validation that the "Experimental" check box can be checked or unchecked -- not required', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName+randValue

        //create CQL Library via API
        CQLLibraryPage.createCQLLibraryAPI(LibraryName, 'Able Health')

        OktaLogin.Login()

        //navigate to the CQL Libaray page and navigate to the edit CQL Library page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName + 'updated')


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

        //navigate back to the CQL Libaray page and navigate to the edit CQL Library page
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

    it('CQL Edit page validation on Publisher field', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName+randValue

        //create CQL Library via API
        CQLLibraryPage.createCQLLibraryAPI(LibraryName, 'Able Health')

        OktaLogin.Login()

        //navigate to the CQL Libaray page and navigate to the edit CQL Library page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName + 'updated')


        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //experimental check box
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryExperimentalChkBox).focus().wait(1000).check()


        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //move to and, then, away from the Publisher field
        cy.get(CQLLibraryPage.cqlLibraryEditPublisher).click()
        cy.get(CQLLibraryPage.cqlLibraryEditPublisherCloseIcon).click()
        cy.get(CQLLibraryPage.cqlLibPubHelperText).should('contain.text', 'Publisher is required.')
        cy.get(CQLLibraryPage.cqlLibPubHelperText).should('have.color', '#FF342D')
        cy.get(CQLLibraryPage.cqlLibraryStickySave).should('be.disabled')

    })

})