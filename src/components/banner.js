import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';

const Banner =()=>{
  return (
    <Jumbotron>
      <h1 className='titleOfWebsite' >JEFF.SKI</h1>
      <p>Title Page for jeff.ski</p>
      <p><Button bsStyle="primary">Learn more</Button></p>
    </Jumbotron>
  );
}

export default Banner;