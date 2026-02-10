import { OktaLogin } from "../../Shared/OktaLogin"

describe('User Details with HARPID', () => {

    it('Retrieve User Details with HARPID', () => {

        let harpUser = OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/users/' + harpUser,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.harpId).to.equal(harpUser)
            })
        })
    })

    it('403 Error when invalid Harp Id is provided', () => {

        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/users/abc',
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
            }).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.error).to.eql('Forbidden')
            })
        })
    })
})