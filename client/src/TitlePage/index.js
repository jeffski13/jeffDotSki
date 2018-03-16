import React, { Component } from 'react';

import TitleImg from './TitleImg';
import AboutMe from './AboutMe';
import './styles.css';

class TitlePage extends Component{
  render(){
    return (
      <div className="TitlePage" >
        <TitleImg />
      </div>
    );
  }

}

export default TitlePage;