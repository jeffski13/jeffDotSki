import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent";
import GymLeaderListContainer from "../Pokeperu/gym/GymLeaderList";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Gym Leaders" },
    { name: "Pokemon Gym Leaders in Peru", content: "Pokemon Gym Leaders in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(() => <GymLeaderListContainer />);

export default function PokePeruGymLeaders() {
  return <Content />;
}