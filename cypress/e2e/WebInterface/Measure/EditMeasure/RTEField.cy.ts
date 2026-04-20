import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"


let randValue = (Math.floor((Math.random() * 1000) + 1))
let newCqlLibraryName = ''
let newMeasureName = ''

describe('Edit Measure: Add content to an Rich Text field and use formatting buttons', () => {

    beforeEach('Login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        const now = Date.now()
        const measureName = 'MeasureDefs' + now
        const CqlLibraryName = 'MeasureDefsLib' + now
        const measureCQL = QiCore4Cql.ICFTest_CQL.replace('EXM124v7QICore4', measureName)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue + 2

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        Utilities.deleteMeasure()
    })

    it('Verify the entry, save and the resulting HTML text formatting that in the RTE field', () => {

        let description = 'description'

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).clear()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type('{selectAll}{backspace}')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).should('be.enabled').click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        //apply RTE field formatting
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type('{selectAll}')
        cy.get(EditMeasurePage.frmtBoldBtn).click()
        cy.get(EditMeasurePage.frmtItalicizeBtn).click()
        cy.get(EditMeasurePage.frmtUnderlineBtn).click()
        cy.get(EditMeasurePage.frmtStrikeThroughBtn).click()
        cy.get(EditMeasurePage.nmbrdListBtn).click()
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<ol><li><p><strong><em><del><u>description</u></del></em></strong></p></li></ol>')
    })

    it('Verify the entry, undo, redo, bulletted list, embedded table, save and the resulting HTML text formatting that in the RTE field', () => {

        let description = 'description'

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).clear()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type('{selectAll}{backspace}')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).should('be.enabled').click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        //apply RTE field formatting
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).type('{selectAll}')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.frmtBoldBtn).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.frmtItalicizeBtn).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.frmtUnderlineBtn).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.frmtStrikeThroughBtn).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p><strong><em><del><u>description</u></del></em></strong></p>')

        //undo
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.unDoBtn).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p><strong><em><u>description</u></em></strong></p>')

        //redo
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEFieldToolbar).find(EditMeasurePage.reDoBtn).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p><strong><em><del><u>description</u></del></em></strong></p>')

        //bulletted list
        cy.get(EditMeasurePage.bulletedListBtn).click()
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        //add embedded table
        cy.get(EditMeasurePage.measureRTEPurposeContentField).click()
        cy.get(EditMeasurePage.measureRTEPurposeContentField).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.embdTableBtn).click()

        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click({ force: true }).wait(500)

        //save
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).invoke('html').then((html) => {
            // The bulleted list wraps content in <ul><li> and the table may also be inside a list item
            expect(html).to.contain('<strong><em><del><u>description</u></del></em></strong>')
            expect(html).to.contain('tableWrapper')
        })
    })
})

describe('Edit Measure: Add embedded table to Rich Text field and use the various buttons to manage the table', () => {

    beforeEach('Login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        const now = Date.now()
        const measureName = 'MeasureDefs' + now
        const CqlLibraryName = 'MeasureDefsLib' + now
        const measureCQL = QiCore4Cql.ICFTest_CQL.replace('EXM124v7QICore4', measureName)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue + 2

        CreateMeasurePage.CreateQICoreMeasureAPIWithNoMeasureDesc(newMeasureName, newCqlLibraryName, measureCQL)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        Utilities.deleteMeasure()
    })

    it('Verify the ability to embed a table into a RTE field as well as to add and remove columns and rows', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()

        //add embedded table
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click()
        cy.get(EditMeasurePage.embdTableBtn).click()

        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click({ force: true })

        //save
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div>')

        //add row above, row below, column left, column right and confirm
        cy.get(EditMeasurePage.embdTableAddRowAboveBtn).click()
        cy.get(EditMeasurePage.embdTableAddRowBelowBtn).click()
        cy.get(EditMeasurePage.embdTableAddColLeftBtn).click()
        cy.get(EditMeasurePage.embdTableAddColRightBtn).click({ force: true })

        //save
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).invoke('html').then((html) => {
            // Verify the table has the expected number of rows (5: 1 header + 2 original + 1 above + 1 below)
            expect(html).to.contain('tableWrapper')
            const rowCount = (html.match(/<tr>/g) || []).length
            expect(rowCount).to.equal(5)
            // Verify columns were added (at least 4 columns)
            const colCount = (html.match(/<col /g) || []).length
            expect(colCount).to.be.at.least(4)
        })

        //remove two rows, remove two columns and confirm
        cy.get(EditMeasurePage.embdTableRemoveRowBtn).click()
        cy.get(EditMeasurePage.embdTableRemoveRowBtn).click()
        cy.get(EditMeasurePage.embdTableRemoveColBtn).click()
        cy.get(EditMeasurePage.embdTableRemoveColBtn).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).click({ force: true })
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).invoke('html').then((html) => {
            expect(html).to.contain('tableWrapper')
            // Verify table was reduced: should have 3 rows and 3 columns (started with 5 each, removed 2 of each)
            const rowCount = (html.match(/<tr>/g) || []).length
            expect(rowCount).to.equal(3)
            const colCount = (html.match(/<col /g) || []).length
            expect(colCount).to.be.at.most(3)
        })

        //remove embedded table, entirely
        cy.get(EditMeasurePage.embdTableRemoveTblBtn).click({ force: true })

        //save
        cy.get(EditMeasurePage.measureDescriptionSaveButton).should('be.enabled').click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 190000)

        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).find(EditMeasurePage.RTEContentField).should('have.html', '<p><br class="ProseMirror-trailingBreak"></p>')
    })
})