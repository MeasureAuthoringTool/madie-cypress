import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.1.000'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude CQMCommon version '1.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "

describe('Edit Measure: Add Meta Data', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

    })
    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify the entry, save and retrieval of all Measure Meta Data', () => {

        let description = 'description'
        let copyright = 'copyright'
        let disclaimer = 'disclaimer'
        let rationale = 'rationale'
        let guidance = 'guidance'
        let clinicalRecommendation = 'Clinical Recommendation'

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Verify that the Endorsement Number field is disabled before adding Endorsement Organization
        cy.get(EditMeasurePage.endorsementNumber).should('be.disabled')
        //Save Endorsement Organization
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click().wait(500)
        cy.get(EditMeasurePage.endorsingOrganizationOption).click()
        cy.get(EditMeasurePage.endorsementNumber).should('be.enabled')
        cy.get(EditMeasurePage.endorsementNumber).type('345678')
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).clear().type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).clear().type(copyright)
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).clear().type(disclaimer)
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).clear().type(rationale)
        cy.get(EditMeasurePage.measureRationaleSaveButton).click()
        cy.get(EditMeasurePage.measureRationaleSuccessMessage).should('be.visible')

        //Steward & Developers
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type("ACO Health Solutions")
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should become available, now, because a value is, now, in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')

        //save Steward & Developers
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({ force: true })
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('be.visible')

        //Guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).clear().type(guidance)
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).clear().type(clinicalRecommendation)
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Endorsing Organization and number on Name, Version & ID page
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).invoke('val').then(endorsingOrg => {
            cy.get(EditMeasurePage.endorsementNumber).invoke('val').then(endorsementNumber => {
                expect(endorsingOrg).to.eql('CMS Consensus Based Entity')
                expect(endorsementNumber).to.eql('345678')
            })
        })
        cy.log('Endorsing Organization and number added successfully')

        //steward
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()
        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('include.value', 'Able Health')
        cy.get('.MuiChip-label').should('include.text', 'ACO Health Solutions')
        cy.log('Measure Steward & Developers added successfully')

        //description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).invoke('val').then(val => {
            expect(val).to.eql(description)
        })
        cy.log('Measure Description added successfully')

        //copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).invoke('val').then(val => {
            expect(val).to.eql(copyright)
        })
        cy.log('Measure Copyright added successfully')

        //disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).invoke('val').then(val => {
            expect(val).to.eql(disclaimer)
        })
        cy.log('Measure Disclaimer added successfully')

        //rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).invoke('val').then(val => {
            expect(val).to.eql(rationale)
        })
        cy.log('Measure Rationale added successfully')

        //guidance
        cy.get(EditMeasurePage.leftPanelGuidance).click()
        cy.get(EditMeasurePage.measureGuidanceTextBox).invoke('val').then(val => {
            expect(val).to.eql(guidance)
        })
        cy.log('Measure Guidance added successfully')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).invoke('val').then(val => {
            expect(val).to.eql(clinicalRecommendation)
        })
        cy.log('Measure Clinical Recommendation added successfully')

    })
})

describe('Verify Measure Id and Version Id', () => {

    before('Login', () => {

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the Measure Id and Version Id are auto generated for new Measures', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName)

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.measureId).should('exist')
        cy.get(EditMeasurePage.measureId).should('have.attr', 'readonly', 'readonly')

        cy.get(EditMeasurePage.versionId).should('exist')
        cy.get(EditMeasurePage.versionId).should('have.attr', 'readonly', 'readonly')
    })
})

describe('Generate CMS ID', () => {

    before('Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the CMS ID can be generated successfully', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')

        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')

        cy.get(EditMeasurePage.generateCmsIdButton).click()

        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            expect(val).to.contain('FHIR')
        })

        cy.log('CMS ID Generated successfully')

    })
})
