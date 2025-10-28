import { OktaLogin } from "../../../Shared/OktaLogin"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { Header } from "../../../Shared/Header"
import { Utilities } from "../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'TestEditMeasure' + Date.now()
let CqlLibraryName = 'TestEditLibrary' + Date.now()
let updatedMeasureName = 'UpdatedTestEditMeasure' + Date.now()
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

describe('Edit Measure', () => {

    beforeEach('Create Measure and Login', () => {

        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false, currentUser, currentAltUser)

        //Create Measure with out Steward and Developer
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CqlLibraryName,
                    "model": 'QI-Core v4.1.1',
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": 'eCQMTitle',
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
            })
        })
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Edit Measure Name and verify the measure name is updated on Measures page', () => {

        //Edit Measure Name
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.measureNameTextBox).clear()
        cy.get(EditMeasurePage.measureNameTextBox).type(updatedMeasureName)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')

        //Add Measure Steward
        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).contains('Steward & Developers').click()

        //select a value for Steward
        //Utilities.dropdownSelect(EditMeasurePage.measureStewardDrpDwn, 'Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should remain disabled because a value has not been placed in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type("ACO Health Solutions")
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get('.content').click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should become available, now, because a value is, now, in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')

        //save Steward & Developers
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({ force: true })

        //validate success message
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('include.text', 'Steward and Developers Information Saved Successfully')

        //Navigate back to Measures page and verify if the Measure Name is updated
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.validateMeasureName(updatedMeasureName)

    })

    it('Measure tabs correctly show focus', () => {

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.measureDetailsTab).should('have.class', 'Mui-selected').and('have.class', 'active')

        cy.get(EditMeasurePage.testCasesTab).should('not.have.class', 'Mui-selected').and('not.have.class', 'active')
    
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(EditMeasurePage.measureGroupsTab).should('have.class', 'Mui-selected').and('have.class', 'active')

        cy.get(EditMeasurePage.measureDetailsTab).should('not.have.class', 'Mui-selected').and('not.have.class', 'active')

    })
})