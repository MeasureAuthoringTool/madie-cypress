import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let TCName = []
let TCSeries = []
let TCTitle = []
let TCDescription = []

let measureCQL = 'library CohortEpisodeEncounter1699460161402 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '   Global."Inpatient Encounter"'

describe('Test Case List Pagination', () => {

    before('Create Measure, Test Cases and Login', () => {

        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        for (let i = 0; i <= 15; i++) {

            TCName [i] = 'TCName' + i + Date.now()
            TCSeries [i] = 'TCSeries' + i + Date.now()
            TCTitle [i] = 'TCTitle' + i + Date.now()
            TCDescription [i] = 'TCDescription' + i + Date.now()

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            'name': TCName[i],
                            'series': TCSeries[i],
                            'title': TCTitle[i],
                            'description': TCDescription[i],
                            'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                        }
                    }).then((response) => {
                        console.log(response)
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        expect(response.body.patientId).to.be.exist
                        expect(response.body.json).to.be.exist
                    })
                })
            })
        }

        OktaLogin.Login()
    })

    after('Delete Measure', () => {

        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Pagination', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify URL before clicking on Next button
        cy.url().should('not.include','page=2')
        //Click on Next Button
        cy.get(TestCasesPage.paginationNextButton).click( {force:true})
        //Verify if Next Page loaded
        cy.url().should('include','page=2')

        //Click on Previous Button
        cy.get(TestCasesPage.paginationPreviousButton).click()
        //Verify if Previous Page loaded
        cy.url().should('include','page=1')

        //Verify pagination limit before change
        cy.get(TestCasesPage.paginationLimitSelect).should('contain', '10')
        cy.get(TestCasesPage.paginationLimitSelect).click()
        //Change pagination limit to 25
        cy.get(TestCasesPage.paginationLimitEquals25).click( {force:true} )
        //Verify pagination limit after change
        cy.get(TestCasesPage.paginationLimitSelect).should('contain', '25')
    })
})