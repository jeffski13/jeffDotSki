import { Container, Row, Col } from 'react-bootstrap';
import TvShow from './TvShow';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import tvshows from './hobbies-tvshows.json';
import tvshowsFinished from './hobbies-tvshows-finished.json';
import '../styles.css';


const renderTvShows = (tvshowItem, index) => {
  return (
    <Col xs={12} sm={6} md={4}>
      <li key={index} >
        <TvShow
          title={tvshowItem.title}
          season={tvshowItem.season}
          thumb={tvshowItem.thumb}
        />
      </li>
    </Col>
  );
}


export default function TvShows() {
  const multiLangContent = {
    es: {
      title: 'Series',
      intro: 'A lo largo de los años he descubierto que conecto con los medios y el arte digital a nivel emocional y espiritual. Veo un episodio cada noche antes de dormir. Estas series han sido una constante en mi vida. Estas son las que estoy viendo hoy en día.',
      past: 'Series Pasadas:',
      pastDesc: 'Y aquí están las series que ya terminé (posiblemente más de una vez). A mi me encantaba cada una de ellas.',
    },
    default: {
      title: 'Tv Shows',
      intro: 'Over the years I have found that I connect with media and digital art on an emotional and spritual level. I watch one episode every night before I go to bed. I have found these shows over the years to be a constant comfort no matter what stage of life. Here are some things I am currently watching.',
      past: 'Past Shows:',
      pastDesc: 'And here are the shows I have finished (Possibly more than once). I enojoyed the heck out of every one of these.',
    }
  };
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
  return (
    <div className="aboutmeWrapper">
      <div className="hobbiesSection" >
        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <h1 className="aboutMeTitle" >{content.title}</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.intro}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {tvshows.map(renderTvShows)}
            </Row>
          </ul>
        </Container>

        <Container className="hobbiesSection">
          <Row className="show-grid">
            <Col sm={12}>
              <div className="hobbiesSectionTitle">{content.past}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.pastDesc}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {tvshowsFinished.map(renderTvShows)}
            </Row>
          </ul>
        </Container>
      </div>
    </div>
  );
}