export const IMAGE_PATH_PREFIX = '/images/';

const backgroundImageList: string[] = [
    '/images/landscape/peru-1.jpg',
    '/images/landscape/peru-2.jpg',
    '/images/landscape/peru-3.jpg',
    '/images/landscape/peru-4.jpg',
    '/images/landscape/peru-5.jpg',
    '/images/landscape/peru-6.jpg',
    '/images/landscape/peru-7.jpg',
    '/images/landscape/peru-8.jpg',
];
export default backgroundImageList;

export const getRandomImagePathFromList = (backgroundImageList: string[]): string => {
    if(backgroundImageList.length < 1) {
        return '';
    }
    const randomImageIndex = Math.floor(Math.random() * backgroundImageList.length); // Random number for background
    return backgroundImageList[randomImageIndex]
}