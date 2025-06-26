import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent"
import Pokedex from "../Pokeperu/pokedex/Pokedex";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Pokedex" },
    { name: "Pokemon in Peru Pokedex", content: "Pokemon in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(Pokedex);
export default function PokePeruPokedex() {
  return <Content />;
}
