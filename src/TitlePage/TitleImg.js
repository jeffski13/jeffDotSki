import React from 'react';
import {Image} from 'react-bootstrap';
import './styles.css';

const TitleImg = () => {
  return(
    <div className="TitleImage" >
      <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/TitleChileCerroSanCristobal-md.jpg" fluid />
    </div>
  );
}

export default TitleImg;