export class TestCaseJson {

    public static readonly TestCaseJson_Valid = '{ "resourceType": "Bundle", "id": "1366", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ { "fullUrl": "http://local/Encounter", ' +
        '"resource": { "id": "1", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1", "lastUpdated": "2021-10-13T03:34:10.160+00:00", ' +
        '"source": "#nEcAkGd8PRwPP5fA" }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep ' +
        '9th 2021 for Asthma<a name=\\"mm\\"/></div>" }, "status": "in-progress", "class": { "system": "http://terminology.hl7.org/' +
        'CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "text": "OutPatient" } ], "subject": ' +
        '{ "reference": "Patient/1" }, "participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe" ' +
        '} } ], "period": { "start": "2022-05-13T03:34:10.054+00:00" } } }, { "fullUrl": "http://local/Patient", "resource": { "id": "2", ' +
        '"resourceType": "Patient", "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health' +
        '</div>" }, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" }, "identifier": [ { ' +
        '"system": "http://clinfhir.com/fhir/NamingSystem/identifier", "value": "20181011LizzyHealth" } ], "name": [ { "use": "official", ' +
        '"text": "Lizzy Health", "family": "Health", "given": [ "Lizzy" ] } ], "gender": "female", "birthDate": "2000-10-11" } } ] }'

