import { Col, Container, Row } from 'react-bootstrap';
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";
import './styles.css';
import './stylesParalax.css';
import ROUTES from '~/consts/ROUTES';

export interface TechPortfolioContentPerLanguage {
  heroTitle: string;
  heroText1prefix: string;
  heroText1highlight: string;
  heroText1suffix: string;
  skills1: string;
  skills2: string;
  skills3: string;
  heroText2prefix: string;
  heroText2highlight: string;
  heroText2suffix: string;
  logosTitle: string;
  resumeLink: string;
  tandemTitle: string;
  tandemText: string;
  reelTitle: string;
  passionTitle: string;
  passionText: string;
}

export default function TechPortfolio() {
  const multiLangContent: MultiLangContent = {
    es: {
      heroTitle: 'PORTAFOLIO TECNOLÓGICO',
      heroText1prefix: 'Desarrollador de ',
      heroText1highlight: 'aplicaciones Android y paginas web',
      heroText1suffix: '. Cuenta con diez años de experiencia en negocios de todos tamaños, de emprendamientos hasta corporaciones grandes. Sus especialidades:',
      skills1: 'Redes',
      skills2: 'Bluetooth',
      skills3: 'Pruebas Unitarias',
      heroText2prefix: 'Tiene una pasión por ',
      heroText2highlight: 'productividad',
      heroText2suffix: ' y cumpliendo con las necesidades del negocio. Competente en sus habilidades técnicas y siempre trasladando cosas a la derecha al explicar, en palabras accesibles, los desafios técnicos para que el negocio pueda tomar una decisión informada y correcta.',
      logosTitle: 'Empresas con las que he trabajado',
      resumeLink: 'Haz Click acá por Curriculum Vitae',
      tandemTitle: 'Trabajo en Tandem Diabetes Care',
      tandemText: 'En Tandem reescribí y transformé las capas de bluetooth y networking de la app Android. Implementé mocks del enlace del pump de insulina al app Android y simulé la capa de networking para pruebas y demos.',
      reelTitle: 'Imágenes (mock data y explicación)',
      passionTitle: 'Pasión por código de alta calidad',
      passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.'
    },
    default: {
      heroTitle: 'TECH PORTFOLIO',
      heroText1prefix: 'Developer of ',
      heroText1highlight: 'Android apps and websites',
      heroText1suffix: '. Ten years of experience in companies ranging from startups all the way to large coorporations. Specializing in:',
      skills1: 'Networking',
      skills2: 'Bluetooth',
      skills3: 'Unit Testing',
      heroText2prefix: 'Passion for ',
      heroText2highlight: 'productivity',
      heroText2suffix: ' and meeting business needs. Technically capable of moving tasks to the right while able to explain in accessible terms the technical challenges and trade-offs so the business can make the smartest decision.',
      logosTitle: 'Who I\'ve worked with',
      tandemTitle: 'Enabling a Faster Business',
      resumeLink: 'Click Here for Resume',
      tandemText: 'At Tandem I transformed the Bluetooth and networking layers of the Android app. I mocked the insulin pump Bluetooth connection to the Android app as well as the networking layer for testing and demos.',
      reelTitle: 'Images (mock data and explanation)',
      passionTitle: 'Passion for high-quality code',
      passionText: 'I transformed a codebase by introducing a high-coverage unit test suite. This web site you are viewing has a code coverage of 82%.'
    }
  };

  const content: TechPortfolioContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const companies = [
    { name: 'Boeing', img: '/images/techPortfolio/companies/boeing.png' },
    { name: 'USAA', img: '/images/techPortfolio/companies/usaa.png' },
    { name: 'Colegio Santa Margarita', img: '/images/techPortfolio/companies/santaMargarita.png' },
    { name: 'Tandem Diabetes Care', img: '/images/techPortfolio/companies/tandem.png' },
    { name: 'Availity', img: '/images/techPortfolio/companies/availity.png' },
    { name: 'Beardon Services', img: '/images/techPortfolio/companies/beardon.png' },
  ];

  const tandemReel = [
    { img: '/images/techPortfolio/noMorePumpOrPhone.png', caption: 'Mock insulin pump data stream' },
    { img: '/images/tandem/mock-2.png', caption: 'Mock network responses' },
    { img: '/images/tandem/mock-3.png', caption: 'Bluetooth connection emulator UI' },
  ];

  return (
    <div className="paralax-portfolio">

      <div className="paralax-bgimg paralax-bgimg-1">
        <div className="caption">
          <span className="border">{content.heroTitle}</span>
        </div>
      </div>

      <div className="paralax-paragraph-top">
        <section className="techPortfolio-overview">
          <Container>
            <Row>
              <Col xs={12} md={4} >
                <img className="techPortfolio-overview-image" src="/images/techPortfolio/hero-dev.png" alt="Developer at work" />
              </Col>
              <Col xs={12} md={8} >
                <div className="techPortfolio-overview-text">
                  <p>{content.heroText1prefix}<strong>{content.heroText1highlight}</strong>{content.heroText1suffix}</p>
                  <ul className="skills-list">
                    <li>{content.skills1}</li>
                    <li>{content.skills2}</li>
                    <li>{content.skills3}</li>
                  </ul>
                  <p>{content.heroText2prefix}<strong>{content.heroText2highlight}</strong>{content.heroText2suffix}</p>
                </div>
              </Col>
            </Row>
          </Container>
          <div className="techPortfolio-overview-inner container">
          </div>
        </section>
      </div>

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
        <a href={ROUTES.external.resume.softwareEngineer} >{content.resumeLink}</a>
      </section>

      <div className="paralax-bgimg paralax-bgimg-2">
        <div className="caption">
          <span className="border paralax-image2-overlay-text">ENABLING BUSINESS</span>
        </div>
      </div>

      <div className="paralax-contentBetweenContainer">
        <div className="betweenText">
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
        </div>
      </div>

      <div className="paralax-bgimg paralax-bgimg-3">
        <div className="caption">
          <span className="border paralax-image3-overlay-text">QUALITY CODE</span>
        </div>
      </div>

      <div className="betweenContainer2">
        <div className="betweenText2">
          <section className="passion container">
            <h2>{content.passionTitle}</h2>
            <p>{content.passionText}</p>
            <p>Code coverage: <strong>82%</strong></p>
          </section>
        </div>
      </div>

      <div className="paralax-bgimg paralax-bgimg-4">
        <div className="caption">
          <span className="border">THANKS FOR VISITING!</span>
        </div>
      </div>
      <FooterBar />
    </div>

  );
  return (
    <div className="techPortfolio">


      <div className="parallax parallax-1" />



      <div className="parallax parallax-2" />




    </div>

  );
}