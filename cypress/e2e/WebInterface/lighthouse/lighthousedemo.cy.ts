
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

        /*         const thresholds = {
                    performance: 16,
                    accessibility: 80,
                    'first-contentful-paint': 3000,
                    'largest-contentful-paint': 40000,
                    'total-blocking-time': 520000,
                    'speed-index': 27000,
                    'cumulative-layout-shift': 300,
                    interactive: 40000,
                    //seo: 60,
                    //pwa: 50,
                };
                const lighthouseConfig = {
                    formFactor: 'desktop',
                    screenEmulation: { disabled: true },
                    settings: { output: "html" },
                    extends: "lighthouse:default"
                }; */

        OktaLogin.Login()

        const thresholds = {
            "performance": 50,
            "accessibility": 50,
            "best-practices": 50,
            "seo": 50
        }

        const lighthouseOptions = {
            formFactor: 'desktop',
            screenEmulation: { disabled: true },
        }

        const lighthouseConfig = {
            settings: { output: "html" },
            extends: "lighthouse:default",
        }

        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)


        // cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig).then((report) => {
        //     console.log(report)
        // })



        //cy.lighthouse(thresholds, lighthouseConfig)

        /*         cy.task('lighthouse', { url }).then((report) => {
                    const htmlReport = report.html
                    // Save the HTML report to a file
                    cy.writeFile('lighthouse-report.html', htmlReport);
                    // Use the HTML report for further analysis or sharing with stakeholders
                }); */

    })

})
