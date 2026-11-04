import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'

describe('MAT-10562 Edit Measure CMS ID help accessibility', () => {
    before('Create an owner draft measure', () => {
        const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
        const measureName = `MAT10562${suffix}`
        CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4)
        return cy.then(() => undefined)
    })

    beforeEach('Open Edit Measure Details', () => {
        OktaLogin.SessionLogin()
        MeasuresPage.openEditMeasureDetailsById()
        return Accessibility.injectAxe()
    })

    after('Delete the scenario-owned draft measure', () => Utilities.deleteMeasure())

    it('has a named, focusable CMS ID image with a 24 by 24 CSS pixel target', () => {
        cy.get(EditMeasurePage.cmsIdHelp)
            .should('be.visible')
            .then(($help) => {
                expect($help.attr('role'), 'CMS ID help role').to.equal('img')
                expect($help.attr('aria-label'), 'CMS ID help accessible name').to.equal(
                    'Once a CMS Identifier has been generated it may not be modified or removed for any draft or version of a measure.'
                )
                expect($help.attr('tabindex'), 'CMS ID help keyboard focus').to.equal('0')

                const target = $help[0].getBoundingClientRect()
                expect(target.width, 'CMS ID help target width in CSS pixels').to.be.at.least(24)
                expect(target.height, 'CMS ID help target height in CSS pixels').to.be.at.least(24)
            })
    })

    it('has no full-page axe violations with Edit Measure Details open', () => {
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
