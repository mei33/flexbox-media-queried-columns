type BreakpointInPx = number;
type ColumnsQuantity = number;
type InitialWidthInPercent = string;

interface MediaQueriesDict {
  [breakpointInPx: BreakpointInPx]: ColumnsQuantity;
}

type MediaQuery = [BreakpointInPx, ColumnsQuantity];

const getColumnWidth = (columnsQuantity: ColumnsQuantity) =>
  `100%/(${columnsQuantity} + 1) + 0.1%`;

const getPivotByBreakpoint = (breakpointWidth: BreakpointInPx) =>
  `(${breakpointWidth}px - 100vw) * 1000`;

const buildClampFunc = (
  minimum: string,
  prefferable: string,
  maximum: string
) => `clamp(${minimum}, ${prefferable}, ${maximum})`;

const getClampByOneBreakpoint = (
  width: BreakpointInPx,
  cols: ColumnsQuantity,
  initialWidth: InitialWidthInPercent
) =>
  buildClampFunc(
    getColumnWidth(cols),
    getPivotByBreakpoint(width),
    initialWidth
  );

const getClampByTwoBreakpoints = (
  breakpoints: [MediaQuery, MediaQuery],
  initialWidth: InitialWidthInPercent
) => {
  const breakpointNarrow = breakpoints[0];
  const breakpointWide = breakpoints[1];

  const [widthNarrow, columnsNarrow] = breakpointNarrow;
  const [widthWide, columnsWide] = breakpointWide;

  return buildClampFunc(
    getClampByOneBreakpoint(
      widthWide,
      columnsWide,
      getColumnWidth(columnsNarrow)
    ),
    getPivotByBreakpoint(widthNarrow),
    initialWidth
  );
};

export const getNestedRule = (
  breakpoints: MediaQuery[],
  initialWidth: InitialWidthInPercent
): string => {
  switch (breakpoints.length) {
    case 0: {
      return initialWidth;
    }

    case 1: {
      const breakpoint = breakpoints[0];
      const [width, columns] = breakpoint;

      return getClampByOneBreakpoint(width, columns, initialWidth);
    }

    case 2: {
      return getClampByTwoBreakpoints(
        [breakpoints[0], breakpoints[1]],
        initialWidth
      );
    }

    default: {
      const breakpointNarrowest = breakpoints[0];
      const [width, columns] = breakpointNarrowest;

      return buildClampFunc(
        getNestedRule(breakpoints.slice(1), getColumnWidth(columns)),
        getPivotByBreakpoint(width),
        initialWidth
      );
    }
  }
};

export const getMediaQueriedColumnsCssFunc = (
  mediaQueries: MediaQueriesDict,
  initialWidth: InitialWidthInPercent = "100%"
) => {
  const sortedByBreakpointAsc: MediaQuery[] = Object.entries(mediaQueries)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map((breakpoint) => [Number(breakpoint[0]), breakpoint[1]]);

  return getNestedRule(sortedByBreakpointAsc, initialWidth);
};
