import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import type { AgColumn } from '../entities/agColumn';
import type { ICellEditorParams } from '../interfaces/iCellEditor';
import type { IRowNode } from '../interfaces/iRowNode';
import type { CellCtrl } from '../rendering/cell/cellCtrl';
import type { RowCtrl } from '../rendering/row/rowCtrl';
import { PopupEditorWrapper } from './cellEditors/popupEditorWrapper';
export declare class EditService extends BeanStub implements NamedBean {
    beanName: "editSvc";
    startEditing(cellCtrl: CellCtrl, key?: string | null, cellStartedEdit?: boolean, event?: KeyboardEvent | MouseEvent | null): boolean;
    /**
     * Ends the Cell Editing
     * @param cancel `True` if the edit process is being canceled.
     * @returns `True` if the value of the `GridCell` has been updated, otherwise `False`.
     */
    stopEditing(cellCtrl: CellCtrl, cancel?: boolean): boolean;
    handleColDefChanged(cellCtrl: CellCtrl): void;
    setFocusOutOnEditor(cellCtrl: CellCtrl): void;
    setFocusInOnEditor(cellCtrl: CellCtrl): void;
    stopEditingAndFocus(cellCtrl: CellCtrl, suppressNavigateAfterEdit?: boolean, shiftKey?: boolean): void;
    createPopupEditorWrapper(params: ICellEditorParams): PopupEditorWrapper;
    stopAllEditing(cancel?: boolean): void;
    stopRowEditing(rowCtrl: RowCtrl, cancel?: boolean): void;
    addStopEditingWhenGridLosesFocus(viewports: HTMLElement[]): void;
    setInlineEditingCss(rowCtrl: RowCtrl): void;
    isCellEditable(column: AgColumn, rowNode: IRowNode): boolean;
    startRowOrCellEdit(cellCtrl: CellCtrl, key?: string | null, event?: KeyboardEvent | MouseEvent | null): boolean;
    stopRowOrCellEdit(cellCtrl: CellCtrl, cancel?: boolean): void;
    private createCellEditorParams;
    private navigateAfterEdit;
}
