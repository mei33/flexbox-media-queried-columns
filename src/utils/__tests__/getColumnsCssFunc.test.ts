import { getMediaQueriedColumnsCssFunc } from "../getMediaQueriedColumnsCssFunc";
import { minifyString } from "../minifyString";

describe("getColumnsCssFunc", () => {
  it("works for empty", () => {
    expect(getMediaQueriedColumnsCssFunc([])).toEqual("100%");
  });

  it("works for one", () => {
    expect(
      minifyString(
        getMediaQueriedColumnsCssFunc({
          500: 5,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          100%/(5 + 1) + 0.1%,
          (500px - 100vw) * 1000,
          100%
        )
      `)
    );
  });

  it("works for two", () => {
    expect(
      minifyString(
        getMediaQueriedColumnsCssFunc({
          500: 5,
          600: 6,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            100%/(6 + 1) + 0.1%,
            (600px - 100vw) * 1000,
            100%/(5 + 1) + 0.1%
          ),
          (500px - 100vw) * 1000,
          100%
        )
      `)
    );
  });

  it("works for three", () => {
    expect(
      minifyString(
        getMediaQueriedColumnsCssFunc({
          500: 5,
          600: 6,
          700: 7,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            clamp(
              100%/(7 + 1) + 0.1%,
              (700px - 100vw) * 1000,
              100%/(6 + 1) + 0.1%
            ),
            (600px - 100vw) * 1000,
            100%/(5 + 1) + 0.1%
          ),
          (500px - 100vw) * 1000,
          100%
        )
      `)
    );
  });

  it("works for four", () => {
    expect(
      minifyString(
        getMediaQueriedColumnsCssFunc({
          400: 4,
          500: 5,
          600: 6,
          700: 7,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            clamp(
              clamp(
                100%/(7 + 1) + 0.1%,
                (700px - 100vw) * 1000,
                100%/(6 + 1) + 0.1%
              ),
              (600px - 100vw) * 1000,
              100%/(5 + 1) + 0.1%
            ),
            (500px - 100vw) * 1000,
            100%/(4 + 1) + 0.1%
          ),
          (400px - 100vw) * 1000,
          100%
        )
      `)
    );
  });
});
