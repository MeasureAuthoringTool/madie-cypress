export class Environment {
    /**
     * We set our environment variables here in this class
     */

    public static credentials = (): { harpUser: string, password: string, harpUserALT: string, passwordALT: string, umls_API_KEY: string, measureSharing_API_Key: string, deleteMeasureAdmin_API_Key: string } => {
        switch (Cypress.env('environment')) {
            case 'dev': {
                return {
                    harpUser: Cypress.env('DEV_USERNAME'),
                    password: Cypress.env('DEV_PASSWORD'),
                    harpUserALT: Cypress.env('DEV_ALT_USERNAME'),
                    passwordALT: Cypress.env('DEV_ALT_PASSWORD'),
                    umls_API_KEY: Cypress.env('VSAC_API_KEY'),
                    measureSharing_API_Key: Cypress.env('DEV_MEASURESHARING_API_KEY'),
                    deleteMeasureAdmin_API_Key: Cypress.env('DEV_DELETEMEASUREADMIN_API_KEY')
                }
            }
            case 'test': {
                return {
                    harpUser: Cypress.env('TEST_USERNAME'),
                    password: Cypress.env('TEST_PASSWORD'),
                    harpUserALT: Cypress.env('TEST_ALT_USERNAME'),
                    passwordALT: Cypress.env('TEST_ALT_PASSWORD'),
                    umls_API_KEY: Cypress.env('VSAC_API_KEY'),
                    measureSharing_API_Key: Cypress.env('TEST_MEASURESHARING_API_KEY'),
                    deleteMeasureAdmin_API_Key: Cypress.env('TEST_DELETEMEASUREADMIN_API_KEY')
                }
            }
            case 'impl': {
                return {
                    harpUser: Cypress.env('IMPL_USERNAME'),
                    password: Cypress.env('IMPL_PASSWORD'),
                    harpUserALT: Cypress.env('IMPL_ALT_USERNAME'),
                    passwordALT: Cypress.env('IMPL_ALT_PASSWORD'),
                    umls_API_KEY: Cypress.env('VSAC_API_KEY'),
                    measureSharing_API_Key: Cypress.env('IMPL_MEASURESHARING_API_KEY'),
                    deleteMeasureAdmin_API_Key: Cypress.env('IMPL_DELETEMEASUREADMIN_API_KEY')
                }
            }
        }
    }

    public static authentication = (): { authnUrl: string, authUri: string, redirectUri: string, clientId: string } => {
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
            case 'impl':

                return {
                    authnUrl: 'https://impl.idp.idm.cms.gov/api/v1/authn',
                    authUri: Cypress.env('IMPL_MADIE_AUTHURI'),
                    redirectUri: Cypress.env('IMPL_MADIE_REDIRECTURI'),
                    clientId: Cypress.env('IMPL_MADIE_CLIENTID')
                }

        }
    }
}
