const standardSdeBlock =
  'define "SDE Ethnicity":\n' +
  '  SDE."SDE Ethnicity"\n\n' +
  'define "SDE Payer":\n' +
  '  SDE."SDE Payer"\n\n' +
  'define "SDE Race":\n' +
  '  SDE."SDE Race"\n\n' +
  'define "SDE Sex":\n' +
  '  SDE."SDE Sex"\n\n'

export class FhirCql {

  public static readonly ICF_FHIR_with_invalid_using = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using FHIR version \'4.0.10\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"ipp\":\n' +
    'true\n' +
    'define \"denom\":\n' +
    '\"ipp\"\n' +
    'define \"num\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'

  public static readonly ICFCleanTestQICore_CQL_without_using = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

  public static readonly SBTESTCMS347_CQL = 'library SBTESTCMS347 version \'0.0.016\'\n\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElementsFHIR4 version \'2.0.000\' called SDE\n' +
    'include MATGlobalCommonFunctionsFHIR4 version \'6.1.000\' called Global\n\n' +
    'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\'\n\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\' \n' +
    'valueset "Atherosclerosis and Peripheral Arterial Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.21\' \n' +
    'valueset "Breastfeeding": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.73\' \n' +
    'valueset "CABG Surgeries": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.694\' \n' +
    'valueset "CABG, PCI Procedure": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.566\' \n' +
    'valueset "Carotid Intervention": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.204\' \n' +
    'valueset "Cerebrovascular Disease, Stroke, TIA": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.44\' \n' +
    'valueset "Diabetes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
    'valueset "Hepatitis A": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1024\' \n' +
    'valueset "Hepatitis B": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.67.1.101.1.269\' \n' +
    'valueset "High Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1572\' \n' +
    'valueset "Hospice Care Ambulatory": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1584\' \n' +
    'valueset "Hypercholesterolemia": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.100\' \n' +
    'valueset "Ischemic Heart Disease or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.46\' \n' +
    'valueset "LDL Cholesterol": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1573\' \n' +
    'valueset "Liver Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.42\' \n' +
    'valueset "Low Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1574\' \n' +
    'valueset "Moderate Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1575\' \n' +
    'valueset "Myocardial Infarction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.403\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Outpatient Consultation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1008\' \n' +
    'valueset "Outpatient Encounters for Preventive Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1576\' \n' +
    'valueset "Palliative Care Encounter": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1575\' \n' +
    'valueset "Palliative or Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1579\' \n' +
    'valueset "PCI": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.67\' \n' +
    'valueset "Pregnancy or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1623\' \n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\' \n' +
    'valueset "Preventive Care Services - Other": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1030\' \n' +
    'valueset "Preventive Care Services-Individual Counseling": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1026\' \n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\' \n' +
    'valueset "Rhabdomyolysis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.102\' \n' +
    'valueset "Stable and Unstable Angina": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.47\' \n' +
    'valueset "Statin Allergen": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.42\' \n' +
    'valueset "Statin Associated Muscle Symptoms": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1108.85\'\n\n' +
    'code "Encounter for palliative care": \'Z51.5\' from "ICD10CM" display \'Encounter for palliative care\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "Denominator 1":\n' +
    '  "Initial Population 1"\n\n' +
    'define "Denominator 2":\n' +
    '  "Initial Population 2"\n\n' +
    'define "Denominator 3":\n' +
    '  "Initial Population 3"\n\n' +
    standardSdeBlock +
    'define "Patients Age 20 or Older at Start of Measurement Period":\n' +
    '  AgeInYearsAt (start of "Measurement Period") >= 20\n\n' +
    'define "Initial Population 1":\n' +
    '  exists "ASCVD Diagnosis or Procedure before End of Measurement Period" \n' +
    '                and exists "Qualifying Encounter during Measurement Period"\n\n' +
    'define "Initial Population 2":\n' +
    '  "Patients Age 20 Years and Older with LDL Cholesterol Result Greater than or Equal to 190 or Hypercholesterolemia without ASCVD" \n' +
    '                and exists "Qualifying Encounter during Measurement Period"\n\n' +
    'define "Initial Population 3":\n' +
    '  "Patients Age 40 to 75 Years with Diabetes without ASCVD or LDL Greater than 190 or Hypercholesterolemia" \n' +
    '                and exists "Qualifying Encounter during Measurement Period"\n\n' +
    'define "ASCVD Diagnosis or Procedure before End of Measurement Period":\n' +
    '  ( ( [Condition: "Myocardial Infarction"]\n' +
    '                    union [Condition: "Cerebrovascular Disease, Stroke, TIA"]\n' +
    '                    union [Condition: "Atherosclerosis and Peripheral Arterial Disease"]\n' +
    '                    union [Condition: "Ischemic Heart Disease or Other Related Diagnoses"]\n' +
    '                    union [Condition: "Stable and Unstable Angina"] ) ASCVDDiagnosis\n' +
    '                        where Global."Prevalence Period" ( ASCVDDiagnosis ) starts before end of "Measurement Period")\n' +
    '                    union ( ( [Procedure: "PCI"]\n' +
    '                    union [Procedure: "CABG Surgeries"]\n' +
    '                    union [Procedure: "Carotid Intervention"]\n' +
    '                    union [Procedure: "CABG, PCI Procedure"] ) ASCVDProcedure\n' +
    '                        where Global."Normalize Interval" ( ASCVDProcedure.performed ) starts before end of "Measurement Period" \n' +
    '                        and ASCVDProcedure.status = \'completed\'\n' +
    '                )\n\n' +
    'define "Denominator Exceptions":\n' +
    '  "Has Allergy to Statin" \n' +
    '                    or "Has Order or Receiving Hospice Care or Palliative Care"\n' +
    '                    or "Has Hepatitis or Liver Disease Diagnosis"\n' +
    '                    or "Has Statin Associated Muscle Symptoms"\n' +
    '                    or "Has ESRD Diagnosis"\n' +
    '                    or "Has Adverse Reaction to Statin"\n\n' +
    'define "Denominator Exclusions":\n' +
    '  exists ( ( [Condition: "Pregnancy or Other Related Diagnoses"]\n' +
    '                    union [Condition: "Breastfeeding"]\n' +
    '                    union [Condition: "Rhabdomyolysis"] ) ExclusionDiagnosis\n' +
    '                    where Global."Prevalence Period" ( ExclusionDiagnosis ) overlaps "Measurement Period")\n\n' +
    'define "Has Adverse Reaction to Statin":\n' +
    '  exists ([AdverseEvent: "Statin Allergen"] StatinReaction\n' +
    '                    where StatinReaction.date during "Measurement Period")\n\n' +
    'define "Has Allergy to Statin":\n' +
    '  exists ([AllergyIntolerance: "Statin Allergen"] StatinAllergy\n' +
    '                    where Global."Normalize Interval"(StatinAllergy.onset) starts before end of "Measurement Period")\n\n' +
    'define "Has Diabetes Diagnosis":\n' +
    '  exists ( [Condition: "Diabetes"] Diabetes\n' +
    '                    where Global."Prevalence Period" ( Diabetes ) overlaps "Measurement Period")\n\n' +
    'define "Has ESRD Diagnosis":\n' +
    '  exists ( [Condition: "End Stage Renal Disease"] ESRD\n' +
    '                    where Global."Prevalence Period" ( ESRD) overlaps "Measurement Period")\n\n' +
    'define "Has Hepatitis or Liver Disease Diagnosis":\n' +
    '  exists ( ( [Condition: "Hepatitis A"]\n' +
    '                    union [Condition: "Hepatitis B"]\n' +
    '                    union [Condition: "Liver Disease"] ) HepatitisLiverDisease\n' +
    '                    where Global."Prevalence Period" ( HepatitisLiverDisease ) overlaps "Measurement Period")\n\n' +
    'define "Has Statin Associated Muscle Symptoms":\n' +
    '  exists(["Condition": "Statin Associated Muscle Symptoms"] StatinMuscleSymptom\n' +
    '                    where Global."Prevalence Period" ( StatinMuscleSymptom ) starts before end of "Measurement Period")\n\n' +
    'define "Hypercholesterolemia Diagnosis":\n' +
    '  [Condition: "Hypercholesterolemia"] Hypercholesterolemia \n' +
    '                    where Global."Prevalence Period" (Hypercholesterolemia) starts before end of "Measurement Period"\n\n' +
    'define "LDL Result Greater Than or Equal To 190":\n' +
    '  [Observation: "LDL Cholesterol"] LDL\n' +
    '                    where LDL.value >= 190 \'mg/dL\'\n' +
    '                    and Global."Normalize Interval" (LDL.effective) starts before end of "Measurement Period"\n' +
    '                    and LDL.status in { \'final\', \'amended\', \'corrected\', \'appended\' }\n\n' +
    'define "Numerator":\n' +
    '  exists "Statin Therapy Ordered during Measurement Period"\n' +
    '                or exists "Prescribed Statin Therapy Any Time during Measurement Period"\n\n' +
    'define "Patients Age 20 Years and Older with LDL Cholesterol Result Greater than or Equal to 190 or Hypercholesterolemia without ASCVD":\n' +
    '  "Patients Age 20 or Older at Start of Measurement Period" \n' +
    '                and exists ("LDL Result Greater Than or Equal To 190" \n' +
    '                    union "Hypercholesterolemia Diagnosis") \n' +
    '                and not exists ("ASCVD Diagnosis or Procedure before End of Measurement Period")\n\n' +
    'define "Patients Age 40 to 75 Years with Diabetes without ASCVD or LDL Greater than 190 or Hypercholesterolemia":\n' +
    '  AgeInYearsAt (start of "Measurement Period") in Interval[40,75] \n' +
    '                and "Has Diabetes Diagnosis" \n' +
    '                and not exists "ASCVD Diagnosis or Procedure before End of Measurement Period" \n' +
    '                and not exists "LDL Result Greater Than or Equal To 190" \n' +
    '                and not exists "Hypercholesterolemia Diagnosis"\n\n' +
    'define "Qualifying Encounter during Measurement Period":\n' +
    '  ( [Encounter: "Annual Wellness Visit"]\n' +
    '                union [Encounter: "Office Visit"]\n' +
    '                union [Encounter: "Outpatient Consultation"]\n' +
    '                union [Encounter: "Outpatient Encounters for Preventive Care"]\n' +
    '                union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    '                union [Encounter: "Preventive Care Services - Other"]\n' +
    '                union [Encounter: "Preventive Care Services-Individual Counseling"]\n' +
    '                union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"] ) ValidEncounter\n' +
    '                    where ValidEncounter.period during "Measurement Period"\n' +
    '                    and ValidEncounter.status = \'finished\'\n\n' +
    'define "Statin Therapy Ordered during Measurement Period":\n' +
    '  ( [MedicationRequest: "Low Intensity Statin Therapy"]\n' +
    '                union [MedicationRequest: "Moderate Intensity Statin Therapy"]\n' +
    '                union [MedicationRequest: "High Intensity Statin Therapy"] ) StatinOrdered\n' +
    '                    where StatinOrdered.authoredOn during "Measurement Period"\n' +
    '                    and StatinOrdered.status in { \'active\', \'completed\' }\n' +
    '                    and StatinOrdered.intent = \'order\'\n\n' +
    'define "Has Order or Receiving Hospice Care or Palliative Care":\n' +
    '  exists ( ( [ServiceRequest: "Hospice Care Ambulatory"]\n' +
    '                  union [ServiceRequest: "Palliative or Hospice Care"] ) PalliativeOrHospiceCareOrder\n' +
    '                  where PalliativeOrHospiceCareOrder.authoredOn on or before \n' +
    '                  end of "Measurement Period"\n' +
    '                    and PalliativeOrHospiceCareOrder.status in { \'active\', \'on-hold\', \'completed\' }\n' +
    '                    and PalliativeOrHospiceCareOrder.intent = \'order\'\n' +
    '              )\n' +
    '                or exists ( ( [Procedure: "Hospice Care Ambulatory"]\n' +
    '                    union [Procedure: "Palliative or Hospice Care"] ) PalliativeOrHospiceCarePerformed\n' +
    '                    where Global."Normalize Interval" ( PalliativeOrHospiceCarePerformed.performed ) starts on or before \n' +
    '                    end of "Measurement Period"\n' +
    '                      and PalliativeOrHospiceCarePerformed.status = \'completed\'\n' +
    '                )\n' +
    '                or exists ( [Encounter: "Encounter for palliative care"] PalliativeEncounter\n' +
    '                    where PalliativeEncounter.period starts on or before \n' +
    '                    end of "Measurement Period"\n' +
    '                      and PalliativeEncounter.status = \'finished\'\n' +
    '                )\n\n' +
    'define "Prescribed Statin Therapy Any Time during Measurement Period":\n' +
    '  ( [MedicationRequest: "Low Intensity Statin Therapy"]\n' +
    '                union [MedicationRequest: "Moderate Intensity Statin Therapy"]\n' +
    '                union [MedicationRequest: "High Intensity Statin Therapy"] ) ActiveStatin\n' +
    '                where exists ( ActiveStatin.dosageInstruction.timing T\n' +
    '                    where Global."Normalize Interval" ( T.repeat.bounds ) overlaps "Measurement Period"\n' +
    '                )\n' +
    '                  and ActiveStatin.status in { \'active\', \'completed\' }\n\n' +
    'define "Denominator Exceptions 1":\n' +
    '  true\n\n' +
    'define "Denominator Exceptions 2":\n' +
    '  true\n\n' +
    'define "Denominator Exceptions 3":\n' +
    '  true\n'

