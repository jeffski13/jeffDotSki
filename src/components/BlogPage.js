import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';

import BlogSlideShow from './BlogSlideShow';

class BlogPage extends Component {
  render(){
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <PageHeader>Toast the Trip!<small>(Dallas Fort Worth Airport)</small></PageHeader>
          </Row>
          <Row className="show-grid">
            <div>10/14/17</div>
          </Row>
          <Row className="show-grid blogPargraph">
            <Col sm={8} md={4} >I arrived early! Which I am definitely doing from now on. Instead of stressing out over flight times and security, I got to sit in the airport bar and watch the OSU cowboys dominate their homecoming (which I will be attending next year, and probably create an anniversary blog for that). And the early start was much needed, a week before they changed my flight time, so I would have a 16 hour layover in Mexico City. But definitely a great start to the trip! I say always toast the trip (:</Col>
            <Col sm={8} md={4} >
              <img className="blogimg1" src="/img/chileTripToast.jpg"  height={300} />
            </Col>
          </Row>
          <Row className="show-grid blogPargraph">
            <Col xs={8} >I arrived early! Which I am definitely doing from now on. Instead of stressing out over flight times and security, I got to sit in the airport bar and watch the OSU cowboys dominate their homecoming (which I will be attending next year, and probably create an anniversary blog for that). And the early start was much needed, a week before they changed my flight time, so I would have a 16 hour layover in Mexico City. But definitely a great start to the trip! I say always toast the trip (:</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default BlogPage;