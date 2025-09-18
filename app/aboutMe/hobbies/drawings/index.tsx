import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import '../styles.css';
import { drawings, drawingsHalloween, type DrawingItem } from './drawings';

// Fullscreen overlay state and handler will be managed in Drawings component
const renderDrawings = (drawingItem: DrawingItem, index, titleLabel: string, onImageClicked: Function) => {
  return (
    <Col xs={12} md={6} lg={4} key={index}>
      <li>
        <div className="hobbieItemInfoContainer">
          <div className="hobbieItemInfo" >
            <div className="hobbieItemTitle" >{titleLabel}</div>
            <div className="hobbieItemText" >{drawingItem.name}</div>
          </div>
        </div >
        <div className="HobbieContentItem" >
          <div className="hobbieImageContainer" >
            <img
              className="hobbieImage drawingImage"
              src={drawingItem.thumb}
              alt={`${drawingItem.name} Drawing`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log(index)
                onImageClicked();
              }}
            />
          </div>
        </div>
      </li>
    </Col>
  );
};

interface DrawingsProps {
  drawingsList: DrawingItem[];
  drawingsHalloweenList: DrawingItem[];
}

export default function DrawingsPage() {
  return (
    <Drawings drawingsList={drawings} drawingsHalloweenList={drawingsHalloween} />
  );
}

export function Drawings({
  drawingsList,
  drawingsHalloweenList
}: DrawingsProps) {
  const [overlayImg, setOverlayImg] = useState<string | null>(null);

  const multiLangContent = {
    es: {
      title: 'Dibujos',
      intro: 'Empecé a dibujar como pasatiempo durante la pandemia. ¡Con el tiempo encontré mi estilo! ¡Que disfrutas!',
      spooky: 'Dibujos Espeluznantes:',
      spookyDesc: 'A mi familia le gusta el estilo de El Mundo Loco De Jack, así que creé estos:',
      titleLabel: 'Título:',
    },
    default: {
      title: 'Drawings',
      intro: 'I started drawing as a hobby during the pandemic. Over the years I feel I have found my style. Enjoy!',
      spooky: 'Spooky Drawings:',
      spookyDesc: 'My family likes the spooky nightmare before christmas style, so I created these:',
      titleLabel: 'Title:',
    }
  };
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
  return (
    <div className="aboutmeWrapper">
      <div className="hobbiesSection" >
        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <h1 className="aboutMeTitle" >{content.title}</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.intro}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {drawingsList.map(
                (item, i) => renderDrawings(item, i, content.titleLabel, () => {setOverlayImg(item.full)})
              )}
            </Row>
          </ul>
        </Container>

        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <div className="hobbiesSectionTitle">{content.spooky}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.spookyDesc}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {drawingsHalloweenList.map(
                (item, i) => renderDrawings(item, i, content.titleLabel, () => {setOverlayImg(item.full)})
              )}
            </Row>
          </ul>
        </Container>
        {/* Fullscreen overlay for image */}
        {overlayImg && (
          <div
            className="drawing-fullscreen-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setOverlayImg(null)}
            aria-label="Close full screen image"
          >
            <img
              src={overlayImg}
              alt="Full drawing"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 12,
                boxShadow: '0 2px 24px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}