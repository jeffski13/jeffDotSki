import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent"
import Drawings from "../AboutMe/Hobbies/drawings";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Drawings" },
    { name: "Drawings Web Page", content: "The Drawings of Jeff Szcinski" },
  ];
}

const Content = JeffSkiPageWithContent(Drawings);
export default function AboutMeDrawings() {
  return <Content />;
}
