export const minifyString = (input: string) =>
  input.replace(/(\r\n|\n|\r| )/gm, "");
