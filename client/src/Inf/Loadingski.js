import React, { Component } from 'react';
import ReactLoading from 'react-loading';

import './loading-styles.css';

class Loadingski extends Component {
  render(){
    return(
      <div className="Loadingski" >
        <ReactLoading type="cylon" color="#333" height="100px" width="100px"/>
      </div>
    );
  }
}

export default Loadingski;