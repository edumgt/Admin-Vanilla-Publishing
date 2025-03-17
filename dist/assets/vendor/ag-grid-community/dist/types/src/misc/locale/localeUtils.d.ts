import type { LocaleService } from './localeService';
export type LocaleTextFunc = (key: string, defaultValue: string, variableValues?: string[]) => string;
export declare function _getLocaleTextFunc(localeSvc?: LocaleService): LocaleTextFunc;
