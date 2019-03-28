import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jeffskiRoutes } from '../../app';

import './styles.css';

export default class Home extends React.Component {
    render() {
        return (
            <Container fluid className="TravelTrailsHome_container">
                <Row noGutters={true} >
                    <Col className="d-none d-sm-block">
                        <div id="travelTrailsHome">
                            <div className="TravelTrailsHome_titleContainer">
                                <h1 className="TravelTrailsHome_title">Welcome To<br />Traveler's Trails</h1>
                                <Link to={jeffskiRoutes.login} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-full">LOGIN</Link>
                                <Link to={jeffskiRoutes.profile} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">PROFILE</Link>
                            </div>
                        </div>
                    </Col>
                    <Col className="d-block d-sm-none TravelTrailers_mobile">
                        <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/traveltrail/home/traveltrail_home_md.jpg" />
                        <div className="TravelTrailsHome_titleContainer TravelTrailers_mobile-text">
                            <h1 className="TravelTrailsHome_title">Welcome To<br />Traveler's Trails</h1>
                            <Link to={jeffskiRoutes.login} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-full">LOGIN</Link>
                            <Link to={jeffskiRoutes.profile} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">PROFILE</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}