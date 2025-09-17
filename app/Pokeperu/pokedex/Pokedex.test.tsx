import { render, screen, fireEvent } from '@testing-library/react';
import { Pokedex } from './Pokedex';
import mockSelectedMonsters from '../mockMonsters';
import ROUTES from '~/consts/ROUTES';

describe('Pokedex Component', () => {
  it('displays the monster name when rendered', () => {
    // Render the Pokedex component
    render(<Pokedex selectedMonsters={mockSelectedMonsters} battleRoute="/battle" />);

    // Assert that each monster's name is displayed
    mockSelectedMonsters.forEach((monster) => {
      expect(screen.getAllByText(monster.name).length).toBe(2);
    });
  });

  it('renders the battleRoute link', () => {
    const battleRoute = '/battle';
    render(<Pokedex selectedMonsters={mockSelectedMonsters} battleRoute={battleRoute} />);
    // Look for a link with the correct href
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', battleRoute);

    const infoRoute = ROUTES.pokePeru.info;
    const infoLink = screen.getByRole('link', { name: 'Information Link' });
    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute('href', infoRoute);
  });
});