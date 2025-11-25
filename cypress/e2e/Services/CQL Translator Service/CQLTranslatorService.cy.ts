import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasureCQL } from "../../../Shared/MeasureCQL"

describe('CQL Translation Service', () => {

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    it('Successful 200', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/fhir/cql/translator/cql?showWarnings=false&annotations=true&locators=true&disable-list-demotion=true&' +
                    'disable-list-promotion=true&disable-method-invocation=true&validate-units=true',
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'Content-Type': 'text/plain',
                    'Accept': 'application/json, text/plain, */*'
                },
                body: MeasureCQL.SBTESTCMS347_CQL
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.json).to.exist
                expect(response.body.xml).to.exist
            })
        })
    })
})





