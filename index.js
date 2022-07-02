'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const getColumnWidth = (columnsQuantity, gap) => `100%/${columnsQuantity} - ${gap}px`;
const getPivotByBreakpoint = (breakpointWidth) => `(${breakpointWidth}px - 100vw) * 1000`;
const buildClampFunc = (minimum, prefferable, maximum) => `clamp(${minimum}, ${prefferable}, ${maximum})`;
const getClampByOneBreakpoint = ({ width, cols, gap, initialWidth, }) => buildClampFunc(getColumnWidth(cols, gap), getPivotByBreakpoint(width), initialWidth);
const getClampByTwoBreakpoints = ({ breakpoints, initialWidth, gap, }) => {
    const breakpointNarrow = breakpoints[0];
    const breakpointWide = breakpoints[1];
    const [widthNarrow, columnsNarrow] = breakpointNarrow;
    const [widthWide, columnsWide] = breakpointWide;
    return buildClampFunc(getClampByOneBreakpoint({
        width: widthWide,
        cols: columnsWide,
        initialWidth: getColumnWidth(columnsNarrow, gap),
        gap,
    }), getPivotByBreakpoint(widthNarrow), initialWidth);
};
const getNestedRule = ({ breakpoints, initialWidth, gap, }) => {
    switch (breakpoints.length) {
        case 0: {
            return initialWidth;
        }
        case 1: {
            const breakpoint = breakpoints[0];
            const [width, columns] = breakpoint;
            return getClampByOneBreakpoint({
                width,
                cols: columns,
                initialWidth,
                gap,
            });
        }
        case 2: {
            return getClampByTwoBreakpoints({
                breakpoints: [breakpoints[0], breakpoints[1]],
                gap,
                initialWidth,
            });
        }
        default: {
            const breakpointNarrowest = breakpoints[0];
            const [width, columns] = breakpointNarrowest;
            return buildClampFunc(getNestedRule({
                breakpoints: breakpoints.slice(1),
                gap,
                initialWidth: getColumnWidth(columns, gap),
            }), getPivotByBreakpoint(width), initialWidth);
        }
    }
};
const getMediaQueriedColumnsCssFunc = ({ mediaQueries, gap = 0, initialWidth = "100%", }) => {
    const sortedByBreakpointAsc = Object.entries(mediaQueries)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map((breakpoint) => [Number(breakpoint[0]), breakpoint[1]]);
    return getNestedRule({
        breakpoints: sortedByBreakpointAsc,
        gap,
        initialWidth,
    });
};

exports.getMediaQueriedColumnsCssFunc = getMediaQueriedColumnsCssFunc;
//# sourceMappingURL=index.js.map
