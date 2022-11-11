export class TestCaseJson {

    public static readonly TestCaseJson_Valid = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2021-01-01T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"2", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly TestCaseJson_missingResourceIDs = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2021-01-01T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly TestCaseJson_resourceIDsDup = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2021-01-01T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"1", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly TestCaseJson_Valid_w_All_Encounter = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}  "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00" }, "type": "collection", "entry": [ {{}   "fullUrl": "http://local/Encounter/1",   "resource": {{}' +
    ' "id":"1", "resourceType": "Encounter", "id": "Encounter-1", "meta": {{}  "versionId": "1",  "lastUpdated": "2021-10-13T03:34:10.160+00:00",  "source": "#nEcAkGd8PRwPP5fA"' +
    ' }, "text": {{}    "status": "generated",  "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished",  "class": {{}   "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP",  "display": "inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"}], "subject": {{} "reference": "Patient/1"}, "participant": [ {{} "individual": {{} "reference": "Practitioner/30164", "display": "Dr John Doe"' +
    ' }}],    "period": {{}    "start": "2021-01-01T03:34:10.054Z"  }  }  }, {{} "fullUrl": "http://local/Encounter/2", "resource": {{}  "id":"2", "resourceType": "Encounter",  "id": "Encounter-2",' +
    ' "meta": {{}  "versionId": "1",  "lastUpdated": "2021-10-13T03:34:10.160+00:00",   "source": "#nEcAkGd8PRwPP5fA"},  "text": {{}  "status": "generated",  "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"' +
    ' }, "status": "finished", "class": {{}  "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",   "code": "IMP",  "display": "inpatient encounter" },  "type": [ {{}' +
    ' "coding": [ {{}  "system": "http://snomed.info/sct", "version": "2022-09", "code": "185463005", "display": "Visit out of hours (procedure)"} ]} ], "subject": {{}' +
    ' "reference": "Patient/numer-pos-EXM135v11QICore4"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164", "display": "Dr John Doe"}' +
    ' } ],  "period": {{}  "start": "2020-11-11T03:34:10.054Z",  "end": "2021-01-01T03:34:10.054Z"}}},{{} "fullUrl": "http://local/Patient", "resource": {{} "id":"3", "resourceType": "Patient",' +
    ' "text": {{} "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"},' +
    ' "identifier": [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier",  "value": "20181011LizzyHealth"  } ],"name": [ {{} "use": "official",     "text": "Lizzy Health",' +
    ' "family": "Health", "given": [ "Lizzy"  ]  }  ],  "gender": "female",  "birthDate": "2000-10-11" }}]}'

    public static readonly validTestCaseJsonFHIR_and_QICORE = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2021-01-01T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"2", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly invalidTestCaseJsonFHIR_and_QICORE = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{} "fullUrl": "http://local/Patient","resource": {{} "id":"1", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly invalidTestCaseJsonFHIR_and_QICORE_Status = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "in-progress","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2021-01-01T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"2", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly invalidTestCaseJsonFHIR_and_QICORE_MDates = '{{} "resourceType": "Bundle", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2025-08-02T03:34:10.054Z",    "end": "2026-08-03T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"2", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": {{} "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

    public static readonly TestCaseJson_Invalid = '{{} "resourceType": "Account", "id": "1366", "meta": {{}   "versionId": "1",' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
    ' "resource": {{} "id":"1", "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
    ' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
    ' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
    ' "display": "Dr John Doe"}} ],"period": {{} "start": "2022-01-10T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "id":"2", "resourceType":'+
    ' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"},"identifier":' +
    ' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'


    public static readonly TestCaseJson_CohortPatientBoolean_PASS ='{ "resourceType": "Bundle", "id": "ip-pass-Inpatient' +
        'Encounter", "meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", ' +
        '"entry": [ { "fullUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3' +
        '598086b0a16d79fc6", "resourceType": "Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDe' +
        'finition/qicore-patient" ] }, "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/Cod' +
        'eSystem/v2-0203", "code": "MR" } ] }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d876' +
        '6be71f2bf020" } ], "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounte' +
        'r" ] } ], "gender": "male", "birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61' +
        'ceb84846536a9a98f9", "resource": { "id": "5c6c61ceb84846536a9a98f9", "resourceType": "Encounter", "status": "fini' +
        'shed", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpati' +
        'ent encounter" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "183452005", "display": "E' +
        'mergency hospital admission (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, ' +
        '"priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "103391001", "display": "Urgency" } ] }, "' +
        'period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-16T09:00:00+00:00" }, "length": { "value": 1, "un' +
        'it": "days" }, "location": [ { "location": { "reference": "Location/4989ju789fn93bvy562loe87c", "display": "Holy F' +
        'amily Hospital Inpatient" }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-16T09:00:00+00:00" ' +
        '} } ] } }, { "fullUrl": "http://MyHealthcare.com/Encounter/9dju7njdn764mdjy6dm92nje", "resource": { "id": "9dju7nj' +
        'dn764mdjy6dm92nje", "resourceType": "Encounter", "status": "finished", "class": { "system": "http://terminology.hl' +
        '7.org/CodeSystem/v3-ActCode", "code": "EMRGONLY", "display": "Emergency only" }, "type": [ { "coding": [ { "system' +
        '": "http://snomed.info/sct", "code": "4525004", "display": "Emergency department patient visit (procedure)" } ] } ' +
        '], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "2012-07-14T23:00:00+00:00' +
        '", "end": "2012-07-15T07:30:00+00:00" }, "length": { "value": 1, "unit": "days" }, "location": [ { "location": { "' +
        'reference": "Location/489juh6757h87j03jhy73mv7", "display": "Holy Family Hospital Inpatient" }, "period": { "start' +
        '": "2012-07-14T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.co' +
        'm/Location/489juh6757h87j03jhy73mv7", "resource": { "id": "489juh6757h87j03jhy73mv7", "resourceType": "Location", ' +
        '"meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location" ] }, "identifier": [ { ' +
        '"use": "official", "system": "http://holycrosshospital.com/location", "value": "489juh6757h87j03jhy73mv7" } ], "st' +
        'atus": "active", "name": "South Wing, second floor" } }, { "fullUrl": "http://MyHealthcare.com/Location/4989ju789f' +
        'n93bvy562loe87c", "resource": { "id": "4989ju789fn93bvy562loe87c", "resourceType": "Location", "meta": { "profile"' +
        ': [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location" ] }, "identifier": [ { "use": "official", ' +
        '"system": "http://holycrosshospital.com/location", "value": "4989ju789fn93bvy562loe87c" } ], "status": "active", "' +
        'name": "North Wing, second floor" } } ] }'

    public static readonly TestCaseJson_CohortEpisodeWithStrat_PASS ='{ "resourceType": "Bundle", "id": "ip-pass-Encounter", ' +
        '"meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ { ' +
        '"fullUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a16d79' +
        'fc6", "resourceType": "Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-' +
        'patient" ] }, "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203",' +
        ' "code": "MR" } ] }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f2bf020" } ],' +
        ' "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounter" ] } ], "gender":' +
        ' "male", "birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb84846536a9a98f9",' +
        '"resource": { "id": "5c6c61ceb84846536a9a98f9", "resourceType": "Encounter", "status": "finished", "class": { "syst' +
        'em": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "ambulatory" }, "type": [ { "co' +
        'ding": [ { "system": "http://snomed.info/sct", "code": "444971000124105", "display": "Annual wellness visit (proced' +
        'ure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "priority": { "coding": [ { "system"' +
        ': "http://snomed.info/sct", "code": "103391001", "display": "Urgency" } ] }, "period": { "start": "2022-07-15T08:00' +
        ':00+00:00", "end": "2022-07-15T09:00:00+00:00" } } } ] }'

    public static readonly CohortEpisodeEncounter_PASS ='{ "resourceType": "Bundle", "id": "ip-pass-InpatientEncounter", ' +
        '"meta": { "versionId": "3", "lastUpdated": "2022-09-14T12:38:39.889+00:00" }, "type": "collection", "entry": [ ' +
        '{ "fullUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6", "resource": { "id": "609bde3598086b0a1' +
        '6d79fc6", "resourceType": "Patient", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/' +
        'qicore-patient" ] }, "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/' +
        'v2-0203", "code": "MR" } ] }, "system": "http://myGoodHealthcare.com/MRN", "value": "8065dc8d26797064d8766be71f' +
        '2bf020" } ], "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "Inpatient Encounter" ] ' +
        '} ], "gender": "male", "birthDate": "1954-02-10" } }, { "fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb8' +
        '4846536a9a98f9", "resource": { "id": "5c6c61ceb84846536a9a98f9", "resourceType": "Encounter", "status": "finishe' +
        'd", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP", "display": "inpatie' +
        'nt encounter" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "183452005", "display": ' +
        '"Emergency hospital admission (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6"' +
        ' }, "priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "103391001", "display": "Urgency" } ' +
        '] }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-16T09:00:00+00:00" }, "length": { "value"' +
        ': 1, "unit": "days" }, "location": [ { "location": { "reference": "Location/4989ju789fn93bvy562loe87c", "display"' +
        ': "Holy Family Hospital Inpatient" }, "period": { "start": "2012-07-15T08:00:00+00:00", "end": "2012-07-16T09:00' +
        ':00+00:00" } } ] } }, { "fullUrl": "http://MyHealthcare.com/Encounter/9dju7njdn764mdjy6dm92nje", "resource": { "' +
        'id": "9dju7njdn764mdjy6dm92nje", "resourceType": "Encounter", "status": "finished", "class": { "system": "http:' +
        '//terminology.hl7.org/CodeSystem/v3-ActCode", "code": "EMRGONLY", "display": "Emergency only" }, "type": [ { "' +
        'coding": [ { "system": "http://snomed.info/sct", "code": "4525004", "display": "Emergency department patient v' +
        'isit (procedure)" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": ' +
        '"2012-07-14T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" }, "length": { "value": 1, "unit": "days" }, "' +
        'location": [ { "location": { "reference": "Location/489juh6757h87j03jhy73mv7", "display": "Holy Family Hospital ' +
        'Inpatient" }, "period": { "start": "2012-07-14T23:00:00+00:00", "end": "2012-07-15T07:30:00+00:00" } } ] } }, { ' +
        '"fullUrl": "http://MyHealthcare.com/Location/489juh6757h87j03jhy73mv7", "resource": { "id": "489juh6757h87j03jhy' +
        '73mv7", "resourceType": "Location", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/q' +
        'icore-location" ] }, "identifier": [ { "use": "official", "system": "http://holycrosshospital.com/location", "v' +
        'alue": "489juh6757h87j03jhy73mv7" } ], "status": "active", "name": "South Wing, second floor" } }, { "fullUrl": ' +
        '"http://MyHealthcare.com/Location/4989ju789fn93bvy562loe87c", "resource": { "id": "4989ju789fn93bvy562loe87c", "' +
        'resourceType": "Location", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-lo' +
        'cation" ] }, "identifier": [ { "use": "official", "system": "http://holycrosshospital.com/location", "value": "' +
        '4989ju789fn93bvy562loe87c" } ], "status": "active", "name": "North Wing, second floor" } } ] }'

    public static readonly RatioPatientSingleIPNoMO_IPP_PASS ='{ "resourceType": "Bundle", "id": "Denom-Pass-RatioPatie' +
        'ntSingleIPNoMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collec' +
        'tion", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient", "id": "609' +
        'bde3598086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patie' +
        'nt" ] }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"' +
        'hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiProperty' +
        'Table\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td>' +
        '<td><span>10 February 1954</span></td></tr></tbody></table></div>" }, "extension" : [ { "extension" : [ { "url' +
        '" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2106-3", "display' +
        '" : "White" } }, { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code' +
        '" : "1002-5", "display" : "American Indian or Alaska Native" } }, { "url" : "ombCategory", "valueCoding" : { "' +
        'system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2028-9", "display" : "Asian" } }, { "url" : "detailed", "' +
        'valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "1586-7", "display" : "Shoshone" } }, { ' +
        '"url" : "detailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2036-2", "display"' +
        ' : "Filipino" } }, { "url" : "text", "valueString" : "Mixed" } ], "url" : "http://hl7.org/fhir/us/core/Structur' +
        'eDefinition/us-core-race" }, { "extension" : [ { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.' +
        '16.840.1.113883.6.238", "code" : "2135-2", "display" : "Hispanic or Latino" } }, { "url" : "detailed", "valueCo' +
        'ding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2184-0", "display" : "Dominican" } }, { "url"' +
        ' : "detailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2148-5", "display" : "' +
        'Mexican" } }, { "url" : "text", "valueString" : "Hispanic or Latino" } ], "url" : "http://hl7.org/fhir/us/core/' +
        'StructureDefinition/us-core-ethnicity" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-bi' +
        'rthsex", "valueCode" : "F" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity"' +
        ', "valueCodeableConcept" : { "coding" : [ { "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor", "c' +
        'ode" : "ASKU", "display" : "asked but unknown" } ], "text" : "asked but unknown" } } ], "identifier": [ { "type' +
        '": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "htt' +
        'p://MyGoodHealthare.com/MedicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name":' +
        ' [ { "use": "usual", "family": "IPPass", "given": [ "IPPass" ] } ], "gender": "male", "birthDate": "1954-02-10" ' +
        '} }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c6c61ceb84846536' +
        'a9a98f9", "status": "finished", "class" : { "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code"' +
        ' : "IMP", "display" : "inpatient encounter" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code' +
        '": "183452005" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "201' +
        '2-01-16T08:00:00+00:00", "end": "2012-02-15T09:00:00+00:00" } } }] }'

    public static readonly RatioPatientSingleIPNoMO_DRC_PASS ='{ "resourceType": "Bundle", "id": "Numex-Pass-RatioPatien' +
        'tMultiIPWithMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collec' +
        'tion", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient", "id": "609b' +
        'de3598086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient' +
        '" ] }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hap' +
        'iHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTabl' +
        'e\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td>' +
        '<span>10 February 1954</span></td></tr></tbody></table></div>" }, "extension" : [ { "extension" : [ { "url" : "' +
        'ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2106-3", "display" : "W' +
        'hite" } }, { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "1' +
        '002-5", "display" : "American Indian or Alaska Native" } }, { "url" : "ombCategory", "valueCoding" : { "system" ' +
        ': "urn:oid:2.16.840.1.113883.6.238", "code" : "2028-9", "display" : "Asian" } }, { "url" : "detailed", "valueCod' +
        'ing" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "1586-7", "display" : "Shoshone" } }, { "url" :' +
        ' "detailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2036-2", "display" : "Fi' +
        'lipino" } }, { "url" : "text", "valueString" : "Mixed" } ], "url" : "http://hl7.org/fhir/us/core/StructureDefin' +
        'ition/us-core-race" }, { "extension" : [ { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.84' +
        '0.1.113883.6.238", "code" : "2135-2", "display" : "Hispanic or Latino" } }, { "url" : "detailed", "valueCoding"' +
        ' : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2184-0", "display" : "Dominican" } }, { "url" : "d' +
        'etailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2148-5", "display" : "Mexic' +
        'an" } }, { "url" : "text", "valueString" : "Hispanic or Latino" } ], "url" : "http://hl7.org/fhir/us/core/Struc' +
        'tureDefinition/us-core-ethnicity" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthse' +
        'x", "valueCode" : "F" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity", "v' +
        'alueCodeableConcept" : { "coding" : [ { "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor", "code' +
        '" : "ASKU", "display" : "asked but unknown" } ], "text" : "asked but unknown" } } ], "identifier": [ { "type": ' +
        '{ "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http:' +
        '//MyGoodHealthare.com/MedicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name": ' +
        '[ { "use": "usual", "family": "Denex", "given": [ "DenexPass" ] } ], "gender": "male", "birthDate": "1954-02-10' +
        '" } }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c6c61ceb8484' +
        '6536a9a98f9", "status": "finished", "class" : { "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode", ' +
        '"code" : "EMER", "display" : "emergency" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code' +
        '": "183452005" } ] } ], "priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "103390000", "d' +
        'isplay": "Unscheduled (qualifier value)" } ] }, "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" },' +
        ' "period": { "start": "2022-01-16T08:00:00+00:00", "end": "2022-02-15T09:00:00+00:00" } } }] }'

    public static readonly RatioEpisodeSingleIPNoMO_IPP_PASS ='{ "resourceType": "Bundle", "id": "Denom-Pass-RatioEpisode' +
        'MultiIPWithMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "type": "collectio' +
        'n", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient", "id": "609bde35' +
        '98086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ] }' +
        ', "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeade' +
        'rText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><t' +
        'body><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 ' +
        'February 1954</span></td></tr></tbody></table></div>" }, "extension" : [ { "extension" : [ { "url" : "ombCategory' +
        '", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2106-3", "display" : "White" } }, { ' +
        '"url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "1002-5", "display' +
        '" : "American Indian or Alaska Native" } }, { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.84' +
        '0.1.113883.6.238", "code" : "2028-9", "display" : "Asian" } }, { "url" : "detailed", "valueCoding" : { "system" : ' +
        '"urn:oid:2.16.840.1.113883.6.238", "code" : "1586-7", "display" : "Shoshone" } }, { "url" : "detailed", "valueCodi' +
        'ng" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2036-2", "display" : "Filipino" } }, { "url" : "te' +
        'xt", "valueString" : "Mixed" } ], "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race" }, { "ex' +
        'tension" : [ { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "21' +
        '35-2", "display" : "Hispanic or Latino" } }, { "url" : "detailed", "valueCoding" : { "system" : "urn:oid:2.16.840.' +
        '1.113883.6.238", "code" : "2184-0", "display" : "Dominican" } }, { "url" : "detailed", "valueCoding" : { "system" ' +
        ': "urn:oid:2.16.840.1.113883.6.238", "code" : "2148-5", "display" : "Mexican" } }, { "url" : "text", "valueString"' +
        ' : "Hispanic or Latino" } ], "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity" }, { "url"' +
        ' : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "valueCode" : "F" }, { "url" : "http://hl7.o' +
        'rg/fhir/us/core/StructureDefinition/us-core-genderIdentity", "valueCodeableConcept" : { "coding" : [ { "system" : "h' +
        'ttp://terminology.hl7.org/CodeSystem/v3-NullFlavor", "code" : "ASKU", "display" : "asked but unknown" } ], "text" : "' +
        'asked but unknown" } } ], "identifier": [ { "type": { "coding": [ { "system": "http://terminology.hl7.org/CodeSystem/' +
        'v2-0203", "code": "MR" } ] }, "system": "http://MyGoodHealthare.com/MedicalRecord", "value": "8065dc8d26797064d8766be' +
        '71f2bf020" } ], "active": true, "name": [ { "use": "usual", "family": "IPPass", "given": [ "IPPass" ] } ], "gender": ' +
        '"male", "birthDate": "1954-02-10" } }, { "fullUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encoun' +
        'ter", "id": "5c6c61ceb84846536a9a98f9", "status": "finished", "class" : { "system" : "http://terminology.hl7.org/Code' +
        'System/v3-ActCode", "code" : "IMP", "display" : "inpatient encounter" }, "type": [ { "coding": [ { "system": "http://s' +
        'nomed.info/sct", "code": "183452005" } ] } ], "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period"' +
        ': { "start": "2012-01-16T08:00:00+00:00", "end": "2012-02-15T09:00:00+00:00" } } }] }'

    public static readonly RatioEpisodeSingleIPNoMO_MultipleEpisodes_PASS ='{ "resourceType": "Bundle", "id": "2Enc-1Num' +
        'ex-RatioEpisodeMultiIPWithMO", "meta": { "versionId": "1", "lastUpdated": "2022-09-14T15:14:42.152+00:00" }, "t' +
        'ype": "collection", "entry": [ { "fullUrl": "609bde3598086b0a16d79fc6", "resource": { "resourceType": "Patient"' +
        ', "id": "609bde3598086b0a16d79fc6", "meta": { "profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qi' +
        'core-patient" ] }, "text": { "status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div c' +
        'lass=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPr' +
        'opertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth' +
        '</td><td><span>10 February 1954</span></td></tr></tbody></table></div>" }, "extension" : [ { "extension" : [ { "' +
        'url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2106-3", "display' +
        '" : "White" } }, { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code"' +
        ' : "1002-5", "display" : "American Indian or Alaska Native" } }, { "url" : "ombCategory", "valueCoding" : { "sys' +
        'tem" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2028-9", "display" : "Asian" } }, { "url" : "detailed", "val' +
        'ueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "1586-7", "display" : "Shoshone" } }, { "ur' +
        'l" : "detailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2036-2", "display" : ' +
        '"Filipino" } }, { "url" : "text", "valueString" : "Mixed" } ], "url" : "http://hl7.org/fhir/us/core/StructureDef' +
        'inition/us-core-race" }, { "extension" : [ { "url" : "ombCategory", "valueCoding" : { "system" : "urn:oid:2.16.8' +
        '40.1.113883.6.238", "code" : "2135-2", "display" : "Hispanic or Latino" } }, { "url" : "detailed", "valueCoding"' +
        ' : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2184-0", "display" : "Dominican" } }, { "url" : "de' +
        'tailed", "valueCoding" : { "system" : "urn:oid:2.16.840.1.113883.6.238", "code" : "2148-5", "display" : "Mexican' +
        '" } }, { "url" : "text", "valueString" : "Hispanic or Latino" } ], "url" : "http://hl7.org/fhir/us/core/Structur' +
        'eDefinition/us-core-ethnicity" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex", "' +
        'valueCode" : "F" }, { "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity", "valueCod' +
        'eableConcept" : { "coding" : [ { "system" : "http://terminology.hl7.org/CodeSystem/v3-NullFlavor", "code" : "ASK' +
        'U", "display" : "asked but unknown" } ], "text" : "asked but unknown" } } ], "identifier": [ { "type": { "coding' +
        '": [ { "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" } ] }, "system": "http://MyGoodHe' +
        'althare.com/MedicalRecord", "value": "8065dc8d26797064d8766be71f2bf020" } ], "active": true, "name": [ { "use": ' +
        '"usual", "family": "Denex", "given": [ "DenexPass" ] } ], "gender": "male", "birthDate": "1954-02-10" } }, { "fu' +
        'llUrl": "5c6c61ceb84846536a9a98f9", "resource": { "resourceType": "Encounter", "id": "5c6c61ceb84846536a9a98f9", ' +
        '"status": "finished", "class" : { "system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code" : "EMER",' +
        ' "display" : "emergency" }, "type": [ { "coding": [ { "system": "http://snomed.info/sct", "code": "183452005" } ]' +
        ' } ], "priority": { "coding": [ { "system": "http://snomed.info/sct", "code": "103390000", "display": "Unschedule' +
        'd (qualifier value)" } ] }, "subject": { "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": ' +
        '"2022-01-16T08:00:00+00:00", "end": "2022-02-15T09:00:00+00:00" } } }, { "fullUrl": "5c6c61ccb4846536a9a98f9", "r' +
        'esource": { "resourceType": "Encounter", "id": "5c6c61ccb4846536a9a98f9", "status": "finished", "class" : { "syst' +
        'em" : "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code" : "IMP", "display" : "inpatient" }, "type": [ { ' +
        '"coding": [ { "system": "http://snomed.info/sct", "code": "183452005" } ] } ], "priority": { "coding": [ { "syste' +
        'm": "http://snomed.info/sct", "code": "103390000", "display": "Unscheduled (qualifier value)" } ] }, "subject": {' +
        ' "reference": "Patient/609bde3598086b0a16d79fc6" }, "period": { "start": "2022-01-16T08:00:00+00:00", "end": "2022' +
        '-02-15T09:00:00+00:00" } } }] }'

    public static readonly CVPatientWithMO_PASS = '{ "resourceType": "Bundle","id": "IP-Pass-CVPatient","meta": {"versionId": "1",' +
        '"lastUpdated": "2022-09-14T15:14:42.152+00:00"},"type": "collection","entry": [  {"fullUrl": "609bde3598086b0a16d79fc6",' +
        '"resource": {"resourceType": "Patient","id": "609bde3598086b0a16d79fc6","meta": ' +
        '{"profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient" ]  }, "text": {"status": "generated",' +
        '"div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">LocationPeriodStartTimeMissing ' +
        '<b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>8065dc8d26797064d8' +
        '766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"   },' +
        '"extension" : [{"extension" : [{"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238",' +
        '"code" : "2106-3","display" : "White"}},{"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238",' +
        '"code" : "1002-5","display" : "American Indian or Alaska Native" } },  {"url" : "ombCategory","valueCoding" : {"system" : ' +
        '"urn:oid:2.16.840.1.113883.6.238","code" : "2028-9","display" : "Asian" } },{"url" : "detailed","valueCoding" : {"system" :' +
        ' "urn:oid:2.16.840.1.113883.6.238","code" : "1586-7","display" : "Shoshone"}},{"url" : "detailed","valueCoding" : {"system" ' +
        ': "urn:oid:2.16.840.1.113883.6.238","code" : "2036-2","display" : "Filipino"} },{"url" : "text","valueString" : "Mixed" } ],' +
        '"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race" }, {"extension" : [{"url" : "ombCategory","valueCoding" ' +
        ': {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2135-2","display" : "Hispanic or Latino"} },{"url" : "detailed",' +
        '"valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2184-0","display" : "Dominican" }},{"url" : ' +
        '"detailed","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2148-5","display" : "Mexican" }}, ' +
        '{"url" : "text","valueString" : "Hispanic or Latino"}],"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"},' +
        '{"url" : "http:hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex","valueCode" : "F"  },{"url" : "http://hl7.org/fhir/us/core/' +
        'StructureDefinition/us-core-genderIdentity","valueCodeableConcept" : {"coding" : [{"system" : "http://terminology.hl7.org/CodeSystem/' +
        'v3-NullFlavor","code" : "ASKU","display" : "asked but unknown"}],"text" : "asked but unknown"}}],"identifier": [ {"type": ' +
        '{"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR"} ]},"system": "http://MyGoodHealthare.com/MedicalRecord",' +
        '"value": "8065dc8d26797064d8766be71f2bf020"} ],"active": true,"name": [ {"use": "usual","family": "IPPass","given": [ "IPPass" ]} ],' +
        '"gender": "male","birthDate": "1954-02-10"}}, {"fullUrl": "5c6c61ceb84846536a9a98f9","resource": {"resourceType": "Encounter","id": ' +
        '"5c6c61ceb84846536a9a98f9","status": "finished","class" : {"system" : "http://terminology.hl7.org/CodeSystem/v3-ActCode","code" : "IMP",' +
        '"display" : "inpatient encounter"},"type": [ {"coding": [ {"system": "http://snomed.info/sct","code": "183452005"} ]} ],"subject": ' +
        '{"reference": "Patient/609bde3598086b0a16d79fc6"},"period": {"start": "2012-01-16T08:00:00+00:00","end": "2012-02-15T09:00:00+00:00"} }}]}'

    public static readonly CVEpisodeWithMO_PASS = '{"resourceType": "Bundle","id": "MsrPop-Pass-CVEpisode","meta": {"versionId": "1",' +
        '"lastUpdated": "2022-09-14T15:14:42.152+00:00" },"type": "collection","entry": [ {"fullUrl": "609bde3598086b0a16d79fc6","resource": ' +
        '{"resourceType": "Patient","id": "609bde3598086b0a16d79fc6","meta": {"profile": [ "http://hl7.org/fhir/us/qicore/StructureDefinition/' +
        'qicore-patient" ]},"text": {"status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><div class=\\"hapiHeaderText\\">' +
        'LocationPeriodStartTimeMissing <b>MSRPOPLEXSTRAT2PASS </b></div><table class=\\"hapiPropertyTable\\"><tbody><tr><td>Identifier</td><td>' +
        '8065dc8d26797064d8766be71f2bf020</td></tr><tr><td>Date of birth</td><td><span>10 February 1954</span></td></tr></tbody></table></div>"' +
        '},"extension" : [{"extension" : [{"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : ' +
        '"2106-3","display" : "White"} },{"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : ' +
        '"1002-5","display" : "American Indian or Alaska Native" }}, {"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238",' +
        '"code" : "2028-9","display" : "Asian"} },{"url" : "detailed","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238",' +
        '"code" : "1586-7","display" : "Shoshone" } },{"url" : "detailed","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238",' +
        '"code" : "2036-2","display" : "Filipino"}},{"url" : "text","valueString" : "Mixed"} ],"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"' +
        ' },{"extension" : [{"url" : "ombCategory","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : "2135-2",' +
        '"display" : "Hispanic or Latino" }},{"url" : "detailed","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : ' +
        '"2184-0","display" : "Dominican"}},{"url" : "detailed","valueCoding" : {"system" : "urn:oid:2.16.840.1.113883.6.238","code" : ' +
        '"2148-5","display" : "Mexican"} },{"url" : "text","valueString" : "Hispanic or Latino" }],"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"' +
        '},{"url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex","valueCode" : "F"},{"url" : "http://hl7.org/fhir/us/core/' +
        'StructureDefinition/us-core-genderIdentity","valueCodeableConcept" : {"coding" : [{"system" : "http://terminology.hl7.org/CodeSystem/' +
        'v3-NullFlavor","code" : "ASKU","display" : "asked but unknown"}],"text" : "asked but unknown"} }],"identifier": [ {"type":' +
        ' {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR"} ] },"system": "http://MyGoodHealthare.com/' +
        'MedicalRecord","value": "8065dc8d26797064d8766be71f2bf020" } ],"active": true,"name": [ {"use": "usual","family": "Numer","given":' +
        ' [ "NumerPass" ]} ],"gender": "male","birthDate": "1954-02-10"} },  {"fullUrl": "5c6c61ceb84846536a9a98f9","resource": {"resourceType":' +
        ' "Encounter","id": "5c6c61ceb84846536a9a98f9","status": "finished","class" : {"system" : "http://terminology.hl7.org/CodeSystem/' +
        'v3-ActCode","code" : "IMP","display" : "inpatient encounter"},"type": [ {"coding": [ {"system": "http://snomed.info/sct",' +
        '"code": "183452005" } ] } ],"priority": {"coding": [ {"system": "http://snomed.info/sct","code": "103390000","display": ' +
        '"Unscheduled (qualifier value)"} ]},"subject": {"reference":"Patient/609bde3598086b0a16d79fc6"},"period": {"start":"2022-01-16T08:00:00+00:00",' +
        '"end": "2022-02-15T09:00:00+00:00"} }}]}'

    public static readonly CVEpisodeWithStratification_PASS = '{"resourceType":"Bundle","id": "ip-pass-Encounter","meta": {"versionId": "3",' +
        '"lastUpdated": "2022-09-14T12:38:39.889+00:00"},"type": "collection","entry": [{"fullUrl": "http://MyHealthcare.com/Patient/609bde3598086b0a16d79fc6",' +
        '"resource": {"id": "609bde3598086b0a16d79fc6","resourceType": "Patient","meta": {"profile": ["http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"' +
        ']},"identifier": [{"type": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR"}]},"system": "http://myGoodHealthcare.com/MRN",' +
        '"value": "8065dc8d26797064d8766be71f2bf020"}],"active": true,"name": [{"use": "usual","family": "IPPass","given": ["Inpatient Encounter"]' +
        '}],"gender": "male","birthDate": "1954-02-10"}},{"fullUrl": "http://MyHealthcare.com/Encounter/5c6c61ceb84846536a9a98f9","resource":' +
        ' {"id": "5c6c61ceb84846536a9a98f9","resourceType": "Encounter","status": "finished","class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",' +
        '"code": "AMB","display": "ambulatory"},"type": [{"coding": [{"system": "http://snomed.info/sct","code": "444971000124105","display":' +
        ' "Annual wellness visit (procedure)"}]}],"subject": {"reference": "Patient/609bde3598086b0a16d79fc6"},"priority": {"coding": ' +
        '[{"system": "http://snomed.info/sct","code": "103391001","display": "Urgency"}]},"period": {"start": "2022-07-15T08:00:00+00:00","end":' +
        ' "2022-07-15T09:00:00+00:00"}}}]}'

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
    ' \"display\": \"Dr John Doe\"\n}\n} ],\n \"period\": {\n \"start\": \"2021-01-01T03:34:10.054Z\"\n}\n}\n}, {\n \"fullUrl\": \"http://local/Patient\",\n \"resource\": {\n \"id\":\"2\", \"resourceType\":'+
    ' \"Patient\",\n \"text\": {\n \"status\": \"generated\",\n \"div\": \"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>\"\n},\n \"meta\": {\n \"profile\": \"http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient\"},\n \"identifier\":' +
    ' [ {\n \"system\": \"http://clinfhir.com/fhir/NamingSystem/identifier\",\n \"value\": \"20181011LizzyHealth\"\n} ],\n \"name\": [ {\n \"use\": \"official\",\n' +
    ' \"text\": \"Lizzy Health\",\n \"family\": \"Health\",\n \"given\": [ \"Lizzy\" ]\n} ],\n \"gender\": \"female\",\n \"birthDate\": \"2000-10-11\"\n}\n} ]\n}'

    public static readonly API_TestCaseJson_InValid = '{\n  \"resourceType\": \"Account\",\n  \"id\": \"508\",\n  \"meta\": {\n    \"versionId\": \"1\",\n    \"lastUpdated\": \"2022-03-01T17:36:04.110+00:00\",\n    \"profile\": [ \"http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient\" ]\n  },\n  \"text\": {\n    \"status\": \"extensions\",\n    \"div\": \"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\"><p><b>Generated Narrative</b></p></div>\"\n  },\n  \"identifier\": [ {\n    \"use\": \"usual\",\n    \"type\": {\n      \"coding\": [ {\n        \"system\": \"http://terminology.hl7.org/CodeSystem/v2-0203\",\n        \"code\": \"MR\",\n        \"display\": \"Medical Record Number\"\n      } ],\n      \"text\": \"Medical Record Number\"\n    },\n    \"system\": \"http://hospital.smarthealthit.org\",\n    \"value\": \"1032702\"\n  } ],\n  \"name\": [ {\n    \"given\": [ \"Tester\" ]\n  } ],\n  \"gender\": \"female\"\n}'
    
}