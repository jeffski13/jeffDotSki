import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '../../../infra/langSupport/langSupport';
import { drawings, drawingsHalloween, type DrawingItem } from './drawings';
import '../hobbiesStyles.css';
import '../../../infra/mobile-support.css';
import './styles.css';
import { DrawingThumbail } from './DrawingThumbnail';

interface ContentPerLanguage {
  title: string;
  intro: string;
  spooky: string;
  spookyDesc: string;
}

interface DrawingsProps {
  drawingsList: DrawingItem[];
  drawingsHalloweenList: DrawingItem[];
  isTestEnvInstantLoad?: boolean;
}

export default function DrawingsPage() {
  return (
    <Drawings drawingsList={drawings} drawingsHalloweenList={drawingsHalloween} />
  );
}

export function Drawings({
  drawingsList,
  drawingsHalloweenList,
  isTestEnvInstantLoad = false
}: DrawingsProps) {
  const es: ContentPerLanguage = {
    title: 'Dibujos',
    intro: 'Empecé a dibujar como pasatiempo durante la pandemia. ¡Con el tiempo encontré mi estilo! ¡Que disfrutas!',
    spooky: 'Dibujos Espeluznantes:',
    spookyDesc: 'A mi familia le gusta el estilo de El Mundo Loco De Jack, así que creé estos:',
  }
  const defaultText: ContentPerLanguage = {
    title: 'Drawings',
    intro: 'I started drawing as a hobby during the pandemic. Over the years I feel I have found my style. Enjoy!',
    spooky: 'Spooky Drawings:',
    spookyDesc: 'My family likes the spooky nightmare before christmas style, so I created these:',
  }

  const multiLangContent: MultiLangContent = {
    es,
    default: defaultText
  };
  const content: ContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());


  const [isFullScreenMode, setIsFullScreenMode] = useState<boolean>(false);
  const [overlayImg, setOverlayImg] = useState<string | null>(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState<boolean>(false);

  // Combine both lists for navigation
  const combinedLists = [
    ...drawingsList.map((item, idx) => ({ ...item, list: 'normal', idx })),
    ...drawingsHalloweenList.map((item, idx) => ({ ...item, list: 'halloween', idx }))
  ];

  // Find the current overlay index in combinedLists
  const getOverlayIdx = () => {
    if (!overlayImg) {
      return -1;
    }
    return combinedLists.findIndex(item => item.full === overlayImg);
  };

  const loadOverlayImg = (fullScreenImagePath: string) => {
    if (!fullScreenImagePath) {
      return;
    }

    setIsFullScreenMode(true);

    if (isTestEnvInstantLoad) {
      onImageLoadedSuccessfully(fullScreenImagePath)
      return;
    }

    setOverlayImg(null);
    setBackgroundLoaded(false);
    const img = new Image();
    img.src = fullScreenImagePath;
    img.onload = () => {
      onImageLoadedSuccessfully(fullScreenImagePath)
    };
    img.onerror = () => {
      // if there's an error loading, still set the path so the div can try
      onImageLoadedSuccessfully(fullScreenImagePath)
    };
  }

  const onImageLoadedSuccessfully = (fullScreenImagePath: string) => {
    setBackgroundLoaded(true);
    setOverlayImg(fullScreenImagePath);
  }

  const showImageFullNext = () => {
    const currentIdx = getOverlayIdx();
    if (currentIdx === -1) {
      return;
    }
    const nextIdx = (currentIdx + 1) % combinedLists.length;
    loadOverlayImg(combinedLists[nextIdx].full);
  }

  const showImageFullPrevious = () => {
    const currentIdx = getOverlayIdx();
    if (currentIdx === -1) {
      return;
    }
    const prevIdx = (currentIdx - 1 + combinedLists.length) % combinedLists.length;
    loadOverlayImg(combinedLists[prevIdx].full);
  }

  const doNotShowImageFull = () => {
    setIsFullScreenMode(false);
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
        showImageFullPrevious();
      } else if (e.key === 'ArrowRight') {
        showImageFullNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayImg]);

  // Escape closes the overlay, even while the image is still loading
  useEffect(() => {
    if (!isFullScreenMode) {
      return;
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        doNotShowImageFull();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isFullScreenMode]);

  const closeButton = (
    <button
      aria-label="Close full screen image"
      className="fullImageCloseButton"
      onClick={() => doNotShowImageFull()}
    >
      &#10005;
    </button>
  );

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
                (item, i) => <DrawingThumbail key={item.full+i} drawingItem={item} index={i} isTestEnvInstantLoad={isTestEnvInstantLoad} 
                onImageClicked={() => {
                  loadOverlayImg(item.full);
                  // Optionally set overlayIndex if you want to track which list
                }}  />
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
                (item, i) => <DrawingThumbail key={item.full+i}  drawingItem={item} index={i} isTestEnvInstantLoad={isTestEnvInstantLoad} 
                onImageClicked={() => {
                  loadOverlayImg(item.full);
                  // Optionally set overlayIndex if you want to track which list
                }}  />
              )}
            </Row>
          </ul>
        </Container>
        {/* Fullscreen overlay for image */}

        {isFullScreenMode && (
          <div
            className="drawing-fullscreen-overlay fullImageArea"
            onClick={e => {
              // Only close overlay if click is outside the image
              if (e.target === e.currentTarget) {
                doNotShowImageFull();
                return;
              }
            }}
            aria-label="Navigate or close full screen image"
          >
            <div className="fullImageNavigation d-sm-none">
              <div className="fullImageDirectionClose noselect">
                {closeButton}
              </div>
              <div className="fullImageDirectionLabelContainer">
                <div className="fullImageDirectionLabelContent">
                  <div className="fullImageDirectionLabel fullImageDirectionLabelLeft noselect"
                    onClick={() => { showImageFullPrevious() }}
                  >
                    <span className="noselect">←</span> Tap Left
                  </div>
                  <div className="fullImageDirectionLabel fullImageDirectionLabelRight noselect"
                    onClick={() => { showImageFullNext() }}
                  >
                    Tap Right <span className="noselect">→</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`full-screen-image-loading-text-container ${backgroundLoaded ? 'loaded' : 'loading'}`} >
              <Spinner animation="border" role="status" className="full-screen-image-loading-spinner">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <div className="fullImageFrame">
              {/* On sm+ the close button sits above the left arrow */}
              <div className="fullImageFrameClose noselect d-none d-sm-flex">
                {closeButton}
              </div>
              <button
                aria-label="Previous drawing"
                className="fullImageArrow fullImageArrowLeft d-none d-sm-flex"
                onClick={() => showImageFullPrevious()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8" /></svg>
              </button>
              <img
                id={`full-image-${getOverlayIdx()}`}
                src={overlayImg ? overlayImg : undefined}
                alt={`Full drawing${backgroundLoaded ? '' : ' loading...'}`}
                className={`fullImage ${backgroundLoaded ? 'loaded' : 'loading'}`}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const x = (e as React.MouseEvent).clientX - rect.left;
                  if (x < rect.width / 2) {
                    showImageFullPrevious();
                  } else {
                    showImageFullNext();
                  }
                }}
              />
              <button
                aria-label="Next drawing"
                className="fullImageArrow fullImageArrowRight d-none d-sm-flex"
                onClick={() => showImageFullNext()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}