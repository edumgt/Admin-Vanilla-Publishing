import type { BeanCollection } from '../context/context';
import type { ColDef } from '../entities/colDef';
import type { ISizeColumnsToFitParams } from '../interfaces/autoSize';
import type { Column } from '../interfaces/iColumn';
export declare function sizeColumnsToFit(beans: BeanCollection, paramsOrGridWidth?: ISizeColumnsToFitParams | number): void;
export declare function autoSizeColumns(beans: BeanCollection, keys: (string | ColDef | Column)[], skipHeader?: boolean): void;
export declare function autoSizeAllColumns(beans: BeanCollection, skipHeader?: boolean): void;
