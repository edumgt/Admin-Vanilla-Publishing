import type { CommunityModuleName, EnterpriseModuleName, ResolvableModuleName, ValidationModuleName } from '../interfaces/iModule';
import type { RowModelType } from '../interfaces/iRowModel';
/**
 * Some of these modules are (for now) included by default in core. For these, we just return AllCommunityModule.
 */
export declare const RESOLVABLE_MODULE_NAMES: Record<ResolvableModuleName, readonly (CommunityModuleName | EnterpriseModuleName)[]>;
export declare const MODULES_FOR_ROW_MODELS: Partial<Record<CommunityModuleName | EnterpriseModuleName, RowModelType>>;
export declare function resolveModuleNames(moduleName: ValidationModuleName | ValidationModuleName[], rowModelType: RowModelType): (CommunityModuleName | EnterpriseModuleName)[];
