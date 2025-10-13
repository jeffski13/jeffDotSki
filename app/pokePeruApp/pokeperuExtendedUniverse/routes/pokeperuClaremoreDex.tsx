import type { Route } from "../../../routes/+types/home";
import JeffSkiPageWithContent from "~/inf/JeffSkiPageWithContent";
import { PokedexClaremoreContainer } from "../PokePeruClaremore";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Pokedex" },
    { name: "Pokemon in Peru Pokedex", content: "Pokemon in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(PokedexClaremoreContainer);
export default function PokePeruPokedex() {
  return <Content />;
}
