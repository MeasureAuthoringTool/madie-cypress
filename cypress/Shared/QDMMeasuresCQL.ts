const standardSdeBlock =
    'define \"SDE Ethnicity\":\n' +
    '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n\n' +
    'define \"SDE Payer\":\n' +
    '  [\"Patient Characteristic Payer\": \"Payer Type\"]\n\n' +
    'define \"SDE Race\":\n' +
    '  [\"Patient Characteristic Race\": \"Race\"]\n\n' +
    'define \"SDE Sex\":\n' +
    '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n\n'

export class QdmCql {

    public static readonly qdmCQLManifestTest = 'library QDMManifestTestCQL version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
        'include TJCOverallQDM version \'8.0.000\' called TJC\n\n' +
        'valueset \"Antithrombotic Therapy for Ischemic Stroke\": \'urn:oid:2.16.840.1.113762.1.4.1110.62\'\n' +
        'valueset \"Ethnicity\": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset \"Medical Reason For Not Providing Treatment\": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.473\'\n' +
        'valueset \"ONC Administrative Sex\": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset \"Patient Refusal\": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.93\'\n' +
        'valueset \"Payer Type\": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset \"Pharmacological Contraindications For Antithrombotic Therapy\": \'urn:oid:2.16.840.1.113762.1.4.1110.52\'\n' +
        'valueset \"Race\": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
        'context Patient\n\n' +
        standardSdeBlock +
        'define \"Denominator Exclusions\":\n' +
        '  TJC.\"Ischemic Stroke Encounters with Discharge Disposition\"\n' +
        '    union TJC.\"Encounter with Comfort Measures during Hospitalization\"\n\n' +
        'define \"Encounter with Pharmacological Contraindications for Antithrombotic Therapy at Discharge\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with [\"Medication, Discharge\": \"Pharmacological Contraindications For Antithrombotic Therapy\"] Pharmacological\n' +
        '      such that Pharmacological.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n\n' +
        'define \"Reason for Not Giving Antithrombotic at Discharge\":\n' +
        '  [\"Medication, Not Discharged\": \"Antithrombotic Therapy for Ischemic Stroke\"] NoAntithromboticDischarge\n' +
        '    where NoAntithromboticDischarge.negationRationale in \"Medical Reason For Not Providing Treatment\"\n' +
        '      or NoAntithromboticDischarge.negationRationale in \"Patient Refusal\"\n\n' +
        'define \"Encounter with Documented Reason for No Antithrombotic At Discharge\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with \"Reason for Not Giving Antithrombotic at Discharge\" NoDischargeAntithrombotic\n' +
        '      such that NoDischargeAntithrombotic.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n\n' +
        'define \"Denominator Exceptions\":\n' +
        '  \"Encounter with Documented Reason for No Antithrombotic At Discharge\"\n' +
        '    union \"Encounter with Pharmacological Contraindications for Antithrombotic Therapy at Discharge\"\n\n' +
        'define \"Numerator\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\" IschemicStrokeEncounter\n' +
        '    with [\"Medication, Discharge\": \"Antithrombotic Therapy for Ischemic Stroke\"] DischargeAntithrombotic\n' +
        '      such that DischargeAntithrombotic.authorDatetime during IschemicStrokeEncounter.relevantPeriod\n\n' +
        'define \"Initial Population\":\n' +
        '  TJC.\"Ischemic Stroke Encounter\"\n\n' +
        'define \"Denominator\":\n' +
        '  \"Initial Population\"\n'

    public static readonly qdmCQLNonPatienBasedTest = 'library NonPatientBasedCVmeasurewithMultiplegroupsStratifications version \'0.0.000\'\n\n' +
        'using QDM version \'5.6\'\n\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        standardSdeBlock +
        'define "Strat 1":\n' +
        '    ["Encounter, Performed": "Encounter Inpatient"]\n\n' +
        'define "Strat 2":\n' +
        '    ["Encounter, Performed": "Emergency Department Visit"]\n\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n\n' +
        'define "Measure Population Exclusion":\n' +
        '  ["Encounter, Performed": "Observation Services"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
        'define "Qualifying Encounters":\n' +
        '  ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
        'define function "Measure Observation hours"(Encounter "Encounter, Performed"):\n' +
        '  duration in hours of Encounter.relevantPeriod\n\n' +
        'define function "Measure Observation minutes"(Encounter "Encounter, Performed"):\n' +
        '  duration in minutes of Encounter.relevantPeriod'

