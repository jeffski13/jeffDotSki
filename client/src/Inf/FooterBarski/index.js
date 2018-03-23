import React, {Component} from 'react';
import {Grid, Row, Col, Image} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import githubLogo from './github-logo-light.png';
import './styles.css';

class FooterBarski extends Component {
  render(){
    return(
      <Grid className="FooterBarski">
        <Row className="show-grid">
          <Col xs={2} sm={1} />
          <Col xs={7} sm={10} className="techSupportLinkWrapper">
            <div className="footerLinksArea" >
              <a
                href= "mailto:techsupport@jeff.ski"
                className="techSupportLink"
              >
                Website Support
              </a>
              <div>
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </div>
              <LinkContainer to="/careers">
                <a
                  href= "#"
                  className="techSupportLink"
                >
                  Careers?
                </a>
  		    	  </LinkContainer>
            </div>
          </Col>
          <Col xs={3} sm={1} >
            <a title="My Open Source Website!"
              href="https://github.com/jeffski13/jeffDotSki/tree/master/client"
            >
              <Image src={githubLogo}
                className="githubLogo"
              />
            </a>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default FooterBarski;