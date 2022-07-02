type BreakpointInPx = number;
type ColumnsQuantity = number;
type GapBetweenColumnsInPx = number;

export type MediaQueriesDict = Record<BreakpointInPx, ColumnsQuantity>;

type InitialWidthInPercent = string;
type MediaQuery = [BreakpointInPx, ColumnsQuantity];

const getColumnWidth = (
  columnsQuantity: ColumnsQuantity,
  gap: GapBetweenColumnsInPx
) => `100%/${columnsQuantity} - ${gap}px`;

const getPivotByBreakpoint = (breakpointWidth: BreakpointInPx) =>
  `(${breakpointWidth}px - 100vw) * 1000`;

const buildClampFunc = (
  minimum: string,
  prefferable: string,
  maximum: string
) => `clamp(${minimum}, ${prefferable}, ${maximum})`;

interface GetClampByOneBreakpointParams {
  width: BreakpointInPx;
  cols: ColumnsQuantity;
  gap: GapBetweenColumnsInPx;
  initialWidth: InitialWidthInPercent;
}

const getClampByOneBreakpoint = ({
  width,
  cols,
  gap,
  initialWidth,
}: GetClampByOneBreakpointParams) =>
  buildClampFunc(
    getColumnWidth(cols, gap),
    getPivotByBreakpoint(width),
    initialWidth
  );

interface GetClampByTwoBreakpoints {
  breakpoints: [MediaQuery, MediaQuery];
  initialWidth: InitialWidthInPercent;
  gap: GapBetweenColumnsInPx;
}

const getClampByTwoBreakpoints = ({
  breakpoints,
  initialWidth,
  gap,
}: GetClampByTwoBreakpoints) => {
  const breakpointNarrow = breakpoints[0];
  const breakpointWide = breakpoints[1];

  const [widthNarrow, columnsNarrow] = breakpointNarrow;
  const [widthWide, columnsWide] = breakpointWide;

  return buildClampFunc(
    getClampByOneBreakpoint({
      width: widthWide,
      cols: columnsWide,
      initialWidth: getColumnWidth(columnsNarrow, gap),
      gap,
    }),
    getPivotByBreakpoint(widthNarrow),
    initialWidth
  );
};

interface GetNestedRuleParams {
  breakpoints: MediaQuery[];
  initialWidth: InitialWidthInPercent;
  gap: GapBetweenColumnsInPx;
}

export const getNestedRule = ({
  breakpoints,
  initialWidth,
  gap,
}: GetNestedRuleParams): string => {
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

      return buildClampFunc(
        getNestedRule({
          breakpoints: breakpoints.slice(1),
          gap,
          initialWidth: getColumnWidth(columns, gap),
        }),
        getPivotByBreakpoint(width),
        initialWidth
      );
    }
  }
};

interface GetMediaQueriedColumnsCssFuncParams {
  mediaQueries: MediaQueriesDict;
  gap?: GapBetweenColumnsInPx;
  initialWidth?: InitialWidthInPercent;
}

export const getMediaQueriedColumnsCssFunc = ({
  mediaQueries,
  gap = 0,
  initialWidth = "100%",
}: GetMediaQueriedColumnsCssFuncParams) => {
  const sortedByBreakpointAsc: MediaQuery[] = Object.entries(mediaQueries)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map((breakpoint) => [Number(breakpoint[0]), breakpoint[1]]);

  return getNestedRule({
    breakpoints: sortedByBreakpointAsc,
    gap,
    initialWidth,
  });
};
