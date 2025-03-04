import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

const now = Date.now()
let measureName = 'MeasureGroupTabs' + now
let CqlLibraryName = 'MeasureGroupTabsLib' + now
let measureCQL = MeasureCQL.SBTEST_CQL.replace('SimpleFhirLibrary', measureName)

describe('Validating Stratification tabs', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Stratification tab includes new fields and those fields have expected values', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).click()
            }
        })

        //confirm stratification related fields are present
        cy.get(MeasureGroupPage.stratOne).should('exist')
        cy.get(MeasureGroupPage.stratTwo).should('exist')
        cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
        cy.get(MeasureGroupPage.stratAssociationTwo).should('exist')
        cy.get(MeasureGroupPage.stratDescOne).should('exist')
        cy.get(MeasureGroupPage.stratDescTwo).should('exist')
        cy.get(MeasureGroupPage.addStratButton).should('exist')

        //confirm values in stratification 1 related fields -- score type is Proportion
        //stratification 1 -- default value
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'Select Definition')
        cy.get(MeasureGroupPage.stratOne).each(($ele) => {
            expect($ele.text()).to.be.oneOf(['Select Definition', 'denom', 'ipp', 'num'])
        })
        //Association -- default value -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).should('have.attr', 'placeholder', 'Select All That Apply')
        //Association -- contains these values based off score type -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).click()

        cy.get('[id="association-select-1-listbox"]').each(($ele) => {
            expect($ele.text()).to.be.equal('Select AllinitialPopulationdenominatornumerator')
        })

        //change score type to Cohort
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Association -- contains these values based off score type -- score type is Cohort
        cy.get(MeasureGroupPage.stratAssociationOne).should('have.attr', 'placeholder', 'Select All That Apply')
        //change score type to Continuous Variable
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Association -- default value -- score type is Continuous Variable
        cy.get(MeasureGroupPage.stratAssociationOne).should('have.attr', 'placeholder', 'Select All That Apply')
        //Association -- contains these values based off score type -- score type is Continuous Variable
        cy.get(MeasureGroupPage.stratAssociationOne).click()
        cy.get('[id="association-select-1-listbox"]').each(($ele) => {
            expect($ele.text()).to.be.equal('Select All')
        })
    })

    it('Stratification does not save, if association is the only field that has a value selected', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //enter a value for the required Population Basis field
        cy.get(MeasureGroupPage.popBasis).type('Boolean').type('{enter}')

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).click()
            }
        })

        //select a value only for Association
        cy.get(MeasureGroupPage.stratAssociationOne).click()
        cy.get(MeasureGroupPage.stratAssociationOne).should('exist').should('be.visible').click().type('denominator')
        cy.get('[id="association-select-1-option-0"]').click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratificationTab).click()
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })
        //Association -- default value -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).should('have.attr', 'placeholder', 'Select All That Apply')
    })

    it('Add multiple stratifications to the measure group', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 32000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'ipp')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        //Add Stratification 4
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratFour, 'denom')
        cy.get(MeasureGroupPage.stratDescFour).type('StratificationFour')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate back to stratification tab and assert the values
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratTwo).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratThree).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.stratFour).should('contain.text', 'denom')
    })

    it('Removing stratifications from a measure group', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'ipp')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        //Add Stratification 4
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratFour, 'denom')
        cy.get(MeasureGroupPage.stratDescFour).type('StratificationFour')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click({ force: true })

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Remove Stratifications
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })

        //Remove Stratification 1 and 2
        cy.get(MeasureGroupPage.removeStratButton).eq(0).click()
        cy.get(MeasureGroupPage.removeStratButton).eq(0).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })

        //Verify Stratifications after removing 1 and 2
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.stratDescOne).should('contain.text', 'StratificationThree')
        cy.get(MeasureGroupPage.stratTwo).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratDescTwo).should('contain.text', 'StratificationFour')
    })

    it('Verify error message when the Stratification return type does not match with population basis', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Set Population basis as Encounter
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')

        //Verify save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })
})

describe('Stratification Validations for Ratio Measure group', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'ipp', 'num', 'denom', 'Boolean')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify error message when Ratio Measure with two IPs has more than one Population Association selected for Stratification', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Add Second Initial Population
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //Navigate to Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).click()
        cy.get('[data-value="denom"]').click()
        cy.get(MeasureGroupPage.stratificationErrorMsg).should('contain.text', 'Ratio measures with two IPs must have one population for associations')

        //Verify that the Save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })

    it('Verify error message when Ratio Measure with two IPs has no Population Association for Stratification', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Add Second Initial Population
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //Navigate to Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).click()
        cy.get('[data-value="denom"]').click()

        //Remove Associations
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(2).click()
        cy.get('#association-select-1-option-0').click()
        cy.get(MeasureGroupPage.stratificationErrorMsg).should('contain.text', 'Associations are required when CQL Definition is provided.')

        //Verify that the Save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })

    it('Verify error message when Ratio Measure with single IP has no Population Association for Stratification', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Add Second Initial Population
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //Navigate to Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).click()
        cy.get('[data-value="denom"]').click()

        //Remove Associations
        cy.get('[data-testid="ArrowDropDownIcon"]').eq(2).click()
        cy.get('#association-select-1-option-0').click()
        cy.get(MeasureGroupPage.stratificationErrorMsg).should('contain.text', 'Associations are required when CQL Definition is provided.')

        //Verify that the Save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })
})