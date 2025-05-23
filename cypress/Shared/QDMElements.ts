import { TestCasesPage } from "./TestCasesPage"
import { Utilities } from "./Utilities"
import { umlsLoginForm } from "./umlsLoginForm"

export class QDMElements {

    public static addElement(elementCategory: string, elementTitle: string): void {

        switch ((elementCategory.valueOf()).toString().toLowerCase()) {

            case 'encounter': {

                cy.get(TestCasesPage.EncounterElementTab).click()
                cy.get('[data-testid="data-type-Encounter, ' + elementTitle + '"]').click()

                break
            }

            case 'laboratory': {

                cy.get(TestCasesPage.laboratoryElement).click()
                cy.get('[data-testid="data-type-Laboratory Test, ' + elementTitle + '"]').click()

                break
            }

            case 'physicalexam': {

                cy.get('[data-testid=elements-tab-physical_exam]').click()
                cy.get('[data-testid="data-type-Physical Exam, ' + elementTitle + '"]').click()

                break
            }

            case 'patientcharacteristic': {

                cy.get('[data-testid=elements-tab-patient_characteristic]').click()
                cy.get('[data-testid="data-type-Patient Characteristic ' + elementTitle + '"]').click()

                break
            }

            case 'condition': {

                cy.get(TestCasesPage.ConditionElementTab).click()
                cy.get('[data-testid="data-type-' + elementTitle + '"]').click()

                break
            }

            case 'procedure': {

                cy.get('[data-testid=elements-tab-procedure]').click()
                cy.get('[data-testid="data-type-Procedure, ' + elementTitle + '"]').click()

                break
            }

            case 'diagnosis': {

                cy.get('[data-testid=elements-tab-condition]').click()
                cy.get('[data-testid="data-type-' + elementTitle + '"]').click()

                break
            }

            case 'medication': {

                cy.get('[data-testid=elements-tab-medication]').click()
                cy.get('[data-testid="data-type-Medication, ' + elementTitle + '"]').click()

                break
            }
        }
    }

    public static addTimingLocationPeriodDateTime(startDateAndTime?: string, endDateAndTime?: string): void {

        cy.get(TestCasesPage.locationPeriodStartDate).type(startDateAndTime)
        cy.get(TestCasesPage.locationPeriodEndDate).type(endDateAndTime)
    }

    public static addTimingRelevantPeriodDateTime(startDateAndTime: string, endDateAndTime?: string): void {

        cy.get(TestCasesPage.relevantPeriodStartDate).type(startDateAndTime)
        cy.get(TestCasesPage.relevantPeriodEndDate).type(endDateAndTime)
    }

    public static addTimingPrevalencePeriodDateTime(startDateAndTime: string, endDateAndTime?: string): void {

        cy.get(TestCasesPage.prevalencePeriodStartDate).type(startDateAndTime)
        if (endDateAndTime != null) {
            cy.get(TestCasesPage.prevalencePeriodEndDate).type(endDateAndTime)
        }

    }

    public static addCode(codeSystem: string, code: string): void {

        cy.get(TestCasesPage.ExpandedOSSDetailCardTabCodes).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.ExpandedOSSDetailCardTabCodes, 700000)
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabCodes).click()
        cy.get(TestCasesPage.codeSystemSelector).click()
        Utilities.waitForElementVisible('[data-testid="code-system-option-' + codeSystem + '"]', 700000)
        cy.get('[data-testid="code-system-option-' + codeSystem + '"]').click()

        cy.get(TestCasesPage.codeSelector).click()
        cy.get('[data-testid="code-option-' + code + '"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
    }

    public static enterAttribute(attribute: string, type: string): void {

        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()

        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-' + attribute + '"]').click()

        cy.get(TestCasesPage.attributeType).click()
        cy.get('[data-testid="option-' + type + '"]').click()

    }

    public static enterQuantity(quantity: string, unit: string): void {

        cy.get(TestCasesPage.quantityValueInput).type(quantity)
        cy.get('[id="quantity-unit-input-quantity"]').type(unit)

    }

    public static addAttribute(): void {

        cy.get(TestCasesPage.addAttribute).click()

    }

    public static closeElement(): void {

        cy.get(umlsLoginForm.closeGenericError).click()

    }


}
