// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import {Environment} from "../Shared/Environment"

export { } // this file needs to be a module

declare global {
    namespace Cypress {
        interface Chainable {
            setAccessTokenCookie()
            setAccessTokenCookieALT()
        }
    }
}


const authnUrl = Environment.authentication().authnUrl
const authUri = Environment.authentication().authUri
const redirectUri = Environment.authentication().redirectUri
const clientId = Environment.authentication().clientId
const authCodeUrl = authUri + '/v1/authorize'
const tokenUrl = authUri + '/v1/token'
const codeVerifier = Cypress.env('MADIE_CODEVERIFIER')


export function setAccessTokenCookie() {

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.request({
        url: authnUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'application/json'
        },

        body: { username: Environment.credentials().harpUser,
            password: Environment.credentials().password,

            options: {
                multiOptionalFactorEnroll: false,
                warnBeforePasswordExpired: true
            }
        },
        failOnStatusCode: false
    }).then((response) => {

        expect(response.status).to.eql(200)
        const sessionToken = response.body.sessionToken

        cy.log(sessionToken)
        cy.log(Environment.credentials().harpUser)

        let url = authCodeUrl + '?client_id=' + clientId +
            '&code_challenge=' + 'LBY2kyC5ZfYC9RaG9HOgRjf9i7U-zgmwHLC280r4UfA' +
            '&code_challenge_method=S256' +
            '&response_type=code' +
            '&response_mode=okta_post_message' +
            '&display=page' +
            '&nonce=uxiJab6ycJdNkEZkwbtqnSC1MRuIFCXQATQZSWiBjWdSuuBdbIDCN9EafOYiPaHs' + sessionToken +
            '&redirect_uri=' + redirectUri +
            '&sessionToken=' + sessionToken +
            '&state=iTIppKJsrKTXektB6F1h1dRsQEaDCjlTD3xtjDbYKZ1FlPFKVcq1u7FRuPgPMqxZ' +
            '&scope=openid%20email%20profile'

        console.log(url)

        //test state = iTIppKJsrKTXektB6F1h1dRsQEaDCjlTD3xtjDbYKZ1FlPFKVcq1u7FRuPgPMqxZ
        //dev state = uQJCnnawAWj9QyaHkVMesAaVXEkWcZMpVfDrQJqdUUPLnuIUprrlN5kRicCI4gaR


        //uxiJab6ycJdNkEZkwbtqnSC1MRuIFCXQATQZSWiBjWdSuuBdbIDCN9EafOYiPaHs
        // yyXuZpOgUEfJrAF9FewMZG2FQHvfzZ0URtM2d883niqVqMZi460Vx8IFNlIN7iwX

        cy.request({
            url: url,
            method: 'GET',
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': '*/*'
            }
        }).then((response) => {
            expect(response.status).to.eql(200)

            const resp = response.body
            console.log(response.body)
            const codeIdx = resp.indexOf("data.code")
            const codeEndIdx = resp.indexOf(";", codeIdx)
            const codeLine = resp.substring(codeIdx, codeEndIdx)
            const [v, c] = codeLine.split("=")
            const escapedCode = c.trim().replace(/'/g, '')
            const authCode = escapedCode.replace(/\\x([0-9A-Fa-f]{2})/g, function () {
                return String.fromCharCode(parseInt(arguments[1], 16))
            })
            cy.log(authCode)

            cy.request({
                url: tokenUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept': '*/*'
                },
                body: {
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    code: authCode,
                    code_verifier: codeVerifier
                }
            }).then((response) => {

                expect(response.status).to.eql(200)
                const access_token = response.body.access_token
                //setting the cookie value to be grabbed for api authentication
                cy.setCookie('accessToken', access_token)

            })
        })
    })
}
export function setAccessTokenCookieALT() {

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.request({
        url: authnUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'application/json'
        },

        body: { username: Environment.credentials().harpUserALT,
            password: Environment.credentials().passwordALT,

            options: {
                multiOptionalFactorEnroll: false,
                warnBeforePasswordExpired: true
            }
        },
        failOnStatusCode: false
    }).then((response) => {

        expect(response.status).to.eql(200)
        const sessionToken = response.body.sessionToken

        cy.log(sessionToken)
        cy.log(Environment.credentials().harpUserALT)

        let url = authCodeUrl + '?client_id=' + clientId +
            '&code_challenge=' + 'LBY2kyC5ZfYC9RaG9HOgRjf9i7U-zgmwHLC280r4UfA' +
            '&code_challenge_method=S256' +
            '&response_type=code' +
            '&response_mode=okta_post_message' +
            '&display=page' +
            '&nonce=uxiJab6ycJdNkEZkwbtqnSC1MRuIFCXQATQZSWiBjWdSuuBdbIDCN9EafOYiPaHs' + sessionToken +
            '&redirect_uri=' + redirectUri +
            '&sessionToken=' + sessionToken +
            '&state=iTIppKJsrKTXektB6F1h1dRsQEaDCjlTD3xtjDbYKZ1FlPFKVcq1u7FRuPgPMqxZ' +
            '&scope=openid%20email%20profile'

        console.log(url)

        //test state = iTIppKJsrKTXektB6F1h1dRsQEaDCjlTD3xtjDbYKZ1FlPFKVcq1u7FRuPgPMqxZ
        //dev state = uQJCnnawAWj9QyaHkVMesAaVXEkWcZMpVfDrQJqdUUPLnuIUprrlN5kRicCI4gaR


        //uxiJab6ycJdNkEZkwbtqnSC1MRuIFCXQATQZSWiBjWdSuuBdbIDCN9EafOYiPaHs
        // yyXuZpOgUEfJrAF9FewMZG2FQHvfzZ0URtM2d883niqVqMZi460Vx8IFNlIN7iwX

        cy.request({
            url: url,
            method: 'GET',
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': '*/*'
            }
        }).then((response) => {
            expect(response.status).to.eql(200)

            const resp = response.body
            console.log(response.body)
            const codeIdx = resp.indexOf("data.code")
            const codeEndIdx = resp.indexOf(";", codeIdx)
            const codeLine = resp.substring(codeIdx, codeEndIdx)
            const [v, c] = codeLine.split("=")
            const escapedCode = c.trim().replace(/'/g, '')
            const authCode = escapedCode.replace(/\\x([0-9A-Fa-f]{2})/g, function () {
                return String.fromCharCode(parseInt(arguments[1], 16))
            })
            cy.log(authCode)

            cy.request({
                url: tokenUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept': '*/*'
                },
                body: {
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    code: authCode,
                    code_verifier: codeVerifier
                }
            }).then((response) => {

                expect(response.status).to.eql(200)
                const access_token = response.body.access_token
                //setting the cookie value to be grabbed for api authentication
                cy.setCookie('accessToken', access_token)

            })
        })
    })
}

/**
 * Checks whether the subject contains the provided text
 *
 * @param {any}         subject   The element you want to check the text for
 * @param {string}      text   The text value
 */
Cypress.Commands.add('setAccessTokenCookie', () => {
    return setAccessTokenCookie()
})
Cypress.Commands.add('setAccessTokenCookieALT', () => {
    return setAccessTokenCookieALT()
})