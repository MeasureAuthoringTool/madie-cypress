import axe = require('axe-core')

type AxeWindow = Window & {
    axe?: typeof axe
    eval: (source: string) => unknown
}

export const Accessibility = {
    injectAxe(): Cypress.Chainable<void> {
        return cy
            .readFile('node_modules/axe-core/axe.min.js', { log: false })
            .then((source) => {
                return cy.window({ log: false }).then((window) => {
                    const axeWindow = window as AxeWindow

                    if (!axeWindow.axe) {
                        axeWindow.eval(source)
                    }
                })
            })
            .then(() => undefined)
    },

    check(
        context: axe.ContextSpec,
        options: axe.RunOptions
    ): Cypress.Chainable<axe.AxeResults> {
        return cy
            .window({ log: false })
            .then((window) => {
                const axeWindow = window as AxeWindow

                expect(axeWindow.axe, 'axe injected into the application window').to.exist
                return axeWindow.axe!.run(context, options)
            })
            .then((results) => {
                expect(results.violations, Accessibility.violationSummary(results)).to.be.empty
                return results
            })
    },

    violationSummary(results: axe.AxeResults): string {
        return results.violations
            .map(({ help, id, impact, nodes }) => `${impact ?? 'unknown'}: ${id} (${help}) — ${nodes.length} node(s)`)
            .join('\n')
    }
}
