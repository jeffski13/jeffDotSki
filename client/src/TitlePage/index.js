import React, { Component } from 'react';

import NavigationBar from '../Inf/NavigationBar';
import TitleImg from './TitleImg';
import AboutMe from './AboutMe';
import './styles.css';

class TitlePage extends Component{
  render(){
    return (
      <div className="TitlePage" >
        <NavigationBar />
        <TitleImg />
      </div>
    );
  }

}

export default TitlePage;