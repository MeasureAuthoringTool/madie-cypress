import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'

let measureName = ''
let CQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let harpUser = Environment.credentials().harpUser
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let eCQMTitle = 'eCQMTitle'
let randValue = (Math.floor((Math.random() * 1000) + 1))

describe('Measure Service: Create Measure', function () {
    beforeEach('Set Access Token', function () {
        cy.setAccessTokenCookie();
    })
    after('Clean up', function () {
        Utilities.deleteMeasure(measureName, CQLLibraryName)
    })

    it('Create New Measure, with user name typed in regular case', function () {
        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue
        //create measure
        cy.getCookie('accessToken').then(function (accessToken) {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    'measureSetId': uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
            })
        })
        //log in as same user but typed in camel case and confirm that measure can be retrieved and the created by user is the same
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieCAMELCASE()
        cy.getCookie('accessToken').then(function (accessToken) {
            cy.readFile('cypress/fixtures/measureId').should('exist').then(function (id) {
                cy.request({
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then(function (response) {
                    expect(response.status).to.eql(200);
                    expect(response.body.active).to.eql(true)
                    expect(response.body.content[0].createdBy).to.eql(harpUser)
                })
            })
        })
    })
})
