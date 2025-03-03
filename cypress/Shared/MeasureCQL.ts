
export class MeasureCQL {
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

    public static readonly zipfileExportQICore = 'library TestLibrary1678378360032 version \'0.0.000\'\n' +
        '\n' +
        'using QICore version \'4.1.1\'\n' +
        '\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
        'include CQMCommon version \'1.0.000\' called CQMCommon \n' +
        'include FHIRCommon version \'4.1.000\' called FHIRCommon\n' +
        '\n' + '\n' +
        'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
        'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
        '\n' + '\n' + '\n' +
        'valueset "Care Services in Long-Term Residential Facility": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1014\' \n' +
        'valueset "Diabetic Retinopathy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.327\' \n' +
        'valueset "Level of Severity of Retinopathy Findings": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1283\' \n' +
        'valueset "Macular Edema Findings Present": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1320\' \n' +
        'valueset "Macular Exam": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1251\' \n' +
        'valueset "Medical Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1007\' \n' +
        'valueset "Nursing Facility Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1012\' \n' +
        'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
        'valueset "Ophthalmological Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1285\' \n' +
        'valueset "Patient Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1008\' \n' +
        '\n' +
        'code "Healthcare professional (occupation)": \'223366009\' from "SNOMEDCT" display \'Healthcare professional (occupation)\'\n' +
        'code "Medical practitioner (occupation)": \'158965000\' from "SNOMEDCT" display \'Medical practitioner (occupation)\'\n' +
        'code "Ophthalmologist (occupation)": \'422234006\' from "SNOMEDCT" display \'Ophthalmologist (occupation)\'\n' +
        'code "Optometrist (occupation)": \'28229004\' from "SNOMEDCT" display \'Optometrist (occupation)\'\n' +
        'code "Physician (occupation)": \'309343006\' from "SNOMEDCT" display \'Physician (occupation)\'\n' +
        'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
        'code "Macular edema absent (situation)": \'428341000124108\' from "SNOMEDCT" display \'Macular edema absent (situation)\'\n' +
        'code "AMB" : \'AMB\' from "ActCode" display \'Ambulatory\'\n' +
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
        '\n' + '\n' + '\n' +
        'define "ipp":\n' +
        'true\n' +
        '\n' +
        'define "num":\n' +
        'true\n' +
        '\n' +
        'define "denom":\n' +
        'true'

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

    public static readonly qdmCQLManifestTest = 'library QDMManifestTestCQL version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
        'include TJCOverallQDM version \'8.0.000\' called TJC\n' +
        '\n' +
        'valueset \"Antithrombotic Therapy for Ischemic Stroke\": \'urn:oid:2.16.840.1.113762.1.4.1110.62\'\n' +
        'valueset \"Ethnicity\": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset \"Medical Reason For Not Providing Treatment\": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.473\'\n' +
        'valueset \"ONC Administrative Sex\": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset \"Patient Refusal\": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.93\'\n' +
        'valueset \"Payer Type\": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset \"Pharmacological Contraindications For Antithrombotic Therapy\": \'urn:oid:2.16.840.1.113762.1.4.1110.52\'\n' +
        'valueset \"Race\": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n' +
        '\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer Type\"]\n' +
        '\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n' +
        '\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n' +
        '\n' +
        'define \"Denominator Exclusions\":\n' +
        '  TJC.\"Ischemic Stroke Encounters with Discharge Disposition\"\n' +
        '    union TJC.\"Encounter with Comfort Measures during Hospitalization\"\n' +
        '\n' +
        'define \"Encounter with Pharmacological Contraindications for Antithrombotic Therapy at Discharge\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with [\"Medication, Discharge\": \"Pharmacological Contraindications For Antithrombotic Therapy\"] Pharmacological\n' +
        '      such that Pharmacological.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n' +
        '\n' +
        'define \"Reason for Not Giving Antithrombotic at Discharge\":\n' +
        '  [\"Medication, Not Discharged\": \"Antithrombotic Therapy for Ischemic Stroke\"] NoAntithromboticDischarge\n' +
        '    where NoAntithromboticDischarge.negationRationale in \"Medical Reason For Not Providing Treatment\"\n' +
        '      or NoAntithromboticDischarge.negationRationale in \"Patient Refusal\"\n' +
        '\n' +
        'define \"Encounter with Documented Reason for No Antithrombotic At Discharge\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with \"Reason for Not Giving Antithrombotic at Discharge\" NoDischargeAntithrombotic\n' +
        '      such that NoDischargeAntithrombotic.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n' +
        '\n' +
        'define \"Denominator Exceptions\":\n' +
        '  \"Encounter with Documented Reason for No Antithrombotic At Discharge\"\n' +
        '    union \"Encounter with Pharmacological Contraindications for Antithrombotic Therapy at Discharge\"\n' +
        '\n' +
        'define \"Numerator\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with [\"Medication, Discharge\": \"Antithrombotic Therapy for Ischemic Stroke\"] DischargeAntithrombotic\n' +
        '      such that DischargeAntithrombotic.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n' +
        '\n' +
        'define \"Initial Population\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\"\n' +
        '\n' +
        'define \"Denominator\":\n' +
        '  \"Initial Population\"\n'

    public static readonly qdmCQLNonPatienBasedTest = 'library NonPatientBasedCVmeasurewithMultiplegroupsStratifications version \'0.0.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer Type"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "Strat 1":\n' +
        '    ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '\n' +
        'define "Strat 2":\n' +
        '    ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n' +
        '\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Measure Population Exclusion":\n' +
        '  ["Encounter, Performed": "Observation Services"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
        '\n' +
        'define "Qualifying Encounters":\n' +
        '  ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
        '\n' +
        'define function "Measure Observation hours"(Encounter "Encounter, Performed"):\n' +
        '  duration in hours of Encounter.relevantPeriod\n' +
        '\n' +
        'define function "Measure Observation minutes"(Encounter "Encounter, Performed"):\n' +
        '  duration in minutes of Encounter.relevantPeriod'

    public static readonly qdmCQLPatientBasedTest = 'library RatioPatientBasedTestCQLLib version \'0.0.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer Type"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "Strat 1":\n' +
        '    ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '\n' +
        'define "Strat 2":\n' +
        '    ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n' +
        '\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Measure Population Exclusion":\n' +
        '  ["Encounter, Performed": "Observation Services"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
        '\n' +
        'define "Qualifying Encounters":\n' +
        '  exists ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
        '\n' +
        'define function "MeasureObservation"():\n' +
        'true\n' +
        '\n' +
        'define function "Measure Observation hours"():\n' +
        '    8\n' +
        '\n' +
        'define function "Measure Observation minutes"(Encounter "Encounter, Performed"):\n' +
        '  duration in minutes of Encounter.relevantPeriod'

