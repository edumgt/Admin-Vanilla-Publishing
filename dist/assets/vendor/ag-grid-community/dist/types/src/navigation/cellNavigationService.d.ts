import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import type { BeanCollection } from '../context/context';
import type { AgColumn } from '../entities/agColumn';
import type { CellPosition } from '../interfaces/iCellPosition';
import type { IRowNode } from '../interfaces/iRowNode';
import type { RowPosition } from '../interfaces/iRowPosition';
export declare class CellNavigationService extends BeanStub implements NamedBean {
    beanName: "cellNavigation";
    private rowSpanSvc;
    wireBeans(beans: BeanCollection): void;
    getNextCellToFocus(key: string, focusedCell: CellPosition, ctrlPressed?: boolean): CellPosition | null;
    private getNextCellToFocusWithCtrlPressed;
    private getNextCellToFocusWithoutCtrlPressed;
    private isCellGoodToFocusOn;
    private getCellToLeft;
    private getCellToRight;
    getRowBelow(rowPosition: RowPosition): RowPosition | null;
    private getNextStickyPosition;
    private getCellBelow;
    private isLastRowInContainer;
    getRowAbove(rowPosition: RowPosition): RowPosition | null;
    private getCellAbove;
    getNextTabbedCell(gridCell: CellPosition, backwards: boolean): CellPosition | null;
    getNextTabbedCellForwards(gridCell: CellPosition): CellPosition | null;
    getNextTabbedCellBackwards(gridCell: CellPosition): CellPosition | null;
    isSuppressNavigable(column: AgColumn, rowNode: IRowNode): boolean;
}
