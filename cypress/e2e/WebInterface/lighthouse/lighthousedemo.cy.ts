
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { url } from "inspector"
import { HtmlContentTypes } from "axe-core"
import { ok } from "assert"


describe('test', () => {



    it('should run lighthouse performance audits using default thresholds', () => {

        OktaLogin.Login()

        const thresholds = {
            performance: 16, //This is an overall score given to the overall page performance based on the metrics.
            //The score is calculated based off the following metrics (their respective weights are also listed):
            //'first-contentful-paint' -> 10%
            //'largest-contentful-paint' -> 25%
            //'total-blocking-time' -> 30%
            //'cumulative-layout-shift' -> 25%
            //'speed-index' -> 10%

            accessibility: 75, //The Lighthouse Accessibility score is a weighted average of all accessibility audits. Weighting is based on axe user impact assessments.

            'first-contentful-paint': 3000, //In miliseconds, this measures how long it takes the browser to render the first piece of DOM content after a user navigates to your page. 

            'largest-contentful-paint': 40000,//This is the approximate time it takes for the main content of the page becomes visible to users.

            'total-blocking-time': 520000, //In miliseconds, this measure the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses.

            'speed-index': 27000, //In miliseconds, this measures how quickly content is visually displayed during page load.

            'cumulative-layout-shift': 300, //Unexpected page element shifts -- basically, the measurement of shifting page elements

            interactive: 40000, //In miliseconds, this measures how long it takes a page to become fully interactive.
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality (ie: logging in and navigating to MADiE home page)
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)
        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")

    })

})
