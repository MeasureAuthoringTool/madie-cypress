import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import {Header} from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now() + 1
let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Measure: CQL Editor', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('cqlCQLEditor.txt', EditMeasurePage.cqlEditorTextBox)

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        //Validate error(s) in CQL Editor window
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).invoke('show').click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")

        //Navigate away from the page
        cy.get(Header.measures).click()

        //Navigate back to the CQL Editor page
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor windows
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).invoke('show').click({force:true, multiple: true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 1:3 | Could not resolve identifier SDE in the current library.")
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 5:13 | Member SDE Sex not found for type null.")

    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, when ' +
        'included library is not found', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR_404.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        //Validate error(s) in CQL Editor after saving
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).eq(0).invoke
        ('show').click({force:true, multiple: true})

        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            '"status":404,"error":"Not Found","path":"/api/fhir/libraries/cql"}"')

        //Navigate away from the page
        cy.get(Header.measures).click()

        //Navigate back to the CQL Editor page
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor persists after saving
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).eq(0).invoke
        ('show').click({force:true, multiple: true})

        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            '"status":404,"error":"Not Found","path":"/api/fhir/libraries/cql"}"')

    })

    it('Verify no errors appear on CQL Editor page and in the CQL Editor object, on save and on tab / page load, ' +
        'when included library is found', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        //Validate the lack of error(s) in CQL Editor
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).should('not.exist')

        //Navigate away from the page
        cy.get(Header.measures).click()

        //Navigate back to the CQL Editor page
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor persists after saving
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).should('not.exist')

    })

    it.only('Graceful error msg if model is missing in CQL', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry_FHIR_model_error.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        //Validate error(s) in CQL Editor after saving

        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).eq(0).invoke
        ('show').click({force:true, multiple: true})

        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            'ELM: 1:37 | Model Type and version are required')

    })
})

describe('Measure: CQL Editor: valueSet', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    //Need to skip this test for now until we are able to manipulate the DB and remove the API Key and TGT from
    //Mongo DB with a DB connection or new API Call
    it.skip('UMLS Error: User Not Logged in', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        cy.get(CQLEditorPage.umlsMessage).should('be.visible')
        cy.get(CQLEditorPage.umlsMessage).should('contain.text', 'Please log in to UMLS!')

    })

    it('Value Sets are valid', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

    })

    it('Value Set Invalid, 404', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4EntryInvalidValueSet.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        cy.get(CQLEditorPage.umlsMessage).should('not.exist')

        //Validate error(s) in CQL Editor window
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).eq(5).invoke
        ('show').click({force:true, multiple: true})

        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            "VSAC: 0:102 | Request failed with status code 404 for oid = 2.16.840.1.113883.3.464.1003.110.12.1059999 " +
            "location = 36:0-36:102")

    })

    it('Value Set Invalid, 400 undefined', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/ValueSetTestingEntryInValid400.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Name and Version can be updated in the Details tab. MADiE has over written the updated Library Name and Version')

        cy.get(CQLEditorPage.umlsMessage).should('not.exist')

        //Validate error(s) in CQL Editor window
        cy.scrollTo('top')
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{pageUp}')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')

        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).eq(0).invoke
        ('show').click({force:true, multiple: true})

        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text',
            'VSAC: 0:22 | Request failed with status code 400 for oid = undefined location = 18:0-18:22')
    })
})