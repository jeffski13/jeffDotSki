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
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import type { PortfolioProps } from '../PortfolioProps';

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
  logosTitle: string;
  resumeLink: string;
  resumeLinkText: string;
  recentWorkSectionTitle: string;
  accomplishmentsTitle: string;
  accomplishmentsText: string;
  highQualityToolsTitle: string;
  highQualityToolsText: string;
  passionSectionTitle: string;
  passionTitle: string;
  passionText: string;
  passionText2: string;
  productiveTitle: string;
  productiveText: string;
  endingNote: string;
}

interface TitleLinks {
  logosTitleLink: string;
  accomplishmentsTitleLink: string;
  highQualityToolsTitleLink: string;
  passionTitleLink: string;
  productiveTitleLink: string;
}

export default function TechPortfolio({isTestEnv = false}: PortfolioProps) {
  
  const titleLinks: TitleLinks =  {
    logosTitleLink: 'Who-Ive-worked-with',
    accomplishmentsTitleLink: 'Most-Recent-Efficiency-Gains',
    highQualityToolsTitleLink: 'Creating-the-Right-Tools-for-the-Job',
    passionTitleLink: 'Creating-with-Craftsmanship',
    productiveTitleLink: 'Highly-Productive-for-High-Quality-Code',
  }
  
  if(!isTestEnv) {
    // Jumping to anchors by id will work
    const location = useLocation()
    useEffect(() => {
      // Scroll to the element with the ID from the fragment identifier
      if (location.hash) {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, [location.hash])
  }

  const es: ContentPerLanguage = {
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
    logosTitle: 'Empresas con las que he Trabajado',
    resumeLink: ROUTES.external.resume.ingenieroDeSoftware,
    resumeLinkText: 'Haz Click acá por Curriculum Vitae',
    recentWorkSectionTitle: ' HABILITANDO LA EMPRESA',
    accomplishmentsTitle: 'Logros de Eficiencia más Recientamente',
    accomplishmentsText: 'En Tandem Diabetes Care, reescribí y transformé las capas de bluetooth y networking de la app Android. Implementé mocks del enlace del pump de insulina al app Android y simulé la capa de networking para pruebas y demos.',
    highQualityToolsTitle: 'La Herramienta que Corresponde a la Obra',
    highQualityToolsText: 'Ambientes de desarrollo fachades crearon control de las respuestas de la nuba a la aplicación, así como la verificación de los datos enviados a la nube.',
    passionTitle: 'Pasión por código de alta calidad',
    passionText: 'Transformé una base de código añadiendo una suite de pruebas unitarias con alta cobertura; este sitio tiene actualmente una cobertura de código del 82%.',
    passionText2: 'De un proyecto nuevo hasta un monolito antiguo, pruebas unitarias son el código que mantiene el código en un estado de calidad alta. En particular, un agradecimiento especial es merecido para los mentores que entendían la importancia de pruebas unitarias y tenían las habilidades necesarias para enseñar a un programador joven como se hace código de alta calidad.',
    passionSectionTitle: 'CÓDIGO DE ALTA CALIDAD',
    productiveTitle: 'Productividad para alcanzar Calidad',
    productiveText: 'Software de alta calidad requiere mucho café y mucho trabajo. Como el miembro del equipo más activo en Github, la frecuencia de commits destacan la dedicación y perseverancia mostrado en la oficina.',
    endingNote: 'GRACIAS POR VISITAR!',
  }
  const defaultText: ContentPerLanguage = {
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
    resumeLink: ROUTES.external.resume.softwareEngineer,
    resumeLinkText: 'Click Here for Resume',
    recentWorkSectionTitle: 'ENABLING BUSINESS',
    accomplishmentsTitle: 'Most Recent Efficiency Gains',
    accomplishmentsText: 'While at Tandem Diabetes Care, the Bluetooth and networking layers of the Android app were transformed. What once required expensive hardware was virtualized, which allowed for contractors to work inside of the app.',
    highQualityToolsTitle: 'Creating the Right Tools for the Job',
    highQualityToolsText: 'Facade dev environments allowed control of the responses from the cloud to the app, as well as verification of the data uploaded to the cloud.',
    passionSectionTitle: 'QUALITY CODE',
    passionTitle: 'Creating with Craftsmanship',
    passionText: 'A high-coverage unit test suite transformed past software projects from unstable to fun. This web site you are viewing has a code coverage of 82%.',
    passionText2: 'From green field projects all the way to legacy monoliths, unit tests are the code that keeps the code in a state of high quality. A special thank you is deserved for the mentors that understood the importance of unit tests and had the skills to teach a young developer how to make quality code.',
    productiveTitle: 'Highly Productive for High Quality Code',
    productiveText: 'High quality software takes a lot of coffee and a lot of work. As the most active team member on Github, the commit frequency speaks to the daily dedication and persistence demonstrated in the work place.',
    endingNote: 'THANKS FOR VISITING!',
  }

  const multiLangContent: MultiLangContent = {
    es,
    default: defaultText
  };
  const content: ContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const companies = [
    { name: 'Boeing', img: '/images/aboutMeSection/techPortfolio/companies/boeing.png' },
    { name: 'USAA', img: '/images/aboutMeSection/techPortfolio/companies/usaa.png' },
    { name: 'Colegio Santa Margarita', img: '/images/aboutMeSection/techPortfolio/companies/santaMargarita.png' },
    { name: 'Tandem Diabetes Care', img: '/images/aboutMeSection/techPortfolio/companies/tandem.png' },
    { name: 'Availity', img: '/images/aboutMeSection/techPortfolio/companies/availity.png' },
    { name: 'Beardon Services', img: '/images/aboutMeSection/techPortfolio/companies/beardon.png' },
  ];

  const tandemReel = [
    {
      original: '/images/aboutMeSection/techPortfolio/recentJobImprovements/noMorePumpOrPhone.png',
      thumbnail: '/images/aboutMeSection/techPortfolio/recentJobImprovements/thumbnails/noMorePumpOrPhone.png',
    },
    {
      original: '/images/aboutMeSection/techPortfolio/recentJobImprovements/patientPlayback.png',
      thumbnail: '/images/aboutMeSection/techPortfolio/recentJobImprovements/thumbnails/patientPlayback.png',
    },
    {
      original: '/images/aboutMeSection/techPortfolio/recentJobImprovements/simulatedGraphData.png',
      thumbnail: '/images/aboutMeSection/techPortfolio/recentJobImprovements/thumbnails/simulatedGraphData.png',
    },
    {
      original: '/images/aboutMeSection/techPortfolio/recentJobImprovements/customizableDashboard.png',
      thumbnail: '/images/aboutMeSection/techPortfolio/recentJobImprovements/thumbnails/customizableDashboard.png',
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
              <img className="portfolio-overview-image" src="/images/aboutMeSection/techPortfolio/developerWorkingImage.png" alt="Developer at work" />
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
              </div>
            </Col>
            <Col xs={0} md={1} >
            </Col>
          </Row>
        </Container>
        <div className="portfolio-top-section-spacer">
        </div>
      </section>

      <section className="paralax-section-whiteBackground paralax-content-section-overview-accredidation portfolio-text-centered-content">
        <h2 id={titleLinks.logosTitleLink}>{content.logosTitle}<AnchorLink targetId={titleLinks.logosTitleLink} /></h2>
        <Container>
          <Row>
            {companies.map(c => (
              <Col xs={6} md={4} key={c.name} className="company-logo-item" title={c.name}>
                <img src={c.img} alt={c.name} />
              </Col>
            ))}
          </Row>
        </Container>
        <a href={content.resumeLink} >{content.resumeLinkText}</a>
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
                <h2 id={titleLinks.accomplishmentsTitleLink}>{content.accomplishmentsTitle}<AnchorLink isDarkMode targetId={titleLinks.accomplishmentsTitleLink} /></h2>
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
                <ImageGallery items={tandemReel}
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
                <h2 id={titleLinks.highQualityToolsTitleLink}>{content.highQualityToolsTitle}<AnchorLink isDarkMode targetId={titleLinks.highQualityToolsTitleLink} /></h2>
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
                <img className="portfolio-image" src="/images/aboutMeSection/techPortfolio/devServerTools.png" alt="Dev server tool for cloud interactions" />
              </Col>
              <Col xs={12} md={2} >
              </Col>
            </Row>
          </Container>
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
              <h2 id={titleLinks.passionTitleLink}>{content.passionTitle}<AnchorLink targetId={titleLinks.passionTitleLink} /></h2>
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
              <h2 id={titleLinks.productiveTitleLink}>{content.productiveTitle}<AnchorLink targetId={titleLinks.productiveTitleLink} /></h2>
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
              <img className="portfolio-content-image" src="/images/aboutMeSection/techPortfolio/tandemProductvity/githubCommitsPerDay.png" alt="Github Commits per Day" />
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