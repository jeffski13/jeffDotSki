import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { HashLink } from "react-router-hash-link";
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import { jeffskiRoutes } from '../../app';
import withBlogAuth from '../Auth/withBlogAuth';
import AirplaneLoader from '../../Inf/AirplaneLoader';

import './styles.css';

class Home extends React.Component {

    componentWillMount() {
        //configure anchors with offset to account for ever-present header
        configureAnchors({ offset: -60, scrollDuration: 1000 });
    }

    componentDidMount() {
        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            return this.props.blogAuth.checkForAuth();
        }
    }

    render() {
        if (this.props.reduxBlogAuth.authState.isLoading) {
            return (<AirplaneLoader />);
        }

        //show different button options if user is logged in
        let firstButtonText = 'LOGIN';
        let pageTitlePrefix = 'Welcome To';
        let secondLink = <Link to={jeffskiRoutes.registerCognito} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">SIGN UP</Link>
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            firstButtonText = 'PROFILE';
            pageTitlePrefix = 'Welcome Back To';
            secondLink = <a href="#TravelTrailsHome-about-section" id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-ghost">ABOUT</a>;
        }

        let titleAndLinks = (
            <div className="TravelTrailsHome_titleContainer">
                <h1 className="TravelTrailsHome_title">{pageTitlePrefix}<br />Traveler's Trails</h1>
                <Link to={jeffskiRoutes.login} id="travelTrailHome-buttonLeft" className="TravelTrail_button TravelTrail_button-full">{firstButtonText}</Link>
                {secondLink}
            </div>
        );

        return (
            <Container fluid className="TravelTrailsHome_container">
                <Row noGutters={true} >
                    <Col className="d-none d-sm-block">
                        <div id="travelTrailsHome">
                            {titleAndLinks}
                        </div>
                    </Col>
                    <Col className="d-block d-sm-none TravelTrailers_mobile">
                        <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/traveltrail/home/traveltrail_home_md.jpg" />
                        <div className="TravelTrailers_mobile-text">
                            {titleAndLinks}
                        </div>
                    </Col>
                </Row>
                <Row className="TravelTrailsHome_about">
                    <Col xs={12} sm={0} className="TravelTrailsHome_aboutTitle">
                        <ScrollableAnchor id={'TravelTrailsHome-about-section'}>
                            <h2>What trail will you make?</h2>
                        </ScrollableAnchor>
                    </Col>
                    <Col xs={12} sm={12} md={6} className="TravelTrailsHome_about-image">
                        <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/traveltrail/home/traveltrail_home_diary_md.jpg" roundedCircle fluid />
                        <div className="TravelTrailsHome_about-imagetext">Photo by rue 🌷 on Reshot</div>
                    </Col>
                    <Col xs={12} sm={12} md={6} className="TravelTrailsHome_about-text">
                        <div className="TravelTrailsHome_about-text-container">
                            <h3>An Adventure that Lasts Forever</h3>
                            <ul>
                                <li><strong>A Personal Diary: </strong>Write all your adventures and memory in your travel book.</li>
                                <li><strong>Embrace the Experience: </strong>Journaling while on vacation will help you take in the moment.</li>
                                <li><strong>Beautiful Memories: </strong>Enjoy high quality photos of your adventures.</li>
                                <li><strong>Leave a Legacy: </strong> Someday you could hand your experience down to your grandchildren!</li>
                            </ul>
                            {/* <li><strong>AWS Serverless Officionado: </strong> Goodbye server management, hello microservices!</li> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withBlogAuth(Home));