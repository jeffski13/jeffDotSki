import { Container, Row, Col } from 'react-bootstrap';

import TvShow from './TvShow';
import drawings from './hobbies-drawings.json';
import drawingsHalloween from './hobbies-drawings-halloween.json';
import tvshows from './hobbies-tvshows.json';
import tvshowsFinished from './hobbies-tvshows-finished.json';
import '../styles.css';
import './styles.css';

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

export default function Hobbies() {
  return (
    <div className="aboutmeWrapper">
      <div className="hobbiesSection" >
        <Container>
          <Row>
            <Col sm={12}>
              <div className="aboutMeTitle" >Hobbies & Interests</div>
            </Col>
          </Row>
        </Container>

        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <div className="hobbiesSectionTitle">Drawings:</div>
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

        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <div className="hobbiesSectionTitle">TV Shows:</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>Over the years I have found that I connect with media and digital art on an emotional and spritual level.
                I watch one episode every night before I go to bed.
                I have found these shows over the years to be a constant comfort no matter what stage of life.
                Here are some things I am currently watching.</div>
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
              <div className="hobbiesSectionTitle">Past Shows:</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>And here are the shows I have finished (Possibly more than once!). I enojoyed the heck out of every one of these.</div>
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