    public static readonly qdmCQLPatientBasedTest = 'library RatioPatientBasedTestCQLLib version \'0.0.000\'\n\n' +
        'using QDM version \'5.6\'\n\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        standardSdeBlock + 
        'define "Strat 1":\n' +
        '    ["Encounter, Performed": "Encounter Inpatient"]\n\n' +
        'define "Strat 2":\n' +
        '    ["Encounter, Performed": "Emergency Department Visit"]\n\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n\n' +
        'define "Measure Population Exclusion":\n' +
        '  ["Encounter, Performed": "Observation Services"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
        'define "Qualifying Encounters":\n' +
        '  exists ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
        '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
        'define function "MeasureObservation"():\n' +
        'true\n\n' +
        'define function "Measure Observation hours"():\n' +
        '    8\n\n' +
        'define function "Measure Observation minutes"(Encounter "Encounter, Performed"):\n' +
        '  duration in minutes of Encounter.relevantPeriod'

    public static readonly qdmMeasureCQLPRODCataracts2040BCVAwithin90Days = 'library Cataracts2040BCVAwithin90Days version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
        'codesystem "AdministrativeGender": \'urn:oid:2.16.840.1.113883.5.1\'\n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n' +
        'codesystem "CPT": \'urn:oid:2.16.840.1.113883.6.12\'\n\n' +
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
        'valueset "Visual Field Defects": \'urn:oid:2.16.840.1.113883.3.526.3.1446\'\n\n' +
        'code "Best corrected visual acuity (observable entity)": \'419775003\' from "SNOMEDCT" display \'Best corrected visual acuity (observable entity)\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        standardSdeBlock +
        'define "Denominator":\n' +
        '  "Initial Population"\n\n' +
        'define "Numerator":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n' +
        '      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n' +
        '      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n' +
        '      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"\n\n' +
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
        '      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n\n' +
        'define "Initial Population":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    where AgeInYearsAt(date from start of "Measurement Period")>= 18\n\n' +
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
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer\"]\n\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n\n' +
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
        standardSdeBlock +
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

    public static readonly simpleQDM_CQL_with_incorrect_using = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6000\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        standardSdeBlock + 
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
        standardSdeBlock + 
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
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n\n' +
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
        'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
        'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
        'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
        'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\'\n\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        'define "Denominator":\n' +
        '\t  "Initial Population"\n\n' +
        'define "Initial Population":\n' +
        '\t  "Inpatient Encounters"\n\n' +
        'define "Numerator":\n' +
        '\t  "Initial Population"\n\n' +
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer\"]\n\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n\n' +
        'define "SDE Results":\n' +
        '  {\n' +
        '  // First physical exams\n' +
        '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
        '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
        '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
        '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
        '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
        '  // Weight uses lab test timing\n' +
        '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n\n' +
        '  // First lab tests\n' +
        '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
        '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
        '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
        '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
        '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
        '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
        '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
        '  }\n\n' +
        'define "Inpatient Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
        '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
        '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
        '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n\n' +
        'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
        '  difference in days between start of Stay and \n' +
        '  end of Stay\n\n' +
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
        '    }\n\n' +
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
        '    }\n\n' +
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
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n\n' +
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
        'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
        'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
        'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
        'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\'\n\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        'define "Denominator":\n' +
        '\t  "Initial Population"\n\n' +
        'define "Initial Population":\n' +
        '\t  "Inpatient Encounters"\n\n' +
        'define "Numerator":\n' +
        '\t  "Initial Population"\n\n' +
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer\"]\n\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n\n' +
        'define "SDE Results":\n' +
        '  {\n' +
        '  // First physical exams\n' +
        '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
        '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
        '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
        '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
        '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
        '  // Weight uses lab test timing\n' +
        '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n\n' +
        '  // First lab tests\n' +
        '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
        '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
        '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
        '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
        '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
        '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
        '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
        '  }\n\n' +
        'define "Inpatient Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
        '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
        '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
        '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
        '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
        '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n\n' +
        'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
        '  difference in days between start of Stay and \n' +
        '  end of Stay\n\n' +
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
        '    }\n\n' +
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
        '    }\n\n' +
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
        'using QDM version \'5.6\'\n\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n\n' +
        'define "Patient16To23":\n' +
        '  AgeInYearsAt(start of "Measurement Period") >= 16\n' +
        '    and AgeInYearsAt(start of "Measurement Period") < 24\n'

