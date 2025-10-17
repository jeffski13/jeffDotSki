import type { Route } from "../../../../routes/+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import PokePeruExtendedUniverse from "../PokePeruExtendedUniverse";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Battle" },
    { name: "PokePeru Extended Universe", content: "Extended Universe Battle" },
  ];
}

const Content = JeffSkiPageWithContent(PokePeruExtendedUniverse);
export default function PokePeruBattle() {
  return <Content />;
}
