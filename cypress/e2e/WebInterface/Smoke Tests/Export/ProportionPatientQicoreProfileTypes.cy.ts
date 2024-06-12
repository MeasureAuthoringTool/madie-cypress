import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

let measureCQL = 'library T771 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    '\n' +
    'codesystem "LOINC": \'http://loinc.org\' \n' +
    'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\' \n' +
    'codesystem "ObservationCategoryCodes": \'http://terminology.hl7.org/CodeSystem/observation-category\'\n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\' \n' +
    '\n' +
    'valueset "Hospital Services for urology care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1164.64\'  \n' +
    'valueset "Morbid Obesity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1164.67\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Urinary retention": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1164.52\'\n' +
    '\n' +
    'code "American Urological Association Symptom Index [AUASI]": \'80883-2\' from "LOINC" display \'American Urological Association Symptom Index [AUASI]\'\n' +
    'code "Benign prostatic hyperplasia with lower urinary tract symptoms": \'N40.1\' from "ICD10CM" display \'Benign prostatic hyperplasia with lower urinary tract symptoms\'\n' +
    'code "If you were to spend the rest of your life with your urinary condition just the way it is now, how would you feel about that [IPSS]": \'81090-3\' from "LOINC" display \'If you were to spend the rest of your life with your urinary condition just the way it is now, how would you feel about that [IPSS]\'\n' +
    'code "International Prostate Symptom Score [IPSS]": \'80976-4\' from "LOINC" display \'International Prostate Symptom Score [IPSS]\'\n' +
    'code "survey": \'survey\' from "ObservationCategoryCodes" display \'survey\'\n' +
    'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Patient is Male"\n' +
    '    and "Has Qualifying Encounter"\n' +
    '    and "Has Qualifying BPH Diagnosis"\n' +
    '    and "Urinary Symptom Score Within 1 Month after Initial BPH Diagnosis" is not null\n' +
    '    and "Urinary Symptom Score 6 to 12 Months After Initial BPH Diagnosis" is not null\n' +
    '    \n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '  \n' +
    'define "Denominator Exclusions":\n' +
    '   exists ( "Urinary Retention Diagnosis Starts Within 1 Year After Initial BPH Diagnosis" )\n' +
    '       or ( "Initial BPH Diagnosis Starts During or Within 30 Days After End of Hospitalization" is not null )\n' +
    '       or ( "Has Morbid Obesity Diagnosis or BMI Exam Result  Greater Than or Equal to 40 Starts On or Before Follow Up USS Assessment" )\n' +
    '    \n' +
    'define "Numerator":\n' +
    '  "Has Urinary Symptom Score Improvement Greater Than or Equal To 3"\n' +
    '\n' +
    'define "Patient is Male":\n' +
    '  Patient.gender = \'male\'\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  SDE."SDE Ethnicity"\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  SDE."SDE Payer"\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  SDE."SDE Race"\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  SDE."SDE Sex"\n' +
    '  \n' +
    'define "AUA Symptom Index and Quality of Life Assessment Result":\n' +
    '  [Observation: "American Urological Association Symptom Index [AUASI]"] AUASIAssessment \n' +
    '      let LastQOLOnDate: \n' +
    '          Last([Observation: "If you were to spend the rest of your life with your urinary condition just the way it is now, how would you feel about that [IPSS]"] QOLAssessment\n' +
    '                 where QOLAssessment.effective.earliest() same day as QOLAssessment.effective.earliest()\n' +
    '                    and exists (QOLAssessment.category QOLAssessmentCategory\n' +
    '                                  where QOLAssessmentCategory ~ "survey")\n' +
    '                    and QOLAssessment.status in {\'final\', \'amended\', \'corrected\'}\n' +
    '                    and QOLAssessment.value is not null\n' +
    '                 sort by effective.earliest()\n' +
    '          )\n' +
    '      where exists (AUASIAssessment.category AUASIAssessmentCategory \n' +
    '                        where AUASIAssessmentCategory ~ "survey")\n' +
    '          and AUASIAssessment.status in {\'final\', \'amended\', \'corrected\'} \n' +
    '          and AUASIAssessment.value is not null\n' +
    '      return {\n' +
    '            effectiveDatetime: AUASIAssessment.effective.earliest(),\n' +
    '            valueInteger: (AUASIAssessment.value as Integer) + (LastQOLOnDate.value as Integer)\n' +
    '          }  \n' +
    '          \n' +
    'define "Documented IPSS Assessment Result":\n' +
    '  [Observation: "International Prostate Symptom Score [IPSS]"] IPSSAssessment\n' +
    '      where IPSSAssessment.status in {\'final\', \'amended\', \'corrected\'} \n' +
    '          and IPSSAssessment.value is not null\n' +
    '      return {\n' +
    '          effectiveDatetime: IPSSAssessment.effective.earliest(),\n' +
    '          valueInteger: IPSSAssessment.value as Integer\n' +
    '        }\n' +
    '        \n' +
    'define "Has Qualifying Encounter":\n' +
    '  exists ( [Encounter: "Office Visit"] ValidEncounter\n' +
    '              where ValidEncounter.period during day of "Measurement Period"\n' +
    '                  and ValidEncounter.class !~ "virtual"\n' +
    '                  and ValidEncounter.status = \'finished\' \n' +
    '            ) \n' +
    '            \n' +
    'define "Has BMI Exam Result Greater Than or Equal To 40 During Measurement Period and On or Before Follow Up USS Assessment":\n' +
    '  exists(["observation-bmi"] BMIExam\n' +
    '              with "Urinary Symptom Score 6 to 12 Months After Initial BPH Diagnosis" FollowUpUSSAssessment\n' +
    '                  such that BMIExam.value > 40 \'kg/m2\'\n' +
    '                      and BMIExam.status in {\'final\', \'amended\', \'corrected\'}\n' +
    '                      and BMIExam.effective.earliest() during day of "Measurement Period"\n' +
    '                      and BMIExam.effective.earliest() on or before FollowUpUSSAssessment.effectiveDatetime\n' +
    '              return BMIExam.effective.earliest()\n' +
    '            )   \n' +
    '\n' +
    'define "Initial BPH Diagnosis Starts During or Within 30 Days After End of Hospitalization":\n' +
    '  "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period" InitialBPHDiagnosis\n' +
    '      with [Encounter: "Hospital Services for urology care"] InHospitalServices\n' +
    '          such that InitialBPHDiagnosis.toPrevalenceInterval() starts during Interval[start of InHospitalServices.period, end of InHospitalServices.period + 31 days]\n' +
    '              and InHospitalServices.status = \'finished\' \n' +
    ' \n' +
    'define "Has Qualifying BPH Diagnosis":\n' +
    '  "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period" is not null \n' +
    ' \n' +
    'define "Morbid Obesity Diagnosis On or Before Follow Up USS Assessment":\n' +
    '  [Condition: "Morbid Obesity"] MorbidObesity\n' +
    '      with "Urinary Symptom Score 6 to 12 Months After Initial BPH Diagnosis" FollowUpUSSAssessment\n' +
    '        such that MorbidObesity.toPrevalenceInterval() overlaps "Measurement Period" \n' +
    '            and MorbidObesity.toPrevalenceInterval() starts on or before FollowUpUSSAssessment.effectiveDatetime\n' +
    '            and MorbidObesity.isConfirmedActiveDiagnosis()\n' +
    '\n' +
    'define "Has Morbid Obesity Diagnosis or BMI Exam Result  Greater Than or Equal to 40 Starts On or Before Follow Up USS Assessment":\n' +
    '  exists "Morbid Obesity Diagnosis On or Before Follow Up USS Assessment"\n' +
    '    or "Has BMI Exam Result Greater Than or Equal To 40 During Measurement Period and On or Before Follow Up USS Assessment"\n' +
    '\n' +
    'define "Urinary Retention Diagnosis Starts Within 1 Year After Initial BPH Diagnosis":\n' +
    '  [Condition: "Urinary retention"] UrinaryRetention\n' +
    '      with "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period" InitialBPHDiagnosis\n' +
    '        such that UrinaryRetention.toPrevalenceInterval() starts 1 year or less on or after day of start of InitialBPHDiagnosis.toPrevalenceInterval()\n' +
    '      where UrinaryRetention.isConfirmedActiveDiagnosis()\n' +
    '\n' +
    'define "Urinary Symptom Score 6 to 12 Months After Initial BPH Diagnosis":\n' +
    '  Last("Urinary Symptom Score Assessment" USSAssessment\n' +
    '          with "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period" InitialBPHDiagnosis\n' +
    '              such that months between start of InitialBPHDiagnosis.toPrevalenceInterval() and USSAssessment.effectiveDatetime in Interval[6, 12]\n' +
    '          sort by effectiveDatetime\n' +
    '      )\n' +
    '      \n' +
    'define "Urinary Symptom Score Assessment":\n' +
    '  "Documented IPSS Assessment Result"\n' +
    '      union "AUA Symptom Index and Quality of Life Assessment Result"\n' +
    '\n' +
    'define "Urinary Symptom Score Change":\n' +
    '  from\n' +
    '      "Urinary Symptom Score Within 1 Month after Initial BPH Diagnosis" FirstUSSAssessment,\n' +
    '      "Urinary Symptom Score 6 to 12 Months After Initial BPH Diagnosis" FollowUpUSSAssessment\n' +
    '      let USSChange: ( FirstUSSAssessment.valueInteger ) - ( FollowUpUSSAssessment.valueInteger )\n' +
    '      return USSChange\n' +
    '\n' +
    'define "Has Urinary Symptom Score Improvement Greater Than or Equal To 3":\n' +
    '  ( "Urinary Symptom Score Change" USSImprovement\n' +
    '      where USSImprovement >= 3\n' +
    '    ) is not null\n' +
    '\n' +
    'define "Urinary Symptom Score Within 1 Month after Initial BPH Diagnosis":\n' +
    '  First("Urinary Symptom Score Assessment" USSAssessment\n' +
    '          with "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period" InitialBPHDiagnosis\n' +
    '              such that USSAssessment.effectiveDatetime 1 month or less on or after day of start of InitialBPHDiagnosis.toPrevalenceInterval()\n' +
    '          sort by effectiveDatetime\n' +
    '         )\n' +
    '         \n' +
    'define "Initial BPH Diagnosis Starts Within 6 Months Before or After Start of Measurement Period":\n' +
    '  First([Condition: "Benign prostatic hyperplasia with lower urinary tract symptoms"] NewBPHDiagnosis\n' +
    '            //issue in MADiE related to timing for Measurement Period that is being resolved\n' +
    '            //This is tied to a documented known issue - refer to https://oncprojectracking.healthit.gov/support/browse/BONNIEMAT-1363\n' +
    '          where NewBPHDiagnosis.toPrevalenceInterval() starts during day of Interval[start of "Measurement Period" - 6 months, end of "Measurement Period"] \n' +
    '            and NewBPHDiagnosis.isConfirmedActiveDiagnosis()\n' +
    '          sort by start of onset.toInterval()\n' +
    '        )\n' +
    '        \n' +
    'define fluent function isConfirmedActiveDiagnosis(Condition Condition):\n' +
    '  ( Condition Diagnosis\n' +
    '    where Diagnosis.clinicalStatus ~ QICoreCommon."active"\n' +
    '        and not ( Diagnosis.verificationStatus ~ QICoreCommon."unconfirmed"\n' +
    '                     or Diagnosis.verificationStatus ~ QICoreCommon."refuted"\n' +
    '                     or Diagnosis.verificationStatus ~ QICoreCommon."entered-in-error" )\n' +
    '    ) is not null'

