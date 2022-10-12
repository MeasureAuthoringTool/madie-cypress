
export class MeasureCQL {

    public static readonly SBTESTCMS347_CQL = 'library SBTESTCMS347 version \'0.0.016\'\n' +
        '\n' +
        'using FHIR version \'4.0.1\'\n' +
        '\n' +
        'include FHIRHelpers version \'4.0.001\' called FHIRHelpers\n' +
        'include SupplementalDataElementsFHIR4 version \'2.0.000\' called SDE\n' +
        'include MATGlobalCommonFunctionsFHIR4 version \'6.1.000\' called Global\n' +
        '\n' +
        'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\' \n' +
        '\n' +
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
        'valueset "Statin Associated Muscle Symptoms": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1108.85\' \n' +
        '\n' +
        'code "Encounter for palliative care": \'Z51.5\' from "ICD10CM" display \'Encounter for palliative care\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Denominator 1":\n' +
        '  "Initial Population 1"\n' +
        '\n' +
        'define "Denominator 2":\n' +
        '  "Initial Population 2"\n' +
        '\n' +
        'define "Denominator 3":\n' +
        '  "Initial Population 3"\n' +
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
        'define "Patients Age 20 or Older at Start of Measurement Period":\n' +
        '  AgeInYearsAt (start of "Measurement Period") >= 20\n' +
        '\n' +
        'define "Initial Population 1":\n' +
        '  exists "ASCVD Diagnosis or Procedure before End of Measurement Period" \n' +
        '                and exists "Qualifying Encounter during Measurement Period"\n' +
        '\n' +
        'define "Initial Population 2":\n' +
        '  "Patients Age 20 Years and Older with LDL Cholesterol Result Greater than or Equal to 190 or Hypercholesterolemia without ASCVD" \n' +
        '                and exists "Qualifying Encounter during Measurement Period"\n' +
        '\n' +
        'define "Initial Population 3":\n' +
        '  "Patients Age 40 to 75 Years with Diabetes without ASCVD or LDL Greater than 190 or Hypercholesterolemia" \n' +
        '                and exists "Qualifying Encounter during Measurement Period"\n' +
        '\n' +
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
        '                )\n' +
        '\n' +
        'define "Denominator Exceptions":\n' +
        '  "Has Allergy to Statin" \n' +
        '                    or "Has Order or Receiving Hospice Care or Palliative Care"\n' +
        '                    or "Has Hepatitis or Liver Disease Diagnosis"\n' +
        '                    or "Has Statin Associated Muscle Symptoms"\n' +
        '                    or "Has ESRD Diagnosis"\n' +
        '                    or "Has Adverse Reaction to Statin"\n' +
        '\n' +
        'define "Denominator Exclusions":\n' +
        '  exists ( ( [Condition: "Pregnancy or Other Related Diagnoses"]\n' +
        '                    union [Condition: "Breastfeeding"]\n' +
        '                    union [Condition: "Rhabdomyolysis"] ) ExclusionDiagnosis\n' +
        '                    where Global."Prevalence Period" ( ExclusionDiagnosis ) overlaps "Measurement Period")\n' +
        '\n' +
        'define "Has Adverse Reaction to Statin":\n' +
        '  exists ([AdverseEvent: "Statin Allergen"] StatinReaction\n' +
        '                    where StatinReaction.date during "Measurement Period")\n' +
        '\n' +
        'define "Has Allergy to Statin":\n' +
        '  exists ([AllergyIntolerance: "Statin Allergen"] StatinAllergy\n' +
        '                    where Global."Normalize Interval"(StatinAllergy.onset) starts before end of "Measurement Period")\n' +
        '\n' +
        'define "Has Diabetes Diagnosis":\n' +
        '  exists ( [Condition: "Diabetes"] Diabetes\n' +
        '                    where Global."Prevalence Period" ( Diabetes ) overlaps "Measurement Period")\n' +
        '\n' +
        'define "Has ESRD Diagnosis":\n' +
        '  exists ( [Condition: "End Stage Renal Disease"] ESRD\n' +
        '                    where Global."Prevalence Period" ( ESRD) overlaps "Measurement Period")\n' +
        '\n' +
        'define "Has Hepatitis or Liver Disease Diagnosis":\n' +
        '  exists ( ( [Condition: "Hepatitis A"]\n' +
        '                    union [Condition: "Hepatitis B"]\n' +
        '                    union [Condition: "Liver Disease"] ) HepatitisLiverDisease\n' +
        '                    where Global."Prevalence Period" ( HepatitisLiverDisease ) overlaps "Measurement Period")\n' +
        '\n' +
        'define "Has Statin Associated Muscle Symptoms":\n' +
        '  exists(["Condition": "Statin Associated Muscle Symptoms"] StatinMuscleSymptom\n' +
        '                    where Global."Prevalence Period" ( StatinMuscleSymptom ) starts before end of "Measurement Period")\n' +
        '\n' +
        'define "Hypercholesterolemia Diagnosis":\n' +
        '  [Condition: "Hypercholesterolemia"] Hypercholesterolemia \n' +
        '                    where Global."Prevalence Period" (Hypercholesterolemia) starts before end of "Measurement Period"\n' +
        '\n' +
        'define "LDL Result Greater Than or Equal To 190":\n' +
        '  [Observation: "LDL Cholesterol"] LDL\n' +
        '                    where LDL.value >= 190 \'mg/dL\'\n' +
        '                    and Global."Normalize Interval" (LDL.effective) starts before end of "Measurement Period"\n' +
        '                    and LDL.status in { \'final\', \'amended\', \'corrected\', \'appended\' }\n' +
        '\n' +
        'define "Numerator":\n' +
        '  exists "Statin Therapy Ordered during Measurement Period"\n' +
        '                or exists "Prescribed Statin Therapy Any Time during Measurement Period"\n' +
        '\n' +
        'define "Patients Age 20 Years and Older with LDL Cholesterol Result Greater than or Equal to 190 or Hypercholesterolemia without ASCVD":\n' +
        '  "Patients Age 20 or Older at Start of Measurement Period" \n' +
        '                and exists ("LDL Result Greater Than or Equal To 190" \n' +
        '                    union "Hypercholesterolemia Diagnosis") \n' +
        '                and not exists ("ASCVD Diagnosis or Procedure before End of Measurement Period")\n' +
        '\n' +
        'define "Patients Age 40 to 75 Years with Diabetes without ASCVD or LDL Greater than 190 or Hypercholesterolemia":\n' +
        '  AgeInYearsAt (start of "Measurement Period") in Interval[40,75] \n' +
        '                and "Has Diabetes Diagnosis" \n' +
        '                and not exists "ASCVD Diagnosis or Procedure before End of Measurement Period" \n' +
        '                and not exists "LDL Result Greater Than or Equal To 190" \n' +
        '                and not exists "Hypercholesterolemia Diagnosis"\n' +
        '\n' +
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
        '                    and ValidEncounter.status = \'finished\'\n' +
        '\n' +
        'define "Statin Therapy Ordered during Measurement Period":\n' +
        '  ( [MedicationRequest: "Low Intensity Statin Therapy"]\n' +
        '                union [MedicationRequest: "Moderate Intensity Statin Therapy"]\n' +
        '                union [MedicationRequest: "High Intensity Statin Therapy"] ) StatinOrdered\n' +
        '                    where StatinOrdered.authoredOn during "Measurement Period"\n' +
        '                    and StatinOrdered.status in { \'active\', \'completed\' }\n' +
        '                    and StatinOrdered.intent = \'order\'\n' +
        '\n' +
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
        '                )\n' +
        '\n' +
        'define "Prescribed Statin Therapy Any Time during Measurement Period":\n' +
        '  ( [MedicationRequest: "Low Intensity Statin Therapy"]\n' +
        '                union [MedicationRequest: "Moderate Intensity Statin Therapy"]\n' +
        '                union [MedicationRequest: "High Intensity Statin Therapy"] ) ActiveStatin\n' +
        '                where exists ( ActiveStatin.dosageInstruction.timing T\n' +
        '                    where Global."Normalize Interval" ( T.repeat.bounds ) overlaps "Measurement Period"\n' +
        '                )\n' +
        '                  and ActiveStatin.status in { \'active\', \'completed\' }\n' +
        '\n' +
        'define "Denominator Exceptions 1":\n' +
        '  true\n' +
        '\n' +
        'define "Denominator Exceptions 2":\n' +
        '  true\n' +
        '\n' +
        'define "Denominator Exceptions 3":\n' +
        '  true\n' +
        '\n'

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

