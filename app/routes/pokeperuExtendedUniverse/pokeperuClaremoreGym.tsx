import type { Route } from "../+types/home";
import { GymLeaderListClaremoreContainer } from "~/Pokeperu/pokeperuExtendedUniverse/PokePeruClaremore";
import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Gym Leaders" },
    { name: "Gym Leaders in Peru", content: "Gym Leaders in Peru" },
  ];
}
const Content = JeffSkiPageWithContent(() => <GymLeaderListClaremoreContainer />);

export default function PokePeruGymLeaders() {
  return <Content />;
}