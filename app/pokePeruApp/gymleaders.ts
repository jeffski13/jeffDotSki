import type { Monster } from "./monsters";

export interface GymLeader {
  id: string;
  name: string;
  image: string;
  environmentImage: string;
  biome: string;
}

export const gymLeaders: GymLeader[] = [
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000001',
    name: "Lily",
    image: "/images/gymleaders/trainersquad1.png",
    environmentImage: "/images/perulandscape/peru-1.jpg",
    biome: "Countryside",
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000002',
    name: "Monty",
    image: "/images/gymleaders/trainersquad2.png",
    environmentImage: "/images/perulandscape/peru-2.jpg",
    biome: "Mountains",
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000003',
    name: "Inty",
    image: "/images/gymleaders/trainersquad3.png",
    environmentImage: "/images/perulandscape/peru-3.jpg",
    biome: "Inca Ruins",
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000004',
    name: "Ainbo",
    image: "/images/gymleaders/trainersquad4.png",
    environmentImage: "/images/perulandscape/peru-4.jpg",
    biome: "Jungle",
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000005',
    name: "Bababoy",
    image: "/images/gymleaders/trainersquad5.png",
    environmentImage: "/images/perulandscape/peru-5.jpg",
    biome: "Coast",
  },
  {
    id: 'abcde7c2-1234-4b1a-4321-000000000006',
    name: "Alex",
    image: "/images/gymleaders/trainersquad6.png",
    environmentImage: "/images/perulandscape/peru-6.jpg",
    biome: "Desert",
  },
];