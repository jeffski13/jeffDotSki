import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import TitlePage from './TitlePage';
import Shotglass from './AboutMe/Shotglass';
import Bio from './AboutMe/Bio';
import Hobbies from './AboutMe/Hobbies';
import Ali from './Ali';
import Careers from './Careers';
import ErrorPage from './ErrorPage';
import NavigationBar from './Inf/NavigationBar';
import FooterBarski from './Inf/FooterBarski';
import Login from './TravelersTrails/Login';
import RegisterBlogUser from './TravelersTrails/Signup/Register/BlogUser';
import RegisterAccount from './TravelersTrails/Signup/Register/Account';
import Verify from './TravelersTrails/Signup/Verify';
import Profile from './TravelersTrails/Profile';
import Blogs from './TravelersTrails/Blogs';
import TimelineExample from './TravelersTrails/Blogs/Timeline/TimelineExample';
import ProfileEditInfo from './TravelersTrails/Profile/EditInfo';
import ProfileEditPic from './TravelersTrails/Profile/EditPic';
import TravelTrailsHome from './TravelersTrails/Home';
import ManageTrips from './TravelersTrails/Trips';
import './styles.css';

export const jeffskiRoutes = {
    login: '/traveltrails/login',
    manageTrips: '/traveltrails/manageTrips',
    profile: '/traveltrails/profile',
    profileEditInfo: '/traveltrails/profile/edit',
    profileEditPic: '/traveltrails/profile/edit/pic',
    registerCognito: '/traveltrails/signup/register/account',
    registerBlogUser: '/traveltrails/signup/register/bloguser',
    travelTrailsHome: '/traveltrails',
    verify: '/traveltrails/signup/verify'
};

//eventually this will do all the routing...later not now,  someday
export default class App extends Component {
  render() {
    return (
      <div id="App" >
        <div className="webpagecontent">
            <Switch>
                <Route exact path="/" component={TitlePage}/>
                <Route exact path="/blog/chile" component={Blogs}/>
                <Route exact path="/blog/timeline" component={TimelineExample}/>
                <Route exact path="/aboutme/shotglass" component={Shotglass}/>
                <Route exact path="/aboutme/bio" component={Bio}/>
                <Route exact path="/careers" component={Careers}/>
                <Route exact path="/aboutme/hobbies" component={Hobbies}/>
                <Route exact path="/ali" component={Ali}/>
                <Route exact path={jeffskiRoutes.login} component={Login}/>
                <Route exact path={jeffskiRoutes.registerBlogUser} component={RegisterBlogUser}/>
                <Route exact path={jeffskiRoutes.registerCognito} component={RegisterAccount}/>
                <Route exact path={jeffskiRoutes.verify} component={Verify}/>
                <Route exact path={jeffskiRoutes.profile} component={Profile}/>
                <Route exact path={jeffskiRoutes.profileEditInfo} component={ProfileEditInfo}/>
                <Route exact path={jeffskiRoutes.profileEditPic} component={ProfileEditPic}/>
                <Route exact path={jeffskiRoutes.travelTrailsHome} component={TravelTrailsHome} />
                <Route exact path={jeffskiRoutes.manageTrips} component={ManageTrips} />
                <Route path="/traveltrails/:userId/trips/:tripId" component={Blogs} />
                <Route exact path="/traveltrails/:userId" component={Profile} />
                <Route component={ ErrorPage } />
            </Switch>
        </div>
      </div>
    );
  }
}