import { useState } from 'react';
import { Col } from 'react-bootstrap';
import type { DrawingItem } from "./drawings";
import './styles.css';

interface DrawingThumbailProps {
  drawingItem: DrawingItem;
  index: number;
  titleLabel: string;
  isTestEnvInstantLoad: boolean;
  onImageClicked: Function;
}

export const DrawingThumbail = ({drawingItem, index, titleLabel, isTestEnvInstantLoad, onImageClicked}: DrawingThumbailProps) => {
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
  if(!isImageLoaded) {
    loadImg(drawingItem.thumb);
  }
  
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
              alt={`${drawingItem.name} drawing${isImageLoaded ? '' : ' loading...'}`}
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