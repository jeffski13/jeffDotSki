
import { useMemo, useState } from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';
import githubLogo from './github-logo.png';
import githubLogoShadow from './github-logo-shadow.png';
import instaLogo from './instagram-logo.png';
import instaLogoShadow from './instagram-logo-shadow.png';
import packageJson from "package.json";
import './styles.css';
import ROUTES from '~/consts/ROUTES';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '~/langSupport';

export function FooterBarski() {
  const [isGithubImgMouseOver, setIsGithubImgMouseOver] = useState(false);
  const [isInstaMouseOver, setIsInstaMouseOver] = useState(false);

  let githubLogoImage = isGithubImgMouseOver ? githubLogoShadow : githubLogo;
  let instaLogoImage = isInstaMouseOver ? instaLogoShadow : instaLogo;

  const multiLangContent: MultiLangContent = {
    es: {
      version: 'Versión',
      githubTitle: '¡Mi sitio web de código abierto!',
      instagramTitle: 'Instagram',
    },
    default: {
      version: 'Version',
      githubTitle: 'My Open Source Website!',
      instagramTitle: 'Instagram',
    }
  };

  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());

  return(
    <Container className="FooterBarski" fluid>
      <Row className="show-grid">
        <Col xs={1} />
        <Col xs={5} sm={3} className="footerBarskiLinkWrapper">
          <div className="footerLinksArea" >
              {content.version}: {packageJson.version}
          </div>
        </Col>
        <Col xs={2} sm={6} />
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