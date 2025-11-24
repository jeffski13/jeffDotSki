import backgroundImageList from "~/pokePeruApp/battle/backgroundImagesList";

export const backgroundImageListExtendedUniverse: string[] = [
];

export const getExtendedUniverseBackgroundImages = (): string[] => {
  return [...backgroundImageListExtendedUniverse, ...backgroundImageList];
}