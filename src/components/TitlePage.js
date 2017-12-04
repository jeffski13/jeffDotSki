import React, { Component } from 'react';

import Banner from './Banner';
import TitleImg from './TitleImg';
import AboutMe from './AboutMe';

class TitlePage extends Component{
  render(){
    return (
      <div>
        <Banner />
        <TitleImg />
        <AboutMe />
      </div>
    );
  }

}

export default TitlePage;