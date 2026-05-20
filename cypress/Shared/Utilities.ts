import { TestCasesPage } from "./TestCasesPage"
import { MeasureGroupPage } from "./MeasureGroupPage"
import { CQLLibraryPage } from "./CQLLibraryPage"
import { v4 as uuidv4 } from 'uuid'
import { Environment } from "./Environment"
import { Measure } from "@madie/madie-models"
import { OktaLogin } from "./OktaLogin"

const adminApiKey = Environment.credentials().adminApiKey
let harpUser = ''
let harpUserALT = ''

export enum PermissionActions {
    GRANT = 'GRANT',
    REVOKE = 'REVOKE'
}

export enum MadieObject {
    Measure = 'measure',
    Library = 'library',
    TestCase = 'testCase'
}

export class Utilities {

    public static readonly dirtCheckModal = '.MuiDialogContent-root'
    public static readonly discardChangesContinue = '[data-testid="discard-dialog-continue-button"]'
    public static readonly discardChangesConfirmationModal = '.MuiBox-root'
    public static readonly keepWorkingCancel = '[data-testid="discard-dialog-cancel-button"]'
    public static readonly DiscardCancelBtn = '[data-testid="cancel-button"]'
    public static readonly DiscardButton = '[data-testid="discard-button"]'

    public static clickOnDiscardChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }

    public static clickOnKeepWorking(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }

    public static deleteMeasure(measureName?: string, cqlLibraryName?: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {
        let currentUser = ''
        if (altUser) {
            currentUser = Cypress.env('selectedAltUser')
        }
        else {
            currentUser = Cypress.env('selectedUser')
        }

        if (!currentUser) {
            cy.log('⚠️ deleteMeasure: No user set — skipping cleanup')
            return
        }

        let measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        if ((measureNumber === undefined) || (measureNumber === null) || (measureNumber === 0)) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        }
        if (measureNumber && measureNumber > 0) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId' + measureNumber
        }

        if (altUser === undefined || altUser === null) {
            altUser = false
        }

        OktaLogin.setupUserSession(altUser)

        cy.getCookie('accessToken').then((accessToken) => {
            if (!accessToken?.value) {
                cy.log('⚠️ deleteMeasure: No access token available — skipping cleanup')
                return
            }
            cy.task('readFileSafe', measurePath, { log: false }).then((id: string | null) => {
                if (!id) {
                    cy.log(`⚠️ deleteMeasure: Fixture file ${measurePath} is empty or missing — skipping cleanup`)
                    return
                }
                cy.request({
                    url: `/api/measures/${id}/delete`,
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken?.value}`,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    if (response.status === 200) {
                        cy.log('Measure deleted (hard delete) via API successfully')
                    } else {
                        cy.log(`⚠️ Measure cleanup returned ${response.status} — ${JSON.stringify(response.body).substring(0, 200)}`)
                    }
                })
            })
        })

    }

    public static deleteVersionedMeasure(measureName?: string, cqlLibraryName?: string, deleteSecondMeasure?: boolean, altUser?: boolean, measureNumber?: number): void {
        const currentUser = Cypress.env('selectedUser')

        if (!currentUser) {
            cy.log('⚠️ deleteVersionedMeasure: No user set — skipping cleanup')
            return
        }

        let user = ''
        let measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }

        if (altUser === undefined || altUser === null) {
            altUser = false
        }

        user = OktaLogin.getUser(altUser)
        OktaLogin.setupAdminSession()

        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId' + measureNumber
        }
        if (deleteSecondMeasure) {
            measurePath = 'cypress/fixtures/' + currentUser + '/measureId2'
        }
        cy.getCookie('accessToken').then((accessToken) => {
            if (!accessToken?.value) {
                cy.log('⚠️ deleteVersionedMeasure: No access token available — skipping cleanup')
                return
            }
            cy.task('readFileSafe', measurePath, { log: false }).then((id: string | null) => {
                if (!id) {
                    cy.log(`⚠️ deleteVersionedMeasure: Fixture file ${measurePath} is empty or missing — skipping cleanup`)
                    return
                }
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken?.value,
                        'api-key': adminApiKey,
                        'harpId': user
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    if (response.status === 200) {
                        cy.log('Versioned measure deleted successfully via admin API')
                    } else {
                        cy.log(`⚠️ Versioned measure cleanup returned ${response.status} — ${JSON.stringify(response.body).substring(0, 200)}`)
                    }
                })
            })
        })
    }

    public static textValues = {
        dataLines: null
    }

    public static typeFileContents(file: string, pageResource: string): void {
        cy.get(pageResource).should('exist')
        cy.get(pageResource).should('be.visible')
        cy.get(pageResource).click()
        cy.readFile(file).should('exist').then((fileContents) => {
            cy.get(pageResource).focused().type(fileContents, { force: true })
        })
    }

    public static readWriteFileData(file: string, pageResource: string): void {
        cy.fixture(file).then((str) => {
            // split file by line endings
            const fileArr = str.split(/\r?\n/);
            // log file in form of array
            cy.log(fileArr);
            // remove new line endings
            const cqlArr = fileArr.map((line: any) => {
                const goodLine = line.split(/[\r\n]+/);
                return goodLine[0];
            });
            // log new array
            cy.log(cqlArr);
            for (let i in cqlArr) {
                if (cqlArr[i] == '' || cqlArr[i] == null || cqlArr[i] == undefined) {
                    cy.get(pageResource).type('{moveToEnd}{enter}')
                } else {
                    this.textValues.dataLines = cqlArr[i]
                    cy.get(pageResource)
                        .type(this.textValues.dataLines)
                        .type('{moveToEnd}{enter}')
                    this.textValues.dataLines = null
                }

            }
        })
    }

    public static waitForElementEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.enabled')
    }

    public static waitForElementVisible = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('be.visible')
    }

    public static waitForElementToNotExist = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('not.exist')
    }

    public static waitForElementDisabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('not.be.enabled')
    }

    public static waitForElementWriteEnabled = (element: string, timeout: number) => {
        cy.get(element, { timeout: timeout }).should('exist')
        cy.get(element, { timeout: timeout }).should('be.visible')
        cy.get(element, { timeout: timeout }).should('not.be.disabled')
        cy.get(element, { timeout: timeout }).should('not.have.attr', 'readonly', 'readonly')
    }

    public static validationMeasureGroupSaveAll(measureScoreValue: string | string[]): void {
        switch ((measureScoreValue.valueOf()).toString()) {
            case "Ratio": {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Proportion': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')
                break
            }
            case 'Continuous Variable': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Surgical Absence of Cervix')
                Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break
            }
            case 'Cohort': {
                //verify the correct populations are displayed and not displayed
                cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
                Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
                cy.get(MeasureGroupPage.denominatorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExclusionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.denominatorExceptionSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorSelect)
                    .should('not.exist')
                cy.get(MeasureGroupPage.numeratorExclusionSelect)
                    .should('not.exist')
                break

            }
        }
    }

    public static dropdownSelect(dropdownDataElement: string, valueDataElement: string): void {
        cy.get(dropdownDataElement).should('exist').should('be.visible')

        if (valueDataElement == MeasureGroupPage.measureScoringCohort ||
            valueDataElement == MeasureGroupPage.measureScoringProportion ||
            valueDataElement == MeasureGroupPage.measureScoringRatio ||
            valueDataElement == MeasureGroupPage.measureScoringCV ||
            valueDataElement == CQLLibraryPage.cqlLibraryModelQICore ||
            valueDataElement == CQLLibraryPage.cqlLibraryModelQDM ||
            valueDataElement == MeasureGroupPage.qdmScoringCohort ||
            valueDataElement == MeasureGroupPage.qdmScoringCV ||
            valueDataElement == MeasureGroupPage.qdmScoringProportion ||
            valueDataElement == MeasureGroupPage.qdmScoringRatio

        ) {
            cy.get(dropdownDataElement).wait(250).click().wait(1000)
            cy.get(valueDataElement).wait(250).click().wait(1000)
        } else if (dropdownDataElement == '[id="improvement-notation-select"]' ||
            dropdownDataElement == MeasureGroupPage.initialPopulationSelect
        ) {
            cy.get(dropdownDataElement)
                .wait(500)
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .wait(500)
                .click()
                .wait(500)
        } else {
            Utilities.waitForElementVisible(dropdownDataElement, 50000)
            cy.get(dropdownDataElement)
                .wait(500)
                .click()
                .get('ul > li[data-value="' + valueDataElement + '"]')
                .wait(500)
                .click()
        }
    }

    public static populationSelect(populationType: string, populationOption: string): void {
        cy.get(populationType).should('exist').should('be.visible')

        if (populationType == MeasureGroupPage.initialPopulationSelect ||
            populationType == MeasureGroupPage.denominatorSelect ||
            populationType == MeasureGroupPage.denominatorExclusionSelect ||
            populationType == MeasureGroupPage.denominatorExceptionSelect ||
            populationType == MeasureGroupPage.numeratorSelect ||
            populationType == MeasureGroupPage.numeratorExclusionSelect ||
            populationType == MeasureGroupPage.measurePopulationSelect ||
            populationType == MeasureGroupPage.measurePopulationExclusionSelect ||
            populationType == MeasureGroupPage.measureObservationPopSelect ||
            populationType == MeasureGroupPage.firstInitialPopulationSelect ||
            populationType == MeasureGroupPage.secondInitialPopulationSelect
        ) {
            cy.get(populationType).click()
            cy.get('[data-value="' + populationOption + '"]').click()
        }
    }

    public static setMeasureGroupType(): void {

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).wait(1000).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).find('input').wait(100).type('Process').wait(100).type('{downArrow}').wait(100).type('{enter}').wait(500)
        cy.get('[data-testid="populationBasis"]').click()
    }

    public static validateErrors(errorElementObject: string, errorContainer: string, errorMsg1: string, errorMsg2?: string): void {

        cy.wait(2000)
        cy.get(errorElementObject).should('exist')
        cy.get(errorElementObject).should('be.visible')
        cy.get(errorElementObject).invoke('show').click({ force: true, multiple: true })
        if ((errorMsg1 != null) || (errorMsg1 != undefined)) {
            cy.get(errorContainer).invoke('show').should('contain', errorMsg1)
        }
    }

    public static validateToastMessage(message: string, timeout?: number) {

        if (!timeout) {
            cy.get(TestCasesPage.successMsg).should('have.text', message)
        } else {
            cy.get(TestCasesPage.successMsg, { timeout }).should('have.text', message)
        }
    }

    // ToDo: add similar function to easily transfer ownership of measures or libraries
    public static setSharePermissions(objectType: MadieObject, action: PermissionActions, user: string) {
        let currentUser = Cypress.env('selectedUser')
        let path: string
        let urlPath: string

        // doing this for backwards compatibility now - this should be refactored in the future
        if (objectType === MadieObject.Library) {
            path = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'
            if (action === PermissionActions.GRANT) {
                urlPath = 'cql-libraries/share'
            } else {
                urlPath = 'cql-libraries/unshare'
            }
        } else {
            path = 'cypress/fixtures/' + currentUser + '/measureId'
            if (action === PermissionActions.GRANT) {
                urlPath = 'measures/shared'
            } else {
                urlPath = 'measures/unshared'
            }
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(path).should('exist').then((mId) => {

                const users = new Array()
                users.push(user)

                cy.request({
                    failOnStatusCode: false,
                    url: '/api/' + urlPath,
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value,
                        'api-key': adminApiKey
                    },
                    method: 'PUT',
                    body: { [mId]: users }
                    // Note: these brackets don't make this an array.
                    // This syntax is needed for keys of an object to force it to honor the value
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    if (action === PermissionActions.GRANT) {
                        expect(response.body[mId][0].roles).to.include("SHARED_WITH")
                        expect(response.body[mId][0].userId).to.eq(user)
                    } else {
                        expect(response.body[mId]).to.eql([])
                    }
                })
            })
        })
    }

    public static checkAll() {

        cy.get('thead th').find('input[type="checkbox"]').check()
    }

    public static deleteLibrary(libraryName?: string, altUser?: boolean, libraryNumber?: number) {

        const currentUser = Cypress.env('selectedUser')

        if (!currentUser) {
            cy.log('⚠️ deleteLibrary: No user set — skipping cleanup')
            return
        }

        if (altUser === undefined || altUser === null) {
            altUser = false
        }
        let libraryPath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'

        OktaLogin.setupUserSession(false)

        if (libraryNumber && libraryNumber > 0) {
            libraryPath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId' + libraryNumber
        }

        OktaLogin.setupUserSession(altUser)

        cy.getCookie('accessToken').then((accessToken) => {
            if (!accessToken?.value) {
                cy.log('⚠️ deleteLibrary: No access token available — skipping cleanup')
                return
            }
            cy.task('readFileSafe', libraryPath, { log: false }).then((id: string | null) => {
                if (!id) {
                    cy.log(`⚠️ deleteLibrary: Fixture file ${libraryPath} is empty or missing — skipping cleanup`)
                    return
                }
                cy.request({
                    url: '/api/cql-libraries/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken?.value
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    if (response.status === 200) {
                        cy.log('Library deleted successfully')
                    } else {
                        cy.log(`⚠️ Library cleanup returned ${response.status} — ${JSON.stringify(response.body).substring(0, 200)}`)
                    }
                })
            })
        })
    }

    public static lockControl(type: MadieObject, lockObject: boolean, altUser?: boolean) {

        const currentUser = Cypress.env('selectedUser')

        let action = 'PUT'
        if (!lockObject) {
            action = 'DELETE'
        }

        if (altUser === undefined || altUser === null) {
            altUser = false
        }
        OktaLogin.setupUserSession(altUser)

        switch (type) {

            case MadieObject.Measure:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                        cy.request({
                            url: '/api/measures/' + id + '/measure-lock',
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value,
                            },
                            method: action
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
                break

            case MadieObject.TestCase:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                        cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((tcId) => {
                            let lockUrl = '/api/measures/' + measureId + '/test-cases/' + tcId + '/lock'
                            action = 'POST'
                            if (!lockObject) {
                                lockUrl = '/api/test-cases/' + tcId + '/unlock'
                            }

                            cy.request({
                                url: lockUrl,
                                headers: {
                                    authorization: 'Bearer ' + accessToken?.value,
                                },
                                method: action
                            }).then((response) => {
                                expect(response.status).to.eql(200)
                            })
                        })
                    })
                })
                break

            case MadieObject.Library:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {

                        cy.request({
                            url: '/api/cql-libraries/' + id + '/lock',
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value,
                            },
                            method: action
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
                break

            default:
                cy.log('No action. Unsupported type.')
        }
    }

    public static verifyAllLocksDeleted(type: MadieObject, altUser?: boolean) {

        if (!altUser) {
            altUser = false
        }

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(altUser)

        harpUser = OktaLogin.getUser(false)
        harpUserALT = OktaLogin.getUser(true)

        switch (type) {

            case MadieObject.Measure:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                        cy.request({
                            url: '/api/measures/unlock',
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value,
                            },
                            method: 'DELETE'
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            if (altUser) {
                                expect(response.body[0]).to.include('Delete measure locks for harpId: ' + harpUserALT)
                                expect(response.body[1]).to.be.oneOf(['Deleted measure lock: ' + measureId, 'No measure locks found for harpId: ' + harpUserALT])
                                expect(response.body[2]).to.be.oneOf(['Delete test case locks for harpId: ' + harpUserALT, 'Delete library locks for harpId: ' + harpUserALT])
                                expect(response.body[3]).to.include('No test case locks found for harpId: ' + harpUserALT)
                            }
                            else {
                                expect(response.body[0]).to.include('Delete measure locks for harpId: ' + harpUser)
                                expect(response.body[1]).to.be.oneOf(['Deleted measure lock: ' + measureId, 'No measure locks found for harpId: ' + harpUser])
                                expect(response.body[2]).to.be.oneOf(['Delete test case locks for harpId: ' + harpUser, 'Delete library locks for harpId: ' + harpUser])
                                expect(response.body[3]).to.include('No test case locks found for harpId: ' + harpUser)
                            }
                        })
                    })
                })
                break

            case MadieObject.Library:
                cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                        cy.request({
                            url: '/api/cql-libraries/unlock',
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value,
                            },
                            method: 'DELETE'
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            if (altUser) {
                                expect(response.body[0]).to.include('Delete library locks for harpId: ' + harpUserALT)
                                expect(response.body[1]).to.be.oneOf(['Deleted library lock for Id: ' + id, 'No library locks found for harpId: ' + harpUserALT])
                            }
                            else {
                                // if not altUser, then check for the library lock deletion message
                                expect(response.body[0]).to.include('Delete library locks for harpId: ' + harpUser)
                                expect(response.body[1]).to.be.oneOf(['Deleted library lock for Id: ' + id, 'No library locks found for harpId: ' + harpUser])
                            }
                        })
                    })
                })
                break

            default:
                cy.log('No action. Unsupported type.')
        }
    }
}
