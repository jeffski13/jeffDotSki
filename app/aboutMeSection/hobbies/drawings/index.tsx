import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '../../../langSupport';
import { drawings, drawingsHalloween, type DrawingItem } from './drawings';
import '../hobbiesStyles.css';
import '../../../infra/mobile-support.css';
import './styles.css';

interface ContentPerLanguage {
  title: string;
  intro: string;
  spooky: string;
  spookyDesc: string;
  titleLabel: string;
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
    titleLabel: 'Título:',
  }
  const defaultText: ContentPerLanguage = {
    title: 'Drawings',
    intro: 'I started drawing as a hobby during the pandemic. Over the years I feel I have found my style. Enjoy!',
    spooky: 'Spooky Drawings:',
    spookyDesc: 'My family likes the spooky nightmare before christmas style, so I created these:',
    titleLabel: 'Title:',
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
                (item, i) => renderDrawings(item, i, content.titleLabel, isTestEnvInstantLoad, () => {
                  loadOverlayImg(item.full);
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
                (item, i) => renderDrawings(item, i, content.titleLabel, isTestEnvInstantLoad, () => {
                  loadOverlayImg(item.full);
                  // Optionally set overlayIndex if you want to track which list
                })
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
            <div className='fullImageNavigation'>
              <div className="fullImageDirectionClose noselect">
                <button
                  aria-label="Close full screen image"
                  onClick={() => doNotShowImageFull()}
                >
                  &#10005;
                </button>
              </div>
              <div className="mobile-view fullImageDirectionLabelContainer">
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
              <p className="full-screen-image-loading-text">loading...</p>
            </div>
            <img
              id={`full-image-${getOverlayIdx()}`}
              src={overlayImg}
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
          </div>
        )}
      </div>
    </div>
  );
}


// Fullscreen overlay state and handler will be managed in Drawings component
const renderDrawings = (drawingItem: DrawingItem, index, titleLabel: string, isTestEnvInstantLoad: boolean, onImageClicked: Function) => {
  const [isImageLoaded, setImageLoaded] = useState<boolean>(false);
  const [thumbnailImg, setThumbnailImg] = useState<string | null>(null);
  const loadImg = (imagePath: string) => {
    if (!imagePath) {
      return;
    }
    
    if (isTestEnvInstantLoad) {
      onImageLoadedSuccessfully(imagePath)
      return;
    }
    setImageLoaded(false);
    const img = new Image();
    img.src = drawingItem.thumb;
    img.onload = () => {
      onImageLoadedSuccessfully(imagePath)
    };
    img.onerror = () => {
      // if there's an error loading, still set the path so the div can try
      onImageLoadedSuccessfully(drawingItem.thumb)
    };
  }
  
  const onImageLoadedSuccessfully = (imagePath: string) => {
    setImageLoaded(true);
    setThumbnailImg(imagePath);
  }
  let delayLoadTime = 100*index;
  if(isTestEnvInstantLoad) {
    delayLoadTime = 0;
  }
  setTimeout(()=> {
    loadImg(drawingItem.thumb);
  }, delayLoadTime);

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
            <div className={`thumbnail-image-loading-text-container ${isImageLoaded ? 'loaded' : 'loading'}`} >
              <p className="hobbieImageLoadingLabel">loading...</p>
            </div>
            <img
              src={thumbnailImg}
              alt={`${drawingItem.name} drawing ${isImageLoaded ? '' : ' loading...'}`}
              className={`hobbieImage drawingImage ${isImageLoaded ? 'loaded' : 'loading'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onImageClicked();
              }}
            />
          </div>
        </div>
      </li>
    </Col>
  );
};