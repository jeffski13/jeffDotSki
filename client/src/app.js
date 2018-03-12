import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import BlogBrowser from './Blog/BlogBrowser';
import BlogPage from './Blog/BlogPage';
import Shotglass from './AboutMe/Shotglass';
import './style/style.css';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={TitlePage}/>
                <Route path="/blog/chile" component={BlogBrowser}/>
              <Route path="/aboutme/shotglass" component={Shotglass}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
