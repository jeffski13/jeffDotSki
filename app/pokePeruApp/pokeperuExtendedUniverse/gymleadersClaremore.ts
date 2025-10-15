import { gymLeaders, type GymLeader } from "../gymleaders";

export const gymLeadersClaremore: GymLeader[] = [
  {
    id: 'c1a303-1234-4b1a-4321-000000000001',
    name: "???",
    image: "/images/gymleaders/trainersquad01.png",
    environmentImage: "/images/perulandscape/peru-9.jpg",
    biome: "Mordor",
  },
  {
    name: "Jim",
    id: 'c1a303-1234-4b1a-4321-000000000002',
    image: "/images/gymleaders/trainersquad02.png",
    environmentImage: "/images/perulandscape/peru-10.jpg",
    biome: "Nether",
  },
  {
    name: "Tom",
    id: 'c1a303-1234-4b1a-4321-000000000003',
    image: "/images/gymleaders/trainersquad03.png",
    environmentImage: "/images/perulandscape/peru-11.jpg",
    biome: "Forest",
  },
  {
    name: "Jimbobjoe",
    id: 'c1a303-1234-4b1a-4321-000000000004',
    image: "/images/gymleaders/trainersquad04.png",
    environmentImage: "/images/perulandscape/peru-12.jpg",
    biome: "67 land",
  },
];

export const getClaremoreGymLeaders = (): GymLeader[] => {
  return [...gymLeadersClaremore, ...gymLeaders];
}