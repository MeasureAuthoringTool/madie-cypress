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

const credentialKeys = [
    'TEST_USERNAME', 'TEST_PASSWORD', 'TEST_USERNAME2', 'TEST_PASSWORD2', 'TEST_USERNAME3', 'TEST_PASSWORD3',
    'TEST_ALT_USERNAME', 'TEST_ALT_USERNAME2', 'TEST_ALT_USERNAME3', 'TEST_ALT_PASSWORD', 'TEST_ALT_PASSWORD2',
    'TEST_ALT_PASSWORD3', 'VSAC_API_KEY', 'DEV_ADMIN_API_KEY', 'TEST_ADMIN_API_KEY', 'TEST_ADMIN_USERNAME',
    'TEST_ADMIN_PASSWORD', 'IMPL_USERNAME', 'IMPL_PASSWORD', 'IMPL_ALT_USERNAME', 'IMPL_ALT_PASSWORD',
    'TEST_MADIE_AUTHURI', 'TEST_MADIE_REDIRECTURI', 'TEST_MADIE_CLIENTID', 'IMPL_MADIE_AUTHURI',
    'IMPL_MADIE_REDIRECTURI', 'IMPL_MADIE_CLIENTID', 'MADIE_CODEVERIFIER'
] as const

type CredentialKey = typeof credentialKeys[number]
const credentialKeySet = new Set<string>(credentialKeys)
let values: ReadonlyMap<CredentialKey, string> | undefined

function isCredentialKey(key: string): key is CredentialKey {
    return credentialKeySet.has(key)
}

function setValues(environmentValues: unknown): void {
    const nextValues = new Map<CredentialKey, string>()

    if (environmentValues && typeof environmentValues === 'object') {
        Object.entries(environmentValues).forEach(([key, value]) => {
            if (isCredentialKey(key) && typeof value === 'string') {
                nextValues.set(key, value)
            }
        })
    }

    values = nextValues
}

function envValue(key: CredentialKey): NullableString {
    if (!values) {
        throw new Error('Environment has not been initialized. Call Environment.initialize() from a root hook first.')
    }

    return values.get(key) ?? null
}

function currentEnvironment(): string {
    const environment = Cypress.expose('environment')
    if (typeof environment !== 'string') {
        throw new Error('Public Cypress environment is not configured.')
    }

    return environment
}

function sharedTestCredentials(adminApiKeyName: 'DEV_ADMIN_API_KEY' | 'TEST_ADMIN_API_KEY'): Credentials {
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
    /**
     * Retrieves only the secrets used by this project. Values remain private
     * to this support module after the cy.env() command completes.
     */
    public static initialize(): Cypress.Chainable<void> {
        return cy.env([...credentialKeys]).then((environmentValues) => {
            setValues(environmentValues)
            return undefined
        })
    }

    public static codeVerifier(): NullableString {
        return envValue('MADIE_CODEVERIFIER')
    }

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
