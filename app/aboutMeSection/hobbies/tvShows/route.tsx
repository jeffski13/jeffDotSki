// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import TvShows from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "TvShows" },
    { name: "TvShows Web Page", content: "The TvShows of Jeff Szcinski" },
  ];
}

const Content = JeffSkiPageWithContent(TvShows);
export default function AboutMeTvShows() {
  return <Content />;
}
