import React, {Component} from 'react';
import {Container, Col, Row, Image} from 'react-bootstrap';

import '../styles.css';
import './styles.css';

class Bio extends Component {
  render(){
    return(
      <div className="aboutmeWrapper">
        <div className="shotGlassTextSection" >
          <Container>
            <Row className="show-grid">
              <Col sm={2} md={4}>
              </Col>
              <Col sm={6} md={4}>
                <div className="aboutMeTitle" >About Me</div>
              </Col>
              <Col sm={2} md={4}>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2 className="aboutMeSectionTitle" >How Did I Get Here?</h2>
                <p>
                  I was born in Illinois in 1991. Shortly after we moved to Indiana, then Texas, and finally settled down in Oklahoma in 1999 in Claremore. Looking back it was a small town, but it is still the largest city in the area.
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph" >
              <Col sm={10} md={5} className="aboutMePargraphWithImage" >
                <p>
                  I graduated from Claremore High School in 2009 and went to Oklahoma State University (Stillwater, OK). While in college I was lucky enough to get a job in a different city every summer, including Las Vegas (2011), and Cessna in Wichita (2012). In the summer of 2014 I interned at USAA in San Antonio, Texas.
                </p>
                <p>
                I enjoyed my summer internship, and decided I wanted to try programming as a profession.
                </p>
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/aboutme-myjourneymap.png' fluid />
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2 className="aboutMeSectionTitle">A Professional What?</h2>
                <p>
                  During college I wrote my first line of code. As a mechanical engineer I took a course in VBA. I distincly remember the professor writing "x = x + 1" in front of the class. Everyone just stared in silence, wondering how this algebraic conundrum could be so casually written in an engineering class. I enjoyed VBA and intro to electrical circuits so much I changed my major to electrical engineering.
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} md={5} className="aboutMePargraphWithImage" >
                In the summer 2013 I interned as a computer programmer. I had absolutely no idea what I was doing. However, my dad had always said I needed to find something that I enjoyed, I was good at, and I could get paid for. And I was good...enough at it. Fortunately I had great leaders over the years to help me improve.
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/a-professional-what.jpg' fluid />
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <p>
                  After graduating in December of 2014 I moved Dallas, far away from my familiar family and friends. So many people had told me that while I was young and single, the thing I needed to do was go out and experience the world. And while I was definitely out of my comfort zone, I was as ready as ever for this.
                </p>
                <p>
                  I started traveling the world in 2023 (Colombia, Peru, Argentina, and Chile). I work everyday to know more and improve my spanish and myself.
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2 className="aboutMeSectionTitle">Say Hello!</h2>
                <p>
                  At the end of the day I am just a nerd. A threw a collage* together of things I have enjoyed. If you see anything we have in common, shoot me a message!
                </p>
                <p>
                  Say hello at: <span className="Bio_emailAddress">coffee@jeff.ski</span>
                </p>
              </Col>
            </Row>
            <Row className="show-grid BioHobbiesImg">
              <Col sm={10}  >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/myhobbies.png' fluid />
              </Col>
              <Col sm={6} smOffset={1} className="bioHobbieDisclaimer" >
                <p>
                  *I don't own any of these images. Please support the official releases.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Bio;