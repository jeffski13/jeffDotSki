import { Container, Row, Col } from 'react-bootstrap';
import drawings from './hobbies-drawings.json';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import drawingsHalloween from './hobbies-drawings-halloween.json';
import '../styles.css';

export interface DrawingItem {
  name: string;
  thumb: string;
  full: string;
}

const renderDrawings = (drawingItem: DrawingItem, index, titleLabel: string) => {
  return (
    <Col xs={12} md={6} lg={4}>
      <li key={index} >
        <div className="hobbieItemInfoContainer">
          <div className="hobbieItemInfo" >
            <div className="hobbieItemTitle" >{titleLabel}</div>
            <div className="hobbieItemText" >{drawingItem.name}</div>
          </div>
        </div >
        <div className="HobbieContentItem" >
          <div className="hobbieImageContainer" >
            <img className="hobbieImage drawingImage" src={drawingItem.thumb} alt={`${drawingItem.name} Drawing`} />
          </div>
        </div>
      </li>
    </Col>
  );
}
export default function Drawings() {
  const multiLangContent = {
    es: {
      title: 'Dibujos',
      intro: 'Empecé a dibujar como pasatiempo durante la pandemia. ¡Con el tiempo encontré mi estilo! ¡Que disfrutas!',
      spooky: 'Dibujos Espeluznantes:',
      spookyDesc: 'A mi familia le gusta el estilo de El Mundo Loco De Jack, así que creé estos:',
      titleLabel: 'Título:',
    },
    default: {
      title: 'Drawings',
      intro: 'I started drawing as a hobby during the pandemic. Over the years I feel I have found my style. Enjoy!',
      spooky: 'Spooky Drawings:',
      spookyDesc: 'My family likes the spooky nightmare before christmas style, so I created these:',
      titleLabel: 'Title:',
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
              {drawings.map((item, i) => renderDrawings(item, i, content.titleLabel))}
            </Row>
          </ul>
        </Container>

        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <div className="hobbiesSectionTitle">{content.spooky}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.spookyDesc}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {drawingsHalloween.map((item, i) => renderDrawings(item, i, content.titleLabel))}
            </Row>
          </ul>
        </Container>
      </div>
    </div>
  );
}