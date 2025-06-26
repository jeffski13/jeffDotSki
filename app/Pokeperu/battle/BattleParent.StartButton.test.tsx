import { render, screen, fireEvent } from '@testing-library/react';
import BattleContainer from './BattleParent';
import type { Monster } from '../monsters';
import { ElementType } from '../ElementType';

const mockSelectedMonsters: Monster[] = [
  {
    name: 'Pikachu',
    trainer: 'Ash',
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    type: ElementType.Electric,
    image: '/images/pikachu.jpg',
    attack1: {
      name: 'Quick Attack', damage: 10, type: ElementType.Normal,
      isPhysical: false, powerPoints: 0, accuracy: 1
    },
    attack2: {
      name: 'Thunderbolt', damage: 20, type: ElementType.Electric,
      isPhysical: false, powerPoints: 0, accuracy: 1
    },
    secondType: null,
    description: null,
    inspiration: '',
    trainerImage: ''
  },
  {
    name: 'Charmander',
    trainer: 'Brock',
    hp: 39,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65,
    type: ElementType.Fire,
    image: '/images/charmander.jpg',
    attack1: {
      name: 'Scratch', damage: 10, type: ElementType.Normal,
      isPhysical: false, powerPoints: 0, accuracy: 1
    },
    attack2: {
      name: 'Flamethrower', damage: 20, type: ElementType.Fire,
      isPhysical: false, powerPoints: 0, accuracy: 1
    },
    secondType: null,
    description: null,
    inspiration: '',
    trainerImage: ''
  },
];

describe('BattleStartScreen Component', () => {
  test('clicking "Start Battle" transitions to the battle phase', () => {
    render(<BattleContainer selectedMonsters={mockSelectedMonsters} />);

    // Verify the initial UI shows the selection results
    expect(screen.getByText(/Selection Results/i)).toBeInTheDocument();
    expect(screen.getByText(/User 1 chose: Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/User 2 chose: Charmander/i)).toBeInTheDocument();

    // Find and click the "Start Battle" button
    const startBattleButton = screen.getByText(/Start Battle/i);
    fireEvent.click(startBattleButton);

    // Verify the UI transitions to the battle phase
    const hpValueMonster1 = document.querySelector('.hp-value-monster1');
    const monster1Hp = parseInt(hpValueMonster1?.innerHTML);
    expect(monster1Hp).toBe(35);
    const hpValueMonster2 = document.querySelector('.hp-value-monster2');
    const monster2Hp = parseInt(hpValueMonster2?.innerHTML);
    expect(monster2Hp).toBe(39);
  });

  test('shows "Are you sure?" popup with Yes and No buttons when back button is clicked', () => {
      render(<BattleContainer selectedMonsters={mockSelectedMonsters} />);
  
      // Click the back button (find by alt text of the image or by role)
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
  
      // Assert that the confirmation popup appears
      expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Yes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /No/i })).toBeInTheDocument();
    });
});