import backgroundImageList, { getRandomImagePathFromList, IMAGE_PATH_PREFIX } from "./backgroundImagesList";

describe('backgroundImagesList', () => {
  test('list will return a string on happy path', () => {
    const backgroundImagesListMock = ['something'];
    const imagePath = getRandomImagePathFromList(backgroundImagesListMock);
    expect(typeof imagePath).toBe('string');
  });

  test('should always be within range of the length', () => {
    const backgroundImagesListMock = ['something'];
    const testsNeededForProbabilityTestingOutofBounds = 10;
    for (const x of Array(testsNeededForProbabilityTestingOutofBounds).keys()) {
      const imagePath = getRandomImagePathFromList(backgroundImagesListMock);
      expect(imagePath).toBe(backgroundImagesListMock[0]);
    }
  });

  test('empty list will return empty string', () => {
    const backgroundImagesListMock: string[] = [];
    const imagePath = getRandomImagePathFromList(backgroundImagesListMock);
    expect(typeof imagePath).toBe('string');
  });

  it('background images are correctly formatted', () => {
      const imagesList = backgroundImageList;
      imagesList.forEach(element => {
        expect(element.includes(IMAGE_PATH_PREFIX)).toBe(true);
      });
    });
});