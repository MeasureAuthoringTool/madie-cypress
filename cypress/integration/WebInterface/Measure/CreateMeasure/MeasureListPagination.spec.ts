import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"

let measureName  = []
let CqlLibraryName  = []
let measureIds = []
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let versionIdPath = 'cypress/fixtures/versionId'

describe('Measure List Pagination', () => {

    before('Create Measures and Login', () => {

        cy.setAccessTokenCookie()

        let fileContents = ''

        for (let i = 0; i <= 15; i++) {

            measureName [i] = 'TestMeasure' + i + Date.now()
            CqlLibraryName [i] = 'TestLibrary' + i + Date.now()

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {

                    cy.request({
                        url: '/api/measure',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            'measureName': measureName[i],
                            'cqlLibraryName': CqlLibraryName[i],
                            'model': 'QI-Core v4.1.1',
                            "ecqmTitle": "eCQMTitle",
                            "versionId": vId,
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        measureIds [i] = response.body.id
                        fileContents = fileContents + measureIds[i] + ','
                        cy.writeFile('cypress/fixtures/measureId', fileContents)

                    })
                })
            })
        }

        OktaLogin.Login()
    })

    after('Cleanup Measures and Logout', () => {

        cy.setAccessTokenCookie()

        let idsList = ''

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.readFile(versionIdPath).should('exist').then((vId) => {

                idsList = fileContents.split(',')

                for (let j = 0; j < idsList.length - 1; j++) {

                    cy.getCookie('accessToken').then((accessToken) => {

                        let id = idsList[j]

                        cy.log('ID is : ' + id)

                        cy.request({
                            url: '/api/measures/' + id,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": id,
                                "measureName": measureName[j],
                                "cqlLibraryName": CqlLibraryName[j] + 1,
                                "model": 'QI-Core v4.1.1',
                                "versionId": vId,
                                "ecqmTitle": "eCQMTitle",
                                "active": false,
                                "measurementPeriodStart": mpStartDate,
                                "measurementPeriodEnd": mpEndDate
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql("Measure updated successfully.")
                        })
                    })
                }
            })
        })

        OktaLogin.Logout()
    })

    it('Verify Pagination', () => {

        //Verify URL before clicking on Next button
        cy.url().should('not.include','page=2')
        //Click on Next Button
        cy.get(MeasuresPage.paginationNextButton).click( {force:true})
        //Verify if Next Page loaded
        cy.url().should('include','page=2')

        //Click on Previous Button
        cy.get(MeasuresPage.paginationPreviousButton).click()
        //Verify if Previous Page loaded
        cy.url().should('include','page=1')

        //Verify pagination limit before change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '10')
        cy.get(MeasuresPage.paginationLimitSelect).click()
        //Change pagination limit to 25
        cy.get(MeasuresPage.paginationLimitEquals25).click( {force:true} )
        //Verify pagination limit after change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '25')

    })
})