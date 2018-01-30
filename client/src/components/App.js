import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import BlogPage from './BlogPage';
import Banner from './Banner';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={TitlePage}/>
              <Route path="/blog/chile" component={BlogPage}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
