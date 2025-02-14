import type { FilterChangedEvent } from '../../../events';
import type { ProvidedFilterModel } from '../../../interfaces/iFilter';
import { Component } from '../../../widgets/component';
import type { ISimpleFilter } from '../../provided/iSimpleFilter';
import { OptionsFactory } from '../../provided/optionsFactory';
import type { SimpleFilterModelFormatter } from '../../provided/simpleFilterModelFormatter';
import type { IFloatingFilterComp, IFloatingFilterParams } from '../floatingFilter';
export declare abstract class SimpleFloatingFilter extends Component implements IFloatingFilterComp<ISimpleFilter> {
    abstract onParentModelChanged(model: ProvidedFilterModel, event: FilterChangedEvent): void;
    protected abstract getDefaultOptions(): string[];
    protected abstract setEditable(editable: boolean): void;
    protected abstract filterModelFormatter: SimpleFilterModelFormatter;
    protected lastType: string | null | undefined;
    protected optionsFactory: OptionsFactory;
    protected readOnly: boolean;
    protected defaultDebounceMs: number;
    protected setLastTypeFromModel(model: ProvidedFilterModel): void;
    protected canWeEditAfterModelFromParentFilter(model: ProvidedFilterModel): boolean;
    init(params: IFloatingFilterParams): void;
    private setSimpleParams;
    refresh(params: IFloatingFilterParams): void;
    private hasSingleInput;
    private isTypeEditable;
    protected getAriaLabel(params: IFloatingFilterParams): string;
}
