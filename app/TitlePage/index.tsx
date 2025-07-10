import { useMemo } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import './styles.css';
import FooterBarski from "~/Inf/FooterBarski";
import ROUTES from "~/consts/ROUTES";
import { getContentByLanguage, type MultiLangContent } from "~/langSupport";

export default function TitlePage() {
  const multiLangContent: MultiLangContent = {
    es: {
       whoIs: '¿Quién Es Jeff (Jeffski) Szcinski?',
       roles: [
         { label: 'Innovador en Educación de Inglés', desc: 'Escuela primaria y clases particulares para hispanohablantes', link: ROUTES.pokePeru.info },
         { label: 'Ingeniero de Software', desc: 'Desarrollador web y aplicaciones nativas de Android', link: ROUTES.external.resume.softwareEngineer },
         { label: 'Viajero del Mundo', desc: 'Tokio, Japón • Santiago, Chile • Medellín, Colombia • Lima, Perú', link: ROUTES.external.instagram },
         { label: 'Artista y Músico', desc: 'Líder del coro Señora Fátima en Miraflores, Lima, Perú', link: ROUTES.aboutMe.hobbies },
       ]
     },
     default: {
       whoIs: 'Who Is Jeff (Jeffski) Szcinski?',
       roles: [
         { label: 'English Education Innovator', desc: 'Elementry School and Private Lessons for Spanish Speakers', link: ROUTES.pokePeru.info },
         { label: 'Software Engineer', desc: 'Web Developer and Android Native Applications', link: ROUTES.external.resume.softwareEngineer },
         { label: 'World Traveler', desc: 'Tokyo, Japan • Santiago, Chile • Medellín, Colombia • Lima, Perú', link: ROUTES.external.instagram },
         { label: 'Artist and Performer', desc: 'Leader of the Señora Fátima Choir in Miraflores, Lima, Perú', link: ROUTES.aboutMe.hobbies },
       ]
     }
  }

  const content = getContentByLanguage(multiLangContent)

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
              <h3>{content.whoIs}</h3>
              <ul>
                {content.roles.map((role, i) => (
                  <li key={i}>
                    <strong><a className="titlePageLink" href={role.link}>{role.label}</a>:</strong> {role.desc}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
      <FooterBarski />
    </div>
  );
}