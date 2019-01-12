import React from 'react';
import Image from 'react-bootstrap/lib/Image'
import titleImage from './TitleChileCerroSanCristobal.jpg'
import './styles.css';

const TitleImg = () => {
  return(
    <div className="TitleImage" >
      <Image src={titleImage} responsive />
    </div>
  );
}

export default TitleImg;