import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let measureCQLPFTests = MeasureCQL.CQL_Populations
let measureCQLDFUTests = MeasureCQL.CQLDFN_value
let measureCQLResults = MeasureCQL.CQLHLResults_value
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let tcDFNJson = TestCaseJson.tcJson_value
let tcResultJson = TestCaseJson.tcResultsJson
let measureCQL_withDuplicateLibraryDefinition = 'library Library7027567898767 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include CQMCommon version \'2.1.000\' called CQMCommon\n' +
    'include QICoreCommon version \'2.1.000\' called QICoreCommon\n' +
    'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
    'include TJCOverall version \'8.13.000\' called TJC\n' +
    'include VTE version \'8.7.000\' called VTE\n' +
    '\n' +
    'codesystem "LOINC": \'http://loinc.org\' \n' +
    '\n' +
    'valueset "Application of Graduated Compression Stockings":\'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.66\'\n' +
    'valueset "Application of Intermittent Pneumatic Compression Devices": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.65\'\n' +
    'valueset "Application of Venous Foot Pumps": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.64\'\n' +
    'valueset "Atrial Fibrillation or Flutter": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.202\' \n' +
    'valueset "Comfort Measures": \'http://cts.nlm.nih.gov/fhir/ValueSet/1.3.6.1.4.1.33895.1.3.0.45\'\n' +
    'valueset "Direct Thrombin Inhibitor": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.205\' \n' +
    'valueset "Emergency Department Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "General or Neuraxial Anesthesia": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.1743\' \n' +
    'valueset "General Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.255\' \n' +
    'valueset "Glycoprotein IIb/IIIa Inhibitors": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.41\' \n' +
    'valueset "Graduated compression stockings": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.256\' \n' +
    'valueset "Gynecological Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.257\'\n' +
    'valueset "Hemorrhagic Stroke": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.212\'\n' +
    'valueset "Ischemic Stroke": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.247\'\n' +
    'valueset "Hip Fracture Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.258\' \n' +
    'valueset "Hip Replacement Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.259\' \n' +
    'valueset "Injectable Factor Xa Inhibitor for VTE Prophylaxis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.211\' \n' +
    'valueset "INR": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.213\' \n' +
    'valueset "Intensive Care Unit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1029.206\' \n' +
    'valueset "Intermittent pneumatic compression devices": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.214\' \n' +
    'valueset "Intracranial Neurosurgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.260\' \n' +
    'valueset "Intravenous route": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.222\' \n' +
    'valueset "Knee Replacement Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.261\' \n' +
    'valueset "Low Dose Unfractionated Heparin for VTE Prophylaxis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.39\' \n' +
    'valueset "Low Molecular Weight Heparin for VTE Prophylaxis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.219\' \n' +
    'valueset "Low Risk": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.400\' \n' +
    'valueset "Medical Reason For Not Providing Treatment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.473\' \n' +
    'valueset "Mental Health Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.105.12.1004\' \n' +
    'valueset "Obstetrical or Pregnancy Related Conditions": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.263\' \n' +
    'valueset "Obstetrics VTE": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.264\' \n' +
    'valueset "Oral Factor Xa Inhibitor for VTE Prophylaxis or VTE Treatment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.134\' \n' +
    'valueset "Patient Refusal": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.93\' \n' +
    'valueset "Rivaroxaban for VTE Prophylaxis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.50\' \n' +
    'valueset "Subcutaneous route": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.223\' \n' +
    'valueset "Unfractionated Heparin": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.218\' \n' +
    'valueset "Urological Surgery": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.272\' \n' +
    'valueset "Venous foot pumps": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.230\' \n' +
    'valueset "Venous Thromboembolism": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.279\' \n' +
    'valueset "Warfarin": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.232\'\n' +
    '\n' +
    'code "Risk for venous thromboembolism": \'72136-5\' from "LOINC" display \'Risk for venous thromboembolism\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
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
    '\n' +
    'define "Initial Population":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions"\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  "Encounter Less Than 2 Days"\n' +
    '      union "Encounter with ICU Location Stay 1 Day or More"\n' +
    '      union "Encounter with Principal Diagnosis of Mental Disorder or Stroke"\n' +
    '      union "Encounter with Principal Procedure of SCIP VTE Selected Surgery"\n' +
    '      union "Encounter with Intervention Comfort Measures From Day of Start of Hospitalization To Day After Admission"\n' +
    '      union "Encounter with Intervention Comfort Measures on Day of or Day After Procedure"\n' +
    '\n' +
    'define "Encounter Less Than 2 Days":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '        where QualifyingEncounter.period.lengthInDays () < 2\n' +
    '\n' +
    'define "Encounter with ICU Location Stay 1 Day or More":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '      where exists ( QualifyingEncounter.location Location\n' +
    '          where Location.location.getLocation ().type in "Intensive Care Unit"\n' +
    '            and Location.period.lengthInDays () >= 1\n' +
    '            and Location.period starts on or after start of QualifyingEncounter.period\n' +
    '            and date from (start of Location.period) during (start of QualifyingEncounter.period).CalendarDayOfOrDayAfter()\n' +
    '      )\n' +
    '\n' +
    'define "Encounter with Principal Diagnosis of Mental Disorder or Stroke":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '        where QualifyingEncounter.principalDiagnosis().code in "Mental Health Diagnoses"\n' +
    '          or QualifyingEncounter.principalDiagnosis().code in "Hemorrhagic Stroke"\n' +
    '            or QualifyingEncounter.principalDiagnosis().code in "Ischemic Stroke"\n' +
    '\n' +
    'define "SCIP VTE Selected Surgery":\n' +
    '  (\t["Procedure": "General Surgery"]\n' +
    '        union ["Procedure": "Gynecological Surgery"]\n' +
    '        union ["Procedure": "Hip Fracture Surgery"]\n' +
    '        union ["Procedure": "Hip Replacement Surgery"]\n' +
    '        union ["Procedure": "Intracranial Neurosurgery"]\n' +
    '        union ["Procedure": "Knee Replacement Surgery"]\n' +
    '        union ["Procedure": "Urological Surgery"] ) Procedure\n' +
    '        where Procedure.status = \'completed\'\n' +
    '\n' +
    'define "Encounter with Principal Procedure of SCIP VTE Selected Surgery":\n' +
    '    from\n' +
    '      VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '      "SCIP VTE Selected Surgery" SelectedProcedure\n' +
    '      let EncounterProcedure: singleton from (QualifyingEncounter.procedure P where P.rank = 1)\n' +
    '      where EncounterProcedure.procedure.reference.getId() = SelectedProcedure.id\n' +
    '        and end of SelectedProcedure.performed.toInterval () during QualifyingEncounter.period\n' +
    '      return QualifyingEncounter\n' +
    '\n' +
    'define "Intervention Comfort Measures":\n' +
    '  ( ["ServiceRequest": "Comfort Measures"] InterventionRequest\n' +
    '      where InterventionRequest.intent in { \'order\', \'original-order\', \'reflex-order\', \'filler-order\', \'instance-order\' }\n' +
    '      and InterventionRequest.status in { \'active\', \'on-hold\', \'completed\'}\n' +
    '      and InterventionRequest.doNotPerform is not true\n' +
    '  )\n' +
    '    union ( ["Procedure": "Comfort Measures"] InterventionPerformed\n' +
    '        where InterventionPerformed.status in { \'completed\', \'in-progress\' }\n' +
    '    )\n' +
    'define "Encounter with Intervention Comfort Measures on Day of or Day After Procedure":\n' +
    '  from\n' +
    '      VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '      ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '      "Intervention Comfort Measures" ComfortMeasure\n' +
    '      where AnesthesiaProcedure.status = \'completed\'\n' +
    '        and AnesthesiaProcedure.performed.toInterval( ) ends 1 day after day of start of QualifyingEncounter.period\n' +
    '        and Coalesce(start of ComfortMeasure.performed.toInterval(), ComfortMeasure.authoredOn)during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '      return QualifyingEncounter\n' +
    '\n' +
    'define "Encounter with Intervention Comfort Measures From Day of Start of Hospitalization To Day After Admission":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '      with "Intervention Comfort Measures" ComfortMeasure\n' +
    '        such that Coalesce(start of ComfortMeasure.performed.toInterval(), ComfortMeasure.authoredOn)during day of QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '\n' +
    'define "Numerator":\n' +
    '  "Encounter with VTE Prophylaxis Received From Day of Start of Hospitalization To Day After Admission or Procedure"\n' +
    '      union ( "Encounter with Medication Oral Factor Xa Inhibitor Administered on Day of or Day After Admission or Procedure"\n' +
    '                   intersect ( "Encounter with Prior or Present Diagnosis of Atrial Fibrillation or Prior Diagnosis of VTE"\n' +
    '                                  union "Encounter with Prior or Present Procedure of Hip or Knee Replacement Surgery"\n' +
    '                               )\n' +
    '              )\n' +
    '      union "Encounter with Low Risk for VTE or Anticoagulant Administered"\n' +
    '      union "Encounter with No VTE Prophylaxis Due to Medical Reason"\n' +
    '      union "Encounter with No VTE Prophylaxis Due to Patient Refusal"\n' +
    '\n' +
    'define "Pharmacological or Mechanical VTE Prophylaxis Received":\n' +
    '  ( ["MedicationAdministration": "Low Dose Unfractionated Heparin for VTE Prophylaxis"] VTEMedication\n' +
    '           where VTEMedication.status =\'completed\'\n' +
    '                and VTEMedication.dosage.route in "Subcutaneous route"\n' +
    '    )\n' +
    '  union (["MedicationAdministration": "Low Molecular Weight Heparin for VTE Prophylaxis"] LMWH where LMWH.status = \'completed\')\n' +
    '  union (["MedicationAdministration": "Injectable Factor Xa Inhibitor for VTE Prophylaxis"] FactorXa where FactorXa.status = \'completed\')\n' +
    '  union (["MedicationAdministration": "Warfarin"] Warfarin where Warfarin.status = \'completed\')\n' +
    '  union (["MedicationAdministration": "Rivaroxaban for VTE Prophylaxis"] Rivaroxaban where Rivaroxaban.status = \'completed\')\n' +
    '  union (\n' +
    '          (["Procedure": "Application of Intermittent Pneumatic Compression Devices"] \n' +
    '           union ["Procedure": "Application of Venous Foot Pumps"] \n' +
    '           union ["Procedure": "Application of Graduated Compression Stockings"] \n' +
    '           ) DeviceApplied\n' +
    '              where DeviceApplied.status = \'completed\'\n' +
    '         )\n' +
    '\n' +
    'define "Encounter with VTE Prophylaxis Received From Day of Start of Hospitalization To Day After Admission or Procedure":\n' +
    '  ( from\n' +
    '        VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '        "Pharmacological or Mechanical VTE Prophylaxis Received" VTEProphylaxis\n' +
    '        where Coalesce(VTEProphylaxis.effective.toInterval(), VTEProphylaxis.performed.toInterval())starts during day of  QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '        return QualifyingEncounter\n' +
    '    )\n' +
    '      union ( from\n' +
    '          VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '          ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '          "Pharmacological or Mechanical VTE Prophylaxis Received" VTEProphylaxis\n' +
    '          where AnesthesiaProcedure.status = \'completed\'\n' +
    '            and  AnesthesiaProcedure.performed .toInterval() ends 1 day after day of start of QualifyingEncounter.period\n' +
    '            and Coalesce(VTEProphylaxis.effective.toInterval(), VTEProphylaxis.performed.toInterval()) starts during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '          return QualifyingEncounter\n' +
    '      )\n' +
    '\n' +
    'define "Encounter with Medication Oral Factor Xa Inhibitor Administered on Day of or Day After Admission or Procedure":\n' +
    '  ( from\n' +
    '        VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '        ["MedicationAdministration": "Oral Factor Xa Inhibitor for VTE Prophylaxis or VTE Treatment"] FactorXaMedication\n' +
    '        where FactorXaMedication.status = \'completed\'\n' +
    '          and FactorXaMedication.effective.toInterval() starts during day of (start of QualifyingEncounter.period).CalendarDayOfOrDayAfter()\n' +
    '        return QualifyingEncounter\n' +
    '    )\n' +
    '      union ( from\n' +
    '          VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '          ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '          ["MedicationAdministration": "Oral Factor Xa Inhibitor for VTE Prophylaxis or VTE Treatment"] FactorXaMedication\n' +
    '          where FactorXaMedication.status = \'completed\'\n' +
    '            and AnesthesiaProcedure.status = \'completed\'\n' +
    '            and AnesthesiaProcedure.performed.toInterval() ends 1 day after day of start of QualifyingEncounter.period\n' +
    '            and FactorXaMedication.effective.toInterval() starts during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '          return QualifyingEncounter\n' +
    '      )\n' +
    '\n' +
    'define "Encounter with Prior or Present Diagnosis of Atrial Fibrillation or Prior Diagnosis of VTE":\n' +
    '  ( VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '          with ["Condition": "Atrial Fibrillation or Flutter"] AtrialFibrillation\n' +
    '            such that AtrialFibrillation.isActive()\n' +
    '              and AtrialFibrillation.verificationStatus is not null and AtrialFibrillation.verificationStatus  ~ QICoreCommon."confirmed"\n' +
    '              and AtrialFibrillation.onset.toInterval() starts on or before \n' +
    '              end of QualifyingEncounter.period\n' +
    '      )\n' +
    '        union ( VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '            where  QualifyingEncounter.encounterDiagnosis ().code in "Atrial Fibrillation or Flutter"\n' +
    '        )\n' +
    '        union ( VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '            with ["Condition": "Venous Thromboembolism"] VTEDiagnosis\n' +
    '              such that ( VTEDiagnosis.clinicalStatus  ~ QICoreCommon."inactive"\n' +
    '                    or VTEDiagnosis.clinicalStatus  ~ QICoreCommon."remission"\n' +
    '                    or  VTEDiagnosis.clinicalStatus ~ QICoreCommon."resolved"\n' +
    '              )\n' +
    '               and VTEDiagnosis.verificationStatus is not null and VTEDiagnosis.verificationStatus ~ QICoreCommon."confirmed"\n' +
    '              and VTEDiagnosis.onset.toInterval() before start of QualifyingEncounter.period\n' +
    '        )\n' +
    '\n' +
    'define "Encounter with Prior or Present Procedure of Hip or Knee Replacement Surgery":\n' +
    '    VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '    with ( ["Procedure": "Hip Replacement Surgery"]\n' +
    '            union ["Procedure": "Knee Replacement Surgery"] ) HipKneeProcedure\n' +
    '  such that HipKneeProcedure.status = \'completed\'\n' +
    '        and HipKneeProcedure.performed.toInterval() starts on or before end of QualifyingEncounter.period\n' +
    '\n' +
    'define "Encounter with Low Risk for VTE or Anticoagulant Administered":\n' +
    '  "Low Risk for VTE or Anticoagulant Administered From Day of Start of Hospitalization To Day After Admission"\n' +
    '      union "Low Risk for VTE or Anticoagulant Administered on Day of or Day After Procedure"\n' +
    '\n' +
    'define "Low Risk Indicator For VTE":\n' +
    '  ( ["Observation": "Risk for venous thromboembolism"] VTERiskAssessment\n' +
    '      where  VTERiskAssessment.value as Concept in "Low Risk"\n' +
    '        and VTERiskAssessment.status in { \'final\', \'amended\', \'corrected\' }\n' +
    '      return {\n' +
    '        id: VTERiskAssessment.id,\n' +
    '        LowRiskDatetime: VTERiskAssessment.effective.earliest()\n' +
    '      }\n' +
    '  )\n' +
    '    union ( ["US Core Laboratory Result Observation Profile": "INR"] INRLabTest\n' +
    '        where  INRLabTest.value as Quantity > 3.0 \n' +
    '          and INRLabTest.status in { \'final\', \'amended\', \'corrected\' }\n' +
    '        return  { \n' +
    '          id: INRLabTest.id, \n' +
    '          LowRiskDatetime: INRLabTest.issued }\n' +
    '    )\n' +
    '    union ( ( ( ["MedicationAdministration": "Unfractionated Heparin"] UnfractionatedHeparin\n' +
    '          where UnfractionatedHeparin.dosage.route in "Intravenous route"\n' +
    '      )\n' +
    '        union ["MedicationAdministration": "Direct Thrombin Inhibitor"]\n' +
    '        union ["MedicationAdministration": "Glycoprotein IIb/IIIa Inhibitors"] ) AnticoagulantMedication\n' +
    '        where AnticoagulantMedication.status = \'completed\'\n' +
    '        return { \n' +
    '          id: AnticoagulantMedication.id, \n' +
    '          LowRiskDatetime: start of AnticoagulantMedication.effective.toInterval() }\n' +
    '    )\n' +
    '\n' +
    'define "Low Risk for VTE or Anticoagulant Administered From Day of Start of Hospitalization To Day After Admission":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '    with "Low Risk Indicator For VTE" LowRiskForVTE\n' +
    '      such that LowRiskForVTE.LowRiskDatetime during day of QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '\n' +
    'define "Low Risk for VTE or Anticoagulant Administered on Day of or Day After Procedure":\n' +
    '  from\n' +
    '    VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '    ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '    "Low Risk Indicator For VTE" LowRiskForVTE\n' +
    '    where AnesthesiaProcedure.status = \'completed\'\n' +
    '      and AnesthesiaProcedure.performed.toInterval() ends 1 day after day of start of QualifyingEncounter.period\n' +
    '      and LowRiskForVTE.LowRiskDatetime during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '    return QualifyingEncounter\n' +
    '\n' +
    'define "Encounter with No VTE Prophylaxis Due to Medical Reason":\n' +
    '  ( "No VTE Prophylaxis Medication Due to Medical Reason From Day of Start of Hospitalization To Day After Admission"\n' +
    '    intersect "No Mechanical VTE Prophylaxis Due to Medical Reason From Day of Start of Hospitalization To Day After Admission"\n' +
    ')\n' +
    '  union ( "No VTE Prophylaxis Medication Due to Medical Reason on Day of or Day After Procedure"\n' +
    '      intersect "No Mechanical VTE Prophylaxis Due to Medical Reason on Day of or Day After Procedure"\n' +
    '  )\n' +
    '\n' +
    'define "No VTE Prophylaxis Medication Due to Medical Reason From Day of Start of Hospitalization To Day After Admission":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '                with "No VTE Prophylaxis Medication Administered or Ordered" NoVTEMedication\n' +
    '                  such that NoVTEMedication.MedicationStatusReason in "Medical Reason For Not Providing Treatment"\n' +
    '                    and NoVTEMedication.authoredOn during day of QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '\n' +
    'define "No VTE Prophylaxis Medication Administered or Ordered":\n' +
    '  ( ( [MedicationAdministrationNotDone: "Low Dose Unfractionated Heparin for VTE Prophylaxis"]\n' +
    '       union [MedicationAdministrationNotDone: "Low Molecular Weight Heparin for VTE Prophylaxis"]\n' +
    '        union [MedicationAdministrationNotDone: "Injectable Factor Xa Inhibitor for VTE Prophylaxis"]\n' +
    '        union [MedicationAdministrationNotDone: "Warfarin"]\n' +
    '        union [MedicationAdministrationNotDone: "Rivaroxaban for VTE Prophylaxis"] ) NoMedicationAdm\n' +
    '        return {\n' +
    '          id: NoMedicationAdm.id,\n' +
    '          MedicationStatusReason: NoMedicationAdm.statusReason,\n' +
    '          authoredOn: NoMedicationAdm.recorded\n' +
    '        }\n' +
    '    )\n' +
    '      union ( ( ["MedicationNotRequested": "Low Dose Unfractionated Heparin for VTE Prophylaxis"]\n' +
    '          union ["MedicationNotRequested": "Low Molecular Weight Heparin for VTE Prophylaxis"]\n' +
    '          union ["MedicationNotRequested": "Injectable Factor Xa Inhibitor for VTE Prophylaxis"]\n' +
    '          union ["MedicationNotRequested": "Warfarin"]\n' +
    '          union ["MedicationNotRequested": "Rivaroxaban for VTE Prophylaxis"]) NoMedicationOrder\n' +
    '          where NoMedicationOrder.intent in { \'order\', \'original-order\', \'reflex-order\', \'filler-order\', \'instance-order\' }\n' +
    '         return {\n' +
    '            id: NoMedicationOrder.id,\n' +
    '            MedicationStatusReason: NoMedicationOrder.reasonCode,\n' +
    '            authoredOn: NoMedicationOrder.authoredOn\n' +
    '          }\n' +
    '      )\n' +
    '\n' +
    'define "No Mechanical VTE Prophylaxis Due to Medical Reason From Day of Start of Hospitalization To Day After Admission":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '      with "No Mechanical VTE Prophylaxis Performed or Ordered" NoVTEDevice\n' +
    '      such that NoVTEDevice.requestStatusReason in "Medical Reason For Not Providing Treatment"\n' +
    '             and  NoVTEDevice.authoredOn during day of QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '\n' +
    'define "No Mechanical VTE Prophylaxis Performed or Ordered":\n' +
    '  ( ( [ServiceNotRequested: "Venous foot pumps"]\n' +
    '      union [ServiceNotRequested: "Intermittent pneumatic compression devices"]\n' +
    '      union [ServiceNotRequested: "Graduated compression stockings"] ) DeviceNotOrder\n' +
    '      where DeviceNotOrder.intent in { \'order\', \'original-order\', \'reflex-order\', \'filler-order\', \'instance-order\' }\n' +
    '      return {\n' +
    '        id: DeviceNotOrder.id,\n' +
    '        requestStatusReason: DeviceNotOrder.reasonRefused,\n' +
    '        authoredOn: DeviceNotOrder.authoredOn\n' +
    '      }\n' +
    '  )\n' +
    '   union ( ([ProcedureNotDone: "Application of Intermittent Pneumatic Compression Devices"] \n' +
    '                  union [ProcedureNotDone: "Application of Venous Foot Pumps"] \n' +
    '                  union [ProcedureNotDone: "Application of Graduated Compression Stockings"]) DeviceNotApplied\n' +
    '        let DeviceNotDoneTiming: DeviceNotApplied.recorded\n' +
    '        return {\n' +
    '          id: DeviceNotApplied.id,\n' +
    '          requestStatusReason: DeviceNotApplied.statusReason,\n' +
    '          authoredOn: DeviceNotDoneTiming\n' +
    '        }\n' +
    '    )\n' +
    '\n' +
    'define "No VTE Prophylaxis Medication Due to Medical Reason on Day of or Day After Procedure":\n' +
    '  from\n' +
    '      VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '      ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '      "No VTE Prophylaxis Medication Administered or Ordered" NoVTEMedication\n' +
    '      where NoVTEMedication.MedicationStatusReason in "Medical Reason For Not Providing Treatment"\n' +
    '        and AnesthesiaProcedure.status = \'completed\'\n' +
    '        and  AnesthesiaProcedure.performed.toInterval() ends 1 day after day of start of QualifyingEncounter.period\n' +
    '        and NoVTEMedication.authoredOn during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '      return QualifyingEncounter \n' +
    '\n' +
    ' define "No Mechanical VTE Prophylaxis Due to Medical Reason on Day of or Day After Procedure":\n' +
    '  from\n' +
    '      VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '      ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '      "No Mechanical VTE Prophylaxis Performed or Ordered" NoVTEDevice\n' +
    '      where NoVTEDevice.requestStatusReason in "Medical Reason For Not Providing Treatment"\n' +
    '        and AnesthesiaProcedure.status = \'completed\'\n' +
    '        and  AnesthesiaProcedure.performed.toInterval() ends 1 day after day of start of QualifyingEncounter.period\n' +
    '        and NoVTEDevice.authoredOn during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '      return QualifyingEncounter      \n' +
    '\n' +
    'define "Encounter with No VTE Prophylaxis Due to Patient Refusal":\n' +
    '  "No VTE Prophylaxis Due to Patient Refusal From Day of Start of Hospitalization To Day After Admission"\n' +
    '     \tunion "No VTE Prophylaxis Due to Patient Refusal on Day of or Day After Procedure"\n' +
    '\n' +
    'define "No VTE Prophylaxis Due to Patient Refusal From Day of Start of Hospitalization To Day After Admission":\n' +
    '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter\n' +
    '    with "No Mechanical or Pharmacological VTE Prophylaxis Due to Patient Refusal" PatientRefusal\n' +
    '    such that PatientRefusal.authoredOn during day of QualifyingEncounter.FromDayOfStartOfHospitalizationToDayAfterAdmission()\n' +
    '\n' +
    'define "No Mechanical or Pharmacological VTE Prophylaxis Due to Patient Refusal":\n' +
    '  ( "No VTE Prophylaxis Medication Administered or Ordered" NoVTEMedication\n' +
    '                  where NoVTEMedication.MedicationStatusReason in "Patient Refusal"\n' +
    '              )\n' +
    '                union ( "No Mechanical VTE Prophylaxis Performed or Ordered" NoVTEDevice\n' +
    '                    where NoVTEDevice.requestStatusReason in "Patient Refusal"\n' +
    '                )\n' +
    '\n' +
    'define "No VTE Prophylaxis Due to Patient Refusal on Day of or Day After Procedure":\n' +
    '  from\n' +
    '      VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions" QualifyingEncounter,\n' +
    '      ["Procedure": "General or Neuraxial Anesthesia"] AnesthesiaProcedure,\n' +
    '      "No Mechanical or Pharmacological VTE Prophylaxis Due to Patient Refusal" PatientRefusal\n' +
    '      where AnesthesiaProcedure.status = \'completed\'\n' +
    '        and QICoreCommon."ToInterval" ( AnesthesiaProcedure.performed ) ends 1 day after day of start of QualifyingEncounter.period\n' +
    '        and PatientRefusal.authoredOn during day of (end of AnesthesiaProcedure.performed.toInterval()).CalendarDayOfOrDayAfter()\n' +
    '      return QualifyingEncounter'
    
let tcJson = '{\n' +
    '  "resourceType": "Bundle",\n' +
    '  "id": "612e6f6e02c62a011f2f1d45",\n' +
    '  "type": "collection",\n' +
    '  "entry": [\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Patient/ebfee8cd-fd6f-44e8-aa37-7ba62a3f4450",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Patient",\n' +
    '        "id": "ebfee8cd-fd6f-44e8-aa37-7ba62a3f4450",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
    '          ]\n' +
    '        },\n' +
    '        "text": {\n' +
    '          "status": "generated",\n' +
    '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">DAVFPDayOfICUWICULOSEQ0Day<b>NUMERPASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>f9dd0d7a6a9f775928ab2c47f31bfdd50dfc6c91e6f0b0e678b3985354333a28</td></tr><tr><td>Date of birth</td><td><span>03 March 1974</span></td></tr></tbody></table></div>"\n' +
    '        },\n' +
    '        "extension": [\n' +
    '          {\n' +
    '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",\n' +
    '            "extension": [\n' +
    '              {\n' +
    '                "url": "ombCategory",\n' +
    '                "valueCoding": {\n' +
    '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
    '                  "code": "1002-5",\n' +
    '                  "display": "American Indian or Alaska Native",\n' +
    '                  "userSelected": true\n' +
    '                }\n' +
    '              },\n' +
    '              {\n' +
    '                "url": "text",\n' +
    '                "valueString": "American Indian or Alaska Native"\n' +
    '              }\n' +
    '            ]\n' +
    '          },\n' +
    '          {\n' +
    '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",\n' +
    '            "extension": [\n' +
    '              {\n' +
    '                "url": "ombCategory",\n' +
    '                "valueCoding": {\n' +
    '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
    '                  "code": "2135-2",\n' +
    '                  "display": "Hispanic or Latino",\n' +
    '                  "userSelected": true\n' +
    '                }\n' +
    '              },\n' +
    '              {\n' +
    '                "url": "text",\n' +
    '                "valueString": "Hispanic or Latino"\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "type": {\n' +
    '              "coding": [\n' +
    '                {\n' +
    '                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
    '                  "code": "MR"\n' +
    '                }\n' +
    '              ]\n' +
    '            },\n' +
    '            "system": "https://bonnie-fhir.healthit.gov/",\n' +
    '            "value": "612e6f6e02c62a011f2f1d45"\n' +
    '          }\n' +
    '        ],\n' +
    '        "active": true,\n' +
    '        "name": [\n' +
    '          {\n' +
    '            "use": "usual",\n' +
    '            "family": "NUMERPass",\n' +
    '            "given": [\n' +
    '              "DAVFPDayOfICUWICULOSEQ0Day"\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "gender": "female",\n' +
    '        "birthDate": "1974-03-03"\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Encounter/5ce80971b848467c29eaf2c1",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Encounter",\n' +
    '        "id": "5ce80971b848467c29eaf2c1",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
    '          ]\n' +
    '        },\n' +
    '        "status": "finished",\n' +
    '        "class": {\n' +
    '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
    '          "code": "IMP",\n' +
    '          "display": "inpatient encounter"\n' +
    '        },\n' +
    '        "type": [\n' +
    '          {\n' +
    '            "coding": [\n' +
    '              {\n' +
    '                "system": "http://snomed.info/sct",\n' +
    '                "code": "183452005"\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "subject": {\n' +
    '          "reference": "Patient/ebfee8cd-fd6f-44e8-aa37-7ba62a3f4450"\n' +
    '        },\n' +
    '        "period": {\n' +
    '          "start": "2025-03-22T08:00:00+00:00",\n' +
    '          "end": "2025-03-26T08:15:00+00:00"\n' +
    '        },\n' +
    '        "length": {\n' +
    '          "value": 4,\n' +
    '          "unit": "days"\n' +
    '        },\n' +
    '        "location": [\n' +
    '          {\n' +
    '            "location": {\n' +
    '              "reference": "Location/intensive-care-unit-0a0e"\n' +
    '            },\n' +
    '            "period": {\n' +
    '              "start": "2025-03-22T08:15:00.000+00:00",\n' +
    '              "end": "2025-03-22T19:00:00.000+00:00"\n' +
    '            }\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Coverage/5fa041081c76ba66d995910b",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Coverage",\n' +
    '        "id": "5fa041081c76ba66d995910b",\n' +
    '        "status": "active",\n' +
    '        "beneficiary": {\n' +
    '          "reference": "Patient/ebfee8cd-fd6f-44e8-aa37-7ba62a3f4450"\n' +
    '        },\n' +
    '        "period": {\n' +
    '          "start": "1974-03-03T08:00:00+00:00"\n' +
    '        },\n' +
    '        "payor": [\n' +
    '          {\n' +
    '            "reference": "Organization/123456"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Location/intensive-care-unit-0a0e",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Location",\n' +
    '        "id": "intensive-care-unit-0a0e",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"\n' +
    '          ]\n' +
    '        },\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "use": "usual",\n' +
    '            "system": "http://exampleoflocation.com",\n' +
    '            "value": "B1-S.F2"\n' +
    '          }\n' +
    '        ],\n' +
    '        "name": "Medical Surgical East, first floor",\n' +
    '        "type": [\n' +
    '          {\n' +
    '            "coding": [\n' +
    '              {\n' +
    '                "system": "https://www.cdc.gov/nhsn/cdaportal/terminology/codesystem/hsloc.html",\n' +
    '                "code": "1025-6",\n' +
    '                "display": "Trauma Critical Care",\n' +
    '                "userSelected": true\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Location/intensive-care-unit-0a0f",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Location",\n' +
    '        "id": "intensive-care-unit-0a0f",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"\n' +
    '          ]\n' +
    '        },\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "use": "usual",\n' +
    '            "system": "http://exampleoflocation.com",\n' +
    '            "value": "B1-S.F2"\n' +
    '          }\n' +
    '        ],\n' +
    '        "name": "Medical Surgical East, first floor",\n' +
    '        "type": [\n' +
    '          {\n' +
    '            "coding": [\n' +
    '              {\n' +
    '                "system": "https://www.cdc.gov/nhsn/cdaportal/terminology/codesystem/hsloc.html",\n' +
    '                "code": "1025-6",\n' +
    '                "display": "Trauma Critical Care",\n' +
    '                "userSelected": true\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Procedure/device-application-0a10",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Procedure",\n' +
    '        "id": "device-application-0a10",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-procedure"\n' +
    '          ]\n' +
    '        },\n' +
    '        "extension": [\n' +
    '          {\n' +
    '            "url": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-recorded",\n' +
    '            "valueDateTime": "2025-03-26T09:35:00-04:00"\n' +
    '          }\n' +
    '        ],\n' +
    '        "status": "completed",\n' +
    '        "code": {\n' +
    '          "coding": [\n' +
    '            {\n' +
    '              "system": "http://snomed.info/sct",\n' +
    '              "code": "424831005",\n' +
    '              "display": "Application of foot pump (procedure)"\n' +
    '            }\n' +
    '          ]\n' +
    '        },\n' +
    '        "subject": {\n' +
    '          "reference": "Patient/ebfee8cd-fd6f-44e8-aa37-7ba62a3f4450"\n' +
    '        },\n' +
    '        "performedPeriod": {\n' +
    '          "start": "2025-03-22T08:20:00.000+00:00",\n' +
    '          "end": "2025-03-22T08:25:00.000+00:00"\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Organization/123456",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Organization",\n' +
    '        "id": "123456",\n' +
    '        "meta": {\n' +
    '          "profile": [\n' +
    '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-organization"\n' +
    '          ]\n' +
    '        },\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "use": "temp",\n' +
    '            "system": "urn:oid:2.16.840.1.113883.4.4",\n' +
    '            "value": "21-3259825"\n' +
    '          }\n' +
    '        ],\n' +
    '        "active": true,\n' +
    '        "type": [\n' +
    '          {\n' +
    '            "coding": [\n' +
    '              {\n' +
    '                "system": "http://terminology.hl7.org/CodeSystem/organization-type",\n' +
    '                "code": "pay",\n' +
    '                "display": "Payer"\n' +
    '              }\n' +
    '            ]\n' +
    '          }\n' +
    '        ],\n' +
    '        "name": "Blue Cross Blue Shield of Texas",\n' +
    '        "telecom": [\n' +
    '          {\n' +
    '            "system": "phone",\n' +
    '            "value": "(+1) 972-766-6900"\n' +
    '          }\n' +
    '        ],\n' +
    '        "address": [\n' +
    '          {\n' +
    '            "use": "billing",\n' +
    '            "type": "postal",\n' +
    '            "line": [\n' +
    '              "P.O. Box 660044"\n' +
    '            ],\n' +
    '            "city": "Dallas",\n' +
    '            "state": "TX",\n' +
    '            "postalCode": "75266-0044",\n' +
    '            "country": "USA"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      "fullUrl": "https://madie.cms.gov/Practitioner/practitioner-123456",\n' +
    '      "resource": {\n' +
    '        "resourceType": "Practitioner",\n' +
    '        "id": "practitioner-123456",\n' +
    '        "identifier": [\n' +
    '          {\n' +
    '            "system": "http://hl7.org/fhir/sid/us-npi",\n' +
    '            "value": "123456"\n' +
    '          }\n' +
    '        ],\n' +
    '        "name": [\n' +
    '          {\n' +
    '            "family": "Evil",\n' +
    '            "prefix": [\n' +
    '              "Dr"\n' +
    '            ]\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    }\n' +
    '  ]\n' +
    '}'

describe('Measure Highlighting', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, null)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Execute single Test Case and verify Measure highlighting', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
       
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        Utilities.waitForElementEnabled(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="330"]').should('have.color', '#20744C')
        })
    })
})

