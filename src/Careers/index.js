import React, { Component } from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import './styles.css';

class Careers extends Component {
  render() {
    return (
      <div className="Careers">
        <Container>
          <Row className="show-grid">
            <Col xs={1} >
            </Col>
            <Col xs={11} >
              <div className="careersTitle" >GOTCHA!</div>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={1} >
            </Col>
            <Col xs={11} >
              <div className="careersText" >Sorry, but jeff.ski is just a normal guy making a website (:</div>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={1} >
            </Col>
            <Col xs={11} >
              <div className="careersText" >But who knows!? Maybe we could set up some sort of unpaid internship if you want to shadow a developer!</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Careers;