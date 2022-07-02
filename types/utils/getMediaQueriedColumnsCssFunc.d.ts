declare type BreakpointInPx = number;
declare type ColumnsQuantity = number;
declare type GapBetweenColumnsInPx = number;
export declare type MediaQueriesDict = Record<BreakpointInPx, ColumnsQuantity>;
declare type InitialWidthInPercent = string;
declare type MediaQuery = [BreakpointInPx, ColumnsQuantity];
interface GetNestedRuleParams {
    breakpoints: MediaQuery[];
    initialWidth: InitialWidthInPercent;
    gap: GapBetweenColumnsInPx;
}
export declare const getNestedRule: ({ breakpoints, initialWidth, gap, }: GetNestedRuleParams) => string;
interface GetMediaQueriedColumnsCssFuncParams {
    mediaQueries: MediaQueriesDict;
    gap?: GapBetweenColumnsInPx;
    initialWidth?: InitialWidthInPercent;
}
export declare const getMediaQueriedColumnsCssFunc: ({ mediaQueries, gap, initialWidth, }: GetMediaQueriedColumnsCssFuncParams) => string;
export {};
