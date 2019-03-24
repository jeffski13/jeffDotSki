import React from 'react';
import {Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {jeffskiRoutes} from '../../app';

import './styles.css';

export default class Home extends React.Component {
    render() {
        return (
            <div id="travelTrailsHome">
                <div className="TravelTrailsHome_titleContainer">
                    <h1 className="TravelTrailsHome_title">Welcome To<br/>Traveler's Trails</h1>
                    <Link to={jeffskiRoutes.login} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-full">LOGIN</Link>
                    <Link to={jeffskiRoutes.profile} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">PROFILE</Link>
                </div>
            </div>
        );
    }
}