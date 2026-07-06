// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../infra/JeffSkiPageWithContent"
import CurrentPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Practice Nihongo" },
    { name: "Practice Nihongo", content: "Practice Nihongo" },
  ];
}

const Content = JeffSkiPageWithContent(CurrentPage);
export default function JeffskiHome() {
  return <Content />;
}
