import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent"
import Bio from "../AboutMe/Bio";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Bio" },
    { name: "Bio Web Page", content: "The story of Jeff Szcinski" },
  ];
}

const Content = JeffSkiPageWithContent(Bio);
export default function AboutMeBio() {
  return <Content />;
}
