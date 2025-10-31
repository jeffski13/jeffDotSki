import './styles.css';
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";

interface X {
}

export default function TechPortfolio() {
  const multiLangContent: MultiLangContent = {
    es: {
    },
    default: {
    }
  }

  const content = getContentByLanguage(multiLangContent, getBrowserLanguage())

  return (
    <div className="techPortfolio" >
      
      <FooterBar />
    </div>
  );
}