import React, {Component} from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';

import githubLogo from './github-logo.png';
import githubLogoShadow from './github-logo-shadow.png';
import ROUTES from '../../consts/ROUTES';
import './styles.css';

class FooterBarski extends Component {

  constructor(props){
    super(props);

    this.githubImgMouseOver = this.githubImgMouseOver.bind(this);
    this.gitihubImgMouseOut = this.gitihubImgMouseOut.bind(this);

    this.state = {
      isGithubMouseOver : false
    }
  }

  //on hover effect for the github logo link
  githubImgMouseOver(){
    this.setState({
      isGithubMouseOver: true
    });
  }

  //on hover effect for the github logo link
  gitihubImgMouseOut(){
    this.setState({
      isGithubMouseOver: false
    });
  }

  render(){
    let githubLogoImage = this.state.isGithubMouseOver ? githubLogoShadow : githubLogo;

    return(
      <Container className="FooterBarski" fluid>
        <Row className="show-grid">
          <Col xs={2} sm={1} />
          <Col xs={7} sm={10} className="footerBarskiLinkWrapper">
            <div className="footerLinksArea" >
                <a
                  href= "/careers"
                  className="footerBarskiLink"
                >
                  Careers?
                </a>
              <div className="footLinkDivider" >
                &nbsp;&bull;&nbsp;
              </div>
                <a
                  href={ROUTES.login}
                  className="footerBarskiLink"
                >
                  Account
                </a>
            </div>
          </Col>
          <Col xs={3} sm={1} >
            <a title="My Open Source Website!"
              href="https://github.com/jeffski13"
            >
              <Image src={githubLogoImage}
                className="githubLogo"
                onMouseOver={this.githubImgMouseOver}
                onMouseOut={this.gitihubImgMouseOut}
              />
            </a>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default FooterBarski;