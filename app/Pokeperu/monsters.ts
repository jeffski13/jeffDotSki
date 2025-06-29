import { ElementType } from './ElementType';

// Define the structure of an attack
export interface MonsterAttack {
  name: string;
  type: ElementType;
  isPhysical: boolean; // True for physical attacks, false for special attacks
  damage: number;
  powerPoints: number; // New attribute for Power Points (PP)
  accuracy: Number;
}

// Define the structure of a monster
export interface Monster {
  name: string;
  trainer: string;
  trainerImage: string; // Add this line for the trainer image
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  type: ElementType;
  secondType: ElementType | null;
  image: string;
  description: string | null;
  attack1: MonsterAttack;
  attack2: MonsterAttack;
  inspiration: string; // New property for inspiration
}

// Use the Monster interface for the monsters array
export const monsters: Monster[] = [
  {
    name: 'Pikachu',
    trainer: 'Lt. Surge',
    trainerImage: '/images/gymleaders/ltsurge.png', // Added trainer image
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    type: ElementType.Electric,
    secondType: null,
    image: '/images/monsters/pikachu.png',
    description: 'Pikachu is an Electric-type Pokémon known for its agility and powerful Thunderbolt attack.',
    inspiration: 'Mouse', // Added inspiration
    attack1: {
      name: 'Quick Attack',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 20,
      powerPoints: 10,
      accuracy: 1,
    },
    attack2: {
      name: 'Thunderbolt',
      type: ElementType.Electric,
      isPhysical: false,
      damage: 40,
      powerPoints: 4,
      accuracy: 0.7,
    },
  },
  {
    name: 'Charmander',
    trainer: 'Blaine',
    trainerImage: '/images/gymleaders/blaine.png', // Added trainer image
    hp: 39,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65,
    type: ElementType.Fire,
    secondType: null,
    image: '/images/monsters/charmander.png',
    description: 'Charmander is a Fire-type Pokémon that uses its fiery tail to intimidate opponents.',
    inspiration: 'Lizard', // Added inspiration
    attack1: {
      name: 'Scratch',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 60,
      powerPoints: 2,
      accuracy: 0.4,
    },
    attack2: {
      name: 'Flamethrower',
      type: ElementType.Fire,
      isPhysical: true,
      damage: 30,
      powerPoints: 10,
      accuracy: 1,
    },
  },
  {
    name: 'Bulbasaur',
    trainer: 'Erika',
    trainerImage: '/images/gymleaders/erika.jpg', // Added trainer image
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
    type: ElementType.Grass,
    secondType: ElementType.Poison,
    image: '/images/monsters/bulbasaur.jpg',
    description: 'Bulbasaur is a Grass/Poison-type Pokémon that uses its bulb to unleash powerful attacks.',
    inspiration: 'Seed and Frog', // Added inspiration
    attack1: {
      name: 'Tackle',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 10,
      powerPoints: 35,
      accuracy: 0.95,
    },
    attack2: {
      name: 'Vine Whip',
      type: ElementType.Grass,
      isPhysical: false,
      damage: 20,
      powerPoints: 25,
      accuracy: 0.9,
    },
  },
  {
    name: 'Squirtle',
    trainer: 'Misty',
    trainerImage: '/images/gymleaders/misty.png', // Added trainer image
    hp: 44,
    attack: 48,
    defense: 65,
    specialAttack: 50,
    specialDefense: 64,
    speed: 43,
    type: ElementType.Water,
    secondType: null,
    image: '/images/monsters/squirtle.png',
    description: 'Squirtle is a Water-type Pokémon that uses its shell for defense and Water Gun for offense.',
    inspiration: 'Turtle', // Added inspiration
    attack1: {
      name: 'Tackle',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 10,
      powerPoints: 35,
      accuracy: 0.95,
    },
    attack2: {
      name: 'Water Gun',
      type: ElementType.Water,
      isPhysical: false,
      damage: 20,
      powerPoints: 25,
      accuracy: 0.9,
    },
  },
  {
    name: 'Eevee',
    trainer: 'Brock',
    trainerImage: '/images/gymleaders/brock.png', // Added trainer image
    hp: 55,
    attack: 55,
    defense: 50,
    specialAttack: 45,
    specialDefense: 65,
    speed: 55,
    type: ElementType.Normal,
    secondType: null,
    image: '/images/monsters/eevee.png',
    description: 'Eevee is a Normal-type Pokémon known for its adaptability and potential to evolve into various forms.',
    inspiration: 'Fox and Dog', // Added inspiration
    attack1: {
      name: 'Quick Attack',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 30,
      powerPoints: 10,
      accuracy: 1,
    },
    attack2: {
      name: 'Bite',
      type: ElementType.Dark,
      isPhysical: true,
      damage: 50,
      powerPoints: 4,
      accuracy: 0.8,
    },
  },
  {
    name: 'Jigglypuff',
    trainer: 'Whitney',
    trainerImage: '/images/gymleaders/whitney.jpg', // Added trainer image
    hp: 115,
    attack: 45,
    defense: 20,
    specialAttack: 45,
    specialDefense: 25,
    speed: 20,
    type: ElementType.Normal,
    secondType: ElementType.Fairy,
    image: '/images/monsters/jigglypuff.jpg',
    description: 'Jigglypuff is a Normal/Fairy-type Pokémon that uses its singing ability to put opponents to sleep.',
    inspiration: 'Balloon', // Added inspiration
    attack1: {
      name: 'Pound',
      type: ElementType.Normal,
      isPhysical: true,
      damage: 30,
      powerPoints: 10,
      accuracy: 1,
    },
    attack2: {
      name: 'Sing',
      type: ElementType.Fairy,
      isPhysical: false,
      damage: 50,
      powerPoints: 4,
      accuracy: 0.8,
    },
  },
  {
    name: 'Gengar',
    trainer: 'Morty',
    trainerImage: '/images/gymleaders/morty.jpg', // Added trainer image
    hp: 50,
    attack: 65,
    defense: 60,
    specialAttack: 130,
    specialDefense: 75,
    speed: 110,
    type: ElementType.Ghost,
    secondType: ElementType.Ground,
    image: '/images/monsters/gengar.png',
    attack1: {
      name: 'Shadow Ball',
      damage: 50,
      type: ElementType.Ghost,
      isPhysical: false,
      powerPoints: 10,
      accuracy: 1,
    },
    attack2: {
      name: 'Earthquake',
      damage: 50,
      type: ElementType.Ground,
      isPhysical: false,
      powerPoints: 10,
      accuracy: 1,
    },
    description: null,
    inspiration: '',
  },
];