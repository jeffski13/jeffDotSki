import React from 'react';
import { Button, Container, Row, Col, Image, Alert, FormGroup, FormControl, Form } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { LinkContainer } from 'react-router-bootstrap';

import withBlogAuth from '../Auth/withBlogAuth';
import AirplaneLoader from '../../Inf/AirplaneLoader';
import AirplaneLoaderOverlay from '../../Inf/AirplaneLoader/Overlay';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import { validateFormString, FORM_SUCCESS } from '../../formvalidation';
import { getBlogUserSecure, emptyProfileUrl } from '../BlogUser';
import { createTripSecure } from '../TripsForUser';
import { jeffskiRoutes } from '../../app';
import './styles.css';
import '../styles.css';

const initialTripFormState = {
    name: {
        value: '',
        isValid: false,
        validationMessage: ''
    },
    isValidated: false
};

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.newTripNameInputRef = React.createRef();

        this.state = {
            blogUserNetwork: STATUS_LOADING,
            showMoreBio: false,
            isEditEnabled: false,
            blogUserInfo: null,
            isAddTripUiShowing: false,
            addTripNetwork: null,
            addTripForm: { ...initialTripFormState },
            createTripResults: null
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

    componentDidUpdate(previousProps, previousState) {
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

        //focuses on new trip name input 
        if (!previousState.isAddTripUiShowing && this.state.isAddTripUiShowing) {
            this.newTripNameInputRef.current.focus();
        }
    }

    getBlogUserProfile = () => {
        let isUserBlogOwner = false;
        //if user is logged in and looking at his or her own blogs, show edit links
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.match.params.userId || !this.props.match.params.userId)) {
            isUserBlogOwner = true;
        }
        else {
            isUserBlogOwner = false;
        }

        this.setState({
            isEditEnabled: isUserBlogOwner,
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

    isValidTripName = (tripNameInQuestion) => {
        // check for duplicate trip names
        if (this.state.blogUserInfo.trips) {
            for (let i = 0; i < this.state.blogUserInfo.trips.length; i++) {
                if (tripNameInQuestion.trim() === this.state.blogUserInfo.trips[i].name.trim()) {
                    return false;
                }
            }
        }
        return validateFormString(tripNameInQuestion) === FORM_SUCCESS;
    }

    //returns true if the blog is ready to be submitted to the server
    isAddTripFormSubmitAllowed = () => {
        //form should not submit if we are currently uploading anything
        if (this.state.addTripNetwork === STATUS_LOADING) {
            return false;
        }

        if (this.state.addTripForm.name.isValid) {
            return true;
        }

        return false;
    }

    submitAddNewTripForm = (event) => {
        // if we have valid trip name and we are not loading right now, try to create a new trip
        event.preventDefault();
        event.stopPropagation();

        //if empty, back out of editting mode
        if (this.state.addTripForm.name.value === '') {
            return this.setState({
                addTripForm: { ...initialTripFormState },
                isAddTripUiShowing: false,
                createTripResults: null,
                addTripNetwork: null
            });
        }

        if (this.isAddTripFormSubmitAllowed()) {
            this.addNewTrip();
        }
        this.setState({
            addTripForm: { ...this.state.addTripForm, isValidated: true }
        });
    }

    addNewTrip = () => {
        this.setState({
            addTripNetwork: STATUS_LOADING
        }, () => {
            let tripInfo = {
                name: this.state.addTripForm.name.value
            }
            createTripSecure(this.props.reduxBlogAuth.userInfo.id, tripInfo, (err, data) => {
                if (err) {
                    return this.setState({
                        addTripNetwork: STATUS_FAILURE,
                        createTripResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                }
                //declare victory! and clear out trip creation stuff
                //add the trip to the trips array
                let updatedTrips = this.state.blogUserInfo.trips;
                updatedTrips.unshift(data.trip);
                const updatedBlogUserInfo = { trips: updatedTrips };

                this.setState({
                    addTripNetwork: STATUS_SUCCESS,
                    createTripResults: {
                        message: 'Trip Created!'
                    },
                    addTripForm: { ...initialTripFormState },
                    isAddTripUiShowing: false,
                    blogUserInfo: { ...this.state.blogUserInfo, updatedBlogUserInfo }
                });
            });
        })
    }

    renderTripLinks = (nextTripInfo) => {
        return (
            <div key={nextTripInfo.id} >
                <Link to={`${jeffskiRoutes.travelTrailsHome}/${this.state.blogUserInfo.id}/trips/${nextTripInfo.id}`} >{nextTripInfo.name}</Link>
            </div>
        );
    }

    renderTripArea = () => {
        //special cases in which we have no trips
        let tripsList = null;
        if ((!this.state.blogUserInfo.trips || this.state.blogUserInfo.trips.length === 0)) {
            if (this.state.isEditEnabled) {
                tripsList = (
                    <div className="Profile_empty-info">You have no trips.</div>
                );
            }
            else {
                tripsList = (
                    <div className="Profile_empty-info">This user has no trips.</div>
                );
            }
        }
        else {
            tripsList = this.state.blogUserInfo.trips.map(this.renderTripLinks)
        }

        let tripAddButton = null;
        let addTripForm = null;
        if (this.state.isEditEnabled) {
            if (this.state.isAddTripUiShowing) {
                let addTripFeedbackArea = null;
                if (this.state.addTripNetwork === STATUS_FAILURE) {
                    let addTripFailMessage = 'An error occured. Please try again later.';
                    if (this.state.createTripResults.message) {
                        addTripFailMessage = this.state.createTripResults.message;
                    }
                    addTripFeedbackArea = (
                        <div className="Profile_trip-section-addTripErrorMesssage">{addTripFailMessage}</div>
                    )
                }

                addTripForm = (
                    <Form
                        className="Profile_trip-section-addTripForm"
                        onSubmit={e => this.submitAddNewTripForm(e)}
                    >
                        <FormGroup
                            controlId="nameFormInput"
                        >
                            <label className="has-float-label">
                                <FormControl
                                    type="text"
                                    value={this.state.addTripForm.name.value || ''}
                                    placeholder="Name Your Adventure"
                                    onChange={(e) => {
                                        let tripUpdateInfo = {
                                            name: {
                                                value: e.target.value,
                                                isValid: this.isValidTripName(e.target.value)
                                            }
                                        };
                                        this.setState({
                                            addTripForm: { ...this.state.addTripForm, ...tripUpdateInfo }
                                        });
                                    }}
                                    isInvalid={this.state.addTripForm.isValidated && !this.state.addTripForm.name.isValid}
                                    onBlur={this.submitAddNewTripForm}
                                    disabled={this.state.addTripNetwork === STATUS_LOADING}
                                    ref={this.newTripNameInputRef}
                                />
                                <span>New Trip</span>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.addTripForm.name.validationMessage || 'Your trip name must be unique.'}
                                </Form.Control.Feedback>
                            </label>
                        </FormGroup>
                        {addTripFeedbackArea}
                    </Form>
                );
            }
            else {
                tripAddButton = (
                    <span className="Profile_trip-section-addTripButton">
                        <Button
                            onClick={() => this.setState({ isAddTripUiShowing: true })}
                            variant="success"
                            size="sm"
                        >
                            New Trip
                    </Button>
                    </span>
                );
            }
        }

        return (
            <Col xs={12}>
                <div className="Profile_title">Trips{tripAddButton}</div>
                {addTripForm}
                {tripsList}
            </Col>
        )
    }

    render() {

        //loading state
        if (this.state.blogUserNetwork === STATUS_LOADING) {
            return (<AirplaneLoader />);
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
            <div className="Profile">
                {
                    this.state.addTripNetwork === STATUS_LOADING && <AirplaneLoaderOverlay />
                }
                <Container className="User" >
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
                            {this.renderTripArea()}
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
            </div>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Profile)));