  public static readonly SBTEST_CQL = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"ipp\":\n' +
    'true\n' +
    'define \"denom\":\n' +
    '\"ipp\"\n' +
    'define \"num\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'
}

export class QiCore4Cql {

  public static readonly stndBasicQICoreCQL = 'library TestLibrary1709929148231865 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define "Initial Population":\n' +
    'exists "Qualifying Encounters"\n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    'union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Home Healthcare Services"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'define "Initial PopulationOne":\n' +
    'true\n'

  public static readonly ICFCleanTestQICore_CQL_with_incorrect_using = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using QICore version \'4.1.00000\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

  public static readonly ICFCleanTestQICore = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

  public static readonly qiCoreTestCQL = 'library TestLibrary51723751438142 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
    'include MATGlobalCommonFunctionsFHIR4 version \'1.0.000\' called Global\n\n' +
    'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\'\n\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\' \n' +
    'valueset "Atherosclerosis and Peripheral Arterial Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.21\' \n' +
    'valueset "Breastfeeding": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.73\' \n' +
    'valueset "CABG Surgeries": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.694\' \n' +
    'valueset "CABG, PCI Procedure": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.566\' \n' +
    'valueset "Carotid Intervention": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.204\' \n' +
    'valueset "Cerebrovascular Disease, Stroke, TIA": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.44\' \n' +
    'valueset "Diabetes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
    'valueset "Hepatitis A": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1024\' \n' +
    'valueset "Hepatitis B": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.67.1.101.1.269\' \n' +
    'valueset "High Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1572\' \n' +
    'valueset "Hospice Care Ambulatory": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1584\' \n' +
    'valueset "Hypercholesterolemia": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.100\' \n' +
    'valueset "Ischemic Heart Disease or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.46\' \n' +
    'valueset "LDL Cholesterol": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1573\' \n' +
    'valueset "Liver Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.42\' \n' +
    'valueset "Low Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1574\' \n' +
    'valueset "Moderate Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1575\' \n' +
    'valueset "Myocardial Infarction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.403\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Outpatient Consultation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1008\' \n' +
    'valueset "Outpatient Encounters for Preventive Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1576\' \n' +
    'valueset "Palliative Care Encounter": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1575\' \n' +
    'valueset "Palliative or Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1579\' \n' +
    'valueset "PCI": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.67\' \n' +
    'valueset "Pregnancy or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1623\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services - Other": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1030\' \n' +
    'valueset "Preventive Care Services-Individual Counseling": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1026\' \n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\' \n' +
    'valueset "Rhabdomyolysis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.102\' \n' +
    'valueset "Stable and Unstable Angina": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.47\' \n' +
    'valueset "Statin Allergen": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.42\' \n' +
    'valueset "Statin Associated Muscle Symptoms": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1108.85\'\n\n' +
    'code "Encounter for palliative care": \'Z51.5\' from "ICD10CM" display \'Encounter for palliative care\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    standardSdeBlock +
    'define "Patients Age 20 or Older at Start of Measurement Period":\n' +
    '  AgeInYearsAt (start of "Measurement Period") >= 20\n'

  public static readonly ICFCleanTest_CQL = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using QICore version \'4.1.0\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where NoCervixHysterectomy.status = \'completed\''

