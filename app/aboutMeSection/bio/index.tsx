import { Container, Col, Row, Image } from 'react-bootstrap';
import ROUTES from '../../consts/ROUTES';
import '../styles.css';
import './styles.css';
import { getContentByLanguage, getBrowserLanguage } from '../../langSupport';

interface BioContent {
    aboutMe: string;
    howDidIGetHere: string;
    intro: string;
    southam: string;
    professionalWhat: string;
    afterGrad: string;
    becomingTeacher: string;
    studyingInJapan: string;
    teacherPokePeru: string;
    sayHello: string;
    interests: string;
    commonInterests: string;
    directions: string;
    disclaimer: string;
}

interface MultiLangContent {
  es: BioContent;
  default: BioContent;
}


export function Bio() {
  const multiLangContent: MultiLangContent = {
    es: {
      aboutMe: 'Sobre Mí',
      howDidIGetHere: '¿Cómo llegué aquí?',
      intro: 'Nací en 1991 y crecí en el pequeño pueblo de Claremore, Oklahoma. En 2009 me gradué de Claremore High School y asistí a la Universidad Estatal de Oklahoma. Tuve la suerte de trabajar en una ciudad diferente cada verano. La lista incluye Las Vegas (2011) y Cessna en Wichita (2012). En el verano de 2014 era como practicante en el Banco de USAA en San Antonio en software, Texas. Me gustaba y decidí probar la programación como profesión.',
      southam: 'Me mudé a El Paso para mejorar mi español. Mi deseo de hablar con fluidez me llevó hasta Medellín, Colombia (2023). De ahí fui a Santiago, Chile (2024) y luego a Lima, Perú (2025). En Lima estudié comunicación en español y tomé el examen de español DELE B2.',
      professionalWhat: '¿Una profesiónal de verdad?',
      afterGrad: 'Después de graduarme en diciembre de 2014 me mudé a Dallas, lejos de mi familia y amigos. Muchos me dijeron que mientras fuera joven y soltero debía salir y conocer el mundo. Así que dejé Oklahoma y empecé a viajar.',
      becomingTeacher: 'En Perú conseguí mi primer puesto como profe con 5o y 6o grado. Y a mi me encantó. He decidido que voy a dedicarme a enseñar inglés como lenguaje extranjera.',
      studyingInJapan: 'Mi ultima aventura fue un viaje de casi 3 meses en Japón. Allí aprendí un poco de japones (chotto nihongo hanashimasu) y ahora he regresado a Chile para perseguir mi certificación como profe de inglés.',
      teacherPokePeru: 'Al enseñar mi taller de inglés, hice el plataforma "Pocket Monsters en Peru", lo cual se puede acceder aquí en esta pagina web.',
      sayHello: '¡Salúdame!',
      interests: 'Al final soy un nerdo nomás. Hice un muro de mis intereses.',
      commonInterests: '¡Si veas algo que tenemos en comun, avisame!',
      directions: 'Salúdame acá: ',
      disclaimer: 'Yo no soy el dueño de este contenido. Por favor, apoya los productos oficiales.'
    },
    default: {
      aboutMe: 'About Me',
      howDidIGetHere: 'How Did I Get Here?',
      intro: 'I was born in 1991 and grew up in a small town of Claremore, Oklahoma. I graduated from Claremore High School (Oklahoma) in 2009 and went to Oklahoma State University. While in college I was lucky enough to get a job in a different city every summer, including Las Vegas (2011), and Cessna in Wichita (2012). In the summer of 2014 I interned at the USAA Bank in San Antonio, Texas. I enjoyed my summer internship, and decided I wanted to try programming as a profession.',
      southam: 'I moved to El Paso to improve my spanish. My desire for fluency led me to move to Medellin, Colombia (2023). From there I lived in Santiago, Chile (2024) and then Lima, Perú (2025). In Lima I studied spanish communications and took the B2 DELE certification exam.',
      studyingInJapan: 'My last adventure was a trip to a trip to Japan. I was there for almost three months. While I was there I studied Japanese (chotto nihongo hanashimasu). Now I have returned to Chile to pursue a certification as an English teacher.',
      professionalWhat: 'A Professional What?',
      afterGrad: 'After graduating in December of 2014 I moved Dallas, far away from my familiar family and friends. So many people had told me that while I was young and single I needed go out and experience the world. So I left Oklahoma and started traveling.',
      becomingTeacher: 'While in Peru I got my first teaching job with 5th and 6th graders. And I loved it. I have decided that teaching English as a Foreign Language is what I want to do with my life.',
      teacherPokePeru: 'While teaching my English Workshop, I made the "Pocket Monsters in Peru" educational program, which can be accessed within this site.',
      sayHello: 'Say Hello!',
      interests: 'At the end of the day I am just a nerd. A threw a collage* together of things I have enjoyed.',
      commonInterests: 'If you see anything we have in common, shoot me a message!',
      directions: 'Say hello at: ',
      disclaimer: "I don't own any of these images. Please support the official releases."
    }
  };
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
  return (
    <div className="aboutmeWrapper">
      <div className="aboutmeTextSection" >
        <Container>
          <Row className="show-grid">
            <Col sm={2} md={4}>
            </Col>
            <Col sm={6} md={4}>
              <div className="aboutMeTitle" >{content.aboutMe}</div>
            </Col>
            <Col sm={2} md={4}>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="show-grid aboutMePargraph">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} >
              <h2 className="aboutMeSectionTitle" >{content.howDidIGetHere}</h2>
            </Col>
          </Row>
          <Row className="show-grid aboutMePargraph" >
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} md={5} className="aboutMePargraphWithImage" >
              <p>{content.intro}</p>
            </Col>
            <Col sm={10} md={5} >
              <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/aboutme-myjourneymap.png' fluid />
            </Col>
            <Row className="show-grid aboutMePargraph">
              <Col sm={0} md={1}>
              </Col>
              <Col sm={10} md={3} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/aboutme-myjourneymap_southamPlusJapan.png' fluid />
              </Col>
              <Col sm={10} md={7} className="aboutMePargraphWithImage" >
                <div>
                {content.southam}
                </div>
                <br className='bio-betweenParagraphs' />
                <div>
                {content.studyingInJapan}
                </div>
              </Col>
            </Row>
          </Row>
          <Row className="show-grid aboutMePargraph">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} >
              <h2 className="aboutMeSectionTitle">{content.professionalWhat}</h2>
              <p>{content.afterGrad}</p>
            </Col>
          </Row>
          <Row className="show-grid aboutMePargraph">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} md={5} className="aboutMePargraphWithImage" >
              {content.becomingTeacher}
            </Col>
            <Col sm={10} md={5} >
              <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/a-professional-what.jpg' fluid />
            </Col>
          </Row>
          <Row className="show-grid aboutMePargraph">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} >
              <p>
                {content.teacherPokePeru}<a href={ROUTES.pokePeru.battle}>Pocket Monsters In Peru Project</a>
              </p>
            </Col>
          </Row>
          <Row className="show-grid aboutMePargraph" >
            <Col sm={10} className="aboutMePargraphWithImage" >
            </Col>
          </Row>
          <Row className="show-grid aboutMePargraph">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10} >
              <h2 className="aboutMeSectionTitle">{content.sayHello}</h2>
              <p>{content.interests}</p>
              <p>{content.commonInterests}</p>
              <p>{content.directions} <span className="bio_emailAddress">coffee@jeff.ski</span></p>
            </Col>
          </Row>
          <Row className="show-grid bioHobbies-img">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={10}  >
              <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/myhobbies.png' fluid />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col sm={0} md={1}>
            </Col>
            <Col sm={8} smOffset={1} className="bioHobbie-disclaimer" >
              <p>*{content.disclaimer}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}