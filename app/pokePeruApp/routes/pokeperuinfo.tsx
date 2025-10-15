import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import InfoPageContainer from "../info/InfoPage";

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