import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Utilities } from "../../../../Shared/Utilities"

let MeasuresPageOne = ''
let updatedMeasuresPageName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let ratioMeasureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Draft and Version Validations', () => {

    beforeEach('Craete CQL Library and Login', () => {
        //Create Measure
        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Add Draft to the versioned Library', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedTestMeasures1' + Date.now()

        MeasuresPage.clickVersionForCreatedMeasure()
        cy.get(MeasuresPage.versionMeasuresRadioButton).should('exist')
        cy.get(MeasuresPage.versionMeasuresRadioButton).should('be.enabled')
        cy.get(MeasuresPage.versionMeasuresRadioButton).eq(0).click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        MeasuresPage.clickDraftforCreatedMeasure()
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('exist')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.visible')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.enabled')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)

        cy.get(MeasuresPage.createDraftContinueBtn).should('exist')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.visible')
        cy.get(MeasuresPage.createDraftContinueBtn).should('be.enabled')
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')
    })

    it('User cannot create a draft of a draft that already exists, while the version is still open', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedMeasuresPageOne' + Date.now()

        MeasuresPage.clickVersionForCreatedMeasure()

        cy.get(MeasuresPage.versionMeasuresRadioButton).eq(0).click()
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        MeasuresPage.clickDraftforCreatedMeasure()
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')

        cy.log('Draft Created Successfully')

        MeasuresPage.clickDraftforCreatedMeasure()
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(updatedMeasuresPageName + '1')
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftErrMsgs).should('contains.text', 'Can not create a draft for the measure ')
        cy.get(MeasuresPage.VersionDraftErrMsgs).should('contains.text', '. Only one draft is permitted per measure.')
    })

    it('Verify the Measure updates are restricted after Version is created', () => {

        let versionNumber = '1.0.000'
        updatedMeasuresPageName = 'UpdatedMeasuresPageOne' + Date.now()

        MeasuresPage.clickVersionForCreatedMeasure()
        cy.get(MeasuresPage.versionMeasuresRadioButton).eq(0).click()
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')

        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).should('be.disabled')
    })
})
