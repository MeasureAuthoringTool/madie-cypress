export type ComponentSortDirection = 'ASC' | 'DESC'

export type ComponentSort = {
    sort: string
    direction: ComponentSortDirection
}

export type ComponentMeasureSearchResponse = {
    body?: {
        content?: Array<{ measureName: string }>
    }
}

export class CompositeMeasureComponentsDialogRequests {
    private static readonly initialListAlias = '@initialComponentList'

    public static interceptInitialList(): void {
        cy.intercept({
            method: 'PUT',
            pathname: '/api/measures/searches',
            query: {
                ownershipTypes: 'ALL',
                limit: '5',
                page: '0',
                sort: 'lastModifiedAt',
                direction: 'DESC'
            }
        }).as(this.initialListAlias.slice(1))
    }

    public static waitForInitialList(): Cypress.Chainable<ComponentMeasureSearchResponse | undefined> {
        return cy.wait(this.initialListAlias).then(({ response }) => {
            expect(response?.statusCode).to.eq(200)
            return response
        })
    }

    public static interceptSortedList(sort: ComponentSort, page = 0, alias = 'sortedComponents'): void {
        cy.intercept({
            method: 'PUT',
            pathname: '/api/measures/searches',
            query: {
                ownershipTypes: 'ALL',
                limit: '5',
                page: String(page),
                sort: sort.sort,
                direction: sort.direction
            }
        }).as(alias)
    }

    public static waitForSortedList(
        sort: ComponentSort,
        page = 0,
        alias: `@${string}` = '@sortedComponents'
    ): Cypress.Chainable<ComponentMeasureSearchResponse | undefined> {
        return cy.wait(alias).then(({ request, response }) => {
            expect(request.query).to.include({
                page: String(page),
                sort: sort.sort,
                direction: sort.direction
            })
            expect(response?.statusCode).to.eq(200)
            return response
        })
    }

    public static measureNames(response: ComponentMeasureSearchResponse | undefined): string[] {
        const measureNames = response?.body?.content?.map((measure) => measure.measureName) ?? []

        expect(measureNames, 'sorted component measure names').to.have.length.greaterThan(0)

        return measureNames
    }
}
