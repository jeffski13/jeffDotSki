import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent";
import InfoPageContainer from "../Pokeperu/info/InfoPage";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Info" },
    { name: "PokePeru Info", content: "Details on the poke peru project" },
  ];
}

const Content = JeffSkiPageWithContent(() => <InfoPageContainer />);

export default function PokePeruGymLeaders() {
  return <Content />;
}