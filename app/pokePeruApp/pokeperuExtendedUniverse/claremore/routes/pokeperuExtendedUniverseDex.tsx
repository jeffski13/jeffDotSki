import type { Route } from "../../../../routes/+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import { PokedexExtendedUniverseContainer } from "../PokePeruExtendedUniverse";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Pokedex" },
    { name: "Mons in Peru Pokedex", content: "Mons in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(PokedexExtendedUniverseContainer);
export default function PokePeruPokedex() {
  return <Content />;
}
