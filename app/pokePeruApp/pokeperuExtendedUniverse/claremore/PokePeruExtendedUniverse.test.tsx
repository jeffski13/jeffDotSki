import { render } from '@testing-library/react';
import PokePeruExtendedUniverse, {PokedexExtendedUniverseContainer, GymLeaderListExtendedUniverseContainer} from './PokePeruExtendedUniverse';

describe('PokePeruClaremore Component', () => {
  it('renders the component', () => {
    render(<PokePeruExtendedUniverse />);
  });
  it('renders the component', () => {
    render(<PokedexExtendedUniverseContainer />);
  });
  it('renders the component', () => {
    render(<GymLeaderListExtendedUniverseContainer />);
  });
});