import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'

type IgPackageRequest = {
    packageId?: string
    packageVersion?: string
}

const igPackagesUrl = '/api/cql-libraries/admin/ig-packages'
const qiCorePackage: Required<IgPackageRequest> = {
    packageId: 'hl7.fhir.us.qicore',
    packageVersion: '7.0.2'
}
const cqlPackage: Required<IgPackageRequest> = {
    packageId: 'hl7.fhir.uv.cql',
    packageVersion: '2.0.0'
}
const invalidRequests: Array<[string, IgPackageRequest | null | undefined]> = [
    ['a missing request body', undefined],
    ['a null request body', null],
    ['a missing package ID', { packageVersion: qiCorePackage.packageVersion }],
    ['a blank package ID', { packageId: '', packageVersion: qiCorePackage.packageVersion }],
    ['a missing package version', { packageId: qiCorePackage.packageId }],
    ['a blank package version', { packageId: qiCorePackage.packageId, packageVersion: '' }]
]

const requestIgPackageInstallation = (
    body?: IgPackageRequest | null,
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<unknown>> => {
    return TestData.requestWithAccessToken<unknown>({
        ...options,
        url: igPackagesUrl,
        method: 'POST',
        ...(body === undefined ? {} : { body })
    })
}

describe('IG Package Installation Service', () => {
    describe('MAT-10214 request validation and authorization', () => {
        it('accepts a valid IG package request from an admin asynchronously', () => {
            OktaLogin.setupAdminSession()

            requestIgPackageInstallation(qiCorePackage).then((response) => {
                expect(response.status).to.eq(202)
            })
        })

        it('accepts the CQL implementation guide package request from an admin asynchronously', () => {
            OktaLogin.setupAdminSession()

            requestIgPackageInstallation(cqlPackage).then((response) => {
                expect(response.status).to.eq(202)
                expect(response.body).to.contain(cqlPackage.packageId)
                expect(response.body).to.contain(cqlPackage.packageVersion)
            })
        })

        it('rejects a standard user', () => {
            TestData.setupUserScope()

            requestIgPackageInstallation(qiCorePackage, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eq(403)
            })
        })

        invalidRequests.forEach(([scenario, body]) => {
            it(`rejects ${scenario}`, () => {
                OktaLogin.setupAdminSession()

                requestIgPackageInstallation(body, { failOnStatusCode: false }).then((response) => {
                    expect(response.status).to.eq(400)
                })
            })
        })
    })
})
