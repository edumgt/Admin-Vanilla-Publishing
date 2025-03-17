import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import { AgColumn } from '../entities/agColumn';
import type { ColumnEventType } from '../events';
import type { PropertyValueChangedEvent } from '../gridOptionsService';
import type { IColumnCollectionService } from '../interfaces/iColumnCollectionService';
import type { ColKey, ColumnCollections } from './columnModel';
export declare class SelectionColService extends BeanStub implements NamedBean, IColumnCollectionService {
    beanName: "selectionColSvc";
    columns: ColumnCollections | null;
    postConstruct(): void;
    addColumns(cols: ColumnCollections): void;
    createColumns(cols: ColumnCollections, updateOrders: (callback: (cols: AgColumn[] | null) => AgColumn[] | null) => void): void;
    updateColumns(event: PropertyValueChangedEvent<'selectionColumnDef'>): void;
    getColumn(key: ColKey): AgColumn | null;
    getColumns(): AgColumn[] | null;
    isSelectionColumnEnabled(): boolean;
    private createSelectionColDef;
    private generateSelectionCols;
    private onSelectionOptionsChanged;
    destroy(): void;
    refreshVisibility(source: ColumnEventType): void;
}
