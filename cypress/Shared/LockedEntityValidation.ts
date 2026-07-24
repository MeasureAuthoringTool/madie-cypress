export type LockedEntityType = 'measure' | 'test case' | 'library'

export class LockedEntityValidation {
    public static lockedTooltipText(displayName: string, harpId: string): string {
        return `Locked while being edited by ${displayName} (${harpId})`
    }

    public static legacyLockedTooltipText(harpId: string): string {
        return `Locked while being edited by ${harpId}`
    }

    public static lockedModalMessageText(
        entityType: LockedEntityType,
        displayName: string,
        harpId: string
    ): string {
        return `This ${entityType} is currently being edited by ${displayName} (${harpId}). You will be unable to make changes at this time.`
    }

    public static legacyLockedModalMessageText(entityType: LockedEntityType, harpId: string): string {
        return `This ${entityType} is currently being edited by HARP ID ${harpId}. You will be unable to make changes at this time.`
    }

    public static getDisplayName(harpId: string): Cypress.Chainable<string> {
        return cy.readFile('cypress/fixtures/accountRealNames.json').then((nameData) => {
            return (nameData[harpId] as string) ?? harpId
        })
    }

    public static normalizeTooltipText(text: string): string {
        return text
            .replace(/\s+/g, ' ')
            .replace(/by(?=[A-Za-z0-9])/g, 'by ')
            .trim()
    }

    public static assertVisibleTooltipText(expectedTooltip: string, fallbackTooltip?: string): void {
        cy.get('.MuiTooltip-tooltip').should(($tooltip) => {
            const actualTooltip = this.normalizeTooltipText($tooltip.text())
            const expectedOptions = [expectedTooltip, fallbackTooltip].filter(Boolean) as string[]
            const matchesExpectedOption = expectedOptions.some((expectedOption) => actualTooltip.includes(expectedOption))

            expect(
                matchesExpectedOption,
                `expected "${actualTooltip}" to include one of: ${expectedOptions.join(' | ')}`
            ).to.be.true
        })
    }

    public static assertTextContainsExpectedOption(
        actualText: string,
        expectedText: string,
        fallbackText?: string
    ): void {
        const normalizedActual = this.normalizeTooltipText(actualText)
        const expectedOptions = [expectedText, fallbackText].filter(Boolean).map((text) => this.normalizeTooltipText(text))
        const matchesExpectedOption = expectedOptions.some((expectedOption) => normalizedActual.includes(expectedOption))

        expect(
            matchesExpectedOption,
            `expected "${normalizedActual}" to include one of: ${expectedOptions.join(' | ')}`
        ).to.be.true
    }
}
