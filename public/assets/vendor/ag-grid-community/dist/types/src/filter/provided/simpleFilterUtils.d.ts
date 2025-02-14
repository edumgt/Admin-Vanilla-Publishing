import type { IFilterOptionDef } from '../../interfaces/iFilter';
import type { JoinOperator, Tuple } from './iSimpleFilter';
export declare function removeItems<T>(items: T[], startPosition: number, deleteCount?: number): T[];
export declare function isBlank<V>(cellValue: V): boolean;
export declare function getDefaultJoinOperator(defaultJoinOperator?: JoinOperator): JoinOperator;
export declare function evaluateCustomFilter<V>(customFilterOption: IFilterOptionDef | undefined, values: Tuple<V>, cellValue: V | null | undefined): boolean | undefined;
export declare function validateAndUpdateConditions<M>(conditions: M[], maxNumConditions: number): number;
