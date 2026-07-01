import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'
import { TestData } from '../../../Shared/TestData'

const measureName = 'ServiceMeasureSharing' + Date.now()
const cqlLibraryName = 'ServiceMeasureSharingLib' + Date.now()
const measureCQL = MeasureCQL.SBTEST_CQL
let harpUser = ''

describe('Young measure locks are not deleted to protect against race conditions', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        harpUser = OktaLogin.getUser(false)
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Continued test and clean up', () => {
        // This lock deletion should be after the protection expires, so the delete will process.
        TestData.requestMeasureLock('DELETE').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.locked).to.be.false
            expect(response.body.lockedBy).to.be.null
        })
        Utilities.deleteMeasure()
    })

    it('Immediate lock deletion attempt is ignored', () => {
        TestData.requestMeasureLock('PUT').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.locked).to.be.true
            expect(response.body.lockedBy).to.eql(harpUser)
        })

        // This delete is inside the 200 ms protection zone; it reports 200 but keeps the lock.
        TestData.requestMeasureLock('DELETE').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.locked).to.be.true
            expect(response.body.lockedBy).to.eql(harpUser)
        })

        cy.wait(200)
    })
})
