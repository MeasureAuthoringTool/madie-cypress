import {OktaLogin} from "../../Shared/OktaLogin"

describe('User Details with HARPID', () => {

    it('Retrieve User Details with HARPID', () => {

        let harpUser = OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/users/' + harpUser,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(String(response.body.harpId).toLowerCase()).to.equal(String(harpUser).toLowerCase())
                expect(response.body.status).to.eql('ACTIVE')
                expect(response.body.roles[0].role).to.eql('MADiE-User')
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