// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import QrRedirectPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "リダイレクト中 | Redirecting" },
    { name: "Lyrics Redirect", content: "Redirects to the lyrics for the current song." },
  ];
}

const Content = JeffSkiPageWithContent(QrRedirectPage);
export default function QrRedirectRoute() {
  return <Content />;
}