describe('FHIR Measure Export for Proportion Patient Measure with QI-Core Profile types', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Numerator', '', 'Denominator', 'boolean')
        OktaLogin.Login()

    })

    it('Validate the zip file Export is downloaded and can be unzipped', () => {

        MeasuresPage.measureAction('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionTextBox).clear().type('Percentage of cataract surgeries for patients aged 18 and older with a diagnosis of uncomplicated cataract and no significant ocular conditions impacting the visual outcome of surgery and had best-corrected visual acuity of 20/40 or better (distance or near) achieved in the operative eye within 90 days following the cataract surgery')
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')

        //Copyright
        cy.get(EditMeasurePage.leftPanelCopyright).click()
        cy.get(EditMeasurePage.measureCopyrightTextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureCopyrightSaveButton).click()
        cy.get(EditMeasurePage.measureCopyrightSuccessMessage).should('be.visible')

        //Disclaimer
        cy.get(EditMeasurePage.leftPanelDisclaimer).click()
        cy.get(EditMeasurePage.measureDisclaimerTextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureDisclaimerSaveButton).click()
        cy.get(EditMeasurePage.measureDisclaimerSuccessMessage).should('be.visible')

        //Rationale
        cy.get(EditMeasurePage.leftPanelRationale).click()
        cy.get(EditMeasurePage.measureRationaleTextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
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
        cy.get(EditMeasurePage.measureGuidanceTextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureGuidanceSaveButton).click()
        cy.get(EditMeasurePage.measureGuidanceSuccessMessage).should('be.visible')

        //Clinical Recommendation
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).clear().type('Test!@#$%^&*()_+-={}|`~[]\:"<>?;\',./~`')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')

        cy.get(Header.measures).click().wait(1000)

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.versionMeasuresSelectionButton).click()
        cy.get(MeasuresPage.measureVersionMajor).should('exist')
        cy.get(MeasuresPage.measureVersionMajor).click()

        cy.get(MeasuresPage.confirmMeasureVersionNumber).should('exist')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.measureAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
        console.log('Successfully verified zip file export')

        OktaLogin.Logout()

    })

    it('Unzip the downloaded file and verify file types', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
                console.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip')).should('contain', 'eCQMTitle-v1.0.000-FHIR.html' &&
            'eCQMTitle-v1.0.000-FHIR.xml' && 'eCQMTitle-v1.0.000-FHIR.json', { timeout: 500000 })

    })
})
