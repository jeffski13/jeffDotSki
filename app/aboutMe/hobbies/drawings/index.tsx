import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import { drawings, drawingsHalloween, type DrawingItem } from './drawings';
import '../hobbiesStyles.css';

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
  const [overlayIndex, setOverlayIndex] = useState<{ list: 'normal' | 'halloween'; idx: number } | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<'left' | 'right' | null>(null);

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

  // Keyboard, touch navigation, and scroll lock effect
  useEffect(() => {
    if (!overlayImg) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIdx = getOverlayIdx();
      if (currentIdx === -1) return;
        if (e.key === 'ArrowLeft') {
          const prevIdx = (currentIdx - 1 + combinedLists.length) % combinedLists.length;
          setOverlayImg(combinedLists[prevIdx].full);
        } else if (e.key === 'ArrowRight') {
          const nextIdx = (currentIdx + 1) % combinedLists.length;
          setOverlayImg(combinedLists[nextIdx].full);
        }
    };

    let touchStartX: number | null = null;
    let touchEndX: number | null = null;
    const minSwipeDistance = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      if (touchStartX !== null && touchEndX !== null) {
        const diff = touchEndX - touchStartX;
        const currentIdx = getOverlayIdx();
        if (Math.abs(diff) > minSwipeDistance && currentIdx !== -1) {
          if (diff < 0) {
            setSwipeAnim('left');
            setTimeout(() => {
              const nextIdx = (currentIdx + 1) % combinedLists.length;
              setOverlayImg(combinedLists[nextIdx].full);
              setSwipeAnim(null);
            }, 200);
          } else if (diff > 0) {
            setSwipeAnim('right');
            setTimeout(() => {
              const prevIdx = (currentIdx - 1 + combinedLists.length) % combinedLists.length;
              setOverlayImg(combinedLists[prevIdx].full);
              setSwipeAnim(null);
            }, 200);
          }
        }
      }
      touchStartX = null;
      touchEndX = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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
              overflow: 'hidden',
            }}
            onClick={() => setOverlayImg(null)}
            aria-label="Close full screen image"
          >
            <img
              src={overlayImg}
              alt="Full drawing"
              className={swipeAnim ? `drawing-swipe-${swipeAnim}` : ''}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 12,
                boxShadow: '0 2px 24px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
                transform: swipeAnim === 'left' ? 'translateX(-100vw)' : swipeAnim === 'right' ? 'translateX(100vw)' : 'translateX(0)',
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