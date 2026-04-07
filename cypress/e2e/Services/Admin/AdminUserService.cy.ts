import { OktaLogin } from '../../../Shared/OktaLogin'

describe('Refresh user data from HARP', () => {

    it('Initiates a user refresh' , () => {

        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {

            cy.request({
                url: '/api/admin/users/refresh',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'PUT'
            }).then((response) => {
                expect(response.status).to.eql(202) // accepted for async processing
                expect(response.body).to.eql('User refresh job accepted')
            })
        })
    })

    it('Initiates a refresh for a single user', () => {

        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {

            cy.request({
                url: '/api/admin/users/refresh',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'PUT',
                body: ['madietestuser1']
            }).then((response) => {
                expect(response.status).to.eql(202) // accepted for async processing
                expect(response.body).to.eql('User refresh job accepted')
            })
        })
    })

    it('Rejects a standard user when attempted', () => {

        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {

            cy.request({
                failOnStatusCode: false,
                url: '/api/admin/users/refresh',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'PUT'
            }).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql('User does not have the required role to access this resource')
            })
        })

    })
})

describe('Last login report for user activity', () => {

    it('Returns the last login data for all users', () => {

        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {

            cy.request({
                url: '/api/admin/users/last-login',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'GET'
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.have.length.above(200) // arbitrary choice, represents all users
            })
        })
    })

    it('Rejects a standard user when attempted', () => {

        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {

            cy.request({
                failOnStatusCode: false,
                url: '/api/admin/users/last-login',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'GET'
            }).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql('User does not have the required role to access this resource')
            })
        })
    })
})

