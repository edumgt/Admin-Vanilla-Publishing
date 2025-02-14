import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import type { BeanCollection } from '../context/context';
import type { AgColumn } from '../entities/agColumn';
import type { RowNode } from '../entities/rowNode';
import type { RenderedRowEvent } from '../interfaces/iCallbackParams';
import type { RefreshCellsParams } from '../interfaces/iCellsParams';
import type { IEventListener } from '../interfaces/iEventEmitter';
import type { IRowNode } from '../interfaces/iRowNode';
import type { RowPosition } from '../interfaces/iRowPosition';
import type { CellCtrl } from './cell/cellCtrl';
import { RowCtrl } from './row/rowCtrl';
interface RowNodeMap {
    [id: string]: IRowNode;
}
export declare class RowRenderer extends BeanStub implements NamedBean {
    beanName: "rowRenderer";
    private pageBounds;
    private colModel;
    private pinnedRowModel?;
    private rowModel;
    private focusSvc;
    private rowContainerHeight;
    private ctrlsSvc;
    wireBeans(beans: BeanCollection): void;
    private gridBodyCtrl;
    private destroyFuncsForColumnListeners;
    firstRenderedRow: number;
    lastRenderedRow: number;
    private rowCtrlsByRowIndex;
    private zombieRowCtrls;
    private cachedRowCtrls;
    allRowCtrls: RowCtrl[];
    topRowCtrls: RowCtrl[];
    bottomRowCtrls: RowCtrl[];
    private pinningLeft;
    private pinningRight;
    firstVisibleVPixel: number;
    lastVisibleVPixel: number;
    private refreshInProgress;
    private printLayout;
    private embedFullWidthRows;
    private stickyRowFeature?;
    private dataFirstRenderedFired;
    postConstruct(): void;
    private initialise;
    private initialiseCache;
    private getKeepDetailRowsCount;
    getStickyTopRowCtrls(): RowCtrl[];
    getStickyBottomRowCtrls(): RowCtrl[];
    private updateAllRowCtrls;
    private onCellFocusChanged;
    private onSuppressCellFocusChanged;
    private registerCellEventListeners;
    private setupRangeSelectionListeners;
    private removeGridColumnListeners;
    private refreshListenersToColumnsForCellComps;
    private onDomLayoutChanged;
    datasourceChanged(): void;
    private onPageLoaded;
    /**
     * @param column AgColumn
     * @returns An array with HTMLElement for every cell of the column passed as param.
     * If the cell is spanning across multiple columns, it only returns the html element
     * if the column passed is the first column of the span (used for auto width calculation).
     */
    getAllCellsNotSpanningForColumn(column: AgColumn): HTMLElement[];
    refreshFloatingRowComps(): void;
    /**
     * Determines which row controllers need to be destroyed and re-created vs which ones can
     * be re-used.
     *
     * This is operation is to pinned/floating rows as `this.recycleRows` is to normal/body rows.
     *
     * All `RowCtrl` instances in `rowCtrls` that don't correspond to `RowNode` instances in `rowNodes` are destroyed.
     * All `RowNode` instances in `rowNodes` that don't correspond to `RowCtrl` instances in `rowCtrls` are created.
     * All instances in `rowCtrls` must be in the same order as their corresponding nodes in `rowNodes`.
     *
     * @param rowCtrls The list of existing row controllers
     * @param rowNodes The canonical list of row nodes that should have associated controllers
     */
    private refreshFloatingRows;
    private onPinnedRowDataChanged;
    redrawRow(rowNode: RowNode, suppressEvent?: boolean): void;
    redrawRows(rowNodes?: IRowNode[]): void;
    private getCellToRestoreFocusToAfterRefresh;
    private redrawAfterModelUpdate;
    private scrollToTopIfNewData;
    private updateContainerHeights;
    private getLockOnRefresh;
    private releaseLockOnRefresh;
    isRefreshInProgress(): boolean;
    private restoreFocusedCell;
    getAllCellCtrls(): CellCtrl[];
    getAllRowCtrls(): RowCtrl[];
    addRenderedRowListener(eventName: RenderedRowEvent, rowIndex: number, callback: IEventListener<RenderedRowEvent>): void;
    refreshCells(params?: RefreshCellsParams): void;
    private refreshFullWidth;
    /**
     * @param rowNodes if provided, returns the RowCtrls for the provided rowNodes. otherwise returns all RowCtrls.
     */
    getRowCtrls(rowNodes?: IRowNode[] | null): RowCtrl[];
    getCellCtrls(rowNodes?: IRowNode[] | null, columns?: (string | AgColumn)[]): CellCtrl[];
    destroy(): void;
    private removeAllRowComps;
    private getRowsToRecycle;
    private removeRowCtrls;
    private onBodyScroll;
    redraw(params?: {
        afterScroll?: boolean;
    }): void;
    private removeRowCompsNotToDraw;
    private calculateIndexesToDraw;
    private recycleRows;
    private dispatchDisplayedRowsChanged;
    private onDisplayedColumnsChanged;
    private redrawFullWidthEmbeddedRows;
    getFullWidthRowCtrls(rowNodes?: IRowNode[]): RowCtrl[];
    private createOrUpdateRowCtrl;
    private destroyRowCtrls;
    private getRowBuffer;
    private getRowBufferInPixels;
    private workOutFirstAndLastRowsToRender;
    /**
     * This event will only be fired once, and is queued until after the browser next renders.
     * This allows us to fire an event during the start of the render cycle, when we first see data being rendered
     * but not execute the event until all of the data has finished being rendered to the dom.
     */
    dispatchFirstDataRenderedEvent(): void;
    private ensureAllRowsInRangeHaveHeightsCalculated;
    private doNotUnVirtualiseRow;
    private isRowPresent;
    private createRowCon;
    getRenderedNodes(): RowNode<any>[];
    getRowByPosition(rowPosition: RowPosition): RowCtrl | null;
    isRangeInRenderedViewport(startIndex: number, endIndex: number): boolean;
}
export interface RefreshViewParams {
    recycleRows?: boolean;
    animate?: boolean;
    suppressKeepFocus?: boolean;
    onlyBody?: boolean;
    newData?: boolean;
    newPage?: boolean;
    domLayoutChanged?: boolean;
}
export declare function mapRowNodes(rowNodes?: IRowNode[] | null): {
    top: RowNodeMap;
    bottom: RowNodeMap;
    normal: RowNodeMap;
} | undefined;
export declare function isRowInMap(rowNode: RowNode, rowIdsMap: {
    top: RowNodeMap;
    bottom: RowNodeMap;
    normal: RowNodeMap;
}): boolean;
export {};
