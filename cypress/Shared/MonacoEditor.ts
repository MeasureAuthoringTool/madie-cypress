export class MonacoEditor {
    private static readonly errorMarker = '.monaco-editor .squiggly-error'

    public static assertRenderedText(editorSurfaceSelector: string, ...expectedText: string[]): void {
        cy.get(editorSurfaceSelector).should(($editorSurfaces) => {
            const renderedText = this.getRenderedText($editorSurfaces)

            expectedText.forEach((text) => expect(renderedText).to.contain(this.normalizeText(text)))
        })
    }

    public static assertRenderedTextDoesNotContain(editorSurfaceSelector: string, text: string): void {
        cy.get(editorSurfaceSelector).should(($editorSurfaces) => {
            expect(this.getRenderedText($editorSurfaces)).not.to.contain(this.normalizeText(text))
        })
    }

    public static assertRenderedTextOccurrences(editorSurfaceSelector: string, text: string, count: number): void {
        cy.get(editorSurfaceSelector).should(($editorSurfaces) => {
            const renderedText = this.getRenderedText($editorSurfaces)
            const occurrences = renderedText.split(text).length - 1

            expect(occurrences, `occurrences of ${text}`).to.equal(count)
        })
    }

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
        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realType(value)
    }

    public static replace(editorSurfaceSelector: string, value: string): void {
        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realPress(['Control', 'A'])
        cy.realType(value)
    }

    public static append(editorSurfaceSelector: string, value: string): void {
        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realPress(['Control', 'End'])
        cy.realPress('Enter')

        if (value) {
            cy.realType(value)
        }
    }

    public static scrollToEnd(editorSurfaceSelector: string): void {
        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })
        cy.realPress(['Control', 'End'])
    }

    public static appendToLineContaining(editorSurfaceSelector: string, lineText: string, value: string): void {
        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })
        cy.realPress(['Control', 'F'])
        cy.realType(lineText)
        cy.realPress('Escape')
        cy.realPress('End')
        cy.realType(value)
    }

    public static insertBeforeLineContaining(editorSurfaceSelector: string, lineText: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error(
                'MonacoEditor.insertBeforeLineContaining requires a Chromium browser because it uses CDP Input.insertText.'
            )
        }

        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })
        cy.realPress(['Control', 'F'])
        cy.realType(lineText)
        cy.realPress('Escape')
        cy.realPress('Home')
        this.insertTextViaCdp(`${value}\n`)
    }

    public static appendDocumentText(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error(
                'MonacoEditor.appendDocumentText requires a Chromium browser because it uses CDP Input.insertText.'
            )
        }

        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realPress(['Control', 'End'])
        this.insertTextViaCdp(`\n${value}`)
    }

    public static insertText(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error('MonacoEditor.insertText requires a Chromium browser because it uses CDP Input.insertText.')
        }

        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        this.insertTextViaCdp(value)
    }

    public static replaceDocument(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error(
                'MonacoEditor.replaceDocument requires a Chromium browser because it uses CDP Input.insertText.'
            )
        }

        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realPress(['Control', 'A'])
        this.insertTextViaCdp(value)
    }

    public static clearDocument(editorSurfaceSelector: string): void {
        cy.get(editorSurfaceSelector)
            .should('be.visible')
            .realClick({ position: 'topLeft', clickCount: 4 })
        cy.realPress('Delete')
    }

    public static replaceDocumentAfterNativeClear(editorSurfaceSelector: string, value: string): void {
        if (!Cypress.isBrowser({ family: 'chromium' })) {
            throw new Error(
                'MonacoEditor.replaceDocumentAfterNativeClear requires a Chromium browser because it uses CDP Input.insertText.'
            )
        }

        cy.get(editorSurfaceSelector).should('be.visible').realClick({ position: 'topLeft' })

        cy.realPress('F1')
        cy.realType('Select to Bracket')
        cy.realPress('Enter')
        cy.realPress('Delete')

        // CDP inserts at the current cursor position. Confirm the native selection
        // was actually cleared so an editor-focus regression cannot append a second
        // JSON document and surface misleading validation errors.
        cy.get(editorSurfaceSelector).should('not.contain.text', 'resourceType')

        this.insertTextViaCdp(value)
    }

    private static insertTextViaCdp(value: string): void {
        cy.then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Input.insertText',
                params: { text: value }
            }).catch((error: Error) => {
                throw new Error(`MonacoEditor.insertText could not send CDP Input.insertText: ${error.message}`)
            })
        })
    }

    private static getRenderedText($editorSurfaces: JQuery<HTMLElement>): string {
        return this.normalizeText($editorSurfaces
            .toArray()
            .map((editorSurface) => editorSurface.innerText)
            .join('\n')
        )
    }

    private static normalizeText(text: string): string {
        return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
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
