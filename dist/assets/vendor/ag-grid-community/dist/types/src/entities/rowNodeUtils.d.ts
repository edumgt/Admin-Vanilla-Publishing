import type { AgEventType } from '../eventTypes';
import type { RowEvent } from '../events';
import type { GridOptionsService } from '../gridOptionsService';
import type { RowNode } from './rowNode';
export declare function _createGlobalRowEvent<T extends AgEventType>(rowNode: RowNode, gos: GridOptionsService, type: T): RowEvent<T>;
