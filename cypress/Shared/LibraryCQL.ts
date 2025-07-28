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

    public static readonly invalidFhir4Lib = "library TESTMEASURE0000000003 version '0.0.000'\nusing FHIR version '4.0.1'\n" +
        "include FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\n" +
        "include MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\nparameter \"Measurement Period\" Interval<DateTimeTest>\n" +
        "context Patient\ndefine \"SDE Ethnicity\":\nSDE.\"SDE Ethnicity\"\ndefine \"SDE Payer\":\nSDE.\"SDE Payer\"\ndefine \"SDE Race\":\n" +
        "SDE.\"SDE Race\"\ndefine \"SDE Sex\":\nSDE.\"SDE Sex\""


    }