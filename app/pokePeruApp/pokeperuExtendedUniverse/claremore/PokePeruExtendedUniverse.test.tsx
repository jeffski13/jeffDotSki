import { render } from '@testing-library/react';
import PokePeruExtendedUniverse, {PokedexExtendedUniverseContainer, GymLeaderListExtendedUniverseContainer} from './PokePeruExtendedUniverse';
import { getExtendedUniverseBackgroundImages } from './backgroundImagesExtendedUniverse';
import { IMAGE_PATH_PREFIX } from '~/pokePeruApp/battle/backgroundImagesList';

describe('PokePeruExtendedUniverse Component', () => {
  it('renders the component', () => {
    render(<PokePeruExtendedUniverse />);
  });
  it('renders the component', () => {
    render(<PokedexExtendedUniverseContainer />);
  });
  it('renders the component', () => {
    render(<GymLeaderListExtendedUniverseContainer />);
  });

  it('background images are correctly formatted', () => {
    const imagesList = getExtendedUniverseBackgroundImages();
    imagesList.forEach(element => {
      expect(element.includes(IMAGE_PATH_PREFIX)).toBe(true);
    });
  });
});