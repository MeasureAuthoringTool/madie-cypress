import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"


const now = Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'MeasureDefs' + now
let CqlLibraryName = 'MeasureDefsLib' + now
let newCqlLibraryName = ''
let newMeasureName = ''
const measureCQL = QiCore4Cql.ICFTest_CQL.replace('EXM124v7QICore4', measureName)

describe('Edit Measure: Add content to an Rich Text field and use formatting buttons', () => {

    beforeEach('Login', () => {
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue + 2

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify the entry, save and the resulting HTML text formatting that in the RTE field', () => {

        let description = 'description'

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).clear()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).type('{selectAll}{backspace}')
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)

        //apply RTE field formatting
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).type('{selectAll}')
        cy.get(EditMeasurePage.frmtBoldBtn).click()
        cy.get(EditMeasurePage.frmtItalicizeBtn).click()
        cy.get(EditMeasurePage.frmtUnderlineBtn).click()
        cy.get(EditMeasurePage.frmtStrikeThroughBtn).click()
        cy.get(EditMeasurePage.nmbrdListBtn).click()
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)

        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><ol><li><p><strong><em><del><u>description</u></del></em></strong></p></li></ol></div>')
    })

    it('Verify the entry, undo, redo, bulletted list, embedded table, save and the resulting HTML text formatting that in the RTE field', () => {

        let description = 'description'

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).clear()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).type('{selectAll}{backspace}')
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).type(description)
        cy.get(EditMeasurePage.measureDescriptionSaveButton).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)

        //apply RTE field formatting
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).type('{selectAll}')
        cy.get(EditMeasurePage.frmtBoldBtn).click()
        cy.get(EditMeasurePage.frmtItalicizeBtn).click()
        cy.get(EditMeasurePage.frmtUnderlineBtn).click()
        cy.get(EditMeasurePage.frmtStrikeThroughBtn).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><p><strong><em><del><u>description</u></del></em></strong></p></div>')


        //undo
        cy.get(EditMeasurePage.rteToolBar).find(EditMeasurePage.unDoBtn).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><p><strong><em><u>description</u></em></strong></p></div>')

        //redo
        cy.get(EditMeasurePage.rteToolBar).find(EditMeasurePage.reDoBtn).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><p><strong><em><del><u>description</u></del></em></strong></p></div>')

        //bulletted list
        cy.get(EditMeasurePage.bulletedListBtn).click()
        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)

        //add embedded table
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.embdTableBtn).click()

        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)


        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><p><strong><em><del><u>description</u></del></em></strong></p><p><br class="ProseMirror-trailingBreak"></p><div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div></div>')
    })
})

describe('Edit Measure: Add embedded table to Rich Text field and use the various buttons to manage the table', () => {

    beforeEach('Login', () => {
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue + 2

        CreateMeasurePage.CreateQICoreMeasureAPIWithNoMeasureDesc(newMeasureName, newCqlLibraryName, measureCQL)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify the ability to embed a table into a RTE field as well as to add and remove columns and rows', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Description
        cy.get(EditMeasurePage.leftPanelDescription).click()

        //add embedded table
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).click()
        cy.get(EditMeasurePage.embdTableBtn).click()

        cy.get(EditMeasurePage.measureDescriptionSaveButton).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)


        //confirm html formatting that is in the field
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div></div>')

        //add row above, row below, column left, column right and confirm
        cy.get(EditMeasurePage.embdTableAddRowAboveBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableAddRowBelowBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableAddColLeftBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableAddColRightBtn).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><div class="tableWrapper"><table style="min-width: 125px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div></div>')

        //remove two rows, remove two columns and confirm
        cy.get(EditMeasurePage.embdTableRemoveRowBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableRemoveRowBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableRemoveColBtn).wait(1500).click()
        cy.get(EditMeasurePage.embdTableRemoveColBtn).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th><th colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div></div>')

        //remove embedded table, entirely
        cy.get(EditMeasurePage.embdTableRemoveTblBtn).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).focus()
        cy.get(EditMeasurePage.measureDescriptionRTETextBox).should('have.html', '<div contenteditable="true" role="textbox" translate="no" class="tiptap ProseMirror" tabindex="0"><p><br class="ProseMirror-trailingBreak"></p></div>')

        //save
        cy.get(EditMeasurePage.measureDescriptionSaveButton).wait(1500).click()
        cy.get(EditMeasurePage.measureDescriptionSuccessMessage).should('be.visible')
        Utilities.waitForElementToNotExist(EditMeasurePage.measureDescriptionSuccessMessage, 90000)
    })
})