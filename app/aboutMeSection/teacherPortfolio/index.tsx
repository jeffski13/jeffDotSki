import { Col, Container, Row } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import FooterBar from "~/infra/footerBar";
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";
import ROUTES from '~/consts/ROUTES';
import './styles.css';
import '../stylesParalax.css';
import '../../infra/mobile-support.css'

import "react-image-gallery/styles/css/image-gallery.css";

export interface TeacherPortfolioContentPerLanguage {
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
  resumeLink: string;
  resumeLinkText: string;
  recentWorkSectionTitle: string;
  accomplishmentsTitle: string;
  accomplishmentsText: string;
  productiveTitle: string;
  productiveText: string;
  passionTitle: string;
  passionText: string;
  passionText2: string;
  qualityCodeTitle: string;
  highQualityToolsTitle: string;
  highQualityToolsText: string;
  endingNote: string;
}

export default function TeacherPortfolio() {
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
      resumeLink: ROUTES.external.resume.profeIngles,
      resumeLinkText: 'Haz Click acá por Curriculum Vitae',
      recentWorkSectionTitle: ' HABILITANDO LA EMPRESA',
      accomplishmentsTitle: 'Logros de Eficiencia más Recientamente',
      accomplishmentsText: 'En Tandem Diabetes Care, reescribí y transformé las capas de bluetooth y networking de la app Android. Implementé mocks del enlace del pump de insulina al app Android y simulé la capa de networking para pruebas y demos.',
      productiveTitle: 'Productividad para alcanzar Calidad',
      productiveText: 'Software de alta calidad requiere mucho café y mucho trabajo. Como el miembro del equipo más activo en Github, la frecuencia de commits destacan la dedicación y perseverancia mostrado en la oficina.',
      passionTitle: 'Pasión por código de alta calidad',
      passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.',
      passionText2: 'De un proyecto nuevo hasta un monolito antiguo, pruebas unitarias son el código que mantiene el código en un estado de calidad alta. En particular, un agradecimiento especial es merecido para los mentores que entendían la importancia de pruebas unitarias y tenían las habilidades necesarias para enseñar a un programador joven como se hace código de alta calidad.',
      qualityCodeTitle: 'CÓDIGO DE ALTA CALIDAD',
      highQualityToolsTitle: 'La Herramienta que Corresponde a la Obra',
      highQualityToolsText: 'Ambientes de desarrollo fachades crearon control de las respuestas de la nuba a la aplicación, así como la verificación de los datos enviados a la nube.',
      endingNote: 'GRACIAS POR VISITAR!',
    },
    default: {
      heroTitle: 'TEACHER PORTFOLIO',
      heroText1prefix: 'Teaches  ',
      heroText1highlight: 'English',
      heroText1suffix: '. Experience in large classrooms and one-on-one private lessons. Specialized in',
      skills1: 'Communication',
      skills2: 'Innovative Classroom Experiences',
      skills3: 'Personlized Material',
      heroText2prefix: 'Passion for ',
      heroText2highlight: 'classroom experience',
      heroText2suffix: ' and a patience with learners that is needed to create a challenging but fun classroom experience.',
      recentWorkSectionTitle: 'MAKING IT FUN',
      accomplishmentsTitle: 'Most Recent Class',
      accomplishmentsText: 'While at Colegio Santa Margarita, I taught an English workshop in which the students expanded vocabulary and fluency with engaging projects.',
      productiveTitle: 'Making teaching Fun',
      productiveText: 'Students need to be met where they are at in life. ',
      resumeLink: ROUTES.external.resume.teacherEnglish,
      resumeLinkText: 'Click Here for Resume',
      passionTitle: 'Creating Custom ',
      passionText: 'A high-coverage unit test suite transformed past software projects from unstable to fun. This web site you are viewing has a code coverage of 82%.',
      passionText2: 'From green field projects all the way to legacy monoliths, unit tests are the code that keeps the code in a state of high quality. A special thank you is deserved for the mentors that understood the importance of unit tests and had the skills to teach a young developer how to make quality code.',
      qualityCodeTitle: 'AI MAKING A DIFFERENCE',
      highQualityToolsTitle: 'Creating the Right Tools for the Job',
      highQualityToolsText: 'Facade dev environments allowed control of the responses from the cloud to the app, as well as verification of the data uploaded to the cloud.',
      endingNote: 'THANKS FOR VISITING!',
    }
  };

  const content: TeacherPortfolioContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const photoReel = [
    {
      original: '/images/techPortfolio/recentJobImprovements/noMorePumpOrPhone.png',
      thumbnail: '/images/techPortfolio/recentJobImprovements/thumbnails/noMorePumpOrPhone.png',
    },
    {
      original: '/images/techPortfolio/recentJobImprovements/patientPlayback.png',
      thumbnail: '/images/techPortfolio/recentJobImprovements/thumbnails/patientPlayback.png',
    },
    {
      original: '/images/techPortfolio/recentJobImprovements/simulatedGraphData.png',
      thumbnail: '/images/techPortfolio/recentJobImprovements/thumbnails/simulatedGraphData.png',
    },
    {
      original: '/images/techPortfolio/recentJobImprovements/customizableDashboard.png',
      thumbnail: '/images/techPortfolio/recentJobImprovements/thumbnails/customizableDashboard.png',
    },
  ];

  return (
    <div className="paralax-portfolio">

      <div className="paralax-bgimg paralax-bgimg-1 paralax-bgimg-1-source">
        <div className="paralax-section-title-container">
          <span className="paralax-section-title">{content.heroTitle}</span>
        </div>
      </div>
      <div className="paralax-bgimg-container">
      </div>

      <section className="paralax-paragraph paralax-section-whiteBackground paralax-content-section-overview">
        <Container>
          <Row>
            <Col xs={0} md={1} >
            </Col>
            <Col xs={12} md={4} >
              <img className="techPortfolio-image techPortfolio-overview-image" src="/images/teacherPortfolio/teachingWorkingFullBody.jpg" alt="Developer at work" />
            </Col>
            <Col xs={12} md={6} >
              <div className="techPortfolio-overview-text">
                <p>{content.heroText1prefix}<strong>{content.heroText1highlight}</strong>{content.heroText1suffix}</p>
                <ul className="techPortfolio-overview-skills-list">
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
        <div className="techPortfolio-top-section-spacer">
        </div>
      </section>

      <div className="paralax-bgimg paralax-bgimg-2 paralax-bgimg-2-source">
        <div className="paralax-section-title-container">
          <span className="paralax-section-title">{content.recentWorkSectionTitle}</span>
        </div>
      </div>

      <div className="paralax-section-blackBackground">
        <section className="paralax-paragraph paralax-content-section-efficiencyGains">
          <Container>
            <Row>
              <Col xs={12} md={1} >
              </Col>
              <Col xs={12} md={10} >
                <h2>{content.accomplishmentsTitle}</h2>
                <p >{content.accomplishmentsText}</p>
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
                <ImageGallery items={photoReel}
                  slideDuration={700}
                  slideInterval={10000}
                />
              </Col>
              <Col xs={12} md={2} >
              </Col>
            </Row>
          </Container>
        </section>
        <section className="paralax-paragraph paralax-content-section-toolsForTheJob">
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
                <img className="techPortfolio-image" src="/images/techPortfolio/devServerTools.png" alt="Dev server tool for cloud interactions" />
              </Col>
              <Col xs={12} md={2} >
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <div className="paralax-bgimg paralax-bgimg-3 paralax-bgimg-3-source">
        <div className="paralax-section-title-container">
          <span className="paralax-section-title">{content.qualityCodeTitle}</span>
        </div>
      </div>

      <section className="paralax-paragraph paralax-section-whiteBackground paralax-content-section-qualityCode">
        <Container>
          <Row>
            <Col xs={12} md={1} >
            </Col>
            <Col xs={12} md={10} >
              <h2>{content.passionTitle}</h2>
              <p>{content.passionText}</p>
              <p>jeff.ski Website Code Coverage: <strong>86.09%</strong></p>
              <p>Tandem Dev Server Tool: <strong>82.41%</strong></p>
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
              <p>{content.productiveText}</p>
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
              <img className="techPortfolio-image techPortfolio-githubCommits-image" src="/images/techPortfolio/tandemProductvity/githubCommitsPerDay.png" alt="Github Commits per Day" />
            </Col>
            <Col xs={12} md={2} >
            </Col>
          </Row>
        </Container>
      </section>

      <div className="paralax-bgimg paralax-bgimg-4 paralax-bgimg-4-source">
        <div className="paralax-section-title-container">
          <span className="paralax-section-title">{content.endingNote}</span>
        </div>
      </div>

      <FooterBar />
    </div>
  );
}