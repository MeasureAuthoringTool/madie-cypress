export class Environment {
    /**
     * We set our environment variables here in this class
     */

    public static credentials = () : { harpUser: string, password: string} => {
        switch(Cypress.env('environment')) {
            case 'dev': {
                return {
                    harpUser: Cypress.env('DEV_USERNAME'),
                    password: Cypress.env('DEV_PASSWORD')
                }
            }
            case 'test': {
                return {
                    harpUser: Cypress.env('TEST_USERNAME'),
                    password: Cypress.env('TEST_PASSWORD')
                }
            }
        }
    }

    public static authentication = () : { authnUrl: string, authUri: string, redirectUri: string, clientId: string } => {
        switch (Cypress.env('environment')) {
            case 'dev':

                return {
                    authnUrl: 'https://dev.idp.idm.cms.gov/api/v1/authn',
                    authUri: Cypress.env('DEV_MADIE_AUTHURI'),
                    redirectUri: Cypress.env('DEV_MADIE_REDIRECTURI'),
                    clientId: Cypress.env('DEV_MADIE_CLIENTID')
                }

            case 'test':

                return {
                    authnUrl: 'https://test.idp.idm.cms.gov/api/v1/authn',
                    authUri: Cypress.env('TEST_MADIE_AUTHURI'),
                    redirectUri: Cypress.env('TEST_MADIE_REDIRECTURI'),
                    clientId: Cypress.env('TEST_MADIE_CLIENTID')
                }

        }
    }
}
