import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../infra/JeffSkiPageWithContent"
import { Sitemap } from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sitemap - Jeff.Ski" },
    { name: "description", content: "Sitemap for Jeff.Ski website" },
  ];
}

const Content = JeffSkiPageWithContent(Sitemap);
export default function SitemapPage() {
  return <Content />;
}
