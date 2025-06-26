import { render, screen, fireEvent } from '@testing-library/react';
import Pokedex from './Pokedex';
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

describe('Pokedex Component', () => {
  it('displays the monster name when rendered', () => {
    // Render the Pokedex component
    render(<Pokedex selectedMonsters={mockSelectedMonsters} />);

    // Assert that each monster's name is displayed
    mockSelectedMonsters.forEach((monster) => {
      expect(screen.getByText(monster.name)).toBeInTheDocument();
    });
  });
});