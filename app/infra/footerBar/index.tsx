
import { useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import githubLogo from './github-logo.png';
import githubLogoShadow from './github-logo-shadow.png';
import instaLogo from './instagram-logo.png';
import instaLogoShadow from './instagram-logo-shadow.png';
import packageJson from "package.json";
import ROUTES from '~/consts/ROUTES';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '~/langSupport';
import '../mobile-support.css';
import './styles.css';

interface ContentPerLanguage {
  version: string;
  githubTitle: string;
  builtBy: string;
  instagramTitle: string;
}

export function FooterBar() {
  const [isGithubImgMouseOver, setIsGithubImgMouseOver] = useState(false);
  const [isInstaMouseOver, setIsInstaMouseOver] = useState(false);

  let githubLogoImage = isGithubImgMouseOver ? githubLogoShadow : githubLogo;
  let instaLogoImage = isInstaMouseOver ? instaLogoShadow : instaLogo;

  const es: ContentPerLanguage = {
    version: 'Versión',
    githubTitle: '¡Mi sitio web de código abierto!',
    builtBy: 'Hecho con 🤍 por Jeff Szcinski',
    instagramTitle: 'Instagram',
  }
  const defaultText: ContentPerLanguage = {
    version: 'Version',
    githubTitle: 'My Open Source Website!',
    builtBy: 'Built with 🤍 by Jeff Szcinski',
    instagramTitle: 'Instagram',
  }

  const multiLangContent: MultiLangContent = {
    es,
    default: defaultText
  };
  const content: ContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

  return (
    <Container className="FooterBar" fluid>
      <Row className="show-grid">
        <Col xs={1} />
        <Col xs={5} sm={3} className="footerBarLinkWrapper">
          <div className="footerLinksArea" >
            {content.version}: {packageJson.version}
          </div>
        </Col>
        <Col xs={2} sm={6} className="footerBarLinkWrapper mobile-view">
        </Col>
        <Col xs={2} sm={6} className="footerBarLinkWrapper desktop-view">
          <div className="footerLinksArea" >
            {content.builtBy}
          </div>
        </Col>
        <Col xs={2} sm={1} >
          <a title={content.instagramTitle}
            href={ROUTES.external.instagram}
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
          <a title={content.githubTitle}
            href="https://github.com/jeffski13/jeffDotSki"
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

export default FooterBar;