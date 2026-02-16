import { MadieObject, Utilities } from "./Utilities"

// no prefix = QiCore
export enum Profile {
    AdverseEvent = 'adverse-event',
    AllergyIntolerance = 'allergy-intolerance',
    BodyStructure = 'body-structure',
    CarePlan = 'care-plan',
    CareTeam = 'care-team',
    Claim = 'claim',
    ClaimResponse = 'claim-response', 
    Communicatiion = 'communication',
    ConditionEncounterDiagnosis = 'condition-encounter-diagnosis',
    ConditionProblemsHealthConcerns = 'conidition-problems-health-ceoncerns',
    Coverage = 'coverage',
    Device = 'device',
    DeviceRequest = 'device',
    DeviceUseStatement = 'device',
    DiagnositicReportLabResultsReporting = 'device',
    DiagnositicReportReportAndNoteExchange = 'device',
    Encounter = 'encounter',
    FamilyMemberHistory = 'family-member-history',
    Flag = 'flag',
    Goal = 'goal',
    ImagingStudy = 'device',
    Immunization = 'device',
    ImmunizationEvaluation = 'device',
    ImmunizationRecommendation = 'device',
    Location = 'location',
    Medication = 'device',
    MedicationAdministration = 'device',
    MedicationDispense = 'device',
    MedicationRequest = 'device',
    MedicationStatement = 'device',
    NutritionOrder = 'device',
    SimpleObservation = 'simple-observation',
    NonPatientObservation = 'device',
    LabResultObservation = 'device',
    ObservationClinicalResult = 'device',
    ObservationScreeningAssessment = 'device',
    Organization = 'organization',
    Patient = 'qicore-patient',
    Practitioner = 'practitioner',
    PractitionerRole = 'practitioner-role',
    Procedure = 'procedure',
    QuestionnaireResponse = 'device',
    RelatedPerson = 'device',
    ServiceRequest = 'device',
    Substance = 'device',
    Task = 'device'
}

export class TestCaseBuilder {

    public static readonly availableTab = '[data-testid="available-tab"]'
    public static readonly addedTab = '[data-testid="added-tab"]'
    public static readonly jsonTab = '[data-testid="json-tab"]'

    public static readonly availableSearch = '[data-testid="search-elements-input-input"]'

    public static readonly applyButton = '[data-testid="element-editor-submit-button"]'
    public static readonly undoButton = '[data-testid="element-editor-undo-button"]'


    public static addEditNewResource(addition: Profile, resourceNumber?: number) {
        const currentUser = Cypress.env('selectedUser')

        let bundleIndex = 0,
        resourceIdPath = 'cypress/fixtures/' + currentUser + '/builderResourceId',
        resourceId = ''
        if (resourceNumber) {
            bundleIndex = resourceNumber
            resourceIdPath = 'cypress/fixtures/' + currentUser + '/builderResourceId' + resourceNumber
        }

        cy.get('[data-testid="add-element-' + addition + '"]').click()

        cy.get(this.addedTab).click().wait(500)

        cy.window().its('store').then(store => {

            resourceId = store.bundle.entry[bundleIndex].resource.id

            cy.writeFile(resourceIdPath, resourceId)

            cy.get('[data-testid="action-center-button-' + resourceId + '"]').click().wait(250)
            cy.get('[data-testid="action-center-' + resourceId + '_Edit"]').click()
        })

    }
}