    public static readonly simpleQDM_CQL = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        'define \"SDE Ethnicity\":\n' +
        '  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\n\n' +
        'define \"SDE Payer\":\n' +
        '  [\"Patient Characteristic Payer\": \"Payer\"]\n\n' +
        'define \"SDE Race\":\n' +
        '  [\"Patient Characteristic Race\": \"Race\"]\n\n' +
        'define \"SDE Sex\":\n' +
        '  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\n\n' +
        'define "ipp":\n' +
        '\ttrue\n' +
        'define "d":\n' +
        '\t true\n' +
        'define "n":\n' +
        '\ttrue'

    public static readonly simpleQDM_CQL_invalid_valueset = 'library Library1234556 version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837b\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n' +
        standardSdeBlock +
        'define "ipp":\n' +
        '\ttrue\n' +
        'define "d":\n' +
        '\t true\n' +
        'define "n":\n' +
        '\ttrue'

    public static readonly returnNonBooleanListOfSameTypeQDM_CQL = 'library Cataracts2040BCVAwithin90Days version \'12.0.000\'\n\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n\n' +
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
        'valueset "Visual Field Defects": \'urn:oid:2.16.840.1.113883.3.526.3.1446\'\n\n' +
        'code "Best corrected visual acuity (observable entity)": \'419775003\' from "SNOMEDCT" display \'Best corrected visual acuity (observable entity)\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        standardSdeBlock +
        'define "Denominator":\n' +
        '  "Initial Population"\n\n' +
        'define "Numerator":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n' +
        '      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n' +
        '      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n' +
        '      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
        '        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"\n\n' +
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
        '      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n\n' +
        'define "Initial Population":\n' +
        '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
        '    where AgeInYearsAt(date from start of "Measurement Period")>= 18\n\n' +
        'define "Cataract Surgery Between January and September of Measurement Period":\n' +
        '  ["Procedure, Performed": "Cataract Surgery"] CataractSurgery\n' +
        '    where Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) during "Measurement Period"\n' +
        '      and Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) starts 92 days or more before \n' +
        '      end of "Measurement Period"\n' +
        'define "IPPBoolean":\n' +
        'true'

