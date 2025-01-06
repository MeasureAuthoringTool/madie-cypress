import { Utilities } from "../../../Shared/Utilities"

let cql = 'library CohortEpisodeWithStrat1723121043645 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    ' "Qualifying Encounters"\n' +
    ' \n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    'union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Home Healthcare Services"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()\n' +
    '\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '(Enc E where E.status = \'finished\') is not null\n' +
    '\n' +
    'define "Stratificaction 1":\n' +
    ' "Qualifying Encounters" Enc\n' +
    ' where Enc.type in "Annual Wellness Visit"'


describe('CQL Builder Lookups: QI Core', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Verify QI Core CQL is parsed correctly', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.log(accessToken.value)
            cy.request({
                failOnStatusCode: false,
                url: '/api/fhir/cql-builder-lookups',
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value,
                    'Content-Type': 'text/plain'
                },
                body: cql
            }).then((response) => {

                expect(response.status).to.eql(200)
                expect(response.body.parameters).to.have.lengthOf(1)
                expect(response.body.definitions).to.have.lengthOf(3)
                expect(response.body.functions).to.have.lengthOf(33)
                expect(response.body.fluentFunctions).to.have.lengthOf(1)

            })

        })

    })
})
