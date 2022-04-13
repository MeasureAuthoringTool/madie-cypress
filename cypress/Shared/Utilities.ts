import { type } from "os";
import {EditMeasurePage} from "../Shared/EditMeasurePage"
import {TestCasesPage} from "../Shared/TestCasesPage"
import {Header} from "../Shared/Header"
import {MeasureGroupPage} from "../Shared/MeasureGroupPage"
export class Utilities {

    public static textValues = {
        dataLines: null
    }

    public static readWriteFileData(file: string, pageResource: any): void{
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
            for (let i in cqlArr){
                if (cqlArr[i] == '' || cqlArr[i] == null || cqlArr[i] == undefined){
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
    public static validateCQL(file: string, pageResource: any): void{
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
            for (let i in cqlArr){
                this.textValues.dataLines = cqlArr[i]
                cy.get(pageResource)
                    .should('contain.text', this.textValues.dataLines)
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

    public static validateTCPopValueCheckBoxes (measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()){
            case "Ratio": {
                //validate what available check boxes should and shouldn't be present / visible
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','DENEX')
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
                    .contains('td','IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Continuous Variable': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','MSRPOPLEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(Header.mainMadiePageButton).click()
                break
            }
            case 'Cohort': {
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .contains('td','IPP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','NUMER')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','NUMEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','DENOM')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value','DENEX')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'DENEXCEP')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPL')
                cy.get(TestCasesPage.testCasePopulationValuesTable)
                    .should('not.have.value', 'MSRPOPLEX')
                cy.get(Header.mainMadiePageButton).click()
                break

            }
        }
    }

    public static validationMeasureGroupSaveAll (measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()){
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .select('SDE Sex')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .select('Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .select('SDE Race')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .select('Surgical Absence of Cervix')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .select('SDE Sex')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .select('Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .select('SDE Ethnicity')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .select('SDE Race')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .select('Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.measurePopulationSelect)
                    .select('SDE Sex')
                cy.get(MeasureGroupPage.measurePopulationExclusionSelect)
                    .select('Absence of Cervix')
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
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
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

    public static validationMeasureGroupSaveWithoutRequired (measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()){
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .select('Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .select('Surgical Absence of Cervix')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .select('Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .select('SDE Ethnicity')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .select('Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.measurePopulationExclusionSelect)
                    .select('Absence of Cervix')
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

    public static validationMeasureGroupSaveWithoutOptional (measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()){
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .select('SDE Sex')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .select('SDE Race')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .select('SDE Sex')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .select('SDE Race')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect)
                    .select('SDE Payer')
                cy.get(MeasureGroupPage.measurePopulationSelect)
                    .select('SDE Sex')
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
    public static validateMeasureGroup (measureScoreValue: any | any[], mgPVTestType: string | string[]): void {
        //log, in cypress, the test type value
        cy.log((mgPVTestType.valueOf()).toString())

        switch ((mgPVTestType.valueOf()).toString()){
            case "all": {
                //log, in cypress, the measure score value
                cy.log((mgPVTestType.valueOf()).toString())
                this.validationMeasureGroupSaveAll((measureScoreValue.valueOf()).toString())                
                //save measure group
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                //validation message after attempting to save
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg)
                    .then(($message) => {
                        if ($message.text() == 'This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel') {
                            cy.get(MeasureGroupPage.confirmScoreUnitValueUpdateBtn).click()
                            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
                        }
                        else if ( $message.text() != 'This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel') {
                            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
                        }
                   })
                break
            }
            case 'wOReq': {
                this.validationMeasureGroupSaveWithoutRequired((measureScoreValue.valueOf()).toString())                
                //save measure group button is not enabled
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
                break
            }
            case 'wOOpt': {
                //based on the scoring unit value, select a value for all population fields
                this.validationMeasureGroupSaveWithoutOptional((measureScoreValue.valueOf()).toString())
                if ((measureScoreValue.valueOf()).toString() == 'Cohort') {
                    //save measure group button is not enabled
                    cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
                }
                else {
                    cy.wait(1000)
                    //save measure group
                    cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                    //validation message after attempting to save
                    cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
                    cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg)
                        .then(($message) => {
                            if ($message.text() == 'This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel') {
                                cy.get(MeasureGroupPage.confirmScoreUnitValueUpdateBtn).click()
                                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
                            }
                            else if ( $message.text() != 'This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel') {
                                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
                            }
                        })
                    } 
                    break
            }
        }        
    }
}