describe('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a single PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with a single PC', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
     
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        Utilities.waitForElementEnabled(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\nResultstrue Definition(s) Used')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="244"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="245"]').should('have.color', '#A63B12')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="330"]').should('have.color', '#20744C')
        })
    })
})

describe('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measureSecondGroupPath = 'cypress/fixtures/groupId2'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
       
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).click()
       
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        Utilities.waitForElementVisible(MeasureGroupPage.addMeasureGroupButton, 35000)
        cy.get(MeasureGroupPage.addMeasureGroupButton).scrollIntoView().click({ force: true })

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })

        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')

        cy.get('[data-testid="qi-core-groups"]').click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureSecondGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\nResultstrue Definition(s) Used')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="244"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="245"]').should('have.color', '#A63B12')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="330"]').should('have.color', '#20744C')
        })
        cy.get(TestCasesPage.highlightingPCTabSelector).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.highlightingPCTabSelector, 35000)
        cy.get(TestCasesPage.highlightingPCTabSelector).click()
        cy.readFile(measureSecondGroupPath).should('exist').then((secondGroupId) => {
            cy.get('[data-testid="option-' + secondGroupId + '"]').scrollIntoView().click({ force: true })

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('IP').click()
            Utilities.waitForElementVisible('[data-statement-name="Initial Population"]', 35000)
            cy.get('[data-statement-name="Initial Population"]').should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible('[data-statement-name="Initial PopulationOne"]', 35000)
            cy.get('[data-statement-name="Initial PopulationOne"]').should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible('[data-testid="NUMER-highlighting"]', 35000)
            cy.get('[data-testid="NUMER-highlighting"]').should('contain', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="244"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="245"]').should('have.color', '#A63B12')
        })
    })
})

