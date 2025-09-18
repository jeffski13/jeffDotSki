import JeffSkiPageWithContent from "~/Inf/JeffSkiPageWithContent";
import type { Route } from "./+types/home";

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
