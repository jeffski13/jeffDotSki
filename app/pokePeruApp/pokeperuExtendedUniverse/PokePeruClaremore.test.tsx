import { render } from '@testing-library/react';
import PokePeruClaremore, {PokedexClaremoreContainer, GymLeaderListClaremoreContainer} from './PokePeruClaremore';

describe('PokePeruClaremore Component', () => {
  it('renders the component', () => {
    render(<PokePeruClaremore />);
  });
  it('renders the component', () => {
    render(<PokedexClaremoreContainer />);
  });
  it('renders the component', () => {
    render(<GymLeaderListClaremoreContainer />);
  });
});