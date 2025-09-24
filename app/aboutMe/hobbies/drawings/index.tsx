import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import { drawings, drawingsHalloween, type DrawingItem } from './drawings';
import '../hobbiesStyles.css';
import '../../../Inf/mobile-support.css';
import './styles.css';

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

  // Combine both lists for navigation
  const combinedLists = [
    ...drawingsList.map((item, idx) => ({ ...item, list: 'normal', idx })),
    ...drawingsHalloweenList.map((item, idx) => ({ ...item, list: 'halloween', idx }))
  ];

  // Find the current overlay index in combinedLists
  const getOverlayIdx = () => {
    if (!overlayImg) return -1;
    return combinedLists.findIndex(item => item.full === overlayImg);
  };

  const imageFullNext = () => {
    const currentIdx = getOverlayIdx();
    if (currentIdx === -1) return;
    const prevIdx = (currentIdx - 1 + combinedLists.length) % combinedLists.length;
    setOverlayImg(combinedLists[prevIdx].full);
  }

  const imageFullPrevious = () => {
    const currentIdx = getOverlayIdx();
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + 1) % combinedLists.length;
    setOverlayImg(combinedLists[nextIdx].full);
  }

  const imageFullNone = () => {
    setOverlayImg(null);
  }

  // Keyboard, touch navigation, and scroll lock effect
  useEffect(() => {
    if (!overlayImg) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        imageFullNext();
      } else if (e.key === 'ArrowRight') {
        imageFullPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayImg]);

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
                (item, i) => renderDrawings(item, i, content.titleLabel, () => {
                  setOverlayImg(item.full);
                  // Optionally set overlayIndex if you want to track which list
                })
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
                (item, i) => renderDrawings(item, i, content.titleLabel, () => {
                  setOverlayImg(item.full);
                  // Optionally set overlayIndex if you want to track which list
                })
              )}
            </Row>
          </ul>
        </Container>
        {/* Fullscreen overlay for image */}

        {overlayImg && (
          <div
            className="drawing-fullscreen-overlay fullImageArea"
            onClick={e => {
              // Only close overlay if click is outside the image
              console.log(e.currentTarget)
              if (e.target === e.currentTarget) {
                imageFullNone();
                return;
              }
            }}
            aria-label="Navigate or close full screen image"
          >
            <div className='fullImageNavigation'>
              <div className="fullImageDirectionClose">
                <button
                  aria-label="Close full screen image"
                  onClick={() => imageFullNone()}
                >
                  &#10005;
                </button>
              </div>
              <div className="mobile-view fullImageDirectionLabelContainer">
                <div className="mobile-view fullImageDirectionLabelContent">
                  <div className="fullImageDirectionLabel fullImageDirectionLabelLeft"
                    onClick={() => { imageFullPrevious() }}
                  >
                    <span style={{ fontSize: 20 }}>←</span> Tap Left
                  </div>
                  <div className="fullImageDirectionLabel fullImageDirectionLabelRight"
                    onClick={() => { imageFullNext() }}
                  >
                    Tap Right <span style={{ fontSize: 20 }}>→</span>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={overlayImg}
              alt="Full drawing"
              className="fullImage"
              onClick={e => {
                // Otherwise, handle navigation
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = (e as React.MouseEvent).clientX - rect.left;
                const currentIdx = getOverlayIdx();
                if (x < rect.width / 2) {
                  // Left side: previous image
                  if (currentIdx !== -1) {
                    const prevIdx = (currentIdx - 1 + combinedLists.length) % combinedLists.length;
                    setOverlayImg(combinedLists[prevIdx].full);
                  }
                } else {
                  // Right side: next image
                  if (currentIdx !== -1) {
                    const nextIdx = (currentIdx + 1) % combinedLists.length;
                    setOverlayImg(combinedLists[nextIdx].full);
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


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