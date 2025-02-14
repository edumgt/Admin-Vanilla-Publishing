import type { IFilterOptionDef } from '../../../interfaces/iFilter';
import type { LocaleTextFunc } from '../../../misc/locale/localeUtils';
import type { OptionsFactory } from '../optionsFactory';
import { SimpleFilterModelFormatter } from '../simpleFilterModelFormatter';
import type { DateFilterModel, DateFilterParams } from './iDateFilter';
export declare class DateFilterModelFormatter extends SimpleFilterModelFormatter {
    private dateFilterParams;
    constructor(dateFilterParams: DateFilterParams, getLocaleTextFunc: () => LocaleTextFunc, optionsFactory: OptionsFactory);
    protected conditionToString(condition: DateFilterModel, options?: IFilterOptionDef): string;
    updateParams(params: {
        dateFilterParams: DateFilterParams;
        optionsFactory: OptionsFactory;
    }): void;
}
