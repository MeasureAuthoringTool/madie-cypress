type NullableString = string | null

type Credentials = {
    harpUser: NullableString
    password: NullableString
    harpUser2: NullableString
    password2: NullableString
    harpUser3: NullableString
    password3: NullableString
    altHarpUser: NullableString
    altHarpUser2: NullableString
    altHarpUser3: NullableString
    passwordALT: NullableString
    passwordALT2: NullableString
    passwordALT3: NullableString
    umls_API_KEY: NullableString
    adminApiKey: NullableString
    adminUser: NullableString
    adminPassword: NullableString
}

type Authentication = {
    authnUrl: string
    authUri: string
    redirectUri: string
    clientId: string
}

function envValue(key: string): NullableString {
    return Cypress.env(key) ?? null
}

function currentEnvironment(): string {
    return Cypress.env('environment')
}

function sharedTestCredentials(adminApiKeyName: string): Credentials {
    return {
        harpUser: envValue('TEST_USERNAME'),
        password: envValue('TEST_PASSWORD'),
        harpUser2: envValue('TEST_USERNAME2'),
        password2: envValue('TEST_PASSWORD2'),
        harpUser3: envValue('TEST_USERNAME3'),
        password3: envValue('TEST_PASSWORD3'),
        altHarpUser: envValue('TEST_ALT_USERNAME'),
        altHarpUser2: envValue('TEST_ALT_USERNAME2'),
        altHarpUser3: envValue('TEST_ALT_USERNAME3'),
        passwordALT: envValue('TEST_ALT_PASSWORD'),
        passwordALT2: envValue('TEST_ALT_PASSWORD2'),
        passwordALT3: envValue('TEST_ALT_PASSWORD3'),
        umls_API_KEY: envValue('VSAC_API_KEY'),
        adminApiKey: envValue(adminApiKeyName),
        adminUser: envValue('TEST_ADMIN_USERNAME'),
        adminPassword: envValue('TEST_ADMIN_PASSWORD')
    }
}

export class Environment {
    public static credentials = (): Credentials => {
        switch (currentEnvironment()) {
            case 'dev':
                return sharedTestCredentials('DEV_ADMIN_API_KEY')
            case 'test':
                return sharedTestCredentials('TEST_ADMIN_API_KEY')
            case 'impl':
                return {
                    harpUser: envValue('IMPL_USERNAME'),
                    password: envValue('IMPL_PASSWORD'),
                    harpUser2: null,
                    password2: null,
                    harpUser3: null,
                    password3: null,
                    altHarpUser: envValue('IMPL_ALT_USERNAME'),
                    altHarpUser2: null,
                    altHarpUser3: null,
                    passwordALT: envValue('IMPL_ALT_PASSWORD'),
                    passwordALT2: null,
                    passwordALT3: null,
                    umls_API_KEY: envValue('VSAC_API_KEY'),
                    adminApiKey: null,
                    adminUser: null,
                    adminPassword: null
                }
            default:
                throw new Error(`Unsupported Cypress environment: ${currentEnvironment()}`)
        }
    }

    public static authentication = (): Authentication => {
        switch (currentEnvironment()) {
            case 'dev':
            case 'test':
                return {
                    authnUrl: 'https://test.idp.idm.cms.gov/api/v1/authn',
                    authUri: envValue('TEST_MADIE_AUTHURI'),
                    redirectUri: envValue('TEST_MADIE_REDIRECTURI'),
                    clientId: envValue('TEST_MADIE_CLIENTID')
                }
            case 'impl':
                return {
                    authnUrl: 'https://impl.idp.idm.cms.gov/api/v1/authn',
                    authUri: envValue('IMPL_MADIE_AUTHURI'),
                    redirectUri: envValue('IMPL_MADIE_REDIRECTURI'),
                    clientId: envValue('IMPL_MADIE_CLIENTID')
                }
            default:
                throw new Error(`Unsupported Cypress environment: ${currentEnvironment()}`)
        }
    }
}
