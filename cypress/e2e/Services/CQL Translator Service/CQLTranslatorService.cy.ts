export {}
import {MeasureCQL} from "../../../Shared/MeasureCQL"


describe('CQL Translation Service', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    it('Successful 200', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql/translator/cql?showWarnings=false&annotations=true&locators=true&disable-list-demotion=true&' +
                    'disable-list-promotion=true&disable-method-invocation=true&validate-units=true',
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'Content-Type': 'text/plain',
                    'Referer': 'https://dev-madie.hcqis.org/measure/61e1d03b1c970b2059dab030/edit/cql-editor',
                    'Cookie': 'BIGipServerdev-madie.hcqis.org_pool=!lMfj+jchkkKRNQnnHpfsqpjhar0QCIcjD4NHLXcBKQr7PK' +
                        '6AfT1tRf/hVw21J5zTOPRmdkfIWhpmIA==; BIGipServerdev-emeasuretool.hcqis.org_pool=!R7bugGRHm' +
                        'sQzCmHnHpfsqpjhar0QCG106/9IrypW2jm/w+C9Y++jmS8brQkC1N7Nnq0xP0FnHCdGvIM=; TS01738331=013e8b' +
                        '7471dbe72e3c2d9452e571cec9207d1f07ed3b83be0ce592356900f6965484cefd3ae534aa395fc23406f8b' +
                        'bdabd41fb81dafef027f60db9d1f92ba680aa3b42d789ee4377f088fa909dd2aaf5d1003106e97b5dd4367' +
                        '1ea5b5887fba9dcfbb58de9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'application/json, text/plain, */*'
                },
                body: MeasureCQL.SBTESTCMS347_CQL
            }).then((response) => {
                expect(response.status).to.eql(200)
            })
        })
    })
})





