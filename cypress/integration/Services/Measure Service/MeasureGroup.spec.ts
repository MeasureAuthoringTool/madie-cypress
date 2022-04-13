export {}
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureScoring = 'Proportion'

describe('Measure Service: Test Case Endpoints', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()
    })

    before('Create Measure', () => {
        
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newMeasureName = measureName + randValue
        let newCqlLibraryName = CqlLibraryName + randValue
        let userToken = 'default'

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureScoring, userToken)

    })
    it('Create Proportion measure group', () => {
        let PopIniPop = 'IPP'
        let PopNum = 'Numerator'
        let PopDenom = 'Denominator'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "population": { 
                            "initialPopulation": PopIniPop, 
                            "numerator": PopNum, 
                            "denominator": PopDenom 
                        }
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql(measureScoring)
                    expect(response.body.population.initialPopulation).to.eql('IPP')
                    expect(response.body.population.numerator).to.eql('Numerator')
                    expect(response.body.population.denominator).to.eql('Denominator')
                })
            })
        })
    })

    it('Update measure group to Ratio', () => {
        let PopIniPop = 'IPP'
        let PopNum = 'Numerator'
        let PopNumExc = 'Numerator Exclusion'
        let PopDenom = 'Denominator'
        let measureTstScoring = 'Ratio'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureTstScoring, 
                        "population": { 
                            "initialPopulation": PopIniPop, 
                            "numerator": PopNum,
                            "numeratorExclusion": PopNumExc,
                            "denominator": PopDenom 
                        }
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.population.initialPopulation).to.eql('IPP')
                    expect(response.body.population.numerator).to.eql('Numerator')
                    expect(response.body.population.numeratorExclusion).to.eql('Numerator Exclusion')
                    expect(response.body.population.denominator).to.eql('Denominator')
                })
            })
        })
    })
})