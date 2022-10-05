import {OktaLogin} from "../../../Shared/OktaLogin"
import {Header} from "../../../Shared/Header"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"
import {CQLLibrariesPage} from "../../../Shared/CQLLibrariesPage"
import {Utilities} from "../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()

describe('CQL Library Validations', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()

    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

    })
    it('CQL Library header (breadcrumbs, name, version/draft, model)', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCQLLibraryName = CQLLibraryName+randValue

        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        //click button to create a new CQL Library
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focus().type(newCQLLibraryName)
        //select a model value
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()
        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        //navigate to CQL Library list page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //validate header
        cy.get(CQLLibraryPage.headerDetails).should('exist')
        cy.get(CQLLibraryPage.headerDetails).should('be.visible')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Libraries/Details')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', newCQLLibraryName)
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'v0.0.000')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Draft')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'QI-Core v4.1.1')

    })
    it('CQL Library cancel / discard changes button', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        //click button to create a new CQL Library
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focus().type(CQLLibraryName+randValue)
        //select a model value
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()
        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        //navigate to CQL Library list page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //change up the value of the CQL Library name
        cy.get(CQLLibraryPage.currentCQLLibName).focus().type(CQLLibraryName+randValue + 'Updated')
        //verify the existence, accessibility, the text and the functionality of the Discard button
        cy.get(CQLLibraryPage.discardChanges).should('exist')
        cy.get(CQLLibraryPage.discardChanges).should('be.visible')
        cy.get(CQLLibraryPage.discardChanges).should('be.enabled')
        cy.get(CQLLibraryPage.discardChanges).should('contain.text', 'Discard Changes')
        cy.intercept('GET', '/api/cql-libraries?currentUser=true').as('alias')
        cy.get(CQLLibraryPage.discardChanges).click()
        //discarding the changes moves the user successfully back to the main CQL Library list page
        cy.wait('@alias').then(({response}) => {
            expect(response.statusCode).to.eq(200)
        })
    })
    it('CQL Library edit page level validations on the CQL Library name, error messaging and accessibilty of the save button', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        //click button to create a new CQL Library
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focus().type(CQLLibraryName+randValue)
        //select a model value
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()
        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        //navigate to CQL Library list page
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Verify error message when the CQL Library Name field is empty
        cy.get(CQLLibraryPage.currentCQLLibName).clear()
        cy.get(CQLLibraryPage.currentCQLLibName).focus().blur()
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name is required.')
        //cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')

        //Verify error message when the CQL Library Name has special characters
        cy.get(CQLLibraryPage.currentCQLLibName).type('Test_@Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')

        //Verify error message when the CQL Library Name does not start with an Upper Case letter
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('testMeasure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')

        //Verify error message when the CQL Library Name has spaces
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('Test   Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')

        //Verify error message when the CQL Library Name has only numbers
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('35657')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')

        //Verify error message when the CQL Library Name has more than 255 characters
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type('Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name cannot be more than 255 characters.')
        cy.get(CQLLibraryPage.currentCQLLibSavebtn).should('have.attr', 'disabled', 'disabled')
    })

    it('CQL Library Name Validations', () => {
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()

        //Verify error message when the CQL Library Name field is empty
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).focus().blur()
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has special characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type('Test_@Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name does not start with an Upper Case letter
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('testMeasure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has spaces
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('Test   Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has only numbers
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('35657')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has more than 255 characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name cannot be more than 255 characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message for duplicate CQL Library Name
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('TestLibrary')
        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQICore)
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.duplicateCQLLibraryNameError).should('contain.text', 'Library name must be unique. cqlLibraryName : Library name must be unique.')

    })

    it('CQL Library Model Validations', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //Verify error message for empty CQL Library Model
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.newCQLLibName).should('exist')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.visible')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.enabled')
        cy.get(CQLLibraryPage.newCQLLibName).type(CQLLibraryName+randValue)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().blur()
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click({force:true})
        cy.get(CQLLibraryPage.cqlLibraryModelErrorMsg).should('contain.text', 'A CQL library model is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('Create new CQL Library Creation with CQL', () =>{
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName+randValue

        //navigate to the CQL Libaray page and create new CQL Library
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('exist')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()

        CQLLibraryPage.clickCreateLibraryButton()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/AdultOutpatientEncountersQICore4Entry.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.currentCQLLibName).should('contain.value', LibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).invoke('text').then((text) => {
            expect(text.length).greaterThan(1750)
        })

    })

    it('Update new CQL Library Creation with CQL', () =>{

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let UpdatedCQLLibraryName = CQLLibraryName +randValue+ "updated"
        CQLLibraryPage.createCQLLibrary(UpdatedCQLLibraryName)
        //navigate to the CQL Libaray page
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.currentCQLLibName).clear().type(UpdatedCQLLibraryName)
        Utilities.typeFileContents('cypress/fixtures/AdultOutpatientEncountersQICore4Entry.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.')

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.currentCQLLibName).should('contain.value', UpdatedCQLLibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).invoke('text').then((text) => {
            expect(text.length).greaterThan(1760)
        })

    })
})
