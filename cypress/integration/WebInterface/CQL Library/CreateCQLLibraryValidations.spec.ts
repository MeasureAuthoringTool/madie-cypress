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

    it('CQL Library Name Validations', () => {

        cy.get(Header.cqlLibraryTab).click()
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
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(CQLLibraryName+randValue)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().blur()
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click({force:true})
        cy.get(CQLLibraryPage.cqlLibraryModelErrorMsg).should('contain.text', 'A CQL library model is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('Create new CQL Library Creation with CQL', () =>{
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName+randValue

        //navigate to the CQL Libaray page and create new CQL Library
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).focus().click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()

        CQLLibraryPage.clickCreateLibraryButton()

        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.readFile('cypress/fixtures/AdultOutpatientEncountersQICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type(fileContents)
        })

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('contain.value', LibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).invoke('text').then((text) => {
            expect(text.length).greaterThan(1760)
        })

    })

    it('Update new CQL Library Creation with CQL', () =>{

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let UpdatedCQLLibraryName = CQLLibraryName +randValue+ "updated"
        CQLLibraryPage.createCQLLibrary(UpdatedCQLLibraryName)
        //navigate to the CQL Libaray page
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type(UpdatedCQLLibraryName)
        cy.readFile('cypress/fixtures/AdultOutpatientEncountersQICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type(fileContents)
        })

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.warningAlert).should('contain.text', 'CQL updated successfully! Library Name ' +
            'and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('contain.value', UpdatedCQLLibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).invoke('text').then((text) => {
            expect(text.length).to.equal(1768)
        })

    })
})
