import type { BeanCollection } from '../context/context';
import type { GridOptions } from '../entities/gridOptions';
import type { ValidationModuleName } from '../interfaces/iModule';
import type { RowModelType } from '../interfaces/iRowModel';
export interface OptionsValidator<T extends object> {
    objectName: string;
    allProperties?: string[];
    propertyExceptions?: string[];
    docsUrl?: `${string}/`;
    deprecations: Deprecations<T>;
    validations: Validations<T>;
}
export type Deprecations<T extends object> = Partial<{
    [key in keyof T]: {
        version: string;
        message?: string;
    };
}>;
type TypeOfArray<T> = NonNullable<T extends Array<infer U> ? U : T>;
export type Validations<T extends object> = Partial<{
    [key in keyof T]: (TypeOfArray<T[key]> extends object ? () => OptionsValidator<TypeOfArray<T[key]>> : never) | ((options: T, gridOptions: GridOptions, beans: BeanCollection) => OptionsValidation<T> | null) | OptionsValidation<T> | undefined;
}>;
export type ValidationsRequired<T extends object> = Required<Validations<T>>;
export interface OptionsValidation<T extends object> {
    module?: ValidationModuleName | ValidationModuleName[];
    supportedRowModels?: RowModelType[];
    dependencies?: RequiredOptions<T>;
    validate?: (options: T, gridOptions: GridOptions, beans: BeanCollection) => string | null;
    /** Currently only supports boolean or number */
    expectedType?: 'boolean' | 'number';
}
export type DependentValues<T extends object, K extends keyof T> = {
    required: T[K][];
    reason?: string;
};
export type RequiredOptions<T extends object> = {
    [K in keyof T]: DependentValues<T, K>;
};
export {};
