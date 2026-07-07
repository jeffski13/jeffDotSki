import { useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '~/infra/langSupport/langSupport';
import { locationProviderImpl, type PortfolioProps } from '~/infra/portfolio/PortfolioProps';
import AnchorLink, { navigateToAnchor } from '~/infra/anchor/AnchorLink';
import './styles.css';
import {es as esTitles, defaultText as defaultTextTitles} from '../infra/NavigationBar';

export interface SitemapSection {
  title: string;
  anchorId: string;
  links: Array<{
    text: string;
    url: string;
    external?: boolean;
  }>;
}

export interface ContentPerLanguage {
  pageTitle: string;
  sections: SitemapSection[];
}

const es: ContentPerLanguage = {
  pageTitle: 'Todos Los Enlaces',
  sections: [
    {
      title: esTitles.teaching,
      anchorId: 'English-Teacher',
      links: [
        { text: esTitles.teachingResume, url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: esTitles.teachingPortfolio, url: ROUTES.teacherPortfolio },
        { text: esTitles.teachingPokePeru, url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: esTitles.softwareEngineering,
      anchorId: 'Software-Engineering',
      links: [
        { text: esTitles.softwareEngineeringPortfolio, url: ROUTES.techPortfolio },
        { text: esTitles.softwareEngineerResume, url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: esTitles.japanese,
      anchorId: 'Japanese-Studies',
      links: [
        { text: esTitles.japaneseMusicCovers, url: ROUTES.japanese.japaneseMusicCovers },
        { text: esTitles.japaneseBible, url: ROUTES.japanese.japaneseReadings },
        { text: esTitles.japaneseCurrentSong, url: ROUTES.japanese.japanesePracticeLyrics },
        { text: esTitles.japaneseParenthesesToFurigana, url: ROUTES.japanese.japaneseParenthesesToFurigana },
      ]
    },
    {
      title: esTitles.aboutMe,
      anchorId: 'About-Me',
      links: [
        { text: esTitles.aboutBio, url: ROUTES.aboutMe.bio },
        { text: esTitles.aboutTvShows, url: ROUTES.aboutMe.tvShows },
        { text: esTitles.aboutDrawing, url: ROUTES.aboutMe.drawing },
        { text: esTitles.aboutTravel, url: ROUTES.aboutMe.tvShows },
      ]
    },
  ]
};

const defaultText: ContentPerLanguage = {
  pageTitle: 'All Links',
  sections: [
    {
      title: defaultTextTitles.teaching,
      anchorId: 'English-Teacher',
      links: [
        { text: defaultTextTitles.teachingResume, url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: defaultTextTitles.teachingPortfolio, url: ROUTES.teacherPortfolio },
        { text: defaultTextTitles.teachingPokePeru, url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: defaultTextTitles.softwareEngineering,
      anchorId: 'Software-Engineering',
      links: [
        { text: defaultTextTitles.softwareEngineeringPortfolio, url: ROUTES.techPortfolio },
        { text: defaultTextTitles.softwareEngineerResume, url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: defaultTextTitles.japanese,
      anchorId: 'Japanese-Studies',
      links: [
        { text: defaultTextTitles.japaneseMusicCovers, url: ROUTES.japanese.japaneseMusicCovers },
        { text: defaultTextTitles.japaneseBible, url: ROUTES.japanese.japaneseReadings },
        { text: defaultTextTitles.japaneseCurrentSong, url: ROUTES.japanese.japanesePracticeLyrics },
        { text: defaultTextTitles.japaneseParenthesesToFurigana, url: ROUTES.japanese.japaneseParenthesesToFurigana },
      ]
    },
    {
      title: defaultTextTitles.aboutMe,
      anchorId: 'About-Me',
      links: [
        { text: defaultTextTitles.aboutBio, url: ROUTES.aboutMe.bio },
        { text: defaultTextTitles.aboutTvShows, url: ROUTES.aboutMe.tvShows },
        { text: defaultTextTitles.aboutDrawing, url: ROUTES.aboutMe.drawing },
        { text: defaultTextTitles.aboutTravel, url: ROUTES.aboutMe.tvShows },
      ]
    },
  ]
};

export const multiLangContent: MultiLangContent = {
  es,
  default: defaultText
};

export default function SitemapContainer() {
  return <Sitemap locationProvider={locationProviderImpl} />;
}

export function Sitemap({ locationProvider }: PortfolioProps) {
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
  const location = locationProvider.useLocation();

  useEffect(() => {
    navigateToAnchor(location?.hash);
  }, [location?.hash]);

  return (
    <div className="sitemapWrapper">
      <Container>
        <Row className="show-grid">
          <Col sm={2} md={3}></Col>
          <Col sm={8} md={6}>
            <div className="sitemapTitle">{content.pageTitle}</div>
          </Col>
          <Col sm={2} md={3}></Col>
        </Row>

        <Row className="show-grid sitemapContent">
          <Col sm={1} md={2}></Col>
          <Col sm={10} md={8}>

            {content.sections.map((section: SitemapSection, index: number) => (
              <div key={index} id={section.anchorId} className="sitemapSection">
                <h2 className="sitemapSectionTitle">{section.title}<AnchorLink targetId={section.anchorId} /></h2>
                <ul className="sitemapList">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </Col>
          <Col sm={1} md={2}></Col>
        </Row>
      </Container>
    </div>
  );
}
