
import TitleImg from "./TitleImg";
import { Container, Row, Col, Image } from "react-bootstrap";
import './styles.css';
import FooterBarski from "~/Inf/FooterBarski";
import ROUTES from "~/consts/ROUTES";
import { Helmet } from "react-helmet";

export default function TitlePage() {
  return (
    <div className="TitlePage" >
      <Helmet>
        <title>Jeff Szcinski | Software Engineer, Educator, World Traveler</title>
        <meta name="description" content="Jeff Szcinski - Software Engineer, English Education Innovator, World Traveler, Artist and Performer. Learn more about Jeff's work, travels, and projects." />
        <meta name="keywords" content="Jeff Szcinski, Software Engineer, English Teacher, World Traveler, Artist, Peru, Web Developer, Android Developer, Choir Leader, Jeff Ski" />
        <meta property="og:title" content="Jeff Szcinski | Software Engineer, Educator, World Traveler" />
        <meta property="og:description" content="Jeff Szcinski - Software Engineer, English Education Innovator, World Traveler, Artist and Performer." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jeff.ski/" />
        <meta property="og:image" content="https://s3.us-east-2.amazonaws.com/jeff.ski/title/titlePage-info1-md.jpg" />
      </Helmet>
      <TitleImg />
      <Container fluid className="TitlePage_aboutJeff">
        <Row>
          <Col xs={12} sm={12} className="TitlePage_aboutJeff-name">
            <h2><span className="TitlePage_aboutJeff-name-websiteName">JEFF</span> <span className="TitlePage_aboutJeff-name-nonwebsitename">SZCIN</span><span className="TitlePage_aboutJeff-name-websiteName">SKI</span></h2>
          </Col>
          <Col xs={12} sm={12} md={5} className="TitlePage_aboutJeff-image">
            <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/titlePage-info1-md.jpg" roundedCircle fluid />
          </Col>
          <Col xs={12} sm={12} md={7} className="TitlePage_aboutJeff-text">
            <div className="TitlePage_aboutJeff-text-container">
              <h3>Who Is This Jeff Guy?</h3>
              <ul>
                <li><strong><a className="titlePageLink" href={ROUTES.pokePeru.info}>English Education Innovator</a>:</strong> Elementry School and Private Lessons for Spanish Speakers</li>
                <li><strong><a className="titlePageLink" href={ROUTES.external.resume.softwareEngineer}>Software Engineer</a>:</strong> Web Developer and Android Native Applications</li>
                <li><strong><a className="titlePageLink" href={ROUTES.external.instagram}>World Traveler</a>:</strong> Tokyo, Japan <span>&nbsp;&bull;&nbsp;</span> Santiago, Chile <span>&nbsp;&bull;&nbsp;</span> Medellín, Colombia <span>&nbsp;&bull;&nbsp;</span> Lima, Perú </li>
                <li><strong><a className="titlePageLink" href={ROUTES.aboutMe.hobbies}>Artist</a> and Performer:</strong> Leader of the Señora Fátima Choir in Miraflores, Lima, Perú</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
      <FooterBarski />
    </div>
  );
}