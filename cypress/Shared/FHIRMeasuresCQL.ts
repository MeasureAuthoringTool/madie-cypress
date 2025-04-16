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
        'and ValidEncounter.isFinishedEncounter()\n' +
        'define \"Initial PopulationOne\":\n' +
        'true\n' +
        'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
        '(Enc E where E.status = \'finished\') is not null\n'

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
}
