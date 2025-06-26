import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import './styles.css';

class TvShow extends React.Component {
  render() {

    let seasonRender = null;
    if (this.props.season) {
      seasonRender = (<div className="tvshowInfo" >
        <div className="tvshowTitle" >Season:</div>
        <div className="tvshowText" >{this.props.season}</div>
      </div>
      );
    }

    return (

      <div className="TvShow" >
        <Container>
          <Row className="show-grid">
            <Col xs={0} sm={2} />
            <Col xs={8} sm={2} >
              <div className="tvshowImageContainer" >
                <img className="tvshowImage" src={this.props.thumb} alt={`${this.props.title} Show`} />
              </div>
            </Col>
            <Col xs={12} sm={4} >
              <div className="tvshowInfoContainer">
                <div className="tvshowInfo" >
                  <div className="tvshowTitle" >Show:</div>
                  <div className="tvshowText" >{this.props.title}</div>
                </div>
                {seasonRender}
              </div >
            </Col>
            <Col xs={0} sm={4} />
            <Col xs={0} sm={2} />
          </Row>
        </Container>
      </div>
    );
  }
}

TvShow.propTypes = {
  title: PropTypes.string.isRequired,
  season: PropTypes.number,
  thumb: PropTypes.string
}

export default TvShow;