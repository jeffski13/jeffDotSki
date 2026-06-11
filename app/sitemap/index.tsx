import { Container, Col, Row } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import './styles.css';

export function Sitemap() {
  return (
    <div className="sitemapWrapper">
      <Container>
        <Row className="show-grid">
          <Col sm={2} md={3}></Col>
          <Col sm={8} md={6}>
            <div className="sitemapTitle">Sitemap</div>
          </Col>
          <Col sm={2} md={3}></Col>
        </Row>

        <Row className="show-grid sitemapContent">
          <Col sm={1} md={2}></Col>
          <Col sm={10} md={8}>
            
            <div className="sitemapSection">
              <h2 className="sitemapSectionTitle">Teaching</h2>
              <ul className="sitemapList">
                <li>
                  <a href={ROUTES.external.resume.teacherEnglish} target="_blank" rel="noopener noreferrer">
                    English Teacher Resume
                  </a>
                </li>
                <li>
                  <a href={ROUTES.aboutMe.teacherPortfolio}>
                    English Teacher Portfolio
                  </a>
                </li>
                <li>
                  <a href={ROUTES.pokePeru.battle}>
                    Pokemon In Peru
                  </a>
                </li>
              </ul>
            </div>

            <div className="sitemapSection">
              <h2 className="sitemapSectionTitle">Software Engineering</h2>
              <ul className="sitemapList">
                <li>
                  <a href={ROUTES.aboutMe.techPortfolio}>
                    Software Engineering Portfolio
                  </a>
                </li>
                <li>
                  <a href={ROUTES.external.resume.softwareEngineer} target="_blank" rel="noopener noreferrer">
                    Software Engineer Resume
                  </a>
                </li>
              </ul>
            </div>

            <div className="sitemapSection">
              <h2 className="sitemapSectionTitle">Hobbies</h2>
              <ul className="sitemapList">
                <li>
                  <a href={ROUTES.aboutMe.drawing}>
                    Drawings
                  </a>
                </li>
                <li>
                  <a href={ROUTES.aboutMe.tvShows}>
                    Travel
                  </a>
                </li>
              </ul>
            </div>

            <div className="sitemapSection">
              <h2 className="sitemapSectionTitle">About Me</h2>
              <ul className="sitemapList">
                <li>
                  <a href={ROUTES.aboutMe.bio}>
                    Bio
                  </a>
                </li>
                <li>
                  <a href={ROUTES.aboutMe.tvShows}>
                    TV Shows
                  </a>
                </li>
              </ul>
            </div>

            <div className="sitemapSection">
              <h2 className="sitemapSectionTitle">Japanese</h2>
              <ul className="sitemapList">
                <li>
                  <a href={ROUTES.practiceNihongo}>
                    Current Song
                  </a>
                </li>
                <li>
                  <a href={ROUTES.readingsNihonDe}>
                    Bible In Japanese
                  </a>
                </li>
              </ul>
            </div>

          </Col>
          <Col sm={1} md={2}></Col>
        </Row>
      </Container>
    </div>
  );
}
