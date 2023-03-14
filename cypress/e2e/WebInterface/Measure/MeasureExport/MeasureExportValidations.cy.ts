import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL
let measureCQL_WithErrors = 'library APICQLLibrary35455 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\'\n' +
    'define "ipp": true)'

//Need to revisit once MAT-5454 is implemented
describe('Error Message on Measure Export when the Measure does not have CQL', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()


            cy.get('[class="toast danger"]').should('contain.text', 'Unable to Export measure. Measure Bundle could not be generated as Measure does not contain CQL.')

        })
    })
})

describe('Error Message on Measure Export when the Measure CQL has errors', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + 1 + randValue
        newCqlLibraryName = CqlLibraryName + 1 + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL_WithErrors)
        OktaLogin.Login()

    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()


            cy.get('[class="toast danger"]').should('contain.text', 'Unable to Export measure. Measure Bundle could not be generated as Measure contains errors.')

        })
    })
})

describe('Error Message on Measure Export when the Population Criteria is missing', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + 2 + randValue
        newCqlLibraryName = CqlLibraryName + 2 + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()

    })

    after('Log out and Cleanup', () => {

        OktaLogin.Logout()
        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not contain Population Criteria', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()


            cy.get('[class="toast danger"]').should('contain.text', 'Unable to Export measure. Measure Bundle could not be generated as Measure does not contain Population Criteria.')

        })
    })
})
