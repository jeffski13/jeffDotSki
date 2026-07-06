// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../infra/JeffSkiPageWithContent"
import SitemapContainer from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sitemap - Jeff.Ski" },
    { name: "description", content: "Sitemap for Jeff.Ski website" },
  ];
}

const Content = JeffSkiPageWithContent(SitemapContainer);
export default function SitemapPage() {
  return <Content />;
}
