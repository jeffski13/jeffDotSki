import React from 'react';
import {jeffskiRoutes} from '../../app';
import { Link } from 'react-router-dom';

import './styles.css';

export default class Home extends React.Component {
    render() {
        return (
            <div id="travelTrailsHome">
                <div className="TravelTrailsHome_titleContainer">
                    <h1 className="TravelTrailsHome_title">Welcome To<br/>Travel Trails</h1>
                    <Link to={jeffskiRoutes.login} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-full">LOGIN</Link>
                    <Link to={jeffskiRoutes.profile} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">PROFILE</Link>
                </div>
            </div>
        );
    }
}