describe('QI-Core: Test Case Highlighting Left navigation panel: Includes Result sub section as well as Definitions, Functions, and Unused sections', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLDFUTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, tcDFNJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })


    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & Includes Result sub section as well as Definitions, Functions, and Unused sections', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        cy.get('[data-testid="qi-core-groups"]').click()
        
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).click()
        
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 60000 })

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible('[data-statement-name="Encounter to Assess Cognition"]', 35000)
        cy.get('[data-statement-name="Encounter to Assess Cognition"]').should('contain.text', 'define "Encounter to Assess Cognition":\n' +
            '["Encounter": "Psych Visit Diagnostic Evaluation"]\n' +
            '    union ["Encounter": "Nursing Facility Visit"]\n' +
            '    union ["Encounter": "Care Services in Long Term Residential Facility"]\n' +
            '    union ["Encounter": "Home Healthcare Services"]\n' +
            '    union ["Encounter": "Psych Visit Psychotherapy"]\n' +
            '    union ["Encounter": "Behavioral/Neuropsych Assessment"]\n' +
            '    union ["Encounter": "Occupational Therapy Evaluation"]\n' +
            '    union ["Encounter": "Office Visit"]\n' +
            '    union ["Encounter": "Outpatient Consultation"]')
        cy.get('[data-ref-id="245"]').should('have.color', '#A63B12')
        cy.get('[data-ref-id="342"]').should('have.color', '#A63B12')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Functions').click()
        Utilities.waitForElementVisible('[data-statement-name="ToCalendarUnit"]', 35000)
        cy.get('[data-statement-name="ToCalendarUnit"]').should('contain.text', '/*\n' +
            '@description: Converts a UCUM definite duration unit to a CQL calendar duration\n' +
            'unit using conversions specified in the [quantities](https://cql.hl7.org/02-authorsguide.html#quantities) \n' +
            'topic of the CQL specification.\n' +
            '@comment: Note that for durations above days (or weeks), the conversion is understood to be approximate\n' +
            '*/\n' +
            'define function ToCalendarUnit(unit System.String):\n' +
            '    case unit\n' +
            '        when \'ms\' then \'millisecond\'\n' +
            '        when \'s\' then \'second\'\n' +
            '        when \'min\' then \'minute\'\n' +
            '        when \'h\' then \'hour\'\n' +
            '        when \'d\' then \'day\'\n' +
            '        when \'wk\' then \'week\'\n' +
            '        when \'mo\' then \'month\'\n' +
            '        when \'a\' then \'year\'\n' +
            '        else unit\n' +
            '    end')
        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Unused').click()
        Utilities.waitForElementVisible('[data-testid="unused-highlighting"]', 35000)
        cy.get('[data-testid="unused-highlighting"]').should('contain.text', 'define "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods": "unavailable"ResultsNA define "Denominator Exceptions": "unavailable"ResultsNA define "SDE Ethnicity": "unavailable"ResultsNA define "SDE Race": "unavailable"ResultsNA define "SDE Sex": "unavailable"ResultsNA define "SDE Payer": "unavailable"ResultsNA define "track1": "unavailable"ResultsNA define "SDE Ethnicity": "unavailable"ResultsNA define "SDE Payer": "unavailable"ResultsNA define "SDE Race": "unavailable"ResultsNA define "SDE Sex": "unavailable"ResultsNA ')
    })
})

