import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../infra/JeffSkiPageWithContent"
import HomePage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jeff Szcinski" },
    { name: "Home Page", content: "Jeff Szcinski Personal Website" },
  ];
}

const Content = JeffSkiPageWithContent(HomePage);
export default function JeffskiHome() {
  return <Content />;
}
