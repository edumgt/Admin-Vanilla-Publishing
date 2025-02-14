import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import type { CellPosition } from '../interfaces/iCellPosition';
import type { RowPosition } from '../interfaces/iRowPosition';
import { CellCtrl } from '../rendering/cell/cellCtrl';
import { RowCtrl } from '../rendering/row/rowCtrl';
export declare class NavigationService extends BeanStub implements NamedBean {
    beanName: "navigation";
    private gridBodyCon;
    constructor();
    postConstruct(): void;
    handlePageScrollingKey(event: KeyboardEvent, fromFullWidth?: boolean): boolean;
    private handlePageUpDown;
    private navigateTo;
    private onPageDown;
    private onPageUp;
    private navigateToNextPage;
    private navigateToNextPageWithAutoHeight;
    private getNextFocusIndexForAutoHeight;
    private getViewportHeight;
    private isRowTallerThanView;
    private onCtrlUpDownLeftRight;
    private onHomeOrEndKey;
    onTabKeyDown(previous: CellCtrl | RowCtrl, keyboardEvent: KeyboardEvent): void;
    tabToNextCell(backwards: boolean, event?: KeyboardEvent): boolean;
    private tabToNextCellCommon;
    private moveToNextEditingCell;
    private moveToNextEditingRow;
    private moveToNextCellNotEditing;
    /**
     * called by the cell, when tab is pressed while editing.
     * @return: RenderedCell when navigation successful, false if navigation should not be performed, otherwise null
     */
    private findNextCellToFocusOn;
    private isCellEditable;
    private lookupRowNodeForCell;
    navigateToNextCell(event: KeyboardEvent | null, key: string, currentCell: CellPosition, allowUserOverride: boolean): void;
    private getNormalisedPosition;
    tryToFocusFullWidthRow(position: CellPosition | RowPosition, backwards?: boolean): boolean;
    private focusPosition;
    private isValidNavigateCell;
    private getLastCellOfColSpan;
    ensureCellVisible(gridCell: CellPosition): void;
}
