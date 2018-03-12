import React, { Component } from 'react';

import Banner from '../Inf/Banner';
import TitleImg from './TitleImg';
import AboutMe from './AboutMe';
import './styles.css';

class TitlePage extends Component{
  render(){
    return (
      <div className="TitlePage" >
        <Banner />
        <TitleImg />
      </div>
    );
  }

}

export default TitlePage;