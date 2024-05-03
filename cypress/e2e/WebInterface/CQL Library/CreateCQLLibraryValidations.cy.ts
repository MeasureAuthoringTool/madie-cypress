import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Global } from "../../../Shared/Global"

let CQLLibraryName = 'TestLibrary' + Date.now()

describe('CQL Library Validations', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()

    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('CQL Library header (breadcrumbs, name, version/draft, model, last update)', () => {

        const dayjs = require('dayjs')
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCQLLibraryName = CQLLibraryName + randValue
        let lastUpdated = dayjs().format('M/D/YYYY')
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')

        cy.intercept('GET', '/api/cql-libraries?currentUser=true').as('libraries')
        cy.get(Header.cqlLibraryTab).click()
        cy.wait('@libraries', { timeout: 60000 })


        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focused().type(newCQLLibraryName)
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
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //validate header
        cy.get(CQLLibraryPage.headerDetails).should('exist')
        cy.get(CQLLibraryPage.headerDetails).should('be.visible')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Libraries/Details')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', newCQLLibraryName)
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Version 0.0.000')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Draft')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'QI-Core v4.1.1')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', lastUpdated)


    })

    it('CQL Library cancel / discard changes button', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //navigate to the main CQL Library list page
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focused().type(CQLLibraryName + randValue)
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
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        //change up the value of the CQL Library name
        cy.get(CQLLibraryPage.currentCQLLibName).focus().type(CQLLibraryName + randValue + 'Updated')
        //verify the existence, accessibility, the text and the functionality of the Discard button
        cy.get(CQLLibraryPage.discardChanges).should('exist')
        cy.get(CQLLibraryPage.discardChanges).should('be.visible')
        cy.get(CQLLibraryPage.discardChanges).should('be.enabled')
        cy.get(CQLLibraryPage.discardChanges).should('contain.text', 'Discard Changes')
        cy.intercept('GET', '/api/cql-libraries?currentUser=true').as('alias')
        cy.get(CQLLibraryPage.discardChanges).click()

        cy.get(Global.dirtCheckModal).should('be.visible')
    })
    // skipping until bug MAT-7174 is fixed
    it.skip('CQL Library Name Validations', () => {
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()

        //Verify error message when the CQL Library Name field is empty
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has special characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type('Test_@Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name does not start with an Upper Case letter
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('testMeasure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has spaces
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('Test   Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has numbers
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('35657')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has more than 255 characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name cannot be more than 64 characters.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message for duplicate CQL Library Name
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('TestLibrary')
        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQICore)

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('SemanticBits')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('{downArrow}').type('{enter}')

        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.duplicateCQLLibraryNameError).should('contain.text', 'Library name must be unique. cqlLibraryName : Library name must be unique.')

    })

    it('CQL Library Model Validations', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        //Verify error message for empty CQL Library Model
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.newCQLLibName).should('exist')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.visible')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.enabled')
        cy.get(CQLLibraryPage.newCQLLibName).type(CQLLibraryName + randValue)
        cy.get(CQLLibraryPage.cqlLibraryModalField).wait(2000).click()
        cy.get(CQLLibraryPage.cqlLibraryCreateForm).click()
        cy.get(CQLLibraryPage.cqlLibraryCreateFormSideClickArea).click().wait(2000).click().wait(2000).click()
        cy.get(CQLLibraryPage.cqlLibraryModelErrorMsg).should('contain.text', 'A CQL library model is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('CQL Library Description Validations', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName + randValue

        //navigate to the CQL Library page and create new CQL Library
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        cy.get(CQLLibraryPage.cqlLibraryModalField).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()

        //move to and then away from the description detail field
        cy.get(CQLLibraryPage.cqlLibraryDesc).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).click()
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('contain.text', 'Description is required.')
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('have.color', '#AE1C1C')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')


    })

    it('CQL Library Publisher Validations', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName + randValue

        //navigate to the CQL Library page and create new CQL Library
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryModelQICore).click()

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //move to and then away from the publisher field
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).dblclick()
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibPubHelperText).should('contain.text', 'Publisher is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('Create new CQL Library Creation with CQL', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let LibraryName = CQLLibraryName + randValue

        //navigate to the CQL Library page and create new CQL Library
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
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

        CQLLibraryPage.clickCreateLibraryButton()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        Utilities.typeFileContents('cypress/fixtures/AdultOutpatientEncountersQICore4Entry.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect.' +
            ' MADiE has overwritten them to ensure proper CQL.')

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.currentCQLLibName).should('contain.value', LibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).click()
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).invoke('text').then((text) => {
            expect(text.length).greaterThan(1710)
        })

    })
})
