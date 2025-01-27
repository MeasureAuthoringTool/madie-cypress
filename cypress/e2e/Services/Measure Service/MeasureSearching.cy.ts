import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()

describe('Measure List Page Searching', () => {

    beforeEach('Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Measure List Page Searching', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures/searches?query=' + measureName,
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                cy.get(response.body.content.length)
                expect(response.body.content[0].id).to.be.exist
            })

        })
    })
})