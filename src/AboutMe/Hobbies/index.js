import React from 'react';
import { Container, Row, Col, Image, ResponsiveEmbed } from 'react-bootstrap';

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

          <Container className="hobbiesSectionText">
            <Row className="show-grid hobbiesSection">
              <Col sm={1}></Col>
              <Col sm={11} className="hobbiesSectionTitle">Me Encanta Mi Moto</Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div>My motorcycle is one of the best purchases I have ever made! Not only do I get to feel super cool, but it is also practical and good for the environment! Here are a few of my favorite pics from my riding adventures.</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}></Col>
              <Col sm={4} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/motorcycle/hobbies_motorcycle_1.jpg' fluid />
              </Col>
              <Col sm={6} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/motorcycle/hobbies_motorcycle_3.jpg' fluid />
              </Col>
              <Col sm={1}></Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}></Col>
              <Col sm={5} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/motorcycle/hobbies_motorcycle_2.jpg' fluid />
              </Col>
              <Col sm={5} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/motorcycle/hobbies_motorcycle_4.jpg' fluid />
              </Col>
              <Col sm={1}></Col>
            </Row>
          </Container>

          <Container className="hobbiesSectionText">
            <Row className="show-grid hobbiesSection">
              <Col sm={1}></Col>
              <Col sm={11} className="hobbiesSectionTitle">Play Us A Song!</Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div>When it's nine o'clock on a saturday I know what I am doing! For the last couple of years I have been learning piano. And I am finally at the point where I can entertain a little at parties!</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}></Col>
              <Col sm={5} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/pianoman/hobbies_painoman_1.JPG' fluid />
              </Col>
              <Col sm={5} className="hobbies-motorcycle-image">
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/hobbies/pianoman/hobbies_painoman_2.JPG' fluid />
              </Col>
              <Col sm={1}></Col>
            </Row>
            <Row className="show-grid">
              <Col sm={1}></Col>
              <Col sm={10} className="hobbies-motorcycle-image">
                <ResponsiveEmbed aspectRatio="16by9">
                  <embed type="image/svg+xml" src="https://www.youtube.com/embed/p3lReoarymU"/>
                </ResponsiveEmbed>
              </Col>
              <Col sm={1}></Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

Hobbies.propTypes = {

};

export default Hobbies;