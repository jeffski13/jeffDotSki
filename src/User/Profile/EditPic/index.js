import React from 'react';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert, Image } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { withRouter, Link } from 'react-router-dom';

import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { jeffskiRoutes } from '../../../app';
import { connect } from 'react-redux';
import withBlogAuth from '../../Auth/withBlogAuth';
import { getBlogUserSecure, updateBlogUserSecure, emptyProfileUrl, profileGetFailMessage } from '../../BlogUser';
import Loadingski from '../../../Inf/Loadingski';
import '../../styles.css';
import SingleImageUpload from './SingleImageUpload';
import ImageForm from './ImageForm';

class ProfileEditPic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileFetchNetwork: STATUS_LOADING,
            profileFetchNetworkMessage: null,
            profileEditNetwork: null,
            profileEditNetworkMessage: null,
            profileNetworkThrottle: false,
            profilePic: emptyProfileUrl,
            uploadedProfilePicUrl: null,
            formRefreshProp: false //needed?
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
            return this.props.blogAuth.checkForAuth();
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
            profileFetchNetwork: STATUS_LOADING
        }, () => {
            getBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, (err, blogUserInfo) => {
                if (err) {
                    return this.setState({
                        profileFetchNetwork: STATUS_FAILURE,
                        profileFetchNetworkMessage: profileGetFailMessage
                    });
                }

                this.setState({
                    ...blogUserInfo,
                    profileFetchNetwork: STATUS_SUCCESS
                });
            });
        });
    }

    isFormDisabled = () => {
        return this.state.profileEditNetwork === STATUS_LOADING;
    }

    isFormInvalid = () => {
        return this.state.profileEditNetwork === STATUS_LOADING;
    }

    onSaveProfilePic = () => {
        //set title image to loading (this will trigger the updload of said title image)
        this.setState({
            profileEditNetwork: STATUS_LOADING
        });
    }

    onCancelProfileChanges = () => {
        //go back to profile
        this.props.history.push(jeffskiRoutes.profile);
    }

    onTitleImageUploadComplete = (errData, uploadedProfilePicData) => {
        if (errData) {
            console.log("error uploading title image ", errData.filename, " with error ", errData.error);
            this.setState({
                titleImgNetworkStatus: STATUS_FAILURE,
                networkStatusErrorMesage: errData.error.message
            });
            return;
        }

        //success
        this.setState({
            uploadedProfilePicUrl: uploadedProfilePicData.url
        }, () => {
            const updatedUserInfo = {
                profilePic: this.state.uploadedProfilePicUrl
            }
            updateBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, updatedUserInfo, (err, data) => {
                if (err) {
                    return this.setState({
                        profileEditNetwork: STATUS_FAILURE
                    });
                }

                //WE DID IT! let state decide where we go from here
                this.setState({
                    profileEditNetwork: STATUS_SUCCESS,
                    profileEditNetworkMessage: 'Profile updated successfully',
                    profileNetworkThrottle: true
                });

                setTimeout(() => {
                    this.setState({
                        profileEditNetwork: null,
                        profileEditNetworkMessage: null,
                        profileNetworkThrottle: false
                    });
                }, 3000);
            });
        });
    };

    goToEditProfilePic = () => {
        this.props.history.push(jeffskiRoutes.profileEditPic);
    }

    storeProfilePic = (imgData) => {
        console.log('edit profile pic image selected');
        this.setState({ titleImage: imgData });
    }

    render() {

        //if we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.props.history.push(jeffskiRoutes.login);
        }

        //loading state
        if (this.state.profileFetchNetwork === STATUS_LOADING) {
            return (<Loadingski />);
        }
        if (this.state.profileFetchNetworkMessage === profileGetFailMessage) {
            return (
                <div className="ProfileEditInfo">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={0} sm={2} md={4} />
                            <Col xs={12} sm={8} md={4}>
                                <h2 className="User_header-title">Edit Profile</h2>
                            </Col>
                            <Col xs={0} sm={2} md={4} />
                        </Row>
                        <Row className="show-grid User_error-message">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <Alert bsStyle="danger">
                                    <strong>Oh No! </strong>{this.state.profileFetchNetworkMessage}
                                </Alert>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>
                    </Grid>
                </div>
            );
        }

        return (
            <div className="ProfileEditInfo">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="User_header-title">Edit Profile Pic</h2>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>

                    <form>
                        <Row className="show-grid">
                            <Col xs={0} sm={2} md={5} />
                            <Col xs={12} sm={8} md={2}>
                                <div className="Profile_profilepic ProfileEditInfo_profilepic" onClick={this.goToEditProfilePic}>
                                    <Image responsive src={this.state.profilePic} />
                                </div>
                            </Col>
                            <Col xs={0} sm={2} md={5} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={0} sm={2} md={5} />
                            <Col xs={12} sm={8} md={2}>
                                <ImageForm
                                    refreshProp={this.state.formRefreshProp}
                                    imageSelectedCallback={(imgData) => {
                                        //NOTE to implementing components: 
                                        //formDataCallback can/should be called with data parameter as null if form data is invalid
                                        this.storeProfilePic(imgData)
                                    }}
                                />
                            </Col>
                            <Col xs={0} sm={2} md={5} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4} className="User_actions-section">
                                <span className="User_action-button" >
                                    <Button
                                        disabled={this.isFormDisabled() || this.isFormInvalid() || this.state.profileNetworkThrottle}
                                        bsStyle="primary"
                                        onClick={this.onSaveProfilePic}
                                    >
                                        Save
                                    </Button>
                                </span>
                                <span className="User_action-button" >
                                    <Button
                                        disabled={this.isFormDisabled()}
                                        onClick={this.onCancelProfileChanges}
                                    >
                                        Back To Profile
                                    </Button>
                                </span>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        {this.state.profileEditNetwork === STATUS_FAILURE &&
                            <Row className="show-grid User_error-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No! </strong>{this.state.profileEditNetworkMessage}
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }

                        {this.state.profileEditNetwork === STATUS_SUCCESS &&
                            <Row className="show-grid User_error-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="success">
                                        <strong>YAY! </strong>{this.state.profileEditNetworkMessage}
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }

                        {this.state.titleImage && this.state.profileEditNetwork === STATUS_LOADING &&
                            <SingleImageUpload imageFileToUpload={this.state.titleImage}
                                tripId={this.props.reduxBlogAuth.userInfo.id}
                                onPhotoFinished={this.onTitleImageUploadComplete}
                            />
                        }
                    </form>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(ProfileEditPic)));