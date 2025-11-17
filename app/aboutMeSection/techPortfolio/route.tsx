import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../../infra/JeffSkiPageWithContent"
import TechPortfolio from ".";
import { locationProviderImpl } from "../PortfolioProps";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Tech Portfolio" },
    { name: "Tech Portfolio", content: "Jeff's Developer Experience" },
  ];
}

const Content = JeffSkiPageWithContent(TechPortfolio);
export default function AboutMeTechPortfolio() {
  return (<Content locationProvider={locationProviderImpl}   />);
}
