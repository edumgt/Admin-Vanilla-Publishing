import { BeanStub } from '../../context/beanStub';
import type { BeanCollection } from '../../context/context';
import type { RowDragComp } from '../../dragAndDrop/rowDragComp';
import type { AgColumn } from '../../entities/agColumn';
import type { CellStyle } from '../../entities/colDef';
import type { RowNode } from '../../entities/rowNode';
import type { AgEventType } from '../../eventTypes';
import type { CellEvent, CellFocusedEvent } from '../../events';
import type { GridOptionsService } from '../../gridOptionsService';
import type { BrandedType } from '../../interfaces/brandedType';
import type { ICellEditor } from '../../interfaces/iCellEditor';
import type { CellPosition } from '../../interfaces/iCellPosition';
import type { CellChangedEvent } from '../../interfaces/iRowNode';
import type { RowPosition } from '../../interfaces/iRowPosition';
import type { UserCompDetails } from '../../interfaces/iUserCompDetails';
import type { CheckboxSelectionComponent } from '../../selection/checkboxSelectionComponent';
import type { ICellRenderer } from '../cellRenderers/iCellRenderer';
import type { DndSourceComp } from '../dndSourceComp';
import type { RowCtrl } from '../row/rowCtrl';
import type { CellSpan } from '../spanning/rowSpanCache';
export interface ICellComp {
    addOrRemoveCssClass(cssClassName: string, on: boolean): void;
    setUserStyles(styles: CellStyle): void;
    getFocusableElement(): HTMLElement;
    setIncludeSelection(include: boolean): void;
    setIncludeRowDrag(include: boolean): void;
    setIncludeDndSource(include: boolean): void;
    getCellEditor(): ICellEditor | null;
    getCellRenderer(): ICellRenderer | null;
    getParentOfValue(): HTMLElement | null;
    setRenderDetails(compDetails: UserCompDetails | undefined, valueToDisplay: any, forceNewCellRendererInstance: boolean): void;
    setEditDetails(compDetails?: UserCompDetails, popup?: boolean, position?: 'over' | 'under', reactiveCustomComponents?: boolean): void;
}
export declare const DOM_DATA_KEY_CELL_CTRL = "cellCtrl";
export declare function _getCellCtrlForEventTarget(gos: GridOptionsService, eventTarget: EventTarget | null): CellCtrl | null;
export type CellCtrlInstanceId = BrandedType<string, 'CellCtrlInstanceId'>;
export declare class CellCtrl extends BeanStub {
    readonly column: AgColumn;
    readonly rowNode: RowNode;
    readonly rowCtrl: RowCtrl;
    readonly instanceId: CellCtrlInstanceId;
    readonly colIdSanitised: string;
    eGui: HTMLElement;
    comp: ICellComp;
    editCompDetails?: UserCompDetails;
    protected focusEventToRestore: CellFocusedEvent | undefined;
    printLayout: boolean;
    value: any;
    valueFormatted: any;
    private rangeFeature;
    private positionFeature;
    private customStyleFeature;
    private tooltipFeature;
    private mouseListener;
    private keyboardListener;
    cellPosition: CellPosition;
    editing: boolean;
    private includeSelection;
    private includeDndSource;
    private includeRowDrag;
    private isAutoHeight;
    suppressRefreshCell: boolean;
    private customRowDragComp;
    onCompAttachedFuncs: (() => void)[];
    onEditorAttachedFuncs: (() => void)[];
    constructor(column: AgColumn, rowNode: RowNode, beans: BeanCollection, rowCtrl: RowCtrl);
    shouldRestoreFocus(): boolean;
    onFocusOut(): void;
    private addFeatures;
    isCellSpanning(): boolean;
    getCellSpan(): CellSpan | undefined;
    private removeFeatures;
    private enableTooltipFeature;
    private disableTooltipFeature;
    setComp(comp: ICellComp, eCell: HTMLElement, _eWrapper: HTMLElement | undefined, eCellWrapper: HTMLElement | undefined, printLayout: boolean, startEditing: boolean, compBean: BeanStub | undefined): void;
    private setupAutoHeight;
    getCellAriaRole(): string;
    isCellRenderer(): boolean;
    getValueToDisplay(): any;
    private showValue;
    private setupControlComps;
    isForceWrapper(): boolean;
    private isIncludeControl;
    private isCheckboxSelection;
    private refreshShouldDestroy;
    onPopupEditorClosed(): void;
    /**
     * Ends the Cell Editing
     * @param cancel `True` if the edit process is being canceled.
     * @returns `True` if the value of the `GridCell` has been updated, otherwise `False`.
     */
    stopEditing(cancel?: boolean): boolean;
    private createCellRendererParams;
    onCellChanged(event: CellChangedEvent): void;
    refreshOrDestroyCell(params?: {
        suppressFlash?: boolean;
        newData?: boolean;
        forceRefresh?: boolean;
    }): void;
    refreshCell(params?: {
        suppressFlash?: boolean;
        newData?: boolean;
        forceRefresh?: boolean;
    }): void;
    stopEditingAndFocus(suppressNavigateAfterEdit?: boolean, shiftKey?: boolean): void;
    isCellEditable(): boolean;
    formatValue(value: any): any;
    private callValueFormatter;
    updateAndFormatValue(compareValues: boolean): boolean;
    private valuesAreEqual;
    private addDomData;
    createEvent<T extends AgEventType>(domEvent: Event | null, eventType: T): CellEvent<T>;
    processCharacter(event: KeyboardEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    onMouseEvent(eventName: string, mouseEvent: MouseEvent): void;
    getColSpanningList(): AgColumn[];
    onLeftChanged(): void;
    onDisplayedColumnsChanged(): void;
    private refreshFirstAndLastStyles;
    private refreshAriaColIndex;
    onWidthChanged(): void;
    getRowPosition(): RowPosition;
    updateRangeBordersIfRangeCount(): void;
    onCellSelectionChanged(): void;
    isRangeSelectionEnabled(): boolean;
    focusCell(forceBrowserFocus?: boolean): void;
    onRowIndexChanged(): void;
    onSuppressCellFocusChanged(suppressCellFocus: boolean): void;
    onFirstRightPinnedChanged(): void;
    onLastLeftPinnedChanged(): void;
    protected isCellFocused(): boolean;
    onCellFocused(event?: CellFocusedEvent): void;
    private createCellPosition;
    setInlineEditingCss(): void;
    protected applyStaticCssClasses(): void;
    onColumnHover(): void;
    onColDefChanged(): void;
    private setWrapText;
    dispatchCellContextMenuEvent(event: Event | null): void;
    getCellRenderer(): ICellRenderer | null;
    destroy(): void;
    createSelectionCheckbox(): CheckboxSelectionComponent | undefined;
    createDndSource(): DndSourceComp | undefined;
    registerRowDragger(customElement: HTMLElement, dragStartPixels?: number, suppressVisibilityChange?: boolean): void;
    createRowDragComp(customElement?: HTMLElement, dragStartPixels?: number, suppressVisibilityChange?: boolean): RowDragComp | undefined;
    cellEditorAttached(): void;
    setFocusedCellPosition(_cellPosition: CellPosition): void;
    getFocusedCellPosition(): CellPosition;
    refreshAriaRowIndex(): void;
    /**
     * Returns the root element of the cell, could be a span container rather than the cell element.
     * @returns The root element of the cell.
     */
    getRootElement(): HTMLElement;
}
