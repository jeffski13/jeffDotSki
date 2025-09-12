import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent"
import PokePeruClaremore from "../Pokeperu/pokeperuExtendedUniverse/PokePeruClaremore";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Battle" },
    { name: "Pokemon in Claremore Battle", content: "Pokebattle in Claremore" },
  ];
}

const Content = JeffSkiPageWithContent(PokePeruClaremore);
export default function PokePeruBattle() {
  return <Content />;
}
