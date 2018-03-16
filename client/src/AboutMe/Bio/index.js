import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Col, Row, Image} from 'react-bootstrap';

import '../styles.css';

class Bio extends Component {
  render(){
    return(
      <div>
        <div className="shotGlassTextSection" >
          <Grid>
            <Col>
              <div className="aboutMeTitle" >About Me</div>
            </Col>
          </Grid>
          <Grid>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2>How Did I Get Here?</h2>
              </Col>
              <Col sm={10} >
                Great question! I was born in Illinois in 1991. Shortly after we moved to Indiana, to Texas, and finally settled down in Oklahoma in 1999. I claim Claremore, OK as my hometown. Looking back it was a small town, but its still the largest city in the area (they even have a walmart!). I graduated from Claremore High School in 2009 and went to Oklahoma State University (Stillwater, OK). While in college I got a was lucky enough to get a job in a different city every summer. In 2010 was workin at the Ribcrib (Stillwater), 2011 was in Las Vegas, 2012 Cessna (Wichita), 2013 was ABB Totalflow in Bartlesville, and the summer of 2014 I interned at USAA in San Antonio.
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} md={5} >
                I enjoyed my summer internship with USAA, but being ten hours away from home was a bit too much at the time. Fortunately USAA was opening an office in Dallas, and that's how I eneded up here!
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/aboutme-myjourneymap.png' responsive />
              </Col>
            </Row>
            <Row className="show-grid aboutMePargraph">
              <Col sm={10} >
                <h2>A Professional What?</h2>
              </Col>
              <Col sm={10} >
                During college wrote my first line of code. As a mechanical engineer I took a VBA course. I distincly remember the professor writing "x = x + 1" in front of the class. Everyone just stared in silence, wondering how such an algebraic conundrum could be so casually written in an engineering class. I enjoyed VBA and Circuits so much I changed my major to electrical engineering.
              </Col>
            </Row>
            <Row className="show-grid blogPargraph">
              <Col sm={10} md={5} >
                In the summer 2012 I moved to Bartlesville, Oklahoma. There I got my first "professional" job as a computer programmer. I put professional in quotes, not because the environement wasnt professional, but because I had absolutely no idea what I was doing. However, my dad had always said I needed to find something that I enjoyed, I was good at, and I could get paid for. I could get payed for it, and I definitely enjoyed it. And I was good...enough at it. I had alot to learn, but I knew I was onto something.
              </Col>
              <Col sm={10} md={5} >
                <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/a-professional-what.jpg' responsive />
              </Col>
            </Row>
            <Row className="show-grid blogPargraph">
              <Col sm={10} >
                That summer I created a native android app, which is how I got my start in the mobile app space. During my internship in Stillwater I got a decent introduction to web development. In 2014 I traveled to San Antonio and continued android app development.
              </Col>
              <Col sm={10} >
                After graduating in December of 2014 I found myself moving to Dallas, far away from my familiar family and friends. But on an adventure. So many people had told me that while I was young and single, the thing I needed to do was go out and experience the world. And while I was definitely out of my comfort zone, I was as ready as ever for this. Las Vegas was my first time at a new company, and Wichita was my first time in a new city without friends. All of my prior experience had prepared me to succeed in this new city.
              </Col>
              <Col sm={10} >
                That is not to say I didn't make a ton of mistakes! Every day I learn more about thriving in the professional world of IT. Slowly but surley I am mastering technical and social challenges, often dealing with them simultaneously.
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

Bio.propTypes = {

}

export default Bio;