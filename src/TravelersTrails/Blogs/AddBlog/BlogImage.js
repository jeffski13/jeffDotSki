import React from 'react';
import { Row, Col, Button, Alert, Image } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImageForm from '../../image-processing/ImageForm';
import ResizeProfileImg from '../../image-processing/ResizeProfileImg';
import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from '../../Network/consts';
import { uploadingImage, uploadImageSuccess, uploadImageFailure } from './actions';

class BlogImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogImageUrl: null,
            blogImage: null,
            uploadedBlogImageUrl: null,
            imagePreviewLoading: false,
            formRefreshProp: false //needed?
        };
    }

    isFormDisabled = () => {
        return this.props.blogCreation.image.network === STATUS_LOADING || this.props.blogCreation.network === STATUS_LOADING;
    }

    isFormInvalid = () => {
        return this.props.blogCreation.image.value !== null;
    }

    onBlogImageUploadComplete = (errData, uploadedProfilePicData) => {
        if (errData) {
            this.props.uploadImageFailure();
            return;
        }

        //success
        this.props.uploadImageSuccess(uploadedProfilePicData.url);
    };

    render() {
        let picSrc = null;
        if (this.state.blogImageUrl) {
            picSrc = this.state.blogImageUrl;
        }

        return (
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
                                    // image selected failure
                                    this.setState({
                                        blogImageUrl: null,
                                        blogImage: null,
                                        imagePreviewLoading: false
                                    });
                                }
                                else {
                                    // image selected success!
                                    this.setState({
                                        blogImageUrl: imgUrl,
                                        blogImage: imgData,
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

                {this.props.blogCreation.image.network === STATUS_FAILURE &&
                    <Row className="show-grid User_error-message">
                        <Col />
                        <Col xs={10} sm={8} md={4} >
                            <Alert variant="danger">
                                <Alert.Heading>Oh No!</Alert.Heading>
                                <p>There was an issue uploading your image.</p>
                                <p>Please try again later.</p>
                            </Alert>
                        </Col>
                        <Col />
                    </Row>
                }

                

                {this.props.blogCreation.image.value && this.props.blogCreation.image.network === STATUS_LOADING &&
                    <ResizeProfileImg fileToResizeAndUpload={this.props.blogCreation.image.value}
                        userId={this.props.reduxBlogAuth.userInfo.id}
                        onPhotoFinished={this.onBlogImageUploadComplete}
                        resizeMaxHeight={600}
                    />
                }
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ uploadingImage, uploadImageSuccess, uploadImageFailure }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogImage);