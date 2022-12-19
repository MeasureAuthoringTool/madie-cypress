"use strict";
exports.__esModule = true;
var Utilities_1 = require("../../../Shared/Utilities");
var MeasureCQL_1 = require("../../../Shared/MeasureCQL");
var Environment_1 = require("../../../Shared/Environment");
var CreateMeasurePage_1 = require("../../../Shared/CreateMeasurePage");
var MeasureGroupPage_1 = require("../../../Shared/MeasureGroupPage");
var TestCasesPage_1 = require("../../../Shared/TestCasesPage");
var uuid_1 = require("uuid");
var measureName = '';
var newMeasureName = '';
var CQLLibraryName = '';
var newCQLLibraryName = '';
var model = 'QI-Core v4.1.1';
var harpUser = Environment_1.Environment.credentials().harpUser;
var measureNameU = 'TestMeasure' + Date.now() + 1;
var CqlLibraryNameU = 'TestLibrary' + Date.now() + 1;
var measureScoringU = MeasureGroupPage_1.MeasureGroupPage.measureScoringUnit;
var defaultUser = '';
var now = require('dayjs');
var mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD');
var mpEndDate = now().format('YYYY-MM-DD');
var measureCQL = MeasureCQL_1.MeasureCQL.SBTEST_CQL;
var eCQMTitle = 'eCQMTitle';
var versionIdPath = 'cypress/fixtures/versionId';
var randValue = (Math.floor((Math.random() * 1000) + 1));
describe('Measure Service: Create Measure', function () {
    beforeEach('Set Access Token', function () {
        cy.setAccessTokenCookie();
    });
    after('Clean up', function () {
        Utilities_1.Utilities.deleteMeasure(measureName, CQLLibraryName);
    });
    it('Create New Measure, successful creation', function () {
        measureName = 'TestMeasure' + Date.now() + randValue;
        CQLLibraryName = 'TestCql' + Date.now() + randValue;
        //create measure
        cy.getCookie('accessToken').then(function (accessToken) {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuid_1.v4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then(function (response) {
                expect(response.status).to.eql(201);
                expect(response.body.createdBy).to.eql(harpUser);
                cy.writeFile('cypress/fixtures/measureId', response.body.id);
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId);
            });
        });
        //log in as same user but typed in camel case
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setAccessTokenCookieCAMELCASE();
        cy.getCookie('accessToken').then(function (accessToken) {
            cy.readFile('cypress/fixtures/measureId').should('exist').then(function (id) {
                cy.request({
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then(function (response) {
                    expect(response.status).to.eql(200);
                    expect(response.body.active).to.eql(true);
                    expect(response.body.content[0].createdBy).to.eql(harpUser);
                });
            });
        });
    });
});
