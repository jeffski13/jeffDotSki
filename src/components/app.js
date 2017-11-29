import React, { Component } from 'react';
import ReactLoading from 'react-loading';

import TitlePage from './TitlePage';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div>
        <TitlePage />
      </div>
    );
  }
}