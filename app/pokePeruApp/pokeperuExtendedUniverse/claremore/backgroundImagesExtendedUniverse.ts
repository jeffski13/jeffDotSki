import backgroundImageList from "~/pokePeruApp/battle/backgroundImagesList";

export const backgroundImageListExtendedUniverse: string[] = [
  'images/extendedUniverse/claremore/landscape/claremore-9.jpg',
  'images/extendedUniverse/claremore/landscape/claremore-10.jpg',
  'images/extendedUniverse/claremore/landscape/claremore-11.jpg',
];

export const getExtendedUniverseBackgroundImages = (): string[] => {
  return [...backgroundImageListExtendedUniverse, ...backgroundImageList];
}