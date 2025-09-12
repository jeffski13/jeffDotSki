import { gymLeaders, type GymLeader } from "../gymleaders";

export const gymLeadersClaremore: GymLeader[] = [
  {
    name: "???",
    image: "/images/gymleaders/trainersquad01.png",
    environmentImage: "/images/perulandscape/peru-9.jpg",
    biome: "Mordor",
  },
  {
    name: "Jim",
    image: "/images/gymleaders/trainersquad02.png",
    environmentImage: "/images/perulandscape/peru-10.png",
    biome: "Nether",
  },
  {
    name: "Tom",
    image: "/images/gymleaders/trainersquad03.png",
    environmentImage: "/images/perulandscape/peru-11.jpg",
    biome: "Forest",
  },
];

export const getClaremoreGymLeaders = (): GymLeader[] => {
  return [...gymLeadersClaremore, ...gymLeaders];
}