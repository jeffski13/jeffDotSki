import { render, screen, fireEvent } from '@testing-library/react';
import { Pokedex } from './Pokedex';
import mockSelectedMonsters from '../mockMonsters';

describe('Pokedex Component', () => {
  it('displays the monster name when rendered', () => {
    // Render the Pokedex component
    render(<Pokedex selectedMonsters={mockSelectedMonsters} />);

    // Assert that each monster's name is displayed
    mockSelectedMonsters.forEach((monster) => {
      expect(screen.getAllByText(monster.name).length).toBe(2);
    });
  });
});