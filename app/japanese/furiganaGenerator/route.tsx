// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import FuriganaGeneratorPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ふりがなジェネレーター | Furigana Generator" },
    { name: "Furigana Generator", content: "Generate furigana for Japanese text." },
  ];
}

const Content = JeffSkiPageWithContent(FuriganaGeneratorPage);
export default function FuriganaGeneratorRoute() {
  return <Content />;
}
