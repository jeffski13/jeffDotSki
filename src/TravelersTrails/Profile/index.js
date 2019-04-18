import React from 'react';
import { Button, Container, Row, Col, Image, Alert } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { LinkContainer } from 'react-router-bootstrap';

import withBlogAuth from '../Auth/withBlogAuth';
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
            blogUserNetwork: STATUS_LOADING,
            showMoreBio: false,
            isEditEnabled: false,
            blogUserInfo: null
        };
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
        else {
            this.getBlogUserProfile();
        }
    }

    componentDidUpdate(previousProps) {
        if ((!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) || (previousProps.match.params.userId !== this.props.match.params.userId)) {
            this.getBlogUserProfile();
        }
        //if user logs out they cannot possibly edit the profile
        if (previousProps.reduxBlogAuth.authState.isLoggedIn && !this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.setState({
                isEditEnabled: false
            });
            this.goToLogin();
        }
    }

    getBlogUserProfile = () => {
        //if user is logged in and looking at his or her own profile, show edit links
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.match.params.userId || !this.props.match.params.userId)) {
            this.setState({
                isEditEnabled: true
            });
        }
        else {
            this.setState({
                isEditEnabled: false
            });
        }

        this.setState({
            blogUserNetwork: STATUS_LOADING,
            blogUserInfo: null
        }, () => {
            let userId = this.props.match.params.userId;
            //if we are logged in and on our profile use our id
            if (!userId && this.props.reduxBlogAuth.authState.isLoggedIn) {
                userId = this.props.reduxBlogAuth.userInfo.id;
            }
            getBlogUserSecure(userId, (err, blogUserInfo) => {
                if (err) {
                    if (err.status === 404 && err.data.code === 'NotFound') {
                        //user is not signed up with an account, but not blog information, send to register bloguser page
                        this.props.history.push(jeffskiRoutes.registerBlogUser);
                    }
                    return this.setState({
                        blogUserNetwork: STATUS_FAILURE
                    });
                }

                console.log('user info found ', blogUserInfo);

                this.setState({
                    blogUserInfo: {
                        ...blogUserInfo,
                        name: `${blogUserInfo.nameFirst} ${blogUserInfo.nameLast}`,
                    },
                    blogUserNetwork: STATUS_SUCCESS
                });
            });
        });
    }

    goToLogin = () => {
        this.props.history.push(jeffskiRoutes.login);
    }

    logout = () => {
        this.props.blogAuth.logout();
    }

    goToEditProfileInfo = () => {
        this.props.history.push(jeffskiRoutes.profileEditInfo);
    }

    goToEditProfilePic = () => {
        this.props.history.push(jeffskiRoutes.profileEditPic);
    }

    goToLoggedInProfile = () => {
        this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
    }

    renderTripLinks = (nextTripInfo) => {
        return (
            <div key={nextTripInfo.id} >
                <Link to={`${jeffskiRoutes.travelTrailsHome}/${this.state.blogUserInfo.id}/trips/${nextTripInfo.id}`} >{nextTripInfo.name}</Link>
            </div>
        );
    }

    render() {

        //loading state
        if (this.state.blogUserNetwork === STATUS_LOADING) {
            return (<Loadingski />);
        }

        let userState = {};
        if (this.state.blogUserNetwork === STATUS_FAILURE) {
            return (
                <Row className="show-grid User_login-message">
                    <Col xs={2} md={4} />
                    <Col xs={8} md={4}>
                        <Alert variant="danger">
                            <Alert.Heading>Oh No!</Alert.Heading>
                            <span>
                                <span>Something went wrong while getting profile info.</span>
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
        else if (this.state.blogUserNetwork === STATUS_SUCCESS) {
            let profilePicUrl = emptyProfileUrl;
            if (this.state.blogUserInfo.profilePicUrl) {
                profilePicUrl = this.state.blogUserInfo.profilePicUrl;
            }
            userState = {
                ...this.state.blogUserInfo,
                profilePic: profilePicUrl
            };
        }

        const editLink = (<LinkContainer to={jeffskiRoutes.profileEditInfo}><a href={jeffskiRoutes.profileEdit}>Edit</a></LinkContainer>);

        // ui for bio: show more/show less for bio if really long
        let bioArea = null;
        if (userState.bio) {
            let bioShowMoreUi = null;
            let isBioLongWinded = false;
            if (userState.bio.length > 300) {
                isBioLongWinded = true;
                let showMoreText = 'Show More';
                if (this.state.showMoreBio) {
                    showMoreText = 'Show Less';
                }
                bioShowMoreUi = (
                    <span className="Profile_bio-show-more-less" >
                        <Button
                            onClick={() => {
                                this.setState({ showMoreBio: !this.state.showMoreBio });
                            }}
                            variant="link"
                        >
                            {showMoreText}
                        </Button>
                    </span>
                );
            }
            bioArea = (
                <React.Fragment>
                    <div className="Profile_title">Bio</div>
                    <div className="Profile_bio">{userState.bio.substring(0, 300)}{!this.state.showMoreBio && isBioLongWinded && <span>...</span>}{this.state.showMoreBio && userState.bio.substring(300)}{bioShowMoreUi}</div>
                </React.Fragment>
            );
        }
        else {
            if (this.state.isEditEnabled) {
                bioArea = (
                    <div className="Profile_empty-info">Your bio is empty. {editLink}</div>
                );
            }
            else {
                bioArea = (
                    <div className="Profile_empty-info">This bio is empty.</div>
                );
            }
        }

        return (
            <Container className="User Profile">
                <Row className="show-grid">
                    <Col xs={9}>
                        <h2 className="Profile_header">{userState.username}</h2>
                    </Col>
                    {!this.state.isEditEnabled && !this.props.reduxBlogAuth.authState.isLoggedIn &&
                        <Col xs={3} className="User_action-button-login-area">
                            <span className="User_action-button" >
                                <Button
                                    onClick={this.goToLogin}
                                >
                                    Login
                                </Button>
                            </span>
                        </Col>}
                    {!this.state.isEditEnabled && this.props.reduxBlogAuth.authState.isLoggedIn &&
                        <Col xs={3} className="User_action-button-login-area">
                            <span className="User_action-button" >
                                <Button
                                    onClick={this.goToLoggedInProfile}
                                >
                                    Profile
                                </Button>
                            </span>
                        </Col>}

                </Row>

                <Row className="show-grid">
                    <Col xs={0} />
                    {this.state.isEditEnabled
                        ? <Col xs={6} md={8}>
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
                        : <Col xs={12} md={8}>
                            {bioArea}
                        </Col>
                    }
                    {this.state.isEditEnabled
                        ? <Col xs={6} md={4}>
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
                        : <Col xs={12} md={4}>
                            <Image fluid src={userState.profilePic} />
                        </Col>
                    }
                    <Col xs={0} />
                </Row>

                <Row className="show-grid">
                    <Col xs={12} md={8} className="Profile_bio-trip-row">
                        <Col xs={12}>
                            {this.state.isEditEnabled
                                ? bioArea
                                : null}
                        </Col>
                    </Col>
                    <Col xs={12} md={4} className="Profile_bio-trip-row">
                        <Col xs={12}>
                            <div className="Profile_title">Trips {this.state.isEditEnabled &&
                                    <span>
                                        <Button
                                            onClick={() => { this.props.history.push(jeffskiRoutes.manageTrips); }}
                                            variant="link"
                                        >
                                            Manage Trips
                                        </Button>
                                    </span>}
                                </div>
                            {userState.trips && userState.trips.map(this.renderTripLinks)}
                            {(!userState.trips || userState.trips.length === 0) && this.state.isEditEnabled &&
                                <div className="Profile_empty-info">You have no trips.</div>}
                            {(!userState.trips || userState.trips.length === 0) && !this.state.isEditEnabled &&
                                <div className="Profile_empty-info">This user has no trips.</div>}
                        </Col>
                    </Col>
                </Row>
                {
                    this.state.isEditEnabled &&
                    <Row className="show-grid">
                        <Col xs={1} sm={2} md={4} />
                        <Col xs={10} sm={8} md={6} lg={4} className="User_actions-section">
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
                                    onClick={this.logout}
                                >
                                    Logout
                                </Button>
                            </span>

                        </Col>
                        <Col xs={1} sm={2} md={4} />
                    </Row>
                }

            </Container>

        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Profile)));