    public static readonly returnBooleanPatientBasedQDM_CQL = 'library BreastCancerScreening version \'12.0.000\'\n\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        'include AdultOutpatientEncountersQDM version \'1.0.000\' called AdultOutpatientEncounters\n' +
        'include HospiceQDM version \'1.0.000\' called Hospice\n' +
        'include PalliativeCareQDM version \'4.0.000\' called PalliativeCare\n' +
        'include AdvancedIllnessandFrailtyQDM version \'9.0.000\' called AIFrailLTCF\n\n' +
        'codesystem "AdministrativeGender": \'urn:oid:2.16.840.1.113883.5.1\' \n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n\n' +
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
        'valueset "Unilateral Mastectomy, Unspecified Laterality": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1071\'\n\n' +
        'code "Female": \'F\' from "AdministrativeGender" display \'Female\'\n' +
        'code "Left (qualifier value)": \'7771000\' from "SNOMEDCT" display \'Left (qualifier value)\'\n' +
        'code "Right (qualifier value)": \'24028007\' from "SNOMEDCT" display \'Right (qualifier value)\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        standardSdeBlock +
        'define "Bilateral Mastectomy Diagnosis":\n' +
        '  ["Diagnosis": "History of bilateral mastectomy"] BilateralMastectomyHistory\n' +
        '    where BilateralMastectomyHistory.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Bilateral Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Bilateral Mastectomy"] BilateralMastectomyPerformed\n' +
        '    where Global."NormalizeInterval" ( BilateralMastectomyPerformed.relevantDatetime, BilateralMastectomyPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Denominator":\n' +
        '  "Initial Population"\n\n' +
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
        '    or PalliativeCare."Has Palliative Care in the Measurement Period"\n\n' +
        'define "Left Mastectomy Diagnosis":\n' +
        '  ( ["Diagnosis": "Status Post Left Mastectomy"]\n' +
        '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
        '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Left (qualifier value)"\n' +
        '    ) ) LeftMastectomy\n' +
        '    where LeftMastectomy.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Left Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Unilateral Mastectomy Left"] UnilateralMastectomyLeftPerformed\n' +
        '    where Global."NormalizeInterval" ( UnilateralMastectomyLeftPerformed.relevantDatetime, UnilateralMastectomyLeftPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Right Mastectomy Diagnosis":\n' +
        '  ( ["Diagnosis": "Status Post Right Mastectomy"] RightMastectomyProcedure\n' +
        '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
        '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Right (qualifier value)"\n' +
        '    ) ) RightMastectomy\n' +
        '    where RightMastectomy.prevalencePeriod starts on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Right Mastectomy Procedure":\n' +
        '  ["Procedure, Performed": "Unilateral Mastectomy Right"] UnilateralMastectomyRightPerformed\n' +
        '    where Global."NormalizeInterval" ( UnilateralMastectomyRightPerformed.relevantDatetime, UnilateralMastectomyRightPerformed.relevantPeriod ) ends on or before \n' +
        '    end of "Measurement Period"\n\n' +
        'define "Initial Population":\n' +
        '  exists ( ["Patient Characteristic Sex": "Female"] )\n' +
        '    and AgeInYearsAt(date from \n' +
        '      end of "Measurement Period"\n' +
        '    )in Interval[52, 74]\n' +
        '    and exists AdultOutpatientEncounters."Qualifying Encounters"\n\n' +
        'define "Numerator":\n' +
        '  exists ( ["Diagnostic Study, Performed": "Mammography"] Mammogram\n' +
        '      where ( Global."NormalizeInterval" ( Mammogram.relevantDatetime, Mammogram.relevantPeriod ) ends during day of Interval["October 1 Two Years Prior to the Measurement Period", \n' +
        '        end of "Measurement Period"]\n' +
        '      )\n' +
        '  )\n\n' +
        'define "October 1 Two Years Prior to the Measurement Period":\n' +
        '  DateTime((year from start of "Measurement Period" - 2), 10, 1, 0, 0, 0, 0, 0)'

    public static readonly QDMHightlightingTabDefUsed_CQL = 'library DemoQDMMeasure version \'0.0.000\'\n' +
        'using QDM version \'5.6\'\n' +
        '// include TestMATGlobal version \'1.0.000\' called Global\n\n' +
        'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\'\n' +
        'code "Dead (finding)": \'419099009\' from "SNOMEDCT" display \'Dead (finding)\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        'context Patient\n\n' +
        'define "Initial Population":\n' +
        '  "Qualifying Encounters"\n\n' +
        'define "Denominator":\n' +
        '  "Initial Population" \n' +
        'define "Numerator":\n' +
        '  "Qualifying Encounters" Enc\n' +
        '    where Enc.lengthOfStay > 1 day\n' +
        '// single line comment\n\n' +
        'define "Qualifying Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
        '/**\n' +
        ' * Test comment 1\n' +
        ' * another comment.\n' +
        ' */\n\n' +
        'define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed"):\n' +
        '  duration in days of QualifyingEncounter.relevantPeriod\n\n' +
        'define "Unused Encounters":\n' +
        '  ["Encounter, Performed": "Encounter Inpatient"] Encounter\n' +
        '    where Encounter.relevantPeriod ends during "Measurement Period"\n\n' +
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
        standardSdeBlock +
        'define "Initial Population":\n' +
        '      ["Encounter, Performed": "Emergency Department Visit"]\n' +
        '      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n' +
        '      union ["Encounter, Performed": "Dementia"]\n' +
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
        standardSdeBlock +
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
        '  )\n' +
        '    else singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
        '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
        '      return Count(EncounterWithEventDays.eligibleEventDays EligibleEventDay\n' +
        '          where EligibleEventDay.hasHyperglycemicEvent\n' +
        '      )\n' +
        '  )'

