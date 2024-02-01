export class LibraryCQL {
    public static readonly validCQL4QDMLib = 'library PalliativeCareExclusionECQMQDM version \'1.0.000\'\n' +
        '    \n' +
        'using QDM version \'5.6\'\n' +
        '\n' +
        'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
        '\n' +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
        '\n' +
        'valueset "Palliative Care Diagnosis": \'urn:oid:2.16.840.1.113883.3.464.1003.1167\' \n' +
        'valueset "Palliative Care Encounter": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1090\' \n' +
        'valueset "Palliative Care Intervention": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1135\' \n' +
        '\n' +
        'code "Functional Assessment of Chronic Illness Therapy - Palliative Care Questionnaire (FACIT-Pal)": \'71007-9\' from "LOINC" display \'Functional Assessment of Chronic Illness Therapy - Palliative Care Questionnaire (FACIT-Pal)\'\n' +
        '\n' +
        'parameter "Measurement Period" Interval<DateTime>\n' +
        '\n' +
        'context Patient\n' +
        '\n' +
        'define "Has Palliative Care in the Measurement Period":\n' +
        '  true'

    public static readonly validCQL4QICORELib = "library SupplementalDataElementsQICore4 version '2.0.0'\n" +
        "\n" +
        "using QICore version '4.1.1'\n" +
        "\n" +
        "valueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'"
}