        public static readonly SBTEST_CQL = 'library SimpleFhirLibrary version \'0.0.004\'\n' +



        'using FHIR version \'4.0.1\'\n' +
        
        
        
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        
        
        
        'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
        
        
        
        'parameter \"Measurement Period\" Interval<DateTime>\n' +
        
        
        
        'context Patient\n' +
        
        
        
        'define \"ipp\":\n' +
        
          'exists [\"Encounter\": \"Office Visit\"] E where E.period.start during \"Measurement Period\"\n' +
          
          
          
        'define \"denom\":\n' +
        
          '\"ipp\"\n' +
          
          
          
        'define \"num\":\n' +
        
          'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'

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

    public static readonly ICFTest_CQL = 'library EXM124v7QICore4 version \'7.0.000\'\n'+

    '/*\n' +
    'Based on CMS124v7 - Cervical Cancer Screening\n' +
    '*/\n' +
    
    '/*\n' +
    'This example is a work in progress and should not be considered a final specification\n' +
    'or recommendation for guidance. This example will help guide and direct the process\n' +
    'of finding conventions and usage patterns that meet the needs of the various stakeholders\n' +
    'in the measure development community.\n' +
    '*/\n' +
    
    'using QICore version \'4.1.0\'\n' +
    
    'include FHIRHelpers version \'4.0.001\'\n' +
    
    'include HospiceQICore4 version \'2.0.000\' called Hospice\n' +
    'include AdultOutpatientEncountersQICore4 version \'2.0.000\' called AdultOutpatientEncounters\n' +
    'include MATGlobalCommonFunctionsQICore4 version \'5.0.000\' called Global\n' +
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
    
    'define \"SDE Ethnicity\":\n' +
    '  SDE.\"SDE Ethnicity\"\n' +
    
    'define \"SDE Payer\":\n' +
    '  SDE.\"SDE Payer\"\n' +
    
    'define \"SDE Race\":\n' +
    '  SDE.\"SDE Race\"\n' +
    
    'define \"SDE Sex\":\n' +
    '  SDE.\"SDE Sex\"\n' +
    
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
}