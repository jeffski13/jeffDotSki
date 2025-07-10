import { Container, Row, Col } from 'react-bootstrap';

import drawings from './hobbies-drawings.json';
import drawingsHalloween from './hobbies-drawings-halloween.json';
import '../styles.css';

const renderDrawings = (drawingItem, index) => {
  return (
    <Col xs={12} md={6} lg={4}>
      <li key={index} >
        <div className="hobbieItemInfoContainer">
          <div className="hobbieItemInfo" >
            <div className="hobbieItemTitle" >Title:</div>
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
  return (
    <div className="aboutmeWrapper">
      <div className="hobbiesSection" >
        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <h1 className="aboutMeTitle" >Drawings</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>I started drawing as a hobby during the pandemic. Over the years I feel I have found my style. Enjoy!</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {drawings.map(renderDrawings)}
            </Row>
          </ul>
        </Container>

        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <div className="hobbiesSectionTitle">Spooky Drawings:</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>My family likes the spooky nightmare before christmas style, so I created these: </div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {drawingsHalloween.map(renderDrawings)}
            </Row>
          </ul>
        </Container>
      </div>
    </div>
  );
}