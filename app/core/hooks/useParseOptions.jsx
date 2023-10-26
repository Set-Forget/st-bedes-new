export const useParseOptions = (options) => {
  if (typeof options === "string") {
    return options
      .replace(/'/g, '"')
      .match(/"[^"]+"/g)
      .map((match) => match.replace(/"/g, ""));
  }
  return [];
}
