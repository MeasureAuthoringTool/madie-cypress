import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Header } from "../../../../Shared/Header"
import * as path from 'path'
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage";
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage";

const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const qiCoreCommonLib = 'resources/library-QICoreCommon-2.1.000.json'

describe('QMIG STU5 Compliance: Proportion Measure Export Validations', () => {

    const measureName = 'Stu5ProportionExport' + Date.now()
    const cqlLibraryName = 'Stu5PropExportLib' + Date.now()
    const measureCql = MeasureCQL.stndBasicQICoreCQL.replace('TestLibrary1709929148231865', measureName)
    const  measureOptions: CreateMeasureOptions = {
        ecqmTitle: 'STU5ProportionExport',
        measureCql: measureCql
    }
    const fileName = 'STU5ProportionExport-v0.0.000-FHIR'
    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')

        OktaLogin.Login()

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.verifyDownload(fileName + '4.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: fileName + '4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Export contains all correct Meta profile for its spec & included libraries', () => {

        // read export json
        cy.readFile(path.join(downloadsFolder, fileName + '.json')).then(measureJson => {

            const expectedMeasureProfiles = [
                'http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablemeasure',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cql-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/elm-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/proportion-measure-cqfm'
            ]

            expect(measureJson.entry[0].resource.resourceType).to.eq('Measure')
            expect(measureJson.entry[0].resource.meta.profile).to.deep.contain.members(expectedMeasureProfiles)
            expect(measureJson.entry[0].resource.contained[0].extension[0].url).to.eq('http://hl7.org/fhir/StructureDefinition/cqf-logicDefinition')
            expect(measureJson.entry[0].resource.extension[0].url).to.eq('http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-effectiveDataRequirements')
        })

        // read QICoreCommon
        cy.readFile(path.join(downloadsFolder, qiCoreCommonLib)).then(libJson => {

            const expectedLibraryProfile = [ 
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-computablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-publishablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-executablelibrary",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/cql-library",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/elm-json-library",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/elm-xml-library"
            ]

            expect(libJson.resourceType).to.eq('Library')
            expect(libJson.meta.profile).to.deep.contain.members(expectedLibraryProfile)
            expect(libJson.extension[0].url).to.eq('http://hl7.org/fhir/StructureDefinition/cqf-directReferenceCode')
        })

        // read measure-
        cy.readFile(path.join(downloadsFolder, 'resources/measure-' + cqlLibraryName + '-Draft based on 0.0.000.json')).then(measureJson => {
            expect(measureJson.contained[0].extension[0].url).to.eq('http://hl7.org/fhir/StructureDefinition/cqf-logicDefinition')
            expect(measureJson.extension[0].url).to.eq('http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-effectiveDataRequirements')
        })
    })
})

describe('QMIG STU5 Compliance: Cohort Measure Export Validations', () => {

    const measureName = 'Stu5CohortExport' + Date.now()
    const cqlLibraryName = 'Stu5CohortExportLib' + Date.now()
    const measureCql = MeasureCQL.stndBasicQICoreCQL.replace('TestLibrary1709929148231865', measureName)
    const  measureOptions: CreateMeasureOptions = {
        ecqmTitle: 'STU5CohortExport',
        measureCql: measureCql
    }
    const fileName = 'STU5CohortExport-v0.0.000-FHIR'
    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(null, null, 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()

        MeasuresPage.actionCenter('export') 

        //verify zip file exists
        cy.verifyDownload(fileName + '4.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: fileName + '4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Export contains all correct Meta profile for its spec & included libraries', () => {

        // read export json
        cy.readFile(path.join(downloadsFolder, fileName + '.json')).then(measureJson => {

            const expectedMeasureProfiles = [
                'http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablemeasure',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cql-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/elm-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cohort-measure-cqfm'
            ]

            expect(measureJson.entry[0].resource.resourceType).to.eq('Measure')
            expect(measureJson.entry[0].resource.meta.profile).to.deep.contain.members(expectedMeasureProfiles)
        })

        // read QICoreCommon
        cy.readFile(path.join(downloadsFolder, qiCoreCommonLib)).then(libJson => {

            const expectedLibraryProfile = [ 
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-computablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-publishablelibrary",
                "http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-executablelibrary",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/cql-library",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/elm-json-library",
                "http://hl7.org/fhir/uv/cql/StructureDefinition/elm-xml-library"
            ]

            expect(libJson.resourceType).to.eq('Library')
            expect(libJson.meta.profile).to.deep.contain.members(expectedLibraryProfile)
            expect(libJson.extension[0].url).to.eq('http://hl7.org/fhir/StructureDefinition/cqf-directReferenceCode')
        })
    })
})

describe('QMIG STU5 Compliance: Continuous Variable Measure Export Validations', () => {

    const measureName = 'Stu5CVExport' + Date.now()
    const cqlLibraryName = 'Stu5CVExportLib' + Date.now()
    const  measureOptions: CreateMeasureOptions = {
        ecqmTitle: 'STU5CVExport'
    }
    const fileName = 'STU5CVExport-v0.0.000-FHIR'
    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)
        cy.get(Header.measures).click()

        // this function hardcodes a specific CQL
        MeasureGroupPage.createMeasureGroupforContinuousVariableMeasure()
        
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.actionCenter('export') 

        //verify zip file exists
        cy.verifyDownload(fileName + '4.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: fileName + '4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Export contains all correct Meta profile for its spec', () => {

        // read export json
        cy.readFile(path.join(downloadsFolder, fileName + '.json')).then(measureJson => {

            const expectedMeasureProfiles = [
                'http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablemeasure',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cql-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/elm-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cv-measure-cqfm'
            ]

            expect(measureJson.entry[0].resource.resourceType).to.eq('Measure')
            expect(measureJson.entry[0].resource.meta.profile).to.deep.contain.members(expectedMeasureProfiles)
        })

        // not validating libraries - it would be the same as the previous 2 measures
    })
})

describe('QMIG STU5 Compliance: Ratio Measure Export Validations', () => {

    const measureName = 'Stu5RatioExport' + Date.now()
    const cqlLibraryName = 'Stu5RatioExportLib' + Date.now()
    const measureCql = MeasureCQL.stndBasicQICoreCQL.replace('TestLibrary1709929148231865', measureName)
    const  measureOptions: CreateMeasureOptions = {
        ecqmTitle: 'STU5RatioExport',
        measureCql: measureCql
    }
    const fileName = 'STU5RatioExport-v0.0.000-FHIR'
    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore4, measureOptions)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(null, false, 'Qualifying Encounters','Qualifying Encounters','Qualifying Encounters', 'Encounter' )
        OktaLogin.Login()

        MeasuresPage.actionCenter('export')

        //verify zip file exists
        cy.verifyDownload(fileName + '4.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: fileName + '4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Export contains all correct Meta profile for its spec', () => {

        // read export json
        cy.readFile(path.join(downloadsFolder, fileName + '.json')).then(measureJson => {

            const expectedMeasureProfiles = [
                'http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablemeasure',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cql-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/elm-measure-cqfm',
                'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/ratio-measure-cqfm'
            ]

            expect(measureJson.entry[0].resource.resourceType).to.eq('Measure')
            expect(measureJson.entry[0].resource.meta.profile).to.deep.contain.members(expectedMeasureProfiles)
        })

        // not validating libraries - it would be the same as the previous 2 measures
    })
})
