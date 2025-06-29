import { render, screen, fireEvent } from '@testing-library/react';
import {PokePeruContent} from '../index';
import { ElementType } from '../ElementType';
import type { Monster } from '../monsters';

const mockSelectedMonsters: Monster[] = [
  {
    name: 'Pikachu',
    trainer: 'Ash',
    description: '',
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    type: ElementType.Electric,
    secondType: null,
    image: '/images/monsters/pikachu.jpg',
    attack1: { name: 'Quick Attack', damage: 10, type: ElementType.Normal, isPhysical: true, powerPoints: 20, accuracy: 1 },
    attack2: { name: 'Thunderbolt', damage: 20, type: ElementType.Electric, isPhysical: false, powerPoints: 20, accuracy: 1 },
    trainerImage: '',
    inspiration: ''
  },
  {
    name: 'Charmander',
    trainer: 'Brock',
    description: '',
    hp: 47,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65,
    type: ElementType.Fire,
    secondType: null,
    image: '/images/monsters/charmander.jpg',
    attack1: { name: 'Scratch', damage: 10, type: ElementType.Normal, isPhysical: true, powerPoints: 20, accuracy: 1 },
    attack2: { name: 'Flamethrower', damage: 20, type: ElementType.Fire, isPhysical: false, powerPoints: 20, accuracy: 1 },
    trainerImage: '',
    inspiration: ''
  },
];

describe('PokePeruStart Component', () => {
  test('handleMonsterSelect modifies the selected monsters', () => {
    render(<PokePeruContent monsters={mockSelectedMonsters} />);

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