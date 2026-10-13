import { MadieObject, Utilities } from './Utilities'

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
    Encounter = 'qicore-encounter',
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
    Task = 'Task'
}

export class TestCaseBuilder {
    public static readonly availableTab = '[data-testid="available-tab"]'
    public static readonly addedTab = '[data-testid="added-tab"]'
    public static readonly jsonTab = '[data-testid="json-tab"]'

    public static readonly addAttribute = '[data-testid="add-attribute-dialog-button"]'

    public static readonly availableSearch = '[data-testid="search-elements-input-input"]'
    public static readonly allProfilesRadio = '[data-testid="all-profiles-option"]'

    public static readonly applyButton = '[data-testid="element-editor-submit-button"]'
    public static readonly undoButton = '[data-testid="element-editor-undo-button"]'
    public static readonly observationStatus = '[data-testid="code-selector-Observation.status"]'
    public static readonly dropdownListbox = '[role="listbox"]'
    public static readonly dropdownOption = '[role="option"]'

    public static referenceTypeSelect(index = 0): string {
        return `[data-testid="reference-type-select-${index}"]`
    }

    public static referenceSelect(index = 0): string {
        return `[data-testid="reference-select-${index}"]`
    }

    public static selectReferenceType(profileUrl: string, index = 0): void {
        cy.get(this.referenceTypeSelect(index)).should('be.visible').click()
        cy.get(`${this.dropdownListbox} [data-value="${profileUrl}"]`).should('be.visible').click()
    }

    public static selectReference(profileReference: string, index = 0): void {
        cy.get(this.referenceSelect(index)).should('be.visible').click()
        cy.get(`${this.dropdownListbox} [data-value="${profileReference}"]`).should('be.visible').click()
    }

    public static readonly horizontalSlider = "[data-testid='builder-slider']"

    public static addEditNewResource(addition: Profile, resourceNumber?: number) {
        const addResourceSelector = `[data-testid="add-element-${addition}"]`
        const searchTerm = addition.replace(/^qicore-/, 'QICore ').replace(/-/g, ' ')

        cy.get(this.availableTab)
            .should('not.have.attr', 'aria-disabled', 'true')
            .then(($tab) => {
                if ($tab.attr('aria-selected') !== 'true') {
                    $tab[0].click()
                }
        })
        cy.get(this.availableTab).should('have.attr', 'aria-selected', 'true')
        cy.get(this.allProfilesRadio).should('be.visible').click()
        cy.get(this.allProfilesRadio).find('input[type="radio"]').should('be.checked')
        // The Available search input can be clipped by the Builder split pane.
        // Avoid Cypress actionability scrolling, which changes the pane layout.
        cy.get(this.availableSearch)
            .should('exist')
            .clear({ force: true })
            .type(`${searchTerm}{enter}`, { force: true })
        cy.get(addResourceSelector).should('be.visible').click()

        cy.get(this.addedTab)
            .should('not.have.attr', 'aria-disabled', 'true')
            .then(($tab) => {
                if ($tab.attr('aria-selected') !== 'true') {
                    $tab[0].click()
                }
            })
        cy.get(this.addedTab).should('have.attr', 'aria-selected', 'true')
        cy.contains('tbody tr', searchTerm, { matchCase: false })
            .find('[aria-label="Edit"] button')
            .should('be.visible')
            .click()
    }

    public static editAddedResource(resourceId: string) {
        cy.get(this.addedTab)
            .should('exist')
            .should('not.have.attr', 'aria-disabled', 'true')
            .then(($tab) => {
                if ($tab.attr('aria-selected') !== 'true') {
                    $tab[0].click()
                }
            })
        cy.get(this.addedTab).should('have.attr', 'aria-selected', 'true')

        const actionCenterButton = '[data-testid="action-center-button-' + resourceId + '"]'
        const editAction = '[data-testid="action-center-' + resourceId + '_Edit"]'

        cy.get('body').then(($body) => {
            if ($body.find(actionCenterButton).length) {
                cy.get(actionCenterButton).click()
            }

            if ($body.find(editAction).length) {
                cy.get(editAction).click()
                return
            }

            cy.contains('td', resourceId)
                .closest('tr')
                .within(() => {
                    cy.get('td')
                        .last()
                        .find('button,[role="button"]')
                        .first()
                        .click()
                })
        })
    }

    public static applyAndWait() {
        cy.get(TestCaseBuilder.applyButton).click()
        // The Builder disables Apply before its local dirty state settles; changing
        // attributes sooner opens the Discard Changes dialog.
        cy.wait(1000)
        Utilities.waitForElementDisabled(TestCaseBuilder.applyButton, 8500)
    }

    public static selectLeftMenu(menuOption: string) {
        cy.get('[data-testid="' + menuOption + '"]').click()
    }
}
