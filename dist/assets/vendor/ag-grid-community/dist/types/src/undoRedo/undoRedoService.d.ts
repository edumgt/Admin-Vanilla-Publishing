import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
export declare class UndoRedoService extends BeanStub implements NamedBean {
    beanName: "undoRedo";
    private gridBodyCtrl;
    private cellValueChanges;
    private undoStack;
    private redoStack;
    private activeCellEdit;
    private activeRowEdit;
    private isPasting;
    private isRangeInAction;
    postConstruct(): void;
    private onCellValueChanged;
    private clearStacks;
    getCurrentUndoStackSize(): number;
    getCurrentRedoStackSize(): number;
    undo(source: 'api' | 'ui'): void;
    redo(source: 'api' | 'ui'): void;
    private undoRedo;
    private processAction;
    private processRange;
    private processCell;
    private setLastFocusedCell;
    private addListeners;
    private pushActionsToUndoStack;
}
