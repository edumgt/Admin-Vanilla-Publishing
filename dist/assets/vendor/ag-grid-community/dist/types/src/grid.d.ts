import type { GridApi } from './api/gridApi';
import { Context } from './context/context';
import type { GridOptions } from './entities/gridOptions';
import type { IFrameworkOverrides } from './interfaces/iFrameworkOverrides';
import type { Module } from './interfaces/iModule';
export interface GridParams {
    globalListener?: (...args: any[]) => any;
    globalSyncListener?: (...args: any[]) => any;
    frameworkOverrides?: IFrameworkOverrides;
    providedBeanInstances?: {
        [key: string]: any;
    };
    setThemeOnGridDiv?: boolean;
    /**
     * Modules to be registered directly with this grid instance.
     */
    modules?: Module[];
}
export interface Params {
    /**
     * Modules to be registered directly with this grid instance.
     */
    modules?: Module[];
}
/**
 * When providing global grid options, specify how they should be merged with the grid options provided to individual grids.
 * - `deep` will merge the global options into the provided options deeply, with provided options taking precedence.
 * - `shallow` will merge the global options with the provided options shallowly, with provided options taking precedence.
 * @default 'shallow'
 * @param gridOptions - global grid options
 */
export type GlobalGridOptionsMergeStrategy = 'deep' | 'shallow';
/**
 * Provide gridOptions that will be shared by all grid instances.
 * Individually defined GridOptions will take precedence over global options.
 * @param gridOptions - global grid options
 */
export declare function provideGlobalGridOptions(gridOptions: GridOptions, mergeStrategy?: GlobalGridOptionsMergeStrategy): void;
export declare function _getGlobalGridOption<K extends keyof GridOptions>(gridOption: K): GridOptions[K];
/**
 * Creates a grid inside the provided HTML element.
 * @param eGridDiv Parent element to contain the grid.
 * @param gridOptions Configuration for the grid.
 * @param params Individually register AG Grid Modules to this grid.
 * @returns api to be used to interact with the grid.
 */
export declare function createGrid<TData>(eGridDiv: HTMLElement, gridOptions: GridOptions<TData>, params?: Params): GridApi<TData>;
export declare class GridCoreCreator {
    create(eGridDiv: HTMLElement, providedOptions: GridOptions, createUi: (context: Context) => void, acceptChanges?: (context: Context) => void, params?: GridParams, destroyCallback?: () => void): GridApi;
    private getRegisteredModules;
    private registerModuleFeatures;
    private createProvidedBeans;
    private createBeansList;
}
