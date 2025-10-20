import { gymLeaders, type GymLeader } from "../../gymleaders";

export const gymLeadersExtendedUniverse: GymLeader[] = [
  {
    id: 'c1a303-1234-4b1a-4321-000000000001',
    name: "???",
    image: "/images/extendedUniverse/claremore/gymleaders/trainersquad01.png",
    environmentImage: "/images/extendedUniverse/claremore/landscape/claremore-9.jpg",
    biome: "Mordor",
  },
  {
    name: "Jim",
    id: 'c1a303-1234-4b1a-4321-000000000002',
    image: "/images/extendedUniverse/claremore/gymleaders/trainersquad02.png",
    environmentImage: "/images/extendedUniverse/claremore/landscape/claremore-10.jpg",
    biome: "Nether",
  },
  {
    name: "Tom",
    id: 'c1a303-1234-4b1a-4321-000000000003',
    image: "/images/extendedUniverse/claremore/gymleaders/trainersquad03.png",
    environmentImage: "/images/extendedUniverse/claremore/landscape/claremore-11.jpg",
    biome: "Forest",
  },
];

export const getExtendedUniverseGymLeaders = (): GymLeader[] => {
  return [...gymLeadersExtendedUniverse, ...gymLeaders];
}