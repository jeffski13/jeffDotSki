import { render, screen, fireEvent } from '@testing-library/react';
import PokePeruContent from './index';

describe('PokePeruStart Component', () => {
  test('handleMonsterSelect modifies the selected monsters', () => {
    render(<PokePeruContent />);

    // Find the buttons for the monsters
    const pikachuButton = screen.getByText(/Pikachu/i);
    const charmanderButton = screen.getByText(/Charmander/i);

    // Simulate selecting Pikachu
    fireEvent.click(pikachuButton);
    expect(screen.getByText(/User 2, choose your monster:/i)).toBeInTheDocument();

    // Simulate selecting Charmander
    fireEvent.click(charmanderButton);
    expect(screen.getByText(/Selection Results/i)).toBeInTheDocument();

    // Verify that the selected monsters are displayed in the results
    expect(screen.getByText(/User 1 chose: Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/User 2 chose: Charmander/i)).toBeInTheDocument();
  });
});