describe('QI-Core: Test Case Highlighting Left navigation panel: Includes Result sub section as well as Definitions, Functions, and Unused sections', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLResults)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, tcResultJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('QI Core Measure: New Highlighting Left Navigation panel sections includes auto-expanded Result section with content and Result section can be collapsed', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).click()
        
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 60000 })

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', '/***Population Criteria***/\ndefine "Initial Population":\nexists "Dementia Encounter During Measurement Period"\n    and ( Count("Qualifying Encounter During Measurement Period")>= 2 )')
            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLCollapseResultBtn).first().click()
            Utilities.waitForElementToNotExist(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).contains('Results').first().scrollIntoView().click()
            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLResultsSection).should('contain.text', 'FALSE (false)')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Denominator":\n"Initial Population"\nResultsUNHIT ')

            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLCollapseResultBtn).first().click()
            Utilities.waitForElementToNotExist(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).contains('Results').first().scrollIntoView().click()
            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLResultsSection).should('contain.text', 'UNHIT')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Numerator":\nexists "Assessment of Cognition Using Standardized Tools or Alternate Methods"\nResultsUNHIT ')

            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLCollapseResultBtn).first().click()
            Utilities.waitForElementToNotExist(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).contains('Results').first().scrollIntoView().click()
            Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
            cy.get(TestCasesPage.tcHLResultsSection).should('contain.text', 'UNHIT')
        })

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Functions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcFUNCTIONSHighlightingDetails, 35000)
        cy.get(TestCasesPage.tcFUNCTIONSHighlightingDetails).should('contain.text', '\n/*\n@description: Converts a UCUM definite duration unit to a CQL calendar duration\nunit using conversions specified in the [quantities](https://cql.hl7.org/02-authorsguide.html#quantities) \ntopic of the CQL specification.\n@comment: Note that for durations above days (or weeks), the conversion is understood to be approximate\n*/\ndefine function ToCalendarUnit(unit System.String):\n    case unit\n        when \'ms\' then \'millisecond\'\n        when \'s\' then \'second\'\n        when \'min\' then \'minute\'\n        when \'h\' then \'hour\'\n        when \'d\' then \'day\'\n        when \'wk\' then \'week\'\n        when \'mo\' then \'month\'\n        when \'a\' then \'year\'\n        else unit\n    end\n\n/*\n@description: Converts the given FHIR [Quantity](https://hl7.org/fhir/datatypes.html#Quantity) \nvalue to a CQL Quantity\n@comment: If the given quantity has a comparator specified, a runtime error is raised. If the given quantity\nhas a system other than UCUM (i.e. `http://unitsofmeasure.org`) or CQL calendar units (i.e. `http://hl7.org/fhirpath/CodeSystem/calendar-units`)\nan error is raised. For UCUM to calendar units, the `ToCalendarUnit` function is used.\n@seealso: ToCalendarUnit\n*/\ndefine function ToQuantity(quantity FHIR.Quantity):\n    case\n        when quantity is null then null\n        when quantity.value is null then null\n        when quantity.comparator is not null then\n            Message(null, true, \'FHIRHelpers.ToQuantity.ComparatorQuantityNotSupported\', \'Error\', \'FHIR Quantity value has a comparator and cannot be converted to a System.Quantity value.\')\n        when quantity.system is null or quantity.system.value = \'http://unitsofmeasure.org\'\n              or quantity.system.value = \'http://hl7.org/fhirpath/CodeSystem/calendar-units\' then\n            System.Quantity { value: quantity.value.value, unit: ToCalendarUnit(Coalesce(quantity.code.value, quantity.unit.value, \'1\')) }\n        else\n            Message(null, true, \'FHIRHelpers.ToQuantity.InvalidFHIRQuantity\', \'Error\', \'Invalid FHIR Quantity code: \' & quantity.unit.value & \' (\' & quantity.system.value & \'|\' & quantity.code.value & \')\')\n    end\n\n/*\n@description: Converts the given FHIR [Ratio](https://hl7.org/fhir/datatypes.html#Ratio) value to a CQL Ratio.\n*/\ndefine function ToRatio(ratio FHIR.Ratio):\n    if ratio is null then\n        null\n    else\n        System.Ratio { numerator: ToQuantity(ratio.numerator), denominator: ToQuantity(ratio.denominator) }\n\n/*\n@description: Converts the given FHIR [Coding](https://hl7.org/fhir/datatypes.html#Coding) value to a CQL Code.\n*/\ndefine function ToCode(coding FHIR.Coding):\n    if coding is null then\n        null\n    else\n        System.Code {\n          code: coding.code.value,\n          system: coding.system.value,\n          version: coding.version.value,\n          display: coding.display.value\n        }\n\n/*\n@description: Converts the given FHIR [CodeableConcept](https://hl7.org/fhir/datatypes.html#CodeableConcept) value to a CQL Concept.\n*/\ndefine function ToConcept(concept FHIR.CodeableConcept):\n    if concept is null then\n        null\n    else\n        System.Concept {\n            codes: concept.coding C return ToCode(C),\n            display: concept.text.value\n        }\n\n/*\n@description: Converts the given value to a CQL value using the appropriate accessor or conversion function.\n@comment: TODO: document conversion\n*/\ndefine function ToValue(value Choice<base64Binary,\n        boolean,\n        canonical,\n        code,\n        date,\n        dateTime,\n        decimal,\n        id,\n        instant,\n        integer,\n        markdown,\n        oid,\n        positiveInt,\n        string,\n        time,\n        unsignedInt,\n        uri,\n        url,\n        uuid,\n        Address,\n        Age,\n        Annotation,\n        Attachment,\n        CodeableConcept,\n        Coding,\n        ContactPoint,\n        Count,\n        Distance,\n        Duration,\n        HumanName,\n        Identifier,\n        Money,\n        Period,\n        Quantity,\n        Range,\n        Ratio,\n        Reference,\n        SampledData,\n        Signature,\n        Timing,\n        ContactDetail,\n        Contributor,\n        DataRequirement,\n        Expression,\n        ParameterDefinition,\n        RelatedArtifact,\n        TriggerDefinition,\n        UsageContext,\n        Dosage,\n        Meta>):\n    case\n      when value is base64Binary then (value as base64Binary).value\n      when value is boolean then (value as boolean).value\n      when value is canonical then (value as canonical).value\n      when value is code then (value as code).value\n      when value is date then (value as date).value\n      when value is dateTime then (value as dateTime).value\n      when value is decimal then (value as decimal).value\n      when value is id then (value as id).value\n      when value is instant then (value as instant).value\n      when value is integer then (value as integer).value\n      when value is markdown then (value as markdown).value\n      when value is oid then (value as oid).value\n      when value is positiveInt then (value as positiveInt).value\n      when value is string then (value as string).value\n      when value is time then (value as time).value\n      when value is unsignedInt then (value as unsignedInt).value\n      when value is uri then (value as uri).value\n      when value is url then (value as url).value\n      when value is uuid then (value as uuid).value\n      when value is Age then ToQuantity(value as Age)\n      when value is CodeableConcept then ToConcept(value as CodeableConcept)\n      when value is Coding then ToCode(value as Coding)\n      when value is Count then ToQuantity(value as Count)\n      when value is Distance then ToQuantity(value as Distance)\n      when value is Duration then ToQuantity(value as Duration)\n      when value is Quantity then ToQuantity(value as Quantity)\n      when value is Range then ToInterval(value as Range)\n      when value is Period then ToInterval(value as Period)\n      when value is Ratio then ToRatio(value as Ratio)\n      else value as Choice<Address,\n        Annotation,\n        Attachment,\n        ContactPoint,\n        HumanName,\n        Identifier,\n        Money,\n        Reference,\n        SampledData,\n        Signature,\n        Timing,\n        ContactDetail,\n        Contributor,\n        DataRequirement,\n        Expression,\n        ParameterDefinition,\n        RelatedArtifact,\n        TriggerDefinition,\n        UsageContext,\n        Dosage,\n        Meta>\n    end\n\n/* Candidates for FHIRCommon */\n\n/*\n@description: Returns true if the given condition has a clinical status of active, recurrence, or relapse\n*/\ndefine fluent function isActive(condition Condition):\n  condition.clinicalStatus ~ "active"\n    or condition.clinicalStatus ~ "recurrence"\n    or condition.clinicalStatus ~ "relapse"\n\n/*\n@description: Normalizes a value that is a choice of timing-valued types to an equivalent interval\n@comment: Normalizes a choice type of DateTime, Quanitty, Interval<DateTime>, or Interval<Quantity> types\nto an equivalent interval. This selection of choice types is a superset of the majority of choice types that are used as possible\nrepresentations for timing-valued elements in QICore, allowing this function to be used across any resource.\nThe input can be provided as a DateTime, Quantity, Interval<DateTime> or Interval<Quantity>.\nThe intent of this function is to provide a clear and concise mechanism to treat single\nelements that have multiple possible representations as intervals so that logic doesn\'t have to account\nfor the variability. More complex calculations (such as medication request period or dispense period\ncalculation) need specific guidance and consideration. That guidance may make use of this function, but\nthe focus of this function is on single element calculations where the semantics are unambiguous.\nIf the input is a DateTime, the result a DateTime Interval beginning and ending on that DateTime.\nIf the input is a Quantity, the quantity is expected to be a calendar-duration interpreted as an Age,\nand the result is a DateTime Interval beginning on the Date the patient turned that age and ending immediately before one year later.\nIf the input is a DateTime Interval, the result is the input.\nIf the input is a Quantity Interval, the quantities are expected to be calendar-durations interpreted as an Age, and the result\nis a DateTime Interval beginning on the date the patient turned the age given as the start of the quantity interval, and ending\nimmediately before one year later than the date the patient turned the age given as the end of the quantity interval.\nAny other input will reslt in a null DateTime Interval\n*/\ndefine fluent function toInterval(choice Choice<DateTime, Quantity, Interval<DateTime>, Interval<Quantity>>):\n  case\n\t  when choice is DateTime then\n    \tInterval[choice as DateTime, choice as DateTime]\n\t\twhen choice is Interval<DateTime> then\n  \t\tchoice as Interval<DateTime>\n\t\twhen choice is Quantity then\n\t\t  Interval[Patient.birthDate + (choice as Quantity),\n\t\t\t  Patient.birthDate + (choice as Quantity) + 1 year)\n\t\twhen choice is Interval<Quantity> then\n\t\t  Interval[Patient.birthDate + (choice.low as Quantity),\n\t\t\t  Patient.birthDate + (choice.high as Quantity) + 1 year)\n\t\telse\n\t\t\tnull as Interval<DateTime>\n\tend\n\n/*\n@description: Returns an interval representing the normalized abatement of a given Condition.\n@comment: If the abatement element of the Condition is represented as a DateTime, the result\nis an interval beginning and ending on that DateTime.\nIf the abatement is represented as a Quantity, the quantity is expected to be a calendar-duration and is interpreted as the age of the patient. The\nresult is an interval from the date the patient turned that age to immediately before one year later.\nIf the abatement is represented as a Quantity Interval, the quantities are expected to be calendar-durations and are interpreted as an age range during\nwhich the abatement occurred. The result is an interval from the date the patient turned the starting age of the quantity interval, and ending immediately\nbefore one year later than the date the patient turned the ending age of the quantity interval.\n*/\ndefine fluent function abatementInterval(condition Condition):\n\tif condition.abatement is DateTime then\n\t  Interval[condition.abatement as DateTime, condition.abatement as DateTime]\n\telse if condition.abatement is Quantity then\n\t\tInterval[Patient.birthDate + (condition.abatement as Quantity),\n\t\t\tPatient.birthDate + (condition.abatement as Quantity) + 1 year)\n\telse if condition.abatement is Interval<Quantity> then\n\t  Interval[Patient.birthDate + (condition.abatement.low as Quantity),\n\t\t  Patient.birthDate + (condition.abatement.high as Quantity) + 1 year)\n\telse if condition.abatement is Interval<DateTime> then\n\t  Interval[condition.abatement.low, condition.abatement.high)\n\telse null as Interval<DateTime>\n\n/*\n@description: Returns an interval representing the normalized prevalence period of a given Condition.\n@comment: Uses the ToInterval and ToAbatementInterval functions to determine the widest potential interval from\nonset to abatement as specified in the given Condition. If the condition is active, the resulting interval will have\na closed ending boundary. If the condition is not active, the resulting interval will have an open ending boundary.\n*/\ndefine fluent function prevalenceInterval(condition Condition):\nif condition.clinicalStatus ~ "active"\n  or condition.clinicalStatus ~ "recurrence"\n  or condition.clinicalStatus ~ "relapse" then\n  Interval[start of condition.onset.toInterval(), end of condition.abatementInterval()]\nelse\n  Interval[start of condition.onset.toInterval(), end of condition.abatementInterval())\n')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Unused').click()
        Utilities.waitForElementVisible(TestCasesPage.tcUNUSEDHightlightingDetails, 35000)
        cy.get(TestCasesPage.tcUNUSEDHightlightingDetails).should('contain.text', 'define "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods": "unavailable"ResultsNA define "Denominator Exceptions": "unavailable"ResultsNA define "SDE Ethnicity": "unavailable"ResultsNA define "SDE Race": "unavailable"ResultsNA define "SDE Sex": "unavailable"ResultsNA define "SDE Payer": "unavailable"ResultsNA ')

        Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
        cy.get(TestCasesPage.tcHLCollapseResultBtn).first().click()
        cy.get(TestCasesPage.tcUNUSEDHightlightingDetails).contains('Results').first().scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.tcHLResultsSection, 35000)
        cy.get(TestCasesPage.tcHLResultsSection).should('contain.text', 'NA')
    })
})

