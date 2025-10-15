import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../inf/JeffSkiPageWithContent"
import TitlePage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jeff Szcinski" },
    { name: "Home Page", content: "Jeff Szcinski Personal Website" },
  ];
}

const Content = JeffSkiPageWithContent(TitlePage);
export default function JeffskiHome() {
  return <Content />;
}
