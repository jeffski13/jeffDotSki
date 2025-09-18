import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";
import Pokedex from "../pokedex/Pokedex";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Pokedex" },
    { name: "Pocket Monsters in Peru Pokedex", content: "Pocket Monsters in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(Pokedex);
export default function PokePeruPokedex() {
  return <Content />;
}
