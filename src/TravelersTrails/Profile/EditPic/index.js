import React from 'react';
import { Button, Container, Row, Col, FormGroup, ControlLabel, FormControl, Alert, Image } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import { jeffskiRoutes } from '../../../app';
import withBlogAuth from '../../Auth/withBlogAuth';
import { getBlogUserSecure, updateBlogUserSecure, emptyProfileUrl, profileGetFailMessage } from '../../BlogUser';
import AirplaneLoader from '../../../Inf/AirplaneLoader';
import ImageForm from '../../image-processing/ImageForm';
import loadingImage from '../../../loading_image.gif';
import ResizeProfileImg from '../../image-processing/ResizeProfileImg';
import '../../styles.css';

class ProfileEditPic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileFetchNetwork: STATUS_LOADING,
            profileFetchNetworkMessage: null,
            profileEditNetwork: null,
            profileEditNetworkMessage: null,
            profileNetworkThrottle: false,
            profilePicUrl: emptyProfileUrl,
            newProfilePicUrl: null,
            newProfilePic: null,
            uploadedProfilePicUrl: null,
            imagePreviewLoading: false,
            formRefreshProp: false //needed?
        };
    }

    componentDidMount() {
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            return this.getBlogUserProfile();
        }

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the. We might be able to do the authcheck as an action and use redux exclusively.
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
        return this.state.profileEditNetwork === STATUS_LOADING || this.state.profileFetchNetwork === STATUS_LOADING;
    }

    isFormInvalid = () => {
        return this.isFormDisabled() || !this.state.newProfilePicUrl || !this.state.newProfilePic;
    }

    onSaveProfilePic = () => {
        //set title image to loading (this will trigger the updload of said title image)
        this.setState({
            profileEditNetwork: STATUS_LOADING
        });
    }

    onCancelProfileChanges = () => {
        //go back to profile
        this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
    }

    onProfilePicUploadComplete = (errData, uploadedProfilePicData) => {
        if (errData) {
            this.setState({
                profileEditNetwork: STATUS_FAILURE,
                profileEditNetworkMessage: errData.error.message
            });
            return;
        }

        //success
        this.setState({
            uploadedProfilePicUrl: uploadedProfilePicData.url
        }, () => {
            const updatedUserInfo = {
                profilePicUrl: this.state.uploadedProfilePicUrl
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
                        profileNetworkThrottle: false
                    });
                }, 1000);
            });
        });
    };

    render() {

        //if we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.props.history.push(jeffskiRoutes.login);
        }

        //loading state
        if (this.state.profileFetchNetwork === STATUS_LOADING) {
            return (<AirplaneLoader />);
        }
        if (this.state.profileFetchNetworkMessage === profileGetFailMessage) {
            return (
                <div className="ProfileEditInfo">
                    <Container>
                        <Row className="show-grid">
                            <Col />
                            <Col xs={12} sm={8} md={4} >
                                <h2 className="User_header-title">Edit Profile</h2>
                            </Col>
                            <Col />
                        </Row>
                        <Row className="show-grid User_error-message">
                            <Col />
                            <Col xs={10} sm={8} md={4} >
                                <Alert bsStyle="danger">
                                    <strong>Oh No! </strong>{this.state.profileFetchNetworkMessage}
                                </Alert>
                            </Col>
                            <Col />
                        </Row>
                    </Container>
                </div>
            );
        }

        let picSrc = this.state.profilePicUrl;
        if (this.state.imagePreviewLoading) {
            picSrc = loadingImage;
        }
        if (this.state.newProfilePicUrl) {
            picSrc = this.state.newProfilePicUrl;
        }

        return (
            <Container className="User ProfileEditInfo">
                <Row className="show-grid">
                    <Col />
                    <Col xs={12} sm={8} md={4} >
                        <h2 className="User_header-title">Edit Profile Pic</h2>
                    </Col>
                    <Col />
                </Row>

                <form>
                    <Row className="show-grid">
                        <Col />
                        <Col xs={12} sm={8} md={4} >
                            <div className="ProfileEditInfo_profilepic">
                                <Image fluid src={picSrc} />
                            </div>
                        </Col>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Col xs="auto" >
                            <ImageForm
                                refreshProp={this.state.formRefreshProp}
                                imageSelectedCallback={(err, imgData, imgUrl) => {
                                    //prep state for uploading an image (network messages, status, etc.)
                                    if (err) {
                                        // image upload failure
                                        this.setState({
                                            newProfilePicUrl: null,
                                            newProfilePic: null,
                                            profileEditNetwork: STATUS_FAILURE,
                                            profileEditNetworkMessage: err.message,
                                            imagePreviewLoading: false
                                        });
                                    }
                                    else {
                                        // image load success!
                                        this.setState({
                                            profileEditNetwork: null,
                                            profileEditNetworkMessage: null,
                                            newProfilePicUrl: imgUrl,
                                            newProfilePic: imgData,
                                            imagePreviewLoading: false
                                        });
                                    }

                                }}
                                onImageLoading={() => {
                                    this.setState({
                                        imagePreviewLoading: true
                                    });
                                }}
                                showPreview={false}
                                formDisabled={this.isFormDisabled()}
                                shouldShowImageSize={false}
                            />
                        </Col>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Col sm={10} md={8} className="User_actions-section">
                            <span className="User_action-button" >
                                <Button
                                    disabled={this.isFormDisabled() || this.isFormInvalid() || this.state.profileNetworkThrottle}
                                    variant="primary"
                                    onClick={this.onSaveProfilePic}
                                >
                                    Save
                                    </Button>
                            </span>
                            <span className="User_action-button" >
                                <Button
                                    variant="secondary"
                                    disabled={this.isFormDisabled()}
                                    onClick={this.onCancelProfileChanges}
                                >
                                    Go To Profile
                                    </Button>
                            </span>
                        </Col>
                        <Col />
                    </Row>

                    {this.state.profileEditNetwork === STATUS_FAILURE &&
                        <Row className="show-grid User_error-message">
                            <Col />
                            <Col xs={10} sm={8} md={4} >
                                <Alert variant="danger">
                                    <Alert.Heading>Oh No!</Alert.Heading>
                                    <p>
                                        {this.state.profileEditNetworkMessage}
                                    </p>
                                </Alert>
                            </Col>
                            <Col />
                        </Row>
                    }

                    {this.state.profileEditNetwork === STATUS_SUCCESS &&
                        <Row className="show-grid User_error-message">
                            <Col />
                            <Col xs={10} sm={8} md={4} >
                                <Alert dismissible variant="success">
                                    <Alert.Heading>YAY!</Alert.Heading>
                                    <p>
                                        {this.state.profileEditNetworkMessage}
                                    </p>
                                </Alert>
                            </Col>
                            <Col />
                        </Row>
                    }

                    {this.state.newProfilePic && this.state.profileEditNetwork === STATUS_LOADING &&
                        <ResizeProfileImg fileToResizeAndUpload={this.state.newProfilePic}
                            userId={this.props.reduxBlogAuth.userInfo.id}
                            onPhotoFinished={this.onProfilePicUploadComplete}
                            resizeMaxHeight={600}
                            isUserProfilePic={true}
                        />
                    }
                </form>
            </Container>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(ProfileEditPic)));