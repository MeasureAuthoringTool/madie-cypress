import { OktaLogin } from '../../../Shared/OktaLogin'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { Utilities } from '../../../Shared/Utilities'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'

let CQLLibraryName = 'TestLibrary' + Date.now()

describe('CQL Library Validations', () => {
    let cleanupDuplicateLibrary = false

    const openCreateLibraryDialog = (): void => {
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible').and('be.enabled').click()
        cy.get(CQLLibraryPage.cqlLibraryModalField).should('be.visible')
    }

    const selectUSQCModel = (): void => {
        CQLLibraryPage.selectCQLLibraryModel(SupportedModels.USQC)
    }

    const enterLibraryDescription = (): void => {
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible').type('Some random data')
    }

    const selectPublisher = (): void => {
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible').type('SemanticBits{downArrow}{enter}')
    }

    const searchForAndEditLibrary = (libraryName: string): void => {
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryFromCurrentListWithExpectedAction('Edit')
    }

    beforeEach('Login', () => {
        OktaLogin.SessionLogin()
    })

    afterEach('Clean up duplicate library', () => {
        if (cleanupDuplicateLibrary) {
            Utilities.deleteLibrary()
            cleanupDuplicateLibrary = false
        }
    })

    it('CQL Library header (breadcrumbs, name, version/draft, model, last update)', () => {
        const dayjs = require('dayjs')
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let newCQLLibraryName = CQLLibraryName + randValue
        let lastUpdated = dayjs().format('M/D/YYYY')
        openCreateLibraryDialog()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).focused().type(newCQLLibraryName)
        selectUSQCModel()
        enterLibraryDescription()
        selectPublisher()
        Utilities.waitForElementEnabled(CQLLibraryPage.saveCQLLibraryBtn, 60000)

        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        searchForAndEditLibrary(newCQLLibraryName)

        //validate header
        cy.get(CQLLibraryPage.headerDetails).should('exist')
        cy.get(CQLLibraryPage.headerDetails).should('be.visible')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Libraries/Details')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', newCQLLibraryName)
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Version 0.0.000')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'Draft')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', 'US Quality Core v0.5.0')
        cy.get(CQLLibraryPage.headerDetails).should('include.text', lastUpdated)
    })

    it('CQL Library cancel / discard changes button', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        openCreateLibraryDialog()
        //Enter a name for the new CQL Library
        cy.get(CQLLibraryPage.newCQLLibName).click()
        cy.get(CQLLibraryPage.newCQLLibName).type(CQLLibraryName + randValue)
        selectUSQCModel()
        enterLibraryDescription()
        selectPublisher()

        //save the new CQL Library
        CQLLibraryPage.clickCreateLibraryButton()
        searchForAndEditLibrary(CQLLibraryName + randValue)
        //change up the value of the CQL Library name
        cy.get(CQLLibraryPage.currentCQLLibName)
            .click()
            .type(CQLLibraryName + randValue + 'Updated')
        //verify the existence, accessibility, the text and the functionality of the Discard button
        cy.get(CQLLibraryPage.discardChanges).should('exist')
        cy.get(CQLLibraryPage.discardChanges).should('be.visible')
        cy.get(CQLLibraryPage.discardChanges).should('be.enabled')
        cy.get(CQLLibraryPage.discardChanges).should('contain.text', 'Discard Changes')
        cy.get(CQLLibraryPage.discardChanges).click()

        cy.get(Utilities.dirtCheckModal).should('be.visible')
    })

    it('CQL Library Name Validations', () => {
        const duplicateLibraryName = `DuplicateUSQCLibrary${Date.now()}`
        CQLLibraryPage.createLibraryAPI(duplicateLibraryName, SupportedModels.USQC)
        cy.then(() => {
            cleanupDuplicateLibrary = true
        })
        openCreateLibraryDialog()

        //Verify error message when the CQL Library Name field is empty
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).click()
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should('contain.text', 'Library name is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has special characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type('Test_@Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should(
            'contain.text',
            'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters'
        )
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name does not start with an Upper Case letter
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('testMeasure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should(
            'contain.text',
            'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.'
        )
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has spaces
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('Test   Measure')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should(
            'contain.text',
            'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.'
        )
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has numbers
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type('35657')
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should(
            'contain.text',
            'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.'
        )
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message when the CQL Library Name has more than 255 characters
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox)
            .clear()
            .type(
                'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw'
            )
        cy.get(CQLLibraryPage.cqlLibraryNameInvalidError).should(
            'contain.text',
            'Library name cannot be more than 64 characters.'
        )
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')

        //Verify error message for duplicate CQL Library Name
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type(duplicateLibraryName)
        selectUSQCModel()
        enterLibraryDescription()
        selectPublisher()

        cy.intercept('POST', '/api/cql-libraries').as('duplicateLibrary')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).click()
        cy.wait('@duplicateLibrary').its('response.statusCode').should('eq', 400)
        cy.get(CQLLibraryPage.duplicateCQLLibraryNameError).should(
            'contain.text',
            'Library name must be unique. cqlLibraryName : Library name must be unique.'
        )
    })

    it('CQL Library Model Validations', () => {
        //Verify error message for empty CQL Library Model
        openCreateLibraryDialog()

        cy.get(CQLLibraryPage.newCQLLibName).should('exist')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.visible')
        cy.get(CQLLibraryPage.newCQLLibName).should('be.enabled')
        cy.get(CQLLibraryPage.newCQLLibName).type(CQLLibraryName)

        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).click()
        cy.get('body').type('{esc}')
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibraryModelErrorMsg).should('contain.text', 'A CQL library model is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('CQL Library Description Validations', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let LibraryName = CQLLibraryName + randValue

        openCreateLibraryDialog()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        selectUSQCModel()

        //move to and then away from the description detail field
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).click()
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('contain.text', 'Description is required.')
        cy.get(CQLLibraryPage.cqlLibDescHelperText).should('have.color', '#AE1C1C')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('CQL Library Publisher Validations', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let LibraryName = CQLLibraryName + randValue

        openCreateLibraryDialog()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        selectUSQCModel()
        enterLibraryDescription()

        //move to and then away from the publisher field
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).dblclick()
        cy.get(CQLLibraryPage.cqlLibraryDesc).click()
        cy.get(CQLLibraryPage.cqlLibPubHelperText).should('contain.text', 'Publisher is required.')
        cy.get(CQLLibraryPage.saveCQLLibraryBtn).should('be.disabled')
    })

    it('Create new CQL Library Creation with CQL', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        let LibraryName = CQLLibraryName + randValue

        openCreateLibraryDialog()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(LibraryName)
        selectUSQCModel()
        enterLibraryDescription()
        selectPublisher()

        CQLLibraryPage.clickCreateLibraryButton()

        searchForAndEditLibrary(LibraryName)
        Utilities.typeFileContents('cypress/fixtures/USQCTestLibrary.txt', CQLLibraryPage.cqlLibraryEditorTextBox)

        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        searchForAndEditLibrary(LibraryName)

        cy.get(CQLLibraryPage.currentCQLLibName).should('contain.value', LibraryName)

        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).should('contain.text', "using USQualityCore version '0.5.0'")
    })
})
