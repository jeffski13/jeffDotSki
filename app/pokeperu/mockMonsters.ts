import { ElementType } from "./ElementType";
import type { Monster } from "./monsters";

const mockSelectedMonsters: Monster[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
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
    attack1: { 
      name: 'Quick Attack', 
      type: ElementType.Normal, 
      isPhysical: true, 
      damage: 25, 
      powerPoints: 10, 
      accuracy: 1 
    },
    attack2: { 
      name: 'Thunderbolt', 
      type: ElementType.Electric, 
      isPhysical: false, 
      damage: 25, 
      powerPoints: 10, 
      accuracy: 1 
    },
    trainerImage: '',
    inspiration: 'intitialInspiration'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
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

export default mockSelectedMonsters;