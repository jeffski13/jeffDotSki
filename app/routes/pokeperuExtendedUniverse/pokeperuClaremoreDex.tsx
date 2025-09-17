import type { Route } from "../+types/home";
import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";
import { PokedexClaremoreContainer } from "~/Pokeperu/pokeperuExtendedUniverse/PokePeruClaremore";

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
