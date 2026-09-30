import { Environment } from './Environment'

export class UmlsConnection {
    public static ensureConnected(): Cypress.Chainable<void> {
        return cy
            .getCookie('accessToken', { log: false })
            .should('exist')
            .then((accessToken) => {
                const headers = { authorization: `Bearer ${accessToken.value}` }

                return cy.request({
                    url: '/api/vsac/umls-credentials/status',
                    method: 'GET',
                    headers,
                    failOnStatusCode: false,
                    log: false
                }).then((statusResponse) => {
                    if (statusResponse.status === 200) {
                        return undefined
                    }

                    const apiKey = Environment.credentials().umls_API_KEY
                    expect(apiKey, 'VSAC API key').to.be.a('string').and.not.be.empty

                    return cy.request({
                        url: '/api/vsac/umls-credentials',
                        method: 'POST',
                        headers,
                        body: apiKey,
                        failOnStatusCode: false,
                        log: false
                    })
                })
            })
            .then((connectionResponse) => {
                if (connectionResponse) {
                    expect(connectionResponse.status, 'UMLS API-key connection response').to.eq(200)
                }
            })
            .then(() => undefined)
    }
}
