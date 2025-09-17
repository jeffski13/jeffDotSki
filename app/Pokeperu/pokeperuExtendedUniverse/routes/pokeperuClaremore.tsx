import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";
import type { Route } from "../../../routes/+types/home";
import PokePeruClaremore from "../PokePeruClaremore";

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
