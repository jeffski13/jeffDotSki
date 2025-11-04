import { Col, Container, Row } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";
import ROUTES from '~/consts/ROUTES';
import './styles.css';
import './stylesParalax.css';

import "react-image-gallery/styles/css/image-gallery.css";

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
  productiveTitle: string;
  productiveText: string;
  passionTitle: string;
  passionText: string;
  passionText2: string;
  highQualityToolsTitle: string;
  highQualityToolsText: string;
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
      productiveTitle: 'Productividad para alcanzar Calidad',
      productiveText: 'Software de alta calidad requiere mucho café y mucho trabajo. Solo superado por bots, la frecuencia de commits de Github destacan la dedicación y perseverancia mostrado en la oficina.',
      passionTitle: 'Pasión por código de alta calidad',
      passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.',
      passionText2: 'De un proyecto nuevo hasta un monolito antiguo, pruebas unitarias son el código que mantiene el código en un estado de calidad alta. En particular, un agradecimiento especial es merecido para los mentores que entendían la importancia de pruebas unitarias y tenían las habilidades necesarias para enseñar a un programador joven como se hace código de alta calidad.',
      highQualityToolsTitle: 'La Herramienta que corresponde con la Obra',
      highQualityToolsText: 'Ambientes de desarrollo fachades crearon control de las respuestas de la nuba a la aplicación, así como la verificación de los datos enviados a la nube.',
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
      tandemTitle: 'Efficiency Gains at Tandem',
      productiveTitle: 'Highly Productive for High Quality Code',
      productiveText: 'High quality software takes a lot of coffee and a lot of work. Second only to the commit bot, the Github commit frequency speaks to the daily dedication and persistence demonstrated in the work place.',
      resumeLink: 'Click Here for Resume',
      tandemText: 'The Bluetooth and networking layers of the Android app were transformed. What once required expensive hardware was virtualized, which allowed for contractors to work inside of the app.',
      passionTitle: 'Passion for high-quality code',
      passionText: 'A high-coverage unit test suite transformed past software projects from unstable to fun. This web site you are viewing has a code coverage of 82%.',
      passionText2: 'From green field projects all the way to legacy monoliths, unit tests are the code that keeps the code in a state of high quality. A special thank you is deserved for the mentors that understood the importance of unit tests and had the skills to teach a young developer how to make quality code.',
      highQualityToolsTitle: 'Creating the Right Tools for the Job',
      highQualityToolsText: 'Facade dev environments created control of the responses from the cloud to the app, as well as verification of the data uploaded to the cloud.',
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
    {
      original: '/images/techPortfolio/tandemImprovements/noMorePumpOrPhone.png',
      thumbnail: '/images/techPortfolio/tandemImprovements/noMorePumpOrPhone.png',
      caption: 'Emulated Insulin Pump Bluetooth Connection'
    },
    {
      original: '/images/techPortfolio/tandemImprovements/patientPlayback.png',
      thumbnail: '/images/techPortfolio/tandemImprovements/patientPlayback.png',
      caption: 'Sanitized patient data could be replayed inside of the development environment.'
    },
    {
      original: '/images/techPortfolio/tandemImprovements/simulatedGraphData.png',
      thumbnail: '/images/techPortfolio/tandemImprovements/simulatedGraphData.png',
      caption: 'Simulated Insulin Data to test app in different therapy situations.'
    },
  ];

  return (
    <div className="paralax-portfolio">

      <div className="paralax-bgimg-container">
        <div className="paralax-bgimg paralax-bgimg-1">
        </div>
        <div className="caption">
          <span className="border">{content.heroTitle}</span>
        </div>
      </div>

      <div className="paralax-paragraph-top textContentSection">
        <section className="techPortfolio-overview">
          <Container>
            <Row>
              <Col xs={0} md={1} >
              </Col>
              <Col xs={12} md={3} >
                <img className="techPortfolio-image techPortfolio-overview-image" src="/images/techPortfolio/hero-dev.png" alt="Developer at work" />
              </Col>
              <Col xs={12} md={7} >
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
              <Col xs={0} md={1} >
              </Col>
            </Row>
          </Container>
          <div className="techPortfolio-overview-inner container">
          </div>
        </section>
      </div>

      <section className="textContentSection companies container">
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

      <div className="paralax-bgimg-container">
        <div className="paralax-bgimg paralax-bgimg-2">
        </div>
        <div className="caption">
          <span className="border paralax-image2-overlay-text">ENABLING BUSINESS</span>
        </div>
      </div>

      <div className="paralax-contentBetweenContainer">
        <div className="betweenText">
          <section className="tandem container">
            <Container>
              <Row>
                <Col xs={12} md={1} >
                </Col>
                <Col xs={12} md={10} >
                  <h2>{content.tandemTitle}</h2>
                  <p className="tandem-text">{content.tandemText}</p>
                </Col>
                <Col xs={12} md={1} >
                </Col>
              </Row>
            </Container>
            <div className="tandemImprovements-gallery-container">
              <Container>
                <Row>
                  <Col xs={12} md={2} >
                  </Col>
                  <Col xs={12} md={8} >
                    <ImageGallery items={tandemReel}
                      slideDuration={700}
                      slideInterval={10000}
                      autoPlay />
                  </Col>
                  <Col xs={12} md={2} >
                  </Col>
                </Row>
              </Container>
            </div>
          </section>
          <section className="tandem container">
            <Container>
              <Row>
                <Col xs={12} md={1} >
                </Col>
                <Col xs={12} md={10} >
                  <h2>{content.highQualityToolsTitle}</h2>
                  <p>{content.highQualityToolsText}</p>
                </Col>
                <Col xs={12} md={1} >
                </Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col xs={12} md={2} >
                </Col>
                <Col xs={12} md={8} >
                  <img className="techPortfolio-image techPortfolio-githubCommits-image" src="/images/techPortfolio/devServerTools.png" alt="Dev server tool for cloud interactions" />
                </Col>
                <Col xs={12} md={2} >
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </div>

      <div className="paralax-bgimg-container">
        <div className="paralax-bgimg paralax-bgimg-3">
        </div>
        <div className="caption">
          <span className="border paralax-image3-overlay-text">QUALITY CODE</span>
        </div>
      </div>

      <div className="betweenContainer2 passion">
        <section className="container">
          <Container>
            <Row>
              <Col xs={12} md={1} >
              </Col>
              <Col xs={12} md={10} >
                <h2>{content.passionTitle}</h2>
                <p>{content.passionText}</p>
                <p>Current Website Code coverage: <strong>82.84%</strong></p>
                <p>Tandem Dev Server Tool: <strong>82%</strong></p>
                <p>t:connect Android App: <strong>60%</strong></p>
                <p>{content.passionText2}</p>
              </Col>
              <Col xs={12} md={1} >
              </Col>
            </Row>
          </Container>

          <Container>
            <Row>
              <Col xs={12} md={1} >
              </Col>
              <Col xs={12} md={10} >
                <h2>{content.productiveTitle}</h2>
                <p className="tandem-text">{content.productiveText}</p>
              </Col>
              <Col xs={12} md={1} >
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col xs={12} md={2} >
              </Col>
              <Col xs={12} md={8} >
                <img className="techPortfolio-image techPortfolio-githubCommits-image" src="/images/techPortfolio/tandemProductvity/githubCommitsByDay.png" alt="Github Commits per Day" />
              </Col>
              <Col xs={12} md={2} >
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <div className="paralax-bgimg-container">
        <div className="paralax-bgimg paralax-bgimg-4">
        </div>
        <div className="caption">
          <span className="border">THANKS FOR VISITING!</span>
        </div>
      </div>
      <FooterBar />
    </div>
  );
}