    public static readonly QDMMeasureWithMOandStrat = 'library MedianAdmitDecisionTimetoEDDepartureTimeforAdmittedPatients version \'11.1.000\'\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\n' +
        'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\'\n' +
        'valueset "Decision to Admit to Hospital Inpatient": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.295\'\n' +
        'valueset "Emergency Department Evaluation": \'urn:oid:2.16.840.1.113762.1.4.1111.163\'\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Hospital Settings": \'urn:oid:2.16.840.1.113762.1.4.1111.126\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Psychiatric/Mental Health Diagnosis": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.299\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        'define "Initial Population":\n' +
        '  "ED Encounter with Decision to Admit"\n\n' +
        'define "Measure Population":\n' +
        '  "Initial Population"\n\n' +
        standardSdeBlock +
        'define "Stratification 2":\n' +
        '  /*Patient encounters with a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where exists ( EncounterInpatient.diagnoses Diagnosis\n' +
        '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
        '          and Diagnosis.rank = 1\n' +
        '    )\n\n' +
        'define "Stratification 1":\n' +
        '  /*Patient encounters without a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where not exists ( EncounterInpatient.diagnoses Diagnosis\n' +
        '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
        '          and Diagnosis.rank = 1\n' +
        '    )\n\n' +
        'define "Measure Population Exclusions":\n' +
        '  /*Exclude the most recent ED encounter (LastEDVisit) that occurred within an hour of the inpatient admission with ED admission source in "Hospital Setting" (any different facility- by location or CCN )*/\n' +
        '  Global."Inpatient Encounter" EncounterInpatient\n' +
        '    where "LastEDEncounter"(EncounterInpatient).admissionSource in "Hospital Settings"\n\n' +
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
        '      )\n\n' +
        'define function "EDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  Global."ED Encounter" EDVisit\n' +
        '    where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
        '    sort by \n' +
        '    end of relevantPeriod ascending\n\n' +
        'define function "LastEDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*The most recent (last) ED encounter that is within an hour of an inpatient encounter*/\n' +
        '  Last(Global."ED Encounter" EDVisit\n' +
        '      where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
        '      sort by \n' +
        '      end of relevantPeriod ascending\n' +
        '  )\n\n' +
        'define function "EDDepartureTime"(Encounter "Encounter, Performed" ):\n' +
        '  /*The time the patient physically departed the Emergency Department*/\n' +
        '  Last(Encounter.facilityLocations Location\n' +
        '      where Location.code in "Emergency Department Visit"\n' +
        '        and Global."HasEnd"(Location.locationPeriod)\n' +
        '      return\n' +
        '      end of Location.locationPeriod\n' +
        '      sort ascending\n' +
        '  )\n\n' +
        'define function "AdmitDecisionUsingEncounterOrder"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*Captures the decision to admit order and time that occurred during the last ED visit*/\n' +
        '  Last(["Encounter, Order": "Decision to Admit to Hospital Inpatient"] AdmitOrder\n' +
        '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
        '      where AdmitOrder.authorDatetime during LastEDVisit.relevantPeriod\n' +
        '        and AdmitOrder.authorDatetime before or on "EDDepartureTime"(LastEDVisit)\n' +
        '      sort by authorDatetime\n' +
        '  )\n\n' +
        'define function "MeasureObservation"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*The duration from the Decision to Admit (order or assessment) to the departure from the Emergency Department*/\n' +
        '  duration in minutes of Interval[Coalesce(start of Global."NormalizeInterval"("AdmitDecisionUsingAssessment"(EncounterInpatient).relevantDatetime, "AdmitDecisionUsingAssessment"(EncounterInpatient).relevantPeriod), "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime), "EDDepartureTime"("LastEDEncounter"(EncounterInpatient))]\n\n' +
        'define function "AdmitDecisionUsingAssessment"(EncounterInpatient "Encounter, Performed" ):\n' +
        '  /*Captures the decision to admit assessment, time, and result that was performed during the last ED visit*/\n' +
        '  Last(["Assessment, Performed": "Emergency Department Evaluation"] EDEvaluation\n' +
        '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
        '      where EDEvaluation.result in "Admit Inpatient"\n' +
        '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts during LastEDVisit.relevantPeriod\n' +
        '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts before or on "EDDepartureTime"(LastEDVisit)\n' +
        '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
        '  )'

