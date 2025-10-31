import { Col, Container, Row } from 'react-bootstrap';
import './styles.css';
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";

export default function TechPortfolio() {
  const multiLangContent: MultiLangContent = {
    es: {
      heroTitle: 'Portafolio Tecnológico',
      heroText: 'Desarrollador de aplicaciones Android y sitios web con experiencia en redes, bluetooth, y pruebas automatizadas.',
      logosTitle: 'Empresas con las que he trabajado',
      tandemTitle: 'Trabajo en Tandem Diabetes Care',
      tandemText: 'En Tandem reescribí y transformé las capas de bluetooth y networking de la app Android. Implementé mocks del enlace del pump de insulina al app Android y simulé la capa de networking para pruebas y demos.',
      reelTitle: 'Imágenes (mock data y explicación)',
      passionTitle: 'Pasión por código de alta calidad',
      passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.'
    },
    default: {
      heroTitle: 'Tech Portfolio',
      heroText: 'Developer of Android apps and websites; experienced with networking, Bluetooth, and automated testing.',
      logosTitle: 'Who I\'ve worked with',
      tandemTitle: 'Work at Tandem Diabetes Care',
      tandemText: 'At Tandem I transformed the Bluetooth and networking layers of the Android app. I mocked the insulin pump Bluetooth connection to the Android app as well as the networking layer for testing and demos.',
      reelTitle: 'Images (mock data and explanation)',
      passionTitle: 'Passion for high-quality code',
      passionText: 'I transformed a codebase by introducing a high-coverage unit test suite. This web site you are viewing has a code coverage of 82%.'
    }
  };

  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const companies = [
    { name: 'Beardon Services', img: '/images/techPortfolio/companies/beardon.png' },
    { name: 'USAA', img: '/images/techPortfolio/companies/usaa.png' },
    { name: 'Availity', img: '/images/techPortfolio/companies/availity.png' },
    { name: 'Boeing', img: '/images/techPortfolio/companies/boeing.png' },
    { name: 'Tandem Diabetes Care', img: '/images/techPortfolio/companies/tandem.png' },
    { name: 'Colegio Santa Margarita', img: '/images/techPortfolio/companies/santaMargarita.png' },
  ];

  const tandemReel = [
    { img: '/images/tandem/mock-1.png', caption: 'Mock insulin pump data stream' },
    { img: '/images/tandem/mock-2.png', caption: 'Mock network responses' },
    { img: '/images/tandem/mock-3.png', caption: 'Bluetooth connection emulator UI' },
  ];

  return (
    <div className="techPortfolio">
      <section className="hero">
        <div className="hero-inner container">
          <img className="hero-image" src="/images/tech/hero-dev.png" alt="Developer at work" />
          <div className="hero-text">
            <h1>{content.heroTitle}</h1>
            <p>{content.heroText}</p>
          </div>
        </div>
      </section>

      <div className="parallax parallax-1" />

      <section className="companies container">
        <h2>{content.logosTitle}</h2>
        <Container>
          <Row>
            {companies.map(c => (
              <Col xs={6} md={4} key={c.name} className="logo-item" title={c.name}>
                <img src={c.img} alt={c.name} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <div className="parallax parallax-2" />

      <section className="tandem container">
        <h2>{content.tandemTitle}</h2>
        <p className="tandem-text">{content.tandemText}</p>

        <h3>{content.reelTitle}</h3>
        <div className="reel" role="list">
          {tandemReel.map((r, i) => (
            <div key={i} className="reel-item" role="listitem">
              <img src={r.img} alt={r.caption} />
              <div className="reel-caption">{r.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="parallax parallax-3" />

      <section className="passion container">
        <h2>{content.passionTitle}</h2>
        <p>{content.passionText}</p>
        <p>Code coverage: <strong>82%</strong></p>
      </section>

      <FooterBar />
    </div>
  );
}