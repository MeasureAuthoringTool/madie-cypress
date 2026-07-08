import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import {
    CqlLibraryBody,
    CqlLibrarySearchResponse,
    TestData
} from "../../../Shared/TestData"

const defaultModel = 'QI-Core v4.1.1'

const requestCreateLibrary = (
    body: Partial<CqlLibraryBody>,
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.requestCqlLibrary<CqlLibraryBody>(
        {
            model: defaultModel,
            ...body
        },
        options
    )
}

const requestLibrarySearch = (
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<CqlLibrarySearchResponse>> => {
    return TestData.searchCqlLibraries(
        {
            searchField: '',
            optionalSearchProperties: ['']
        },
        options
    )
}

describe('CQL Library Service: Create CQL Library', () => {
    let harpUser = ''

    beforeEach(() => {
        harpUser = TestData.setupUserScope()
    })

    it('Create QI-Core CQL Library, successful creation', () => {
        const cqlLibraryName = `QICoreCqlLibrary${Date.now()}`

        requestCreateLibrary({
            cqlLibraryName,
            createdBy: harpUser
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.cqlLibraryName).to.eql(cqlLibraryName)
            expect(response.body.model).to.eql(defaultModel)
            expect(response.body.librarySetId).to.be.exist
            expect(response.body.createdBy).to.eql(harpUser)
        })
    })

    it('Create QDM CQL Library, successful creation', () => {
        const cqlLibraryName = `QDMCqlLibrary${Date.now()}`

        requestCreateLibrary({
            cqlLibraryName,
            model: 'QDM v5.6',
            createdBy: harpUser
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.cqlLibraryName).to.eql(cqlLibraryName)
            expect(response.body.model).to.eql('QDM v5.6')
            expect(response.body.librarySetId).to.be.exist
            expect(response.body.createdBy).to.eql(harpUser)
        })
    })

    it('Get All CQL Libraries', () => {
        requestLibrarySearch().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.not.be.null
            expect(response.body.content).to.be.a('array')
            expect(response.body.content[0].id).to.be.exist
        })
    })

    it('Get specific CQL Library', () => {
        TestData.readCqlLibrary().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.not.be.null
            expect(response.body.id).to.be.exist
        })
    })

    it('Get All CQL Libraries created by logged in User', () => {
        requestLibrarySearch({
            url: '/api/cql-libraries/searches?currentUser=true'
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.not.be.null
            expect(response.body.content).to.be.a('array')
            expect(response.body.content[0].id).to.be.exist
            expect(response.body.content[0].librarySet.owner).to.eql(harpUser)
        })
    })
})

describe('CQL Library Name validations', () => {
    let apiCqlLibraryName = ''
    const cqlLibraryPublisher = 'SemanticBits'

    before(() => {
        apiCqlLibraryName = `TestLibrary${Date.now()}`
        CQLLibraryPage.createCQLLibraryAPI(apiCqlLibraryName, cqlLibraryPublisher)
    })

    beforeEach(() => {
        TestData.setupUserScope()
    })

    it('Validation Error: CQL Library Name empty', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: ' '
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
        })
    })

    it('Validation Error: CQL Library Name has special characters', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: 'Test_Measure'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors).to.be.exist
        })
    })

    it('Validation Error: CQL Library Name does not start with an Upper Case letter', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: 'testMeasure'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors).to.be.exist
        })
    })

    it('Validation Error: CQL Library Name contains spaces', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: 'Test  Measure'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors).to.be.exist
        })
    })

    it('Validation Error: CQL Library Name has only numbers', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: '1234565'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors).to.be.exist
        })
    })

    it('Validation Error: CQL Library Name has more than 255 characters', () => {
        requestCreateLibrary(
            {
                cqlLibraryName:
                    'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 64 characters.')
        })
    })

    it('Validation Error: Duplicate CQL Library Name', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: apiCqlLibraryName
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must be unique.')
        })
    })
})

describe('CQL Library Model Validations', () => {
    beforeEach(() => {
        TestData.setupUserScope()
    })

    it('Validation Error: CQL Library Model empty', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: `TestCqlLibrary${Date.now()}`,
                model: ''
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
        })
    })

    it('Validation Error: Invalid CQL Library Model', () => {
        requestCreateLibrary(
            {
                cqlLibraryName: `TestCqlLibrary${Date.now()}`,
                model: 'QI-CoreINVALID'
            },
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
        })
    })
})
