import React from 'react';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';
import withBlogAuth from '../Auth/withBlogAuth';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Loadingski from '../../Inf/Loadingski';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../Network/consts';
import { getBlogUserSecure } from '../BlogUser';
import { jeffskiRoutes } from '../../app';
import './styles.css';
import '../styles.css';

const emptyProfileUrl = 'https://s3.us-east-2.amazonaws.com/jeff.ski/blog/alone-anime-art-262272.jpg';

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
                    console.log('error on user info for profile: ', err);

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

    goToEditProfile = () => {
        this.props.history.push(jeffskiRoutes.profileEdit);
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
            userState = {
                name: 'Fail',
                username: 'Fail',
                email: 'Fail',
                dateOfBirth: 'Fail',
                bio: 'Fail'
            }
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

        return (
            <div className="User">
                <Grid>
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
                            <div className="Profile_profilepic" onClick={this.goToEditProfile}>
                                <Image responsive src={userState.profilePic} />
                            </div>
                        </Col>
                    </Row>

                    <Row className="show-grid Profile_bio">
                        <Col xs={8}>
                            <Col xs={12} >
                                <div className="Profile_title">Bio</div>
                                <div>{userState.bio}</div>
                            </Col>
                        </Col>
                        <Col xs={4}>
                            <Col xs={12} >
                                <div className="Profile_title">Trips</div>
                                {userState.trips && userState.trips.map(this.renderTripLinks)}
                            </Col>
                        </Col>
                    </Row>

                    <Row className="show-grid Profile_actions">
                        <Col xs={8} md={8}>
                            <span className="User_action-button" >
                                <Button
                                    onClick={this.goToEditProfile}
                                >
                                    Edit Profile
                                </Button>
                            </span>
                            <span className="User_action-button" >
                                <Button
                                    bsStyle="danger"
                                    onClick={this.props.blogAuth.logout}
                                >
                                    Logout
                                </Button>
                            </span>
                        </Col>
                    </Row>

                </Grid>

            </div >
        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Profile))); 