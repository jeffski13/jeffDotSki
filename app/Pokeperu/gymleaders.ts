export interface GymLeader {
  name: string;
  image: string;
  environmentImage: string;
  biome: string;
}

export const gymLeaders: GymLeader[] = [
  {
    name: "Lily",
    image: "/images/gymleaders/trainersquad1.png",
    environmentImage: "/images/perulandscape/peru-1.jpg",
    biome: "Countryside",
  },
  {
    name: "Monty",
    image: "/images/gymleaders/trainersquad2.png",
    environmentImage: "/images/perulandscape/peru-2.jpg",
    biome: "Mountains",
  },
  {
    name: "Inty",
    image: "/images/gymleaders/trainersquad3.png",
    environmentImage: "/images/perulandscape/peru-3.jpg",
    biome: "Inca Ruins",
  },
  {
    name: "Ainbo",
    image: "/images/gymleaders/trainersquad4.png",
    environmentImage: "/images/perulandscape/peru-4.jpg",
    biome: "Jungle",
  },
  {
    name: "Bababoy",
    image: "/images/gymleaders/trainersquad5.png",
    environmentImage: "/images/perulandscape/peru-5.jpg",
    biome: "Coast",
  },
  {
    name: "Alex",
    image: "/images/gymleaders/trainersquad6.png",
    environmentImage: "/images/perulandscape/peru-6.jpg",
    biome: "Desert",
  },
];