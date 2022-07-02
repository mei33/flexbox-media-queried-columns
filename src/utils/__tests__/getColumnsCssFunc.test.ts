import { getMediaQueriedColumnsCssFunc } from "../getMediaQueriedColumnsCssFunc";
import { minifyString } from "../minifyString";

describe("getColumnsCssFunc", () => {
  it("works for empty", () => {
    expect(
      getMediaQueriedColumnsCssFunc({
        mediaQueries: {},
      })
    ).toEqual("100%");
  });

  it("works for one", () => {
    expect(
      minifyString(
        getMediaQueriedColumnsCssFunc({
          mediaQueries: { 500: 5 },
          gap: 10,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          100%/5 - 10px,
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
          mediaQueries: {
            500: 5,
            600: 6,
          },
          gap: 20,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            100%/6 - 20px,
            (600px - 100vw) * 1000,
            100%/5 - 20px
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
          mediaQueries: {
            500: 5,
            600: 6,
            700: 7,
          },
          gap: 0,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            clamp(
              100%/7 - 0px,
              (700px - 100vw) * 1000,
              100%/6 - 0px
            ),
            (600px - 100vw) * 1000,
            100%/5 - 0px
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
          mediaQueries: {
            400: 4,
            500: 5,
            600: 6,
            700: 7,
          },
          gap: 15,
        })
      )
    ).toEqual(
      minifyString(`
        clamp(
          clamp(
            clamp(
              clamp(
                100%/7 - 15px,
                (700px - 100vw) * 1000,
                100%/6 - 15px
              ),
              (600px - 100vw) * 1000,
              100%/5 - 15px
            ),
            (500px - 100vw) * 1000,
            100%/4 - 15px
          ),
          (400px - 100vw) * 1000,
          100%
        )
      `)
    );
  });
});
