import { TestCasesPage } from "./TestCasesPage"
import { Header } from "./Header"
import { MeasureGroupPage } from "./MeasureGroupPage"
import { CQLLibraryPage } from "./CQLLibraryPage";

export class Utilities {

    public static deleteMeasure(measureName: string, cqlLibraryName: string, deleteSecondMeasure?: boolean, altUser?: boolean): void {

        let path = 'cypress/fixtures/measureId'
        let versionIdPath = 'cypress/fixtures/versionId'
        let measureSetIdPath = 'cypress/fixtures/measureSetId'
        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')
        let ecqmTitle = 'eCQMTitle'

        if (altUser) {
            cy.setAccessTokenCookieALT()
        }
        else {
            cy.setAccessTokenCookie()
        }

        if (deleteSecondMeasure) {
            path = 'cypress/fixtures/measureId2'
            versionIdPath = 'cypress/fixtures/versionId2'
            measureSetIdPath = 'cypress/fixtures/measureSetId2'
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(path).should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.readFile(measureSetIdPath).should('exist').then((measureSetId) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + id,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": id, "measureName": measureName, "cqlLibraryName": cqlLibraryName, "ecqmTitle": ecqmTitle,
                                "model": 'QI-Core v4.1.1', "measurementPeriodStart": mpStartDate, "measurementPeriodEnd": mpEndDate, "active": false, 'versionId': vId, 'measureSetId': measureSetId
                            }
                        }).then((response) => {
                            console.log(response)

                            expect(response.status).to.eql(200)
                            cy.log('Measure Deleted Successfully')
                        })
                    })
                })
            })
        })
    }

    public static textValues = {
        dataLines: null
    }

    public static typeFileContents(file: string, pageResource: any): void {
        cy.get(pageResource).should('exist')
        cy.get(pageResource).should('be.visible')
        cy.get(pageResource).click()
        cy.readFile(file).should('exist').then((fileContents) => {
            cy.get(pageResource).focused().type(fileContents)
        })
    }

    public static readWriteFileData(file: string, pageResource: any): void {
        cy.fixture(file).then((str) => {
            // split file by line endings
            const fileArr = str.split(/\r?\n/);
            // log file in form of array
            cy.log(fileArr);
            // remove new line endings
            const cqlArr = fileArr.map((line: any) => {
                const goodLine = line.split(/[\r\n]+/);
                return goodLine[0];
            });
            // log new array
            cy.log(cqlArr);
            for (let i in cqlArr) {
                if (cqlArr[i] == '' || cqlArr[i] == null || cqlArr[i] == undefined) {
                    cy.get(pageResource).type('{enter}')
                }
                else {
                    this.textValues.dataLines = cqlArr[i]
                    cy.get(pageResource)
                        .type(this.textValues.dataLines)
                        .type('{enter}')
                    this.textValues.dataLines = null
                }

            }
        })
    }

    public static validateCQL(file: string, pageResource: any): void {
        cy.fixture(file).then((str) => {
            // split file by line endings
            const fileArr = str.split(/\r?\n/);
            // log file in form of array
            cy.log(fileArr);
            // remove new line endings
            const cqlArr = fileArr.map((line: any) => {
                const goodLine = line.split(/[\r\n]+/);
                return goodLine[0];
            });
            // log new array
            cy.log(cqlArr);
            this.waitForElementVisible(pageResource, 3000)
            cy.get(pageResource).invoke('show')
            for (let i in cqlArr) {
                this.textValues.dataLines = cqlArr[i]
                cy.log(this.textValues.dataLines)
                cy.get(pageResource)
                    .should('contains.text', this.textValues.dataLines)
                this.textValues.dataLines = null

            }
        })
    }

    public static waitForElementEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.enabled')
    }

    public static waitForElementVisible = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.visible')
    }

    public static waitForElementWriteEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('exist')
        cy.get(element, { timeout: timeout }).should('be.visible')
        cy.get(element, { timeout: timeout }).should('not.be.disabled')
        cy.get(element, { timeout: timeout }).should('not.have.attr', 'readonly', 'readonly')
    }

    public static validateTCPopValueCheckBoxes(measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //validate what available check boxes should and shouldn't be present / visible
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Proportion': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Continuous Variable': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'MSRPOPLEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Cohort': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td', 'IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break

            }
            default: { }
        }
    }

    public static validationMeasureGroupSaveAll(measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break
            }
            case 'Cohort': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break

            }

        }
    }

    public static validationMeasureGroupSaveWithoutRequired(measureScoreValue: string | string[]): void {
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({ force: true })
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Select Denominator')
                cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select Numerator')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Select Denominator')
                cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select Numerator')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                cy.get(MeasureGroupPage.measurePopulationSelect).should('contain.text', 'Select Measure Population')
                break
            }
            case 'Cohort': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Select Initial Population')
                break

            }

        }
    }

    public static validationMeasureGroupSaveWithoutOptional(measureScoreValue: string | string[]): void {
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({ force: true })
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break
            }
            case 'Cohort': {
                break

            }

        }
    }

    public static validateMeasureGroup(measureScoreValue: any | any[], mgPVTestType: string | string[]): void {
        //log, in cypress, the test type value
        cy.log((mgPVTestType.valueOf()).toString())

        switch ((mgPVTestType.valueOf()).toString()) {
            case "all": {

                //log, in cypress, the measure score value
                cy.log((mgPVTestType.valueOf()).toString())
                this.validationMeasureGroupSaveAll((measureScoreValue.valueOf()).toString())
                break
            }
            case 'wOReq': {
                this.validationMeasureGroupSaveWithoutRequired((measureScoreValue.valueOf()).toString())
                //save measure group button is not enabled
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('not.be.enabled')
                break
            }
            case 'wOOpt': {
                //based on the scoring unit value, select a value for all population fields
                this.validationMeasureGroupSaveWithoutOptional((measureScoreValue.valueOf()).toString())
                break
            }
        }
    }

    public static dropdownSelect(dropdownDataElement: string, valueDataElement: string): void {
        cy.get(dropdownDataElement).should('exist').should('be.visible')

        if (valueDataElement == MeasureGroupPage.measureScoringCohort ||
            valueDataElement == MeasureGroupPage.measureScoringProportion ||
            valueDataElement == MeasureGroupPage.measureScoringRatio ||
            valueDataElement == MeasureGroupPage.measureScoringCV ||
            valueDataElement == CQLLibraryPage.cqlLibraryModelQICore
        ) {
            cy.get(dropdownDataElement).click()
            cy.get(valueDataElement).click()
        }
        else {
            cy.get(dropdownDataElement)
                .parent()
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .click()
        }
    }

    public static setMeasureGroupType(): void {

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').wait(500).type('{enter}')
    }

    public static validateErrors(errorElementObject: string, errorContainer: string, errorMsg1: string, errorMsg2?: string): void {

        cy.get(errorElementObject).should('exist')
        cy.get(errorElementObject).invoke('show').click({ force: true, multiple: true })
        cy.wait(1000)
        cy.get(errorContainer).invoke('show').should('contain.text', errorMsg1)
        if ((errorMsg2 != null) || (errorMsg2 != undefined)) {
            cy.wait(1000)
            cy.get(errorContainer).invoke('show').should('contain.text', errorMsg2)
        }

    }
}