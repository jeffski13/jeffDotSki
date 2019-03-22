import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import Blogs from './Blogs';
import Shotglass from './AboutMe/Shotglass';
import Bio from './AboutMe/Bio';
import ErrorPage from './ErrorPage';
import NavigationBar from './Inf/NavigationBar';
import FooterBarski from './Inf/FooterBarski';
import Careers from './Careers';
import Login from './User/Login';
import RegisterBlogUser from './User/Signup/Register/BlogUser';
import RegisterAccount from './User/Signup/Register/Account';
import Verify from './User/Signup/Verify';
import Profile from './User/Profile';
import Hobbies from './AboutMe/Hobbies';
import TimelineExample from './Blogs/Timeline/TimelineExample';
import ProfileEditInfo from './User/Profile/EditInfo';
import ProfileEditPic from './User/Profile/EditPic';
import TravelTrailsHome from './TravelTrails/Home';
import './styles.css';

export const jeffskiRoutes = {
    travelTrailsHome: '/traveltrails',
    login: '/traveltrails/login',
    profile: '/traveltrails/profile',
    profileEditInfo: '/traveltrails/profile/edit',
    profileEditPic: '/traveltrails/profile/edit/pic',
    registerCognito: '/traveltrails/signup/register/account',
    registerBlogUser: '/traveltrails/signup/register/bloguser',
    verify: '/traveltrails/signup/verify'
};

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div id="App" >
        <NavigationBar />
        <div className="webpagecontent">
            <Switch>
                <Route exact path="/" component={TitlePage}/>
                <Route path="/blog/chile" component={Blogs}/>
                <Route path="/blog/timeline" component={TimelineExample}/>
                <Route path="/aboutme/shotglass" component={Shotglass}/>
                <Route path="/aboutme/bio" component={Bio}/>
                <Route path="/careers" component={Careers}/>
                <Route path="/aboutme/hobbies" component={Hobbies}/>
                <Route path={jeffskiRoutes.login} component={Login}/>
                <Route path={jeffskiRoutes.registerBlogUser} component={RegisterBlogUser}/>
                <Route path={jeffskiRoutes.registerCognito} component={RegisterAccount}/>
                <Route exact path={jeffskiRoutes.verify} component={Verify}/>
                <Route exact path={jeffskiRoutes.profile} component={Profile}/>
                <Route exact path={jeffskiRoutes.profileEditInfo} component={ProfileEditInfo}/>
                <Route exact path={jeffskiRoutes.profileEditPic} component={ProfileEditPic}/>
                <Route exact path={jeffskiRoutes.travelTrailsHome} component={TravelTrailsHome} />
                <Route path="/:userId/trips/:tripId" component={Blogs} />
                <Route component={ ErrorPage } />
            </Switch>
            <FooterBarski />
        </div>
      </div>
    );
  }
}