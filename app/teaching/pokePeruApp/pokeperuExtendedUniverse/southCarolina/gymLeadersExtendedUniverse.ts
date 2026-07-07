import { gymLeaders, type GymLeader } from "../../gymleaders";

export const gymLeadersExtendedUniverse: GymLeader[] = [
  {
    id: 'south-caro-4b1a-4321-000000000001',
    name: "Seb",
    image: "/images/extendedUniverse/southCarolina/gymleaders/",
    environmentImage: "/images/landscape/",
    biome: "",
  },
  {
    name: "Logan",
    id: 'south-caro-4b1a-4321-000000000002',
    image: "/images/gymleaders/",
    environmentImage: "/images/extendedUniverse/southCarolina/gymleaders/",
    biome: "",
  },
];

export const getExtendedUniverseGymLeaders = (): GymLeader[] => {
  return [...gymLeadersExtendedUniverse, ...gymLeaders];
}