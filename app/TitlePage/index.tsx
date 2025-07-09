import { Container, Row, Col, Image } from "react-bootstrap";
import './styles.css';
import FooterBarski from "~/Inf/FooterBarski";
import ROUTES from "~/consts/ROUTES";

export default function TitlePage() {
  return (
    <div className="TitlePage" >
      <div>
        <div className="TitleImage" >
          <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/jeff_villarica_horse_2025_1080.jpg" fluid />
        </div>
        <h1 className="TitlePage_title-container"><span className="TitlePage_title-websiteName">JEFF</span> <span className="TitlePage_title-nonwebsitename">SZCIN</span><span className="TitlePage_title-websiteName">SKI</span></h1>
      </div>
      <Container fluid className="TitlePage_aboutJeff">
        <Row>
          <Col xs={12} sm={12} md={5} className="TitlePage_aboutJeff-image">
            <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/titlePage-info1-md.jpg" roundedCircle fluid />
          </Col>
          <Col xs={12} sm={12} md={7} className="TitlePage_aboutJeff-text">
            <div className="TitlePage_aboutJeff-text-container">
              <h3>Who Is Jeff (Jeffski) Szcinski?</h3>
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