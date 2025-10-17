import type { Route } from "../../../../routes/+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import { GymLeaderListExtendedUniverseContainer } from "../PokePeruExtendedUniverse";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Gym Leaders" },
    { name: "Gym Leaders in Peru", content: "Gym Leaders in Peru" },
  ];
}
const Content = JeffSkiPageWithContent(() => <GymLeaderListExtendedUniverseContainer />);

export default function PokePeruGymLeaders() {
  return <Content />;
}