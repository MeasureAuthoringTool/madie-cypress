import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CqlLibraryBody, TestData } from "../../../Shared/TestData"
import { Utilities } from "../../../Shared/Utilities"

const defaultModel = 'QI-Core v4.1.1'
const cqlLibraryPublisher = 'SemanticBits'
const invalidNameMessage =
    'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.'

const requestLibraryUpdate = (
    cqlLibraryName: string,
    options: Partial<Cypress.RequestOptions> = {},
    owner: 'selectedUser' | 'selectedAltUser' = 'selectedUser',
    fixtureOwner: 'selectedUser' | 'selectedAltUser' = owner
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.readCqlLibrary<CqlLibraryBody>(0, {}, fixtureOwner).then((libraryResponse) => {
        expect(libraryResponse.status).to.eql(200)

        return TestData.readCqlLibraryId(0, fixtureOwner).then((libraryId) => {
            return TestData.requestWithAccessToken<CqlLibraryBody>({
                ...options,
                url: `/api/cql-libraries/${libraryId}`,
                method: 'PUT',
                body: {
                    ...libraryResponse.body,
                    id: libraryId,
                    cqlLibraryName,
                    model: defaultModel,
                    cql: libraryResponse.body.cql ?? ''
                }
            })
        })
    })
}

describe('Edit CQL Library', () => {
    let cqlLibraryName = ''

    before(() => {
        cqlLibraryName = `TestCqlLibrary${Date.now()}`
        CQLLibraryPage.createCQLLibraryAPI(cqlLibraryName, cqlLibraryPublisher)
    })

    beforeEach(() => {
        TestData.setupUserScope()
    })

    it('Edit CQL Library : Successful Update', () => {
        const updatedCqlLibraryName = `UpdatedCQLLibrary${Date.now()}`

        requestLibraryUpdate(updatedCqlLibraryName).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.cqlLibraryName).to.eql(updatedCqlLibraryName)
        })

        cy.log('CQL Library Name Updated Successfully')
    })

    it('Validation Error: Edit CQL Library Name empty', () => {
        requestLibraryUpdate(' ', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
        })
    })

    it('Validation Error: Edit CQL Library Name has special characters', () => {
        requestLibraryUpdate('Test_Measure', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibrary).to.eql(invalidNameMessage)
        })
    })

    it('Validation Error: Edit CQL Library Name does not start with an Upper Case letter', () => {
        requestLibraryUpdate('testMeasure', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibrary).to.eql(invalidNameMessage)
        })
    })

    it('Validation Error: Edit CQL Library Name contains spaces', () => {
        requestLibraryUpdate('Test  Measure', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibrary).to.eql(invalidNameMessage)
        })
    })

    it('Validation Error: Edit CQL Library Name has only numbers', () => {
        requestLibraryUpdate('1234565', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibrary).to.eql(invalidNameMessage)
        })
    })

    it('Validation Error: Edit CQL Library Name has more than 64 characters', () => {
        requestLibraryUpdate(
            'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw',
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 64 characters.')
        })
    })
})

describe('Edi CQL Library - Ownership Validations', () => {
    let cqlLibraryName = ''
    let harpUserAlt = ''

    before(() => {
        cqlLibraryName = `TestCqlLibrary${Date.now()}`
        CQLLibraryPage.createCQLLibraryAPI(cqlLibraryName, cqlLibraryPublisher)
    })

    after(() => {
        Utilities.deleteLibrary(cqlLibraryName)
    })

    it('Verify non Library owner unable to Edit CQL Library', () => {
        const updatedCqlLibraryName = `UpdatedCQLLibrary${Date.now()}`
        harpUserAlt = TestData.setupUserScope('selectedAltUser')

        TestData.readCqlLibraryId().then((libraryId) => {
            requestLibraryUpdate(
                updatedCqlLibraryName,
                { failOnStatusCode: false },
                'selectedAltUser',
                'selectedUser'
            ).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql(
                    `User ${harpUserAlt} cannot modify resource CQL Library with id: ${libraryId}`
                )
            })
        })
    })
})