    public static readonly qdmMeasureCQLPRODCataracts2040BCVAwithin90Days = 'library Cataracts2040BCVAwithin90Days version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +

        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +

        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
        'codesystem "AdministrativeGender": \'urn:oid:2.16.840.1.113883.5.1\' \n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\' \n' +
        'codesystem "CPT": \'urn:oid:2.16.840.1.113883.6.12\' \n' +
        '\n' +
        'valueset "Acute and Subacute Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1241\' \n' +
        'valueset "Amblyopia": \'urn:oid:2.16.840.1.113883.3.526.3.1448\' \n' +
        'valueset "Best Corrected Visual Acuity Exam Using Snellen Chart": \'urn:oid:2.16.840.1.113883.3.526.3.1560\' \n' +
        'valueset "Burn Confined to Eye and Adnexa": \'urn:oid:2.16.840.1.113883.3.526.3.1409\' \n' +
        'valueset "Cataract Congenital": \'urn:oid:2.16.840.1.113883.3.526.3.1412\' \n' +
        'valueset "Cataract Mature or Hypermature": \'urn:oid:2.16.840.1.113883.3.526.3.1413\' \n' +
        'valueset "Cataract Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1414\' \n' +
        'valueset "Cataract Secondary to Ocular Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1410\' \n' +
        'valueset "Cataract Surgery": \'urn:oid:2.16.840.1.113883.3.526.3.1411\' \n' +
        'valueset "Central Corneal Ulcer": \'urn:oid:2.16.840.1.113883.3.526.3.1428\' \n' +
        'valueset "Certain Types of Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1415\' \n' +
        'valueset "Chorioretinal Scars": \'urn:oid:2.16.840.1.113883.3.526.3.1449\' \n' +
        'valueset "Choroidal Degenerations": \'urn:oid:2.16.840.1.113883.3.526.3.1450\' \n' +
        'valueset "Choroidal Detachment": \'urn:oid:2.16.840.1.113883.3.526.3.1451\' \n' +
        'valueset "Choroidal Hemorrhage and Rupture": \'urn:oid:2.16.840.1.113883.3.526.3.1452\' \n' +
        'valueset "Chronic Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1416\' \n' +
        'valueset "Cloudy Cornea": \'urn:oid:2.16.840.1.113883.3.526.3.1417\' \n' +
        'valueset "Corneal Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1418\' \n' +
        'valueset "Degeneration of Macula and Posterior Pole": \'urn:oid:2.16.840.1.113883.3.526.3.1453\' \n' +
        'valueset "Degenerative Disorders of Globe": \'urn:oid:2.16.840.1.113883.3.526.3.1454\' \n' +
        'valueset "Diabetic Macular Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1455\' \n' +
        'valueset "Diabetic Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.327\' \n' +
        'valueset "Disorders of Cornea Including Corneal Opacity": \'urn:oid:2.16.840.1.113883.3.526.3.1419\' \n' +
        'valueset "Disorders of Optic Chiasm": \'urn:oid:2.16.840.1.113883.3.526.3.1457\' \n' +
        'valueset "Disorders of Visual Cortex": \'urn:oid:2.16.840.1.113883.3.526.3.1458\' \n' +
        'valueset "Disseminated Chorioretinitis and Disseminated Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1459\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Focal Chorioretinitis and Focal Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1460\' \n' +
        'valueset "Glaucoma": \'urn:oid:2.16.840.1.113883.3.526.3.1423\' \n' +
        'valueset "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes": \'urn:oid:2.16.840.1.113883.3.526.3.1461\' \n' +
        'valueset "Hereditary Choroidal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1462\' \n' +
        'valueset "Hereditary Corneal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1424\' \n' +
        'valueset "Hereditary Retinal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1463\' \n' +
        'valueset "Hypotony of Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1426\' \n' +
        'valueset "Injury to Optic Nerve and Pathways": \'urn:oid:2.16.840.1.113883.3.526.3.1427\' \n' +
        'valueset "Macular Scar of Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1559\' \n' +
        'valueset "Moderate or Severe Impairment, Better Eye, Profound Impairment Lesser Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1464\' \n' +
        'valueset "Morgagnian Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1558\' \n' +
        'valueset "Nystagmus and Other Irregular Eye Movements": \'urn:oid:2.16.840.1.113883.3.526.3.1465\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Open Wound of Eyeball": \'urn:oid:2.16.840.1.113883.3.526.3.1430\' \n' +
        'valueset "Optic Atrophy": \'urn:oid:2.16.840.1.113883.3.526.3.1466\' \n' +
        'valueset "Optic Neuritis": \'urn:oid:2.16.840.1.113883.3.526.3.1467\' \n' +
        'valueset "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1468\' \n' +
        'valueset "Other Background Retinopathy and Retinal Vascular Changes": \'urn:oid:2.16.840.1.113883.3.526.3.1469\' \n' +
        'valueset "Other Corneal Deformities": \'urn:oid:2.16.840.1.113883.3.526.3.1470\' \n' +
        'valueset "Other Disorders of Optic Nerve": \'urn:oid:2.16.840.1.113883.3.526.3.1471\' \n' +
        'valueset "Other Disorders of Sclera": \'urn:oid:2.16.840.1.113883.3.526.3.1472\' \n' +
        'valueset "Other Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1473\' \n' +
        'valueset "Other Proliferative Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.1480\' \n' +
        'valueset "Other Retinal Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1474\' \n' +
        'valueset "Pathologic Myopia": \'urn:oid:2.16.840.1.113883.3.526.3.1432\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Posterior Lenticonus": \'urn:oid:2.16.840.1.113883.3.526.3.1433\' \n' +
        'valueset "Prior Penetrating Keratoplasty": \'urn:oid:2.16.840.1.113883.3.526.3.1475\' \n' +
        'valueset "Profound Impairment, Both Eyes": \'urn:oid:2.16.840.1.113883.3.526.3.1476\' \n' +
        'valueset "Purulent Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1477\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
        'valueset "Retinal Detachment with Retinal Defect": \'urn:oid:2.16.840.1.113883.3.526.3.1478\' \n' +
        'valueset "Retinal Vascular Occlusion": \'urn:oid:2.16.840.1.113883.3.526.3.1479\' \n' +
        'valueset "Retrolental Fibroplasias": \'urn:oid:2.16.840.1.113883.3.526.3.1438\' \n' +
        'valueset "Scleritis": \'urn:oid:2.16.840.1.113762.1.4.1226.1\' \n' +
        'valueset "Separation of Retinal Layers": \'urn:oid:2.16.840.1.113883.3.526.3.1482\' \n' +
        'valueset "Traumatic Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1443\' \n' +
        'valueset "Uveitis": \'urn:oid:2.16.840.1.113883.3.526.3.1444\' \n' +
        'valueset "Vascular Disorders of Iris and Ciliary Body": \'urn:oid:2.16.840.1.113883.3.526.3.1445\' \n' +
        'valueset "Visual Acuity 20/40 or Better": \'urn:oid:2.16.840.1.113883.3.526.3.1483\' \n' +
        'valueset "Visual Field Defects": \'urn:oid:2.16.840.1.113883.3.526.3.1446\' \n' +
        '\n' +
        'code "Best corrected visual acuity (observable entity)": \'419775003\' from "SNOMEDCT" display \'Best corrected visual acuity (observable entity)\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '  \n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        '  \n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '  \n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '  \n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '  \n' +
        'define "Numerator":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n' +
        '      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n' +
        '      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n' +
        '      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"\n' +
        '        \n' +
        'define "Denominator Exclusions":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Diagnosis": "Acute and Subacute Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Amblyopia"]\n' +
        '      union ["Diagnosis": "Burn Confined to Eye and Adnexa"]\n' +
        '      union ["Diagnosis": "Cataract Secondary to Ocular Disorders"]\n' +
        '      union ["Diagnosis": "Cataract Congenital"]\n' +
        '      union ["Diagnosis": "Cataract Mature or Hypermature"]\n' +
        '      union ["Diagnosis": "Cataract Posterior Polar"]\n' +
        '      union ["Diagnosis": "Central Corneal Ulcer"]\n' +
        '      union ["Diagnosis": "Certain Types of Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Choroidal Degenerations"]\n' +
        '      union ["Diagnosis": "Choroidal Detachment"]\n' +
        '      union ["Diagnosis": "Choroidal Hemorrhage and Rupture"]\n' +
        '      union ["Diagnosis": "Chronic Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Cloudy Cornea"]\n' +
        '      union ["Diagnosis": "Corneal Edema"]\n' +
        '      union ["Diagnosis": "Disorders of Cornea Including Corneal Opacity"]\n' +
        '      union ["Diagnosis": "Degeneration of Macula and Posterior Pole"]\n' +
        '      union ["Diagnosis": "Degenerative Disorders of Globe"]\n' +
        '      union ["Diagnosis": "Diabetic Macular Edema"]\n' +
        '      union ["Diagnosis": "Diabetic Retinopathy"]\n' +
        '      union ["Diagnosis": "Disorders of Optic Chiasm"]\n' +
        '      union ["Diagnosis": "Disorders of Visual Cortex"]\n' +
        '      union ["Diagnosis": "Disseminated Chorioretinitis and Disseminated Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Focal Chorioretinitis and Focal Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Glaucoma"]\n' +
        '      union ["Diagnosis": "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes"]\n' +
        '      union ["Diagnosis": "Hereditary Choroidal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hereditary Corneal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hereditary Retinal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hypotony of Eye"]\n' +
        '      union ["Diagnosis": "Injury to Optic Nerve and Pathways"]\n' +
        '      union ["Diagnosis": "Macular Scar of Posterior Polar"]\n' +
        '      union ["Diagnosis": "Morgagnian Cataract"]\n' +
        '      union ["Diagnosis": "Nystagmus and Other Irregular Eye Movements"]\n' +
        '      union ["Diagnosis": "Open Wound of Eyeball"]\n' +
        '      union ["Diagnosis": "Optic Atrophy"]\n' +
        '      union ["Diagnosis": "Optic Neuritis"]\n' +
        '      union ["Diagnosis": "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Other Background Retinopathy and Retinal Vascular Changes"]\n' +
        '      union ["Diagnosis": "Other Disorders of Optic Nerve"]\n' +
        '      union ["Diagnosis": "Other Endophthalmitis"]\n' +
        '      union ["Diagnosis": "Other Proliferative Retinopathy"]\n' +
        '      union ["Diagnosis": "Pathologic Myopia"]\n' +
        '      union ["Diagnosis": "Posterior Lenticonus"]\n' +
        '      union ["Diagnosis": "Prior Penetrating Keratoplasty"]\n' +
        '      union ["Diagnosis": "Purulent Endophthalmitis"]\n' +
        '      union ["Diagnosis": "Retinal Detachment with Retinal Defect"]\n' +
        '      union ["Diagnosis": "Retinal Vascular Occlusion"]\n' +
        '      union ["Diagnosis": "Retrolental Fibroplasias"]\n' +
        '      union ["Diagnosis": "Scleritis"]\n' +
        '      union ["Diagnosis": "Separation of Retinal Layers"]\n' +
        '      union ["Diagnosis": "Traumatic Cataract"]\n' +
        '      union ["Diagnosis": "Uveitis"]\n' +
        '      union ["Diagnosis": "Vascular Disorders of Iris and Ciliary Body"]\n' +
        '      union ["Diagnosis": "Visual Field Defects"] ) ComorbidDiagnosis\n' +
        '      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '      \n' +
        'define "Initial Population":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    where AgeInYearsAt(date from start of "Measurement Period")>= 18\n' +
        '      \n' +
        'define "Cataract Surgery Between January and September of Measurement Period":\n' +
        '  ["Procedure, Performed": "Cataract Surgery"] CataractSurgery\n' +
        '    where Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) during "Measurement Period"\n' +
        '      and Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) starts 92 days or more before \n' +
        '      end of "Measurement Period"'

    public static readonly QDM4TestCaseElementsAttributes = 'library Library5749 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        'codesystem "Test": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": \'urn:oid:2.16.840.1.113883.3.3157.4036\'\n' +
        'valueset "Active Peptic Ulcer": \'urn:oid:2.16.840.1.113883.3.3157.4031\'\n' +
        'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\'\n' +
        'valueset "Allergy to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.5\'\n' +
        'valueset "Anticoagulant Medications, Oral": \'urn:oid:2.16.840.1.113883.3.3157.4045\'\n' +
        'valueset "Aortic Dissection and Rupture": \'urn:oid:2.16.840.1.113883.3.3157.4028\'\n' +
        'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\'\n' +
        'valueset "Cardiopulmonary Arrest": \'urn:oid:2.16.840.1.113883.3.3157.4048\'\n' +
        'valueset "Cerebral Vascular Lesion": \'urn:oid:2.16.840.1.113883.3.3157.4025\'\n' +
        'valueset "Closed Head and Facial Trauma": \'urn:oid:2.16.840.1.113883.3.3157.4026\'\n' +
        'valueset "Dementia": \'urn:oid:2.16.840.1.113883.3.3157.4043\'\n' +
        'valueset "Discharge To Acute Care Facility": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.87\'\n' +
        'valueset "ED": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085\'\n' +
        'valueset "Endotracheal Intubation": \'urn:oid:2.16.840.1.113762.1.4.1045.69\'\n' +
        'valueset "Fibrinolytic Therapy": \'urn:oid:2.16.840.1.113883.3.3157.4020\'\n' +
        'valueset "Intracranial or Intraspinal surgery": \'urn:oid:2.16.840.1.113762.1.4.1170.2\'\n' +
        'valueset "Ischemic Stroke": \'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024\'\n' +
        'valueset "Major Surgical Procedure": \'urn:oid:2.16.840.1.113883.3.3157.4056\'  \n' +
        'valueset "Malignant Intracranial Neoplasm Group": \'urn:oid:2.16.840.1.113762.1.4.1170.3\'\n' +
        'valueset "Mechanical Circulatory Assist Device": \'urn:oid:2.16.840.1.113883.3.3157.4052\'\n' +
        'valueset "Neurologic impairment": \'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012\'\n' +
        'valueset "Patient Expired": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.309\'\n' +
        'valueset "Percutaneous Coronary Intervention": \'urn:oid:2.16.840.1.113883.3.3157.2000.5\'\n' +
        'valueset "Pregnancy": \'urn:oid:2.16.840.1.113883.3.3157.4055\'\n' +
        'valueset "STEMI": \'urn:oid:2.16.840.1.113883.3.3157.4017\'\n' +
        'valueset "Thrombolytic medications": \'urn:oid:2.16.840.1.113762.1.4.1170.4\'\n' +
        'valueset "Chlamydia Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052\'\n' +
        'valueset "Falls Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028\'\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        'define "Initial Population":\n' +
        '  ["Adverse Event": "Encounter Inpatient"] //Adverse Event\n' +
        '      union ["Allergy/Intolerance": "Observation Services"] //Allergy\n' +
        '      union ["Assessment, Order": "Active Bleeding or Bleeding Diathesis (Excluding Menses)"] //Assessment\n' +
        '      union ["Patient Care Experience": "Active Peptic Ulcer"] //Care Experience\n' +
        '      union ["Care Goal": "Adverse reaction to thrombolytics"] //Care Goal - missing from current list\n' +
        '      union ["Patient Characteristic Payer": "Payer"] //Characteristic\n' +
        '      //threw in a patient demographic - should not show up\n' +
        '      union ["Patient Characteristic Race": "Race"]\n' +
        '      union ["Diagnosis": "Allergy to thrombolytics"] //Condition\n' +
        '      union ["Communication, Performed": "Anticoagulant Medications, Oral"] //Communication\n' +
        '      //threw a negation element in to see if it maps correctly\n' +
        '    //   union ["Communication, Not Performed": "Aortic Dissection and Rupture"] //Communication\n' +
        '      union ["Device, Order": "Cardiopulmonary Arrest"] //Device\n' +
        '      union ["Diagnostic Study, Order": "Cerebral Vascular Lesion"] //Diagnostic Study\n' +
        '      union ["Encounter, Performed": "Emergency Department Visit"] //Encounter\n' +
        '      union ["Family History": "Closed Head and Facial Trauma"] //Family History\n' +
        '      union ["Immunization, Order": "Dementia"] //Immunization\n' +
        '      union ["Intervention, Order": "ED"] //Intervention\n' +
        '      union ["Laboratory Test, Order": "Endotracheal Intubation"] //Laboratory\n' +
        '      union ["Laboratory Test, Performed": "Chlamydia Screening"]\n' +
        '      union ["Medication, Active": "Fibrinolytic Therapy"] //Medication\n' +
        '      union ["Participation": "Intracranial or Intraspinal surgery"] //Participation\n' +
        '      union ["Physical Exam, Order": "Ischemic Stroke"] //Physical Exam\n' +
        '      union ["Procedure, Order": "Major Surgical Procedure"] //Procedure\n' +
        '      union ["Related Person": "Malignant Intracranial Neoplasm Group"] //Related Person - mssing from curent list\n' +
        '      union ["Substance, Administered": "Mechanical Circulatory Assist Device"] //Substance\n' +
        '      union ["Symptom": "Neurologic impairment"] //Symptom\n' +
        '      union ["Assessment, Performed": "Falls Screening"] //Assessment '

