// @ts-ignore
import type { Route } from "./+types/home";
import JeffSkiPageWithContent from "~/infra/JeffSkiPageWithContent";
import WordsToLearnPage from ".";
import { useViewportFitCover } from "./useViewportFitCover";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "単語 | Words To Learn" },
    { name: "Words To Learn", content: "Japanese words I'm learning and want to learn." },
    // iPhone "Add to Home Screen": open full screen with its own name, and let the
    // (always dark) navbar show through a translucent status bar
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-title", content: "単語" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "theme-color", content: "#212529" },
  ];
}

export function links() {
  return [
    { rel: "manifest", href: "/wordsToLearn.webmanifest" },
    { rel: "apple-touch-icon", href: "/images/wordsToLearn/icon-180.png" },
  ];
}

const Content = JeffSkiPageWithContent(WordsToLearnPage);
export default function WordsToLearnRoute() {
  useViewportFitCover();
  return <Content />;
}
