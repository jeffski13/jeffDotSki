import type { Route } from "./+types/home";
import PokePeru from "..";
import JeffSkiPageWithContent from "~/inf/JeffSkiPageWithContent";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PokePeru Battle" },
    { name: "Pocket Monsters in Peru Battle", content: "Pokebattle in Peru" },
  ];
}

const Content = JeffSkiPageWithContent(PokePeru);
export default function PokePeruBattle() {
  return <Content />;
}
