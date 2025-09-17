import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";
import type { Route } from "../../../routes/+types/home";
import { GymLeaderListClaremoreContainer } from "../PokePeruClaremore";

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