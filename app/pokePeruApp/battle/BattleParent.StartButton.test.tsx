import { render, screen, fireEvent } from '@testing-library/react';
import BattleContainer from './BattleParent';
import mockSelectedMonsters, { mockTrainers } from '../mockMonsters';

describe('BattleStartScreen Component', () => {
  test('clicking "Start Battle" transitions to the battle phase', () => {
    render(<BattleContainer
      selectedMonsters={mockSelectedMonsters}
      gymLeaders={mockTrainers}
    />);

    // Verify the initial UI shows the selection results
    expect(screen.getByText(/Selection Results/i)).toBeInTheDocument();
    expect(screen.getByText(/User 1 chose: Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/User 2 chose: Charmander/i)).toBeInTheDocument();

    // Find and click the "Start Battle" button
    const startBattleButton = screen.getAllByText(/Start Battle/i)[0];
    fireEvent.click(startBattleButton);

    // Verify the UI transitions to the battle phase
    const hpValueMonster1 = document.querySelector('.hp-value-monster1');
    const monster1Hp = parseInt(hpValueMonster1?.innerHTML);
    expect(monster1Hp).toBe(35);
    const hpValueMonster2 = document.querySelector('.hp-value-monster2');
    const monster2Hp = parseInt(hpValueMonster2?.innerHTML);
    expect(monster2Hp).toBe(47);
  });

  test('shows "Are you sure?" popup with Yes and No buttons when back button is clicked', () => {
    const battleRoute = '/battletest'
    render(<BattleContainer selectedMonsters={mockSelectedMonsters}
      gymLeaders={mockTrainers}
      battleRoute={battleRoute} />);

    // Click the back button (find by alt text of the image or by role)
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    // Assert that the confirmation popup appears
    expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No/i })).toBeInTheDocument();
  });
});