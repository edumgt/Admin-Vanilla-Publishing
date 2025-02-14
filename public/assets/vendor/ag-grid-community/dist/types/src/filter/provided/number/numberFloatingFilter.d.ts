import type { FloatingFilterInputService } from '../../floating/provided/iFloatingFilterInputService';
import { TextInputFloatingFilter } from '../../floating/provided/textInputFloatingFilter';
import type { INumberFloatingFilterParams, NumberFilterModel } from './iNumberFilter';
import { NumberFilterModelFormatter } from './numberFilterModelFormatter';
export declare class NumberFloatingFilter extends TextInputFloatingFilter<NumberFilterModel> {
    protected filterModelFormatter: NumberFilterModelFormatter;
    private allowedCharPattern;
    init(params: INumberFloatingFilterParams): void;
    refresh(params: INumberFloatingFilterParams): void;
    protected getDefaultOptions(): string[];
    protected createFloatingFilterInputService(params: INumberFloatingFilterParams): FloatingFilterInputService;
}
