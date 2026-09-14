// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import QrLinkPage from ".";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "QRコード | Lyrics QR Code" },
    { name: "Lyrics QR Code", content: "QR code linking to the lyrics for the current song." },
  ];
}

const Content = JeffSkiPageWithContent(QrLinkPage);
export default function QrLinkRoute() {
  return <Content />;
}
