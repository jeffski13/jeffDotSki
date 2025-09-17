import { render, screen } from '@testing-library/react';
import PokePeruClaremore, {PokedexClaremoreContainer, GymLeaderListContainer} from './PokePeruClaremore';

describe('PokePeruClaremore Component', () => {
  it('renders the component', () => {
    render(<PokePeruClaremore />);
  });
  it('renders the component', () => {
    render(<PokedexClaremoreContainer />);
  });
  it('renders the component', () => {
    render(<GymLeaderListContainer />);
  });
});