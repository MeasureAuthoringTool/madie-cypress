import { QiCore4Cql } from "../../../Shared/FHIRMeasuresCQL"

const cql = QiCore4Cql.EpisodeWithStrat

describe('CQL Builder Lookups: QI Core', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Verify QI Core CQL is parsed correctly', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.log(accessToken.value)
            cy.request({
                failOnStatusCode: false,
                url: '/api/fhir/cql-builder-lookups',
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value,
                    'Content-Type': 'text/plain'
                },
                body: cql
            }).then((response) => {

                expect(response.status).to.eql(200)
                expect(response.body.parameters).to.have.lengthOf(1)
                expect(response.body.definitions).to.have.lengthOf(3)
                expect(response.body.functions).to.have.lengthOf(33)
                expect(response.body.fluentFunctions).to.have.lengthOf(1)

            })

        })

    })
})