    public static readonly QDMSimpleCQL = 'library ProportionPatient1689182327602 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +

        'valueset \"Encounter Inpatient\": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +

        'parameter \"Measurement Period\" Interval<DateTime>\n' +
        'context Patient\n' +

        'define \"Patient16To23\":\n' +
        '  AgeInYearsAt(start of \"Measurement Period\") >= 16\n' +
        '    and AgeInYearsAt(start of \"Measurement Period\") < 24'

    public static readonly QDMRatioCQL_with_MOs = 'library NewQDM version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        'codesystem \"LOINC\": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'valueset \"Acute care hospital Inpatient Encounter\": \'urn:oid:2.16.840.1.113883.3.666.5.2289\'\n' +
        'valueset \"Bicarbonate lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.139\'\n' +
        'valueset \"Body temperature\": \'urn:oid:2.16.840.1.113762.1.4.1045.152\'\n' +
        'valueset \"Body weight\": \'urn:oid:2.16.840.1.113762.1.4.1045.159\'\n' +
        'valueset \"Creatinine lab test\": \'urn:oid:2.16.840.1.113883.3.666.5.2363\'\n' +
        'valueset \"Emergency Department Visit\": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset \"Encounter Inpatient\": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset \"Ethnicity\": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset \"Glucose lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.134\'\n' +
        'valueset \"Heart Rate\": \'urn:oid:2.16.840.1.113762.1.4.1045.149\'\n' +
        'valueset \"Hematocrit lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.114\'\n' +
        'valueset \"Medicare Advantage payer\": \'urn:oid:2.16.840.1.113762.1.4.1104.12\'\n' +
        'valueset \"Medicare FFS payer\": \'urn:oid:2.16.840.1.113762.1.4.1104.10\'\n' +
        'valueset \"Observation Services\": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset \"ONC Administrative Sex\": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset \"Oxygen Saturation by Pulse Oximetry\": \'urn:oid:2.16.840.1.113762.1.4.1045.151\'\n' +
        'valueset \"Payer\": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset \"Potassium lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.117\'\n' +
        'valueset \"Race\": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset \"Respiratory Rate\": \'urn:oid:2.16.840.1.113762.1.4.1045.130\'\n' +
        'valueset \"Sodium lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.119\'\n' +
        'valueset \"Systolic Blood Pressure\": \'urn:oid:2.16.840.1.113762.1.4.1045.163\'\n' +
        'valueset \"White blood cells count lab test\": \'urn:oid:2.16.840.1.113762.1.4.1045.129\'\n' +
        'code \"Birth date\": \'21112-8\' from \"LOINC\" display \'Birth date\'\n' +
        'parameter \"Measurement Period\" Interval<DateTime>\n' +
        'context Patient\n' +
        'define \"Denominator\":\n' +
        '  \"Initial Population\"\n' +
        'define \"Initial Population\":\n' +
        '  \"Inpatient Encounters\"\n' +
        'define \"Numerator\":\n' +
        '  \"Initial Population\"\n' +
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer\"]\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex": "ONC Administrative Sex\"]\n' +
        'define \"SDE Results\":\n' +
        '  {\n' +
        '// First physical exams\n' +
        '    FirstHeartRate: \"FirstPhysicalExamWithEncounterId\"([\"Physical Exam, Performed\": \"Heart Rate\"]),\n' +
        '    FirstSystolicBloodPressure: \"FirstPhysicalExamWithEncounterId\"([\"Physical Exam, Performed\": \"Systolic Blood Pressure\"]),\n' +
        '    FirstRespiratoryRate: \"FirstPhysicalExamWithEncounterId\"([\"Physical Exam, Performed\": \"Respiratory Rate\"]),\n' +
        '  FirstBodyTemperature: \"FirstPhysicalExamWithEncounterId\"([\"Physical Exam, Performed\": \"Body temperature\"]),\n' +
        '  FirstOxygenSaturation: \"FirstPhysicalExamWithEncounterId\"([\"Physical Exam, Performed\": \"Oxygen Saturation by Pulse Oximetry\"]),\n' +
        '// Weight uses lab test timing\n' +
        '  FirstBodyWeight: \"FirstPhysicalExamWithEncounterIdUsingLabTiming\"([\"Physical Exam, Performed\": \"Body weight\"]),\n' +
        ' \n' +
        '// First lab tests\n' +
        '  FirstHematocritLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Hematocrit lab test\"]),\n' +
        '  FirstWhiteBloodCellCount: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"White blood cells count lab test\"]),\n' +
        '  FirstPotassiumLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Potassium lab test\"]),\n' +
        '  FirstSodiumLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Sodium lab test\"]),\n' +
        '  FirstBicarbonateLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Bicarbonate lab test\"]),\n' +
        '  FirstCreatinineLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Creatinine lab test\"]),\n' +
        '  FirstGlucoseLab: \"FirstLabTestWithEncounterId\"([\"Laboratory Test, Performed\": \"Glucose lab test\"])\n' +
        '}\n' +
        'define \"Inpatient Encounters\":\n' +
        '  [\"Encounter, Performed\": \"Encounter Inpatient\"] InpatientEncounter\n' +
        '    with ( [\"Patient Characteristic Payer\": \"Medicare FFS payer\"]\n' +
        '      union [\"Patient Characteristic Payer\": \"Medicare Advantage payer\"] ) Payer\n' +
        '      such that Global.\"HospitalizationWithObservationLengthofStay\" ( InpatientEncounter ) < 365\n' +
        '        and InpatientEncounter.relevantPeriod ends during day of \"Measurement Period\"\n' +
        '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n' +
        'define function \"LengthOfStay\"(Stay Interval<DateTime> ):\n' +
        '  difference in days between start of Stay and\n' +
        '  end of Stay\n' +
        'define function \"FirstPhysicalExamWithEncounterId\"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  \"Inpatient Encounters\" Encounter\n' +
        '    let FirstExam: First(ExamList Exam\n' +
        '        where Global.\"EarliestOf\"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n' +
        '        sort by Global.\"EarliestOf\"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExam.result as Quantity,\n' +
        '      Timing: Global.\"EarliestOf\" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n' +
        '    }\n' +
        'define function \"FirstPhysicalExamWithEncounterIdUsingLabTiming\"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  \"Inpatient Encounters\" Encounter\n' +
        '    let FirstExamWithLabTiming: First(ExamList Exam\n' +
        '        where Global.\"EarliestOf\"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by Global.\"EarliestOf\"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExamWithLabTiming.result as Quantity,\n' +
        '      Timing: Global.\"EarliestOf\" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n' +
        '    }\n' +
        'define function \"FirstLabTestWithEncounterId\"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n' +
        '  \"Inpatient Encounters\" Encounter\n' +
        '    let FirstLab: First(LabList Lab\n' +
        '        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by resultDatetime\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstLab.result as Quantity,\n' +
        '      Timing: FirstLab.resultDatetime\n' +
        '    }\n' +
        'define function \"Test\"(LabList String):\n' +
        '  \"Inpatient Encounters\"'

