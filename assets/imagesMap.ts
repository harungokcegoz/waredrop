export const imagesMap = new Map<string, string>([
  ["jacket", require("./clothes/jacket.png")],
]);

export const getImage = (name: string) => {
  return imagesMap.get(name);
};
