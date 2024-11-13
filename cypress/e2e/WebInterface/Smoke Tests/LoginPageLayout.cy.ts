import { LandingPage } from "../../../Shared/LandingPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"

describe('Login page layout', () => {

    beforeEach('Visit login page', () => {

        cy.visit('/')
    })

    it('Page has the correct header elements', () => {

        cy.get(LandingPage.header).find('a').should('have.attr', 'href', '/measures')
    })

    it('Login help links are correct', () => {

        // expand
        cy.get(OktaLogin.needHelpButton).click()

        Utilities.waitForElementVisible(OktaLogin.forgotPassword, 3500)
        cy.get(OktaLogin.forgotPassword).click()

      //  Utilities.waitForElementVisible(OktaLogin.resetViaEmail, 3500)
        cy.get(OktaLogin.resetViaEmail).should('be.visible')

        Utilities.waitForElementVisible(OktaLogin.backFromReset, 3500)
        cy.get(OktaLogin.backFromReset).should('have.text', 'Back to sign in').click()

        // expand again
        cy.get(OktaLogin.needHelpButton).click()

        cy.get(OktaLogin.helpLink).should('have.attr', 'href').and('contain', 'idm.cms.gov/help')

        cy.get(OktaLogin.termsAndConditionsButton).should('have.text', 'Terms & Conditions').click()

        cy.contains('Paperwork Reduction Act').should('have.attr', 'href', 'https://www.cms.gov/regulations-and-guidance/legislation/paperworkreductionactof1995')

        cy.get(OktaLogin.tcClose).click()
    })

    it('Footer bar links are correct', () => {

        cy.contains('Get Help').should('have.attr', 'href', 'https://oncprojectracking.healthit.gov/support/projects/MADIE/summary')

        cy.contains('User Guide').should('have.attr', 'href', 'https://www.emeasuretool.cms.gov/training-resources')

        cy.contains('Freedom of Information Act').should('have.attr', 'href', 'https://www.cms.gov/center/freedom-of-information-act-center.html')

        cy.contains('Accessibility Policy').should('have.attr', 'href', 'https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/Policiesforaccessibility')

        cy.contains('Privacy Policy').should('have.attr', 'href', 'https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/Privacy-Policy')

        cy.contains('Rules of Behavior').should('have.attr', 'href', 'https://security.cms.gov/policy-guidance/hhs-policy-rules-behavior-use-information-it-resources')

        cy.contains('Terms of Use').should('have.attr', 'href', 'https://harp.cms.gov/login/terms-of-use')
       
        cy.contains('CMS/HHS Vulnerability Disclosure Policy').should('have.attr', 'href', 'https://www.cms.gov/about-cms/information-systems/privacy/vulnerability-disclosure-policy')

        cy.contains('CMS.gov').should('have.attr', 'href', 'https://www.cms.gov/')
        })

    it('Footer displays all relevant info', () => {

        cy.get(LandingPage.lowerLogo).should('have.attr', 'data-testid', 'custom-madie-logo')

        cy.get(LandingPage.version).should('contain.text', 'Version ')

        cy.get(LandingPage.contactBlock).should('have.text', 'A federal government website managed and paid for by the U.S.Centers for Medicare & Medicaid Services. 7500 Security Boulevard, Baltimore MD 21244')
    })
})