    public static readonly tcJSON_QDM_Value = '{\n' +
        '    "qdmVersion": "5.6",\n' +
        '    "dataElements": [\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "110246003",\n' +
        '            "system": "2.16.840.1.113883.6.96",\n' +
        '            "version": null,\n' +
        '            "display": "Contusion of preauricular region of face (disorder)"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "655cbf318dafab00007b3b52",\n' +
        '        "participant": [],\n' +
        '        "relatedTo": [],\n' +
        '        "qdmTitle": "Encounter, Performed",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",\n' +
        '        "qdmCategory": "encounter",\n' +
        '        "qdmStatus": "performed",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::EncounterPerformed",\n' +
        '        "description": "Encounter, Performed: Closed Head and Facial Trauma",\n' +
        '        "codeListId": "2.16.840.1.113883.3.3157.4026",\n' +
        '        "id": "655cbf318dafab00007b3b51",\n' +
        '        "relevantPeriod": {\n' +
        '          "low": "2025-01-09T06:00:00.000+00:00",\n' +
        '          "high": "2025-01-17T06:00:00.000+00:00",\n' +
        '          "lowClosed": true,\n' +
        '          "highClosed": true\n' +
        '        },\n' +
        '         "facilityLocations": [],\n' +
        '        "diagnoses": [\n' +
        '          {\n' +
        '            "qdmVersion": "5.6",\n' +
        '            "_type": "QDM::DiagnosisComponent",\n' +
        '            "_id": "655cbf9e8dafab00007b3bce",\n' +
        '            "code": {\n' +
        '              "code": "183452005",\n' +
        '              "system": "2.16.840.1.113883.6.96",\n' +
        '              "version": null,\n' +
        '              "display": "Emergency hospital admission (procedure)"\n' +
        '            },\n' +
        '            "presentOnAdmissionIndicator": {\n' +
        '              "code": "448951000124107",\n' +
        '              "system": "2.16.840.1.113883.6.96",\n' +
        '              "version": null,\n' +
        '              "display": "Admission to observation unit (procedure)"\n' +
        '            },\n' +
        '            "rank": 2\n' +
        '          }\n' +
        '        ]\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '         {\n' +
        '            "code": "2186-5",\n' +
        '            "system": "2.16.840.1.113883.6.238",\n' +
        '            "version": "1.2",\n' +
        '            "display": "Not Hispanic or Latino"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "655bbfc411c2490000a11edf",\n' +
        '        "qdmTitle": "Patient Characteristic Ethnicity",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.56",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "ethnicity",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicEthnicity",\n' +
        '        "id": "655bbfc411c2490000a11edf"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "M",\n' +
        '            "system": "2.16.840.1.113883.5.1",\n' +
        '            "version": "2022-11",\n' +
        '            "display": "Male"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "655bbfc211c2490000a11edd",\n' +
        '        "qdmTitle": "Patient Characteristic Sex",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.55",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "gender",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicSex",\n' +
        '        "id": "655bbfc211c2490000a11edd"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "2106-3",\n' +
        '            "system": "2.16.840.1.113883.6.238",\n' +
        '            "version": "1.2",\n' +
        '            "display": "White"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "655bbfc011c2490000a11edb",\n' +
        '        "qdmTitle": "Patient Characteristic Race",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.59",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "race",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicRace",\n' +
        '        "id": "655bbfc011c2490000a11edb"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [],\n' +
        '        "_id": "655bbfba11c2490000a11ed9",\n' +
        '        "qdmTitle": "Patient Characteristic Birthdate",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.54",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "birthdate",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicBirthdate",\n' +
        '        "id": "655bbfba11c2490000a11ed9",\n' +
        '        "birthDatetime": "1981-01-01T20:21:14.000+00:00"\n' +
        '      }\n' +
        '   ],\n' +
        '    "_id": "655bbf7811c2490000a11ecf",\n' +
        '    "birthDatetime": "1981-01-01T20:21:14.955+00:00"\n' +
        '  }\n'

    public static readonly tcJson_value = '{        "resourceType": "Bundle",        "id": "IP-Pass-CVPatient",        "meta": {' +
        '      "versionId": "1",\n' +
        '      "lastUpdated": "2022-09-14T15:14:42.152+00:00"\n' +
        '    },\n' +
        '    "type": "collection",\n' +
        '    "entry": [\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Patient/9d8e4246-78eb-4371-8aaf-120739a5bb9d",\n' +
        '        "resource": {\n' +
        '          "resourceType": "Patient",\n' +
        '          "id": "9d8e4246-78eb-4371-8aaf-120739a5bb9d",\n' +
        '          "meta": {\n' +
        '            "profile": [\n' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '            ]\n' +
        '          },\n' +
        '          "text": {\n' +
        '            "status": "generated",\n' +
        '            "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '          },\n' +
        '          "extension": [\n' +
        '            {\n' +
        '              "extension": [\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2106-3",\n' +
        '                    "display": "White"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "1002-5",\n' +
        '                    "display": "American Indian or Alaska Native"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2028-9",\n' +
        '                    "display": "Asian"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "detailed",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "1586-7",\n' +
        '                    "display": "Shoshone"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "detailed",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2036-2",\n' +
        '                    "display": "Filipino"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "text",\n' +
        '                  "valueString": "Mixed"\n' +
        '                }\n' +
        '              ],\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '            },\n' +
        '            {\n' +
        '              "extension": [\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2135-2",\n' +
        '                    "display": "Hispanic or Latino"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "detailed",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2184-0",\n' +
        '                    "display": "Dominican"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "detailed",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2148-5",\n' +
        '                    "display": "Mexican"\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "text",\n' +
        '                  "valueString": "Hispanic or Latino"\n' +
        '                }\n' +
        '              ],\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '            },\n' +
        '            {\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '              "valueCode": "F"\n' +
        '            },\n' +
        '            {\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '              "valueCodeableConcept": {\n' +
        '                "coding": [\n' +
        '                  {\n' +
        '                    "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '                    "code": "ASKU",\n' +
        '                    "display": "asked but unknown"\n' +
        '                  }\n' +
        '                ],\n' +
        '                "text": "asked but unknown"\n' +
        '              }\n' +
        '            }\n' +
        '          ],\n' +
        '          "identifier": [\n' +
        '            {\n' +
        '              "type": {\n' +
        '                "coding": [\n' +
        '                  {\n' +
        '                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
        '                    "code": "MR"\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "system": "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '              "value": "8065dc8d26797064d8766be71f2bf020"\n' +
        '            }\n' +
        '          ],\n' +
        '          "active": true,\n' +
        '          "name": [\n' +
        '            {\n' +
        '              "use": "usual",\n' +
        '              "family": "IPPass",\n' +
        '              "given": [\n' +
        '                "IPPass"\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "gender": "male",\n' +
        '          "birthDate": "1954-02-10"\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Encounter/5c6c61ceb84846536a9a98f9",\n' +
        '        "resource": {\n' +
        '          "resourceType": "Encounter",\n' +
        '          "id": "5c6c61ceb84846536a9a98f9",\n' +
        '          "status": "finished",\n' +
        '          "class": {\n' +
        '            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '            "code": "IMP",\n' +
        '            "display": "inpatient encounter"\n' +
        '          },\n' +
        '          "type": [\n' +
        '            {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://snomed.info/sct",\n' +
        '                  "code": "183452005"\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "subject": {\n' +
        '            "reference": "Patient/9d8e4246-78eb-4371-8aaf-120739a5bb9d"\n' +
        '          },\n' +
        '          "period": {\n' +
        '            "start": "2012-01-16T08:00:00+00:00",\n' +
        '            "end": "2012-02-15T09:00:00+00:00"\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Encounter/5c6c61ceb84846536a9a98f0",\n' +
        '        "resource": {\n' +
        '          "resourceType": "Encounter",\n' +
        '          "id": "5c6c61ceb84846536a9a98f0",\n' +
        '          "status": "finished",\n' +
        '          "class": {\n' +
        '            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '            "code": "IMP",\n' +
        '            "display": "inpatient encounter"\n' +
        '          },\n' +
        '          "type": [\n' +
        '            {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://snomed.info/sct",\n' +
        '                  "code": "183452005"\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "subject": {\n' +
        '            "reference": "Patient/9d8e4246-78eb-4371-8aaf-120739a5bb9d"\n' +
        '          },\n' +
        '          "period": {\n' +
        '            "start": "2012-01-16T08:00:00+00:00",\n' +
        '            "end": "2012-02-15T09:00:00+00:00"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    ]\n' +
        '  }\n'

    public static readonly tcResultsJson = '{\n' +
        '    "id": "652965fb306e456c01838959",\n' +
        '    "resourceType": "Bundle",\n' +
        '    "type": "collection",\n' +
        '    "entry": [\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Patient/df2f3da0-fd11-4d40-b312-ab6b0d1a46d8",\n' +
        '        "resource": {\n' +
        '          "id": "df2f3da0-fd11-4d40-b312-ab6b0d1a46d8",\n' +
        '          "meta": {\n' +
        '            "profile": [\n' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '            ]\n' +
        '          },\n' +
        '          "resourceType": "Patient",\n' +
        '          "extension": [\n' +
        '            {\n' +
        '              "extension": [\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "1002-5",\n' +
        '                    "display": "American Indian or Alaska Native",\n' +
        '                    "userSelected": true\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "text",\n' +
        '                  "valueString": "American Indian or Alaska Native"\n' +
        '                }\n' +
        '              ],\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '            },\n' +
        '            {\n' +
        '              "extension": [\n' +
        '                {\n' +
        '                  "url": "ombCategory",\n' +
        '                  "valueCoding": {\n' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                    "code": "2135-2",\n' +
        '                    "display": "Hispanic or Latino",\n' +
        '                    "userSelected": true\n' +
        '                  }\n' +
        '                },\n' +
        '                {\n' +
        '                  "url": "text",\n' +
        '                  "valueString": "Hispanic or Latino"\n' +
        '                }\n' +
        '              ],\n' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '            }\n' +
        '          ],\n' +
        '          "identifier": [\n' +
        '            {\n' +
        '              "type": {\n' +
        '                "coding": [\n' +
        '                  {\n' +
        '                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
        '                    "code": "MR"\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "system": "https://bonnie-fhir.healthit.gov/",\n' +
        '              "value": "652965fb306e456c01838959"\n' +
        '            }\n' +
        '          ],\n' +
        '          "name": [\n' +
        '            {\n' +
        '              "family": "Keerthi",\n' +
        '              "given": [\n' +
        '                "Prateek"\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "gender": "male",\n' +
        '          "birthDate": "2023-07-04"\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Encounter/psych-visit-diagnostic-evaluation-895a",\n' +
        '        "resource": {\n' +
        '          "id": "psych-visit-diagnostic-evaluation-895a",\n' +
        '          "resourceType": "Encounter",\n' +
        '          "status": "arrived",\n' +
        '          "class": {\n' +
        '            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '            "code": "ACUTE",\n' +
        '            "display": "inpatient acute",\n' +
        '            "userSelected": true\n' +
        '          },\n' +
        '          "type": [\n' +
        '            {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://snomed.info/sct",\n' +
        '                  "version": "2023-09",\n' +
        '                  "code": "10197000",\n' +
        '                  "display": "Psychiatric interview and evaluation (procedure)",\n' +
        '                  "userSelected": true\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "period": {\n' +
        '            "start": "2023-10-01T08:00:00.000+00:00",\n' +
        '            "end": "2023-10-15T08:15:00.000+00:00"\n' +
        '          }\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Condition/dementia-mental-degenerations-895b",\n' +
        '        "resource": {\n' +
        '          "id": "dementia-mental-degenerations-895b",\n' +
        '          "resourceType": "Condition",\n' +
        '          "code": {\n' +
        '            "coding": [\n' +
        '              {\n' +
        '                "system": "http://snomed.info/sct",\n' +
        '                "version": "2022-09",\n' +
        '                "code": "10349009",\n' +
        '                "display": "Multi-infarct dementia with delirium (disorder)",\n' +
        '                "userSelected": true\n' +
        '              }\n' +
        '            ]\n' +
        '          },\n' +
        '          "subject": {\n' +
        '            "reference": "Patient/df2f3da0-fd11-4d40-b312-ab6b0d1a46d8"\n' +
        '          },\n' +
        '          "onsetPeriod": {\n' +
        '            "start": "2023-10-13T08:00:00.000+00:00",\n' +
        '            "end": "2023-10-13T08:15:00.000+00:00"\n' +
        '          },\n' +
        '          "recordedDate": "2023-10-13T08:00:00.000+00:00"\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "fullUrl": "https://madie.cms.gov/Encounter/psych-visit-diagnostic-evaluation-895c",\n' +
        '        "resource": {\n' +
        '          "id": "psych-visit-diagnostic-evaluation-895c",\n' +
        '          "resourceType": "Encounter",\n' +
        '          "status": "arrived",\n' +
        '          "class": {\n' +
        '            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '            "code": "ACUTE",\n' +
        '            "display": "inpatient acute",\n' +
        '            "userSelected": true\n' +
        '          },\n' +
        '          "type": [\n' +
        '            {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://snomed.info/sct",\n' +
        '                  "version": "2023-09",\n' +
        '                  "code": "10197000",\n' +
        '                  "display": "Psychiatric interview and evaluation (procedure)",\n' +
        '                  "userSelected": true\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ],\n' +
        '          "subject": {\n' +
        '            "reference": "Patient/df2f3da0-fd11-4d40-b312-ab6b0d1a46d8"\n' +
        '          },\n' +
        '          "period": {\n' +
        '            "start": "2023-10-01T08:00:00.000+00:00",\n' +
        '            "end": "2023-10-15T08:15:00.000+00:00"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    ]\n' +
        '  }'

    public static readonly TestCaseJson_Valid_not_Lizzy_Health = '{ "resourceType": "Bundle", "id": "1366", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ { "fullUrl": "http://local/Encounter", ' +
        '"resource": { "id": "1", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1", "lastUpdated": "2021-10-13T03:34:10.160+00:00", ' +
        '"source": "#nEcAkGd8PRwPP5fA" }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep ' +
        '9th 2021 for Asthma<a name=\\"mm\\"/></div>" }, "status": "in-progress", "class": { "system": "http://terminology.hl7.org/' +
        'CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "text": "OutPatient" } ], "subject": ' +
        '{ "reference": "Patient/1" }, "participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe" ' +
        '} } ], "period": { "start": "2022-05-13T03:34:10.054+00:00" } } }, { "fullUrl": "http://local/Patient", "resource": { "id": "2", ' +
        '"resourceType": "Patient", "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Builder Bobby' +
        '</div>" }, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" }, "identifier": [ { ' +
        '"system": "http://clinfhir.com/fhir/NamingSystem/identifier", "value": "20181011LizzyHealth" } ], "name": [ { "use": "official", ' +
        '"text": "Builder Bobby", "family": "Bobby", "given": [ "Builder" ] } ], "gender": "female", "birthDate": "2000-10-11" } } ] }'

    public static readonly TestCaseJson_with_warnings = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", ' +
        ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter",' +
        ' "resource": { "id":"1", "resourceType": "Encounter", "meta": {' +
        ' "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",' +
        ' "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00",' +
        ' "source": "#nEcAkGd8PRwPP5fA"},' +
        ' "text": { "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
        ' "status": "finished","class": { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2021-01-01T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2", "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
        ' [ { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", ' +
        ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ] } ],"gender": "female","birthDate": "2000-10-11"} } ] }'

    public static readonly QDMTestCaseJson = '{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"2186-5\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":\"1.2\",\"display\":\"Not Hispanic or Latino\"}],\"_id\":\"648c85f4220ca7000054646c\",\"qdmTitle\":\"Patient Characteristic Ethnicity\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.56\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"ethnicity\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicEthnicity\",\"id\":\"648c85f4220ca7000054646c\"},{\"dataElementCodes\":[],\"_id\":\"648c7dcd220ca70000546465\",\"qdmTitle\":\"Patient Characteristic Birthdate\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.54\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"birthdate\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicBirthdate\",\"id\":\"648c7dcd220ca70000546465\",\"birthDatetime\":\"2020-01-01T16:35:39.000+00:00\"},{\"dataElementCodes\":[{\"code\":\"M\",\"system\":\"2.16.840.1.113883.5.1\",\"version\":\"2022-11\",\"display\":\"Male\"}],\"_id\":\"648c7d60220ca70000546449\",\"qdmTitle\":\"Patient Characteristic Sex\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.55\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"gender\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicSex\",\"id\":\"648c7d60220ca70000546449\"},{\"dataElementCodes\":[{\"code\":\"2131-1\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":\"1.2\",\"display\":\"Other Race\"}],\"_id\":\"648c7d24220ca70000546442\",\"qdmTitle\":\"Patient Characteristic Race\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.59\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"race\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicRace\",\"id\":\"648c7d24220ca70000546442\"},{\"dataElementCodes\":[],\"_id\":\"648c509863dbeb000033b3e0\",\"qdmTitle\":\"Patient Characteristic Expired\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.57\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"living\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicExpired\",\"id\":\"648c509863dbeb000033b3e0\"}],\"_id\":\"648c4dad63dbeb000033b36b\",\"birthDatetime\":\"2005-07-01T16:35:39.539+00:00\"}'

    public static readonly QDMTCJsonwMOElements = '{\n' +
        '    "qdmVersion": "5.6",\n' +
        '    "dataElements": [\n' +
        '      {\n' +
        '        "dataElementCodes": [],\n' +
        '        "_id": "6526a779c268b0000084a48f",\n' +
        '        "qdmTitle": "Patient Characteristic Birthdate",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.54",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "birthdate",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicBirthdate",\n' +
        '        "id": "6526a779c268b0000084a48f",\n' +
        '        "birthDatetime": "2003-07-31T12:00:37.000+00:00"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "2131-1",\n' +
        '            "system": "2.16.840.1.113883.6.238",\n' +
        '           "version": "1.2",\n' +
        '            "display": "Other Race"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526a785c268b0000084a496",\n' +
        '        "qdmTitle": "Patient Characteristic Race",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.59",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "race",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicRace",\n' +
        '        "id": "6526a785c268b0000084a496"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "M",\n' +
        '            "system": "2.16.840.1.113883.5.1",\n' +
        '            "version": "2022-11",\n' +
        '            "display": "Male"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526a787c268b0000084a498",\n' +
        '        "qdmTitle": "Patient Characteristic Sex",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.55",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "gender",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicSex",\n' +
        '        "id": "6526a787c268b0000084a498"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "2186-5",\n' +
        '            "system": "2.16.840.1.113883.6.238",\n' +
        '            "version": "1.2",\n' +
        '            "display": "Not Hispanic or Latino"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526a789c268b0000084a49a",\n' +
        '        "qdmTitle": "Patient Characteristic Ethnicity",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.56",\n' +
        '        "qdmCategory": "patient_characteristic",\n' +
        '        "qdmStatus": "ethnicity",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::PatientCharacteristicEthnicity",\n' +
        '        "id": "6526a789c268b0000084a49a"\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "46635009",\n' +
        '            "system": "2.16.840.1.113883.6.96",\n' +
        '            "version": null,\n' +
        '            "display": "Diabetes mellitus type 1 (disorder)"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526a772c268b0000084a48b",\n' +
        '        "recorder": [],\n' +
        '        "qdmTitle": "Diagnosis",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.110",\n' +
        '        "qrdaOid": "2.16.840.1.113883.10.20.24.3.135",\n' +
        '        "qdmCategory": "condition",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::Diagnosis",\n' +
        '        "description": "Diagnosis: Diabetes",\n' +
        '        "codeListId": "2.16.840.1.113883.3.464.1003.103.12.1001",\n' +
        '        "id": "6526a7f2c268b0000084a49c",\n' +
        '        "prevalencePeriod": {\n' +
        '          "low": "2023-07-09T12:00:00.000+00:00",\n' +
        '          "lowClosed": true,\n' +
        '          "highClosed": true\n' +
        '        }\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [],\n' +
        '        "_id": "6526ad93c268b0000084af2e",\n' +
        '        "participant": [],\n' +
        '        "relatedTo": [],\n' +
        '        "qdmTitle": "Encounter, Performed",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",\n' +
        '        "qdmCategory": "encounter",\n' +
        '        "qdmStatus": "performed",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::EncounterPerformed",\n' +
        '        "description": "Encounter, Performed: Encounter Inpatient",\n' +
        '        "codeListId": "2.16.840.1.113883.3.666.5.307",\n' +
        '        "id": "6526ada0c268b0000084b308",\n' +
        '        "relevantPeriod": {\n' +
        '          "low": "2023-07-11T12:00:00.000+00:00",\n' +
        '          "high": "2023-07-15T13:00:00.000+00:00",\n' +
        '          "lowClosed": true,\n' +
        '          "highClosed": true\n' +
        '        },\n' +
        '        "facilityLocations": [],\n' +
        '        "diagnoses": []\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "1556-0",\n' +
        '            "system": "2.16.840.1.113883.6.1",\n' +
        '            "version": null,\n' +
        '            "display": "Fasting glucose [Mass/volume] in Capillary blood"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526ad93c268b0000084af38",\n' +
        '        "performer": [],\n' +
        '        "relatedTo": [],\n' +
        '        "qdmTitle": "Laboratory Test, Performed",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.42",\n' +
        '        "qdmCategory": "laboratory_test",\n' +
        '        "qdmStatus": "performed",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::LaboratoryTestPerformed",\n' +
        '        "description": "Laboratory Test, Performed: Glucose Lab Test Mass Per Volume",\n' +
        '        "codeListId": "2.16.840.1.113762.1.4.1248.34",\n' +
        '        "id": "6526afd6c268b0000084b35f",\n' +
        '        "relevantDatetime": "2023-07-11T14:00:00.000+00:00",\n' +
        '        "result": {\n' +
        '          "value": "1000",\n' +
        '          "unit": "mg/dL"\n' +
        '        },\n' +
        '        "components": []\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "183452005",\n' +
        '            "system": "2.16.840.1.113883.6.96",\n' +
        '            "version": null,\n' +
        '            "display": "Emergency hospital admission (procedure)"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526ad93c268b0000084af2e",\n' +
        '        "participant": [],\n' +
        '        "relatedTo": [],\n' +
        '        "qdmTitle": "Encounter, Performed",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",\n' +
        '        "qdmCategory": "encounter",\n' +
        '        "qdmStatus": "performed",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::EncounterPerformed",\n' +
        '        "description": "Encounter, Performed: Encounter Inpatient",\n' +
        '        "codeListId": "2.16.840.1.113883.3.666.5.307",\n' +
        '        "id": "6526b107c268b0000084b3c2",\n' +
        '        "relevantPeriod": {\n' +
        '          "low": "2023-10-11T12:00:00.000+00:00",\n' +
        '          "high": "2023-10-18T12:15:00.000+00:00",\n' +
        '          "lowClosed": true,\n' +
        '          "highClosed": true\n' +
        '        },\n' +
        '        "facilityLocations": [],\n' +
        '        "diagnoses": []\n' +
        '      },\n' +
        '      {\n' +
        '        "dataElementCodes": [\n' +
        '          {\n' +
        '            "code": "1556-0",\n' +
        '            "system": "2.16.840.1.113883.6.1",\n' +
        '            "version": null,\n' +
        '            "display": "Fasting glucose [Mass/volume] in Capillary blood"\n' +
        '          }\n' +
        '        ],\n' +
        '        "_id": "6526ad93c268b0000084af38",\n' +
        '        "performer": [],\n' +
        '        "relatedTo": [],\n' +
        '        "qdmTitle": "Laboratory Test, Performed",\n' +
        '        "hqmfOid": "2.16.840.1.113883.10.20.28.4.42",\n' +
        '        "qdmCategory": "laboratory_test",\n' +
        '        "qdmStatus": "performed",\n' +
        '        "qdmVersion": "5.6",\n' +
        '        "_type": "QDM::LaboratoryTestPerformed",\n' +
        '        "description": "Laboratory Test, Performed: Glucose Lab Test Mass Per Volume",\n' +
        '        "codeListId": "2.16.840.1.113762.1.4.1248.34",\n' +
        '        "id": "6526b15dc268b0000084b45e",\n' +
        '        "relevantDatetime": "2023-10-13T12:00:00.000+00:00",\n' +
        '        "result": {\n' +
        '          "value": "1100",\n' +
        '          "unit": "mg/dL"\n' +
        '        },\n' +
        '        "components": []\n' +
        '      }\n' +
        '    ],\n' +
        '    "_id": "6526a771c268b0000084a474",\n' +
        '    "birthDatetime": "2003-07-31T12:00:37.561+00:00"\n' +
        '  }'

    public static readonly QDMTestCaseJson_for_update = '{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"2186-5\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":\"1.2\",\"display\":\"Hispanic or Latino\"}],\"_id\":\"648c85f4220ca7000054646c\",\"qdmTitle\":\"Patient Characteristic Ethnicity\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.56\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"ethnicity\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicEthnicity\",\"id\":\"648c85f4220ca7000054646c\"},{\"dataElementCodes\":[],\"_id\":\"648c7dcd220ca70000546465\",\"qdmTitle\":\"Patient Characteristic Birthdate\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.54\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"birthdate\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicBirthdate\",\"id\":\"648c7dcd220ca70000546465\",\"birthDatetime\":\"2020-01-01T16:35:39.000+00:00\"},{\"dataElementCodes\":[{\"code\":\"M\",\"system\":\"2.16.840.1.113883.5.1\",\"version\":\"2022-11\",\"display\":\"Female\"}],\"_id\":\"648c7d60220ca70000546449\",\"qdmTitle\":\"Patient Characteristic Sex\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.55\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"gender\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicSex\",\"id\":\"648c7d60220ca70000546449\"},{\"dataElementCodes\":[{\"code\":\"2131-1\",\"system\":\"2.16.840.1.113883.6.238\",\"version\":\"1.2\",\"display\":\"Other Race\"}],\"_id\":\"648c7d24220ca70000546442\",\"qdmTitle\":\"Patient Characteristic Race\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.59\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"race\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicRace\",\"id\":\"648c7d24220ca70000546442\"},{\"dataElementCodes\":[],\"_id\":\"648c509863dbeb000033b3e0\",\"qdmTitle\":\"Patient Characteristic Expired\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.57\",\"qdmCategory\":\"patient_characteristic\",\"qdmStatus\":\"expired\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::PatientCharacteristicExpired\",\"id\":\"648c509863dbeb000033b3e0\"}],\"_id\":\"648c4dad63dbeb000033b36b\",\"birthDatetime\":\"2020-01-01T16:35:39.539+00:00\"}'

    public static readonly TestCaseJson_with_warning_and_error = '{ "resourceType": "Bundle", "id": "1366", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ {  ' +
        '"resource": {  "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1", "lastUpdated": "2021-10-13T03:34:10.160+00:00", ' +
        '"source": "#nEcAkGd8PRwPP5fA" }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep ' +
        '9th 2021 for Asthma<a name=\\"mm\\"/></div>" }, "status": "in-progress", "class": { "system": "http://terminologys.hl7.org/' +
        'CodeSystem/v3-ActCodes", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "text": "OutPatient" } ], "subject": ' +
        '{ "reference": "Patient/1" }, "participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe" ' +
        '} } ], "period": { "start": "2022-05-13T03:34:10.054Z" } } }, { "fullUrl": "http://local/Patient", "resource": { "id": "2", ' +
        '"resourceType": "Patient", "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health' +
        '</div>" }, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" }, "identifier": [ { ' +
        '"system": "http://clinfhir.com/fhir/NamingSystem/identifier", "value": "20181011LizzyHealth" } ], "name": [ { "use": "official", ' +
        '"text": "Lizzy Health", "family": "Health", "given": [ "Lizzy" ] } ], "gender": "female", "birthDate": "2000-10-11" } } ] }'

    public static readonly TestCaseJson_missingResourceIDs = '{ "resourceType": "Bundle", "id": "1366", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ {  ' +
        '"resource": {  "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1", "lastUpdated": "2021-10-13T03:34:10.160+00:00", ' +
        '"source": "#nEcAkGd8PRwPP5fA" }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep ' +
        '9th 2021 for Asthma<a name=\\"mm\\"/></div>" }, "status": "in-progress", "class": { "system": "http://terminology.hl7.org/' +
        'CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "text": "OutPatient" } ], "subject": ' +
        '{ "reference": "Patient/1" }, "participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe" ' +
        '} } ], "period": { "start": "2022-05-13T03:34:10.054Z" } } }, {  "resource": {  ' +
        '"resourceType": "Patient", "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health' +
        '</div>" }, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" }, "identifier": [ { ' +
        '"system": "http://clinfhir.com/fhir/NamingSystem/identifier", "value": "20181011LizzyHealth" } ], "name": [ { "use": "official", ' +
        '"text": "Lizzy Health", "family": "Health", "given": [ "Lizzy" ] } ], "gender": "female", "birthDate": "2000-10-11" } } ] }'

    public static readonly TestCaseJson_emptyResourceIDs = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1",' +
        ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter",' +
        ' "resource": {"id": "", "resourceType": "Encounter","meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00",' +
        ' "source":"#nEcAkGd8PRwPP5fA"}, "text": { "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
        ' "status": "finished","class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
        ' "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164",' +
        ' "display": "Dr John Doe"}} ],"period": { "start": "2021-01-01T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id": "","resourceType":' +
        ' "Patient","text": { "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
        ' [ { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official",' +
        ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly TestCaseJson_missingResourceIDsHasfullUrlExt = '{ "resourceType": "Bundle", "id": "1366", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ { "fullUrl": "http://local/Encounter", ' +
        '"resource": { "id": "", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter" ],"versionId": "1", "lastUpdated": "2021-10-13T03:34:10.160+00:00", ' +
        '"source": "#nEcAkGd8PRwPP5fA" }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep ' +
        '9th 2021 for Asthma<a name=\\"mm\\"/></div>" }, "status": "in-progress", "class": { "system": "http://terminology.hl7.org/' +
        'CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "text": "OutPatient" } ], "subject": ' +
        '{ "reference": "Patient/1" }, "participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe" ' +
        '} } ], "period": { "start": "2022-05-13T03:34:10.054Z" } } }, { "fullUrl": "http://local/Patient", "resource": { "id": "2", ' +
        '"resourceType": "Patient", "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health' +
        '</div>" }, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" }, "identifier": [ { ' +
        '"system": "http://clinfhir.com/fhir/NamingSystem/identifier", "value": "20181011LizzyHealth" } ], "name": [ { "use": "official", ' +
        '"text": "Lizzy Health", "family": "Health", "given": [ "Lizzy" ] } ], "gender": "female", "birthDate": "2000-10-11" } } ] }'

    public static readonly TestCaseJson_missingMetaProfile = '{ "resourceType": "Bundle","id": "IP-Pass-CVPatient","meta": { "versionId": "1",' +
        '"lastUpdated": "2022-09-14T15:14:42.152+00:00"  },"type": "collection","entry": [ { "fullUrl": "609bde3598086b0a16d79fc6","resource": { "resourceType": "Patient",' +
        '"meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] },"id": "609bde3598086b0a16d79fc6","text": { "status":' +
        '"generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table ' +
        'class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"' +
        '},"extension" : [{ "extension" : [{ "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2106-3",' +
        '"display" : "White" } },{ "url" : "ombCategory","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "1002-5","display" : "American Indian or Alaska Native"' +
        '}}, { "url" : "ombCategory","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2028-9","display" : "Asian"}' +
        ' },{ "url" : "detailed","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "1586-7","display" : "Shoshone"}},' +
        '{ "url" : "detailed","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2036-2","display" : "Filipino"} },' +
        '{ "url" : "text","valueString" : "Mixed"  }],"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"}, { "extension" : ' +
        '[ { "url" : "ombCategory","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2135-2","display" : "Hispanic or Latino"' +
        '} },{ "url" : "detailed","valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2184-0","display" : "Dominican"}}, { "url" : "detailed",' +
        '"valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2148-5","display" : "Mexican"} }, { "url" : "text","valueString" :' +
        ' "Hispanic or Latino"} ],"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"}, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",' +
        '"valueCode" : "F" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity","valueCodeableConcept" : { "coding" : ' +
        '[{ "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor","code" : "ASKU","display" : "asked but unknown"} ],' +
        '"text" : "asked but unknown" } } ],"identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203",' +
        '"code": "MR"} ] },"system": "http://MyGoodHealthare.com/MedicalRecord","value": "8065dc8d26797064d8766be71f2bf020"} ],"active": true,' +
        '"name": [ { "use": "usual","family": "IPPass","given": [ "IPPass" ] } ],"gender": "male","birthDate": "1954-02-10" } }, {' +
        '"fullUrl": "5c6c61ceb84846536a9a98f9","resource": { "resourceType": "Encounter","id": "5c6c61ceb84846536a9a98f9","status": "finished",' +
        '"class" : { "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode","code" : "IMP","display" : "inpatient encounter"},' +
        '"type": [ { "coding": [ {"system": "http://snomed.info/sct","code": "183452005" } ] } ],"subject": { "reference": "Patient/609bde3598086b0a16d79fc6"  },' +
        '"period": { "start": "2012-01-16T08:00:00+00:00","end": "2012-02-15T09:00:00+00:00" }} }]}'

    public static readonly TCJsonRaceOMBRaceDetailed = '{\n' +
        '    "resourceType" : "Bundle",\n' +
        '    "id" : "IP-Pass-CVPatient",\n' +
        '    "meta" : {\n' +
        '      "versionId" : "1",\n' +
        '      "lastUpdated" : "2022-09-14T15:14:42.152+00:00"\n' +
        '    },\n' +
        '    "type" : "collection",\n' +
        '    "entry" : [ {\n' +
        '      "fullUrl" : "nullPatient/18bcc6f0-e702-409f-9fad-1b428d30c56c",\n' +
        '      "resource" : {\n' +
        '        "resourceType" : "Patient",\n' +
        '        "id" : "18bcc6f0-e702-409f-9fad-1b428d30c56c",\n' +
        '        "meta" : {\n' +
        '          "profile" : [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ]\n' +
        '        },\n' +
        '        "text" : {\n' +
        '          "status" : "generated",\n' +
        '          "div" : "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '        },\n' +
        '        "extension" : [ {\n' +
        '          "extension" : [ {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2106-3",\n' +
        '              "display" : "White"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "1002-5",\n' +
        '              "display" : "American Indian or Alaska Native"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2028-9",\n' +
        '              "display" : "Asian"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "1586-7",\n' +
        '             "display" : "Shoshone"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2036-2",\n' +
        '              "display" : "Filipino"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "text",\n' +
        '            "valueString" : "Mixed"\n' +
        '          } ],\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '        }, {\n' +
        '          "extension" : [ {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2135-2",\n' +
        '              "display" : "Hispanic or Latino"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2184-0",\n' +
        '              "display" : "Dominican"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2148-5",\n' +
        '              "display" : "Mexican"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "text",\n' +
        '            "valueString" : "Hispanic or Latino"\n' +
        '          } ],\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '        }, {\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '          "valueCode" : "F"\n' +
        '        }, {\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '          "valueCodeableConcept" : {\n' +
        '            "coding" : [ {\n' +
        '              "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '              "code" : "ASKU",\n' +
        '              "display" : "asked but unknown"\n' +
        '            } ],\n' +
        '            "text" : "asked but unknown"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "identifier" : [ {\n' +
        '          "type" : {\n' +
        '            "coding" : [ {\n' +
        '              "system" : "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
        '              "code" : "MR"\n' +
        '            } ]\n' +
        '          },\n' +
        '          "system" : "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '          "value" : "8065dc8d26797064d8766be71f2bf020"\n' +
        '        } ],\n' +
        '        "active" : true,\n' +
        '        "name" : [ {\n' +
        '          "use" : "usual",\n' +
        '          "family" : "IPPass",\n' +
        '          "given" : [ "IPPass" ]\n' +
        '        } ],\n' +
        '        "gender" : "male",\n' +
        '        "birthDate" : "1954-02-10"\n' +
        '      }\n' +
        '    }, {\n' +
        '      "fullUrl" : "nullEncounter/5c6c61ceb84846536a9a98f9",\n' +
        '      "resource" : {\n' +
        '        "resourceType" : "Encounter",\n' +
        '        "id" : "5c6c61ceb84846536a9a98f9",\n' +
        '        "status" : "finished",\n' +
        '        "class" : {\n' +
        '          "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code" : "IMP",\n' +
        '          "display" : "inpatient encounter"\n' +
        '        },\n' +
        '        "type" : [ {\n' +
        '          "coding" : [ {\n' +
        '            "system" : "http://snomed.info/sct",\n' +
        '            "code" : "183452005"\n' +
        '          } ]\n' +
        '       } ],\n' +
        '        "subject" : {\n' +
        '          "reference" : "Patient/18bcc6f0-e702-409f-9fad-1b428d30c56c"\n' +
        '        },\n' +
        '        "period" : {\n' +
        '          "start" : "2012-01-16T08:00:00+00:00",\n' +
        '          "end" : "2012-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    } ]\n' +
        '  }\n'

    public static readonly TCJsonRaceOMBRaceDetailed_Update = '{\n' +
        '    "resourceType" : "Bundle",\n' +
        '    "id" : "IP-Pass-CVPatient",\n' +
        '    "meta" : {\n' +
        '      "versionId" : "1",\n' +
        '      "lastUpdated" : "2022-09-14T15:14:42.152+00:00"\n' +
        '    },\n' +
        '    "type" : "collection",\n' +
        '    "entry" : [ {\n' +
        '      "fullUrl" : "nullPatient/18bcc6f0-e702-409f-9fad-1b428d30c56c",\n' +
        '      "resource" : {\n' +
        '        "resourceType" : "Patient",\n' +
        '        "id" : "18bcc6f0-e702-409f-9fad-1b428d30c56c",\n' +
        '        "meta" : {\n' +
        '          "profile" : [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ]\n' +
        '        },\n' +
        '        "text" : {\n' +
        '          "status" : "generated",\n' +
        '          "div" : "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '        },\n' +
        '        "extension" : [ {\n' +
        '          "extension" : [ {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2131-1",\n' +
        '              "display" : "Other Race"\n' +
        '            }\n' +
        '          },{\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2106-3",\n' +
        '              "display" : "White"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "1002-5",\n' +
        '              "display" : "American Indian or Alaska Native"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2028-9",\n' +
        '              "display" : "Asian"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "1586-7",\n' +
        '             "display" : "Shoshone"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2036-2",\n' +
        '              "display" : "Filipino"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "text",\n' +
        '            "valueString" : "Mixed"\n' +
        '          } ],\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '        }, {\n' +
        '          "extension" : [ {\n' +
        '            "url" : "ombCategory",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2135-2",\n' +
        '              "display" : "Hispanic or Latino"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2184-0",\n' +
        '              "display" : "Dominican"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "detailed",\n' +
        '            "valueCoding" : {\n' +
        '              "system" : "urn:oid:2.16.840.1.113883.6.238",\n' +
        '              "code" : "2148-5",\n' +
        '              "display" : "Mexican"\n' +
        '            }\n' +
        '          }, {\n' +
        '            "url" : "text",\n' +
        '            "valueString" : "Hispanic or Latino"\n' +
        '          } ],\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '        }, {\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '          "valueCode" : "F"\n' +
        '        }, {\n' +
        '          "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '          "valueCodeableConcept" : {\n' +
        '            "coding" : [ {\n' +
        '              "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '              "code" : "ASKU",\n' +
        '              "display" : "asked but unknown"\n' +
        '            } ],\n' +
        '            "text" : "asked but unknown"\n' +
        '          }\n' +
        '        } ],\n' +
        '        "identifier" : [ {\n' +
        '          "type" : {\n' +
        '            "coding" : [ {\n' +
        '              "system" : "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
        '              "code" : "MR"\n' +
        '            } ]\n' +
        '          },\n' +
        '          "system" : "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '          "value" : "8065dc8d26797064d8766be71f2bf020"\n' +
        '        } ],\n' +
        '        "active" : true,\n' +
        '        "name" : [ {\n' +
        '          "use" : "usual",\n' +
        '          "family" : "IPPass",\n' +
        '          "given" : [ "IPPass" ]\n' +
        '        } ],\n' +
        '        "gender" : "unknown",\n' +
        '        "birthDate" : "1981-05-27"\n' +
        '      }\n' +
        '    }, {\n' +
        '      "fullUrl" : "nullEncounter/5c6c61ceb84846536a9a98f9",\n' +
        '      "resource" : {\n' +
        '        "resourceType" : "Encounter",\n' +
        '        "id" : "5c6c61ceb84846536a9a98f9",\n' +
        '        "status" : "finished",\n' +
        '        "class" : {\n' +
        '          "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code" : "IMP",\n' +
        '          "display" : "inpatient encounter"\n' +
        '        },\n' +
        '        "type" : [ {\n' +
        '          "coding" : [ {\n' +
        '            "system" : "http://snomed.info/sct",\n' +
        '            "code" : "183452005"\n' +
        '          } ]\n' +
        '       } ],\n' +
        '        "subject" : {\n' +
        '          "reference" : "Patient/18bcc6f0-e702-409f-9fad-1b428d30c56c"\n' +
        '        },\n' +
        '        "period" : {\n' +
        '          "start" : "2012-01-16T08:00:00+00:00",\n' +
        '          "end" : "2012-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    } ]\n' +
        '  }\n'

    public static readonly TestCaseJson_Valid_w_All_Encounter = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "1366",\n' +
        '  "meta": {\n' +
        '    "versionId": "1",\n' +
        '    "lastUpdated": "2022-03-30T19:02:32.620+00:00"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "http://local/Encounter/Encounter-1",\n' +
        '      "resource": {\n' +
        '        "id": "Encounter-1",\n' +
        '        "resourceType": "Encounter",\n' +
        '        "meta": {\n' +
        '          "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",\n' +
        '          "versionId": "1",\n' +
        '          "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n' +
        '          "source": "#nEcAkGd8PRwPP5fA"\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "IMP",\n' +
        '          "display": "inpatient encounter"\n' +
        '        },\n' +
        '        "type": [\n' +
        '          {\n' +
        '            "text": "OutPatient"\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/1"\n' +
        '        },\n' +
        '        "participant": [\n' +
        '          {\n' +
        '            "individual": {\n' +
        '              "reference": "Practitioner/30164",\n' +
        '              "display": "Dr John Doe"\n' +
        '            }\n' +
        '          }\n' +
        '        ],\n' +
        '        "period": {\n' +
        '          "start": "2021-01-01T03:34:10.054Z"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "http://local/Encounter/Encounter-2",\n' +
        '      "resource": {\n' +
        '        "id": "Encounter-2",\n' +
        '        "resourceType": "Encounter",\n' +
        '        "meta": {\n' +
        '          "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",\n' +
        '          "versionId": "1",\n' +
        '          "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n' +
        '          "source": "#nEcAkGd8PRwPP5fA"\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n' +
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
        '                "version": "2022-09",\n' +
        '                "code": "185463005",\n' +
        '                "display": "Visit out of hours (procedure)"\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/numer-pos-EXM135v11QICore4"\n' +
        '        },\n' +
        '        "participant": [\n' +
        '          {\n' +
        '            "individual": {\n' +
        '              "reference": "Practitioner/30164",\n' +
        '              "display": "Dr John Doe"\n' +
        '            }\n' +
        '          }\n' +
        '        ],\n' +
        '        "period": {\n' +
        '          "start": "2021-11-11T03:34:10.054Z",\n' +
        '          "end": "2022-01-01T03:34:10.054Z"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "http://local/Patient",\n' +
        '      "resource": {\n' +
        '        "id": "3",\n' +
        '        "resourceType": "Patient",\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n' +
        '        },\n' +
        '        "meta": {\n' +
        '          "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '        },\n' +
        '        "identifier": [\n' +
        '          {\n' +
        '            "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n' +
        '            "value": "20181011LizzyHealth"\n' +
        '          }\n' +
        '        ],\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "official",\n' +
        '            "text": "Lizzy Health",\n' +
        '            "family": "Health",\n' +
        '            "given": [\n' +
        '              "Lizzy"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "female",\n' +
        '        "birthDate": "2000-10-11"\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly TestCaseJson_Invalid = '{ "resourceType": "Account", "id": "1366", "meta": {   "versionId": "1",' +
        ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter",' +
        ' "resource": { "id":"1", "resourceType": "Encounter","meta": { "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
        ' "text": { "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
        ' "status": "finished","class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
        ' "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164",' +
        ' "display": "Dr John Doe"}} ],"period": { "start": "2022-01-10T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2", "resourceType":' +
        ' "Patient","text": { "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"},"identifier":' +
        ' [ { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official",' +
        ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'


    public static readonly TestCaseJson_CohortPatientBoolean_PASS = '{ "resourceType": "Bundle", "id": "ip-pass-InpatientEncounter", ' +
        '"meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ { "fullUrl": ' +
        '"http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a16d79fc6", "resourceType": ' +
        '"Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }, "identifier": [ { ' +
        '"type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http://myGo' +
        'odHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name": [ { "use": "usual", "family":' +
        ' "IPPass", "given": [ "Inpatient Encounter" ] } ], "gender": "male", "birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHe' +
        'althcare.com/Encounter/5c6c61ceb84846536a9a98f9", "resource": { "id": "5c6c61ceb84846536a9a98f9", "resourceType": "Encounter",' +
        ' "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter" ] }, "status": "finished", "class"' +
        ': { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ ' +
        '{ "coding": [ { "system": "http://snomed.info/sct", "code": "183452005", "display": "Emergency hospital admission (procedure)" ' +
        '} ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "priority": { "coding": [ { "system": "http://snomed.i' +
        'nfo/sct", "code": "103391001", "display": "Urgency" } ] }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-16T' +
        '09:00:00+00:00" }, "length": { "value": 1, "unit": "days" }, "location": [ { "location": { "reference": "Location/4989ju789fn93b' +
        'vy562loe87c", "display": "Holy Family Hospital Inpatient" }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-1' +
        '6T09:00:00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.com/Encounter/9dju7njdn764mdjy6dm92nje", "resource": { "id": "9dj' +
        'u7njdn764mdjy6dm92nje", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/q' +
        'icore-encounter" ] }, "status": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "EMR' +
        'GONLY", "display": "Emergency only" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "4525004", "display"' +
        ': "Emergency department patient visit (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "peri' +
        'od": { "start": "2012-07-14T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" }, "length": { "value": 1, "unit": "days" }, "loc' +
        'ation": [ { "location": { "reference": "Location/489juh6757h87j03jhy73mv7", "display": "Holy Family Hospital Inpatient" }, "perio' +
        'd": { "start": "2012-07-14T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.com/L' +
        'ocation/489juh6757h87j03jhy73mv7", "resource": { "id": "489juh6757h87j03jhy73mv7", "resourceType": "Location", "meta": { "profile' +
        '": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location" ] }, "identifier": [ { "use": "official", "system": "htt' +
        'p://holycrosshospital.com/location", "value": "489juh6757h87j03jhy73mv7" } ], "status": "active", "name": "South Wing, second flo' +
        'or" } }, { "fullUrl": "http://MyHealthcare.com/Location/4989ju789fn93bvy562loe87c", "resource": { "id": "4989ju789fn93bvy562loe87' +
        'c", "resourceType": "Location", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location" ] }, "' +
        'identifier": [ { "use": "official", "system": "http://holycrosshospital.com/location", "value": "4989ju789fn93bvy562loe87c" } ], ' +
        '"status": "active", "name": "North Wing, second floor" } } ] }'

    public static readonly TestCaseJson_CohortEpisodeWithStrat_PASS = '{ "resourceType": "Bundle", "id": "ip-pass-Encounter", ' +
        '"meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ { "ful' +
        'lUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a16d79fc6", "r' +
        'esourceType": "Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }' +
        ', "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ]' +
        ' }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name' +
        '": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounter" ] } ], "gender": "male", "birthDate": "1954-' +
        '02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb84846536a9a98f9", "resource": { "id": "5c6c61ceb848' +
        '46536a9a98f9", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qi' +
        'core-encounter" ] }, "status": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code' +
        '": "AMB", "display": "ambulatory" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "4449710001241' +
        '05", "display": "Annual wellness visit (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" ' +
        '}, "priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "103391001", "display": "Urgency" } ] }, "perio' +
        'd": { "start": "2022-07-15T08:00:00+00:00", "end": "2022-07-15T09:00:00+00:00" } } } ] }'

    public static readonly CohortEpisodeEncounter_PASS = '{ "resourceType": "Bundle", "id": "ip-pass-InpatientEncounter", ' +
        '"meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ { "' +
        'fullUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a16d79fc6' +
        '", "resourceType": "Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-pati' +
        'ent" ] }, "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "cod' +
        'e": "MR" } ] }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f2bf020" } ], "acti' +
        've": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounter" ] } ], "gender": "male",' +
        ' "birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb84846536a9a98f9", "resource' +
        '": { "id": "5c6c61ceb84846536a9a98f9", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qic' +
        'ore-encounter" ] }, "resourceType": "Encounter", "status": "finished", "class": { "system": "http://terminology.hl7.o' +
        'rg/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "coding": [ { "system": "ht' +
        'tp://snomed.info/sct", "code": "183452005", "display": "Emergency hospital admission (procedure)" } ] } ], "subject":' +
        ' { "reference": "Patient/609bde3598086b0a16d79fc6" }, "priority": { "coding": [ { "system": "http://snomed.info/sct",' +
        ' "code": "103391001", "display": "Urgency" } ] }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-1' +
        '6T09:00:00+00:00" }, "length": { "value": 1, "unit": "days" }, "location": [ { "location": { "reference": "Location/4' +
        '989ju789fn93bvy562loe87c", "display": "Holy Family Hospital Inpatient" }, "period": { "start": "2012-07-15T08:00:00+00' +
        ':00", "end": "2012-07-16T09:00:00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.com/Encounter/9dju7njdn764mdjy6d' +
        'm92nje", "resource": { "id": "9dju7njdn764mdjy6dm92nje", "resourceType": "Encounter", "meta": { "profile": [ "http://h' +
        'l7.org/fhir/us/qicore/StructureDefinition/qicore-encounter" ] }, "status": "finished", "class": { "system": "http://te' +
        'rminology.hl7.org/CodeSystem/v3-ActCode", "code": "EMRGONLY", "display": "Emergency only" }, "type": [ { "coding": [ {' +
        ' "system": "http://snomed.info/sct", "code": "4525004", "display": "Emergency department patient visit (procedure)" } ' +
        '] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "2012-07-14T23:00:00+00:00",' +
        ' "end": "2012-07-15T07:30:00+00:00" }, "length": { "value": 1, "unit": "days" }, "location": [ { "location": { "referenc' +
        'e": "Location/489juh6757h87j03jhy73mv7", "display": "Holy Family Hospital Inpatient" }, "period": { "start": "2012-07-1' +
        '4T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.com/Location/489juh6' +
        '757h87j03jhy73mv7", "resource": { "id": "489juh6757h87j03jhy73mv7", "resourceType": "Location", "meta": { "profile": [ ' +
        '"http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location" ] }, "identifier": [ { "use": "official", "system":' +
        ' "http://holycrosshospital.com/location", "value": "489juh6757h87j03jhy73mv7" } ], "status": "active", "name": "South W' +
        'ing, second floor" } }, { "fullUrl": "http://MyHealthcare.com/Location/4989ju789fn93bvy562loe87c", "resource": { "id": ' +
        '"4989ju789fn93bvy562loe87c", "resourceType": "Location", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/Structur' +
        'eDefinition/qicore-location" ] }, "identifier": [ { "use": "official", "system": "http://holycrosshospital.com/location' +
        '", "value": "4989ju789fn93bvy562loe87c" } ], "status": "active", "name": "North Wing, second floor" } } ] }'

    public static readonly RatioPatientSingleIPNoMO_IPP_PASS = '{ "resourceType": "Bundle", "id": "Denom-Pass-RatioPatientSingl' +
        'eIPNoMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collection", "entry"' +
        ': [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient", "id": "609bde3598086b0a16d79fc6",' +
        ' "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }, "extension": [ { "exten' +
        'sion": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2106-3", "displa' +
        'y": "White" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "1002-5",' +
        ' "display": "American Indian or Alaska Native" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840' +
        '.1.113883.6.238", "code": "2028-9", "display": "Asian" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.' +
        '840.1.113883.6.238", "code": "1586-7", "display": "Shoshone" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid' +
        ':2.16.840.1.113883.6.238", "code": "2036-2", "display": "Filipino" } }, { "url": "text", "valueString": "Mixed" } ], "url":' +
        ' "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race" }, { "extension": [ { "url": "ombCategory", "valueCoding": ' +
        '{ "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2135-2", "display": "Hispanic or Latino" } }, { "url": "detailed", ' +
        '"valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2184-0", "display": "Dominican" } }, { "url": "detail' +
        'ed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2148-5", "display": "Mexican" } }, { "url": "te' +
        'xt", "valueString": "Hispanic or Latino" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity" },' +
        ' { "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "valueCode": "F" }, { "url": "http://hl7.org/f' +
        'hir/us/core/StructureDefinition/us-core-genderIdentity", "valueCodeableConcept": { "coding": [ { "system": "http://terminolog' +
        'y.hl7.org/CodeSystem/v3-NullFlavor", "code": "ASKU", "display": "asked but unknown" } ], "text": "asked but unknown" } } ], "' +
        'identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "syst' +
        'em": "http://MyGoodHealthare.com/MedicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name": [ {' +
        ' "use": "usual", "family": "IPPass", "given": [ "IPPass" ] } ], "gender": "male", "birthDate": "1954-02-10" } }, { "fullUrl"' +
        ': "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c6c61ceb84846536a9a98f9", "meta": { "profile' +
        '": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter" ] }, "status": "finished", "class": { "system": "http' +
        '://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "coding": [ { "syst' +
        'em": "http://snomed.info/sct", "code": "183452005" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "per' +
        'iod": { "start": "2012-01-16T08:00:00+00:00", "end": "2012-02-15T09:00:00+00:00" } } } ] }'

    public static readonly RatioPatientSingleIPNoMO_DRC_PASS = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "Numex-Pass-RatioPatientMultiIPWithMO",\n' +
        '  "meta": {\n' +
        '    "versionId": "1",\n' +
        '    "lastUpdated": "2022-09-14T15:14:42.152+00:00"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "609bde3598086b0a16d79fc6",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Patient",\n' +
        '        "id": "609bde3598086b0a16d79fc6",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '        },\n' +
        '        "extension": [\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2106-3",\n' +
        '                  "display": "White"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1002-5",\n' +
        '                  "display": "American Indian or Alaska Native"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2028-9",\n' +
        '                  "display": "Asian"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1586-7",\n' +
        '                  "display": "Shoshone"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2036-2",\n' +
        '                  "display": "Filipino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Mixed"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '          },\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2135-2",\n' +
        '                  "display": "Hispanic or Latino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2184-0",\n' +
        '                  "display": "Dominican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2148-5",\n' +
        '                  "display": "Mexican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Hispanic or Latino"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '            "valueCode": "F"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '            "valueCodeableConcept": {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '                  "code": "ASKU",\n' +
        '                  "display": "asked but unknown"\n' +
        '                }\n' +
        '              ],\n' +
        '              "text": "asked but unknown"\n' +
        '            }\n' +
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
        '            "system": "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '            "value": "8065dc8d26797064d8766be71f2bf020"\n' +
        '          }\n' +
        '        ],\n' +
        '        "active": true,\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "usual",\n' +
        '            "family": "Denex",\n' +
        '            "given": [\n' +
        '              "DenexPass"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "male",\n' +
        '        "birthDate": "1954-02-10"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "5c6c61ceb84846536a9a98f9",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "5c6c61ceb84846536a9a98f9",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "EMER",\n' +
        '          "display": "emergency"\n' +
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
        '        "priority": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://snomed.info/sct",\n' +
        '              "code": "103390000",\n' +
        '              "display": "Unscheduled (qualifier value)"\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/609bde3598086b0a16d79fc6"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-01-16T08:00:00+00:00",\n' +
        '          "end": "2022-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly RatioEpisodeSingleIPNoMO_IPP_PASS = '{ "resourceType": "Bundle", "id": "Denom-Pass-RatioEpisode' +
        'MultiIPWithMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collection' +
        '", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient", "id": "609bde35980' +
        '86b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }, "e' +
        'xtension": [ { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238",' +
        ' "code": "2106-3", "display": "White" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.1' +
        '13883.6.238", "code": "1002-5", "display": "American Indian or Alaska Native" } }, { "url": "ombCategory", "valueC' +
        'oding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2028-9", "display": "Asian" } }, { "url": "detailed' +
        '", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "1586-7", "display": "Shoshone" } }, { "ur' +
        'l": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2036-2", "display": "Filipin' +
        'o" } }, { "url": "text", "valueString": "Mixed" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-cor' +
        'e-race" }, { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "' +
        'code": "2135-2", "display": "Hispanic or Latino" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16' +
        '.840.1.113883.6.238", "code": "2184-0", "display": "Dominican" } }, { "url": "detailed", "valueCoding": { "system": ' +
        '"urn:oid:2.16.840.1.113883.6.238", "code": "2148-5", "display": "Mexican" } }, { "url": "text", "valueString": "Hisp' +
        'anic or Latino" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity" }, { "url": "http://' +
        'hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "valueCode": "F" }, { "url": "http://hl7.org/fhir/us/cor' +
        'e/StructureDefinition/us-core-genderIdentity", "valueCodeableConcept": { "coding": [ { "system": "http://terminology' +
        '.hl7.org/CodeSystem/v3-NullFlavor", "code": "ASKU", "display": "asked but unknown" } ], "text": "asked but unknown" ' +
        '} } ], "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": ' +
        '"MR" } ] }, "system": "http://MyGoodHealthare.com/MedicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "' +
        'active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "IPPass" ] } ], "gender": "male", "birthDa' +
        'te": "1954-02-10" } }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c' +
        '6c61ceb84846536a9a98f9", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"' +
        ' ] }, "status": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", ' +
        '"display": "inpatient encounter" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "183452005' +
        '" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "2012-01-16T08:00:00' +
        '+00:00", "end": "2012-02-15T09:00:00+00:00" } } } ] }'

    public static readonly RatioEpisodeSingleIPNoMO_MultipleEpisodes_PASS = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "2Enc-1Numex-RatioEpisodeMultiIPWithMO",\n' +
        '  "meta": {\n' +
        '    "versionId": "1",\n' +
        '    "lastUpdated": "2022-09-14T15:14:42.152+00:00"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "609bde3598086b0a16d79fc6",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Patient",\n' +
        '        "id": "609bde3598086b0a16d79fc6",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '        },\n' +
        '        "extension": [\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2106-3",\n' +
        '                  "display": "White"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1002-5",\n' +
        '                  "display": "American Indian or Alaska Native"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2028-9",\n' +
        '                  "display": "Asian"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1586-7",\n' +
        '                  "display": "Shoshone"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2036-2",\n' +
        '                  "display": "Filipino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Mixed"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '          },\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2135-2",\n' +
        '                  "display": "Hispanic or Latino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2184-0",\n' +
        '                  "display": "Dominican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2148-5",\n' +
        '                  "display": "Mexican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Hispanic or Latino"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '            "valueCode": "F"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '            "valueCodeableConcept": {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '                  "code": "ASKU",\n' +
        '                  "display": "asked but unknown"\n' +
        '                }\n' +
        '              ],\n' +
        '              "text": "asked but unknown"\n' +
        '            }\n' +
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
        '            "system": "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '            "value": "8065dc8d26797064d8766be71f2bf020"\n' +
        '          }\n' +
        '        ],\n' +
        '        "active": true,\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "usual",\n' +
        '            "family": "Denex",\n' +
        '            "given": [\n' +
        '              "DenexPass"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "male",\n' +
        '        "birthDate": "1954-02-10"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "5c6c61ceb84846536a9a98f9",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "5c6c61ceb84846536a9a98f9",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "EMER",\n' +
        '          "display": "emergency"\n' +
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
        '        "priority": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://snomed.info/sct",\n' +
        '              "code": "103390000",\n' +
        '              "display": "Unscheduled (qualifier value)"\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/609bde3598086b0a16d79fc6"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-01-16T08:00:00+00:00",\n' +
        '          "end": "2022-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "5c6c61ccb4846536a9a98f9",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "5c6c61ccb4846536a9a98f9",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "IMP",\n' +
        '          "display": "inpatient"\n' +
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
        '        "priority": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://snomed.info/sct",\n' +
        '              "code": "103390000",\n' +
        '              "display": "Unscheduled (qualifier value)"\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/609bde3598086b0a16d79fc6"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-01-16T08:00:00+00:00",\n' +
        '          "end": "2022-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'


    public static readonly RatioPatientTwoIPsWithMOs_PASS = '{\n' +
        '\t"resourceType": "Bundle",\n' +
        '\t"id": "ip1-pass",\n' +
        '\t"type": "collection",\n' +
        '\t"entry": [\n' +
        '\t\t{\n' +
        '\t\t\t"fullUrl": "b1ba7de7-9fa0-44fa-ac1e-a4b407d3a54b",\n' +
        '\t\t\t"resource": {\n' +
        '\t\t\t\t"resourceType": "Encounter",\n' +
        '\t\t\t\t"id": "237ec3c0-b58e-4a23-82b0-98b4424d405c",\n' +
        '\t\t\t\t"meta": {\n' +
        '\t\t\t\t\t"profile": [\n' +
        '\t\t\t\t\t\t"http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '\t\t\t\t\t]\n' +
        '\t\t\t\t},\n' +
        '\t\t\t\t"status": "finished",\n' +
        '\t\t\t\t"class": {\n' +
        '\t\t\t\t\t"code": "AMB",\n' +
        '\t\t\t\t\t"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '\t\t\t\t\t"display": "ambulatory"\n' +
        '\t\t\t\t},\n' +
        '\t\t\t\t"type": [\n' +
        '\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t"coding": [\n' +
        '\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t"code": "99215",\n' +
        '\t\t\t\t\t\t\t\t"system": "http://www.ama-assn.org/go/cpt",\n' +
        '\t\t\t\t\t\t\t\t"display": "Office or other outpatient visit for the evaluation and management of an established patient, which requires a medically appropriate history and/or examination and high level of medical decision making. When using time for code selection, 40-54 minutes of total time is spent on the date of the encounter"\n' +
        '\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t]\n' +
        '\t\t\t\t\t}\n' +
        '\t\t\t\t],\n' +
        '\t\t\t\t"subject": {\n' +
        '\t\t\t\t\t"reference": "Patient/8d8dc304-a56a-4464-8e1e-703e866e989e"\n' +
        '\t\t\t\t},\n' +
        '\t\t\t\t"period": {\n' +
        '\t\t\t\t\t"start": "2023-01-02T10:00:00.000Z",\n' +
        '\t\t\t\t\t"end": "2023-01-02T10:30:00.000Z"\n' +
        '\t\t\t\t}\n' +
        '\t\t\t}\n' +
        '\t\t},\n' +
        '\t\t{\n' +
        '\t\t\t"fullUrl": "a5ba7de7-9fa0-20fa-ac1e-a4b405d3a32b",\n' +
        '\t\t\t"resource": {\n' +
        '\t\t\t\t"resourceType": "Patient",\n' +
        '\t\t\t\t"id": "8d8dc304-a56a-4464-8e1e-703e866e989e",\n' +
        '\t\t\t\t"meta": {\n' +
        '\t\t\t\t\t"profile": [\n' +
        '\t\t\t\t\t\t"http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '\t\t\t\t\t]\n' +
        '\t\t\t\t},\n' +
        '\t\t\t\t"extension": [\n' +
        '\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",\n' +
        '\t\t\t\t\t\t"extension": [\n' +
        '\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t"url": "ombCategory",\n' +
        '\t\t\t\t\t\t\t\t"valueCoding": {\n' +
        '\t\t\t\t\t\t\t\t\t"code": "2028-9",\n' +
        '\t\t\t\t\t\t\t\t\t"system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '\t\t\t\t\t\t\t\t\t"display": "Asian"\n' +
        '\t\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t\t},\n' +
        '\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t"url": "text",\n' +
        '\t\t\t\t\t\t\t\t"valueString": "Asian"\n' +
        '\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t]\n' +
        '\t\t\t\t\t},\n' +
        '\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",\n' +
        '\t\t\t\t\t\t"extension": [\n' +
        '\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t"url": "ombCategory",\n' +
        '\t\t\t\t\t\t\t\t"valueCoding": {\n' +
        '\t\t\t\t\t\t\t\t\t"code": "2135-2",\n' +
        '\t\t\t\t\t\t\t\t\t"system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '\t\t\t\t\t\t\t\t\t"display": "Hispanic or Latino"\n' +
        '\t\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t\t},\n' +
        '\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t"url": "text",\n' +
        '\t\t\t\t\t\t\t\t"valueString": "Hispanic or Latino"\n' +
        '\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t]\n' +
        '\t\t\t\t\t}\n' +
        '\t\t\t\t],\n' +
        '\t\t\t\t"identifier": [\n' +
        '\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t"use": "usual",\n' +
        '\t\t\t\t\t\t"type": {\n' +
        '\t\t\t\t\t\t\t"coding": [\n' +
        '\t\t\t\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t\t\t\t"code": "MR",\n' +
        '\t\t\t\t\t\t\t\t\t"system": "http://terminology.hl7.org/CodeSystem/v2-0203",\n' +
        '\t\t\t\t\t\t\t\t\t"display": "Medical Record Number"\n' +
        '\t\t\t\t\t\t\t\t}\n' +
        '\t\t\t\t\t\t\t]\n' +
        '\t\t\t\t\t\t},\n' +
        '\t\t\t\t\t\t"system": "http://hospital.smarthealthit.org",\n' +
        '\t\t\t\t\t\t"value": "685945948"\n' +
        '\t\t\t\t\t}\n' +
        '\t\t\t\t],\n' +
        '\t\t\t\t"name": [\n' +
        '\t\t\t\t\t{\n' +
        '\t\t\t\t\t\t"family": "Eternity",\n' +
        '\t\t\t\t\t\t"given": [\n' +
        '\t\t\t\t\t\t\t"Luv"\n' +
        '\t\t\t\t\t\t]\n' +
        '\t\t\t\t\t}\n' +
        '\t\t\t\t],\n' +
        '\t\t\t\t"gender": "female",\n' +
        '\t\t\t\t"birthDate": "1979-01-01"\n' +
        '\t\t\t}\n' +
        '\t\t}\n' +
        '\t]\n' +
        '}'

    public static readonly RatioEpisodeTwoIPsWithMOs_PASS = '{\n' +
        '  "id": "60ad199cacdbd5186fd799f3",\n' +
        '  "resourceType": "Bundle",\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Patient/60ad199cacdbd5186fd799f3",\n' +
        '      "resource": {\n' +
        '        "id": "60ad199cacdbd5186fd799f3",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "resourceType": "Patient",\n' +
        '        "extension": [\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2106-3",\n' +
        '                  "display": "White",\n' +
        '                  "userSelected": true\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "White"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '          },\n' +
        '          {\n' +
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
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
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
        '            "value": "60ad199cacdbd5186fd799f3"\n' +
        '          }\n' +
        '        ],\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "family": "Pass",\n' +
        '            "given": [\n' +
        '              "MO Multiple Episodes"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "male",\n' +
        '        "birthDate": "1946-01-15"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Encounter/inpatient-visit-99f4",\n' +
        '      "resource": {\n' +
        '        "id": "inpatient-visit-99f4",\n' +
        '        "resourceType": "Encounter",\n' +
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
        '                "version": "http://snomed.info/sct/731000124108/version/20220901",\n' +
        '                "code": "183452005",\n' +
        '                "display": "Emergency hospital admission (procedure)",\n' +
        '                "userSelected": true\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-03-05T08:00:00.000+00:00",\n' +
        '          "end": "2022-03-05T08:15:00.000+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Encounter/ed-visit-99f4",\n' +
        '      "resource": {\n' +
        '        "id": "ed-visit-99f4",\n' +
        '        "resourceType": "Encounter",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "EMER",\n' +
        '          "display": "emergency"\n' +
        '        },\n' +
        '        "type": [\n' +
        '          {\n' +
        '            "coding": [\n' +
        '              {\n' +
        '                "system": "http://snomed.info/sct",\n' +
        '                "version": "http://snomed.info/sct/731000124108/version/20220901",\n' +
        '                "code": "4525004",\n' +
        '                "display": "Emergency department patient visit (procedure)",\n' +
        '                "userSelected": true\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-05-05T08:00:00.000+00:00",\n' +
        '          "end": "2022-05-05T08:15:00.000+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Condition/bladder-cancer-for-urology-care-99f5",\n' +
        '      "resource": {\n' +
        '        "id": "bladder-cancer-for-urology-care-99f5",\n' +
        '        "resourceType": "Condition",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition"\n' +
        '          ]\n' +
        '        },\n' +
        '        "clinicalStatus": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",\n' +
        '              "code": "active",\n' +
        '              "display": "Active",\n' +
        '              "userSelected": true\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "category": [\n' +
        '          {\n' +
        '            "coding": [\n' +
        '              {\n' +
        '                "system": "http://terminology.hl7.org/CodeSystem/condition-category",\n' +
        '                "code": "problem-list-item",\n' +
        '                "display": "Problem List Item"\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "verificationStatus": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",\n' +
        '              "code": "confirmed",\n' +
        '              "display": "Confirmed",\n' +
        '              "userSelected": true\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "code": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://snomed.info/sct",\n' +
        '              "version": "http://snomed.info/sct/731000124108/version/20220901",\n' +
        '              "code": "190389009",\n' +
        '              "display": "Type II diabetes mellitus with ulcer (disorder)",\n' +
        '              "userSelected": true\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "https://www.myGoodHealthcare/Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "onsetPeriod": {\n' +
        '          "start": "2021-03-04T08:00:00.000+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Encounter/inpatient-visit-1231",\n' +
        '      "resource": {\n' +
        '        "id": "inpatient-visit-1231",\n' +
        '        "resourceType": "Encounter",\n' +
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
        '                "version": "http://snomed.info/sct/731000124108/version/20220901",\n' +
        '                "code": "183452005",\n' +
        '                "display": "Emergency hospital admission (procedure)",\n' +
        '                "userSelected": true\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-06-05T08:00:00.000+00:00",\n' +
        '          "end": "2022-06-05T08:15:00.000+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Encounter/ed-visit-584",\n' +
        '      "resource": {\n' +
        '        "id": "ed-visit-584",\n' +
        '        "resourceType": "Encounter",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "EMER",\n' +
        '          "display": "emergency"\n' +
        '        },\n' +
        '        "type": [\n' +
        '          {\n' +
        '            "coding": [\n' +
        '              {\n' +
        '                "system": "http://snomed.info/sct",\n' +
        '                "version": "http://snomed.info/sct/731000124108/version/20220901",\n' +
        '                "code": "4525004",\n' +
        '                "display": "Emergency department patient visit (procedure)",\n' +
        '                "userSelected": true\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2022-01-05T08:00:00.000+00:00",\n' +
        '          "end": "2022-01-05T08:15:00.000+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/MedicationRequest/Med-Order-ABC",\n' +
        '      "resource": {\n' +
        '        "resourceType": "MedicationRequest",\n' +
        '        "id": "Med-Order-ABC",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-medicationrequest"\n' +
        '          ]\n' +
        '        },\n' +
        '        "status": "active",\n' +
        '        "intent": "order",\n' +
        '        "medicationCodeableConcept": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://www.nlm.nih.gov/research/umls/rxnorm",\n' +
        '              "version": "11072022",\n' +
        '              "code": "1043563",\n' +
        '              "display": "24 HR metformin hydrochloride 1000 MG / saxagliptin 2.5 MG Extended Release Oral Tablet"\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "https://www.myGoodHealthcare/Patient/60ad199cacdbd5186fd799f3"\n' +
        '        },\n' +
        '        "requester": {\n' +
        '          "reference": "Practitioner/6546464"\n' +
        '        },\n' +
        '        "authoredOn": "2020-04-25T19:32:52-05:00"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://www.myGoodHealthcare/Practitioner/6546464",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Practitioner",\n' +
        '        "id": "6546464",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-practitioner"\n' +
        '          ]\n' +
        '        },\n' +
        '        "identifier": [\n' +
        '          {\n' +
        '            "use": "temp",\n' +
        '            "system": "urn:oid:2.16.840.1.113883.4.336",\n' +
        '            "value": "Practitioner-23"\n' +
        '          }\n' +
        '        ],\n' +
        '        "active": true,\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "family": "Careful",\n' +
        '            "given": [\n' +
        '              "Adam"\n' +
        '            ],\n' +
        '            "prefix": [\n' +
        '              "Dr"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "address": [\n' +
        '          {\n' +
        '            "use": "home",\n' +
        '            "line": [\n' +
        '              "534 Erewhon St"\n' +
        '            ],\n' +
        '            "city": "PleasantVille",\n' +
        '            "state": "UT",\n' +
        '            "postalCode": "84414"\n' +
        '          }\n' +
        '        ],\n' +
        '        "qualification": [\n' +
        '          {\n' +
        '            "identifier": [\n' +
        '              {\n' +
        '                "system": "http://example.org/UniversityIdentifier",\n' +
        '                "value": "12345"\n' +
        '              }\n' +
        '            ],\n' +
        '            "code": {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/v2-0360|2.7",\n' +
        '                  "code": "BS",\n' +
        '                  "display": "Bachelor of Science"\n' +
        '                }\n' +
        '              ],\n' +
        '              "text": "Bachelor of Science"\n' +
        '            },\n' +
        '            "period": {\n' +
        '              "start": "1995"\n' +
        '            },\n' +
        '            "issuer": {\n' +
        '              "display": "Example University"\n' +
        '            }\n' +
        '          }\n' +
        '        ]\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly CVPatientWithMO_PASS = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "IP-Pass-CVPatient",\n' +
        '  "meta": {\n' +
        '    "versionId": "1",\n' +
        '    "lastUpdated": "2022-09-14T15:14:42.152+00:00"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "609bde3598086b0a16d79fc6",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Patient",\n' +
        '        "id": "609bde3598086b0a16d79fc6",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "extension": [\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2106-3",\n' +
        '                  "display": "White"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1002-5",\n' +
        '                  "display": "American Indian or Alaska Native"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2028-9",\n' +
        '                  "display": "Asian"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1586-7",\n' +
        '                  "display": "Shoshone"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2036-2",\n' +
        '                  "display": "Filipino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Mixed"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '          },\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2135-2",\n' +
        '                  "display": "Hispanic or Latino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2184-0",\n' +
        '                  "display": "Dominican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2148-5",\n' +
        '                  "display": "Mexican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Hispanic or Latino"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http:hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '            "valueCode": "F"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '            "valueCodeableConcept": {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '                  "code": "ASKU",\n' +
        '                  "display": "asked but unknown"\n' +
        '                }\n' +
        '              ],\n' +
        '              "text": "asked but unknown"\n' +
        '            }\n' +
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
        '            "system": "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '            "value": "8065dc8d26797064d8766be71f2bf020"\n' +
        '          }\n' +
        '        ],\n' +
        '        "active": true,\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "usual",\n' +
        '            "family": "IPPass",\n' +
        '            "given": [\n' +
        '              "IPPass"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "male",\n' +
        '        "birthDate": "1954-02-10"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "5c6c61ceb84846536a9a98f9",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "5c6c61ceb84846536a9a98f9",\n' +
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
        '          "reference": "Patient/609bde3598086b0a16d79fc6"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2012-01-16T08:00:00+00:00",\n' +
        '          "end": "2012-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly CVEpisodeWithMO_PASS = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "MsrPop-Pass-CVEpisode",\n' +
        '  "meta": {\n' +
        '    "versionId": "1",\n' +
        '    "lastUpdated": "2022-09-14T15:14:42.152+00:00"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "609bde3598086b0a16d79fc6",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Patient",\n' +
        '        "id": "609bde3598086b0a16d79fc6",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"\n' +
        '        },\n' +
        '        "extension": [\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2106-3",\n' +
        '                  "display": "White"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1002-5",\n' +
        '                  "display": "American Indian or Alaska Native"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2028-9",\n' +
        '                  "display": "Asian"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "1586-7",\n' +
        '                  "display": "Shoshone"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2036-2",\n' +
        '                  "display": "Filipino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Mixed"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"\n' +
        '          },\n' +
        '          {\n' +
        '            "extension": [\n' +
        '              {\n' +
        '                "url": "ombCategory",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2135-2",\n' +
        '                  "display": "Hispanic or Latino"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2184-0",\n' +
        '                  "display": "Dominican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "detailed",\n' +
        '                "valueCoding": {\n' +
        '                  "system": "urn:oid:2.16.840.1.113883.6.238",\n' +
        '                  "code": "2148-5",\n' +
        '                  "display": "Mexican"\n' +
        '                }\n' +
        '              },\n' +
        '              {\n' +
        '                "url": "text",\n' +
        '                "valueString": "Hispanic or Latino"\n' +
        '              }\n' +
        '            ],\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",\n' +
        '            "valueCode": "F"\n' +
        '          },\n' +
        '          {\n' +
        '            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",\n' +
        '            "valueCodeableConcept": {\n' +
        '              "coding": [\n' +
        '                {\n' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",\n' +
        '                  "code": "ASKU",\n' +
        '                  "display": "asked but unknown"\n' +
        '                }\n' +
        '              ],\n' +
        '              "text": "asked but unknown"\n' +
        '            }\n' +
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
        '            "system": "http://MyGoodHealthare.com/MedicalRecord",\n' +
        '            "value": "8065dc8d26797064d8766be71f2bf020"\n' +
        '          }\n' +
        '        ],\n' +
        '        "active": true,\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "usual",\n' +
        '            "family": "Numer",\n' +
        '            "given": [\n' +
        '              "NumerPass"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "male",\n' +
        '        "birthDate": "1954-02-10"\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "5c6c61ceb84846536a9a98f9",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "5c6c61ceb84846536a9a98f9",\n' +
        '                "meta": {\n' +
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
        '        "priority": {\n' +
        '          "coding": [\n' +
        '            {\n' +
        '              "system": "http://snomed.info/sct",\n' +
        '              "code": "103390000",\n' +
        '              "display": "Unscheduled (qualifier value)"\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/609bde3598086b0a16d79fc6"\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2023-01-16T08:00:00+00:00",\n' +
        '          "end": "2023-02-15T09:00:00+00:00"\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly CVEpisodeWithStratification_PASS = '{ "resourceType": "Bundle", "id": "ip-pass-Encounter", "meta": { "versionId": ' +
        '"3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ { "fullUrl": "http://MyHealthcare.com/Patient' +
        '/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a16d79fc6", "resourceType": "Patient", "meta": { "profile": [ "http://' +
        'hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }, "identifier": [ { "type": { "coding": [ { "system": "http://terminolog' +
        'y.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f2b' +
        'f020" } ], "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounter" ] } ], "gender": "male", "' +
        'birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb84846536a9a98f9", "resource": { "id": "5c6c61ce' +
        'b84846536a9a98f9", "resourceType": "Encounter", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encou' +
        'nter" ] }, "status": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "a' +
        'mbulatory" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "444971000124105", "display": "Annual wellness vis' +
        'it (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "priority": { "coding": [ { "system": "http://' +
        'snomed.info/sct", "code": "103391001", "display": "Urgency" } ] }, "period": { "start": "2022-07-15T08:00:00+00:00", "end": "2022-07-15' +
        'T09:00:00+00:00" } } } ] }'

    public static readonly CVPatientWithStratification_PASS = '{ "resourceType": "Bundle", "id": "IP-Pass-CVPatient", "meta": { "versionId": ' +
        '"1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collection", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "reso' +
        'urce": { "resourceType": "Patient", "id": "609bde3598086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureD' +
        'efinition/qicore-patient" ] }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hap' +
        'iHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Ident' +
        'ifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></' +
        'table></div>" }, "extension": [ { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "' +
        'code": "2106-3", "display": "White" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "' +
        '1002-5", "display": "American Indian or Alaska Native" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.11388' +
        '3.6.238", "code": "2028-9", "display": "Asian" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "' +
        'code": "1586-7", "display": "Shoshone" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "' +
        '2036-2", "display": "Filipino" } }, { "url": "text", "valueString": "Mixed" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition' +
        '/us-core-race" }, { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2135-2"' +
        ', "display": "Hispanic or Latino" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2184-0' +
        '", "display": "Dominican" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2148-5", "displ' +
        'ay": "Mexican" } }, { "url": "text", "valueString": "Hispanic or Latino" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-' +
        'core-ethnicity" }, { "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "valueCode": "F" }, { "url": "http://hl7.' +
        'org/fhir/us/core/StructureDefinition/us-core-genderIdentity", "valueCodeableConcept": { "coding": [ { "system": "http://terminology.hl7.or' +
        'g/CodeSystem/v3-NullFlavor", "code": "ASKU", "display": "asked but unknown" } ], "text": "asked but unknown" } } ], "identifier": [ { "typ' +
        'e": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http://MyGoodHealthare.com/M' +
        'edicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "' +
        'IPPass" ] } ], "gender": "male", "birthDate": "1954-02-10" } }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Enco' +
        'unter", "id": "5c6c61ceb84846536a9a98f9", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter" ] }, "s' +
        'tatus": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" ' +
        '}, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "183452005" } ] } ], "subject": { "reference": "Patient/609bde359808' +
        '6b0a16d79fc6" }, "period": { "start": "2012-01-16T08:00:00+00:00", "end": "2012-02-15T09:00:00+00:00" } } } ] }'

    public static readonly ProportionEpisode_PASS = '{ "resourceType": "Bundle", "id": "IPP-Pass-ProportionEpisode", "meta": { "versionId": "1", ' +
        '"lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collection", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": {' +
        ' "resourceType": "Patient", "id": "609bde3598086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/q' +
        'icore-patient" ] }, "extension": [ { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238",' +
        ' "code": "2106-3", "display": "White" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "' +
        '1002-5", "display": "American Indian or Alaska Native" } }, { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.' +
        '6.238", "code": "2028-9", "display": "Asian" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code' +
        '": "1586-7", "display": "Shoshone" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2036-2"' +
        ', "display": "Filipino" } }, { "url": "text", "valueString": "Mixed" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-r' +
        'ace" }, { "extension": [ { "url": "ombCategory", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2135-2", "display":' +
        ' "Hispanic or Latino" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2184-0", "display": "' +
        'Dominican" } }, { "url": "detailed", "valueCoding": { "system": "urn:oid:2.16.840.1.113883.6.238", "code": "2148-5", "display": "Mexican" }' +
        ' }, { "url": "text", "valueString": "Hispanic or Latino" } ], "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity" }, ' +
        '{ "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "valueCode": "F" }, { "url": "http://hl7.org/fhir/us/core/Struc' +
        'tureDefinition/us-core-genderIdentity", "valueCodeableConcept": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlav' +
        'or", "code": "ASKU", "display": "asked but unknown" } ], "text": "asked but unknown" } } ], "identifier": [ { "type": { "coding": [ { "system' +
        '": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http://MyGoodHealthare.com/MedicalRecord", "value": "8065d' +
        'c8d26797064d8766be71f2bf020" } ], "active": true, "name": [ { "use": "usual", "family": "IPP", "given": [ "IPPPass" ] } ], "gender": "male", ' +
        '"birthDate": "1954-02-10" } }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c6c61ceb84846536a9' +
        'a98f9", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter" ] }, "status": "finished", "class": { "sy' +
        'stem": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatient encounter" }, "type": [ { "coding": [ { "syst' +
        'em": "http://snomed.info/sct", "code": "183452005" } ] } ], "priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "10339000' +
        '0", "display": "Unscheduled (qualifier value)" } ] }, "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "2' +
        '022-01-16T08:00:00+00:00", "end": "2023-07-15T09:00:00+00:00" } } } ] }'

    public static readonly TestCaseJson_ShiftTCDates = '{\n' +
        '  "resourceType": "Bundle",\n' +
        '  "id": "1366",\n' +
        '  "meta": {\n' +
        '    "versionId": "1"\n' +
        '  },\n' +
        '  "type": "collection",\n' +
        '  "entry": [\n' +
        '    {\n' +
        '      "fullUrl": "https://madie.cms.gov/Encounter/Encounter-1",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "Encounter-1",\n' +
        '        "meta": {\n' +
        '          "versionId": "1",\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "period": {\n' +
        '          "start": "2024-01-01T03:34:10.054Z"\n' +
        '        },\n' +
        '        "status": "finished",\n' +
        '        "class": {\n' +
        '          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n' +
        '          "code": "IMP",\n' +
        '          "display": "inpatient encounter"\n' +
        '        },\n' +
        '        "type": [\n' +
        '          {\n' +
        '            "text": "OutPatient"\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/dc01381b-c407-4cf7-8e7e-4b789c268726"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://madie.cms.gov/Encounter/Encounter-2",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Encounter",\n' +
        '        "id": "Encounter-2",\n' +
        '        "meta": {\n' +
        '          "versionId": "1",\n' +
        '          "lastUpdated": "2027-10-13T03:34:10.160+00:00",\n' +
        '          "source": "#nEcAkGd8PRwPP5fA",\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"\n' +
        '          ]\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n' +
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
        '                "version": "2022-09",\n' +
        '                "code": "185463005",\n' +
        '                "display": "Visit out of hours (procedure)"\n' +
        '              }\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "subject": {\n' +
        '          "reference": "Patient/dc01381b-c407-4cf7-8e7e-4b789c268726"\n' +
        '        },\n' +
        '        "participant": [\n' +
        '          {\n' +
        '            "individual": {\n' +
        '              "reference": "Practitioner/30164",\n' +
        '              "display": "Dr John Doe"\n' +
        '            }\n' +
        '          }\n' +
        '        ],\n' +
        '        "period": {\n' +
        '          "start": "2027-11-11T03:34:10.054Z",\n' +
        '          "end": "2028-01-01T03:34:10.054Z"\n' +
        '        }\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "fullUrl": "https://madie.cms.gov/Patient/dc01381b-c407-4cf7-8e7e-4b789c268726",\n' +
        '      "resource": {\n' +
        '        "resourceType": "Patient",\n' +
        '        "id": "dc01381b-c407-4cf7-8e7e-4b789c268726",\n' +
        '        "meta": {\n' +
        '          "profile": [\n' +
        '            "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n' +
        '          ]\n' +
        '        },\n' +
        '        "text": {\n' +
        '          "status": "generated",\n' +
        '          "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n' +
        '        },\n' +
        '        "identifier": [\n' +
        '          {\n' +
        '            "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n' +
        '            "value": "20181011LizzyHealth"\n' +
        '          }\n' +
        '        ],\n' +
        '        "name": [\n' +
        '          {\n' +
        '            "use": "official",\n' +
        '            "text": "Lizzy Health",\n' +
        '            "family": "Health",\n' +
        '            "given": [\n' +
        '              "Lizzy"\n' +
        '            ]\n' +
        '          }\n' +
        '        ],\n' +
        '        "gender": "female",\n' +
        '        "birthDate": "2006-10-11"\n' +
        '      }\n' +
        '    }\n' +
        '  ]\n' +
        '}'

    public static readonly TestCase_XML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '\n' +
        '<Patient xmlns="http://hl7.org/fhir">\n' +
        '  <id value="pat3"/> \n' +
        '  <text> \n' +
        '    <status value="generated"/> \n' +
        '    <div xmlns="http://www.w3.org/1999/xhtml">\n' +
        '      \n' +
        '      <p> Patient Simon Notsowell @ Acme Healthcare, Inc. MR = 123457, DECEASED</p> \n' +
        '    \n' +
        '    </div> \n' +
        '  </text> \n' +
        '  <identifier> \n' +
        '    <use value="usual"/> \n' +
        '    <type> \n' +
        '      <coding> \n' +
        '        <system value="http://terminology.hl7.org/CodeSystem/v2-0203"/> \n' +
        '        <code value="MR"/> \n' +
        '      </coding> \n' +
        '    </type> \n' +
        '    <system value="urn:oid:0.1.2.3.4.5.6.7"/> \n' +
        '    <value value="123457"/> \n' +
        '  </identifier> \n' +
        '  <active value="true"/> \n' +
        '  <name> \n' +
        '    <use value="official"/> \n' +
        '    <family value="Notsowell"/> \n' +
        '    <given value="Simon"/> \n' +
        '  </name> \n' +
        '  <gender value="male"/> \n' +
        '  <birthDate value="1982-01-23"/> \n' +
        '  <deceasedDateTime value="2015-02-14T13:42:00+10:00"/> \n' +
        '  <managingOrganization> \n' +
        '    <reference value="Organization/1"/> \n' +
        '    <display value="ACME Healthcare, Inc"/> \n' +
        '  </managingOrganization> \n' +
        '</Patient> '

    public static API_TestCaseJson_Valid = '{\n \"resourceType\": \"Bundle\",\n \"id\": \"1366\",\n \"meta\": {\n   \"versionId\": \"1\",\n' +
        ' \"lastUpdated\": \"2022-03-30T19:02:32.620+00:00\"\n  },\n  \"type\": \"collection\",\n  \"entry\": [ {\n   \"fullUrl\": \"http://local/Encounter\",\n' +
        ' \"resource\": {\n \"id\":\"1\", \"resourceType\": \"Encounter\",\n \"meta\": {\n \"versionId\": \"1\",\n \"lastUpdated\": \"2021-10-13T03:34:10.160+00:00\",\n \"source\":\"#nEcAkGd8PRwPP5fA\"\n},\n' +
        ' \"text\": {\n \"status\": \"generated\",\n \"div\":\"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Sep 9th 2021 for Asthma<a name=\\\"mm\\\"/></div>\"\n},\n' +
        ' \"status\": \"finished\",\n \"class\": {\n \"system\": \"http://terminology.hl7.org/CodeSystem/v3-ActCode\",\n \"code\": \"IMP\",\n \"display\":\"inpatient encounter\"\n},\n' +
        ' \"type\": [ {\n \"text\": \"OutPatient\"\n} ],\n\"subject\": {\n \"reference\": \"Patient/1\"\n},\n \"participant\": [ {\n \"individual\": {\n \"reference\": \"Practitioner/30164\",\n' +
        ' \"display\": \"Dr John Doe\"\n}\n} ],\n \"period\": {\n \"start\": \"2021-01-01T03:34:10.054Z\"\n}\n}\n}, {\n \"fullUrl\": \"http://local/Patient\",\n \"resource\": {\n \"id\":\"2\", \"resourceType\":' +
        ' \"Patient\",\n \"text\": {\n \"status\": \"generated\",\n \"div\": \"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>\"\n},\n \"meta\": {\n \"profile\": \"http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient\"},\n \"identifier\":' +
        ' [ {\n \"system\": \"http://clinfhir.com/fhir/NamingSystem/identifier\",\n \"value\": \"20181011LizzyHealth\"\n} ],\n \"name\": [ {\n \"use\": \"official\",\n' +
        ' \"text\": \"Lizzy Health\",\n \"family\": \"Health\",\n \"given\": [ \"Lizzy\" ]\n} ],\n \"gender\": \"female\",\n \"birthDate\": \"2000-10-11\"\n}\n} ]\n}'

    public static readonly API_TestCaseJson_InValid = '{\n  \"resourceType\": \"Account\",\n  \"id\": \"508\",\n  \"meta\": {\n    \"versionId\": \"1\",\n    \"lastUpdated\": \"2022-03-01T17:36:04.110+00:00\",\n    \"profile\": [ \"http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient\" ]\n  },\n  \"text\": {\n    \"status\": \"extensions\",\n    \"div\": \"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\"><p><b>Generated Narrative</b></p></div>\"\n  },\n  \"identifier\": [ {\n    \"use\": \"usual\",\n    \"type\": {\n      \"coding\": [ {\n        \"system\": \"http://terminology.hl7.org/CodeSystem/v2-0203\",\n        \"code\": \"MR\",\n        \"display\": \"Medical Record Number\"\n      } ],\n      \"text\": \"Medical Record Number\"\n    },\n    \"system\": \"http://hospital.smarthealthit.org\",\n    \"value\": \"1032702\"\n  } ],\n  \"name\": [ {\n    \"given\": [ \"Tester\" ]\n  } ],\n  \"gender\": \"female\"\n}'

    public static readonly tcCardErrorJson = '{' +
        '    "id": "62bc69333e113102f8cedca6",' +
        '    "resourceType": "Bundle",' +
        '    "type": "collection",' +
        '    "entry": [' +
        '      {' +
        '        "fullUrl": "62bc69333e113102f8cedca6",' +
        '       "resource": {' +
        '          "id": "62bc69333e113102f8cedca6",' +
        '          "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"' +
        '            ]' +
        '          },' +
        '          "resourceType": "Patient",' +
        '          "extension": [' +
        '            {' +
        '              "extension": [' +
        '                {' +
        '                  "url": "ombCategory",' +
        '                  "valueCoding": {' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",' +
        '                    "code": "1002-5",' +
        '                    "display": "American Indian or Alaska Native",' +
        '                    "userSelected": "true"' +
        '                  }' +
        '                },' +
        '                {' +
        '                  "url": "text",' +
        '                  "valueString": "American Indian or Alaska Native"' +
        '                }' +
        '                ' +
        '              ],' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"' +
        '            },' +
        '            {' +
        '              "extension": [' +
        '                {' +
        '                  "url": "ombCategory",' +
        '                  "valueCoding": {' +
        '                    "system": "urn:oid:2.16.840.1.113883.6.238",' +
        '                    "code": "2135-2",' +
        '                    "display": "Hispanic or Latino",' +
        '                    "userSelected": "true"' +
        '                  }' +
        '                },' +
        '                {' +
        '                  "url": "text",' +
        '                  "valueString": "Hispanic or Latino"' +
        '                }' +
        '              ],' +
        '              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"' +
        '            }' +
        '          ],' +
        '          "identifier": [' +
        '            {' +
        '              "type": {' +
        '                "coding": [' +
        '                  {' +
        '                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",' +
        '                    "code": "MR"' +
        '                 }' +
        '                ]' +
        '              },' +
        '              "system": "https://bonnie-fhir.healthit.gov/",' +
        '              "value": "62bc69333e113102f8cedca6"' +
        '            }' +
        '          ],' +
        '          "name": [' +
        '            {' +
        '              "family": "NUMERPass",' +
        '              "given": [' +
        '                "BCGAt6MoEdge"' +
        '              ]' +
        '            }' +
        '          ],' +
        '          "gender": "female",' +
        '          "birthDate": "1945-02-01"' +
        '        }' +
        '     },' +
        '      {' +
        '        "fullUrl": "office-visit-dca7",' +
        '        "resource": {' +
        '          "id": "office-visit-dca7",' +
        '          "resourceType": "Encounter",' +
        '          "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"' +
        '            ]' +
        '          },' +
        '          "status": "finished",' +
        '          "class": {' +
        '            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",' +
        '            "code": "AMB",' +
        '            "display": "ambulatory"' +
        '          },' +
        '          "type": [' +
        '            {' +
        '              "coding": [' +
        '                {' +
        '                  "system": "http://snomed.info/sct",' +
        '                 "version": "2021-09",' +
        '                  "code": "185463005",' +
        '                  "display": "Visit out of hours (procedure)",' +
        '                  "userSelected": "true"' +
        '               }' +
        '              ]' +
        '            }' +
        '          ],' +
        '          "subject": {' +
        '            "reference": "Patient/62bc69333e113102f8cedca6"' +
        '          },' +
        '          "period": {' +
        '            "start": "2022-02-01T08:00:00.000+00:00",' +
        '            "end": "2022-02-01T09:15:00.000+00:00"' +
        '          }' +
        '        }' +
        '      },' +
        '      {' +
        '        "fullUrl": "prostate-cancer-dca8",' +
        '        "resource": {' +
        '          "id": "prostate-cancer-dca8",' +
        '          "resourceType": "Condition",' +
        '          "meta": {' +
        '            "profile": [' +
        '             "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition"' +
        '           ]' +
        '         },' +
        '         "clinicalStatus": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",' +
        '                "code": "active",' +
        '                "display": "Active",' +
        '                "userSelected": "true"' +
        '              }' +
        '            ]' +
        '          },' +
        '          "verificationStatus": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",' +
        '                "code": "confirmed",' +
        '                "display": "Confirmed",' +
        '                "userSelected": "true"' +
        '              }' +
        '            ]' +
        '          },' +
        '          "category": [' +
        '            {' +
        '              "coding": [' +
        '                {' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/condition-category",' +
        '                  "code": "problem-list-item",' +
        '                  "display": "Problem List Item"' +
        '                }' +
        '              ]' +
        '           }' +
        '          ],' +
        '         "code": {' +
        '            "coding": [' +
        '             {' +
        '                "system": "http://hl7.org/fhir/sid/icd-10-cm",' +
        '                "version": "2021",' +
        '                "code": "C67.3",' +
        '                "display": "Malignant neoplasm of anterior wall of bladder",' +
        '                "userSelected": "true"' +
        '              }' +
        '            ]' +
        '          },' +
        '          "subject": {' +
        '            "reference": "Patient/62bc69333e113102f8cedca6"' +
        '          },' +
        '          "onsetDateTime": "2022-02-01T08:00:00.000+00:00"' +
        '        }' +
        '     },' +
        '      {' +
        '        "fullUrl": "http://GoodHealthcare.com/Observation/numer-pass-CMS646v0QICore4-4",' +
        '        "resource": {' +
        '          "resourceType": "Observation",' +
        '          "id": "numer-pass-CMS646v0QICore4-4",' +
        '          "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-observation"' +
        '            ]' +
        '          },' +
        '          "status": "final",' +
        '          "category": [' +
        '            {' +
        '              "coding": [' +
        '                {' +
        '                  "system": "http://terminology.hl7.org/CodeSystem/observation-category",' +
        '                  "code": "procedure",' +
        '                  "display": "Procedure"' +
        '                }' +
        '              ]' +
        '            }' +
        '          ],' +
        '          ' +
        '          "code": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://loinc.org",' +
        '                "code": "21902-2",' +
        '                "display": "Stage group.pathology Cancer"' +
        '              }' +
        '            ]' +
        '          },' +
        '          "subject": {' +
        '            "reference": "Patient/numer-pass-CMS646v0QICore4"' +
        '          },' +
        '          "partOf": ' +
        '            {' +
        '              "reference": "Procedure/numer-pass-CMS646v0QICore4-3"' +
        '            },' +
        '          "effectivePeriod": {' +
        '            "start": "2021-09-30T08:00:00.000+00:00",' +
        '            "end": "2021-09-30T08:15:00.000+00:00"' +
        '          },' +
        '          "issued": "2022-02-02T08:15:00.000+00:00",' +
        '          "valueCodeableConcept": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://snomed.info/sct",' +
        '                "code": "369934002",' +
        '                "display": "Tis: Carcinoma in situ (flat tumor of urinary bladder) (finding)",' +
        '                "userSelected": "true"' +
        '              }' +
        '            ]' +
        '          }' +
        '        }' +
        '      },' +
        '      {' +
        '        "fullUrl": "46454164",' +
        '        "resource": {' +
        '          "id": "46454164",' +
        '          "resourceType": "MedicationAdministration",' +
        '          "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-medicationadministration"' +
        '            ]' +
        '          },' +
        '          "status": "in-progress",' +
        '          "medicationCodeableConcept": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",' +
        '               "code": "1653579",' +
        '                "display": "BCG, live, Tice strain 50 MG Injection",' +
        '                "userSelected": "true"' +
        '             }' +
        '            ]' +
        '          },' +
        '          "subject": {' +
        '            "reference": "Patient/62bc69333e113102f8cedca6"' +
        '          },' +
        '          "requester": {' +
        '            "reference": "Practitioner/13143134531634"' +
        '          },' +
        '          "effectiveDateTime": "2022-08-01T08:00:00.000+00:00"' +
        '        }' +
        '      },' +
        '      {' +
        '        "fullUrl": "13143134531634",' +
        '        "resource": {' +
        '          "resourceType": "Practitioner",' +
        '          "id": "13143134531634",' +
        '         "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-practitioner"' +
        '            ]' +
        '          },' +
        '          "identifier": [' +
        '            {' +
        '              "use": "temp",' +
        '              "system": "urn:oid:2.16.840.1.113883.4.336",' +
        '              "value": "Practitioner-23"' +
        '            }' +
        '          ],' +
        '          "active": "true",' +
        '          "name": [' +
        '            {' +
        '              "family": "Careful",' +
        '              "given": [' +
        '                "Adam"' +
        '              ],' +
        '              "prefix": [' +
        '                "Dr"' +
        '              ]' +
        '            }' +
        '          ],' +
        '          "address": [' +
        '            {' +
        '              "use": "home",' +
        '              "line": [' +
        '                "534 Erewhon St"' +
        '              ],' +
        '              "city": "PleasantVille",' +
        '              "state": "UT",' +
        '              "postalCode": "84414"' +
        '            }' +
        '          ],' +
        '          "qualification": [' +
        '            {' +
        '              "identifier": [' +
        '                {' +
        '                  "system": "http://example.org/UniversityIdentifier",' +
        '                  "value": "12345"' +
        '                }' +
        '              ],' +
        '              "code": {' +
        '                "coding": [' +
        '                  {' +
        '                    "system": "http://terminology.hl7.org/CodeSystem/v2-0360%7C2.7",' +
        '                    "code": "BS",' +
        '                    "display": "Bachelor of Science"' +
        '                  }' +
        '                ],' +
        '                "text": "Bachelor of Science"' +
        '              },' +
        '              "period": {' +
        '                "start": "1995"' +
        '              },' +
        '              "issuer": {' +
        '                "display": "Example University"' +
        '              }' +
        '            }' +
        '          ]' +
        '        }' +
        '      },' +
        '      {' +
        '        "fullUrl": "http://GoodHealthcare.com/Procedure/numer-pass-CMS646v0QICore4-3",' +
        '        "resource": {' +
        '          "resourceType": "Procedure",' +
        '          "id": "numer-pass-CMS646v0QICore4-3",' +
        '          "meta": {' +
        '            "profile": [' +
        '              "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-procedure"' +
        '            ]' +
        '          },' +
        '          "extension": [' +
        '            {' +
        '              "url": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-recorded",' +
        '              "valueDateTime": "2022-02-01T08:00:00.000+00:00"' +
        '            }' +
        '          ],' +
        '          "status": "completed",' +
        '          "code": {' +
        '            "coding": [' +
        '              {' +
        '                "system": "http://snomed.info/sct",' +
        '                "code": "254292007",' +
        '                "display": "Tumor staging",' +
        '                "userSelected": "true"' +
        '              }' +
        '            ]' +
        '          },' +
        '          "subject": {' +
        '            "reference": "Patient/numer-pass-CMS646v0QICore4"' +
        '          },' +
        '          "performedPeriod": {' +
        '            "start": "2022-02-01T08:00:00.000+00:00",' +
        '            "end": "2022-02-01T08:15:00.000+00:00"' +
        '          }' +
        '        }' +
        '      }' +
        '    ]' +
        '  }'

}
