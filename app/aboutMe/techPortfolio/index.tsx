import { Col, Container, Row } from 'react-bootstrap';
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";
import './styles.css';
import './stylesParalax.css';

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
    <div className="paralax-portfolio">

      <div className="bgimg-1">
        <div className="caption">
        <span className="border">TECH PORTFOLIO</span>
        </div>
      </div>

      <div className="paralax-top">
        <h3 className="paralax-paragraph">Parallax Demo</h3>
        <p>Parallax scrolling is a web site trend where the background content is moved at a different speed than the foreground content while scrolling. Nascetur per nec posuere turpis, lectus nec libero turpis nunc at, sed posuere mollis ullamcorper libero ante lectus, blandit pellentesque a, magna turpis est sapien duis blandit dignissim. Viverra interdum mi magna mi, morbi sociis. Condimentum dui ipsum consequat morbi, curabitur aliquam pede, nullam vitae eu placerat eget et vehicula. Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio. Accumsan fringilla vulputate at quibusdam sociis eleifend, aenean maecenas vulputate, non id vehicula lorem mattis, ratione interdum sociis ornare. Suscipit proin magna cras vel, non sit platea sit, maecenas ante augue etiam maecenas, porta porttitor placerat leo.</p>
      </div>

      <div className="bgimg-2">
        <div className="caption">
        <span className="border paralax-image2-overlay-text">LESS HEIGHT</span>
        </div>
      </div>

      <div className="betweenContainer">
        <div className="betweenText">
        <p>Scroll up and down to really get the feeling of how Parallax Scrolling works.</p>
        </div>
      </div>

      <div className="bgimg-3">
        <div className="caption">
        <span className="border paralax-image3-overlay-text">SCROLL UP</span>
        </div>
      </div>

      <div className="betweenContainer2">
        <div className="betweenText2">
        <p>Scroll up and down to really get the feeling of how Parallax Scrolling works.</p>
        </div>
      </div>

      <div className="bgimg-1">
        <div className="caption">
        <span className="border">COOL!</span>
        </div>
      </div>
      <FooterBar />
    </div>

  );
  return (
    <div className="techPortfolio">
      <section className="hero">
        <Container>
          <Row>
            <Col xs={6} md={4} >
              <img className="hero-image" src="/images/techPortfolio/hero-dev.png" alt="Developer at work" />
            </Col>
            <Col xs={6} md={8} >
              <div className="hero-text">
                <h1>{content.heroTitle}</h1>
                <p>{content.heroText}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={8} >
              <div className="hero-text">
                <p>{content.heroText}</p>
              </div>
            </Col>
            <Col xs={6} md={4} >
              <img className="hero-image" src="/images/techPortfolio/hero-dev-desk.jpg" alt="Developer at work" />
            </Col>
          </Row>
        </Container>
        <div className="hero-inner container">
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

      <section className="passion container">
        <h2>{content.passionTitle}</h2>
        <p>{content.passionText}</p>
        <p>Code coverage: <strong>82%</strong></p>
      </section>
    </div>

  );
}