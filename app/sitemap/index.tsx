import { Container, Col, Row } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '~/langSupport';
import './styles.css';

export interface SitemapSection {
  title: string;
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
      title: 'Profesor de Inglés',
      links: [
        { text: 'Currículum de Profesor de Inglés', url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: 'Portafolio de Profesor de Inglés', url: ROUTES.aboutMe.teacherPortfolio },
        { text: 'Pokemon En Perú', url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: 'Ingeniería de Software',
      links: [
        { text: 'Portafolio de Ingeniería de Software', url: ROUTES.aboutMe.techPortfolio },
        { text: 'Currículum de Ingeniero de Software', url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: 'Estudios de Japonés',
      links: [
        { text: 'Canción Actual', url: ROUTES.practiceNihongo },
        { text: 'Biblia en Japonés', url: ROUTES.readingsNihonDe },
      ]
    },
    {
      title: 'Sobre Mí',
      links: [
        { text: 'Biografía', url: ROUTES.aboutMe.bio },
        { text: 'Programas de Televisión', url: ROUTES.aboutMe.tvShows },
        { text: 'Dibujos', url: ROUTES.aboutMe.drawing },
        { text: 'Viajes', url: ROUTES.aboutMe.tvShows },
      ]
    },
  ]
};

const defaultText: ContentPerLanguage = {
  pageTitle: 'All Links',
  sections: [
    {
      title: 'English Teacher',
      links: [
        { text: 'English Teacher Resume', url: ROUTES.external.resume.teacherEnglish, external: true },
        { text: 'English Teacher Portfolio', url: ROUTES.aboutMe.teacherPortfolio },
        { text: 'Pokémon In Peru', url: ROUTES.pokePeru.battle },
      ]
    },
    {
      title: 'Software Engineering',
      links: [
        { text: 'Software Engineering Portfolio', url: ROUTES.aboutMe.techPortfolio },
        { text: 'Software Engineer Resume', url: ROUTES.external.resume.softwareEngineer, external: true },
      ]
    },
    {
      title: 'Japanese Studies',
      links: [
        { text: 'Learning With Songs', url: ROUTES.practiceNihongo },
        { text: 'Bible In Japanese', url: ROUTES.readingsNihonDe },
      ]
    },
    {
      title: 'About Me',
      links: [
        { text: 'Bio', url: ROUTES.aboutMe.bio },
        { text: 'TV Shows', url: ROUTES.aboutMe.tvShows },
        { text: 'Drawings', url: ROUTES.aboutMe.drawing },
        { text: 'Travel', url: ROUTES.aboutMe.tvShows },
      ]
    },
  ]
};

export const multiLangContent: MultiLangContent = {
  es,
  default: defaultText
};

export function Sitemap() {
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());

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
              <div key={index} className="sitemapSection">
                <h2 className="sitemapSectionTitle">{section.title}</h2>
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
