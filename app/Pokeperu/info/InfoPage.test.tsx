import { render, screen } from '@testing-library/react';
import InfoPageContainer from './InfoPage';

describe('Pokedex Component', () => {
  it('renders the back link', () => {
    render(<InfoPageContainer />);
    const link = screen.getByRole('button', { name: 'Go back' });
    expect(link).toBeInTheDocument();
  });
});