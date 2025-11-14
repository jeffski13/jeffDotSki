import { Col, Container, Row } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import FooterBar from "~/infra/footerBar";
import AnchorLink from '~/infra/anchor/AnchorLink';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from "~/langSupport";
import ROUTES from '~/consts/ROUTES';
import './styles.css';
import '../stylesParalax.css';
import '../stylesPortfolio.css';
import '../../infra/mobile-support.css'

import "react-image-gallery/styles/css/image-gallery.css";

interface ContentPerLanguage {
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
  accomplishmentsTitleLink: string;
  accomplishmentsText: string;
  highQualityToolsTitle: string;
  highQualityToolsTitleLink: string;
  highQualityToolsText: string;
  highQualityToolsLink: string;
  highQualityToolsLinkText: string;
  passionSectionTitle: string;
  passionTitle: string;
  passionTitleLink: string;
  passionText: string;
  aiImpovement1: string;
  aiImpovement2: string;
  aiImpovement3: string;
  passionText2: string;
  endingNote: string;
}

export default function TeacherPortfolio() {
  const es: ContentPerLanguage = {
    heroTitle: 'PORTAFOLIO DE PROFESOR',
    heroText1prefix: 'Enseña ',
    heroText1highlight: 'Inglés',
    heroText1suffix: '. Cuenta con experiencia en clases grandes y clases particulares. Sus especialidades:',
    skills1: 'Comunicaciones Conversacionales',
    skills2: 'Experiencias del Aula',
    skills3: 'Materiales Personalizadas',
    heroText2prefix: 'Tiene una pasión por ',
    heroText2highlight: 'Experiences del Aula',
    heroText2suffix: ' y una paciencia con alumnos que hace falta para crear un ambiente que no es solo desfiante, sino divertido.',
    resumeLink: ROUTES.external.resume.profeIngles,
    resumeLinkText: 'Haz Click acá por Curriculum Vitae',
    recentWorkSectionTitle: 'QUE SEA DIVERTIDO!',
    accomplishmentsTitle: 'Clase más Recientamente',
    accomplishmentsTitleLink: 'Clase-mas-Recientamente',
    accomplishmentsText: 'En Colegio Santa Margarita, enseñe un taller de inglés (Projects in Action) en el que los estudientes aumentaron de vocabulario y fluencia a traves de proyectos conmovedores.',
    highQualityToolsTitle: 'Creando Memorias de Aprendizaje',
    highQualityToolsTitleLink: 'robotics-in-the-classroom',
    highQualityToolsText: 'Los estudientes colaboraron juntos, creando arte original de monstruos, lo que estaba mostrado en una manera elegante. Los estudiantes crearon monstruos, un líderde gimnasio, y entradas científicas con información sobre sus obras.',
    highQualityToolsLinkText: 'Haz click acá para Acceder',
    highQualityToolsLink: ROUTES.pokePeru.battle,
    passionSectionTitle: 'CÓDIGO DE ALTA CALIDAD',
    passionTitle: 'Pasión por código de alta calidad',
    passionTitleLink: '',
    passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.',
    aiImpovement1: '',
    aiImpovement2: '',
    aiImpovement3: '',
    passionText2: 'De un proyecto nuevo hasta un monolito antiguo, pruebas unitarias son el código que mantiene el código en un estado de calidad alta. En particular, un agradecimiento especial es merecido para los mentores que entendían la importancia de pruebas unitarias y tenían las habilidades necesarias para enseñar a un programador joven como se hace código de alta calidad.',
    endingNote: 'GRACIAS POR VISITAR!',
  };
  
  const defaultText: ContentPerLanguage = {
    heroTitle: 'TEACHER PORTFOLIO',
    heroText1prefix: 'Teaches  ',
    heroText1highlight: 'English and Technology',
    heroText1suffix: ' with experience in large classrooms and one-on-one private lessons. Specialized in',
    skills1: 'Conversational Communication',
    skills2: 'Innovative Classroom Experiences',
    skills3: 'Personlized Material',
    heroText2prefix: 'Passion for ',
    heroText2highlight: 'classroom experience',
    heroText2suffix: ' and a patience with learners that is needed to create a challenging but fun classroom experience.',
    resumeLink: ROUTES.external.resume.teacherEnglish,
    resumeLinkText: 'Click Here for Resume',
    recentWorkSectionTitle: 'MAKING IT FUN',
    accomplishmentsTitle: 'Most Recent Class',
    accomplishmentsTitleLink: 'Most-Recent-Class',
    accomplishmentsText: 'While at Colegio Santa Margarita, I taught an English workshop in which the students expanded vocabulary and fluency with engaging projects.',
    highQualityToolsTitle: 'Making Learning Memories',
    highQualityToolsTitleLink: 'robotics-in-the-classroom',
    highQualityToolsText: 'Students worked together, creating original monster artwork which was displayed in a beautiful format. Students created monsters, gym leaders, and pokedex entries.',
    highQualityToolsLink: ROUTES.pokePeru.battle,
    highQualityToolsLinkText: 'Click Here to access Pokemon In Peru',
    passionSectionTitle: 'INNOVATING WITH AI',
    passionTitle: 'Creating Custom Learning Content',
    passionTitleLink: 'Creating-Custom-Learning-Content',
    passionText: 'With modern AI technology, even as something as simple as a worksheet can be transformed into an impactful learning experience, customized to the life and interests of the student. AI has improved the experiences in:',
    aiImpovement1: 'Educational Presentations',
    aiImpovement2: 'Worksheets',
    aiImpovement3: 'Targeted Songs for Learning',
    passionText2: 'With each step forward in technology, there is an opportunity to enrich the learning experience.',
    endingNote: 'THANKS FOR VISITING!',
  };

  const multiLangContent: MultiLangContent = {
    es,
    default: defaultText
  };
  const content: ContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const photoReel = [
    {
      original: '/images/aboutMeSection/teacherPortfolio/recentWork/learningWithMinecraft.png',
      thumbnail: '/images/aboutMeSection/teacherPortfolio/recentWork/thumbnails/learningWithMinecraft.png',
    },
    {
      original: '/images/aboutMeSection/teacherPortfolio/recentWork/learningWithPokemon.png',
      thumbnail: '/images/aboutMeSection/teacherPortfolio/recentWork/thumbnails/learningWithPokemon.png',
    },
    {
      original: '/images/aboutMeSection/teacherPortfolio/recentWork/learningWithComics.png',
      thumbnail: '/images/aboutMeSection/teacherPortfolio/recentWork/thumbnails/learningWithComics.png',
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
            <Col xs={12} md={4} className="teacher-portfolio-overview-image-container mobile-view" >
              <img className="portfolio-image portfolio-overview-image teacher-portfolio-overview-image" src="/images/aboutMeSection/teacherPortfolio/teachingWorkingFullBody.jpg" alt="Developer at work" />
            </Col>
            <Col xs={12} md={6} >
              <div className="portfolio-overview-text">
                <p>{content.heroText1prefix}<strong>{content.heroText1highlight}</strong>{content.heroText1suffix}</p>
                <ul className="portfolio-bullet-list">
                  <li>{content.skills1}</li>
                  <li>{content.skills2}</li>
                  <li>{content.skills3}</li>
                </ul>
                <p>{content.heroText2prefix}<strong>{content.heroText2highlight}</strong>{content.heroText2suffix}</p>
                <a href={content.resumeLink} >{content.resumeLinkText}</a>
              </div>
            </Col>
            <Col xs={12} md={4} className="teacher-portfolio-overview-image-container desktop-view" >
              <img className="portfolio-image portfolio-overview-image teacher-portfolio-overview-image" src="/images/aboutMeSection/teacherPortfolio/teachingWorkingFullBody.jpg" alt="Developer at work" />
            </Col>
            <Col xs={0} md={1} >
            </Col>
          </Row>
        </Container>
        <div className="portfolio-top-section-spacer">
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
                  <h2 id={content.accomplishmentsTitleLink}>{content.accomplishmentsTitle}<AnchorLink isDarkMode targetId={content.accomplishmentsTitleLink} /></h2>
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
                  <h2 id={content.highQualityToolsTitleLink}>{content.highQualityToolsTitle}<AnchorLink isDarkMode targetId={content.highQualityToolsTitleLink} /></h2>
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
                <img className="portfolio-image" src="/images/aboutMeSection/teacherPortfolio/recentWork/pokemonInPeruMasterSlide.png" alt="Dev server tool for cloud interactions" />
              </Col>
              <Col xs={12} md={2} >
              </Col>
            </Row>
          </Container>
          <div className="pokeperuLink">
            <a href={content.highQualityToolsLink} >{content.highQualityToolsLinkText}</a>
          </div>
        </section>
      </div>

      <div className="paralax-bgimg paralax-bgimg-3 paralax-bgimg-3-source">
        <div className="paralax-section-title-container">
          <span className="paralax-section-title">{content.passionSectionTitle}</span>
        </div>
      </div>

      <section className="paralax-paragraph paralax-section-whiteBackground paralax-content-section-qualityWork">
        <Container>
          <Row>
            <Col xs={12} md={1} >
            </Col>
                <Col xs={12} md={10} >
                  <h2 id={content.passionTitleLink}>{content.passionTitle}<AnchorLink targetId={content.passionTitleLink} /></h2>
              <p>{content.passionText}</p>
              <ul className="portfolio-bullet-list">
                <li>{content.aiImpovement1}</li>
                <li>{content.aiImpovement2}</li>
                <li>{content.aiImpovement3}</li>
              </ul>
              <p>{content.passionText2}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={2} >
            </Col>
            <Col xs={12} md={8} >
              <img className="portfolio-image portfolio-qualityWork-content-image" src="/images/aboutMeSection/teacherPortfolio/pastGraduatedStudent.png" alt="Past student that enjoyed the program" />
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