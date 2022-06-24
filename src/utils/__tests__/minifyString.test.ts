import { minifyString } from "../minifyString";

describe("minifyString", () => {
  it("minifies", () => {
    expect(
      minifyString(`
      1 2 3
    `)
    ).toEqual("123");
  });
});
