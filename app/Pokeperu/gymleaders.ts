import type { Monster } from "./monsters";

export interface GymLeader {
  id: string;
  name: string;
  image: string;
  environmentImage: string;
  biome: string;
  monsters: string[];
}

export const gymLeaders: GymLeader[] = [
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000001',
    name: "Lily",
    image: "/images/gymleaders/trainersquad1.png",
    environmentImage: "/images/perulandscape/peru-1.jpg",
    biome: "Countryside",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-000000000001', 'b7e1e7c2-1a1a-4b1a-8e1a-000000000002']
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000002',
    name: "Monty",
    image: "/images/gymleaders/trainersquad2.png",
    environmentImage: "/images/perulandscape/peru-2.jpg",
    biome: "Mountains",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-000000000003', 'b7e1e7c2-1a1a-4b1a-8e1a-000000000004'],
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000003',
    name: "Inty",
    image: "/images/gymleaders/trainersquad3.png",
    environmentImage: "/images/perulandscape/peru-3.jpg",
    biome: "Inca Ruins",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-000000000005', 'b7e1e7c2-1a1a-4b1a-8e1a-000000000006'],
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000004',
    name: "Ainbo",
    image: "/images/gymleaders/trainersquad4.png",
    environmentImage: "/images/perulandscape/peru-4.jpg",
    biome: "Jungle",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-000000000007', 'b7e1e7c2-1a1a-4b1a-8e1a-000000000008'],
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000005',
    name: "Bababoy",
    image: "/images/gymleaders/trainersquad5.png",
    environmentImage: "/images/perulandscape/peru-5.jpg",
    biome: "Coast",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-000000000009', 'b7e1e7c2-1a1a-4b1a-8e1a-00000000000a'],
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000006',
    name: "Alex",
    image: "/images/gymleaders/trainersquad6.png",
    environmentImage: "/images/perulandscape/peru-6.jpg",
    biome: "Desert",
    monsters: ['b7e1e7c2-1a1a-4b1a-8e1a-00000000000b', 'b7e1e7c2-1a1a-4b1a-8e1a-00000000000c'],
  },
];