    public static readonly QDMRatio_ListPositiveEncounterPerformed_withMO = 'library RatioListQDMPositiveEncounterPerformedWithMO1701801315767 version \'0.0.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\' \n' +
        'valueset "Comfort Measures": \'urn:oid:1.3.6.1.4.1.33895.1.3.0.45\' \n' +
        'valueset "Diabetes": \'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
        'valueset "Discharged to Health Care Facility for Hospice Care": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.207\' \n' +
        'valueset "Discharged to Home for Hospice Care": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.209\' \n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Glucose Lab Test Mass Per Volume": \'urn:oid:2.16.840.1.113762.1.4.1248.34\' \n' +
        'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\' \n' +
        'valueset "Ketoacidosis": \'urn:oid:2.16.840.1.113762.1.4.1222.520\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Comfort Measures Care":\n' +
        '  ["Intervention, Order": "Comfort Measures"]\n' +
        '    union ["Intervention, Performed": "Comfort Measures"]\n' +
        '\n' +
        'define "Days in Hospitalization":\n' +
        '  "Measurement Population" EligibleInpatientHospitalization\n' +
        '    let period: Global."HospitalizationWithObservation" ( EligibleInpatientHospitalization ),\n' +
        '    relevantPeriod: "HospitalDaysMax10"(period)\n' +
        '    return Tuple {\n' +
        '      encounter: EligibleInpatientHospitalization,\n' +
        '      hospitalizationPeriod: period,\n' +
        '      relevantPeriod: relevantPeriod,\n' +
        '      relevantDays: "DaysInPeriod"(relevantPeriod)\n' +
        '    }\n' +
        '\n' +
        'define "Days with Glucose Results":\n' +
        '  "Days in Hospitalization" InpatientHospitalDays\n' +
        '    return Tuple {\n' +
        '      encounter: InpatientHospitalDays.encounter,\n' +
        '      relevantPeriod: InpatientHospitalDays.relevantPeriod,\n' +
        '      relevantDays: ( InpatientHospitalDays.relevantDays EncounterDay\n' +
        '          return Tuple {\n' +
        '            dayNumber: EncounterDay.dayNumber,\n' +
        '            dayPeriod: EncounterDay.dayPeriod,\n' +
        '            hasSevereResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where GlucoseTest.result > 300 \'mg/dL\'\n' +
        '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            ),\n' +
        '            hasElevatedResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where GlucoseTest.result >= 200 \'mg/dL\'\n' +
        '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            ),\n' +
        '            hasNoGlucoseTest: not exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            )\n' +
        '          }\n' +
        '      )\n' +
        '    }\n' +
        '\n' +
        'define "Days with Hyperglycemic Events":\n' +
        '  "Days with Glucose Results" EncounterWithResultDays\n' +
        '    let eligibleEventDays: EncounterWithResultDays.relevantDays EncounterDay\n' +
        '      where EncounterDay.dayNumber > 1\n' +
        '      return Tuple {\n' +
        '        dayNumber: EncounterDay.dayNumber,\n' +
        '        dayPeriod: EncounterDay.dayPeriod,\n' +
        '        hasHyperglycemicEvent: ( EncounterDay.hasSevereResult\n' +
        '            or ( EncounterDay.hasNoGlucoseTest\n' +
        '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 2].hasElevatedResult\n' +
        '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 3].hasElevatedResult\n' +
        '            )\n' +
        '        )\n' +
        '      }\n' +
        '    return Tuple {\n' +
        '      encounter: EncounterWithResultDays.encounter,\n' +
        '      relevantPeriod: EncounterWithResultDays.relevantPeriod,\n' +
        '      eligibleEventDays: eligibleEventDays\n' +
        '    }\n' +
        '\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Denominator Exclusions":\n' +
        '  "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care"\n' +
        '\n' +
        'define "Encounter with Comfort Measures during Hospitalization":\n' +
        '  "Initial Population" InpatientHospitalization\n' +
        '    with "Comfort Measures Care" ComfortCare\n' +
        '      such that Coalesce(start of Global."NormalizeInterval"(ComfortCare.relevantDatetime, ComfortCare.relevantPeriod), ComfortCare.authorDatetime) during Global."HospitalizationWithObservation" ( InpatientHospitalization )\n' +
        '\n' +
        'define "Encounter with Discharge for Hospice Care":\n' +
        '  "Initial Population" InpatientHospitalization\n' +
        '    where InpatientHospitalization.dischargeDisposition in "Discharged to Home for Hospice Care"\n' +
        '      or InpatientHospitalization.dischargeDisposition in "Discharged to Health Care Facility for Hospice Care"\n' +
        '\n' +
        'define "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care":\n' +
        '  "Encounter with Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start"\n' +
        '    union "Encounter with Comfort Measures during Hospitalization"\n' +
        '    union "Encounter with Discharge for Hospice Care"\n' +
        '\n' +
        'define "Encounter with Elevated Glucose Greater Than or Equal to 200":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '      such that Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during Hospitalization.hospitalizationPeriod\n' +
        '        and GlucoseTest.result >= 200 \'mg/dL\'\n' +
        '    return Hospitalization.encounter\n' +
        '\n' +
        'define "Encounter with Existing Diabetes Diagnosis":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Diagnosis": "Diabetes"] DiabetesCondition\n' +
        '      such that DiabetesCondition.prevalencePeriod starts before end of Hospitalization.hospitalizationPeriod\n' +
        '    return Hospitalization.encounter\n' +
        '\n' +
        'define "Encounter with Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
        '  from\n' +
        '    "Initial Population" InpatientHospitalization,\n' +
        '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '    let GlucoseTestTime: Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ),\n' +
        '    HospitalPeriod: Global."HospitalizationWithObservation" ( InpatientHospitalization )\n' +
        '    where GlucoseTest.result is not null\n' +
        '      and GlucoseTest.result >= 1000 \'mg/dL\'\n' +
        '      and GlucoseTestTime during Interval[( start of HospitalPeriod - 1 hour ), ( start of HospitalPeriod + 6 hours )]\n' +
        '      and GlucoseTestTime before end of InpatientHospitalization.relevantPeriod\n' +
        '    return InpatientHospitalization\n' +
        '\n' +
        'define "Encounter with Hospitalization Period":\n' +
        '  "Qualifying Encounter" QualifyingHospitalization\n' +
        '    return Tuple {\n' +
        '      encounter: QualifyingHospitalization,\n' +
        '      hospitalizationPeriod: Global."HospitalizationWithObservation" ( QualifyingHospitalization )\n' +
        '    }\n' +
        '\n' +
        'define "Encounter with Hyperglycemic Events":\n' +
        '  "Days with Hyperglycemic Events" HyperglycemicEventDays\n' +
        '    where exists ( HyperglycemicEventDays.eligibleEventDays EligibleEventDay\n' +
        '        where EligibleEventDay.hasHyperglycemicEvent\n' +
        '    )\n' +
        '    return HyperglycemicEventDays.encounter\n' +
        '\n' +
        'define "Encounter with Hypoglycemic Medication":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Medication, Administered": "Hypoglycemics Treatment Medications"] HypoglycemicMedication\n' +
        '      such that Global."NormalizeInterval" ( HypoglycemicMedication.relevantDatetime, HypoglycemicMedication.relevantPeriod ) starts during Hospitalization.hospitalizationPeriod\n' +
        '    return Hospitalization.encounter\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "Encounter with Existing Diabetes Diagnosis"\n' +
        '    union "Encounter with Hypoglycemic Medication"\n' +
        '    union "Encounter with Elevated Glucose Greater Than or Equal to 200"\n' +
        '\n' +
        'define "Measurement Population":\n' +
        '  "Denominator"\n' +
        '\n' +
        'define "Numerator":\n' +
        '  "Encounter with Hyperglycemic Events"\n' +
        '\n' +
        'define "Numerator Exclusions":\n' +
        '  "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care"\n' +
        '\n' +
        'define "Qualifying Encounter":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    where InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '      and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod) >= 18\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer Type"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define function "DaysInPeriod"(Period Interval<DateTime> ):\n' +
        '  ( "IntervalToDayNumbers"(Period) ) DayNumber\n' +
        '    let startPeriod: start of Period + ( 24 hours * ( DayNumber - 1 ) ),\n' +
        '    endPeriod: if ( hours between startPeriod and end of Period < 24 ) then startPeriod \n' +
        '      else start of Period + ( 24 hours * DayNumber )\n' +
        '    return Tuple {\n' +
        '      dayNumber: DayNumber,\n' +
        '      dayPeriod: Interval[startPeriod, endPeriod )\n' +
        '    }\n' +
        '\n' +
        'define function "IntervalToDayNumbers"(Period Interval<DateTime> ):\n' +
        '  ( expand { Interval[1, days between start of Period and end of Period]} ) DayExpand\n' +
        '    return end of DayExpand\n' +
        '\n' +
        'define function "DenominatorObservations"(QualifyingEncounter "Encounter, Performed" ):\n' +
        '  singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return Count(EncounterWithEventDays.eligibleEventDays)\n' +
        '  )\n' +
        '\n' +
        'define function "NumeratorObservations"(QualifyingEncounter "Encounter, Performed" ):\n' +
        '  singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return Count(EncounterWithEventDays.eligibleEventDays EligibleEventDay\n' +
        '          where EligibleEventDay.hasHyperglycemicEvent\n' +
        '      )\n' +
        '  )\n' +
        '\n' +
        'define function "HospitalDaysMax10"(Period Interval<DateTime> ):\n' +
        '  Interval[start of Period, Min({ \n' +
        '    end of Period, start of Period + 10 days }\n' +
        '  )]\n' +
        '\n'


    public static readonly simpleQDM_CQL_with_incorrect_using = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6000\'\n' +
        '\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        'define "ipp":\n' +
        '\ttrue\n' +
        'define "d":\n' +
        '\t true\n' +
        'define "n":\n' +
        '\ttrue'


    public static readonly simpleQDM_CQL_without_using = 'library Library5749 version \'0.0.000\'\n' +
        'codesystem "Test": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": \'urn:oid:2.16.840.1.113883.3.3157.4036\'\n' +
        'valueset "Active Peptic Ulcer": \'urn:oid:2.16.840.1.113883.3.3157.4031\'\n' +
        'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\'\n' +
        'valueset "Allergy to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.5\'\n' +
        'valueset "Anticoagulant Medications, Oral": \'urn:oid:2.16.840.1.113883.3.3157.4045\'\n' +
        'valueset "Aortic Dissection and Rupture": \'urn:oid:2.16.840.1.113883.3.3157.4028\'\n' +
        'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\'\n' +
        'valueset "Cardiopulmonary Arrest": \'urn:oid:2.16.840.1.113883.3.3157.4048\'\n' +
        'valueset "Cerebral Vascular Lesion": \'urn:oid:2.16.840.1.113883.3.3157.4025\'\n' +
        'valueset "Closed Head and Facial Trauma": \'urn:oid:2.16.840.1.113883.3.3157.4026\'\n' +
        'valueset "Dementia": \'urn:oid:2.16.840.1.113883.3.3157.4043\'\n' +
        'valueset "Discharge To Acute Care Facility": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.87\'\n' +
        'valueset "ED": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085\'\n' +
        'valueset "Endotracheal Intubation": \'urn:oid:2.16.840.1.113762.1.4.1045.69\'\n' +
        'valueset "Fibrinolytic Therapy": \'urn:oid:2.16.840.1.113883.3.3157.4020\'\n' +
        'valueset "Intracranial or Intraspinal surgery": \'urn:oid:2.16.840.1.113762.1.4.1170.2\'\n' +
        'valueset "Ischemic Stroke": \'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024\'\n' +
        'valueset "Major Surgical Procedure": \'urn:oid:2.16.840.1.113883.3.3157.4056\'  \n' +
        'valueset "Malignant Intracranial Neoplasm Group": \'urn:oid:2.16.840.1.113762.1.4.1170.3\'\n' +
        'valueset "Mechanical Circulatory Assist Device": \'urn:oid:2.16.840.1.113883.3.3157.4052\'\n' +
        'valueset "Neurologic impairment": \'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012\'\n' +
        'valueset "Patient Expired": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.309\'\n' +
        'valueset "Percutaneous Coronary Intervention": \'urn:oid:2.16.840.1.113883.3.3157.2000.5\'\n' +
        'valueset "Pregnancy": \'urn:oid:2.16.840.1.113883.3.3157.4055\'\n' +
        'valueset "STEMI": \'urn:oid:2.16.840.1.113883.3.3157.4017\'\n' +
        'valueset "Thrombolytic medications": \'urn:oid:2.16.840.1.113762.1.4.1170.4\'\n' +
        'valueset "Chlamydia Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052\'\n' +
        'valueset "Falls Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028\'\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        'define "Initial Population":\n' +
        '  ["Adverse Event": "Encounter Inpatient"] //Adverse Event\n' +
        '      union ["Allergy/Intolerance": "Observation Services"] //Allergy\n' +
        '      union ["Assessment, Order": "Active Bleeding or Bleeding Diathesis (Excluding Menses)"] //Assessment\n' +
        '      union ["Patient Care Experience": "Active Peptic Ulcer"] //Care Experience\n' +
        '      union ["Care Goal": "Adverse reaction to thrombolytics"] //Care Goal - missing from current list\n' +
        '      union ["Patient Characteristic Payer": "Payer"] //Characteristic\n' +
        '      //threw in a patient demographic - should not show up\n' +
        '      union ["Patient Characteristic Race": "Race"]\n' +
        '      union ["Diagnosis": "Allergy to thrombolytics"] //Condition\n' +
        '      union ["Communication, Performed": "Anticoagulant Medications, Oral"] //Communication\n' +
        '      //threw a negation element in to see if it maps correctly\n' +
        '    //   union ["Communication, Not Performed": "Aortic Dissection and Rupture"] //Communication\n' +
        '      union ["Device, Order": "Cardiopulmonary Arrest"] //Device\n' +
        '      union ["Diagnostic Study, Order": "Cerebral Vascular Lesion"] //Diagnostic Study\n' +
        '      union ["Encounter, Performed": "Emergency Department Visit"] //Encounter\n' +
        '      union ["Family History": "Closed Head and Facial Trauma"] //Family History\n' +
        '      union ["Immunization, Order": "Dementia"] //Immunization\n' +
        '      union ["Intervention, Order": "ED"] //Intervention\n' +
        '      union ["Laboratory Test, Order": "Endotracheal Intubation"] //Laboratory\n' +
        '      union ["Laboratory Test, Performed": "Chlamydia Screening"]\n' +
        '      union ["Medication, Active": "Fibrinolytic Therapy"] //Medication\n' +
        '      union ["Participation": "Intracranial or Intraspinal surgery"] //Participation\n' +
        '      union ["Physical Exam, Order": "Ischemic Stroke"] //Physical Exam\n' +
        '      union ["Procedure, Order": "Major Surgical Procedure"] //Procedure\n' +
        '      union ["Related Person": "Malignant Intracranial Neoplasm Group"] //Related Person - mssing from curent list\n' +
        '      union ["Substance, Administered": "Mechanical Circulatory Assist Device"] //Substance\n' +
        '      union ["Symptom": "Neurologic impairment"] //Symptom\n' +
        '      union ["Assessment, Performed": "Falls Screening"] //Assessment '

    public static readonly QDMTestCaseCQLFullElementSection = 'library CohortListQDMPositiveEncounterPerformedWithStratification1686773356032 version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
        '\n' +
        'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2289\' \n' +
        'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\' \n' +
        'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\' \n' +
        'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\' \n' +
        'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\' \n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\' \n' +
        'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\' \n' +
        'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\' \n' +
        'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\' \n' +
        'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\' \n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        '\n' +
        'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
        'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
        'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
        'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\' \n' +
        '\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Denominator":\n' +
        '\t  "Initial Population"\n' +
        '\n' +
        'define "Initial Population":\n' +
        '\t  "Inpatient Encounters"\n' +
        '\n' +
        'define "Numerator":\n' +
        '\t  "Initial Population"\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '\t  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '\t  ["Patient Characteristic Payer": "Payer"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '\t  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '\t  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "SDE Results":\n' +
        '  {\n' +
        '  // First physical exams\n' +
        '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
        '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
        '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
        '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
        '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
        '  // Weight uses lab test timing\n' +
        '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n' +
        '\n' +
        '  // First lab tests\n' +
        '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
        '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
        '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
        '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
        '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
        '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
        '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
        '  }\n' +
        '\n' +
        'define "Inpatient Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
        '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
        '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
        '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n' +
        '\n' +
        'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
        '  difference in days between start of Stay and \n' +
        '  end of Stay\n' +
        '\n' +
        'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstExam: First(ExamList Exam\n' +
        '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n' +
        '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExam.result as Quantity,\n' +
        '      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n' +
        '    }\n' +
        '\n' +
        'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstExamWithLabTiming: First(ExamList Exam\n' +
        '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExamWithLabTiming.result as Quantity,\n' +
        '      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n' +
        '    }\n' +
        '\n' +
        'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstLab: First(LabList Lab\n' +
        '        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by resultDatetime\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstLab.result as Quantity,\n' +
        '      Timing: FirstLab.resultDatetime\n' +
        '    }'
    public static readonly QDMTestCaseCQLNonVsacValueset = 'library CohortListQDMPositiveEncounterPerformedWithStratification1686773356032 version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
        '\n' +
        'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2283\' \n' +
        'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\' \n' +
        'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\' \n' +
        'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\' \n' +
        'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\' \n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\' \n' +
        'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\' \n' +
        'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\' \n' +
        'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\' \n' +
        'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\' \n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        '\n' +
        'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
        'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
        'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
        'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\' \n' +
        '\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Denominator":\n' +
        '\t  "Initial Population"\n' +
        '\n' +
        'define "Initial Population":\n' +
        '\t  "Inpatient Encounters"\n' +
        '\n' +
        'define "Numerator":\n' +
        '\t  "Initial Population"\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '\t  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '\t  ["Patient Characteristic Payer": "Payer"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '\t  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '\t  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "SDE Results":\n' +
        '  {\n' +
        '  // First physical exams\n' +
        '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
        '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
        '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
        '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
        '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
        '  // Weight uses lab test timing\n' +
        '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n' +
        '\n' +
        '  // First lab tests\n' +
        '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
        '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
        '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
        '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
        '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
        '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
        '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
        '  }\n' +
        '\n' +
        'define "Inpatient Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
        '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
        '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
        '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n' +
        '\n' +
        'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
        '  difference in days between start of Stay and \n' +
        '  end of Stay\n' +
        '\n' +
        'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstExam: First(ExamList Exam\n' +
        '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n' +
        '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExam.result as Quantity,\n' +
        '      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n' +
        '    }\n' +
        '\n' +
        'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstExamWithLabTiming: First(ExamList Exam\n' +
        '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstExamWithLabTiming.result as Quantity,\n' +
        '      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n' +
        '    }\n' +
        '\n' +
        'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n' +
        '  "Inpatient Encounters" Encounter\n' +
        '    let FirstLab: First(LabList Lab\n' +
        '        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
        '        sort by resultDatetime\n' +
        '    )\n' +
        '    return {\n' +
        '      EncounterId: Encounter.id,\n' +
        '      FirstResult: FirstLab.result as Quantity,\n' +
        '      Timing: FirstLab.resultDatetime\n' +
        '    }'

    public static readonly QDMCQL4MAT5645 = 'library TestingQDM version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        '\n' +
        'define "Patient16To23":\n' +
        '  AgeInYearsAt(start of "Measurement Period") >= 16\n' +
        '    and AgeInYearsAt(start of "Measurement Period") < 24\n'
    public static readonly simpleQDM_CQL = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        'define "ipp":\n' +
        '\ttrue\n' +
        'define "d":\n' +
        '\t true\n' +
        'define "n":\n' +
        '\ttrue'

    public static readonly simpleQDM_CQL_invalid_valueset = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837b\'\n' +

        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        'define "ipp":\n' +
        '\ttrue\n' +
        'define "d":\n' +
        '\t true\n' +
        'define "n":\n' +
        '\ttrue'

    public static readonly returnNonBooleanListOfSameTypeQDM_CQL = 'library Cataracts2040BCVAwithin90Days version \'12.0.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\' \n' +
        '\n' +
        'valueset "Acute and Subacute Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1241\' \n' +
        'valueset "Amblyopia": \'urn:oid:2.16.840.1.113883.3.526.3.1448\' \n' +
        'valueset "Best Corrected Visual Acuity Exam Using Snellen Chart": \'urn:oid:2.16.840.1.113883.3.526.3.1560\' \n' +
        'valueset "Burn Confined to Eye and Adnexa": \'urn:oid:2.16.840.1.113883.3.526.3.1409\' \n' +
        'valueset "Cataract Congenital": \'urn:oid:2.16.840.1.113883.3.526.3.1412\' \n' +
        'valueset "Cataract Mature or Hypermature": \'urn:oid:2.16.840.1.113883.3.526.3.1413\' \n' +
        'valueset "Cataract Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1414\' \n' +
        'valueset "Cataract Secondary to Ocular Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1410\' \n' +
        'valueset "Cataract Surgery": \'urn:oid:2.16.840.1.113883.3.526.3.1411\' \n' +
        'valueset "Central Corneal Ulcer": \'urn:oid:2.16.840.1.113883.3.526.3.1428\' \n' +
        'valueset "Certain Types of Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1415\' \n' +
        'valueset "Chorioretinal Scars": \'urn:oid:2.16.840.1.113883.3.526.3.1449\' \n' +
        'valueset "Choroidal Degenerations": \'urn:oid:2.16.840.1.113883.3.526.3.1450\' \n' +
        'valueset "Choroidal Detachment": \'urn:oid:2.16.840.1.113883.3.526.3.1451\' \n' +
        'valueset "Choroidal Hemorrhage and Rupture": \'urn:oid:2.16.840.1.113883.3.526.3.1452\' \n' +
        'valueset "Chronic Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1416\' \n' +
        'valueset "Cloudy Cornea": \'urn:oid:2.16.840.1.113883.3.526.3.1417\' \n' +
        'valueset "Corneal Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1418\' \n' +
        'valueset "Degeneration of Macula and Posterior Pole": \'urn:oid:2.16.840.1.113883.3.526.3.1453\' \n' +
        'valueset "Degenerative Disorders of Globe": \'urn:oid:2.16.840.1.113883.3.526.3.1454\' \n' +
        'valueset "Diabetic Macular Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1455\' \n' +
        'valueset "Diabetic Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.327\' \n' +
        'valueset "Disorders of Cornea Including Corneal Opacity": \'urn:oid:2.16.840.1.113883.3.526.3.1419\' \n' +
        'valueset "Disorders of Optic Chiasm": \'urn:oid:2.16.840.1.113883.3.526.3.1457\' \n' +
        'valueset "Disorders of Visual Cortex": \'urn:oid:2.16.840.1.113883.3.526.3.1458\' \n' +
        'valueset "Disseminated Chorioretinitis and Disseminated Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1459\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Focal Chorioretinitis and Focal Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1460\' \n' +
        'valueset "Glaucoma": \'urn:oid:2.16.840.1.113883.3.526.3.1423\' \n' +
        'valueset "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes": \'urn:oid:2.16.840.1.113883.3.526.3.1461\' \n' +
        'valueset "Hereditary Choroidal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1462\' \n' +
        'valueset "Hereditary Corneal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1424\' \n' +
        'valueset "Hereditary Retinal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1463\' \n' +
        'valueset "Hypotony of Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1426\' \n' +
        'valueset "Injury to Optic Nerve and Pathways": \'urn:oid:2.16.840.1.113883.3.526.3.1427\' \n' +
        'valueset "Macular Scar of Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1559\' \n' +
        'valueset "Moderate or Severe Impairment, Better Eye, Profound Impairment Lesser Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1464\' \n' +
        'valueset "Morgagnian Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1558\' \n' +
        'valueset "Nystagmus and Other Irregular Eye Movements": \'urn:oid:2.16.840.1.113883.3.526.3.1465\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Open Wound of Eyeball": \'urn:oid:2.16.840.1.113883.3.526.3.1430\' \n' +
        'valueset "Optic Atrophy": \'urn:oid:2.16.840.1.113883.3.526.3.1466\' \n' +
        'valueset "Optic Neuritis": \'urn:oid:2.16.840.1.113883.3.526.3.1467\' \n' +
        'valueset "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1468\' \n' +
        'valueset "Other Background Retinopathy and Retinal Vascular Changes": \'urn:oid:2.16.840.1.113883.3.526.3.1469\' \n' +
        'valueset "Other Corneal Deformities": \'urn:oid:2.16.840.1.113883.3.526.3.1470\' \n' +
        'valueset "Other Disorders of Optic Nerve": \'urn:oid:2.16.840.1.113883.3.526.3.1471\' \n' +
        'valueset "Other Disorders of Sclera": \'urn:oid:2.16.840.1.113883.3.526.3.1472\' \n' +
        'valueset "Other Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1473\' \n' +
        'valueset "Other Proliferative Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.1480\' \n' +
        'valueset "Other Retinal Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1474\' \n' +
        'valueset "Pathologic Myopia": \'urn:oid:2.16.840.1.113883.3.526.3.1432\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Posterior Lenticonus": \'urn:oid:2.16.840.1.113883.3.526.3.1433\' \n' +
        'valueset "Prior Penetrating Keratoplasty": \'urn:oid:2.16.840.1.113883.3.526.3.1475\' \n' +
        'valueset "Profound Impairment, Both Eyes": \'urn:oid:2.16.840.1.113883.3.526.3.1476\' \n' +
        'valueset "Purulent Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1477\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
        'valueset "Retinal Detachment with Retinal Defect": \'urn:oid:2.16.840.1.113883.3.526.3.1478\' \n' +
        'valueset "Retinal Vascular Occlusion": \'urn:oid:2.16.840.1.113883.3.526.3.1479\' \n' +
        'valueset "Retrolental Fibroplasias": \'urn:oid:2.16.840.1.113883.3.526.3.1438\' \n' +
        'valueset "Scleritis": \'urn:oid:2.16.840.1.113762.1.4.1226.1\' \n' +
        'valueset "Separation of Retinal Layers": \'urn:oid:2.16.840.1.113883.3.526.3.1482\' \n' +
        'valueset "Traumatic Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1443\' \n' +
        'valueset "Uveitis": \'urn:oid:2.16.840.1.113883.3.526.3.1444\' \n' +
        'valueset "Vascular Disorders of Iris and Ciliary Body": \'urn:oid:2.16.840.1.113883.3.526.3.1445\' \n' +
        'valueset "Visual Acuity 20/40 or Better": \'urn:oid:2.16.840.1.113883.3.526.3.1483\' \n' +
        'valueset "Visual Field Defects": \'urn:oid:2.16.840.1.113883.3.526.3.1446\' \n' +
        '\n' +
        'code "Best corrected visual acuity (observable entity)": \'419775003\' from "SNOMEDCT" display \'Best corrected visual acuity (observable entity)\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Numerator":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n' +
        '      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n' +
        '      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n' +
        '      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"\n' +
        '\n' +
        'define "Denominator Exclusions":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Diagnosis": "Acute and Subacute Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Amblyopia"]\n' +
        '      union ["Diagnosis": "Burn Confined to Eye and Adnexa"]\n' +
        '      union ["Diagnosis": "Cataract Secondary to Ocular Disorders"]\n' +
        '      union ["Diagnosis": "Cataract Congenital"]\n' +
        '      union ["Diagnosis": "Cataract Mature or Hypermature"]\n' +
        '      union ["Diagnosis": "Cataract Posterior Polar"]\n' +
        '      union ["Diagnosis": "Central Corneal Ulcer"]\n' +
        '      union ["Diagnosis": "Certain Types of Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Choroidal Degenerations"]\n' +
        '      union ["Diagnosis": "Choroidal Detachment"]\n' +
        '      union ["Diagnosis": "Choroidal Hemorrhage and Rupture"]\n' +
        '      union ["Diagnosis": "Chronic Iridocyclitis"]\n' +
        '      union ["Diagnosis": "Cloudy Cornea"]\n' +
        '      union ["Diagnosis": "Corneal Edema"]\n' +
        '      union ["Diagnosis": "Disorders of Cornea Including Corneal Opacity"]\n' +
        '      union ["Diagnosis": "Degeneration of Macula and Posterior Pole"]\n' +
        '      union ["Diagnosis": "Degenerative Disorders of Globe"]\n' +
        '      union ["Diagnosis": "Diabetic Macular Edema"]\n' +
        '      union ["Diagnosis": "Diabetic Retinopathy"]\n' +
        '      union ["Diagnosis": "Disorders of Optic Chiasm"]\n' +
        '      union ["Diagnosis": "Disorders of Visual Cortex"]\n' +
        '      union ["Diagnosis": "Disseminated Chorioretinitis and Disseminated Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Focal Chorioretinitis and Focal Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Glaucoma"]\n' +
        '      union ["Diagnosis": "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes"]\n' +
        '      union ["Diagnosis": "Hereditary Choroidal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hereditary Corneal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hereditary Retinal Dystrophies"]\n' +
        '      union ["Diagnosis": "Hypotony of Eye"]\n' +
        '      union ["Diagnosis": "Injury to Optic Nerve and Pathways"]\n' +
        '      union ["Diagnosis": "Macular Scar of Posterior Polar"]\n' +
        '      union ["Diagnosis": "Morgagnian Cataract"]\n' +
        '      union ["Diagnosis": "Nystagmus and Other Irregular Eye Movements"]\n' +
        '      union ["Diagnosis": "Open Wound of Eyeball"]\n' +
        '      union ["Diagnosis": "Optic Atrophy"]\n' +
        '      union ["Diagnosis": "Optic Neuritis"]\n' +
        '      union ["Diagnosis": "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis"]\n' +
        '      union ["Diagnosis": "Other Background Retinopathy and Retinal Vascular Changes"]\n' +
        '      union ["Diagnosis": "Other Disorders of Optic Nerve"]\n' +
        '      union ["Diagnosis": "Other Endophthalmitis"]\n' +
        '      union ["Diagnosis": "Other Proliferative Retinopathy"]\n' +
        '      union ["Diagnosis": "Pathologic Myopia"]\n' +
        '      union ["Diagnosis": "Posterior Lenticonus"]\n' +
        '      union ["Diagnosis": "Prior Penetrating Keratoplasty"]\n' +
        '      union ["Diagnosis": "Purulent Endophthalmitis"]\n' +
        '      union ["Diagnosis": "Retinal Detachment with Retinal Defect"]\n' +
        '      union ["Diagnosis": "Retinal Vascular Occlusion"]\n' +
        '      union ["Diagnosis": "Retrolental Fibroplasias"]\n' +
        '      union ["Diagnosis": "Scleritis"]\n' +
        '      union ["Diagnosis": "Separation of Retinal Layers"]\n' +
        '      union ["Diagnosis": "Traumatic Cataract"]\n' +
        '      union ["Diagnosis": "Uveitis"]\n' +
        '      union ["Diagnosis": "Vascular Disorders of Iris and Ciliary Body"]\n' +
        '      union ["Diagnosis": "Visual Field Defects"] ) ComorbidDiagnosis\n' +
        '      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    where AgeInYearsAt(date from start of "Measurement Period")>= 18\n' +
        '\n' +
        'define "Cataract Surgery Between January and September of Measurement Period":\n' +
        '  ["Procedure, Performed": "Cataract Surgery"] CataractSurgery\n' +
        '    where Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) during "Measurement Period"\n' +
        '      and Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) starts 92 days or more before \n' +
        '      end of "Measurement Period"\n' +
        'define "IPPBoolean":\n' +
        'true'

    public static readonly returnBooleanPatientBasedQDM_CQL = 'library BreastCancerScreening version \'12.0.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        'include AdultOutpatientEncountersQDM version \'1.0.000\' called AdultOutpatientEncounters\n' +
        'include HospiceQDM version \'1.0.000\' called Hospice\n' +
        'include PalliativeCareQDM version \'4.0.000\' called PalliativeCare\n' +
        'include AdvancedIllnessandFrailtyQDM version \'9.0.000\' called AIFrailLTCF\n' +
        '\n' +
        'codesystem "AdministrativeGender": \'urn:oid:2.16.840.1.113883.5.1\' \n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\' \n' +
        '\n' +
        'valueset "Bilateral Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1005\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "History of bilateral mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1068\' \n' +
        'valueset "Mammography": \'urn:oid:2.16.840.1.113883.3.464.1003.108.12.1018\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Outpatient": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1087\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
        'valueset "Status Post Left Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1069\' \n' +
        'valueset "Status Post Right Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1070\' \n' +
        'valueset "Unilateral Mastectomy Left": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1133\' \n' +
        'valueset "Unilateral Mastectomy Right": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1134\' \n' +
        'valueset "Unilateral Mastectomy, Unspecified Laterality": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1071\' \n' +
        '\n' +
        'code "Female": \'F\' from "AdministrativeGender" display \'Female\'\n' +
        'code "Left (qualifier value)": \'7771000\' from "SNOMEDCT" display \'Left (qualifier value)\'\n' +
        'code "Right (qualifier value)": \'24028007\' from "SNOMEDCT" display \'Right (qualifier value)\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "Bilateral Mastectomy Diagnosis":\n' +
        '  ["Diagnosis": "History of bilateral mastectomy"] BilateralMastectomyHistory\n' +
        '    where BilateralMastectomyHistory.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Bilateral Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Bilateral Mastectomy"] BilateralMastectomyPerformed\n' +
        '    where Global."NormalizeInterval" ( BilateralMastectomyPerformed.relevantDatetime, BilateralMastectomyPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "Denominator Exclusions":\n' +
        '  Hospice."Has Hospice Services"\n' +
        '    or ( ( exists ( "Right Mastectomy Diagnosis" )\n' +
        '          or exists ( "Right Mastectomy Procedure" )\n' +
        '      )\n' +
        '        and ( exists ( "Left Mastectomy Diagnosis" )\n' +
        '            or exists ( "Left Mastectomy Procedure" )\n' +
        '        )\n' +
        '    )\n' +
        '    or exists "Bilateral Mastectomy Diagnosis"\n' +
        '    or exists "Bilateral Mastectomy Procedure"\n' +
        '    or AIFrailLTCF."Is Age 66 or Older with Advanced Illness and Frailty"\n' +
        '    or AIFrailLTCF."Is Age 66 or Older Living Long Term in a Nursing Home"\n' +
        '    or PalliativeCare."Has Palliative Care in the Measurement Period"\n' +
        '\n' +
        'define "Left Mastectomy Diagnosis":\n' +
        '  ( ["Diagnosis": "Status Post Left Mastectomy"]\n' +
        '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
        '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Left (qualifier value)"\n' +
        '    ) ) LeftMastectomy\n' +
        '    where LeftMastectomy.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Left Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Unilateral Mastectomy Left"] UnilateralMastectomyLeftPerformed\n' +
        '    where Global."NormalizeInterval" ( UnilateralMastectomyLeftPerformed.relevantDatetime, UnilateralMastectomyLeftPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Right Mastectomy Diagnosis":\n' +
        '  ( ["Diagnosis": "Status Post Right Mastectomy"] RightMastectomyProcedure\n' +
        '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
        '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Right (qualifier value)"\n' +
        '    ) ) RightMastectomy\n' +
        '    where RightMastectomy.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Right Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Unilateral Mastectomy Right"] UnilateralMastectomyRightPerformed\n' +
        '    where Global."NormalizeInterval" ( UnilateralMastectomyRightPerformed.relevantDatetime, UnilateralMastectomyRightPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  exists ( ["Patient Characteristic Sex": "Female"] )\n' +
        '    and AgeInYearsAt(date from \n' +
        '      end of "Measurement Period"\n' +
        '    )in Interval[52, 74]\n' +
        '    and exists AdultOutpatientEncounters."Qualifying Encounters"\n' +
        '\n' +
        'define "Numerator":\n' +
        '  exists ( ["Diagnostic Study, Performed": "Mammography"] Mammogram\n' +
        '      where ( Global."NormalizeInterval" ( Mammogram.relevantDatetime, Mammogram.relevantPeriod ) ends during day of Interval["October 1 Two Years Prior to the Measurement Period", \n' +
        '        end of "Measurement Period"]\n' +
        '      )\n' +
        '  )\n' +
        '\n' +
        'define "October 1 Two Years Prior to the Measurement Period":\n' +
        '  DateTime((year from start of "Measurement Period" - 2), 10, 1, 0, 0, 0, 0, 0)'

    public static readonly QDMHightlightingTabDefUsed_CQL = 'library DemoQDMMeasure version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        '// include TestMATGlobal version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\'\n' +
        'code "Dead (finding)": \'419099009\' from "SNOMEDCT" display \'Dead (finding)\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n' +
        '  \n' +
        'define "Denominator":\n' +
        '  "Initial Population" \n' +
        'define "Numerator":\n' +
        '  "Qualifying Encounters" Enc\n' +
        '    where Enc.lengthOfStay > 1 day\n' +
        '// single line comment\n' +
        '\n' +
        'define "Qualifying Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
        '    \n' +
        '/**\n' +
        ' * Test comment 1\n' +
        ' * another comment.\n' +
        ' */\n' +
        '\n' +
        'define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed"):\n' +
        '  duration in days of QualifyingEncounter.relevantPeriod\n' +
        '  \n' +
        'define "Unused Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"  \n' +
        '    \n' +
        'define "Denominator Exclusion":\n' +
        '   ["Encounter, Performed": "Admit Inpatient"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"'

    public static readonly QDMHighlightingTab_CQL = 'library HighlightingQDM version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +

        'codesystem "Test": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +

        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": \'urn:oid:2.16.840.1.113883.3.3157.4036\'\n' +
        'valueset "Active Peptic Ulcer": \'urn:oid:2.16.840.1.113883.3.3157.4031\'\n' +
        'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\'\n' +
        'valueset "Allergy to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.5\'\n' +
        'valueset "Anticoagulant Medications, Oral": \'urn:oid:2.16.840.1.113883.3.3157.4045\'\n' +
        'valueset "Aortic Dissection and Rupture": \'urn:oid:2.16.840.1.113883.3.3157.4028\'\n' +
        'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\'\n' +
        'valueset "Cardiopulmonary Arrest": \'urn:oid:2.16.840.1.113883.3.3157.4048\'\n' +
        'valueset "Cerebral Vascular Lesion": \'urn:oid:2.16.840.1.113883.3.3157.4025\'\n' +
        'valueset "Closed Head and Facial Trauma": \'urn:oid:2.16.840.1.113883.3.3157.4026\'\n' +
        'valueset "Dementia": \'urn:oid:2.16.840.1.113883.3.3157.4043\'\n' +
        'valueset "Discharge To Acute Care Facility": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.87\'\n' +

        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +

        'parameter "Measurement Period" Interval<DateTime>\n' +

        'context Patient\n' +

        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +

        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +

        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +

        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +


        'define "Initial Population":\n' +
        '      ["Encounter, Performed": "Emergency Department Visit"]\n' + //Encounter
        '      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n' + //Encounter
        '      union ["Encounter, Performed": "Dementia"]\n' + //Encounter

        'define "Denominator":\n' +
        '  "Initial Population"\n' +

        'define "Denominator Exclusion":\n' +
        '  ["Encounter, Performed"] E where (duration in days of E.relevantPeriod) > 10\n' +

        'define "Numerator":\n' +
        '  ["Encounter, Performed"] E where E.relevantPeriod starts during day of "Measurement Period"\n' +

        'define function denomObs(Encounter "Encounter, Performed"):\n' +
        '  duration in seconds of Encounter.relevantPeriod\n' +

        'define function numerObs(Encounter "Encounter, Performed"):\n' +
        '  duration in days of Encounter.relevantPeriod\n' +

        'define "IP2":\n' +
        '    exists ["Encounter, Performed"] E'

    public static readonly qiCoreTestCQL = 'library TestLibrary51723751438142 version \'0.0.000\'\n' +
        'using QICore version \'4.1.1\'\n' +
        '\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
        'include MATGlobalCommonFunctionsFHIR4 version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\'\n' +
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
        'valueset "Pregnancy or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1623\'\n' +
        'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
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
        '  AgeInYearsAt (start of "Measurement Period") >= 20\n'

    public static readonly QiCoreCQLSDE = 'library QiCoreCQLLibrary1739988331418 version \'0.0.000\'\n' +

        'using QICore version \'4.1.1\'\n' +
        '\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        'include SupplementalDataElements version \'3.5.000\' called SDE\n' +
        'include MATGlobalCommonFunctionsFHIR4 version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "ICD10CM": \'http://hl7.org/fhir/sid/icd-10-cm\'\n' +
        '\n' +
        'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
        'valueset "Atherosclerosis and Peripheral Arterial Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.21\'\n' +
        'valueset "Breastfeeding": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.73\'\n' +
        'valueset "CABG Surgeries": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.694\'\n' +
        'valueset "CABG, PCI Procedure": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.566\'\n' +
        'valueset "Carotid Intervention": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.204\'\n' +
        'valueset "Cerebrovascular Disease, Stroke, TIA": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.44\'\n' +
        'valueset "Diabetes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001\'\n' +
        'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\'\n' +
        'valueset "Hepatitis A": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1024\'\n' +
        'valueset "Hepatitis B": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.67.1.101.1.269\'\n' +
        'valueset "High Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1572\'\n' +
        'valueset "Hospice Care Ambulatory": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1584\'\n' +
        'valueset "Hypercholesterolemia": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.100\'\n' +
        'valueset "Ischemic Heart Disease or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.46\'\n' +
        'valueset "LDL Cholesterol": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1573\'\n' +
        'valueset "Liver Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.42\'\n' +
        'valueset "Low Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1574\'\n' +
        'valueset "Moderate Intensity Statin Therapy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1575\'\n' +
        'valueset "Myocardial Infarction": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.403\'\n' +
        'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
        'valueset "Outpatient Consultation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1008\'\n' +
        'valueset "Outpatient Encounters for Preventive Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1576\'\n' +
        'valueset "Palliative Care Encounter": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1575\'\n' +
        'valueset "Palliative or Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1579\'\n' +
        'valueset "PCI": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1045.67\'\n' +
        'valueset "Pregnancy or Other Related Diagnoses": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.600.1.1623\'\n' +
        'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
        'valueset "Preventive Care Services - Other": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1030\'\n' +
        'valueset "Preventive Care Services-Individual Counseling": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1026\'\n' +
        'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
        'valueset "Rhabdomyolysis": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.102\'\n' +
        'valueset "Stable and Unstable Angina": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.47\'\n' +
        'valueset "Statin Allergen": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1110.42\'\n' +
        'valueset "Statin Associated Muscle Symptoms": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1108.85\'\n' +
        '\n' +
        'code "Encounter for palliative care": \'Z51.5\' from "ICD10CM" display \'Encounter for palliative care\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        '\n' +
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
        '\n' +
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
        '\n' +
        '\n' +
        'define "Denominator Exceptions 1":\n' +
        '  true\n' +
        '\n' +
        'define "Denominator Exceptions 2":\n' +
        '  true\n' +
        '\n' +
        'define "Denominator Exceptions 3":\n' +
        '  true\n' +
        '\n' +
        '\n'

    public static readonly SBTESTCMS347_CQL = 'library SBTESTCMS347 version \'0.0.016\'\n' +
        '\n' +
        'using FHIR version \'4.0.1\'\n' +
        '\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
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
        'true\n' +
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
        'include SupplementalDataElements  version \'3.5.000\' called SDE\n' +
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

        'define "SDE Ethnicity":\n' +
        'SDE."SDE Ethnicity"\n' +

        'define "SDE Race":\n' +
        'SDE."SDE Race"\n' +

        'define "SDE Sex":\n' +
        'SDE."SDE Sex"\n' +

        'define "SDE Payer":\n' +
        'SDE."SDE Payer"\n' +

        'define function test():\n' +
        ' true\n' +

        'define "track1":\n' +
        ' true\n'

    public static readonly CQLQDMObservationRun = 'library RatioListQDMPositiveEncounterPerformedWithMO1697030589521 version \'0.0.000\'\n' +

        'using QDM version \'5.6\'\n' +

        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\' \n' +

        'valueset "Diabetes": \'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Glucose Lab Test Mass Per Volume": \'urn:oid:2.16.840.1.113762.1.4.1248.34\' \n' +
        'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\' \n' +
        'valueset "Ketoacidosis": \'urn:oid:2.16.840.1.113762.1.4.1222.520\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +


        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +

        'define "Days in Hospitalization":\n' +

        '  "Measurement Population" EligibleInpatientHospitalization\n' +
        '    let period: Global."HospitalizationWithObservation" ( EligibleInpatientHospitalization ),\n' +
        '    relevantPeriod: "Hospital Days Max 10"(period)\n' +
        '    return Tuple {\n' +
        '      encounter: EligibleInpatientHospitalization,\n' +
        '      hospitalizationPeriod: period,\n' +
        '      relevantPeriod: relevantPeriod,\n' +
        '      relevantDays: "Days In Period"(relevantPeriod)\n' +
        '    }\n' +

        'define "Days with Glucose Results":\n' +
        '  "Days in Hospitalization" InpatientHospitalDays\n' +
        '    return Tuple {\n' +
        '      encounter: InpatientHospitalDays.encounter,\n' +
        '      relevantPeriod: InpatientHospitalDays.relevantPeriod,\n' +
        '      relevantDays: ( InpatientHospitalDays.relevantDays EncounterDay\n' +
        '          return Tuple {\n' +
        '            dayNumber: EncounterDay.dayNumber,\n' +
        '            dayPeriod: EncounterDay.dayPeriod,\n' +
        '            hasSevereResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where GlucoseTest.result > 300 \'mg/dL\'\n' +
        '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            ),\n' +
        '            hasElevatedResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where GlucoseTest.result >= 200 \'mg/dL\'\n' +
        '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            ),\n' +
        '            hasNoGlucoseTest: not exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '                where Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
        '            )\n' +
        '          }\n' +
        '      )\n' +
        '    }\n' +

        'define "Days with Hyperglycemic Events":\n' +
        '  "Days with Glucose Results" EncounterWithResultDays\n' +
        '    let eligibleEventDays: EncounterWithResultDays.relevantDays EncounterDay\n' +
        '      where EncounterDay.dayNumber > 1\n' +
        '      return Tuple {\n' +
        '        dayNumber: EncounterDay.dayNumber,\n' +
        '        dayPeriod: EncounterDay.dayPeriod,\n' +
        '        hasHyperglycemicEvent: ( EncounterDay.hasSevereResult\n' +
        '            or ( EncounterDay.hasNoGlucoseTest\n' +
        '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 2].hasElevatedResult\n' +
        '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 3].hasElevatedResult\n' +
        '            )\n' +
        '        )\n' +
        '      }\n' +
        '    return Tuple {\n' +
        '      encounter: EncounterWithResultDays.encounter,\n' +
        '      relevantPeriod: EncounterWithResultDays.relevantPeriod,\n' +
        '      eligibleEventDays: eligibleEventDays\n' +
        '    }\n' +

        'define "Denominator":\n' +
        '  "Initial Population"\n' +

        'define "Denominator Exclusions":\n' +
        '  "Encounter with First Glucose Greater Than or Equal to 1000"\n' +

        'define "Encounter with Elevated Glucose Greater Than or Equal to 200":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '      such that Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during Hospitalization.hospitalizationPeriod\n' +
        '        and GlucoseTest.result >= 200 \'mg/dL\'\n' +
        '    return Hospitalization.encounter\n' +

        'define "Encounter with Existing Diabetes Diagnosis":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Diagnosis": "Diabetes"] DiabetesCondition\n' +
        '      such that DiabetesCondition.prevalencePeriod starts before \n' +
        '      end of Hospitalization.hospitalizationPeriod\n' +
        '    return Hospitalization.encounter\n' +

        'define "Encounter with Hospitalization Period":\n' +
        '  "Qualifying Encounter" QualifyingHospitalization\n' +
        '    return Tuple {\n' +
        '      encounter: QualifyingHospitalization,\n' +
        '      hospitalizationPeriod: Global."HospitalizationWithObservation" ( QualifyingHospitalization )\n' +
        '    }\n' +

        'define "Encounter with Hyperglycemic Events":\n' +
        '  "Days with Hyperglycemic Events" HyperglycemicEventDays\n' +
        '    where exists ( HyperglycemicEventDays.eligibleEventDays EligibleEventDay\n' +
        '        where EligibleEventDay.hasHyperglycemicEvent\n' +
        '    )\n' +
        '    return HyperglycemicEventDays.encounter\n' +

        'define "Encounter with Hypoglycemic Medication":\n' +
        '  "Encounter with Hospitalization Period" Hospitalization\n' +
        '    with ["Medication, Administered": "Hypoglycemics Treatment Medications"] HypoglycemicMedication\n' +
        '      such that Global."NormalizeInterval" ( HypoglycemicMedication.relevantDatetime, HypoglycemicMedication.relevantPeriod ) starts during Hospitalization.hospitalizationPeriod\n' +
        '    return Hospitalization.encounter\n' +

        'define "Initial Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
        '  "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" GlucoseResult1000\n' +
        '    where not ( GlucoseResult1000.id in "Glucose Tests Earlier Than Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start".id )\n' +

        'define "Initial Population":\n' +
        '  "Encounter with Existing Diabetes Diagnosis"\n' +
        '    union "Encounter with Hypoglycemic Medication"\n' +
        '    union "Encounter with Elevated Glucose Greater Than or Equal to 200"\n' +

        'define "Measurement Population":\n' +
        '  "Denominator"\n' +

        'define "Numerator":\n' +
        '  "Encounter with Hyperglycemic Events"\n' +

        'define "Qualifying Encounter":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    where InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '      and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 18\n' +

        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +

        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +

        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +

        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +

        'define "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
        '  from\n' +
        '    "Initial Population" InpatientHospitalization,\n' +
        '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
        '    let HospitalizationInterval: Global."HospitalizationWithObservation" ( InpatientHospitalization ),\n' +
        '    GlucoseTestTime: Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod )\n' +
        '    where GlucoseTest.result >= 1000 \'mg/dL\'\n' +
        '      and GlucoseTest.result is not null\n' +
        '      and GlucoseTestTime during Interval[( start of HospitalizationInterval - 1 hour ), ( start of HospitalizationInterval + 6 hours )]\n' +
        '    return GlucoseTest\n' +

        'define "Encounter with First Glucose Greater Than or Equal to 1000":\n' +
        '  "Initial Population" InpatientHospitalization\n' +
        '    with "Initial Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" FirstGlucoseResult\n' +
        '      such that FirstGlucoseResult.result is not null\n' +
        '        and FirstGlucoseResult.result >= 1000 \'mg/dL\'\n' +
        '        and Global."EarliestOf" ( FirstGlucoseResult.relevantDatetime, FirstGlucoseResult.relevantPeriod ) during Interval[( start of Global."HospitalizationWithObservation" ( InpatientHospitalization ) - 1 hour ), ( start of Global."HospitalizationWithObservation" ( InpatientHospitalization ) + 6 hours )]\n' +
        '    return InpatientHospitalization\n' +

        'define "Glucose Tests Earlier Than Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
        '  from\n' +
        '    "Initial Population" InpatientHospitalization,\n' +
        '    "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" GlucoseResult1000,\n' +
        '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] EarlierGlucoseTest\n' +
        '    let HospitalizationInterval: Global."HospitalizationWithObservation" ( InpatientHospitalization ),\n' +
        '    GlucoseTest1000Time: Global."EarliestOf" ( GlucoseResult1000.relevantDatetime, GlucoseResult1000.relevantPeriod ),\n' +
        '    EarlierGlucoseTestTime: Global."EarliestOf" ( EarlierGlucoseTest.relevantDatetime, EarlierGlucoseTest.relevantPeriod )\n' +
        '    where GlucoseTest1000Time during Interval[( start of HospitalizationInterval - 1 hour ), ( start of HospitalizationInterval + 6 hour )]\n' +
        '      and EarlierGlucoseTestTime during Interval[( start of HospitalizationInterval - 1 hour ), GlucoseTest1000Time )\n' +
        '      and EarlierGlucoseTest is not null\n' +
        '      and EarlierGlucoseTest.id !~ GlucoseResult1000.id\n' +
        '    return GlucoseResult1000\n' +

        'define function "Interval To Day Numbers"(Period Interval<DateTime> ):\n' +
        '  ( expand { Interval[1, days between start of Period and \n' +
        '  end of Period]} ) DayExpand\n' +
        '    return \n' +
        '    end of DayExpand\n' +

        'define function "Hospital Days Max 10"(Period Interval<DateTime> ):\n' +
        '  Interval[start of Period, Min({ \n' +
        '    end of Period, start of Period + 10 days }\n' +
        '  )]\n' +

        'define function "Days In Period"(Period Interval<DateTime> ):\n' +
        '  ( "Interval To Day Numbers"(Period)) DayNumber\n' +
        '    let startPeriod: start of Period + ( 24 hours * ( DayNumber - 1 ) ),\n' +
        '    endPeriod: if ( hours between startPeriod and \n' +
        '      end of Period < 24\n' +
        '    ) then startPeriod \n' +
        '      else start of Period + ( 24 hours * DayNumber )\n' +
        '    return Tuple {\n' +
        '      dayNumber: DayNumber,\n' +
        '      dayPeriod: Interval[startPeriod, endPeriod )\n' +
        '    }\n' +

        'define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed" ):\n' +
        '  if QualifyingEncounter.id in "Denominator Exclusions".id then singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return 0\n' +
        '  ) \n' +
        '    else singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return Count(EncounterWithEventDays.eligibleEventDays)\n' +
        '  )\n' +

        'define function "Numerator Observations"(QualifyingEncounter "Encounter, Performed" ):\n' +
        '  if QualifyingEncounter.id in "Denominator Exclusions".id then singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return 0\n' +
        '  ) \n' +
        '    else singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return Count(EncounterWithEventDays.eligibleEventDays EligibleEventDay\n' +
        '          where EligibleEventDay.hasHyperglycemicEvent\n' +
        '      )\n' +
        '  )'

    public static readonly CQLHLResults_value = 'library BugQICoreMeasure version \'0.0.000\'\n' +

        'using QICore version \'4.1.1\'\n' +

        '/*Note ws 1. 8/09.2023: Negation issue as outlined in BonnieMat-1455 and ticket https://github.com/cqframework/cql-execution/issues/296 */\n' +

        'include FHIRHelpers version \'4.2.000\' called FHIRHelpers\n' +
        'include SupplementalDataElements  version \'3.5.000\' called SDE\n' +
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

        'define "SDE Ethnicity":\n' +
        'SDE."SDE Ethnicity"\n' +

        'define "SDE Race":\n' +
        'SDE."SDE Race"\n' +

        'define "SDE Sex":\n' +
        'SDE."SDE Sex"\n' +

        'define "SDE Payer":\n' +
        'SDE."SDE Payer"'

    public static readonly QDMMeasureWithMOandStrat = 'library MedianAdmitDecisionTimetoEDDepartureTimeforAdmittedPatients version \'11.1.000\'\n' +
        '\n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\' \n' +
        'valueset "Decision to Admit to Hospital Inpatient": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.295\' \n' +
        'valueset "Emergency Department Evaluation": \'urn:oid:2.16.840.1.113762.1.4.1111.163\' \n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
        'valueset "Hospital Settings": \'urn:oid:2.16.840.1.113762.1.4.1111.126\' \n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
        'valueset "Psychiatric/Mental Health Diagnosis": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.299\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  "ED Encounter with Decision to Admit"\n' +
        '\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n' +
        '\n' +
        'define "SDE Ethnicity":\n' +
        '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
        '\n' +
        'define "SDE Payer":\n' +
        '  ["Patient Characteristic Payer": "Payer"]\n' +
        '\n' +
        'define "SDE Race":\n' +
        '  ["Patient Characteristic Race": "Race"]\n' +
        '\n' +
        'define "SDE Sex":\n' +
        '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
        '\n' +
        'define "Stratification 2":\n' +
        '  /*Patient encounters with a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where exists ( EncounterInpatient.diagnoses Diagnosis\n' +
        '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
        '          and Diagnosis.rank = 1\n' +
        '    )\n' +
        '\n' +
        'define "Stratification 1":\n' +
        '  /*Patient encounters without a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where not exists ( EncounterInpatient.diagnoses Diagnosis\n' +
        '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
        '          and Diagnosis.rank = 1\n' +
        '    )\n' +
        '\n' +
        'define "Measure Population Exclusions":\n' +
        '  /*Exclude the most recent ED encounter (LastEDVisit) that occurred within an hour of the inpatient admission with ED admission source in "Hospital Setting" (any different facility- by location or CCN )*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where "LastEDEncounter"(EncounterInpatient).admissionSource in "Hospital Settings"\n' +
        '\n' +
        'define "ED Encounter with Decision to Admit":\n' +
        '  /*Constrains the inpatient encounter to having an ED visit with a decision to admit (assessment or order) to inpatient and ED facility location period is not null*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    let LastEDVisit: LastEDEncounter(EncounterInpatient),\n' +
        '    AdmitAssessment: "AdmitDecisionUsingAssessment"(EncounterInpatient)\n' +
        '    where ( Global."NormalizeInterval" ( AdmitAssessment.relevantDatetime, AdmitAssessment.relevantPeriod ) starts during LastEDVisit.relevantPeriod\n' +
        '        or ( "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime during LastEDVisit.relevantPeriod )\n' +
        '    )\n' +
        '      and exists ( LastEDVisit.facilityLocations Location\n' +
        '          where Location.code in "Emergency Department Visit"\n' +
        '            and Global."HasEnd" ( Location.locationPeriod )\n' +
        '      )\n' +
        '\n' +
        'define function "EDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  Global."ED Encounter" EDVisit\n' +
        '    where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
        '    sort by \n' +
        '    end of relevantPeriod ascending\n' +
        '\n' +
        'define function "LastEDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*The most recent (last) ED encounter that is within an hour of an inpatient encounter*/\n' +
        '  Last(Global."ED Encounter" EDVisit\n' +
        '      where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
        '      sort by \n' +
        '      end of relevantPeriod ascending\n' +
        '  )\n' +
        '\n' +
        'define function "EDDepartureTime"(Encounter "Encounter, Performed" ):\n' +
        '  /*The time the patient physically departed the Emergency Department*/\n' +
        '  Last(Encounter.facilityLocations Location\n' +
        '      where Location.code in "Emergency Department Visit"\n' +
        '        and Global."HasEnd"(Location.locationPeriod)\n' +
        '      return \n' +
        '      end of Location.locationPeriod\n' +
        '      sort ascending\n' +
        '  )\n' +
        '\n' +
        'define function "AdmitDecisionUsingEncounterOrder"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*Captures the decision to admit order and time that occurred during the last ED visit*/\n' +
        '  Last(["Encounter, Order": "Decision to Admit to Hospital Inpatient"] AdmitOrder\n' +
        '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
        '      where AdmitOrder.authorDatetime during LastEDVisit.relevantPeriod\n' +
        '        and AdmitOrder.authorDatetime before or on "EDDepartureTime"(LastEDVisit)\n' +
        '      sort by authorDatetime\n' +
        '  )\n' +
        '\n' +
        'define function "MeasureObservation"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*The duration from the Decision to Admit (order or assessment) to the departure from the Emergency Department*/\n' +
        '  duration in minutes of Interval[Coalesce(start of Global."NormalizeInterval"("AdmitDecisionUsingAssessment"(EncounterInpatient).relevantDatetime, "AdmitDecisionUsingAssessment"(EncounterInpatient).relevantPeriod), "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime), "EDDepartureTime"("LastEDEncounter"(EncounterInpatient))]\n' +
        '\n' +
        'define function "AdmitDecisionUsingAssessment"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*Captures the decision to admit assessment, time, and result that was performed during the last ED visit*/\n' +
        '  Last(["Assessment, Performed": "Emergency Department Evaluation"] EDEvaluation\n' +
        '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
        '      where EDEvaluation.result in "Admit Inpatient"\n' +
        '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts during LastEDVisit.relevantPeriod\n' +
        '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts before or on "EDDepartureTime"(LastEDVisit)\n' +
        '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
        '  )'

    public static readonly ICFTest_CQL = 'library EXM124v7QICore4 version \'7.0.000\'\n' +

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

    public static readonly measureCQL_5138_test = 'library Library4969 version \'0.0.000\'\n' +
        'using QICore version \'4.1.1\'\n' +
        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
        'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
        'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
        'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
        'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
        'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
        'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        '\n' +
        'define "Initial Population":\n' +
        '  true\n' +
        ' \n' +
        ' define "ipp":\n' +
        '    true\n' +
        '    \n' +
        'define "mpopEx":\n' +
        '  ["Encounter"] E where E.status = \'finished\'\n' +
        ' \n' +
        'define function boolFunc():\n' +
        '  1\n' +
        '\n' +
        'define function boolFunc2():\n' +
        '  14\n' +
        '\n' +
        'define function daysObs(e Encounter):\n' +
        '  duration in days of e.period\n'

    public static readonly CQL_Dental_Example_Six = 'library ChildrenWhoHaveDentalDecayOrCavitiesFHIR version \'0.0.002\'\n' +
        '\n' +
        'using QICore version \'6.0.0\'\n' +
        '\n' +
        'include QICoreCommon version \'3.0.000\' called QICoreCommon\n' +
        'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
        'include SupplementalDataElements version \'4.1.000\' called SDE\n' +
        'include Hospice version \'7.0.000\' called Hospice\n' +
        'include Status version \'2.0.000\' called Status\n' +
        ' \n' +
        'codesystem "LOINC": \'http://loinc.org\' \n' +
        'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
        '\n' +
        'valueset "Clinical Oral Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.125.12.1003\' \n' +
        'valueset "Dental Caries": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.125.12.1004\' \n' +
        'valueset "Discharged to Health Care Facility for Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.207\' \n' +
        'valueset "Discharged to Home for Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.209\' \n' +
        'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\' \n' +
        '\n' +
        'code "Discharge to healthcare facility for hospice care (procedure)": \'428371000124100\' from "SNOMEDCT" display \'Discharge to healthcare facility for hospice care (procedure)\'\n' +
        'code "Discharge to home for hospice care (procedure)": \'428361000124107\' from "SNOMEDCT" display \'Discharge to home for hospice care (procedure)\'\n' +
        'code "Hospice care [Minimum Data Set]": \'45755-6\' from "LOINC" display \'Hospice care [Minimum Data Set]\'\n' +
        'code "Yes (qualifier value)": \'373066001\' from "SNOMEDCT" display \'Yes (qualifier value)\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        '\n' +
        'define "Initial Population":\n' +
        '    AgeInYearsAt(date from start of "Measurement Period")in Interval[1, 20]\n' +
        '        and exists ( "Qualifying Encounters" )\n' +
        '         \n' +
        'define "Qualifying Encounters": \n' +
        '    (([Encounter: "Clinical Oral Evaluation"]).isEncounterPerformed()) ValidEncounter\n' +
        '        where ValidEncounter.period.toInterval() during day of "Measurement Period"     \n' +
        '        \n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n' +
        '  \n' +
        'define "Denominator Exclusions":\n' +
        '    Hospice."Has Hospice Services"\n' +
        '\n' +
        'define "Numerator":\n' +
        '   exists ["QICore Condition Problems Health Concerns": "Dental Caries"] DentalCaries\n' +
        '        where DentalCaries.prevalenceInterval() overlaps "Measurement Period"\n' +
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
        'define "SDE Eth": \n' +
        '  SDE."SDE Eth"'

}
