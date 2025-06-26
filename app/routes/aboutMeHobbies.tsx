import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../Inf/JeffSkiPageWithContent"
import Hobbies from "../AboutMe/Hobbies";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Hobbies" },
    { name: "Hobbies Web Page", content: "The hobbies of Jeff Szcinski" },
  ];
}

const Content = JeffSkiPageWithContent(Hobbies);
export default function AboutMeHobbies() {
  return <Content />;
}
