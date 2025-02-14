import type { FilterChangedEvent } from '../../../events';
import type { IFloatingFilterParams } from '../../floating/floatingFilter';
import { SimpleFloatingFilter } from '../../floating/provided/simpleFloatingFilter';
import type { ISimpleFilterModel } from '../iSimpleFilter';
import type { DateFilter } from './dateFilter';
import { DateFilterModelFormatter } from './dateFilterModelFormatter';
export declare class DateFloatingFilter extends SimpleFloatingFilter {
    private readonly eReadOnlyText;
    private readonly eDateWrapper;
    private dateComp;
    private params;
    private filterParams;
    protected filterModelFormatter: DateFilterModelFormatter;
    constructor();
    protected getDefaultOptions(): string[];
    init(params: IFloatingFilterParams<DateFilter>): void;
    refresh(params: IFloatingFilterParams<DateFilter>): void;
    private updateCompOnModelChange;
    protected setEditable(editable: boolean): void;
    onParentModelChanged(model: ISimpleFilterModel, event: FilterChangedEvent): void;
    private onDateChanged;
    private getDateComponentParams;
    private createDateComponent;
}
