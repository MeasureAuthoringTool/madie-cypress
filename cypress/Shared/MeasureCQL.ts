
export class MeasureCQL {
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


    public static readonly simpleQDM_CQL_with_incorrect_using = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6000\'\n' +
        '\n' +
        'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
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


    public static readonly simpleQDM_CQL_without_using = 'library Library1234556 version \'0.0.000\'\n' +

        'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
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
        'include PalliativeCareExclusionECQMQDM version \'1.0.000\' called PalliativeCare\n' +
        'include AdvancedIllnessandFrailtyExclusionECQMQDM version \'1.0.000\' called AIFrailLTCF\n' +
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

        'exists [\"Encounter\": \"Office Visit\"] E where E.period.low during \"Measurement Period\"\n' +



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

}
