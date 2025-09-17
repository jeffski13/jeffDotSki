import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent";
import {GymLeaderListContainer} from "../Pokeperu/pokeperuExtendedUniverse/PokePeruClaremore";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Gym Leaders" },
    { name: "Gym Leaders in Peru", content: "Gym Leaders in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(() => <GymLeaderListContainer />);

export default function PokePeruGymLeaders() {
  return <Content />;
}