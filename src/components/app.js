import React, { Component } from 'react';
import TitlePage from './title-page';
import ReactLoading from 'react-loading';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div>
        <ReactLoading type="cubes" color="#42d" />
        <TitlePage />
      </div>
    );
  }
}
