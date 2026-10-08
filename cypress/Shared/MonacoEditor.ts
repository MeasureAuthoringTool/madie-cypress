export class MonacoEditor {
    private static readonly errorMarker = '.monaco-editor .squiggly-error'

    public static assertErrors(errorMessageSelector: string, ...messages: string[]): void {
        cy.get(errorMessageSelector).should(($errors) => {
            messages.forEach((message) => expect($errors).to.contain.text(message))
        })
    }

    public static assertErrorMarker(): void {
        cy.get(this.errorMarker).should('exist')
    }

    public static assertNoErrorMarker(): void {
        cy.get(this.errorMarker).should('not.exist')
    }

    public static type(editorSurfaceSelector: string, value: string): void {
        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        cy.realType(value)
    }

    public static replace(editorSurfaceSelector: string, value: string): void {
        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        cy.realPress(['Control', 'A'])
        cy.realType(value)
    }

    public static append(editorSurfaceSelector: string, value: string): void {
        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        cy.realPress(['Control', 'End'])
        cy.realType(`\n${value}`)
    }

    public static appendDocumentText(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error('MonacoEditor.appendDocumentText requires a Chromium browser because it uses CDP Input.insertText.')
        }

        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        cy.realPress(['Control', 'End'])
        this.insertTextViaCdp(`\n${value}`)
    }

    public static insertText(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error('MonacoEditor.insertText requires a Chromium browser because it uses CDP Input.insertText.')
        }

        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        this.insertTextViaCdp(value)
    }

    public static replaceDocument(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error('MonacoEditor.replaceDocument requires a Chromium browser because it uses CDP Input.insertText.')
        }

        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick()

        cy.realPress(['Control', 'A'])
        this.insertTextViaCdp(value)
    }

    private static insertTextViaCdp(value: string): void {

        cy.then(() => {
            return Cypress.automation(
                'remote:debugger:protocol',
                {
                    command: 'Input.insertText',
                    params: { text: value }
                }
            ).catch((error: Error) => {
                throw new Error(`MonacoEditor.insertText could not send CDP Input.insertText: ${error.message}`)
            })
        })
    }

    public static insertTextFromFile(file: string, editorSurfaceSelector: string): void {
        cy.readFile(file).then((contents) => {
            this.insertText(editorSurfaceSelector, contents)
        })
    }

    public static replaceDocumentFromFile(file: string, editorSurfaceSelector: string): void {
        cy.readFile(file).then((contents) => {
            this.replaceDocument(editorSurfaceSelector, contents)
        })
    }

}
