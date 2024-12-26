import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { v4 as uuidv4 } from 'uuid'
import { MeasureGroups } from "../../../../Shared/MeasureGroupPage"

const now = Date.now()
let MeasuresPageOne = ''
let measureName = 'VersionValidations' + now
let cqlLibraryName = 'VersionValidationsLib' + now
let measureCQL = MeasureCQL.SBTEST_CQL
let testCaseTitle = 'TestcaseTitle'
let testCaseDescription = 'Description' + now
let testCaseSeries = 'SBTestSeries'
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid

let measureCQL_WithErrors = 'library ' + cqlLibraryName + ' version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\')'

describe('Measure Versioning validations', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('User can not version Measure if there is no CQL', () => {

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersioningErrorMsg).should('contain.text', 'Requested measure cannot be versioned')
        cy.get(MeasuresPage.measureVersionHelperText).should('contain.text', 'Please include valid CQL in the CQL editor to version before versioning this measure')

    })

    it('User can not Version if the Measure CQL has errors', () => {

        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersioningErrorMsg).should('contain.text', 'Requested measure cannot be versioned')
        cy.get(MeasuresPage.measureVersionHelperText).should('contain.text', 'Please include valid CQL in the CQL editor to version before versioning this measure')

    })
})

// this test is expected to fail until MAT-7992 is completed
describe.skip('Cannot version the measure when group does not have declared Improvement Notation', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, { measureCql: measureCQL })
        const populations: MeasureGroups = {
            initialPopulation: 'ipp',
            denominator: 'denom',
            numerator: 'num'
        }
        // API to set up population criteria without Improvement Notation
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": 'Proportion',
                        "populationBasis": 'boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": populations.initialPopulation
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": populations.denominator
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": populations.numerator
                            }
                        ],
                        "measureGroupTypes": [
                            'Outcome'
                        ],
                        "stratifications": [
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })  
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('User cannot Version when the PC does not include an Improvement Notation', () => {

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersioningErrorMsg).should('contain.text', 'Requested measure cannot be versioned')
        cy.get(MeasuresPage.measureVersionHelperText).should('contain.text', 'At least one Population Criteria is missing Improvement Notation')
    })
})

describe('Measure Versioning when the measure has test case with errors', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue + 4

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('User receives "Version Measures with Invalid Test Cases?" prompt / modal, if measure has test case with errors', () => {
        let versionNumber = '1.0.000'

        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('version', 0)

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.versionMeasurewithTCErrorsModalBody, 20000)

        cy.get(TestCasesPage.versionMeasurewithTCErrorsModalBody).should('contain.text', 'You have test cases that are invalid.')

        cy.get(TestCasesPage.versionMeasurewithTCErrorsCancel).click()

        Utilities.waitForElementToNotExist(TestCasesPage.versionMeasurewithTCErrorsModalBody, 20000)

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.versionMeasurewithTCErrorsModalBody, 20000)

        cy.get(TestCasesPage.versionMeasurewithTCErrorsContinue).click()
        Utilities.waitForElementToNotExist(TestCasesPage.versionMeasurewithTCErrorsModalBody, 20000)

        MeasuresPage.validateVersionNumber(MeasuresPageOne, versionNumber)
        cy.log('Version Created Successfully')
    })
})

describe('Non Measure owner unable to create Version', () => {

    before('Create Measure with regular user and Login as Alt user', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newMeasureName = measureName + randValue
        let newCqlLibraryName = cqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.AltLogin()
    })

    after('Logout and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify Version button is not visible for non Measure owner', () => {

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')

            //Verify version button is not visible
            cy.get('[data-testid=create-version-measure-' + fileContents + ']').should('not.exist')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
        })

    })
})
