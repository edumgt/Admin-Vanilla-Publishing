import type { IFilterOptionDef } from '../../interfaces/iFilter';
import type { ScalarFilterParams } from './iScalarFilter';
export declare class OptionsFactory {
    protected customFilterOptions: {
        [name: string]: IFilterOptionDef;
    };
    filterOptions: (IFilterOptionDef | string)[];
    defaultOption: string;
    init(params: ScalarFilterParams, defaultOptions: string[]): void;
    private mapCustomOptions;
    private selectDefaultItem;
    getCustomOption(name?: string | null): IFilterOptionDef | undefined;
}
