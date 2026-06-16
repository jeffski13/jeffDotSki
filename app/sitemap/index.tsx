import { useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '~/langSupport';
import { locationProviderImpl, type PortfolioProps } from '~/aboutMeSection/PortfolioProps';
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
        { text: esTitles.englishTeacherResume, url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: esTitles.englishTeacherPortfolio, url: ROUTES.aboutMe.teacherPortfolio },
        { text: esTitles.pokePeru, url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: esTitles.softwareEngineering,
      anchorId: 'Software-Engineering',
      links: [
        { text: esTitles.softwareEngineeringPortfolio, url: ROUTES.aboutMe.techPortfolio },
        { text: esTitles.softwareEngineerResume, url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: esTitles.japaneseStudies,
      anchorId: 'Japanese-Studies',
      links: [
        { text: esTitles.japaneseMusicCovers, url: ROUTES.japaneseMusicCovers },
        { text: esTitles.bibleInJapanese, url: ROUTES.readingsNihonDe },
        { text: esTitles.japaneseCurrentSong, url: ROUTES.practiceNihongoLyrics },
      ]
    },
    {
      title: esTitles.aboutMe,
      anchorId: 'About-Me',
      links: [
        { text: esTitles.bio, url: ROUTES.aboutMe.bio },
        { text: esTitles.tvShows, url: ROUTES.aboutMe.tvShows },
        { text: esTitles.drawing, url: ROUTES.aboutMe.drawing },
        { text: esTitles.travel, url: ROUTES.aboutMe.tvShows },
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
        { text: defaultTextTitles.englishTeacherResume, url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: defaultTextTitles.englishTeacherPortfolio, url: ROUTES.aboutMe.teacherPortfolio },
        { text: defaultTextTitles.pokePeru, url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: defaultTextTitles.softwareEngineering,
      anchorId: 'Software-Engineering',
      links: [
        { text: defaultTextTitles.softwareEngineeringPortfolio, url: ROUTES.aboutMe.techPortfolio },
        { text: defaultTextTitles.softwareEngineerResume, url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: defaultTextTitles.japaneseStudies,
      anchorId: 'Japanese-Studies',
      links: [
        { text: defaultTextTitles.japaneseMusicCovers, url: ROUTES.japaneseMusicCovers },
        { text: defaultTextTitles.bibleInJapanese, url: ROUTES.readingsNihonDe },
        { text: defaultTextTitles.japaneseCurrentSong, url: ROUTES.practiceNihongoLyrics },
      ]
    },
    {
      title: defaultTextTitles.aboutMe,
      anchorId: 'About-Me',
      links: [
        { text: defaultTextTitles.bio, url: ROUTES.aboutMe.bio },
        { text: defaultTextTitles.tvShows, url: ROUTES.aboutMe.tvShows },
        { text: defaultTextTitles.drawing, url: ROUTES.aboutMe.drawing },
        { text: defaultTextTitles.travel, url: ROUTES.aboutMe.tvShows },
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
