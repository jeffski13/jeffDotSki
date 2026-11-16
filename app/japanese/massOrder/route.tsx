// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../../infra/JeffSkiPageWithContent"
import CurrentPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ミサの式次第 | Order of Mass" },
    { name: "Order of Mass", content: "The Catholic Order of Mass in Japanese (with furigana) and English, side by side." },
  ];
}

const Content = JeffSkiPageWithContent(CurrentPage);
export default function MassOrderRoute() {
  return <Content />;
}
