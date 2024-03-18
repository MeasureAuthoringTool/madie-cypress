import { EditMeasurePage } from "./EditMeasurePage"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"

export class QDMElements {

    public static addElement(elementCategory: string, elementTitle: string): void {

        switch ((elementCategory.valueOf()).toString().toLowerCase()) {

            case 'encounter': {

                cy.get('[data-testid="elements-tab-encounter"]').click()
                cy.get('[data-testid="data-type-Encounter, ' + elementTitle + '"]').click()

                break
            }

        }
    }

    public static addTimingRelevantPeriodDateTime(startDateAndTime: string, endDateAndTime: string): void {

        cy.get('[id="dateTime"]').eq(0).type(startDateAndTime)
        cy.get('[id="dateTime"]').eq(1).type(endDateAndTime)
    }

    public static addCode(codeSystem: string, code: string): void {

        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-' + codeSystem + '"]').click()

        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-' + code + '"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
    }

    public static enterAttribute(attribute: string, type: string): void {

        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()

        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-' + attribute + '"]').click()

        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-' + type + '"]').click()

    }

    public static enterQuantity(quantity: string, unit: string): void {

        cy.get('[data-testid="quantity-value-input-quantity"]').type(quantity)
        cy.get('[id="quantity-unit-input-quantity"]').type(unit)

    }

    public static addAttribute(): void {

        cy.get('[data-testid="add-attribute-button"]').click()

    }

    public static closeElement(): void {

        cy.get('[data-testid="CloseIcon"]').click()

    }


}
