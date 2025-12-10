import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../infra/JeffSkiPageWithContent"
import TailwindsTest from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jeff Szcinski" },
    { name: "TW Page", content: "Jeff Szcinski Personal Website" },
  ];
}

const Content = JeffSkiPageWithContent(TailwindsTest);
export default function Page() {
  return <Content />;
}
