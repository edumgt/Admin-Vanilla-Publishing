import type { FilterChangedEvent } from '../../../events';
import type { NumberFilterModel } from '../../provided/number/iNumberFilter';
import type { ITextInputFloatingFilterParams, TextFilterModel } from '../../provided/text/iTextFilter';
import type { FloatingFilterInputService } from './iFloatingFilterInputService';
import { SimpleFloatingFilter } from './simpleFloatingFilter';
type ModelUnion = TextFilterModel | NumberFilterModel;
export declare abstract class TextInputFloatingFilter<M extends ModelUnion> extends SimpleFloatingFilter {
    private readonly eFloatingFilterInputContainer;
    private inputSvc;
    protected params: ITextInputFloatingFilterParams;
    private applyActive;
    protected abstract createFloatingFilterInputService(params: ITextInputFloatingFilterParams): FloatingFilterInputService;
    postConstruct(): void;
    protected defaultDebounceMs: number;
    onParentModelChanged(model: M, event: FilterChangedEvent): void;
    init(params: ITextInputFloatingFilterParams): void;
    private setupFloatingFilterInputService;
    private setTextInputParams;
    refresh(params: ITextInputFloatingFilterParams): void;
    protected recreateFloatingFilterInputService(params: ITextInputFloatingFilterParams): void;
    private syncUpWithParentFilter;
    protected setEditable(editable: boolean): void;
}
export {};
