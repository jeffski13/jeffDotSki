import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import TvShow from './TvShow';
import tvshows from './hobbies-tvshows.json';
import tvshowsFinished from './hobbies-tvshows-finished.json';
import '../styles.css';
import './styles.css';

class Hobbies extends React.Component {

  renderTvShows(tvshowItem, index) {
    return (
      <li key={index} >
        <TvShow
          title={tvshowItem.title}
          season={tvshowItem.season}
          thumb={tvshowItem.thumb}
        />
      </li>
    )
  }

  render() {
    return (
      <div className="aboutmeWrapper">
        <div className="shotGlassTextSection" >
          <Container>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div className="aboutMeTitle" >Hobbies & Interests</div>
              </Col>
            </Row>
          </Container>
          <Container className="hobbiesSectionText">
            <Row className="show-grid hobbiesSection">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div className="hobbiesSectionTitle">TV Shows:</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div>Over the years I have found that I connect with media and digital art on an emotional and spritual level.
                  I watch one episode every night before I go to bed.
                  I have found these shows over the years to be a constant comfort no matter what stage of life.
                  Here are some things I am currently watching.</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={2}>
              </Col>
              <Col sm={10}>
              </Col>
            </Row>
          </Container>
          <ul className="tvshowList" >
            {tvshows.map(this.renderTvShows)}
          </ul>

          <Container className="hobbiesSectionText">
            <Row className="show-grid hobbiesSection">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div className="hobbiesSectionTitle">Past Shows:</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div>And here are the shows I have finished (Possibly more than once!). I enojoyed the heck out of every one of these.</div>
              </Col>
            </Row>
          </Container>
          <ul className="tvshowList" >
            {tvshowsFinished.map(this.renderTvShows)}
          </ul>
        </div>
      </div>
    );
  }
}

Hobbies.propTypes = {

};

export default Hobbies;