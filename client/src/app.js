import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import BlogBrowser from './Blog/BlogBrowser';
import BlogPage from './Blog/BlogPage';
import Shotglass from './AboutMe/Shotglass';
import ErrorPage from './ErrorPage';
import './style/style.css';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={TitlePage}/>
        <Route path="/blog/chile" component={BlogBrowser}/>
        <Route path="/aboutme/shotglass" component={Shotglass}/>
        <Route component={ ErrorPage } />
      </Switch>
    );
  }
}