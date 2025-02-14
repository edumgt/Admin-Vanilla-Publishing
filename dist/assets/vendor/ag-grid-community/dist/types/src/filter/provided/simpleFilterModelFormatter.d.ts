import type { IFilterOptionDef, ProvidedFilterModel } from '../../interfaces/iFilter';
import type { LocaleTextFunc } from '../../misc/locale/localeUtils';
import type { ISimpleFilterModel } from './iSimpleFilter';
import type { OptionsFactory } from './optionsFactory';
export declare abstract class SimpleFilterModelFormatter<TValue = any> {
    private readonly getLocaleTextFunc;
    private optionsFactory;
    protected readonly valueFormatter?: ((value: TValue | null) => string | null) | undefined;
    constructor(getLocaleTextFunc: () => LocaleTextFunc, optionsFactory: OptionsFactory, valueFormatter?: ((value: TValue | null) => string | null) | undefined);
    getModelAsString(model: ISimpleFilterModel | null): string | null;
    protected abstract conditionToString(condition: ProvidedFilterModel, opts?: IFilterOptionDef): string;
    updateParams(params: {
        optionsFactory: OptionsFactory;
    }): void;
    protected formatValue(value?: TValue | null): string;
}
