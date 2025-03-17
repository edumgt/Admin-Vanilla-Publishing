import type { NamedBean } from '../context/bean';
import { BeanStub } from '../context/beanStub';
import type { BeanCollection } from '../context/context';
import type { AgColumn } from '../entities/agColumn';
import type { IRowNode } from '../interfaces/iRowNode';
export declare class ValueService extends BeanStub implements NamedBean {
    beanName: "valueSvc";
    private expressionSvc?;
    private colModel;
    private valueCache?;
    private dataTypeSvc?;
    wireBeans(beans: BeanCollection): void;
    private cellExpressions;
    private isTreeData;
    private initialised;
    private isSsrm;
    private executeValueGetter;
    postConstruct(): void;
    private init;
    /**
     * Use this function to get a displayable cell value.
     * This hides values in expanded group rows which are instead displayed by the footer row.
     */
    getValueForDisplay(column: AgColumn, node: IRowNode): any;
    getValue(column: AgColumn, rowNode?: IRowNode | null, ignoreAggData?: boolean): any;
    parseValue(column: AgColumn, rowNode: IRowNode | null, newValue: any, oldValue: any): any;
    getDeleteValue(column: AgColumn, rowNode: IRowNode): any;
    formatValue(column: AgColumn, node: IRowNode | null, value: any, suppliedFormatter?: (value: any) => string, useFormatterFromColumn?: boolean): string | null;
    private getOpenedGroup;
    /**
     * Sets the value of a GridCell
     * @param rowNode The `RowNode` to be updated
     * @param colKey The `Column` to be updated
     * @param newValue The new value to be set
     * @param eventSource The event source
     * @returns `True` if the value has been updated, otherwise`False`.
     */
    setValue(rowNode: IRowNode, colKey: string | AgColumn, newValue: any, eventSource?: string): boolean;
    private callColumnCellValueChangedHandler;
    private setValueUsingField;
    private executeValueGetterWithValueCache;
    private executeValueGetterWithoutValueCache;
    getValueCallback(node: IRowNode, field: string | AgColumn): any;
    getKeyForNode(col: AgColumn, rowNode: IRowNode): any;
}
