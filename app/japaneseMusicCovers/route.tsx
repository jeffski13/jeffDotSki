import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import type { Route } from "./+types/home";
import JapaneseMusicPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "日本語の音楽 | Japanese Music Covers" },
    { name: "Japanese Music Covers", content: "Jeff Szcinski's covers of Japanese songs." },
  ];
}

const Content = JeffSkiPageWithContent(JapaneseMusicPage);
export default function JapaneseMusicRoute() {
  return <Content />;
}
