import { gymLeaders, type GymLeader } from "../../gymleaders";

export const gymLeadersExtendedUniverse: GymLeader[] = [
  {
    id: 'south-caro-4b1a-4321-000000000001',
    name: "Seb",
    image: "/images/gymleaders/",
    environmentImage: "/images/perulandscape/",
    biome: "",
  },
  {
    name: "Logan",
    id: 'south-caro-4b1a-4321-000000000002',
    image: "/images/gymleaders/",
    environmentImage: "/images/perulandscape/",
    biome: "",
  },
];

export const getExtendedUniverseGymLeaders = (): GymLeader[] => {
  return [...gymLeadersExtendedUniverse, ...gymLeaders];
}