import React from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';

const TitleSlideShow = () =>{
  return (
    <Carousel>
      <Carousel.Item>
        <img className='titleSlideShowImg' width={900} height={500} alt="900x500" src="/img/ChileSantiagoOverlook.jpg" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='titleSlideShowImg' width={900} height={500} alt="900x500" src="/img/ChilePuertoVarasRedBoat.jpg" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='titleSlideShowImg' width={900} height={500} alt="900x500" src="/img/ChilePuconBoatShore.jpg" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default TitleSlideShow;