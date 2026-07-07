// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../../infra/JeffSkiPageWithContent"
import TeacherPortfolio from ".";
import { locationProviderImpl } from "../../infra/portfolio/PortfolioProps";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Teacher Portfolio" },
    { name: "Teacher Portfolio", content: "Jeff's Teaching Experience" },
  ];
}

const Content = JeffSkiPageWithContent(TeacherPortfolio);
export default function AboutMeTeacherPortfolio() {
  // @ts-ignore
  return (<Content locationProvider={locationProviderImpl}   />);
}
