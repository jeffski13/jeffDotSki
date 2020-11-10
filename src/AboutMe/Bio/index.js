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
                  I graduated from Claremore High School in 2009 and went to Oklahoma State University (Stillwater, OK). While in college I was lucky enough to get a differnt job in a different city every summer. In 2010 was "workin at the Ribcrib" (Stillwater), 2011 was in Las Vegas, 2012 Cessna (Wichita), 2013 was ABB Totalflow (Bartlesville, OK), and the summer of 2014 I interned at USAA in San Antonio, Texas.
                </p>
                <p>
                I enjoyed my summer internship, but being ten hours away from home was a bit too much at the time. Fortunately USAA was opening an office in Dallas.
                </p>
                <p>
                After about five years of the "big city life" being four hours away from home was too much. So I moved to Oklahoma city. I miss my Dallas friends a ton but life in OKC is good.
                </p>
                <p>
                And that's how I eneded up here!
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
                  Back in colllege I remember the professor writing "x = x + 1", and being so confused (needless to say I had alot to learn!). Now here I am 6 years later. And I am a professional!
                </p>
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} md={5} className="aboutMePargraphWithImage" >
                I started my career as a web developer for Beardon Services. Then I start in Android Development for USAA. I then worked in R&D for USAA: Virtual Reality, Amazon Fire TV, Android Wear, tons of cool stuff! Things came full circle when I dove back into web development again in 2017 (this site is made in react!).
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/a-professional-what.jpg' fluid />
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <p>
                  Currently I am working at Boeing, enjoying life near family and old friends. And everyday I work hard to become the best version of myself!
                </p>
                <p>
                  Also if you have read this far...THANK YOU! Seriously I appreciate it. I will never know why you took this much interest in my life story, but thank you for listening!
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