  public static readonly CQL_Multiple_Populations = 'library TestLibrary4664 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Annual Wellness Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define \"Initial PopulationOne\":\n' +
    'true\n' +
    'define "Initial Population":\n' +
    '   true\n' +
    ' \n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: \"Annual Wellness Visit"]\n' +
    'union [Encounter: \"Preventive Care Services - Established Office Visit, 18 and Up\"]\n' +
    'union [Encounter: \"Preventive Care Services-Initial Office Visit, 18 and Up\"]\n' +
    'union [Encounter: \"Home Healthcare Services\"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during \"Measurement Period\"\n' +
    'and ValidEncounter.isFinishedEncounter()\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '(Enc E where E.status = \'finished\') is not null\n' +
    'define "Stratification 1":\n' +
    'true'

  public static readonly reduced_CQL_Multiple_Populations = 'library TestLibrary4664 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Annual Wellness Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define \"Initial PopulationOne\":\n' +
    'true\n' +
    'define "Initial Population":\n' +
    '   true\n'

  public static readonly CQL_For_Cohort = 'library TestLibrary4664 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Annual Wellness Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define \"Initial PopulationOne\":\n' +
    'true\n'

  public static readonly CQL_Populations = 'library TestLibrary4664 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Annual Wellness Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define \"Initial Population\":\n' +
    'exists \"Qualifying Encounters\"\n' +
    'define \"Qualifying Encounters\":\n' +
    '(\n' +
    '[Encounter: \"Office Visit\"]\n' +
    'union [Encounter: \"Annual Wellness Visit"]\n' +
    'union [Encounter: \"Preventive Care Services - Established Office Visit, 18 and Up\"]\n' +
    'union [Encounter: \"Preventive Care Services-Initial Office Visit, 18 and Up\"]\n' +
    'union [Encounter: \"Home Healthcare Services\"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during \"Measurement Period\"\n' +
    'define \"Initial PopulationOne\":\n' +
    'true\n'

  public static readonly CQLDFN_value = 'library NewBugTest version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    '/*Note ws 1. 8/09.2023: Negation issue as outlined in BonnieMat-1455 and ticket https://github.com/cqframework/cql-execution/issues/296 */\n' +
    'include FHIRHelpers version \'4.2.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements  version \'3.2.000\' called SDE\n' +
    'include QICoreCommon version \'1.3.000\' called QICoreCommon\n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
    'valueset "Behavioral/Neuropsych Assessment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1023\' \n' +
    'valueset "Care Services in Long Term Residential Facility": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1014\' \n' +
    'valueset "Cognitive Assessment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1332\' \n' +
    'valueset "Dementia & Mental Degenerations": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1005\' \n' +
    'valueset "Face-to-Face Interaction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1048\' \n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'  \n' +
    'valueset "Nursing Facility Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1012\' \n' +
    'valueset "Occupational Therapy Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1011\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Outpatient Consultation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1008\' \n' +
    'valueset "Patient Provider Interaction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1012\' \n' +
    'valueset "Patient Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1008\' \n' +
    'valueset "Psych Visit Diagnostic Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1492\' \n' +
    'valueset "Psych Visit Psychotherapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1496\' \n' +
    'valueset "Standardized Tools Score for Assessment of Cognition": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1006\' \n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    '/***Population Criteria***/\n' +
    'define "Initial Population":\n' +
    'exists "Dementia Encounter During Measurement Period"\n' +
    '    and ( Count("Qualifying Encounter During Measurement Period")>= 2 )\n' +
    'define "Denominator":\n' +
    '"Initial Population"\n' +
    'define "Numerator":\n' +
    'exists "Assessment of Cognition Using Standardized Tools or Alternate Methods"\n' +
    'define "Denominator Exceptions":\n' +
    'exists "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods"\n' +
    '/***Definitions***/\n' +
    'define "Assessment of Cognition Using Standardized Tools or Alternate Methods":\n' +
    '( ["Observation": "Standardized Tools Score for Assessment of Cognition"]\n' +
    '    union ["Observation": "Cognitive Assessment"] ) CognitiveAssessment\n' +
    '    with "Dementia Encounter During Measurement Period" EncounterDementia\n' +
    'such that CognitiveAssessment.effective.toInterval() starts 12 months or less on or before day of \n' +
    '    end of EncounterDementia.period\n' +
    '    where CognitiveAssessment.value is not null\n' +
    '    and CognitiveAssessment.status in { \'final\', \'amended\', \'corrected\', \'preliminary\' }\n' +
    'define "Dementia Encounter During Measurement Period":\n' +
    '"Encounter to Assess Cognition" EncounterAssessCognition\n' +
    '    with [Condition: "Dementia & Mental Degenerations"] Dementia\n' +
    '   such that EncounterAssessCognition.period during "Measurement Period"\n' +
    '           and Dementia.prevalenceInterval() overlaps day of EncounterAssessCognition.period \n' +
    '        and Dementia.isActive() \n' +
    '        and not ( Dementia.verificationStatus ~ QICoreCommon."unconfirmed"\n' +
    '                     or Dementia.verificationStatus ~ QICoreCommon."refuted"\n' +
    '                     or Dementia.verificationStatus ~ QICoreCommon."entered-in-error" )\n' +
    'define "Encounter to Assess Cognition":\n' +
    '["Encounter": "Psych Visit Diagnostic Evaluation"]\n' +
    '    union ["Encounter": "Nursing Facility Visit"]\n' +
    '    union ["Encounter": "Care Services in Long Term Residential Facility"]\n' +
    '    union ["Encounter": "Home Healthcare Services"]\n' +
    '    union ["Encounter": "Psych Visit Psychotherapy"]\n' +
    '    union ["Encounter": "Behavioral/Neuropsych Assessment"]\n' +
    '    union ["Encounter": "Occupational Therapy Evaluation"]\n' +
    '    union ["Encounter": "Office Visit"]\n' +
    '    union ["Encounter": "Outpatient Consultation"]\n' +
    'define "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods":\n' +
    '([ObservationNotDone: code in "Standardized Tools Score for Assessment of Cognition"] \n' +
    '    union [ObservationNotDone: code in "Cognitive Assessment"] )NoCognitiveAssessment\n' +
    '    with "Dementia Encounter During Measurement Period" EncounterDementia\n' +
    '      such that NoCognitiveAssessment.issued during EncounterDementia.period\n' +
    '    where NoCognitiveAssessment.notDoneReason in "Patient Reason"\n' +
    'define "Qualifying Encounter During Measurement Period":\n' +
    '("Encounter to Assess Cognition" union ["Encounter": "Patient Provider Interaction"] ) ValidEncounter\n' +
    '    where ValidEncounter.period during "Measurement Period"\n' +
    '    and ValidEncounter.status = \'finished\'\n' +
    standardSdeBlock +
    'define function test():\n' +
    ' true\n' +
    'define "track1":\n' +
    ' true\n'

  public static readonly CQLHLResults_value = 'library BugQICoreMeasure version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    '/*Note ws 1. 8/09.2023: Negation issue as outlined in BonnieMat-1455 and ticket https://github.com/cqframework/cql-execution/issues/296 */\n' +
    'include FHIRHelpers version \'4.2.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements  version \'3.2.000\' called SDE\n' +
    'include QICoreCommon version \'1.3.000\' called QICoreCommon\n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'\n' +
    'valueset "Behavioral/Neuropsych Assessment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1023\'\n' +
    'valueset "Care Services in Long Term Residential Facility": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1014\'\n' +
    'valueset "Cognitive Assessment": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1332\' \n' +
    'valueset "Dementia & Mental Degenerations": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1005\' \n' +
    'valueset "Face-to-Face Interaction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1048\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Nursing Facility Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1012\' \n' +
    'valueset "Occupational Therapy Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1011\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Outpatient Consultation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1008\' \n' +
    'valueset "Patient Provider Interaction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1012\' \n' +
    'valueset "Patient Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1008\' \n' +
    'valueset "Psych Visit Diagnostic Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1492\' \n' +
    'valueset "Psych Visit Psychotherapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1496\' \n' +
    'valueset "Standardized Tools Score for Assessment of Cognition": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1006\' \n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    '/***Population Criteria***/\n' +
    'define "Initial Population":\n' +
    'exists "Dementia Encounter During Measurement Period"\n' +
    '    and ( Count("Qualifying Encounter During Measurement Period")>= 2 )\n' +
    'define "Denominator":\n' +
    '"Initial Population"\n' +
    'define "Numerator":\n' +
    'exists "Assessment of Cognition Using Standardized Tools or Alternate Methods"\n' +
    'define "Denominator Exceptions":\n' +
    'exists "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods"\n' +
    '/***Definitions***/\n' +
    'define "Assessment of Cognition Using Standardized Tools or Alternate Methods":\n' +
    '( ["Observation": "Standardized Tools Score for Assessment of Cognition"]\n' +
    '    union ["Observation": "Cognitive Assessment"] ) CognitiveAssessment\n' +
    '    with "Dementia Encounter During Measurement Period" EncounterDementia\n' +
    'such that CognitiveAssessment.effective.toInterval() starts 12 months or less on or before day of \n' +
    '    end of EncounterDementia.period\n' +
    '    where CognitiveAssessment.value is not null\n' +
    '    and CognitiveAssessment.status in { \'final\', \'amended\', \'corrected\', \'preliminary\' }\n' +
    'define "Dementia Encounter During Measurement Period":\n' +
    '"Encounter to Assess Cognition" EncounterAssessCognition\n' +
    '    with [Condition: "Dementia & Mental Degenerations"] Dementia\n' +
    '   such that EncounterAssessCognition.period during "Measurement Period"\n' +
    '           and Dementia.prevalenceInterval() overlaps day of EncounterAssessCognition.period \n' +
    '        and Dementia.isActive()\n' +
    '        and not ( Dementia.verificationStatus ~ QICoreCommon."unconfirmed"\n' +
    '                     or Dementia.verificationStatus ~ QICoreCommon."refuted"\n' +
    '                     or Dementia.verificationStatus ~ QICoreCommon."entered-in-error" )\n' +
    'define "Encounter to Assess Cognition":\n' +
    '["Encounter": "Psych Visit Diagnostic Evaluation"]\n' +
    '    union ["Encounter": "Nursing Facility Visit"]\n' +
    '    union ["Encounter": "Care Services in Long Term Residential Facility"]\n' +
    '    union ["Encounter": "Home Healthcare Services"]\n' +
    '    union ["Encounter": "Psych Visit Psychotherapy"]\n' +
    '    union ["Encounter": "Behavioral/Neuropsych Assessment"]\n' +
    '    union ["Encounter": "Occupational Therapy Evaluation"]\n' +
    '    union ["Encounter": "Office Visit"]\n' +
    '    union ["Encounter": "Outpatient Consultation"]\n' +
    'define "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods":\n' +
    '([ObservationNotDone: code in "Standardized Tools Score for Assessment of Cognition"] \n' +
    '    union [ObservationNotDone: code in "Cognitive Assessment"] )NoCognitiveAssessment\n' +
    '    with "Dementia Encounter During Measurement Period" EncounterDementia\n' +
    '      such that NoCognitiveAssessment.issued during EncounterDementia.period\n' +
    '    where NoCognitiveAssessment.notDoneReason in "Patient Reason"\n' +
    'define "Qualifying Encounter During Measurement Period":\n' +
    '("Encounter to Assess Cognition" union ["Encounter": "Patient Provider Interaction"] ) ValidEncounter\n' +
    '    where ValidEncounter.period during "Measurement Period"\n' +
    '    and ValidEncounter.status = \'finished\'\n' +
    standardSdeBlock

  public static readonly ICFTest_CQL = 'library EXM124v7QICore4 version \'7.0.000\'\n' +
    '/*\n' +
    'Based on CMS124v7 - Cervical Cancer Screening\n' +
    'This example is a work in progress and should not be considered a final specification\n' +
    'or recommendation for guidance. This example will help guide and direct the process\n' +
    'of finding conventions and usage patterns that meet the needs of the various stakeholders\n' +
    'in the measure development community.\n' +
    '*/\n' +
    'using QICore version \'4.1.0\'\n' +
    'include FHIRHelpers version \'4.1.000\'\n' +
    'include HospiceQICore4 version \'2.0.000\' called Hospice\n' +
    'include AdultOutpatientEncountersQICore4 version \'2.0.000\' called AdultOutpatientEncounters\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    'include SupplementalDataElementsQICore4 version \'2.0.000\' called SDE\n' +
    'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset \"ONC Administrative Sex\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\'\n' +
    'valueset \"Race\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset \"Ethnicity\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset \"Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset \"Female\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Pap Test\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"HPV Test\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059\'\n' +
    'code \"Congenital absence of cervix (disorder)\": \'37687000\' from \"SNOMEDCT:2017-09\" display \'Congenital absence of cervix (disorder)\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    '  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    standardSdeBlock +
    'define \"Initial Population\":\n' +
    '  Patient.gender = \'female\'\n' +
    '  	and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period"\) in Interval[23, 64]\n' +
    '  	and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n' +
    'define \"Denominator\":\n' +
    '    	\"Initial Population\"\n' +
    'define \"Denominator Exclusion\":\n' +
    '	Hospice.\"Has Hospice\"\n' +
    '  		or exists \"Surgical Absence of Cervix\"\n' +
    ' 		or exists \"Absence of Cervix\"\n' +
    'define \"Absence of Cervix\":\n' +
    '	[Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n' +
    '  		where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n' +
    'define \"Surgical Absence of Cervix\":\n' +
    '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
    '		where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n' +
    '			and NoCervixHysterectomy.status = \'completed\'\n' +
    'define \"Numerator\":\n' +
    '	exists \"Pap Test Within 3 Years\"\n' +
    '		or exists \"Pap Test With HPV Within 5 Years\"\n' +
    'define \"Pap Test with Results\":\n' +
    '	[Observation: \"Pap Test\"] PapTest\n' +
    '		where PapTest.value is not null\n' +
    '			and PapTest.status in {{} \'final\', \'amended\', \'corrected\', \'preliminary\' }\n' +
    'define \"Pap Test Within 3 Years\":\n' +
    '	\"Pap Test with Results\" PapTest\n' +
    '		where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n' +
    'define \"PapTest Within 5 Years\":\n' +
    '	( \"Pap Test with Results\" PapTestOver30YearsOld\n' +
    '			where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n' +
    '				and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n' +
    '	)\n' +
    'define \"Pap Test With HPV Within 5 Years\":\n' +
    '	\"PapTest Within 5 Years\" PapTestOver30YearsOld\n' +
    '		with [Observation: \"HPV Test\"] HPVTest\n' +
    '			such that HPVTest.value is not null\n' +
    '        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n' +
    '				and HPVTest.status in {{} \'final\', \'amended\', \'corrected\', \'preliminary\' }'

  public static readonly measureCQL_5138_test = 'library Library4969 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '  true\n\n' +
    ' define "ipp":\n' +
    '    true\n\n' +
    'define "mpopEx":\n' +
    '  ["Encounter"] E where E.status = \'finished\'\n\n' +
    'define function boolFunc():\n' +
    '  1\n\n' +
    'define function boolFunc2():\n' +
    '  14\n\n' +
    'define function daysObs(e Encounter):\n' +
    '  duration in days of e.period\n'

  public static readonly EpisodeWithStrat = 'library CohortEpisodeWithStrat1668108456699 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    ' "Qualifying Encounters"\n\n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    'union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Home Healthcare Services"]\n' +
    ') ValidEncounter\n' +
    'where ValidEncounter.period during "Measurement Period"\n' +
    'and ValidEncounter.isFinishedEncounter()\n\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '(Enc E where E.status = \'finished\') is not null\n\n' +
    'define "Stratificaction 1":\n' +
    ' "Qualifying Encounters" Enc\n' +
    ' where Enc.type in "Annual Wellness Visit"'

  // this is from CMS id: 645FHIR    
  public static readonly BoneDensityEvalProstateCancer = 'library BoneDensityProstateCancerAndrogenDeprivationTherapyFHIR version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
    'include QICoreCommon version \'2.1.000\' called QICoreCommon\n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\'\n\n' +
    'valueset "Androgen deprivation therapy for Urology Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1151.48\'\n' +
    'valueset "DEXA Dual Energy Xray Absorptiometry, Bone Density for Urology Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1151.38\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Patient Declined": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1582\'\n' +
    'valueset "Prostate Cancer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.319\'\n' +
    'code "Injection of leuprolide acetate for twelve month period (regime/therapy)": \'456381000124102\' from "SNOMEDCT" display \'Injection of leuprolide acetate for twelve month period (regime/therapy)\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '"Has Qualifying Encounter" and exists\n' +
    '"Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period"\n\n' +
    'define "Denominator":\n' +
    '"Initial Population"\n\n' +
    'define "Numerator":\n' +
    '"Has Baseline DEXA Scan Two Years Prior to the Start of or Less than Three Months After the Start of ADT"\n\n' +
    'define "Denominator Exception":\n' +
    'false\n\n' +
    standardSdeBlock +
    'define "Has Baseline DEXA Scan Two Years Prior to the Start of or Less than Three Months After the Start of ADT":\n' +
    'exists ( ( [ServiceRequest: "DEXA Dual Energy Xray Absorptiometry, Bone Density for Urology Care"] DEXAOrdered\n' +
    ' with "Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period" OrderTwelveMonthsADT\n' +
    '\tsuch that DEXAOrdered.authoredOn 3 months or less on or after day of OrderTwelveMonthsADT.authoredOn\n' +
    'or DEXAOrdered.authoredOn 2 years or less before day of OrderTwelveMonthsADT.authoredOn\n' +
    ' where DEXAOrdered.status in {\'active\', \'completed\'}\n' +
    '\tand DEXAOrdered.intent = \'order\'\n' +
    'and DEXAOrdered.doNotPerform is not true\n' +
    ')\n' +
    'union ( [Observation: "DEXA Dual Energy Xray Absorptiometry, Bone Density for Urology Care"] DEXAPerformed\n' +
    ' with "Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period" OrderTwelveMonthsADT\n' +
    '\tsuch that DEXAPerformed.effective.toInterval() 3 months or less on or after day of OrderTwelveMonthsADT.authoredOn\n' +
    'or DEXAPerformed.effective.toInterval() 2 years or less before day of OrderTwelveMonthsADT.authoredOn\n' +
    ' where DEXAPerformed.status in {\'final\', \'amended\', \'corrected\'}\n' +
    ' )\n' +
    ')\n\n' +
    'define "No Bone Density Scan Ordered Due to Patient Refusal":\n' +
    '[ServiceNotRequested: "DEXA Dual Energy Xray Absorptiometry, Bone Density for Urology Care"] DEXANotOrdered\n' +
    ' with "Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period" OrderTwelveMonthsADT\n' +
    ' such that DEXANotOrdered.authoredOn 3 months or less on or after day of OrderTwelveMonthsADT.authoredOn\n' +
    ' and DEXANotOrdered.reasonRefused in "Patient Declined"\n\n' +
    'define "No Bone Density Scan Performed Due to Patient Refusal":\n' +
    '[ObservationNotDone: "DEXA Dual Energy Xray Absorptiometry, Bone Density for Urology Care"] DEXANotPerformed\n' +
    ' with "Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period" OrderTwelveMonthsADT\n' +
    ' such that DEXANotPerformed.issued 3 months or less on or after day of OrderTwelveMonthsADT.authoredOn\n' +
    ' and DEXANotPerformed.notDoneReason in "Patient Declined"\n\n' +
    'define "First ADT in 3 Months Before to 9 Months After Start of Measurement Period":\n' +
    '\tFirst(\n' +
    '("Androgen Deprivation Therapy for Urology Care Medication Active Start Dates"\n' +
    '\tunion "Androgen Deprivation Therapy for Urology Care Medication Order Start Dates") ADTDateTime\n' +
    ' with "Prostate Cancer Diagnosis" ProstateCancer\n' +
    ' such that ADTDateTime during day of ProstateCancer.prevalenceInterval()\n' +
    ' and ADTDateTime during day of Interval[start of "Measurement Period" - 3 months, start of "Measurement Period" + 9 months]\n' +
    'sort ascending\n' +
    ')\n\n' +
    'define "Order for 12 Months of ADT in 3 Months Before to 9 Months After Start of Measurement Period":\n' +
    '[ServiceRequest: "Injection of leuprolide acetate for twelve month period (regime/therapy)"] OrderTwelveMonthADT\n' +
    ' with "First ADT in 3 Months Before to 9 Months After Start of Measurement Period" FirstADTMP\n' +
    ' such that OrderTwelveMonthADT.authoredOn on or after day of FirstADTMP\n' +
    'and OrderTwelveMonthADT.authoredOn during day of Interval[start of "Measurement Period" - 3 months, start of "Measurement Period" + 9 months]\n' +
    'and OrderTwelveMonthADT.status in {\'active\', \'completed\'}\n' +
    'and OrderTwelveMonthADT.intent = \'order\'\n' +
    'and OrderTwelveMonthADT.doNotPerform is not true\n\n' +
    'define "Androgen Deprivation Therapy for Urology Care Medication Active Start Dates":\n' +
    '[MedicationRequest: "Androgen deprivation therapy for Urology Care"] ADTActive\n' +
    'let firstMedicationPeriod: First( ( collapse (ADTActive.dosageInstruction.timing.repeat.bounds DoseTime\n' +
    '\treturn DoseTime.toInterval()) ) DrugPeriods\n' +
    'sort by start of $this\n' +
    '),\n' +
    'firstMedicationEvent: First( ( ADTActive.dosageInstruction.timing dosageTiming\n' +
    '\treturn First(dosageTiming.event dosageTimingEvents sort ascending) ) firstEvents\n' +
    'sort ascending\n' +
    '),\n' +
    'medicationDateTime: NormalizeInterval(firstMedicationEvent, firstMedicationPeriod).earliest()\n' +
    'where ADTActive.status in { \'active\', \'completed\' }\n' +
    'and ADTActive.intent in { \'order\', \'original-order\', \'reflex-order\', \'filler-order\', \'instance-order\' }\n' +
    'return medicationDateTime\n\n' +
    'define "Androgen Deprivation Therapy for Urology Care Medication Order Start Dates":\n' +
    '[MedicationRequest: "Androgen deprivation therapy for Urology Care"] ADTOrder\n' +
    'let firstMedicationPeriod: First( ( collapse (ADTOrder.dosageInstruction.timing.repeat.bounds DoseTime\n' +
    '\treturn DoseTime.toInterval()) ) DrugPeriods\n' +
    'sort by start of $this\n' +
    '),\n' +
    'medicationDateTime: NormalizeInterval(ADTOrder.authoredOn, firstMedicationPeriod).earliest()\n' +
    'where ADTOrder.status in {\'active\', \'completed\'}\n' +
    'and ADTOrder.intent in { \'order\', \'original-order\', \'reflex-order\', \'filler-order\', \'instance-order\' }\n' +
    'return medicationDateTime\n\n' +
    'define "Has Qualifying Encounter":\n' +
    'exists ( ["Encounter": "Office Visit"] OfficeVisit\n' +
    ' where OfficeVisit.period during "Measurement Period"\n' +
    ' and OfficeVisit.status = \'finished\'\n' +
    ')\n\n' +
    'define "Prostate Cancer Diagnosis":\n' +
    '[Condition: "Prostate Cancer"] ProstateCancer\n' +
    ' where ProstateCancer.prevalenceInterval() overlaps "Measurement Period"\n' +
    'and ProstateCancer.clinicalStatus ~ QICoreCommon."active"\n' +
    'and ProstateCancer.verificationStatus ~ QICoreCommon."confirmed"\n\n' +
    'define function NormalizeInterval(pointInTime DateTime, dateTimeInterval Interval<DateTime>):\n' +
    'if pointInTime is not null then Interval[pointInTime, pointInTime]\n' +
    'else if dateTimeInterval is not null then dateTimeInterval\n' +
    'else null as Interval<DateTime>\n'

  public static ratioEpisodeTwoIPTwoMO = 'library HHSH version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon\n\n' +
    'valueset "Diabetes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001\'\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    'valueset "Emergency Department Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.292\'\n' +
    'valueset "Hypoglycemics Treatment Medications": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1196.394\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "Initial Population 1":\n' +
    '    [Encounter: "Encounter Inpatient"]\n\n' +
    'define "Initial Population 2":\n' +
    '    [Encounter: "Emergency Department Visit"]\n\n' +
    'define "Denominator":\n' +
    '    "Initial Population 1" IP\n' +
    '        with [Condition: "Diabetes"] Dx\n' +
    '            such that Dx.toPrevalenceInterval() starts before start of IP.period\n\n' +
    'define "Numerator":\n' +
    '    "Initial Population 2" IP\n' +
    '        with [Condition: "Diabetes"] Dx\n' +
    '            such that Dx.toPrevalenceInterval() starts before start of IP.period\n\n' +
    'define function "Denominator Observation"(TheEncounter Encounter):\n' +
    '    Count( [MedicationRequest: "Hypoglycemics Treatment Medications"] MedOrder\n' +
    '        with TheEncounter E \n' +
    '            such that MedOrder.authoredOn before start of E.period )\n\n' +
    'define function "Numerator Observation"(TheEncounter Encounter):\n' +
    '    Count( [MedicationRequest: "Hypoglycemics Treatment Medications"] MedOrder\n' +
    '        with TheEncounter E \n' +
    '            such that MedOrder.authoredOn before start of E.period )'

  public static intentionalWarningCql = 'library TestLibrary16969620425371870 version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    'include Hospice version \'6.1.000\' called Hospice\n' +
    'include Status version \'1.1.000\' called Status\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'codesystem "CPT": \'http://www.ama-assn.org/go/cpt\'\n\n' +
    'code "Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.": \'99211\' from "CPT" display \'Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "Qualifying Encounters":\n' +
    '  ( ["Encounter": "Office Visit"]\n' +
    '        union ["Encounter": "Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal."]\n' +
    '        ) ValidEncounters\n' +
    '        where QICoreCommon."ToInterval"(ValidEncounters.period) during day of "Measurement Period"'

  public static intentionalErrorCql = 'library TestLibrary16969620425371870 version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    'include Hospice version \'6.1.000\' called Hospice\n' +
    'include Status version \'1.1.000\' called Status\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'codesystem "CPT": \'http://www.ama-assn.org/go/cpt\'\n\n' +
    'code "Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.": \'99211\' from "CPT" display \'Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "IP":'
}

export class QiCore6Cql {

  public static readonly CQL_For_Cohort_Six = 'library TestLibrary4664 version \'0.0.000\'\n' +
    'using QICore version \'6.0.0\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset \"Annual Wellness Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset \"Preventive Care Services - Established Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset \"Home Healthcare Services\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'default Interval(@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    'context Patient\n' +
    'define \"Initial PopulationOne\":\n' +
    '  true\n'

  public static readonly cqlCMS529 = `library MyVersion529today version \'0.0.000\'
using QICore version \'6.0.0\'
include CQMCommon version \'4.1.000\' called CQMCommon
include FHIRHelpers version \'4.4.000\' called FHIRHelpers 
include QICoreCommon version \'4.0.000\' called QICoreCommon 
include SupplementalDataElements version \'5.1.000\' called SDE
codesystem "LOINC": \'http://loinc.org\'     
valueset "Bicarbonate lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.139\' 
valueset "Creatinine lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2363\' 
valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\' 
valueset "Glucose lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.134\' 
valueset "Hematocrit lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.114\' 
valueset "Non Invasive Oxygen Therapy by Nasal Cannula or Mask": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.209\'
valueset "Non Invasive Oxygen Therapy Device Codes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1170.57\'
valueset "Medicare Advantage payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1104.12\'
valueset "Medicare FFS payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1104.10\' 
valueset "Oxygen Saturation by Pulse Oximetry":\'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.151\' 
valueset "Potassium lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.117\' 
valueset "Sodium lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.119\' 
valueset "White blood cells count lab test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.129\' 
code "Systolic blood pressure": \'8480-6\' from "LOINC" display \'Systolic BP\'
parameter "Measurement Period" Interval<DateTime>
context Patient
define "Initial Population":
  "Inpatient Encounters"
define "Inpatient Encounters":
 [Encounter: "Encounter Inpatient"] InpatientEncounter
  with  ([Coverage: "Medicare FFS payer"] 
    union [Coverage: "Medicare Advantage payer"]) MedicarePayer 
     such that (InpatientEncounter.hospitalizationWithObservationAndOutpatientSurgeryService().lengthInDays()) <365
       and InpatientEncounter.status = \'finished\' 
        and AgeInYearsAt(date from start of InpatientEncounter.period) >=65
          and InpatientEncounter.period ends during day of "Measurement Period"
define "SDE Encounter With First Body Temperature":
 "Inpatient Encounters" EncounterInpatient
  let FirstTemperature: First([USCoreBodyTemperatureProfile] Temperature                                                              
   where Temperature.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()  
    and Temperature.status in { \'final\', \'amended\', \'corrected\' }
     and Temperature.value is not null
      sort by effective.earliest())
       return {
              EncounterId: EncounterInpatient.id,
              FirstTemperatureResult: FirstTemperature.value as Quantity,
              Timing: FirstTemperature.effective.earliest()
              }
define "SDE Encounter With First Heart Rate":
 "Inpatient Encounters" EncounterInpatient
   let FirstHeartRate: First([USCoreHeartRateProfile] HeartRate
    where HeartRate.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService() 
     and HeartRate.status in {\'final\', \'amended\', \'corrected\'}
      and HeartRate.value is not null
       sort by effective.earliest())
        return {
               EncounterId: EncounterInpatient.id,
               FirstHeartRateResult: FirstHeartRate.value as Quantity,
               Timing: FirstHeartRate.effective.earliest()
               }
define "SDE Encounter With First Oxygen Saturation":
 "Inpatient Encounters" EncounterInpatient
   let FirstOxygenSat: First(["USCorePulseOximetryProfile": "Oxygen Saturation by Pulse Oximetry"] O2Saturation)
//    where O2Saturation.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService() 
//     and O2Saturation.status in { \'final\', \'amended\', \'corrected\' }
//      and O2Saturation.value is not null
//       sort by effective.earliest() )
//        return {
//               EncounterId: EncounterInpatient.id,
//               FirstOxygenSatResult: FirstOxygenSat.value as Quantity,
//               Timing: FirstOxygenSat.effective.earliest()
//               }
define "SDE Encounter With First Respiratory Rate":
 "Inpatient Encounters" EncounterInpatient
  let FirstRespRate: First([USCoreRespiratoryRateProfile] Respirations                                                                    
   where Respirations.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()  
    and Respirations.status in { \'final\', \'amended\', \'corrected\' }
     and Respirations.value is not null
      sort by effective.earliest())
       return {
              EncounterId: EncounterInpatient.id,
              FirstRespRateResult: FirstRespRate.value as Quantity,
              Timing: FirstRespRate.effective.earliest()
              }
define "SDE Encounter With First Systolic Blood Pressure":
 "Inpatient Encounters" EncounterInpatient
   let FirstSystolicBP: First (["USCoreBloodPressureProfile"] BP
    where BP.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and BP.status in { \'final\', \'amended\', \'corrected\'}
      and BP.component.value is not null
       sort by effective.earliest ())
        return {
               EncounterId: EncounterInpatient.id,
               FirstSBPResult: FirstSystolicBP.component C where C.code ~ "Systolic blood pressure" return C.value as Quantity,
               Timing: FirstSystolicBP.effective.earliest()
               }
define "SDE Encounter With First Bicarbonate Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstBicarbonateLab: First(["LaboratoryResultObservation": "Bicarbonate lab test"] bicarbonatelab
    where bicarbonatelab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and bicarbonatelab.status in { \'final\', \'amended\', \'corrected\' }
      and bicarbonatelab.value is not null
       sort by issued.earliest())
        return {
               EncounterId: EncounterInpatient.id,
               FirstResult: FirstBicarbonateLab.value as Quantity,
               Timing: FirstBicarbonateLab.issued
               }
define "SDE Encounter With First Creatinine Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstCreatinineLab: First(["LaboratoryResultObservation": "Creatinine lab test"] CreatinineLab
    where CreatinineLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and CreatinineLab.status in { \'final\', \'amended\', \'corrected\' }
      and CreatinineLab.value is not null
       sort by issued.earliest())
        return {
               EncounterId: EncounterInpatient.id,
               FirstResult: FirstCreatinineLab.value as Quantity,
               Timing: FirstCreatinineLab.issued
               }
define "SDE Encounter With First Glucose Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstGlucoseLab: First(["LaboratoryResultObservation": "Glucose lab test"] GlucoseLab
    where GlucoseLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and GlucoseLab.status in { \'final\', \'amended\', \'corrected\' }
      and GlucoseLab.value is not null
       sort by issued.earliest())
        return {
               EncounterId: EncounterInpatient.id,
               FirstResult: FirstGlucoseLab.value as Quantity,
               Timing: FirstGlucoseLab.issued
               }
define "SDE Encounter With First Hematocrit Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstHematocritLab: First(["LaboratoryResultObservation": "Hematocrit lab test"] HematocritLab
    where HematocritLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and HematocritLab.status in { \'final\', \'amended\', \'corrected\' }
      and HematocritLab.value is not null
       sort by issued.earliest())
        return {
               EncounterId: EncounterInpatient.id,
               FirstResult: FirstHematocritLab.value as Quantity,
               Timing: FirstHematocritLab.issued
               }
define "SDE Encounter With First Potassium Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstPotassiumLab: First(["LaboratoryResultObservation": "Potassium lab test"] PotassiumLab
     where PotassiumLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
      and PotassiumLab.status in { \'final\', \'amended\', \'corrected\' }
       and PotassiumLab.value is not null
        sort by issued.earliest())
         return {
                EncounterId: EncounterInpatient.id,
                FirstResult: FirstPotassiumLab.value as Quantity,
                Timing: FirstPotassiumLab.issued
                }
define "SDE Encounter With First Sodium Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstSodiumLab: First(["LaboratoryResultObservation": "Sodium lab test"] SodiumLab
    where SodiumLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and SodiumLab.status in { \'final\', \'amended\', \'corrected\' }
      and SodiumLab.value is not null
       sort by issued.earliest())
        return {
                EncounterId: EncounterInpatient.id,
                FirstResult: FirstSodiumLab.value as Quantity,
                Timing: FirstSodiumLab.issued
                } 
define "SDE Encounter With First White Blood Cells Lab Test":
 "Inpatient Encounters" EncounterInpatient
   let FirstWhiteBloodCellLab: First(["LaboratoryResultObservation": "White blood cells count lab test"] WhiteBloodCellLab
    where WhiteBloodCellLab.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
     and WhiteBloodCellLab.status in { \'final\', \'amended\', \'corrected\' }
      and WhiteBloodCellLab.value is not null
       sort by issued.earliest())
        return {
                EncounterId: EncounterInpatient.id,
                FirstResult: FirstWhiteBloodCellLab.value as Quantity,
                Timing: FirstWhiteBloodCellLab.issued
                }
define "SDE Encounter With First Weight Recorded":
 "Inpatient Encounters" EncounterInpatient
   let FirstWeight: First( ["USCoreBodyWeightProfile"] WeightExam
     where WeightExam.effective.earliest() during EncounterInpatient.hospitalizationWithObservationAndOutpatientSurgeryService()
       and WeightExam.status in {\'final\', \'amended\', \'corrected\'}
        and WeightExam.value is not null
         sort by effective.earliest() )
          return {
                  EncounterId: EncounterInpatient.id,
                  FirstResult: FirstWeight.value as Quantity,
                  Timing: FirstWeight.effective.earliest()
                  }
define "SDE Encounter With Oxygen 60 Minutes Or Less Prior To ED Admission Or During ED":
 "Initial Population" EncounterInpatient
  where exists (([ServiceRequest: "Non Invasive Oxygen Therapy by Nasal Cannula or Mask"] 
   union [ServiceRequest: "Non Invasive Oxygen Therapy Device Codes"]) OxygenTherapyOrder
    where (OxygenTherapyOrder.authoredOn during EncounterInpatient.edVisit().period
     or OxygenTherapyOrder.authoredOn 60 minutes or less before or on start of EncounterInpatient.edVisit().period)
      and OxygenTherapyOrder.status in { \'active\', \'completed\' }
        and OxygenTherapyOrder.intent = \'order\'
          return {
                 EncounterId: EncounterInpatient.id,
                 OrderStatus: OxygenTherapyOrder.status,
                 OrderTiming: OxygenTherapyOrder.authoredOn  
                 })
     or exists ([Procedure: "Non Invasive Oxygen Therapy by Nasal Cannula or Mask"] OxygenAdminInterv
      where  (OxygenAdminInterv.performed.toInterval() starts during EncounterInpatient.edVisit().period
       or OxygenAdminInterv.performed.toInterval() 60 minutes or less before or on start of EncounterInpatient.edVisit().period)
        and OxygenAdminInterv.status = \'completed\' 
         return {
                EncounterId: EncounterInpatient.id,
                EDEncounterTiming: EncounterInpatient.edVisit().period,
                PerformedStatus: OxygenAdminInterv.status, 
                PerformedTiming: OxygenAdminInterv.performed.toInterval()
               })
define "SDE Ethnicity":
  SDE."SDE Ethnicity"
define "SDE Payer":
  SDE."SDE Payer"
define "SDE Race":
  SDE."SDE Race"
define "SDE Sex":
  SDE."SDE Sex"`

  public static readonly cqlCMS1017 = `library My1017on87 version '0.0.000'
using QICore version '6.0.0'
include FHIRHelpers version '4.4.000' called FHIRHelpers
include SupplementalDataElements version '5.1.000' called SDE
include CQMCommon version '4.1.000' called CQMCommon
include QICoreCommon version '4.0.000' called QICoreCommon
include CumulativeMedicationDuration version '6.0.000' called CMD
codesystem "LOINC": 'http://loinc.org'
valueset "Abnormal Weight Loss": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1258.2'
valueset "Anticoagulants for All Indications": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.22'
valueset "Antidepressants": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.163'
valueset "Antihypertensives": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.164'
valueset "Central Nervous System Depressants": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.134'
valueset "Coagulation Disorders": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.23'
valueset "Delirium, Dementia, and Other Psychoses": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.168'
valueset "Depression": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.169'
valueset "Diuretics": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.170'
valueset "Epilepsy": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.171'
valueset "Inpatient Falls": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1147.171'

valueset "Leukemia or Lymphoma": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.136'
valueset "Liver Disease Moderate to Severe": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.137'
valueset "Major Injuries": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1147.120'
valueset "Malignant Bone Disease": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.24'
valueset "Malnutrition": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1272.1'
valueset "Moderate Injuries": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.205'
valueset "Neurologic Movement and Related Disorders": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.174'
valueset "Not Present On Admission or Documentation Insufficient to Determine": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1147.198'
valueset "Obesity": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.162'
valueset "Opioids": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.120'
valueset "Osteoporosis": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1200.147'
valueset "Peripheral Neuropathy": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.175'
valueset "Present on Admission or Clinically Undetermined": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1147.197'
valueset "Stroke": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.176'
valueset "Suicide Attempt": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1248.130'

parameter "Measurement Period" Interval<DateTime>
context Patient
define "Qualifying Encounter":
    CQMCommon."Inpatient Encounter" InpatientEncounter
    where InpatientEncounter.hospitalizationWithObservation().lengthInDays() <= 120
      and AgeInYearsAt(date from start of InpatientEncounter.period) >= 18
define "Initial Population":
  "Qualifying Encounter"
define "Denominator":
   "Initial Population"
define "Numerator":
  "Encounter Where A Fall And Major Injury Occurred Not POA"
    union "Encounter Where A Fall And Moderate Injury Occurred Not POA" 
define "Encounter Where A Fall And Moderate Injury Occurred Not POA":
  "Encounter With A Fall Not Present On Admission" FallOccurred
    where exists (
      (FallOccurred.claimDiagnosis()) ModerateFallOccurred
        where (
          ModerateFallOccurred.onAdmission is null 
          or ModerateFallOccurred.onAdmission in "Not Present On Admission or Documentation Insufficient to Determine"
        )
        and (
          ModerateFallOccurred.diagnosis in "Moderate Injuries"
          or ModerateFallOccurred.diagnosis.getCondition().code in "Moderate Injuries"
        )
    )
define "Encounter Where A Fall And Major Injury Occurred Not POA":
  "Encounter With A Fall Not Present On Admission" FallOccurred
    where exists (
      (FallOccurred.claimDiagnosis()) MajorFallOccurred
        where (
          MajorFallOccurred.onAdmission is null 
          or MajorFallOccurred.onAdmission in "Not Present On Admission or Documentation Insufficient to Determine"
        )
        and (
          MajorFallOccurred.diagnosis in "Major Injuries"
          or MajorFallOccurred.diagnosis.getCondition().code in "Major Injuries"
        )
    )
define "Encounter Where A Fall Occurred":
  "Encounter With A Fall Diagnosis"
        union "Encounter With A Fall Event"
define "Encounter With A Fall Not Present On Admission":
   "Encounter Where A Fall Occurred" InpatientEncounter
      where InpatientEncounter.hasDiagnosisNotPresentOnAdmissionOrNull("Inpatient Falls") 
define "Encounter With A Fall Diagnosis":
  "Qualifying Encounter" QualifyingEncounter
    where QualifyingEncounter.reasonCode in "Inpatient Falls"
     or QualifyingEncounter.encountersDiagnosis().code in "Inpatient Falls"
define "Encounter With A Fall Event":
  "Qualifying Encounter" InpatientEncounter
    with [AdverseEvent: "Inpatient Falls"] FallsDocumentation
      such that Coalesce(FallsDocumentation.date, FallsDocumentation.recordedDate)during InpatientEncounter.hospitalizationWithObservation()
define "Denominator Exclusions":
  "Encounter With A Fall Present On Admission"
define "Numerator Exclusions":
  "Encounter With A Fall Present On Admission"
define "Encounter With A Fall Present On Admission":
  "Qualifying Encounter" InpatientEncounter
    where InpatientEncounter.hasDiagnosisPresentOnAdmission("Inpatient Falls")
define "Risk Variable Body Mass Index (BMI)":
  from
    ["USCoreBMIProfile"] BMI
    with "Qualifying Encounter" InpatientEncounter
      such that BMI.effective.toInterval() starts during InpatientEncounter.hospitalizationWithObservation()
        and BMI.value is not null
        and BMI.status in { 'final', 'amended', 'corrected' }
    return BMI.value as Quantity
define "Risk Variable All Encounter Diagnoses with Rank and POA Indication":
  from "Qualifying Encounter" InpatientEncounter
  let 
      claim: ([Claim] C where C.status = 'active' and C.use = 'claim' and exists (C.item ClaimItem where ClaimItem.encounter.references(InpatientEncounter))),
      claimItem: (claim.item ClaimItem where ClaimItem.encounter.references(InpatientEncounter))
  return Tuple {
    encounterId: InpatientEncounter.id,
    diagnosis: claim.diagnosis,
    rank: claim.diagnosis.sequence,
    POA: claim.diagnosis Diag where Diag.onAdmission in "Present on Admission or Clinically Undetermined" or Diag.onAdmission in "Not Present On Admission or Documentation Insufficient to Determine"
    }
define "Risk Variable Encounter with Abnormal Weight Loss or Malnutrition Present on Admission":
  "Qualifying Encounter" InpatientEncounter
    where InpatientEncounter.hasDiagnosisPresentOnAdmission("Abnormal Weight Loss") or InpatientEncounter.hasDiagnosisPresentOnAdmission("Malnutrition")
define "Risk Variable Encounter with Anticoagulant Active at Admission":
  "Qualifying Encounter" InpatientEncounter
        with ["MedicationRequest": "Anticoagulants for All Indications"] Anticoagulants
          such that Anticoagulants.status in { 'active', 'completed' }
            and ( Anticoagulants.intent = 'order'
                or ( Anticoagulants.intent = 'plan'
                    and Anticoagulants.subject.reference.getId() = Patient.id
                )
            )
            and Anticoagulants.isCommunity()
            and Anticoagulants.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with Anticoagulant Administration During Encounter":
  "Qualifying Encounter" InpatientEncounter
    with ["MedicationAdministration": "Anticoagulants for All Indications"] Anticoagulants
      such that Anticoagulants.effective.toInterval() starts during InpatientEncounter.hospitalizationWithObservation()
        and Anticoagulants.status in { 'in-progress', 'completed' }
define "Risk Variable Encounter with Antidepressant Active at Admission":
  "Qualifying Encounter" InpatientEncounter
        with ["MedicationRequest": "Antidepressants"] AntidepressantMed
          such that AntidepressantMed.status in { 'active', 'completed' }
            and ( AntidepressantMed.intent = 'order'
                or ( AntidepressantMed.intent = 'plan'
                    and AntidepressantMed.subject.reference.getId() = Patient.id
                )
            )
            and AntidepressantMed.isCommunity()
            and AntidepressantMed.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with Antihypertensive Active at Admission":
  "Qualifying Encounter" InpatientEncounter
          with ["MedicationRequest": "Antihypertensives"] BPMed
            such that BPMed.status in { 'active', 'completed' }
              and ( BPMed.intent = 'order'
                  or ( BPMed.intent = 'plan'
                      and BPMed.subject.reference.getId() = Patient.id
                  )
              )
              and BPMed.isCommunity()
              and BPMed.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with CNS Depressant Active at Admission":
  "Qualifying Encounter" InpatientEncounter
          with ["MedicationRequest": "Central Nervous System Depressants"] CNSMed
            such that CNSMed.status in { 'active', 'completed' }
              and ( CNSMed.intent = 'order'
                  or ( CNSMed.intent = 'plan'
                      and CNSMed.subject.reference.getId() = Patient.id
                  )
              )
              and CNSMed.isCommunity()
              and CNSMed.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with Diuretic Active at Admission":
  "Qualifying Encounter" InpatientEncounter
          with ["MedicationRequest": "Diuretics"] DiureticMed
            such that DiureticMed.status in { 'active', 'completed' }
              and ( DiureticMed.intent = 'order'
                  or ( DiureticMed.intent = 'plan'
                      and DiureticMed.subject.reference.getId() = Patient.id
                  )
              )
              and DiureticMed.isCommunity()
              and DiureticMed.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with Opioid Medication Active at Admission":
  "Qualifying Encounter" InpatientEncounter
          with ["MedicationRequest": "Opioids"] OpioidMed
            such that OpioidMed.status in { 'active', 'completed' }
              and ( OpioidMed.intent = 'order'
                  or ( OpioidMed.intent = 'plan'
                      and OpioidMed.subject.reference.getId() = Patient.id
                  )
              )
              and OpioidMed.isCommunity()
              and OpioidMed.medicationRequestPeriod() overlaps before InpatientEncounter.period
define "Risk Variable Encounter with Coagulation Disorder Present on Admission":
  "Qualifying Encounter" InpatientEncounter
          where InpatientEncounter.hasDiagnosisPresentOnAdmission("Coagulation Disorders")
define "Risk Variable Encounter with Delirium or Dementia or Other Psychosis Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Delirium, Dementia, and Other Psychoses")
define "Risk Variable Encounter with Depression Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Depression")
define "Risk Variable Encounter with Epilepsy Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Epilepsy")
define "Risk Variable Encounter with Leukemia or Lymphoma Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Leukemia or Lymphoma")
define "Risk Variable Encounter with Liver Disease Moderate to Severe Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Liver Disease Moderate to Severe")
define "Risk Variable Encounter with Malignant Bone Disease Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Malignant Bone Disease")
define "Risk Variable Encounter with Neurologic Disorder Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Neurologic Movement and Related Disorders")
define "Risk Variable Encounter with Obesity Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Obesity")
define "Risk Variable Encounter with Osteoporosis Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Osteoporosis")
define "Risk Variable Encounter with Peripheral Neuropathy Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Peripheral Neuropathy")
define "Risk Variable Encounter with Stroke Present on Admission":
  "Qualifying Encounter" InpatientEncounter
         where InpatientEncounter.hasDiagnosisPresentOnAdmission("Stroke")
define "Risk Variable Encounter with Suicide Attempt":
  "Qualifying Encounter" InpatientEncounter
                   where InpatientEncounter.encountersDiagnosis().code in "Suicide Attempt"
define "SDE Ethnicity":
  SDE."SDE Ethnicity"
define "SDE Payer":
  SDE."SDE Payer"
define "SDE Race":
  SDE."SDE Race"
define "SDE Sex":
  SDE."SDE Sex"
define function "Denominator Observation"(QualifyingEncounter Encounter ):
  duration in days of QualifyingEncounter.hospitalizationWithObservation()
define function "Numerator Observation"(QualifyingEncounter Encounter ):
  Count("Numerator" FallsEncounter
      where FallsEncounter.period ends during QualifyingEncounter.hospitalizationWithObservation()
  )
define fluent function hasDiagnosisPresentOnAdmission(encounter Encounter, diagnosisValueSet ValueSet):
exists (
  encounter InptEncounter
    let 
      claim: ([Claim] Claims where Claims.status = 'active' and Claims.use = 'claim' and exists (Claims.item ClaimsItem where ClaimsItem.encounter.references(InptEncounter))),
      claimItem: (claim.item ClaimsItem where ClaimsItem.encounter.references(InptEncounter))
    return claim.diagnosis ClaimsDiag where ClaimsDiag.sequence in claimItem.diagnosisSequence and ClaimsDiag.onAdmission in "Present on Admission or Clinically Undetermined" and ClaimsDiag.diagnosis in diagnosisValueSet) 
define fluent function hasDiagnosisNotPresentOnAdmission(encounter Encounter, diagnosisValueSet ValueSet):
exists (
  encounter InpatientEncounter
    let 
      claim: ([Claim] Claims where Claims.status = 'active' and Claims.use = 'claim' and exists (Claims.item ClaimsItem where ClaimsItem.encounter.references(InpatientEncounter))),
      claimItem: (claim.item ClaimsItem where ClaimsItem.encounter.references(InpatientEncounter))
    return claim.diagnosis ClaimsDiag where ClaimsDiag.sequence in claimItem.diagnosisSequence and ( ClaimsDiag.onAdmission in "Not Present On Admission or Documentation Insufficient to Determine") and ClaimsDiag.diagnosis in diagnosisValueSet
)
define fluent function hasDiagnosisNotPresentOnAdmissionOrNull(encounter Encounter, diagnosisValueSet ValueSet):
  exists (
    [Claim] C
      where C.status = 'active'
        and C.use = 'claim'
        and exists (
          C.item I
            where I.encounter.references(encounter)
        )
      return C.diagnosis D
        where exists (
          C.item I
            where I.encounter.references(encounter)
              and D.sequence in I.diagnosisSequence
        )
        and (
          D.onAdmission is null
          or D.onAdmission in "Not Present On Admission or Documentation Insufficient to Determine"
        )
        and D.diagnosis in diagnosisValueSet
  )
define fluent function encountersDiagnosis(Encounter Encounter ):
  // There is a problem in the CQMCommon fluent function 'encounterDiagnosis' wherein the union operation isn't working as used.  
  // This function fixes that usage, but should be considered temporary until the library function works properly 
  Encounter.reasonReference EncDiag
    return singleton from (([ConditionEncounterDiagnosis] ConditionED  union [ConditionProblemsHealthConcerns] ConditionPHC) Cond where EncDiag.references(Cond.id))`

  public static readonly cqlCMS1272 = `library My1272Today version '0.0.000'
using QICore version '6.0.0'
include CQMCommon version '4.1.000' called CQMCommon
include FHIRHelpers version '4.4.000' called FHIRHelpers
include QICoreCommon version '4.0.000' called QICoreCommon
include SupplementalDataElements version '5.1.000' called SDE
valueset "Analgesics for Acute Pain": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1160.43'
valueset "Analgesics for Acute Pain (Non Parenteral Route)": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1160.73'
valueset "Analgesics for Acute Pain (Parenteral Route)": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1160.74'
valueset "Emergency Department Evaluation and Management Visit": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1010'
valueset "Sickle Cell Disease with Vaso Occlusive Episode": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1160.42'
parameter "Measurement Period" Interval<DateTime>
context Patient
define "ED Encounter With Principal Diagnosis Of SCD With VOE":
  [Encounter: "Emergency Department Evaluation and Management Visit"] EDEncounter
    where end of EDEncounter.period during day of "Measurement Period"
      and EDEncounter.status = 'finished'
      and EDEncounter.hasPrincipalDiagnosisOf("Sickle Cell Disease with Vaso Occlusive Episode")
define "Pain Medications Administered During ED Encounter":
  ["MedicationAdministration": "Analgesics for Acute Pain"] PainMed
    with "ED Encounter With Principal Diagnosis Of SCD With VOE" SCDwVOEEncounter
      such that PainMed.status = 'completed'
        and start of PainMed.effective during SCDwVOEEncounter.period
define "ED Encounter For SCD With VOE With Pain Medication Administered":
  "ED Encounter With Principal Diagnosis Of SCD With VOE" SCDwVOEEncounter
    with "Pain Medications Administered During ED Encounter" PainMed
      such that start of PainMed.effective during SCDwVOEEncounter.period
define "Initial Population":
  "ED Encounter For SCD With VOE With Pain Medication Administered"
define "Measure Population":
  "Initial Population"
define fluent function firstPainMedicationAdministration(SCDwVOEEncounterWithPainMed Encounter):
  First("Pain Medications Administered During ED Encounter" PainMed
    sort by start of effective)
define function "Measure Observation"(SCDwVOEEncounterWithPainMed Encounter):
  difference in minutes between
    start of SCDwVOEEncounterWithPainMed.period
    and start of SCDwVOEEncounterWithPainMed.firstPainMedicationAdministration().effective 
define function FirstParenteralPainMed(SCDwVOEEncounter Encounter):
  First( ["MedicationAdministration": "Analgesics for Acute Pain (Parenteral Route)"
    ] ParenteralPainMed
      where ParenteralPainMed.status = 'completed'
        and start of ParenteralPainMed.effective during SCDwVOEEncounter.period
      sort by start of effective
  )
define function FirstNonParenteralPainMed(SCDwVOEEncounter Encounter):
  First( ["MedicationAdministration": "Analgesics for Acute Pain (Non Parenteral Route)"
    ] NonParenteralPainMed
      where NonParenteralPainMed.status = 'completed'
        and start of NonParenteralPainMed.effective during SCDwVOEEncounter.period
      sort by start of effective
  )
define "ED Encounters Where First Pain Medication Was Administered Via Parenteral Route":
  "ED Encounter For SCD With VOE With Pain Medication Administered" Encounter
    let FirstParenteral: FirstParenteralPainMed(Encounter),
        FirstNonParenteral: FirstNonParenteralPainMed(Encounter)
    where FirstNonParenteral is null
      or start of FirstParenteral.effective on or before start of FirstNonParenteral.effective
    return Encounter
define "ED Encounters Where First Pain Medication Was Administered Via Non-Parenteral Route":
  "ED Encounter For SCD With VOE With Pain Medication Administered" Encounter
    let FirstParenteral: FirstParenteralPainMed(Encounter),
        FirstNonParenteral: FirstNonParenteralPainMed(Encounter)
    where FirstParenteral is null
      or start of FirstNonParenteral.effective before start of FirstParenteral.effective
    return Encounter
define "Stratification 1":
  "ED Encounters Where First Pain Medication Was Administered Via Parenteral Route"
define "Stratification 2":
  "ED Encounters Where First Pain Medication Was Administered Via Non-Parenteral Route"
define "SDE Ethnicity":
  SDE."SDE Ethnicity"
define "SDE Payer":
  SDE."SDE Payer"
define "SDE Race":
  SDE."SDE Race"
define "SDE Sex":
  SDE."SDE Sex"`
}
