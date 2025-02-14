/** An array that is always empty and that cannot be modified */
export declare const _EmptyArray: any[];
export declare function _last<T>(arr: T[]): T;
export declare function _last<T extends Node>(arr: NodeListOf<T>): T;
export declare function _areEqual<T>(a?: readonly T[] | null, b?: readonly T[] | null, comparator?: (a: T, b: T) => boolean): boolean;
export declare function _sortNumerically(array: number[]): number[];
export declare function _removeFromArray<T>(array: T[], object: T): void;
export declare function _moveInArray<T>(array: T[], objectsToMove: T[], toIndex: number): void;
