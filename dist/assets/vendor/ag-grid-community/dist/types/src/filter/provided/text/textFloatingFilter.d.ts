import type { FloatingFilterInputService } from '../../floating/provided/iFloatingFilterInputService';
import { TextInputFloatingFilter } from '../../floating/provided/textInputFloatingFilter';
import type { SimpleFilterModelFormatter } from '../simpleFilterModelFormatter';
import type { ITextFloatingFilterParams, TextFilterModel } from './iTextFilter';
export declare class TextFloatingFilter extends TextInputFloatingFilter<TextFilterModel> {
    protected filterModelFormatter: SimpleFilterModelFormatter;
    init(params: ITextFloatingFilterParams): void;
    refresh(params: ITextFloatingFilterParams): void;
    protected getDefaultOptions(): string[];
    protected createFloatingFilterInputService(): FloatingFilterInputService;
}
