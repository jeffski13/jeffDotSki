import React from 'react';
import { Button, Container, Row, Col, Image, Alert } from 'react-bootstrap';
import withBlogAuth from '../Auth/withBlogAuth';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { LinkContainer } from 'react-router-bootstrap';

import Loadingski from '../../Inf/Loadingski';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../Network/consts';
import { getBlogUserSecure, emptyProfileUrl } from '../BlogUser';
import { jeffskiRoutes } from '../../app';
import './styles.css';
import '../styles.css';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blogUserNetwork: STATUS_LOADING
        };
    }

    renderTripLinks = (nextTripInfo) => {
        return (
            <div key={nextTripInfo.id} >
                <Link to={`/${this.props.reduxBlogAuth.userInfo.id}/trips/${nextTripInfo.id}`} >{nextTripInfo.name}</Link>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            return this.getBlogUserProfile();
        }

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
    }

    componentDidUpdate(previousProps) {
        if (!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.getBlogUserProfile();
        }
    }

    getBlogUserProfile = () => {
        this.setState({
            blogUserNetwork: STATUS_LOADING
        }, () => {
            getBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, (err, blogUserInfo) => {
                if (err) {
                    if (err.status === 404 && err.data.code === 'NotFound') {
                        //user is not signed up with an account, but not blog information, send to register bloguser page
                        this.props.history.push(jeffskiRoutes.registerBlogUser);
                    }
                    return this.setState({
                        blogUserNetwork: STATUS_FAILURE
                    });
                }

                this.setState({
                    ...blogUserInfo,
                    name: `${blogUserInfo.nameFirst} ${blogUserInfo.nameLast}`,
                    blogUserNetwork: STATUS_SUCCESS
                });
            });
        });
    }

    goToEditProfileInfo = () => {
        this.props.history.push(jeffskiRoutes.profileEditInfo);
    }

    goToEditProfilePic = () => {
        this.props.history.push(jeffskiRoutes.profileEditPic);
    }

    render() {

        //if we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.props.history.push(jeffskiRoutes.login);
        }

        //loading state
        if (this.state.blogUserNetwork === STATUS_LOADING) {
            return (<Loadingski />);
        }

        let userState = {};
        if (this.state.blogUserNetwork === STATUS_LOADING) {
            userState = {
                name: 'Loading...',
                username: 'Loading...',
                email: 'Loading...',
                dateOfBirth: 'Loading...',
                bio: 'Loading...'
            };
        }
        else if (this.state.blogUserNetwork === STATUS_FAILURE) {
            return (
                <Row className="show-grid User_login-message">
                    <Col xs={2} md={4} />
                    <Col xs={8} md={4}>
                        <Alert variant="danger">
                            <Alert.Heading>Oh No!</Alert.Heading>
                            <span>
                                <span>Something went wrong while getting your profile info.</span>
                                <span className="Blogs_error-refresh" >
                                    <Button
                                        onClick={() => { window.location.reload() }}
                                        variant="link"
                                    >
                                        Refresh?
                                        </Button>
                                </span>
                            </span>
                        </Alert>
                    </Col>
                    <Col xs={2} md={4} />
                </Row>
            );
        }
        else {
            let profilePicUrl = emptyProfileUrl;
            if (this.state.profilePicUrl) {
                profilePicUrl = this.state.profilePicUrl;
            }
            userState = {
                ...this.state,
                username: this.props.reduxBlogAuth.userInfo.username,
                email: this.props.reduxBlogAuth.userInfo.email,
                profilePic: profilePicUrl
            };
        }

        const editLink = (<LinkContainer to={jeffskiRoutes.profileEditInfo}><a href={jeffskiRoutes.profileEdit}>Edit</a></LinkContainer>);

        return (
            <Container className="User">
                <Row className="show-grid">
                    <Col xs={12}>
                        <h2 className="Profile_header">{userState.username}</h2>
                    </Col>
                </Row>

                <Row className="show-grid">
                    <Col xs={8}>
                        <Col xs={12} >
                            <div className="Profile_title">Name</div>
                            <div>{userState.name}</div>
                        </Col>
                        <Col xs={12} >
                            <div className="Profile_title">Email</div>
                            <div>{userState.email}</div>
                        </Col>
                        <Col xs={12} >
                            <div className="Profile_title">Birth Date</div>
                            <div>{moment.unix(userState.dateOfBirth).format("MM/DD/YYYY")}</div>
                        </Col>
                    </Col>
                    <Col xs={4}>
                        <div className="Profile_profilepic" onClick={this.goToEditProfilePic}>
                            <Image fluid src={userState.profilePic} />
                            <Button
                                onClick={this.goToEditProfilePic}
                                variant="link"
                            >
                                Edit Image
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className="show-grid Profile_bio">
                    <Col xs={8}>
                        <Col xs={12} >
                            <div className="Profile_title">Bio</div>
                            {userState.bio
                                ? <div>{userState.bio}</div>
                                : <div className="Profile_empty-info">Your bio is empty. {editLink}</div>}
                        </Col>
                    </Col>
                    <Col xs={4}>
                        <Col xs={12} >
                            <div className="Profile_title">Trips</div>
                            {userState.trips && userState.trips.map(this.renderTripLinks)}
                            {(!userState.trips || userState.trips.length === 0) &&
                                <div className="Profile_empty-info">You have no trips.</div>}
                        </Col>
                    </Col>
                </Row>

                <Row className="show-grid">
                    <Col xs={1} sm={2} md={4} />
                    <Col xs={10} sm={8} md={4} className="User_actions-section">
                        <span className="User_action-button" >
                            <Button
                                onClick={this.goToEditProfileInfo}
                                variant="secondary"
                            >
                                Edit Info
                            </Button>
                        </span>
                        <span className="User_action-button" >
                            <Button
                                variant="danger"
                                onClick={this.props.blogAuth.logout}
                            >
                                Logout
                            </Button>
                        </span>
                    </Col>
                    <Col xs={1} sm={2} md={4} />
                </Row>

            </Container>

        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Profile))); 