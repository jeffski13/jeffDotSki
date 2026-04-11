import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import type { Route } from "./+types/home";
import ReadingsNihonDe from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "日本語で聖書 | Bible in Japanese" },
    { name: "Bible readings in Japanese", content: "Read Bible passages in Japanese (kanji and kana) alongside the English KJV." },
  ];
}

const Content = JeffSkiPageWithContent(ReadingsNihonDe);
export default function ReadingsNihonDeRoute() {
  return <Content />;
}
