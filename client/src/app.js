import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import BlogBrowser from './Blog/BlogBrowser';
import Shotglass from './AboutMe/Shotglass';
import Bio from './AboutMe/Bio';
import ErrorPage from './ErrorPage';
import NavigationBar from './Inf/NavigationBar';
import FooterBarski from './Inf/FooterBarski';
import Careers from './Careers';
import './styles.css';

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div id="App" >
        <NavigationBar />
        <div className="webpagecontent">
          <Switch>
            <Route exact path="/" component={TitlePage}/>
            <Route path="/blog/chile" component={BlogBrowser}/>
            <Route path="/aboutme/shotglass" component={Shotglass}/>
            <Route path="/aboutme/bio" component={Bio}/>
            <Route path="/careers" component={Careers}/>
            <Route component={ ErrorPage } />
          </Switch>
          <FooterBarski />
        </div>
      </div>
    );
  }
}