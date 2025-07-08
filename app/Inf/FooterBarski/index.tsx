import { useState } from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';

import githubLogo from './github-logo.png';
import githubLogoShadow from './github-logo-shadow.png';
import instaLogo from './instagram-logo.png';
import instaLogoShadow from './instagram-logo-shadow.png';
import packageJson from "package.json";
import './styles.css';

export function FooterBarski() {

  const [isGithubImgMouseOver, setIsGithubImgMouseOver] = useState(false);
  const [isInstaMouseOver, setIsInstaMouseOver] = useState(false);
  
  let githubLogoImage = isGithubImgMouseOver ? githubLogoShadow : githubLogo;
  let instaLogoImage = isInstaMouseOver ? instaLogoShadow : instaLogo;

  return(
    <Container className="FooterBarski" fluid>
      <Row className="show-grid">
        <Col xs={1} />
        <Col xs={5} sm={3} className="footerBarskiLinkWrapper">
          <div className="footerLinksArea" >
              Version: {packageJson.version}
          </div>
        </Col>
        <Col xs={2} sm={6} />
        <Col xs={2} sm={1} >
          <a title="Instagram"
            href="https://www.instagram.com/jeffski13/"
          >
            <Image src={instaLogoImage}
              className="footerLogo instagramLogo"
              onMouseOver={() => {
                setIsInstaMouseOver(true)
              }}
              onMouseOut={() => {
                setIsInstaMouseOver(false)
              }}
            />
          </a>
        </Col>
        <Col xs={2} sm={1} >
          <a title="My Open Source Website!"
            href="https://github.com/jeffski13"
          >
            <Image src={githubLogoImage}
              className="footerLogo githubLogo"
              onMouseOver={() => {
                setIsGithubImgMouseOver(true)
              }}
              onMouseOut={() => {
                setIsGithubImgMouseOver(false)
              }}
            />
          </a>
        </Col>
      </Row>
    </Container>
  );
}

export default FooterBarski;