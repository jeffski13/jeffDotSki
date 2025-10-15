import JeffSkiPageWithContent from "~/inf/JeffSkiPageWithContent";
import type { Route } from "./+types/home";
import Drawings from ".";

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
