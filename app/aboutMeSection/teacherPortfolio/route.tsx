import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "../../infra/JeffSkiPageWithContent"
import TeacherPortfolio from ".";
import { locationProviderImpl } from "../PortfolioProps";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Teacher Portfolio" },
    { name: "Teacher Portfolio", content: "Jeff's Teaching Experience" },
  ];
}

const Content = JeffSkiPageWithContent(TeacherPortfolio);
export default function AboutMeTeacherPortfolio() {
  return (<Content locationProvider={locationProviderImpl}   />);
}