describe('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a measure with same Definition in the library', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL_withDuplicateLibraryDefinition, null, false, '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Numerator', '', 'Denominator', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, tcJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with same Definition in the included library', () => {
        let measureGroupPath = 'cypress/fixtures/measureGroupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 60000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 6500)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.reload()
        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 55000)
        cy.get(TestCasesPage.executeTestCaseButton).scrollIntoView()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 55000)

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="group-coverage-nav-' + fileContents + '"]', 35000)
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'define "Initial Population":\n' +
                '  VTE."Encounter with Age Range and without VTE Diagnosis or Obstetrical Conditions"')
            cy.get('[data-ref-id="340"]').should('have.color', '#20744C')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', 'define "Denominator":\n' +
                '  "Initial Population"')
            cy.get('[data-ref-id="350"]').should('have.color', '#20744C')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', 'define "Numerator":\n' +
                '  "Encounter with VTE Prophylaxis Received From Day of Start of Hospitalization To Day After Admission or Procedure"\n' +
                '      union ( "Encounter with Medication Oral Factor Xa Inhibitor Administered on Day of or Day After Admission or Procedure"\n' +
                '                   intersect ( "Encounter with Prior or Present Diagnosis of Atrial Fibrillation or Prior Diagnosis of VTE"\n' +
                '                                  union "Encounter with Prior or Present Procedure of Hip or Knee Replacement Surgery"\n' +
                '                               )\n' +
                '              )\n' +
                '      union "Encounter with Low Risk for VTE or Anticoagulant Administered"\n' +
                '      union "Encounter with No VTE Prophylaxis Due to Medical Reason"\n' +
                '      union "Encounter with No VTE Prophylaxis Due to Patient Refusal"')
            cy.get('[data-ref-id="1176"]').should('have.color', '#20744C')
        })
    })
})
