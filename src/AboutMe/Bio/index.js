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
                  Great question! I was born in Illinois in 1991. Shortly after we moved to Indiana, then Texas, and finally settled down in Oklahoma in 1999. I claim Claremore, OK as my hometown. Looking back it was a small town, but it is still the largest city in the area (they even have a walmart!).
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph" >
              <Col sm={10} md={5} className="aboutMePargraphWithImage" >
                <p>
                  I graduated from Claremore High School in 2009 and went to Oklahoma State University (Stillwater, OK). While in college I was lucky enough to get a job in a different city every summer. In 2010 was "workin at the Ribcrib" (Stillwater), 2011 was in Las Vegas, 2012 Cessna (Wichita), 2013 was ABB Totalflow (Bartlesville, OK), and the summer of 2014 I interned at USAA in San Antonio, Texas.
                </p>
                <p>
                I enjoyed my summer internship, but being ten hours away from home was a bit too much at the time. Fortunately USAA was opening an office in Dallas, and that's how I eneded up here!
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
                  During college I wrote my first line of code. As a mechanical engineer I took a course in VBA. I distincly remember the professor writing "x = x + 1" in front of the class. Everyone just stared in silence, wondering how this algebraic conundrum could be so casually written in an engineering class (needless to say I had alot to learn!). I enjoyed VBA and intro to electrical circuits so much I changed my major to electrical engineering.
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} md={5} className="aboutMePargraphWithImage" >
                In the summer 2012 I moved to Bartlesville, Oklahoma. There I snagged my first "professional" job as a computer programmer. I put professional in quotes because I had absolutely no idea what I was doing. However, my dad had always said I needed to find something that I enjoyed, I was good at, and I could get paid for. I could get payed for it, and I definitely enjoyed it. And I was good...enough at it. It was the beginning of what I knew would be an exciting career!
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/a-professional-what.jpg' fluid />
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <p>
                  That summer I created a native android app, which is how I got my start in the mobile app space. During my internship in Stillwater I got a decent introduction to web development. In 2014 I traveled to San Antonio and continued android app development.
                </p>
                <p>
                  After graduating in December of 2014 I found myself moving to Dallas, far away from my familiar family and friends. But on an adventure. So many people had told me that while I was young and single, the thing I needed to do was go out and experience the world. And while I was definitely out of my comfort zone, I was as ready as ever for this. Las Vegas was my first time at a new company, and Wichita was my first time in a new city without friends. All of my prior experience had prepared me to succeed in this new city.
                </p>
                <p>
                  That is not to say I haven't made a ton of mistakes! Every day I learn more about thriving in the professional world of IT. And everyday I work to better myself to become the best version of myself!
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2 className="aboutMeSectionTitle">Say Hello!</h2>
                <p>
                  At the end of the day I am just a nerd. A threw a collage* together of things I spend too much time on. If you see anything we have in common, shoot me a message!
                </p>
                <p>
                  Say hello at: <span className="Bio_emailAddress">coffee at jeff DOT ski</span>
                </p>
              </Col>
            </Row>
            <Row className="show-grid BioHobbiesImg">
              <Col sm={10}  >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/myhobbies.png' fluid />
              </Col>
              <Col sm={6} smOffset={1} className="bioHobbieDisclaimer" >
                <p>
                  *Of course I don't own any of these images! (:
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