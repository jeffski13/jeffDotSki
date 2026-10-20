// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import WordsToLearnPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "単語 | Words To Learn" },
    { name: "Words To Learn", content: "Japanese words I'm learning and want to learn." },
  ];
}

const Content = JeffSkiPageWithContent(WordsToLearnPage);
export default function WordsToLearnRoute() {
  return <Content />;
}
