import React, { Component } from 'react';
import plane from './airplaneLoader.svg';

import './loading-styles.css';

class Preloader extends Component {
  render(){
    return(
      <div className="preloader" >
        <div className="preloader_container">
            <img id="airplane" src={plane} />
        </div>
      </div>
    );
  }
}

export default Preloader;