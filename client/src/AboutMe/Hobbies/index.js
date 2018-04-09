import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import TvShow from './TvShow';
import tvshows from './hobbies-tvshows.json';
import '../styles.css';
import './styles.css';

class Hobbies extends React.Component{

  renderTvShows(tvshowItem, index){
    return(
      <li key={index} >
        <TvShow
          title={tvshowItem.title}
          season={tvshowItem.season}
          thumb={tvshowItem.thumb}
          />
      </li>
    )
  }

  render(){
    console.log(tvshows);
    return(
      <div className="aboutmeWrapper">
        <div className="shotGlassTextSection" >
          <Grid>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div className="aboutMeTitle" >Hobbies & Interests</div>
              </Col>
            </Row>
          </Grid>
          <Grid>
            <Row className="show-grid">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div>Over the years I've been obsessed with alot of things!
                  Here are some things in which I currently dabble.</div>
              </Col>
            </Row>
            <Row className="show-grid hobbiesSection">
              <Col sm={1}>
              </Col>
              <Col sm={11}>
                <div className="hobbiesSectionTitle">TV Shows:</div>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={2}>
              </Col>
              <Col sm={10}>
              </Col>
            </Row>
          </Grid>
          <ul className="tvshowList" >
            {tvshows.map(this.renderTvShows)}
          </ul>
        </div>
      </div>
    );
  }
}

Hobbies.propTypes = {

};

export default Hobbies;