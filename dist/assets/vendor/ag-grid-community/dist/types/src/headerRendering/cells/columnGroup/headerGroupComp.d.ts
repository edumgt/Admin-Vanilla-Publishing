import type { ColumnGroup } from '../../../interfaces/iColumn';
import type { AgGridCommon } from '../../../interfaces/iCommon';
import type { IComponent } from '../../../interfaces/iComponent';
import { Component } from '../../../widgets/component';
export interface IHeaderGroupParams<TData = any, TContext = any> extends AgGridCommon<TData, TContext> {
    /** The column group the header is for. */
    columnGroup: ColumnGroup;
    /**
     * The text label to render.
     * If the column is using a headerValueGetter, the displayName will take this into account.
     */
    displayName: string;
    /** Opens / closes the column group */
    setExpanded: (expanded: boolean) => void;
    /**
     * Sets a tooltip to the main element of this component.
     * @param value The value to be displayed by the tooltip
     * @param shouldDisplayTooltip A function returning a boolean that allows the tooltip to be displayed conditionally. This option does not work when `enableBrowserTooltips={true}`.
     */
    setTooltip: (value: string, shouldDisplayTooltip?: () => boolean) => void;
    /** The component to use for inside the header group (replaces the text value and leaves the remainder of the Grid's original component). */
    innerHeaderGroupComponent?: any;
    /** Additional params to customise to the `innerHeaderGroupComponent`. */
    innerHeaderGroupComponentParams?: any;
}
export interface IHeaderGroup {
}
export interface IHeaderGroupComp extends IHeaderGroup, IComponent<IHeaderGroupParams> {
}
export interface IInnerHeaderGroupComponent<TData = any, TContext = any, TParams extends Readonly<IHeaderGroupParams<TData, TContext>> = IHeaderGroupParams<TData, TContext>> extends IComponent<TParams>, IHeaderGroup {
}
export declare class HeaderGroupComp extends Component implements IHeaderGroupComp {
    private params;
    private readonly agOpened;
    private readonly agClosed;
    private readonly agLabel;
    private innerHeaderGroupComponent;
    private isLoadingInnerComponent;
    constructor();
    init(params: IHeaderGroupParams): void;
    private checkWarnings;
    private workOutInnerHeaderGroupComponent;
    private setupExpandIcons;
    private addTouchAndClickListeners;
    private updateIconVisibility;
    private addInIcon;
    private addGroupExpandIcon;
    private setupLabel;
    destroy(): void;
}
