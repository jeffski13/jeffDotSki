import React from 'react';
import PropTypes from 'prop-types';
import { Image, Grid, Row, Col } from 'react-bootstrap';
import './styles.css';

class TvShow extends React.Component {
  render(){
    return(
      
      <div className="TvShow" >
        <Grid>
          <Row className="show-grid">
            <Col xs={0} sm={2} />
            <Col xs={8} sm={2} >
              <div className="tvshowImageContainer" >
                <img className="tvshowImage" src={this.props.thumb} />
              </div>
            </Col>
            <Col xs={12} sm={4} >
              <div className="tvshowInfoContainer">
                <div className="tvshowInfo" >
                  <div className="tvshowTitle" >Show:</div>
                  <div className="tvshowText" >{this.props.title}</div>
                </div>
                <div className="tvshowInfo" >
                  <div className="tvshowTitle" >Season:</div>
                  <div className="tvshowText" >{this.props.season}</div>
                </div>
              </div>
            </Col>
            <Col xs={0} sm={4} />
            <Col xs={0} sm={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

TvShow.propTypes = {
  title: PropTypes.string,
  season: PropTypes.number,
  thumb: PropTypes.string
}

export default TvShow;