    public static readonly stiForPeopleWithHIV = 'library HIVSTITesting version \'2.0.000\'\n' +
        'using QDM version \'5.6\'\n\n' +
        'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
        'codesystem "CPT": \'urn:oid:2.16.840.1.113883.6.12\'\n\n' + 
        'valueset "Annual Wellness Visit": \'urn:oid:2.16.840.1.113883.3.526.3.1240\'\n' +
        'valueset "Chlamydia Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Face-to-Face Interaction": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1048\'\n' +
        'valueset "Gonorrhea Screening": \'urn:oid:2.16.840.1.113762.1.4.1258.1\'\n' +
        'valueset "HIV": \'urn:oid:2.16.840.1.113883.3.464.1003.120.12.1003\'\n' +
        'valueset "Home Healthcare Services": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
        'valueset "Office Visit": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Outpatient Consultation": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1008\'\n' +
        'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Preventive Care Services Established Office Visit, 18 and Up": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
        'valueset "Preventive Care Services Initial Office Visit, 18 and Up": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
        'valueset "Preventive Care Services, Initial Office Visit, 0 to 17": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1022\'\n' +
        'valueset "Preventive Care, Established Office Visit, 0 to 17": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1024\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Syphilis Tests": \'urn:oid:2.16.840.1.113762.1.4.1166.117\'\n' +
        'valueset "Telephone Visits": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1080\'\n' +
        'code "Unlisted preventive medicine service": \'99429\' from "CPT" display \'Unlisted preventive medicine service\'\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        'define "Denominator":\n' +
        '\t"Initial Population"\n' +
        'define "Initial Population":\n' +
        '\tAgeInYearsAt(date from start of "Measurement Period") >= 13\n' +
        'and "Has Qualifying Encounter During Measurement Period"\n' +
        'and "Has HIV Diagnosis Before End of Measurement Period"\n\n' +
        standardSdeBlock +
        'define "Numerator":\n' +
        '\t"Has Chlamydia Testing"\n' +
        'and "Has Gonorrhea Testing"\n' +
        'and "Has Syphilis Testing"\n\n' + 
        'define "Has HIV Diagnosis Before End of Measurement Period":\n' +
        '\texists ["Diagnosis": "HIV"] HIVDx\n' +
        'where HIVDx.prevalencePeriod starts on or before day of end of "Measurement Period"\n\n' +
        'define "Has Qualifying Encounter During Measurement Period":\n' +
        '\texists ( ( ["Encounter, Performed": "Office Visit"]\n' +
        'union ["Encounter, Performed": "Outpatient Consultation"]\n' +
        'union ["Encounter, Performed": "Annual Wellness Visit"]\n' +
        'union ["Encounter, Performed": "Face-to-Face Interaction"]\n' +
        'union ["Encounter, Performed": "Home Healthcare Services"]\n' +
        'union ["Encounter, Performed": "Preventive Care Services Established Office Visit, 18 and Up"]\n' +
        'union ["Encounter, Performed": "Preventive Care Services Initial Office Visit, 18 and Up"]\n' +
        'union ["Encounter, Performed": "Preventive Care Services, Initial Office Visit, 0 to 17"]\n' +
        'union ["Encounter, Performed": "Preventive Care, Established Office Visit, 0 to 17"]\n' +
        'union ["Encounter, Performed": "Telephone Visits"]\n' +
        'union ["Encounter, Performed": "Unlisted preventive medicine service"] ) QualifyingEncounter\n' +
        'where QualifyingEncounter.relevantPeriod during day of "Measurement Period"\n' +
        ')\n\n' +
        'define "Has Chlamydia Testing":\n' +
        '\texists ["Laboratory Test, Performed": "Chlamydia Screening"] ChlamydiaTest\n' +
        'where ChlamydiaTest.result is not null\n' +
        'and Global."LatestOf" ( ChlamydiaTest.relevantDatetime, ChlamydiaTest.relevantPeriod ) during day of "Measurement Period"\n\n' +
        'define "Has Gonorrhea Testing":\n' +
        '\texists ["Laboratory Test, Performed": "Gonorrhea Screening"] GonorrheaTest\n' +
        'where GonorrheaTest.result is not null\n' +
        'and Global."LatestOf" ( GonorrheaTest.relevantDatetime, GonorrheaTest.relevantPeriod ) during day of "Measurement Period"\n\n' +
        'define "Has Syphilis Testing":\n' +
        '\texists ["Laboratory Test, Performed": "Syphilis Tests"] SyphilisTest\n' +
        'where SyphilisTest.result is not null\n' +
        'and Global."LatestOf" ( SyphilisTest.relevantDatetime, SyphilisTest.relevantPeriod ) during day of "Measurement Period"'
}
